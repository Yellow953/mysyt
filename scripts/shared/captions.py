"""Word timings, scene timing and caption chunks from a narration wav (local, free).

Usage: .venv/bin/python scripts/shared/captions.py videos/short-form/<slug>

Reads  videos/short-form/<slug>/scenes.json, audio/voice.wav, audio/narration.txt
Writes audio/words.json (whisper words), audio/timing.json (scene start/end),
       audio/captions.json (2-3 word chunks with per-word times)
The script text is the source of truth for what is shown; whisper only supplies the clock.
"""
import difflib
import json
import re
import sys
from pathlib import Path

import mlx_whisper

MODEL = "mlx-community/whisper-small-mlx"
MIN_HOLD = 0.7  # a caption chunk stays up at least this long (readability)
TAIL = 0.4  # seconds of silence kept after the last word (the loop breath)


def toks(s):
    return re.findall(r"[a-z0-9']+", s.lower())


def main(vdir):
    vdir = Path(vdir)
    scenes = json.load(open(vdir / "scenes.json"))["scenes"]
    narration = (vdir / "audio/narration.txt").read_text().strip()
    wav = str(vdir / "audio/voice.wav")

    seg_file = vdir / "audio/segments.json"
    if seg_file.exists():  # director mode: phrase times are exact; spread words by length inside each phrase
        words = []
        for seg in json.load(open(seg_file)):
            ws = seg["text"].split()
            wts = [len(w) + 2 for w in ws]
            t, span = seg["start"], seg["end"] - seg["start"]
            for w, wt_ in zip(ws, wts):
                d = span * wt_ / sum(wts)
                words.append({"word": w, "start": round(t, 3), "end": round(t + d, 3)})
                t += d
    else:
        res = mlx_whisper.transcribe(wav, path_or_hf_repo=MODEL, word_timestamps=True,
                                     initial_prompt=narration, language="en", condition_on_previous_text=False)
        words = [w for seg in res["segments"] for w in seg["words"]]
    json.dump(words, open(vdir / "audio/words.json", "w"), indent=1)
    audio_end = words[-1]["end"]

    # whisper tokens, each with its word's time span
    wt, wtime = [], []
    for w in words:
        for t in toks(w["word"]):
            wt.append(t)
            wtime.append((w["start"], w["end"]))

    # script tokens, remembering scene and caption-word membership
    sw = []  # (display word, scene id)
    for sc in scenes:
        for w in sc["text"].split():
            sw.append((w, sc["id"]))
    st, owner = [], []
    for i, (w, _) in enumerate(sw):
        for t in toks(w):
            st.append(t)
            owner.append(i)

    # align script tokens to whisper tokens
    start = [None] * len(st)
    end = [None] * len(st)
    m = difflib.SequenceMatcher(None, st, wt, autojunk=False)
    for a, b, n in m.get_matching_blocks():
        for k in range(n):
            start[a + k], end[a + k] = wtime[b + k]
    # interpolate unmatched tokens between known neighbours
    known = [i for i, v in enumerate(start) if v is not None]
    if not known:
        raise SystemExit("no tokens aligned")
    for i in range(len(st)):
        if start[i] is not None:
            continue
        prev = max([k for k in known if k < i], default=None)
        nxt = min([k for k in known if k > i], default=None)
        t0 = end[prev] if prev is not None else 0.0
        t1 = start[nxt] if nxt is not None else audio_end
        gap = [j for j in range(len(st)) if (prev is None or j > prev) and (nxt is None or j < nxt)]
        step = (t1 - t0) / (len(gap) + 1)
        idx = gap.index(i)
        start[i] = t0 + step * idx
        end[i] = t0 + step * (idx + 1)
    print(f"aligned {len(known)}/{len(st)} script tokens to whisper")

    # per display word: span from its first to last token
    wspan = {}
    for ti, wi in enumerate(owner):
        s, e = wspan.get(wi, (start[ti], end[ti]))
        wspan[wi] = (min(s, start[ti]), max(e, end[ti]))
    wlist = [(sw[i][0], sw[i][1], *wspan[i]) for i in range(len(sw)) if i in wspan]

    # scene timing: starts at its first word, ends where the next begins
    first = {}
    for text, sid, s, e in wlist:
        first.setdefault(sid, s)
    ids = [sc["id"] for sc in scenes]
    timing = []
    for k, sid in enumerate(ids):
        s = 0.0 if k == 0 else first[sid]
        e = first[ids[k + 1]] if k + 1 < len(ids) else audio_end + TAIL
        timing.append({"id": sid, "start": round(s, 3), "end": round(e, 3)})
    json.dump(timing, open(vdir / "audio/timing.json", "w"), indent=1)

    # caption chunks: 2-3 words, break after sentence/clause punctuation, per scene
    chunks, cur, cur_scene = [], [], None
    def flush():
        nonlocal cur
        if cur:
            chunks.append({"start": cur[0]["start"], "end": cur[-1]["end"], "words": cur})
            cur = []
    for text, sid, s, e in wlist:
        if cur and (sid != cur_scene or len(cur) >= 3 or sum(len(w["text"]) for w in cur) + len(text) > 20):
            flush()
        cur_scene = sid
        cur.append({"text": text.upper(), "start": round(s, 3), "end": round(e, 3)})
        if re.search(r"[.?!:,]$", text):
            flush()
    flush()
    for i, c in enumerate(chunks):
        nxt = chunks[i + 1]["start"] if i + 1 < len(chunks) else c["end"] + 1
        c["end"] = round(min(max(c["end"], c["start"] + MIN_HOLD), nxt), 3)
    json.dump(chunks, open(vdir / "audio/captions.json", "w"), indent=1)
    print(f"{len(timing)} scenes, {len(chunks)} caption chunks, audio {audio_end:.1f}s")


if __name__ == "__main__":
    main(sys.argv[1])
