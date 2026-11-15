#!/usr/bin/env python3
"""Island funnel Short mix: voice (1.15x) + Sunshine Cantina ducked + soft whooshes/beats, loudnorm -14 LUFS -> remotion/public/islandshort/mix.wav and audio/mix.wav"""
import json, io, subprocess, shutil
import numpy as np, soundfile as sf
SR = 44100
P = "/Users/yellow/Projects/MrYellowScarf/"
V = P + "videos/short-form/island-funnel-short/audio/"
tl = json.load(open(P + "remotion/src/islandShortTimeline.json")); S = tl["segs"]; TOTAL = tl["total"]
def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ar", str(SR), "-ac", "1", "-f", "wav", "-"], capture_output=True, check=True).stdout
    return sf.read(io.BytesIO(raw), dtype="float32")[0]
n = int((TOTAL + 0.3) * SR)
voice = load(V + "voice_fast.wav"); vm = np.zeros(n, np.float32); vm[:len(voice)] = voice[:n]
track = load(P + "assets/music/Sunshine Cantina - National Sweetheart.mp3")
reps = int(np.ceil(n / len(track))) + 1; music = np.tile(track, reps)[:n]
music /= (np.sqrt(np.mean(music ** 2)) + 1e-9) / 0.12
tt = np.arange(n) / SR
duck = np.ones(n, np.float32)
for s in S: duck[int((s["start"] - .15) * SR):int((s["end"] + .25) * SR)] = 0.42
k = int(0.25 * SR); duck = np.convolve(duck, np.ones(k) / k, mode="same")
fade = np.minimum(1, tt / 0.5) * np.minimum(1, np.maximum(0, (TOTAL + 0.2 - tt)) / 1.2)
bed = music * duck * fade * 0.2 * 1.9
ev = [(S[i]["start"] - 0.3, "whoosh", 0.18) for i in range(1, len(S)) if i in (1, 2, 3, 4, 6, 8, 9, 11)]
ev += [(S[2]["start"] + 0.45, "thud", 0.5), (S[3]["start"] + 0.2, "chime", 0.35), (S[6]["start"] + 1.5, "chime", 0.3), (S[8]["start"] + 0.2, "sting", 0.4), (S[9]["start"] + 0.2, "thud", 0.4), (S[11]["start"], "ding", 0.3)]
sfx = np.zeros(n, np.float32)
for t0, nm, v in ev:
    x, sr = sf.read(P + f"remotion/public/mnylf/{nm}.wav", dtype="float32")
    if x.ndim > 1: x = x.mean(1)
    i = max(0, int(t0 * SR)); seg = x[:max(0, n - i)]; sfx[i:i + len(seg)] += seg * v * 0.5
mix = np.clip(vm + bed + sfx, -1, 1)
sf.write(V + "mix_raw.wav", mix, SR)
m = subprocess.run(["ffmpeg", "-hide_banner", "-i", V + "mix_raw.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
af = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,volume=0.55dB"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", V + "mix_raw.wav", "-af", af, "-ar", "48000", "-ac", "2", V + "mix.wav"], check=True)
shutil.copy(V + "mix.wav", P + "remotion/public/islandshort/mix.wav")
print("events", len(ev), "total", TOTAL)
