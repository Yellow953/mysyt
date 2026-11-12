"""Build the narration from per-phrase clips (expressive voice, one clip per phrase).

Usage: .venv/bin/python scripts/shared/build_voice.py videos/short-form/<slug>

Reads  audio/clips/NN.mp3  (NN = 01..) and audio/performance.json (text + pause after each phrase)
Writes audio/voice.wav (clips trimmed of edge silence, joined with the planned pauses) and
       audio/segments.json (exact start/end of every phrase; scripts/shared/captions.py uses it for perfect caption sync)
"""
import io
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 24000
MARGIN = int(0.04 * SR)   # keep 40 ms around the speech
THRESH = 0.012            # amplitude treated as silence at the clip edges


def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-ar", str(SR), "-ac", "1", "-f", "wav", "-"],
                         capture_output=True, check=True).stdout
    a, _ = sf.read(io.BytesIO(raw), dtype="float32")
    idx = np.where(np.abs(a) > THRESH)[0]
    if len(idx) == 0:
        return a
    return a[max(idx[0] - MARGIN, 0): idx[-1] + MARGIN]


def main(vdir):
    vdir = Path(vdir)
    perf = json.load(open(vdir / "audio/performance.json"))
    parts, timed, t = [], [], 0.0
    for i, seg in enumerate(perf, 1):
        a = load(vdir / "audio/clips" / seg.get("clip", f"{i:02d}.mp3"))
        pz = seg.get("pause", 0.4) if i < len(perf) else 0.0
        dur = len(a) / SR
        parts += [a, np.zeros(int(SR * pz), dtype=np.float32)]
        timed.append({"text": seg["text"], "start": round(t, 3), "end": round(t + dur, 3)})
        t += dur + pz
        print(f"{i:02d} {dur:4.1f}s +{pz:.2f} | {seg['text'][:60]}")
    audio = np.concatenate(parts)
    sf.write(str(vdir / "audio/voice.wav"), audio, SR)
    json.dump(timed, open(vdir / "audio/segments.json", "w"), indent=1)
    print(f"wrote voice.wav {len(audio) / SR:.1f}s")


if __name__ == "__main__":
    main(sys.argv[1])
