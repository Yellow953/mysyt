#!/usr/bin/env python3
"""Mix voice + music bed (ducked) + synthesized SFX for the seawater long-form, loudnorm to -14 LUFS.
Usage: .venv/bin/python scripts/long-form/mix_sealf.py   -> videos/long-form/seawater-desalination/audio/mix.wav
Event times come from remotion/src/sealfTimeline.json (same word times the visuals use)."""
import json, re, subprocess, io
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
SR = 44100
P = "/Users/yellow/Projects/MrYellowScarf/"
tl = json.load(open(P + "remotion/src/sealfTimeline.json")); S = tl["segs"]; N = len(S); TOTAL = tl["total"]
norm = lambda s: re.sub(r"[^a-z0-9%~]", "", s.lower())
def wd(r, key, occ=0):
    c = 0
    for w in S[r - 1]["words"]:
        if norm(w["text"]).startswith(norm(key)):
            if c == occ: return w["start"]
            c += 1
    raise KeyError((r, key))
S0 = lambda r: S[r - 1]["start"]; S1 = lambda r: S[r - 1]["end"]
BND = lambda i: 0 if i <= 0 else TOTAL if i >= N else (S[i - 1]["end"] + S[i]["start"]) / 2
ev = []
def a(t, n, v=0.6): ev.append((t, n, v))
for r in range(1, N): a(BND(r) - 0.22, "whoosh", 0.3)
a(0.3, "wave", .5); a(wd(1, "drink"), "sting", .7)
a(wd(2, "dented") - .3, "boing", .6); a(wd(2, "dented") + .2, "thud", .6); a(wd(2, "sip"), "slurp", .6); a(wd(2, "Big") - .15, "bwah", .7); a(wd(2, "Big") - .1, "splash", .5)
a(wd(3, "Seawater"), "boing", .6); a(wd(3, "blood"), "boing", .5); a(wd(3, "spit"), "cough", .7); a(wd(3, "slow"), "whoosh", .5); a(wd(3, "replay"), "whoosh", .5)
for i in range(6): a(wd(4, "concentrate") + i * .28, "tick", .5)
a(wd(4, "seawater") + .2, "thud", .8)
a(wd(5, "lose"), "stream", .5); a(wd(5, "take"), "pop", .5); a(wd(5, "Congratulations"), "hiss", .25); a(wd(5, "thirstier"), "wah", .6)
a(S0(6), "wave", .5)
t = S0(7)
while t < S1(7): a(t, "tick", .3); t += 1.0
a(S0(8) + .5, "tick", .4); a(S0(8) + 1.5, "tick", .4); a(wd(8, "small"), "wah", .6)
a(S0(9), "sting", .3)
for k in (.5, 2.5, 5): a(S0(11) + k, "flap", .5)
a(wd(12, "coin"), "clink", .7)
for i in range(6): a(wd(13, "jar") + .6 + i * .55, "drip", .5)
a(wd(13, "still"), "clink", .7); a(wd(13, "history"), "wah", .6)
a(S0(14), "chime", .4)
a(wd(15, "Two"), "ding", .6); a(wd(15, "tricks") - .1, "ding", .5)
a(wd(16, "boil"), "bubble", .6); a(wd(16, "catch"), "hiss", .45); a(wd(16, "salt"), "tinkle", .6); a(wd(16, "fuel"), "fire", .7)
a(wd(17, "Squeeze"), "pump", .5); a(wd(17, "water"), "pop", .4); a(wd(17, "blocks"), "tick", .5)
a(wd(18, "cup") - .4, "pop", .4); a(wd(18, "wins"), "clunk", .7); a(wd(18, "wins") + .05, "whoosh", .6); a(wd(18, "wins") + 1.1, "splash", .7); a(wd(18, "sputters"), "sputter", .7)
a(wd(19, "half"), "pop", .5)
a(S0(20), "hiss", .4); a(wd(20, "two-thirds"), "pop", .5)
a(wd(21, "99"), "chime", .6)
a(wd(22, "3"), "pop", .5); a(wd(22, "5"), "zap", .6); a(wd(22, "took") + .7, "clunk", .6)
t = S0(23)
while t < wd(23, "stalls"): a(t, "motor", .25); t += .5
a(wd(23, "stalls"), "clunk", .7); a(wd(23, "stalls") + .15, "whoosh", .6); a(wd(23, "stalls") + 1.2, "thud", .8)
a(S0(24) + 1.5, "wah", .4); a(wd(24, "power"), "zap", .5)
a(S0(25), "wave", .4)
a(S0(26), "sting", .5); a(S0(26) + .3, "rumble", .4)
a(wd(27, "offline"), "clunk", .6)
a(wd(28, "coughs"), "cough", .7); a(wd(28, "gurgle"), "gurgle", .6)
a(S0(29), "rumble", .5); a(S0(29) + .2, "sting", .5)
a(S0(30) + .5, "motor", .3); a(S0(30) + 1.5, "motor", .3)
a(S0(31) + .6, "whoosh", .4); a(S0(31) + 2.2, "splash", .5)
a(wd(32, "Yes"), "chime", .6)
a(S0(33), "fire", .4)
a(wd(34, "drip") + .5, "drip", .6); a(wd(34, "forehead") + .1, "drip", .6); a(wd(34, "forehead") + .35, "splash", .4); a(wd(34, "salt"), "tinkle", .6)
a(S0(35), "chime", .25)
a(wd(36, "Best"), "ding", .6); a(wd(36, "Free"), "cheer", .5)
a(S0(37), "wave", .4); a(wd(37, "Subscribe"), "cheer", .45); a(S1(37) + .2, "sting", .5)

def load(path, mono=True):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ar", str(SR), "-ac", "1" if mono else "2", "-f", "wav", "-"], capture_output=True, check=True).stdout
    return sf.read(io.BytesIO(raw), dtype="float32")[0]
n = int((TOTAL + 0.5) * SR)
voice = load(P + "videos/long-form/seawater-desalination/audio/voice.wav")
vm = np.zeros(n, np.float32); vm[:len(voice)] = voice[:n]
music = load(P + "assets/music/Mediterranean View - Everet Almond.mp3")
reps = int(np.ceil(n / len(music))) + 1
music = np.concatenate([music] * reps)[:n]
tt = np.arange(n) / SR
duck = np.ones(n, np.float32) * 1.0
for s in S:
    duck[int((s["start"] - .15) * SR):int((s["end"] + .25) * SR)] = 0.42
k = int(0.25 * SR); duck = np.convolve(duck, np.ones(k) / k, mode="same")
fade = np.minimum(1, tt / 1.5) * np.minimum(1, np.maximum(0, (TOTAL + 0.3 - tt)) / 2.5)
bed = music * duck * fade * 0.2 * 1.9  # 0.2 nominal bed (bed under speech ends ~0.08)
sfx = np.zeros(n, np.float32)
for t0, nm, v in ev:
    x, _ = sf.read(P + f"remotion/public/sealf/{nm}.wav", dtype="float32")
    i = max(0, int(t0 * SR)); seg = x[:max(0, n - i)]
    sfx[i:i + len(seg)] += seg * v * 0.5
mix = vm * 1.0 + bed + sfx
mix = np.clip(mix, -1, 1)
sf.write(P + "videos/long-form/seawater-desalination/audio/mix_raw.wav", mix, SR)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", P + "videos/long-form/seawater-desalination/audio/mix_raw.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", P + "videos/long-form/seawater-desalination/audio/mix.wav"], check=True)
print("events", len(ev), "total", TOTAL)
