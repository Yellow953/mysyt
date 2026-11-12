#!/usr/bin/env python3
"""Local transparent cut-out (no Higgsfield credits).

Generate the sprite on a plain flat MAGENTA (#FF00FF) background (normal 0.5-credit image),
then run:  .venv/bin/python scripts/short-form/cutout.py in.png out.png [--pad 12] [--thresh 70] [--global]

Method: background colour = median of the border; every pixel close to it AND connected to the
border becomes transparent (so magenta inside the picture is kept); a thin edge band gets a soft
alpha and the background colour is un-mixed from it so no pink fringe remains. Output is trimmed
to its alpha box + pad. Prints the trim offset and size (needed for aligning poses).
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def cutout(src, dst, pad=12, thresh=70, glob=False):
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    h, w, _ = im.shape
    border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
    bgc = np.median(border, axis=0)
    dist = np.sqrt(((im - bgc) ** 2).sum(2))
    near = dist < thresh
    lab, _ = ndi.label(near)
    edge_labels = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge_labels = edge_labels[edge_labels > 0]
    bg = np.isin(lab, edge_labels)
    if glob:  # also remove enclosed background-coloured holes (gaps between legs/pipes)
        bg = near
    # soft band (3 px) around the background
    band = ndi.binary_dilation(bg, iterations=3) & ~bg
    ref = float(np.sqrt(((np.zeros(3) - bgc) ** 2).sum()))  # black ink vs background
    alpha = np.ones((h, w), np.float32)
    alpha[bg] = 0.0
    a_band = np.clip(dist / max(ref * 0.9, 1.0), 0, 1)
    alpha[band] = a_band[band]
    rgb = im.copy()
    a3 = np.maximum(alpha[..., None], 1e-3)
    unmixed = (im - (1 - alpha[..., None]) * bgc) / a3
    rgb[band] = np.clip(unmixed, 0, 255)[band]
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    ys, xs = np.where(alpha > 0.02)
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, w)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, h)
    Image.fromarray(out[y0:y1, x0:x1], "RGBA").save(dst)
    print(f"{dst}: offset=({x0},{y0}) size=({x1 - x0},{y1 - y0}) bg={bgc.astype(int).tolist()}")


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) < 2:
        sys.exit(__doc__)
    pad = int(a[a.index("--pad") + 1]) if "--pad" in a else 12
    th = float(a[a.index("--thresh") + 1]) if "--thresh" in a else 70
    cutout(a[0], a[1], pad, th, '--global' in a)
