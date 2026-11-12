#!/usr/bin/env python3
"""Extra synthesized cartoon SFX for the seawater long-form (free). Usage: make_sfx_sealf.py <out_dir>"""
import sys, numpy as np, soundfile as sf
from scipy.signal import butter, lfilter
SR = 44100
rng = np.random.default_rng(11)
def t(d): return np.linspace(0, d, int(SR * d), endpoint=False)
def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], btype="band"); return lfilter(b, a, x)
def lp(x, f):
    b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def norm(x, p=0.8): return x / (np.abs(x).max() + 1e-9) * p
out = {}
tt = t(0.25); out["drip"] = norm(np.sin(2*np.pi*(1500-2500*tt)*tt)*np.exp(-tt*22))
tt = t(0.5); out["ding"] = norm(sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f,k in [(1320,6),(1980,9),(2640,14)]))
tt = t(0.9); out["chime"] = norm(sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*4)*(tt>d) for f,d in [(784,0),(988,0.12),(1175,0.24),(1568,0.36)]))
tt = t(0.2); out["tick"] = norm(bp(rng.normal(size=len(tt)),2500,6000)*np.exp(-tt*60))
d=0.35; tt=t(d); z=bp(rng.normal(size=len(tt)),200,4000)*np.exp(-tt*10); z[:int(0.01*SR)]*=np.linspace(0,1,int(0.01*SR)); out["splash"]=norm(z)
d=0.4; tt=t(d); out["zap"]=norm(np.sign(np.sin(2*np.pi*(180+2200*tt)*tt))*np.exp(-tt*9)+0.4*bp(rng.normal(size=len(tt)),2000,9000)*np.exp(-tt*14))
# sad trombone: descending notes with vibrato
seg=[];
for f0,f1,dd in [(311,293,.35),(293,277,.35),(277,261,.35),(261,196,.8)]:
    tt=t(dd); f=np.linspace(f0,f1,len(tt))+ (6*np.sin(2*np.pi*5.5*tt) if dd>.5 else 0); ph=2*np.pi*np.cumsum(f)/SR
    w=(np.sin(ph)+0.5*np.sin(2*ph)+0.3*np.sin(3*ph))*np.minimum(1,tt*30)*np.minimum(1,(dd-tt)*8); seg.append(w)
out["wah"]=norm(lp(np.concatenate(seg),2500))
d=1.2; tt=t(d); x=bp(rng.normal(size=len(tt)),500,3000); lfo=(np.sin(2*np.pi*14*tt)>0).astype(float)*0.5+0.5; out["bubble"]=norm(np.sin(2*np.pi*(250+300*np.abs(np.sin(2*np.pi*6*tt)))*tt)*0.5*lfo*np.exp(-((tt-0.6)/0.7)**2)+0.1*x)
d=1.5; tt=t(d); out["hiss"]=norm(bp(rng.normal(size=len(tt)),3000,10000)*np.sin(np.pi*tt/d)**0.7,0.6)
d=1.8; tt=t(d); out["fire"]=norm((lp(rng.normal(size=len(tt)),600)*(0.6+0.4*np.sin(2*np.pi*9*tt)**2)+0.3*bp(rng.normal(size=len(tt)),1500,6000)*(rng.random(len(tt))>0.7))*np.sin(np.pi*tt/d)**0.5,0.7)
d=1.4; tt=t(d); out["stream"]=norm(bp(rng.normal(size=len(tt)),1500,7000)*(0.8+0.2*np.sin(2*np.pi*40*tt))*np.minimum(1,tt*8)*np.minimum(1,(d-tt)*6),0.5)
d=1.2; tt=t(d); out["pump"]=norm(np.sign(np.sin(2*np.pi*(60+120*tt)*tt))*0.4+lp(rng.normal(size=len(tt)),400)*0.4)*np.minimum(1,tt*10)*np.minimum(1,(d-tt)*6)
d=0.6; tt=t(d); out["clunk"]=norm(np.sin(2*np.pi*(90-60*tt)*tt)*np.exp(-tt*9)+0.5*bp(rng.normal(size=len(tt)),300,1200)*np.exp(-tt*30))
d=1.6; tt=t(d); out["sputter"]=norm(sum(bp(rng.normal(size=len(tt)),300,2500)*np.exp(-((tt-c)/0.07)**2) for c in [0.15,0.4,0.62,0.95,1.3]),0.7)
d=1.4; tt=t(d); out["gurgle"]=norm(lp(np.sin(2*np.pi*(180+90*np.sin(2*np.pi*11*tt))*tt),900)*np.minimum(1,tt*6)*np.minimum(1,(d-tt)*4)+0.12*bp(rng.normal(size=len(tt)),300,1500))
d=1.0; tt=t(d); out["tinkle"]=norm(sum(np.sin(2*np.pi*f*tt)*np.exp(-(tt-c)*12)*(tt>c) for f,c in [(3520,0),(4186,0.1),(3136,0.2),(4699,0.3),(3951,0.45),(5274,0.6)]),0.6)
d=1.3; tt=t(d); out["cheer"]=norm(bp(rng.normal(size=len(tt)),600,3500)*(0.5+0.5*np.sin(2*np.pi*7*tt)**2)*np.sin(np.pi*tt/d),0.6)
d=0.5; tt=t(d); out["flap"]=norm(bp(rng.normal(size=len(tt)),200,900)*(np.sin(2*np.pi*16*tt)**2)*np.exp(-tt*3),0.6)
d=1.5; tt=t(d); out["wave"]=norm(lp(rng.normal(size=len(tt)),1200)*np.sin(np.pi*tt/d)**1.5,0.6)
d=0.9; tt=t(d); out["sting"]=norm((np.sin(2*np.pi*110*tt)+np.sin(2*np.pi*165*tt)+0.6*np.sin(2*np.pi*233*tt))*np.exp(-tt*3.5)*np.minimum(1,tt*60),0.8)
d=0.45; tt=t(d); out["slurp"]=norm(np.sin(2*np.pi*(500+900*tt/d)*tt)*0.3*np.sin(np.pi*tt/d)+bp(rng.normal(size=len(tt)),800,3500)*0.5*np.sin(np.pi*tt/d),0.6)
d=0.4; tt=t(d); out["bwah"]=norm(np.sin(2*np.pi*(260-90*tt/d)*tt+4*np.sin(2*np.pi*30*tt))*np.exp(-tt*4),0.7)
d=0.5; tt=t(d); out["motor"]=norm(np.sign(np.sin(2*np.pi*45*tt))*lp(rng.normal(size=len(tt)),500)*0.7,0.5)
for k,v in out.items(): sf.write(f"{sys.argv[1]}/{k}.wav", v.astype(np.float32), SR)
print(sorted(out))
