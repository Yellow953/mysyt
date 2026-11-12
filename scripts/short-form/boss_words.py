"""Word times for the boss-can-we-talk Short: voiced runs from RMS (pauses >=0.12 s) inside each phrase, else char-weighted."""
import json, numpy as np, soundfile as sf, re
P="/Users/yellow/Projects/MrYellowScarf/videos/short-form/2026-11-09-boss-can-we-talk/"
a,sr=sf.read(P+"audio/voice.wav"); a=a if a.ndim==1 else a.mean(1)
segs=json.load(open(P+"audio/segments.json"))
hop=int(0.01*sr); rms=np.array([np.sqrt((a[i:i+hop]**2).mean()) for i in range(0,len(a)-hop,hop)])
thr=10**(-42/20)
out=[]
for s in segs:
    words=s["text"].split()
    i0,i1=int(s["start"]*100),int(s["end"]*100)
    voiced=rms[i0:i1]>thr
    # runs
    runs=[];st=None
    for k,v in enumerate(voiced):
        if v and st is None: st=k
        if not v and st is not None: runs.append([st,k]);st=None
    if st is not None: runs.append([st,len(voiced)])
    merged=[]
    for r in runs:
        if merged and r[0]-merged[-1][1]<12: merged[-1][1]=r[1]
        else: merged.append(r)
    ws=[]
    if len(merged)==len(words):
        for w,r in zip(words,merged): ws.append((w,s["start"]+r[0]/100,s["start"]+r[1]/100))
    else:
        w0,w1=s["start"],s["end"]; tot=sum(len(re.sub(r'\W','',w))+2 for w in words); t=w0
        for w in words:
            d=(w1-w0)*(len(re.sub(r'\W','',w))+2)/tot; ws.append((w,t,t+d)); t+=d
    print(s["text"],len(merged),len(words))
    out.append({"start":s["start"],"end":s["end"],"words":[{"text":w,"start":round(x,3),"end":round(y,3)} for w,x,y in ws]})
json.dump(out,open("/Users/yellow/Projects/MrYellowScarf/remotion/src/bossWords.json","w"),indent=0)
for o in out: print([ (w["text"],w["start"]) for w in o["words"]])
