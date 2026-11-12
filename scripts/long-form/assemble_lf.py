"""Assemble a 16:9 long-form video (1920x1080, 30 fps): scene images + camera motion + burned-in captions + voice (+ music).

Usage:
  .venv/bin/python scripts/long-form/assemble_lf.py videos/long-form/<slug> [--frames N] [--music-dir DIR]

  --frames N     render only the first N frames (test renders)
  --music-dir D  music folder (default assets/music). Track choice and usage log (used.json) work as in assemble.py.

Needs videos/long-form/<slug>/{scenes.json, audio/voice.wav, audio/timing.json, audio/captions.json, images/scene_XX.png (or .jpg)}
Output: videos/long-form/<slug>/output/<slug>.mp4

Derived from scripts/short-form/assemble.py (the vertical Shorts assembler, which stays unchanged).
Differences: 1920x1080 frame, captions in the lower third (~82% of height), overlay_text up to 3 lines
(split on " — ") on a translucent plate near the top (~9% from the top), optional logo badge centred at the top.
This ffmpeg has no libass/drawtext, so motion and captions are drawn with Pillow and piped to ffmpeg.
"""
import argparse
import json
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1920, 1080, 30
BUF = 1.02                     # image buffer scale: only ~2% of the picture is cropped (Joe 2026-11-04: images looked zoomed in and cropped)
MIN_SHOT = 1.1
YELLOW, WHITE, BLACK = (255, 214, 10), (255, 255, 255), (0, 0, 0)
FONT = "/System/Library/Fonts/Supplemental/Impact.ttf"
FONT_SMALL = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
CAP_Y = int(H * 0.82)          # caption baseline, lower third
CAP_SIZE = 104                 # caption font size at 1080p (shrinks to fit the width)
OVL_Y = int(H * 0.09)          # overlay plate top, about 9% from the top
SIDE_MARGIN = 120              # px kept free on each side for captions and overlays
ROOT = Path(__file__).resolve().parent.parent.parent


def ease(p):
    return p * p * (3 - 2 * p)


def camera(motion, p, t):
    """-> (zoom factor >= 1, dx, dy) with dx, dy in fractions of the spare margin (-1..1)."""
    if motion == "zoom_in":
        return 1.0 + 0.03 * ease(p), 0, 0
    if motion == "zoom_out":
        return 1.03 - 0.03 * ease(p), 0, 0
    if motion == "pan_left":
        return 1.03, 0.8 - 1.6 * ease(p), 0
    if motion == "pan_right":
        return 1.03, -0.8 + 1.6 * ease(p), 0
    if motion == "shake":
        return 1.03, 0.3 * math.sin(t * 14), 0.3 * math.cos(t * 11)
    return 1.02, 0, 0


def frame_image(base, motion, p, t):
    z, dx, dy = camera(motion, p, t)
    bw, bh = base.size
    zz = BUF * z
    cw, ch = bw / zz, bh / zz
    mx, my = (bw - cw) / 2, (bh - ch) / 2
    x0, y0 = mx + dx * mx, my + dy * my
    return base.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))


def draw_outlined(d, xy, text, font, fill, stroke):
    d.text(xy, text, font=font, fill=fill, stroke_width=stroke, stroke_fill=BLACK, anchor="ls")


_fonts = {}


def _font(size, path=FONT):
    key = (path, size)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(path, size)
    return _fonts[key]


def draw_caption(img, chunk, t):
    """Draw one caption chunk in the lower third, shrinking the font until it fits inside the side margins."""
    d = ImageDraw.Draw(img)
    words = chunk["words"]
    size = CAP_SIZE
    while True:
        f = _font(size)
        gap = round(size * 0.23)
        stroke = max(5, round(size / 12.5))
        widths = [d.textlength(w["text"], font=f) for w in words]
        total = sum(widths) + gap * (len(words) - 1)
        if total + 2 * stroke <= W - 2 * SIDE_MARGIN or size <= 48:
            break
        size -= 4
    x = (W - total) / 2
    for w, wd in zip(words, widths):
        active = w["start"] <= t < w["end"]
        d.text((x, CAP_Y), w["text"], font=f, fill=YELLOW if active else WHITE, stroke_width=stroke,
               stroke_fill=BLACK, anchor="ls")
        x += wd + gap


def build_overlay(text):
    """Overlay plate: up to 3 lines split on ' — ' (first line yellow when there are several).
    Each line is auto-fit to the side margins. Returns a full-width RGBA layer."""
    parts = [x.strip() for x in text.split(" — ") if x.strip()][:3]
    probe = ImageDraw.Draw(Image.new("RGBA", (W, 10)))
    sizes, fonts, widths = [], [], []
    for li, part in enumerate(parts):
        size = 84 if len(parts) == 1 else (80 if li == 0 else 74)
        while True:
            f_ = _font(size, FONT_SMALL)
            if probe.textlength(part, font=f_) + 24 <= W - 2 * SIDE_MARGIN or size <= 36:
                break
            size -= 4
        sizes.append(size)
        fonts.append(f_)
        widths.append(probe.textlength(part, font=f_))
    line_h = [int(s * 1.12) for s in sizes]
    pad_y = 16
    plate_h = 2 * pad_y + sum(line_h)
    layer = Image.new("RGBA", (W, plate_h), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    # dark translucent plate so the label stays readable over heads, crowns and bright skies
    pw = max(widths) + 90
    ld.rounded_rectangle(((W - pw) / 2, 0, (W + pw) / 2, plate_h - 1), 36, fill=(0, 0, 0, 130))
    y = pad_y
    for li, part in enumerate(parts):
        base = y + int(line_h[li] * 0.8)
        draw_outlined(ld, ((W - widths[li]) / 2, base), part, fonts[li],
                      YELLOW if (len(parts) > 1 and li == 0) else WHITE, 8)
        y += line_h[li]
    return layer


def pick_music(spec, slug, mdir):
    """Music rotation: scenes.json "music" (file name in the music folder) wins; otherwise reuse the track already
    used for this slug, else the least-used track (ties: first by name). Usage is saved in <mdir>/used.json."""
    files = sorted(list(mdir.glob("*.mp3")) + list(mdir.glob("*.wav")))
    if not files:
        return None
    log_path = mdir / "used.json"
    used = json.load(open(log_path)) if log_path.exists() else {}
    names = {f.name: f for f in files}
    if spec.get("music") in names:
        choice = spec["music"]
    elif used.get(slug) in names:
        choice = used[slug]
    else:
        counts = {n: sum(1 for v in used.values() if v == n) for n in names}
        choice = min(names, key=lambda n: (counts[n], n))
    used[slug] = choice
    json.dump(used, open(log_path, "w"), indent=1)
    print(f"music: {choice}")
    return names[choice]


def main(vdir, max_frames=None, music_dir=None):
    vdir = Path(vdir)
    spec = json.load(open(vdir / "scenes.json"))
    scenes = {s["id"]: s for s in spec["scenes"]}
    timing = json.load(open(vdir / "audio/timing.json"))
    chunks = json.load(open(vdir / "audio/captions.json"))
    # enforce a minimum shot length by pulling a too-short scene's start earlier
    for i in range(1, len(timing)):
        dur = timing[i]["end"] - timing[i]["start"]
        if dur < MIN_SHOT:
            room = (timing[i - 1]["end"] - timing[i - 1]["start"]) - MIN_SHOT
            shift = min(MIN_SHOT - dur, max(room, 0))
            timing[i]["start"] -= shift
            timing[i - 1]["end"] -= shift
    total = timing[-1]["end"]
    nframes = int(math.ceil(total * FPS))
    if max_frames:
        nframes = min(nframes, max_frames)

    bases = {}
    for sid in scenes:
        img_path = vdir / f"images/scene_{sid:02d}.png"
        if not img_path.exists():
            img_path = img_path.with_suffix(".jpg")  # images kept as JPEG by scripts/short-form/cleanup_videos.py --images jpg
        im = Image.open(img_path).convert("RGB")
        scale = max(W * BUF / im.width, H * BUF / im.height)
        bases[sid] = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)

    # optional real-logo badge per scene ("logo": "netflix" -> assets/logos/netflix.png on a white plate),
    # centred at the top; an overlay on the same scene is then pushed below it
    badges = {}
    for sid, sc_ in scenes.items():
        if sc_.get("logo"):
            lg = Image.open(ROOT / "assets/logos" / f"{sc_['logo']}.png").convert("RGBA")
            lg.thumbnail((520, 170), Image.LANCZOS)
            pad = 26
            plate = Image.new("RGBA", (lg.width + 2 * pad, lg.height + 2 * pad), (0, 0, 0, 0))
            ImageDraw.Draw(plate).rounded_rectangle((0, 0, plate.width - 1, plate.height - 1), 28, fill=(255, 255, 255, 240))
            plate.alpha_composite(lg, (pad, pad))
            badges[sid] = plate
    overlays = {sid: build_overlay(sc_["overlay_text"]) for sid, sc_ in scenes.items() if sc_.get("overlay_text")}

    out = vdir / "output" / f"{spec['slug']}.mp4"
    out.parent.mkdir(exist_ok=True)
    track = pick_music(spec, spec["slug"], Path(music_dir) if music_dir else ROOT / "assets/music")
    music = [track] if track else []
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-i", str(vdir / "audio/voice.wav")]
    if music:
        cmd += ["-stream_loop", "-1", "-i", str(music[0]),
                "-filter_complex",
                f"[2:a]volume=0.22,afade=t=in:d=0.6,afade=t=out:st={max(total - 1.8, 0):.2f}:d=1.8[m];"
                "[m][1:a]sidechaincompress=threshold=0.04:ratio=10:attack=20:release=300[mc];"
                "[1:a][mc]amix=inputs=2:duration=first:normalize=0[a]",
                "-map", "0:v", "-map", "[a]"]
    else:
        cmd += ["-map", "0:v", "-map", "1:a"]
    cmd += ["-t", f"{min(total, nframes / FPS):.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    si = 0
    for f in range(nframes):
        t = f / FPS
        while si + 1 < len(timing) and t >= timing[si + 1]["start"]:
            si += 1
        seg = timing[si]
        sc = scenes[seg["id"]]
        p = min(max((t - seg["start"]) / max(seg["end"] - seg["start"], 1e-3), 0), 1)
        motion = sc.get("motion", "none")
        moves = sc.get("moves")
        if moves:
            k = min(int(p * len(moves)), len(moves) - 1)
            motion = moves[k]
            p = min(max(p * len(moves) - k, 0), 1)
        img = frame_image(bases[seg["id"]], motion, p, t)
        y_ovl = OVL_Y
        if seg["id"] in badges:
            bd = badges[seg["id"]]
            img.paste(bd, ((W - bd.width) // 2, 40), bd)
            y_ovl = 40 + bd.height + 24
        if seg["id"] in overlays:
            lay = overlays[seg["id"]]
            img.paste(lay, (0, y_ovl), lay)
        for ch in chunks:
            if ch["start"] - 0.02 <= t < ch["end"] + 0.12:
                draw_caption(img, ch, t)
                break
        proc.stdin.write(np.asarray(img).tobytes())
    proc.stdin.close()
    proc.wait()
    print(f"wrote {out} ({nframes} frames, {nframes / FPS:.1f}s)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Assemble a 16:9 long-form video from videos/long-form/<slug>.")
    ap.add_argument("vdir", help="videos/long-form/<slug> folder")
    ap.add_argument("--frames", type=int, help="render only the first N frames (test renders)")
    ap.add_argument("--music-dir", help="music folder (default assets/music)")
    a = ap.parse_args()
    main(a.vdir, a.frames, a.music_dir)
