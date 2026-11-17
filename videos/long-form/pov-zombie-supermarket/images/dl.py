import sys, subprocess
from PIL import Image
B="https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB"
for line in open("dl_list.txt"):
    p=line.split()
    if len(p)<2: continue
    n,t=p; out=f"raw/{n}.png"
    for k in range(3):
        subprocess.run(["curl","-s","--max-time","60","--retry","2","-o",out,f"{B}/hf_{t}.png"])
        try: Image.open(out).load(); print("ok",n,Image.open(out).size); break
        except Exception as e: print("bad",n,k)
