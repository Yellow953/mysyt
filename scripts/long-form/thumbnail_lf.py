"""Make a 16:9 long-form thumbnail: scene image + huge outlined text (drawn locally, so no garbled AI lettering).

Usage:
  .venv/bin/python scripts/long-form/thumbnail_lf.py <image> "LINE ONE" ["LINE TWO"] --out out.png [--size 1920x1080] [--y 0.08] [--x 0.04] [--font-size 250] [--max-width 0.6]

Defaults to a 1920x1080 YouTube thumbnail. Text: yellow, thick black outline, Impact; shrinks to fit.
Text sits in the upper-left empty area (left-aligned at --x, at most --max-width of the frame wide, so it stays off the
centre-right where the character usually is). Keep the bottom-right 20% clear (the video timestamp sits there).
Derived from scripts/short-form/thumbnail.py (the 9:16 Shorts cover, unchanged).
"""
import argparse

from PIL import Image, ImageDraw, ImageFont

FONT = "/System/Library/Fonts/Supplemental/Impact.ttf"
YELLOW, BLACK = (255, 214, 10), (0, 0, 0)


def cover(im, w, h):
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("image")
    p.add_argument("lines", nargs="+")
    p.add_argument("--out", required=True)
    p.add_argument("--size", default="1920x1080")
    p.add_argument("--x", type=float, default=0.04, help="left edge of the text block, fraction of width")
    p.add_argument("--y", type=float, default=0.08, help="top of the text block, fraction of height")
    p.add_argument("--max-width", type=float, default=0.6, help="max text width, fraction of width (keeps the text in the upper-left)")
    p.add_argument("--font-size", type=int, default=250)
    p.add_argument("--arrow", action="store_true", help="draw a small red arrow (before -> after) in the gap between the two halves, below the question mark")
    p.add_argument("--logo", help="path to a real logo PNG; drawn on a white plate near the bottom centre (clear of the bottom-right corner)")
    p.add_argument("--logo-y", type=float, default=0.78, help="top of the logo plate, fraction of height")
    p.add_argument("--qmark", action="store_true", help="draw a big red question mark in the centre")
    a = p.parse_args()
    w, h = map(int, a.size.split("x"))
    im = cover(Image.open(a.image).convert("RGB"), w, h)
    d = ImageDraw.Draw(im)
    size = a.font_size
    x0 = w * a.x
    max_w = w * a.max_width
    while True:  # shrink until the widest line fits the upper-left box and the block stays above the bottom-right zone
        f = ImageFont.truetype(FONT, size)
        stroke = max(8, size // 14)
        widest = max(d.textlength(t, font=f) for t in a.lines)
        block_bottom = h * a.y + size + int(size * 1.02) * (len(a.lines) - 1) + stroke
        if (widest + 2 * stroke <= max_w and block_bottom <= h * 0.78) or size <= 80:
            break
        size -= 6
    y = int(h * a.y) + size
    for t in a.lines:
        d.text((x0, y), t, font=f, fill=YELLOW, stroke_width=stroke, stroke_fill=BLACK, anchor="ls")
        y += int(size * 1.02)
    if a.qmark:  # big red "?" with a thick white outline, centre of the frame
        qf = ImageFont.truetype(FONT, int(h * 0.19))
        d.text((w / 2, int(h * 0.50)), "?", font=qf, fill=(228, 40, 36), stroke_width=14, stroke_fill=(255, 255, 255), anchor="mm")
    if a.arrow:  # red arrow pointing right, black outline
        cx, cy, L, T, H = w / 2, int(h * 0.69), w * 0.08, 34, 64
        pts = [(cx - L, cy - T / 2), (cx + L * 0.35, cy - T / 2), (cx + L * 0.35, cy - H), (cx + L, cy), (cx + L * 0.35, cy + H), (cx + L * 0.35, cy + T / 2), (cx - L, cy + T / 2)]
        d.polygon(pts, fill=(228, 40, 36), outline=BLACK, width=8)
    if a.logo:
        lg = Image.open(a.logo).convert("RGBA")
        lg.thumbnail((int(w * 0.3), int(h * 0.12)), Image.LANCZOS)
        pad = 24
        plate = Image.new("RGBA", (lg.width + 2 * pad, lg.height + 2 * pad), (0, 0, 0, 0))
        ImageDraw.Draw(plate).rounded_rectangle((0, 0, plate.width - 1, plate.height - 1), 26, fill=(255, 255, 255, 245))
        plate.alpha_composite(lg, (pad, pad))
        im = im.convert("RGBA")
        im.alpha_composite(plate, ((w - plate.width) // 2, int(h * a.logo_y)))
        im = im.convert("RGB")
    im.save(a.out)
    print(f"wrote {a.out} ({w}x{h}, font {size}px)")


if __name__ == "__main__":
    main()
