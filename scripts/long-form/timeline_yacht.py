#!/usr/bin/env python3
"""Word-timed timeline for the boss long-form (boss2): remotion/src/yachtTimeline.json.
Usage: .venv/bin/python scripts/long-form/timeline_mnylf.py
Reads audio/segments.json + audio/voice.wav, runs whisper word timestamps on each phrase slice,
aligns the script words (performance text = caption source of truth) to whisper words, interpolates the rest."""
import difflib, json, re, io
import numpy as np, soundfile as sf, mlx_whisper

P = "/Users/yellow/Projects/MrYellowScarf/"
V = P + "videos/long-form/pov-yacht-crush/audio/"
MODEL = "mlx-community/whisper-small-mlx"
segs = json.load(open(V + "segments.json"))
audio, sr = sf.read(V + "voice.wav", dtype="float32")
# ROOT CAUSE of the v3 caption lag (found 2026-11-14): mlx_whisper assumes a numpy array is 16 kHz; voice.wav is 24 kHz, so every
# whisper time was x1.5 too late. Resample to 16 kHz first (the OVERRUN guard below stays as a safety net).
if sr != 16000:
    from scipy.signal import resample_poly
    from math import gcd
    g = gcd(16000, sr); audio = resample_poly(audio, 16000 // g, sr // g).astype("float32"); sr = 16000
tok = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())
NUMW = {"0": "zero", "000": "zero"}
out = []
for s in segs:
    a = audio[int(s["start"] * sr):int(s["end"] * sr)]
    res = mlx_whisper.transcribe(a, path_or_hf_repo=MODEL, word_timestamps=True, language="en",
                                 initial_prompt=s["text"], condition_on_previous_text=False)
    ww = [w for g in res["segments"] for w in g["words"]]
    ht = [tok(w["word"]) for w in ww]
    sw = s["text"].split()
    st = [tok(w) for w in sw]
    t0 = [None] * len(sw); t1 = [None] * len(sw)
    for i, j, n in difflib.SequenceMatcher(None, st, ht, autojunk=False).get_matching_blocks():
        for k in range(n):
            t0[i + k] = s["start"] + ww[j + k]["start"]; t1[i + k] = s["start"] + ww[j + k]["end"]
    # interpolate gaps by word length
    i = 0
    while i < len(sw):
        if t0[i] is not None:
            i += 1; continue
        j = i
        while j < len(sw) and t0[j] is None: j += 1
        a0 = t1[i - 1] if i > 0 else s["start"]
        b0 = t0[j] if j < len(sw) else s["end"]
        L = [len(w) + 2 for w in sw[i:j]]; tot = sum(L); c = a0
        for k, l in zip(range(i, j), L):
            d = (b0 - a0) * l / tot; t0[k] = c; t1[k] = c + d; c += d
        i = j
    words = []
    for k, w in enumerate(sw):
        st_ = max(t0[k], words[-1]["end"] if words else s["start"])
        words.append({"text": w, "start": round(st_, 3), "end": round(max(t1[k], st_ + 0.05), 3)})
    # GUARD (2026-11-14): whisper on a short slice can return word times PAST the slice end (v3 money video: row 2 voice ends 18.6 s,
    # captions ran to 23.2 s -> captions lagged the voice). Squeeze every word back inside [segment start, segment end].
    last = words[-1]["end"]
    if last > s["end"] + 0.05:
        k = (s["end"] - s["start"]) / (last - s["start"])
        print(f"  OVERRUN row {len(out)+1}: words end {last:.2f} > segment end {s['end']:.2f}; squeezing x{k:.2f}")
        for w in words:
            w["start"] = round(s["start"] + (w["start"] - s["start"]) * k, 3)
            w["end"] = round(s["start"] + (w["end"] - s["start"]) * k, 3)
    out.append({"start": s["start"], "end": s["end"], "text": s["text"], "words": words})
    print(f"{len(out):02d} matched {sum(x is not None for x in t0)}/{len(sw)}")
total = round(segs[-1]["end"] + 2.2, 3)
json.dump({"total": total, "segs": out}, open(P + "remotion/src/yachtTimeline.json", "w"))
print("total", total)
