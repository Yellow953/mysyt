#!/usr/bin/env python3
"""Measure cut-out sprites for Remotion: head disc, feet point, extra points.
Usage: sprite_meta.py <sprites_dir> <out.json>   (copies nothing; reads *.png)
head = largest inscribed disc of the hole-filled silhouette (the big round head);
feet = mean x of opaque pixels in the bottom 3.5% rows; also bag blob and crater centre when present."""
import sys, json, glob, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

d, out = sys.argv[1], sys.argv[2]
meta = {}
for f in sorted(glob.glob(os.path.join(d, "*.png"))):
    n = os.path.basename(f)[:-4]
    a = np.asarray(Image.open(f).convert("RGBA")).astype(np.int32)
    h, w = a.shape[:2]
    solid = ndi.binary_fill_holes(a[..., 3] > 128)
    dt = ndi.distance_transform_edt(solid)
    hy, hx = np.unravel_index(dt.argmax(), dt.shape)
    m = {"w": w, "h": h, "head": [int(hx), int(hy), float(dt[hy, hx])]}
    rows = solid[int(h * 0.965):]
    xs = np.where(rows.any(0))[0]
    m["feet"] = [float(xs.mean()) if len(xs) else w / 2, float(h)]
    ys, xs2 = np.where(solid)
    k = np.argmax(xs2 - ys)  # raised right hand
    m["hand"] = [int(xs2[k]), int(ys[k])]
    if n == "hold":
        dark = (a[..., :3].sum(2) < 150) & (a[..., 3] > 200)
        er = ndi.binary_erosion(dark, iterations=7)
        lab, c = ndi.label(er)
        if c:
            sizes = ndi.sum(er, lab, range(1, c + 1))
            j = int(np.argmax(sizes)) + 1
            by, bx = np.where(lab == j)
            m["bag"] = [float(bx.mean()), float(by.mean()), float(bx.max() - bx.min() + 14)]
    if n == "volcano":
        orange = (a[..., 0] > 200) & (a[..., 1] > 40) & (a[..., 1] < 140) & (a[..., 2] < 90) & (a[..., 3] > 200)
        top = np.zeros_like(orange); top[: int(h * 0.30)] = orange[: int(h * 0.30)]
        by, bx = np.where(top)
        m["crater"] = [float(bx.mean()), float(by.mean()), float(bx.max() - bx.min())]
    meta[n] = m
    print(n, m)
json.dump(meta, open(out, "w"), indent=1)
