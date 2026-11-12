"""Free disk space in videos/short-form/ (Shorts only; long-form: scripts/long-form/cleanup_lf.py): keep only the final video and the small text data.

Usage:
  .venv/bin/python scripts/short-form/cleanup_videos.py                 # dry run on every videos/short-form/<slug> (default, deletes nothing)
  .venv/bin/python scripts/short-form/cleanup_videos.py <slug> ...      # dry run on chosen folders
  add --apply            to really delete
  add --images jpg       keep scene images as small JPEGs (re-render stays possible) instead of deleting them
  add --images keep      leave images/ alone
  add --audio keep       leave the voice clips and voice.wav alone

Always kept: output/<final>.mp4, output/thumbnail.png, script.md, scenes.json, upload.md, cost.md, review.md, audio/performance.json, audio/narration.txt.
Deleted: old versions (output/v*.mp4 and check/contact images, images_old/, _old*/), and (by default) images/ + voice clips + voice.wav + derived json.
Final video = the output/<slug>*.mp4 with the newest modification time.
"""
import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
VIDEOS = ROOT / "videos" / "short-form"   # Shorts only; long-form uses scripts/long-form/cleanup_lf.py
KEEP_ROOT = {"script.md", "scenes.json", "upload.md", "cost.md", "review.md"}
KEEP_AUDIO = {"performance.json", "narration.txt"}


def mb(n):
    return f"{n / 1e6:.1f} MB"


def size(p):
    return sum(f.stat().st_size for f in p.rglob("*") if f.is_file()) if p.is_dir() else p.stat().st_size


def plan(vdir, images, audio):
    out = vdir / "output"
    mp4s = sorted(out.glob("*.mp4"), key=lambda p: p.stat().st_mtime)
    final = None
    for p in reversed(mp4s):
        if p.stem.startswith(vdir.name[:10]) or p.stem == vdir.name or len(mp4s) == 1:
            final = p
            break
    final = final or (mp4s[-1] if mp4s else None)
    delete = []
    if out.exists():
        for f in out.iterdir():
            if f == final or f.name == "thumbnail.png":
                continue
            delete.append(f)
    for f in vdir.iterdir():
        if f.name == "output" or f.name in KEEP_ROOT or f.name in {"audio", "images"}:
            continue
        delete.append(f)  # images_old, _old*, anything else
    if images == "delete" and (vdir / "images").exists():
        delete.append(vdir / "images")
    if audio == "delete" and (vdir / "audio").exists():
        for f in (vdir / "audio").iterdir():
            if f.name not in KEEP_AUDIO:
                delete.append(f)
    return final, delete


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slugs", nargs="*")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--images", choices=["delete", "jpg", "keep"], default="delete")
    ap.add_argument("--audio", choices=["delete", "keep"], default="delete")
    a = ap.parse_args()
    dirs = [VIDEOS / s for s in a.slugs] or sorted(p for p in VIDEOS.iterdir() if p.is_dir())
    freed = 0
    for v in dirs:
        final, delete = plan(v, a.images, a.audio)
        if final is None:
            print(f"{v.name}: no final mp4 found, skipped")
            continue
        s = sum(size(p) for p in delete)
        jpg_saving = 0
        if a.images == "jpg" and (v / "images").exists():
            pngs = list((v / "images").glob("*.png"))
            before = sum(p.stat().st_size for p in pngs)
            jpg_saving = before * 0.9
        freed += s + jpg_saving
        print(f"{v.name}: keep {final.name}; remove {len(delete)} items {mb(s)}" + (f" + ~{mb(jpg_saving)} from JPEG images" if jpg_saving else ""))
        if a.apply:
            for p in delete:
                shutil.rmtree(p) if p.is_dir() else p.unlink()
            if a.images == "jpg" and (v / "images").exists():
                for p in (v / "images").glob("*.png"):
                    Image.open(p).convert("RGB").save(p.with_suffix(".jpg"), quality=85)
                    p.unlink()
    print(("Freed " if a.apply else "Would free ") + mb(freed))
    if not a.apply:
        print("Dry run: nothing deleted. Add --apply to delete.")


if __name__ == "__main__":
    main()
