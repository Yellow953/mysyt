#!/usr/bin/env python3
"""(monlf copy of split_sheet.py) Cut a magenta sprite sheet into separate transparent sprites.
Usage: split_sheet_monlf.py sheet.png outdir name1 name2 ...   (names in reading order: rows top-to-bottom, then left-to-right)
Runs cutout.py --global into a private temp file, splits by alpha blobs (dilation 6 px, small blobs merged into the
nearest big one), and groups blobs into rows by the largest vertical gaps between blob centres."""
import sys, subprocess, numpy as np, os, tempfile
from PIL import Image
from scipy import ndimage as ndi
src, out, names = sys.argv[1], sys.argv[2], sys.argv[3:]
DIL = int(os.environ.get("DIL", "6"))
ROWS = int(os.environ.get("ROWS", "2"))
tmp = os.path.join(tempfile.mkdtemp(prefix="island_"), "sheet_cut.png")
subprocess.run([sys.executable, "scripts/short-form/cutout.py", src, tmp, "--pad", "4", "--global"], check=True)
im = Image.open(tmp).convert("RGBA")
arr = np.asarray(im)
a = arr[..., 3] > 20
lab, n = ndi.label(ndi.binary_dilation(a, iterations=DIL))
sizes = ndi.sum(a, lab, range(1, n + 1))
big = [i + 1 for i in np.argsort(-sizes)[:len(names)]]
# merge small blobs into the nearest big blob
cent = {b: np.array(ndi.center_of_mass(a, lab, b)) for b in range(1, n + 1) if sizes[b - 1] > 0}
for b in range(1, n + 1):
    if b in big or sizes[b - 1] == 0:
        continue
    near = min(big, key=lambda q: np.linalg.norm(cent[q] - cent[b]))
    lab[lab == b] = near
cy = sorted(big, key=lambda b: cent[b][0])
ys = [cent[b][0] for b in cy]
gaps = sorted(range(len(ys) - 1), key=lambda i: -(ys[i + 1] - ys[i]))[:ROWS - 1]
rows, cur = [], []
for i, b in enumerate(cy):
    cur.append(b)
    if i in gaps:
        rows.append(cur); cur = []
rows.append(cur)
order = [b for r in rows for b in sorted(r, key=lambda b: cent[b][1])]
for b, nm in zip(order, names):
    m = (lab == b)
    yy, xx = np.where(m & a)
    y0, y1, x0, x1 = yy.min(), yy.max() + 1, xx.min(), xx.max() + 1
    crop = arr[y0:y1, x0:x1].copy()
    crop[~(m[y0:y1, x0:x1] & a[y0:y1, x0:x1])] = 0
    Image.fromarray(crop).save(os.path.join(out, nm + ".png")); print(nm, crop.shape[1], crop.shape[0])
