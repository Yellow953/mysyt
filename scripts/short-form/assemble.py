"""Assemble a vertical Short: scene images + camera motion + burned-in captions + voice (+ music).

Usage: .venv/bin/python scripts/short-form/assemble.py videos/short-form/<slug> [--frames N]   (--frames renders only the first N frames, for tests)

Needs videos/short-form/<slug>/{scenes.json, audio/voice.wav, audio/timing.json, audio/captions.json, images/scene_XX.png}
Optional music: assets/music/*.mp3|wav (first file, ducked under the voice).
This ffmpeg has no libass/drawtext, so motion and captions are drawn with Pillow and piped to ffmpeg.
"""
import json
import math
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
BUF = 1.2                      # image buffer scale so zoom/pan never shows edges
MIN_SHOT = 1.1
YELLOW, WHITE, BLACK = (255, 214, 10), (255, 255, 255), (0, 0, 0)
FONT = "/System/Library/Fonts/Supplemental/Impact.ttf"
FONT_SMALL = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
CAP_Y = int(H * 0.73)          # caption centre line (below most faces/props, above the Shorts buttons)
ROOT = Path(__file__).resolve().parent.parent.parent


def ease(p):
    return p * p * (3 - 2 * p)


def camera(motion, p, t):
    """-> (zoom factor >= 1, dx, dy) with dx, dy in fractions of the spare margin (-1..1)."""
    if motion == "zoom_in":
        return 1.0 + 0.05 * ease(p), 0, 0
    if motion == "zoom_out":
        return 1.05 - 0.05 * ease(p), 0, 0
    if motion == "pan_left":
        return 1.07, 0.8 - 1.6 * ease(p), 0
    if motion == "pan_right":
        return 1.07, -0.8 + 1.6 * ease(p), 0
    if motion == "shake":
        return 1.05, 0.3 * math.sin(t * 14), 0.3 * math.cos(t * 11)
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


def _font(size):
    if size not in _fonts:
        _fonts[size] = ImageFont.truetype(FONT, size)
    return _fonts[size]


SIDE_MARGIN = 80  # px kept free on each side so captions never touch the screen edge


def draw_caption(img, chunk, t, font=None):
    """Draw one caption chunk, shrinking the font until it fits inside the safe margins."""
    d = ImageDraw.Draw(img)
    words = chunk["words"]
    size = 112
    while True:
        f = _font(size)
        gap = round(size * 0.23)
        stroke = max(5, round(size / 12.5))
        widths = [d.textlength(w["text"], font=f) for w in words]
        total = sum(widths) + gap * (len(words) - 1)
        if total + 2 * stroke <= W - 2 * SIDE_MARGIN or size <= 56:
            break
        size -= 4
    x = (W - total) / 2
    for w, wd in zip(words, widths):
        active = w["start"] <= t < w["end"]
        d.text((x, CAP_Y), w["text"], font=f, fill=YELLOW if active else WHITE, stroke_width=stroke,
               stroke_fill=BLACK, anchor="ls")
        x += wd + gap


def pick_music(spec, slug):
    """Music rotation: scenes.json "music" (file name in assets/music) wins; otherwise reuse the track already
    used for this slug, else the least-used track (ties: first by name). Usage is saved in assets/music/used.json."""
    mdir = ROOT / "assets/music"
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


def main(vdir, max_frames=None):
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
    cap_font = ImageFont.truetype(FONT, 112)
    ovl_font = ImageFont.truetype(FONT_SMALL, 90)
    # optional real-logo badge per scene ("logo": "netflix" -> assets/logos/netflix.png on a white plate)
    badges = {}
    ovl_cache = {}
    for sid, sc_ in scenes.items():
        if sc_.get("logo"):
            lg = Image.open(ROOT / "assets/logos" / f"{sc_['logo']}.png").convert("RGBA")
            lg.thumbnail((520, 170), Image.LANCZOS)
            pad = 26
            plate = Image.new("RGBA", (lg.width + 2 * pad, lg.height + 2 * pad), (0, 0, 0, 0))
            ImageDraw.Draw(plate).rounded_rectangle((0, 0, plate.width - 1, plate.height - 1), 28, fill=(255, 255, 255, 240))
            plate.alpha_composite(lg, (pad, pad))
            badges[sid] = plate

    LOUDNORM = "loudnorm=I=-14:TP=-1.5:LRA=11"
    out = vdir / "output" / f"{spec['slug']}.mp4"
    out.parent.mkdir(exist_ok=True)
    track = pick_music(spec, spec["slug"])
    music = [track] if track else []
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-", "-i", str(vdir / "audio/voice.wav")]
    if music:
        cmd += ["-stream_loop", "-1", "-i", str(music[0]),
                "-filter_complex",
                f"[2:a]volume=0.22,afade=t=in:d=0.6,afade=t=out:st={max(total - 1.8, 0):.2f}:d=1.8[m];"
                "[m][1:a]sidechaincompress=threshold=0.04:ratio=10:attack=20:release=300[mc];"
                "[1:a][mc]amix=inputs=2:duration=first:normalize=0[a0];"
                f"[a0]{LOUDNORM}[a]",
                "-map", "0:v", "-map", "[a]"]
    else:
        # 2026-11-12: level the final mix to YouTube loudness (Remotion mixes already did this)
        cmd += ["-filter_complex", f"[1:a]{LOUDNORM}[a]", "-map", "0:v", "-map", "[a]"]
    cmd += ["-ar", "48000"]
    cmd += ["-t", f"{total:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
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
        d = ImageDraw.Draw(img)
        oy = 150
        if seg["id"] in badges:
            bd = badges[seg["id"]]
            img.paste(bd, ((W - bd.width) // 2, 110), bd)
            oy = 110 + bd.height + 70
        if sc.get("overlay_text"):
            # "LEVEL 3 — PETTY OFFICER" -> two lines (label in yellow, title in white), each auto-fit to the safe margins
            key = (seg["id"], oy)
            if key not in ovl_cache:
                parts = [x.strip() for x in sc["overlay_text"].split(" — ")]
                layer = Image.new("RGBA", (W, 330), (0, 0, 0, 0))
                ld = ImageDraw.Draw(layer)
                fonts, widths = [], []
                for li, part in enumerate(parts):
                    size = 90 if li == 0 or len(parts) == 1 else 84
                    while size > 40:
                        f_ = ImageFont.truetype(FONT_SMALL, size)
                        if ld.textlength(part, font=f_) + 24 <= W - 2 * SIDE_MARGIN:
                            break
                        size -= 4
                    fonts.append(f_)
                    widths.append(ld.textlength(part, font=f_))
                # dark translucent plate so the label stays readable over heads, crowns and bright skies
                pw = max(widths) + 90
                ph = 110 * len(parts) + 40
                ld.rounded_rectangle(((W - pw) / 2, 0, (W + pw) / 2, ph), 36, fill=(0, 0, 0, 130))
                for li, part in enumerate(parts):
                    draw_outlined(ld, ((W - widths[li]) / 2, 110 + li * 110 - 18), part, fonts[li],
                                  YELLOW if (len(parts) > 1 and li == 0) else WHITE, 8)
                ovl_cache[key] = layer
            img.paste(ovl_cache[key], (0, oy - 110 + 18), ovl_cache[key])
        for ch in chunks:
            if ch["start"] - 0.02 <= t < ch["end"] + 0.12:
                draw_caption(img, ch, t, cap_font)
                break
        proc.stdin.write(np.asarray(img).tobytes())
    proc.stdin.close()
    proc.wait()
    print(f"wrote {out} ({nframes} frames, {nframes / FPS:.1f}s)")


if __name__ == "__main__":
    n = None
    if "--frames" in sys.argv:
        n = int(sys.argv[sys.argv.index("--frames") + 1])
    main(sys.argv[1], n)
