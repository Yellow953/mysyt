#!/usr/bin/env python3
"""Find and repair single-frame render glitches (tiled / colorful garbage frames) in a rendered long-form video.

Background: Remotion renders with --gl=angle sometimes emit a lone corrupted frame (the picture shown as a 3x3 grid of tiles).
A glitch frame differs hugely from BOTH neighbours while the neighbours match each other.
The fix drops those frames and lets ffmpeg's fps filter duplicate the previous frame (1/60 s, invisible), then re-encodes + muxes audio.

Usage:  .venv/bin/python scripts/long-form/fix_glitches.py <video-folder> <final-name> [--scan-only]
  e.g.  .venv/bin/python scripts/long-form/fix_glitches.py videos/long-form/salary-public-what-if salary-public-what-if
Reads  <folder>/output/raw60.mp4 (video only, from render_pending.sh) and <folder>/audio/mix.wav.
Writes <folder>/output/<final-name>_fixed.mp4 (the original final is left untouched). Scan takes ~5 min, re-encode ~10-15 min.
Catches glitch runs of 1-4 frames.
"""
import subprocess, sys, os
import numpy as np

def scan(path, w=96, h=54, thresh=25.0, maxlen=4):
    """Return frame numbers of glitch runs up to `maxlen` frames: frames whose picture jumps hugely away from the frame before
    and back to something matching it within `maxlen` frames."""
    cmd = ["ffmpeg", "-loglevel", "error", "-i", path, "-vf", f"scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    n = w * h * 3
    win, base, bad, i = [], 0, set(), 0   # win holds frames base..base+len-1
    def d(a, b):
        return np.abs(a - b).mean()
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        win.append(np.frombuffer(b, dtype=np.uint8).astype(np.int16))
        if len(win) > maxlen + 2:
            win.pop(0); base += 1
        # glitch run starting at index g (relative), length L: win[g-1] ~ win[g+L], both far from win[g]
        for L in range(1, maxlen + 1):
            if len(win) >= L + 2:
                before, after = win[-(L + 2)], win[-1]
                first = win[-(L + 1)]
                if d(before, first) > thresh and d(after, win[-2]) > thresh and d(before, after) < 0.5 * min(d(before, first), d(after, win[-2])):
                    start = i - L
                    bad.update(range(start, start + L))
        i += 1
    return sorted(bad), i

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    folder, name = sys.argv[1], sys.argv[2]
    raw = os.path.join(folder, "output", "raw60.mp4")
    mix = os.path.join(folder, "audio", "mix.wav")
    out = os.path.join(folder, "output", f"{name}_fixed.mp4")
    bad, total = scan(raw)
    print(f"{total} frames, {len(bad)} glitch frames: {bad}")
    if "--scan-only" in sys.argv or not bad:
        return
    sel = "not(" + "+".join(f"eq(n\\,{n})" for n in bad) + ")"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-i", mix, "-vf", f"select='{sel}',fps=60",
           "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-shortest", out]
    subprocess.check_call(cmd)
    print("wrote", out)

if __name__ == "__main__":
    main()
