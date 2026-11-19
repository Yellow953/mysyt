import sys, subprocess, os
from PIL import Image
for line in open(sys.argv[1]):
    p = line.split()
    if len(p) < 2: continue
    n, u = p[0], p[1]
    f = f"raw/{n}.png"
    ok = False
    for _ in range(3):
        subprocess.run(["curl", "-s", "--max-time", "40", "--retry", "2", "-o", f, u])
        try: Image.open(f).load(); ok = True; break
        except Exception: pass
    print(n, "ok" if ok else "BAD")
