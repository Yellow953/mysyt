# Mix voice + synthesized SFX + ducked music into audio/mix.wav, then loudnorm -> audio/final.wav
import json, subprocess, numpy as np, soundfile as sf
base='/Users/yellow/Projects/MrYellowScarf/'
V=base+'videos/short-form/2026-11-05-trash-at-the-sun/audio/'
SR=44100
tl=json.load(open(base+'remotion/src/sunTimeline.json')); total=tl['total']
N=int(total*SR)+SR
def load(p):
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-ar',str(SR),'-ac','1','-f','f32le','-'],capture_output=True,check=True).stdout
    return np.frombuffer(raw,dtype=np.float32)
voice=load(V+'voice.wav'); out=np.zeros(N,np.float32); out[:len(voice)]+=voice
# music (Bright Side), start 0, fade in/out, ducked under voice
mus=load(base+'assets/music/Bright Side - David Simon-Baker, Victoria George.mp3')
mus=np.tile(mus,2)[:N]
env=np.zeros(N,np.float32)
for s in tl['segs']: env[int(s['start']*SR):int(s['end']*SR)]=1
k=int(0.25*SR); env=np.convolve(env,np.ones(k)/k,mode='same')
duck=1-0.55*env
fade=np.minimum(1,np.arange(N)/(0.5*SR))*np.minimum(1,np.maximum(0,(total*SR-np.arange(N)))/(1.5*SR))
mrms=np.sqrt((mus**2).mean()); vrms=np.sqrt((voice**2).mean())
gain=0.22*vrms/mrms*2.2  # bed ~0.22 of voice level (before duck)
out+=mus*duck*fade*gain
cues=json.load(open(V+'sfx_cues.json'))
for t,name,vol in cues:
    a=load(base+f'remotion/public/sun/{name}.wav'); i=int(t*SR)
    seg=a[:max(0,min(len(a),N-i))]; out[i:i+len(seg)]+=seg*vol*0.55
out=np.clip(out,-1,1)
sf.write(V+'mix.wav',out[:int(total*SR)],SR)
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',V+'mix.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=11','-ar','48000',V+'final.wav'],check=True)
r=subprocess.run(['ffmpeg','-i',V+'final.wav','-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
print([l for l in r.splitlines() if 'I:' in l][-1:])
