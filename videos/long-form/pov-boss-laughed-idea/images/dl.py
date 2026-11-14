import sys, subprocess, os
from concurrent.futures import ThreadPoolExecutor
def go(l):
    n, r = l.split()
    out = f"raw/{n}.png"
    if os.path.getsize(out) > 10000 if os.path.exists(out) else False: return
    subprocess.run(["curl", "-s", "-o", out, f"https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB/hf_20261114_{r}.png"])
with ThreadPoolExecutor(6) as ex: list(ex.map(go, [l for l in open(sys.argv[1]) if l.strip()]))
