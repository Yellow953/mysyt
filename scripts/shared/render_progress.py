#!/usr/bin/env python3
"""Live progress bar for a Remotion render log (no pipes, no buffering).
Usage: python3 scripts/shared/render_progress.py <render.log> <total_frames> [title]
Open it in its own Terminal window so Joe can watch."""
import re, sys, time, os
log, total = sys.argv[1], int(sys.argv[2]); title = sys.argv[3] if len(sys.argv) > 3 else "render"
print(f"\n  {title}\n"); last = -1; t0 = time.time(); done = False
while True:
    txt = open(log, errors="ignore").read() if os.path.exists(log) else ""
    m = re.findall(r"Rendered (\d+)/(\d+)", txt); n = int(m[-1][0]) if m else 0
    left = re.findall(r"remaining: ([^\r\n]*)", txt); left = left[-1] if left else "..."
    enc = re.findall(r"Encoded (\d+)/", txt)
    done = "+  " in txt and ".mp4" in txt.split("Encoded")[-1] or "\n+ " in txt
    pct = min(100, n * 100 // total)
    bar = "#" * (pct // 2)
    stage = "encoding" if enc and n >= total else "rendering"
    print(f"\r  [{bar:<50}] {pct:3d}%  {n}/{total}  {left} left ({stage})   ", end="", flush=True)
    if done:
        print("\n\n  DONE - video is ready."); break
    time.sleep(1)
