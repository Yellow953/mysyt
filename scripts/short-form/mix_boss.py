"""Mix voice + music (ducked) + SFX for boss-can-we-talk, loudnorm to -14 LUFS -> audio/mix.wav"""
import json, subprocess, io, numpy as np, soundfile as sf
from scipy.signal import resample_poly
P="/Users/yellow/Projects/MrYellowScarf/"; V=P+"videos/short-form/2026-11-09-boss-can-we-talk/"; SR=44100; TOTAL=28.75
def load(p):
    raw=subprocess.run(["ffmpeg","-loglevel","error","-i",p,"-ar",str(SR),"-ac","1","-f","wav","-"],capture_output=True,check=True).stdout
    return sf.read(io.BytesIO(raw),dtype="float32")[0]
out=np.zeros(int(TOTAL*SR))
voice=load(V+"audio/voice.wav"); out[:len(voice)]+=voice[:len(out)]
segs=json.load(open(V+"audio/segments.json"))
music=load(P+"assets/music/Desert Drive - Everet Almond.mp3")
music=np.tile(music,2)[:len(out)]
env=np.ones(len(out))*0.22
for s in segs:
    i0,i1=int((s["start"]-0.1)*SR),int((s["end"]+0.1)*SR); env[i0:i1]=0.22*0.5
env=np.convolve(env,np.ones(2205)/2205,mode="same")
t=np.arange(len(out))/SR
env*=np.minimum(1,t/0.6)*np.minimum(1,(TOTAL-t)/0.6)
out+=music*env
ev=[(0.05,"rumble",.35),(3.62,"whoosh",.5),(3.7,"thud",1),(4.55,"thud",1),(6.4,"thud",1),(7.95,"thud",1.0),(7.95,"clink",.4),
(8.95,"whoosh",.6)]+[(9.3+k*0.45,"clink",.3) for k in range(11)]+[(14.85,"pop",.4),(16.2,"thud",.4),(17.55,"thud",.4),(18.25,"cough",.3),(20.0,"clink",.2),
(22.6,"rumble",.6),(23.5,"whoosh",.8),(23.55,"thud",1.0),(23.62,"boing",.7),(23.75,"pop",.6),(25.7,"pop",.6),(25.75,"whoosh",.4),(26.3,"clink",.5)]
for t0,n,v in ev:
    x=load(P+f"remotion/public/boss/{n}.wav")*v*0.6; i=int(t0*SR); out[i:i+len(x)]+=x[:len(out)-i]
sf.write("/tmp/boss_pre.wav",out,SR)
subprocess.run(["ffmpeg","-y","-loglevel","error","-i","/tmp/boss_pre.wav","-af","loudnorm=I=-14:TP=-1.5:LRA=11","-ar","44100",V+"audio/mix.wav"],check=True)
r=subprocess.run(["ffmpeg","-i",V+"audio/mix.wav","-af","ebur128","-f","null","-"],capture_output=True,text=True).stderr
print([l for l in r.splitlines() if "I:" in l][-1])
