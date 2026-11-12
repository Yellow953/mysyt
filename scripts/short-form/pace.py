"""Insert short pauses between the beats (lines) of narration.txt into a continuous voice read.

Usage: .venv/bin/python scripts/short-form/pace.py videos/short-form/<slug> [pause_seconds=0.4]
Reads  audio/voice_raw.wav (made with: tts.py --pause 0) and audio/narration.txt (one beat per line)
Writes audio/voice.wav with silence inserted at each beat boundary (cut in the gap between words).
Keeps Kokoro's fast, natural flow; plain per-line synthesis was ~10 s slower.
"""
import difflib
import re
import sys
from pathlib import Path

import mlx_whisper
import numpy as np
import soundfile as sf

MODEL = "mlx-community/whisper-small-mlx"


def toks(s):
    return re.findall(r"[a-z0-9']+", s.lower())


def main(vdir, pause=0.4):
    vdir = Path(vdir)
    beats = [b for b in (vdir / "audio/narration.txt").read_text().splitlines() if b.strip()]
    audio, sr = sf.read(str(vdir / "audio/voice_raw.wav"))
    res = mlx_whisper.transcribe(str(vdir / "audio/voice_raw.wav"), path_or_hf_repo=MODEL, word_timestamps=True,
                                 initial_prompt=" ".join(beats), language="en", condition_on_previous_text=False)
    wt, wtime = [], []
    for seg in res["segments"]:
        for w in seg["words"]:
            for t in toks(w["word"]):
                wt.append(t)
                wtime.append((w["start"], w["end"]))
    st, last_idx, first_idx = [], [], []
    for b in beats:
        first_idx.append(len(st))
        st += toks(b)
        last_idx.append(len(st) - 1)
    match = {}
    for a, b, n in difflib.SequenceMatcher(None, st, wt, autojunk=False).get_matching_blocks():
        for k in range(n):
            match[a + k] = b + k

    def near(i, step):  # nearest matched script token from i going in direction step
        while 0 <= i < len(st) and i not in match:
            i += step
        return match.get(i)

    cuts = []
    for k in range(len(beats) - 1):
        a = near(last_idx[k], -1)
        b = near(first_idx[k + 1], +1)
        if a is None or b is None:
            raise SystemExit(f"could not locate boundary after beat {k + 1}")
        cuts.append(int(((wtime[a][1] + wtime[b][0]) / 2) * sr))
    out, prev = [], 0
    for c in cuts:
        out += [audio[prev:c], np.zeros(int(sr * pause), dtype=audio.dtype)]
        prev = c
    out.append(audio[prev:])
    sf.write(str(vdir / "audio/voice.wav"), np.concatenate(out), sr)
    print(f"wrote voice.wav: {len(audio) / sr:.1f}s + {len(cuts)} x {pause}s pauses = {(len(audio) / sr) + len(cuts) * pause:.1f}s")


if __name__ == "__main__":
    main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 0.4)
