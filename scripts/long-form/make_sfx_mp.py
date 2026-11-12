#!/usr/bin/env python3
"""Extra local SFX for medieval-privacy (free): pluck, knock, saw, creak, fizz, hush, pulse, ting, tick, bell, wind, wah, slam, crack, snore, murmur, sigh.
Usage: make_sfx_mp.py <out_dir>   (run scripts/short-form/make_sfx.py first for whoosh/pop/thud/cough/boing)"""
import sys, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100
rng = np.random.default_rng(11)
def t(d): return np.linspace(0, d, int(SR * d), endpoint=False)
def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], btype="band"); return lfilter(b, a, x)
def lp(x, f):
    b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def norm(x, peak=0.8): return x / (np.abs(x).max() + 1e-9) * peak
def fade(x, a=0.02, r=0.1):
    n = len(x); na = int(a * SR); nr = int(r * SR); e = np.ones(n)
    e[:na] = np.linspace(0, 1, na); e[-nr:] = np.linspace(1, 0, nr); return x * e
out = {}
# pluck (pizzicato): decaying harmonic string
tt = t(0.6); f = 330
out["pluck"] = norm(sum(np.sin(2 * np.pi * f * k * tt) / k * np.exp(-tt * (7 + 4 * k)) for k in (1, 2, 3, 4)))
# knock: two wood thumps
y = np.zeros(int(SR * 0.5))
for c in (0.02, 0.2):
    n = int(0.12 * SR); i = int(c * SR); tk = t(0.12)
    y[i:i + n] += (np.sin(2 * np.pi * 180 * tk) * np.exp(-tk * 40) + 0.4 * bp(rng.normal(size=n), 600, 2500) * np.exp(-tk * 60))
out["knock"] = norm(y)
# saw: rasp strokes
d = 1.6; x = bp(rng.normal(size=int(SR * d)), 1500, 6000); tt = t(d)
out["saw"] = norm(fade(x * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 2.6 * tt))), 0.05, 0.2), 0.6)
# creak
d = 1.0; tt = t(d); fr = 160 + 90 * np.sin(2 * np.pi * 3 * tt) + 60 * tt
ph = 2 * np.pi * np.cumsum(fr) / SR
out["creak"] = norm(fade(lp(np.sign(np.sin(ph)) * 0.6 + 0.4 * rng.normal(size=len(tt)), 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * tt)), 0.1, 0.4), 0.5)
# fizz (lantern going out)
d = 1.1; x = bp(rng.normal(size=int(SR * d)), 2500, 8000) * np.exp(-t(d) * 2.5)
out["fizz"] = norm(fade(x, 0.02, 0.3), 0.5)
# hush
d = 0.9; x = bp(rng.normal(size=int(SR * d)), 2000, 7000) * np.sin(np.pi * np.linspace(0, 1, int(SR * d))) ** 1.5
out["hush"] = norm(x, 0.5)
# pulse (heartbeat)
y = np.zeros(int(SR * 1.6))
for c in (0.05, 0.28, 0.85, 1.08):
    n = int(0.18 * SR); i = int(c * SR); tk = t(0.18)
    y[i:i + n] += np.sin(2 * np.pi * 62 * tk) * np.exp(-tk * 22)
out["pulse"] = norm(y, 0.7)
# ting (wink)
tt = t(0.7); out["ting"] = norm(sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, k in [(2093, 6), (3136, 9), (4186, 14)]), 0.6)
# tick
y = np.zeros(int(SR * 0.9))
for c in (0.0, 0.5):
    n = int(0.03 * SR); i = int(c * SR); y[i:i + n] += bp(rng.normal(size=n), 1500, 5000) * np.exp(-t(0.03) * 120)
out["tick"] = norm(y, 0.6)
# bell
tt = t(1.8); out["bell"] = norm(sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, k in [(392, 1.6), (784, 2.4), (1180, 3.2), (1570, 4)]), 0.6)
# wind
d = 2.8; x = lp(rng.normal(size=int(SR * d)), 700) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.6 * t(d)))
out["wind"] = norm(fade(x, 0.5, 0.8), 0.5)
# sad trombone wah
tt = t(1.4); fr = 300 - 90 * np.clip(tt / 1.4, 0, 1) * (tt > 0.45) - 25 * np.sin(2 * np.pi * 6 * tt) * (tt > 1.0)
ph = 2 * np.pi * np.cumsum(fr) / SR
out["wah"] = norm(fade(lp(np.sign(np.sin(ph)) * 0.5 + np.sin(ph), 1100) * (0.7 + 0.3 * (tt < 1.0)), 0.04, 0.15), 0.45)
# slam
tt = t(0.5); out["slam"] = norm(np.sin(2 * np.pi * (90 - 70 * tt) * tt) * np.exp(-tt * 9) + 0.8 * bp(rng.normal(size=len(tt)), 300, 3000) * np.exp(-tt * 28), 0.9)
# crack
tt = t(0.25); out["crack"] = norm(bp(rng.normal(size=len(tt)), 800, 5000) * np.exp(-tt * 35) + np.sin(2 * np.pi * 420 * tt) * np.exp(-tt * 40), 0.8)
# snore
d = 2.4; tt = t(d); x = lp(rng.normal(size=len(tt)), 400) * (np.sin(2 * np.pi * 0.45 * tt) > 0) * np.abs(np.sin(2 * np.pi * 0.45 * tt)) ** 0.7
out["snore"] = norm(fade(x * (0.7 + 0.3 * np.sin(2 * np.pi * 28 * tt)), 0.1, 0.4), 0.45)
# murmur (crowd)
d = 2.5; tt = t(d); x = bp(rng.normal(size=len(tt)), 250, 1600) * (0.6 + 0.4 * np.sin(2 * np.pi * 3.1 * tt) * np.sin(2 * np.pi * 1.7 * tt))
out["murmur"] = norm(fade(x, 0.3, 0.6), 0.4)
# sigh
d = 1.2; tt = t(d); x = bp(rng.normal(size=len(tt)), 400, 2500) * np.sin(np.pi * tt / d) ** 2
out["sigh"] = norm(x, 0.4)
for k, v in out.items():
    sf.write(f"{sys.argv[1]}/{k}.wav", v.astype(np.float32), SR)
print(sorted(out))
