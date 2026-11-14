#!/usr/bin/env python3
"""Mix voice + ONE looped library track (The Grey Room, ducked ~0.2 under voice) + SFX for mnylf, loudnorm -14 LUFS.
Usage: .venv/bin/python scripts/long-form/mix_mnylf.py -> videos/long-form/what-if-money-disappeared/audio/mix.wav"""
import json, re, subprocess, io
import numpy as np, soundfile as sf
SR = 44100
P = "/Users/yellow/Projects/MrYellowScarf/"
V = P + "videos/long-form/what-if-money-disappeared/"
tl = json.load(open(P + "remotion/src/mnylfTimeline.json")); S = tl["segs"]; N = len(S); TOTAL = tl["total"]
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
def a(t, n, v=0.6): ev.append((t, n, v))
def W(r, k, o=0):
    try: return wd(r, k, o)
    except KeyError: print("missing word", r, k); return S0(r) + 0.5
for r in range(1, N): a(BND(r) - 0.22, "whoosh", 0.22)
# HOOK (rows 1-5): clock tick every second + heartbeat pulse every 1.15 s, boom + silence at the smash cut
hook_end = S1(5) - 1.05
t = 0.4
while t < hook_end: a(t, "tick2", 0.35); t += 1.0
t = 0.2
while t < hook_end: a(t, "heart", 0.55); t += 1.15
a(0.3, "hum", .3); a(W(1, "disappeared"), "sting", .45)
a(W(2, "Zero"), "ding", .4); a(W(2, "Useless"), "bwah", .4); a(W(2, "Gone"), "crackle", .6); a(W(2, "Gone") + .1, "thud", .5)
a(W(3, "millionaire"), "pop", .5); a(W(3, "billionaire"), "pop", .5); a(W(3, "government"), "pop", .5); a(W(3, "absolutely"), "thud", .5)
a(W(4, "food"), "pop", .4); a(W(4, "houses"), "pop", .4); a(W(4, "cars"), "pop", .4); a(W(4, "electricity"), "ping", .5)
a(W(5, "collapse"), "boing", .4); a(W(5, "Would"), "pop", .5); a(S1(5) - 1.05 + 0.35, "boom2", .9)
a(W(6, "check"), "tap", .4); a(W(6, "banking"), "bwah", .4)
a(W(7, "Every"), "pop", .5); a(W(7, "Money"), "wah", .4)
a(W(8, "refuses"), "bwah", .5); a(W(9, "charge"), "pop", .5)
a(W(10, "phone"), "pop", .5); a(W(10, "watch"), "clunk", .4); a(W(10, "car"), "clink_egg", .5); a(W(10, "something"), "ding", .5)
a(W(11, "Money"), "pop", .5); a(W(11, "never"), "bwah", .4); a(W(11, "food"), "pop", .5); a(W(11, "water"), "pop", .5); a(W(11, "electricity"), "ping", .5)
a(W(12, "system"), "boing", .4); a(W(12, "exchange"), "slide", .5)
a(W(13, "disaster"), "rumble", .5); a(W(13, "disaster") + .1, "sting", .4)
a(W(15, "medicine"), "pop", .5); a(W(15, "willing"), "ding", .4)
a(W(16, "potatoes"), "pop", .5); a(W(16, "shoes"), "pop", .5)
a(W(17, "shoemaker"), "pop", .5); a(W(17, "get"), "pop", .5); a(W(17, "return"), "pop", .5)
for k in ["Fuel", "Electricity", "Clothes", "Food"]: a(W(18, k), "pop", .5)
a(W(19, "easier"), "whoosh", .5); a(W(19, "important"), "ding", .45)
a(W(20, "valuable"), "wah", .4); a(W(22, "Why"), "sting", .45)
for k in ["raw", "electricity", "transportation", "spare", "agreements"]: a(W(23, k), "pop", .5)
for i in range(5): a(S0(24) + .6 + i * .3, "clunk", .35)
a(W(25, "useful"), "bwah", .4); a(W(26, "hospital"), "buzz", .4)
a(W(27, "apart"), "clunk", .6); a(W(27, "apart") + .1, "crackle", .5)
a(W(28, "enough"), "pop", .5); a(W(28, "getting"), "rumble", .4)
a(W(29, "wealth"), "bwah", .45)
for k in ["Farmers", "Doctors", "Engineers", "mechanics", "electricians", "builders"]: a(W(31, k), "pop", .5)
a(W(31, "valuable"), "cheer", .35)
a(W(32, "billions"), "thud", .5); a(W(33, "fine"), "ding", .5)
a(W(34, "But"), "rumble", .5); a(W(35, "whoever"), "thud", .55); a(S0(36), "rumble", .4)
a(W(38, "Others"), "slide", .5); a(W(39, "rationing"), "pop", .5)
a(W(40, "credits"), "chime", .5); a(W(40, "tokens"), "ping", .5); a(W(40, "universal"), "chime", .5)
a(W(41, "screen"), "whoosh", .4); a(W(43, "Remove"), "thud", .6); a(W(43, "build"), "pop", .5)
a(W(45, "suddenly"), "bwah", .4); a(W(45, "competing"), "thud", .4); a(W(45, "needing"), "wah", .4)
a(W(46, "system"), "whoosh", .4); a(W(47, "person"), "chime", .5); a(W(48, "would"), "pop", .5)
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
track = load(P + "assets/music/Resolution Or Reflection - The Grey Room, Clark Sims.mp3")
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
sf.write(V + "audio/mix_raw.wav", mix, SR)
m = subprocess.run(["ffmpeg", "-hide_banner", "-i", V + "audio/mix_raw.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
af = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,volume=0.55dB"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", V + "audio/mix_raw.wav", "-af", af, "-ar", "48000", "-ac", "2", V + "audio/mix.wav"], check=True)
print("events", len(ev), "total", TOTAL)
