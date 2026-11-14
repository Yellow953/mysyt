#!/usr/bin/env python3
"""A few new synth SFX for the mnylf long-form (buzz, honk, hum). Usage: make_sfx_mnylf.py <out_dir>. The rest are reused from monlf."""
import sys, numpy as np, soundfile as sf
SR = 44100
t = lambda d: np.linspace(0, d, int(SR * d), endpoint=False)
out = sys.argv[1]
x = t(0.9); buzz = (np.sign(np.sin(2 * np.pi * 110 * x)) * 0.25 + np.sin(2 * np.pi * 220 * x) * 0.15) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 14 * x))) * np.exp(-x * 2.2)
sf.write(out + "/buzz.wav", buzz.astype(np.float32), SR)
x = t(0.7); honk = (np.sin(2 * np.pi * 220 * x) + 0.6 * np.sin(2 * np.pi * 277 * x) + 0.3 * np.sign(np.sin(2 * np.pi * 220 * x))) * np.minimum(1, x * 40) * np.exp(-np.maximum(0, x - 0.4) * 12) * 0.3
sf.write(out + "/honk.wav", honk.astype(np.float32), SR)
x = t(2.5); hum = (np.sin(2 * np.pi * 110 * x) + 0.5 * np.sin(2 * np.pi * 165 * x)) * np.sin(np.pi * x / 2.5) * 0.2
sf.write(out + "/hum.wav", hum.astype(np.float32), SR)
