import json, re
base='/Users/yellow/Projects/MrYellowScarf/'
V=base+'videos/short-form/2026-11-05-trash-at-the-sun/audio/'
seg=json.load(open(V+'segments.json'))
wh=[w for s in json.load(open(V+'voice.json'))['segments'] for w in s['words']]
fix={'sun?':'Sun?','sun':'Sun','sun.':'Sun.','tons':'tonnes','earth':'Earth','mars':'Mars'}
words=[]
for w in wh:
    t=w['word'].strip(); k=t.lower()
    t=fix.get(k,t)
    if t.lower().startswith('earth'): t='Earth'
    words.append({'text':t,'start':w['start']})
# manual corrections of whisper drift at clip boundaries
for w in words:
    if w['text']=='and' and 26.0<w['start']<26.5: w['start']=26.9
    if w['text']=='So' and abs(w['start']-14.0)<0.1: w['start']=14.5
    if w['text'].lower()=='so' and abs(w['start']-14.0)<0.1: w['start']=14.5
for i,w in enumerate(words):
    nxt=words[i+1]['start'] if i+1<len(words) else seg[-1]['end']
    w['end']=min(nxt, w['start']+0.5) if nxt-w['start']>0.5 else nxt
    # clip end
    for s in seg:
        if s['start']-0.2<=w['start']<s['end']+0.2: w['end']=min(w['end'],s['end']+0.1)
sizes=[[4,4,4,4],[4,3],[3,3,3,3,3],[3,4],[4,4,2],[4,3,3],[4,3,4],[4,3,2],[2]]
# clip 5 splits into 2 sentences (3 + 3 chunks) handled via explicit lists above (idx 4 = 'To actually..', 5='That takes..')
caps=[];i=0
for sz in sizes:
    for n in sz:
        ch=words[i:i+n]; i+=n
        caps.append({'start':ch[0]['start'],'end':ch[-1]['end']+0.12,'words':ch})
assert i==len(words),(i,len(words))
# make chunks not overlap
for a,b in zip(caps,caps[1:]):
    a['end']=min(a['end'],b['start'])
total=seg[-1]['end']+0.5
json.dump({'total':round(total,2),'segs':seg,'caps':caps,'words':words},open(base+'remotion/src/sunTimeline.json','w'),indent=1)
for c in caps: print(round(c['start'],2),round(c['end'],2),' '.join(w['text'] for w in c['words']))
print(total)
