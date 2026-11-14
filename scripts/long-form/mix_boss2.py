#!/usr/bin/env python3
"""Mix voice + ONE looped library track (Mirror Mirror, ducked ~0.2 under voice) + SFX for boss2, loudnorm -14 LUFS.
Usage: .venv/bin/python scripts/long-form/mix_boss2.py -> videos/long-form/pov-boss-laughed-idea/audio/mix.wav"""
import json, re, subprocess, io
import numpy as np, soundfile as sf
SR = 44100
P = "/Users/yellow/Projects/MrYellowScarf/"
V = P + "videos/long-form/pov-boss-laughed-idea/"
tl = json.load(open(P + "remotion/src/boss2Timeline.json")); S = tl["segs"]; N = len(S); TOTAL = tl["total"]
norm = lambda s: re.sub(r"[^a-z0-9'%~]", "", s.lower())
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
import sys
sys.path.insert(0, P + "scripts/long-form")
import boss2_data as D
IMG = [r[2] for r in D.ROWS]
def a(t, n, v=0.6): ev.append((t, n, v))
def W(r, k, o=0):
    try: return wd(r, k, o)
    except KeyError: print("missing word", r, k); return S0(r) + 0.5
# soft whoosh only where the picture changes (row boundary with a new image); no flash
for r in range(1, N):
    if IMG[r - 1] != IMG[r]: a(BND(r) - 0.1, "whoosh", 0.16)
# a few story beats (volumes low, voice stays on top)
a(W(4, "laughing"), "bwah", .35); a(W(5, "smiling"), "pop", .3); a(W(7, "changed"), "sting", .4)
a(W(8, "begging"), "rumble", .4); a(W(8, "laughing"), "thud", .5)
a(W(16, "joke"), "bwah", .35); a(W(20, "drops"), "thud", .5); a(W(27, "presentation"), "sting", .4)
a(W(28, "quiet"), "rumble", .35); a(W(29, "rings"), "bell", .4); a(W(34, "onto"), "ding", .4)
a(W(38, "Silence"), "thud", .45); a(W(42, "good"), "chime", .4); a(W(45, "valuable"), "chime", .45)
a(W(46, "walked"), "pop", .4)
ev = [e for e in ev if e[2] > 0]

def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ar", str(SR), "-ac", "1", "-f", "wav", "-"], capture_output=True, check=True).stdout
    return sf.read(io.BytesIO(raw), dtype="float32")[0]
n = int((TOTAL + 0.5) * SR)
voice = load(V + "audio/voice.wav")
vm = np.zeros(n, np.float32); vm[:len(voice)] = voice[:n]
def looped(x, length, xf=int(1.5 * SR)):
    x = x[: len(x) - int(0.3 * SR)]
    out = np.zeros(length + len(x), np.float32); pos = 0; ramp = np.linspace(0, 1, xf, dtype=np.float32)
    while pos < length:
        seg = x.copy()
        if pos > 0: seg[:xf] *= ramp
        seg[-xf:] *= ramp[::-1]
        out[pos:pos + len(seg)] += seg; pos += len(seg) - xf
    return out[:length]
TRACK = sys.argv[1] if len(sys.argv) > 1 else "Mirror Mirror - Anno Domini Beats.mp3"
OUT = sys.argv[2] if len(sys.argv) > 2 else "mix"
track = load(P + "assets/music/" + TRACK)
music = looped(track, n)
music /= (np.sqrt(np.mean(music ** 2)) + 1e-9) / 0.12
tt = np.arange(n) / SR
duck = np.ones(n, np.float32)
for s in S: duck[int((s["start"] - .15) * SR):int((s["end"] + .25) * SR)] = 0.42
k = int(0.25 * SR); duck = np.convolve(duck, np.ones(k) / k, mode="same")
fade = np.minimum(1, tt / 1.0) * np.minimum(1, np.maximum(0, (TOTAL + 0.3 - tt)) / 2.5)
bed = music * duck * fade * 0.2 * 1.9
sfx = np.zeros(n, np.float32)
for t0, nm, v in ev:
    x, sr = sf.read(P + f"remotion/public/mnylf/{nm}.wav", dtype="float32")
    if x.ndim > 1: x = x.mean(1)
    i = max(0, int(t0 * SR)); seg = x[:max(0, n - i)]
    sfx[i:i + len(seg)] += seg * v * 0.5
mix = np.clip(vm + bed + sfx, -1, 1)
sf.write(V + f"audio/{OUT}_raw.wav", mix, SR)
m = subprocess.run(["ffmpeg", "-hide_banner", "-i", V + f"audio/{OUT}_raw.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
af = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,volume=0.55dB"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", V + f"audio/{OUT}_raw.wav", "-af", af, "-ar", "48000", "-ac", "2", V + f"audio/{OUT}.wav"], check=True)
print("events", len(ev), "total", TOTAL)
