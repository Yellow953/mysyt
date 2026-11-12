#!/usr/bin/env python3
"""Synthesize simple cartoon SFX locally (free): whoosh, pop, sizzle, thud, clink, cough, rumble, boing.
Usage: make_sfx.py <out_dir>"""
import sys, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100
rng = np.random.default_rng(7)
def t(d): return np.linspace(0, d, int(SR * d), endpoint=False)
def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], btype="band"); return lfilter(b, a, x)
def lp(x, f):
    b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def norm(x, peak=0.9): return x / (np.abs(x).max() + 1e-9) * peak
def env(x, a=0.01, r=0.2):
    n = len(x); e = np.ones(n); na = int(a * SR); nr = int(r * n / n * SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return x * e
out = {}
# whoosh: noise swept band
d = 0.5; x = rng.normal(size=int(SR * d)); y = np.zeros_like(x)
for i, (lo, hi) in enumerate([(300, 900), (600, 1800), (1200, 3600), (800, 2400), (400, 1200)]):
    s = slice(i * len(x) // 5, (i + 1) * len(x) // 5); y[s] = bp(x, lo, hi)[s]
env_w = np.sin(np.pi * np.linspace(0, 1, len(y))) ** 1.5
out["whoosh"] = norm(y * env_w)
# pop
tt = t(0.18); out["pop"] = norm(np.sin(2 * np.pi * (900 - 3500 * tt) * tt) * np.exp(-tt * 30))
# sizzle
d = 1.0; x = bp(rng.normal(size=int(SR * d)), 3000, 9000) * (0.6 + 0.4 * rng.random(int(SR * d)))
out["sizzle"] = norm(env(x, 0.02, 0.6), 0.6)
# thud
tt = t(0.4); out["thud"] = norm(np.sin(2 * np.pi * (110 - 140 * tt) * tt) * np.exp(-tt * 12) + 0.3 * lp(rng.normal(size=len(tt)), 300) * np.exp(-tt * 25))
# clink
tt = t(0.5); out["clink"] = norm(sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, k in [(2400, 14), (3700, 18), (5200, 25)]))
# cough: two noisy bursts
d = 0.6; y = np.zeros(int(SR * d))
for c in (0.05, 0.3):
    n = int(0.16 * SR); i = int(c * SR)
    y[i:i + n] += bp(rng.normal(size=n), 400, 1800) * np.hanning(n)
out["cough"] = norm(y, 0.7)
# rumble
d = 2.5; x = lp(rng.normal(size=int(SR * d)), 90) * (1 + 0.5 * np.sin(2 * np.pi * 7 * t(d)))
out["rumble"] = norm(env(x, 0.4, 0.8), 0.7)
# boing
tt = t(0.5); out["boing"] = norm(np.sin(2 * np.pi * (300 + 120 * np.sin(2 * np.pi * 9 * tt)) * tt) * np.exp(-tt * 6))
for k, v in out.items():
    sf.write(f"{sys.argv[1]}/{k}.wav", v.astype(np.float32), SR); print(k, len(v) / SR)
