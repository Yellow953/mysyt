"""Local text-to-speech with Kokoro (runs on the Mac, no credits).

Usage:
  .venv/bin/python scripts/short-form/tts.py --text "Hello" --out out.wav
  .venv/bin/python scripts/short-form/tts.py --file script.txt --pause 0.4 --out out.wav

Each line (beat) of the text file is synthesized as one breath and joined with a short silence,
so shots and captions get room to breathe. (Per-sentence synthesis made the voice slow and
added ~15 s, so pauses go between beats only.) Voice and speed stay fixed (am_puck, 1.05).
Use --pause 0 for one continuous read, then scripts/short-form/pace.py to insert pauses between beats.
"""
import argparse

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SAMPLE_RATE = 24000


def perform(segments, voice, out):
    """Director mode: segments = [{"text", "speed", "pause"}]; each phrase gets its own speed
    (slower = deadpan/dramatic, faster = excited) and a silence after it (longer after questions
    and punchlines). Kokoro has no emotion control, so pace + pauses carry the tone."""
    pipeline = KPipeline(lang_code=voice[0], repo_id="hexgrad/Kokoro-82M")
    parts, report, timed, t = [], [], [], 0.0
    for seg in segments:
        a = [x for _, _, x in pipeline(seg["text"], voice=voice, speed=seg.get("speed", 1.0))]
        sp = np.concatenate(a)
        pz = seg.get("pause", 0.4)
        parts += [sp, np.zeros(int(SAMPLE_RATE * pz), dtype=np.float32)]
        dur = len(sp) / SAMPLE_RATE
        timed.append({"text": seg["text"], "start": round(t, 3), "end": round(t + dur, 3)})
        t += dur + pz
        report.append((dur, pz, seg["text"]))
    audio = np.concatenate(parts[:-1])  # no trailing pause
    sf.write(out, audio, SAMPLE_RATE)
    import json, os
    json.dump(timed, open(os.path.join(os.path.dirname(out), "segments.json"), "w"), indent=1)  # exact phrase times for captions.py
    for d, pz, t in report:
        print(f"{d:4.1f}s +{pz:.2f} | {t[:60]}")
    print(f"wrote {out}: {len(audio) / SAMPLE_RATE:.1f}s")


def synthesize(text, voice, speed, out, pause):
    # lang_code: 'a' = American English, 'b' = British English (voice prefix tells us which)
    pipeline = KPipeline(lang_code=voice[0], repo_id="hexgrad/Kokoro-82M")
    sentences = [s.strip() for s in text.splitlines() if s.strip()]
    if pause == 0:  # one continuous pass: Kokoro reads long passages faster and more naturally
        sentences = [" ".join(sentences)]
    parts = []
    for i, sentence in enumerate(sentences):
        parts += [audio for _, _, audio in pipeline(sentence, voice=voice, speed=speed)]
        if i < len(sentences) - 1:
            parts.append(np.zeros(int(SAMPLE_RATE * pause), dtype=np.float32))
    sf.write(out, np.concatenate(parts), SAMPLE_RATE)
    print(f"wrote {out} ({len(sentences)} beats, {pause}s pauses)")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    src = p.add_mutually_exclusive_group(required=False)
    src.add_argument("--text")
    src.add_argument("--file")
    p.add_argument("--voice", default="am_puck")
    p.add_argument("--speed", type=float, default=1.05)
    p.add_argument("--pause", type=float, default=0.4, help="silence between sentences, seconds")
    p.add_argument("--out", required=True)
    p.add_argument("--perf", help="performance.json (director mode); overrides --text/--file")
    a = p.parse_args()
    if a.perf:
        import json
        perform(json.load(open(a.perf)), a.voice, a.out)
        raise SystemExit(0)
    text = a.text if a.text else open(a.file, encoding="utf-8").read()
    synthesize(text, a.voice, a.speed, a.out, a.pause)
