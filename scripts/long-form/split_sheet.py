#!/usr/bin/env python3
"""Cut a magenta sprite sheet into separate transparent sprites.
Usage: split_sheet.py sheet.png outdir name1 name2 ...   (names in reading order: rows top-to-bottom, then left-to-right)
Runs cutout.py --global, then splits by alpha connected blobs (small blobs merged into the nearest big one)."""
import sys, subprocess, numpy as np, os
from PIL import Image
from scipy import ndimage as ndi
src, out, names = sys.argv[1], sys.argv[2], sys.argv[3:]
tmp = "/tmp/_sheet_cut.png"
subprocess.run([sys.executable, "scripts/short-form/cutout.py", src, tmp, "--pad", "4", "--global"], check=True)
im = Image.open(tmp).convert("RGBA")
a = np.asarray(im)[..., 3] > 20
lab, n = ndi.label(ndi.binary_dilation(a, iterations=14))
sizes = ndi.sum(a, lab, range(1, n + 1))
big = [i + 1 for i in np.argsort(-sizes)[:len(names)]]
cents = {b: ndi.center_of_mass(a, lab, b) for b in big}
order = sorted(big, key=lambda b: (round(cents[b][0] / (a.shape[0] / 2.2)), cents[b][1]))
arr = np.asarray(im)
for b, nm in zip(order, names):
    m = (lab == b)
    ys, xs = np.where(m & a)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    crop = arr[y0:y1, x0:x1].copy()
    crop[~(m[y0:y1, x0:x1] & a[y0:y1, x0:x1])] = 0
    Image.fromarray(crop).save(os.path.join(out, nm + ".png")); print(nm, crop.shape[1], crop.shape[0])
