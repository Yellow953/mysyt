"""CAREFUL cleanup for long-form projects in videos/long-form/<slug>/ (Joe, 2026-11-04). Dry run by default.

Usage:
  .venv/bin/python scripts/long-form/cleanup_lf.py <slug> [<slug> ...]            # dry run: prints every path it would remove
  add --apply                 really delete
  add --images delete         delete images/ (default: convert PNG scenes to small JPEG so a re-render stays possible)
  add --images keep           leave images alone
  add --audio clips           also delete audio/clips/ (voice.wav, timing and captions are always kept)

Safety: needs an explicit slug (never a default sweep); refuses unless output/*.mp4, thumbnail/thumbnail.png and upload.md exist.
Deletes ONLY: older/test renders and stray images in output/, and backup/scratch folders named _orig*, _old*, _tmp*, _scratch*.
Always kept: every .md/.json/.txt, thumbnail/, upload.md, voice.wav, segments/timing/captions, the newest mp4.
"""
import argparse
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
LF = ROOT / "videos" / "long-form"


def mb(n):
    return f"{n / 1e6:.1f} MB"


def size(p):
    return sum(f.stat().st_size for f in p.rglob("*") if f.is_file()) if p.is_dir() else p.stat().st_size


def plan(vdir, images, audio):
    out = vdir / "output"
    mp4s = sorted(out.glob("*.mp4"), key=lambda p: p.stat().st_mtime) if out.exists() else []
    final = mp4s[-1] if mp4s else None
    problems = []
    if final is None:
        problems.append("no final mp4")
    if not (vdir / "thumbnail" / "thumbnail.png").exists():
        problems.append("no thumbnail/thumbnail.png")
    if not (vdir / "upload.md").exists():
        problems.append("no upload.md")
    if problems:
        return None, [], problems
    delete = list(mp4s[:-1])
    delete += [f for f in out.glob("*") if f.is_file() and f.suffix.lower() in {".png", ".jpg"}]
    for f in vdir.rglob("*"):
        if f.is_dir() and f.parent.name != "output" and f.name.startswith(("_orig", "_old", "_tmp", "_scratch")):
            delete.append(f)
    if images == "delete" and (vdir / "images").exists():
        delete.append(vdir / "images")
    if audio == "clips" and (vdir / "audio" / "clips").exists():
        delete.append(vdir / "audio" / "clips")
    return final, delete, []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slugs", nargs="+")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--images", choices=["delete", "jpg", "keep"], default="jpg")
    ap.add_argument("--audio", choices=["keep", "clips"], default="keep")
    a = ap.parse_args()
    freed = 0
    for slug in a.slugs:
        v = LF / slug
        if not v.is_dir():
            print(f"{slug}: not found in videos/long-form, skipped")
            continue
        final, delete, problems = plan(v, a.images, a.audio)
        if final is None:
            print(f"{slug}: safety check failed ({', '.join(problems)}), skipped")
            continue
        s = sum(size(p) for p in delete)
        jpg = 0
        if a.images == "jpg" and (v / "images").exists():
            jpg = sum(p.stat().st_size for p in (v / "images").glob("*.png")) * 0.9
        freed += s + jpg
        print(f"{slug}: keep {final.name} + all text/thumbnail/voice.wav; remove {len(delete)} items {mb(s)}" + (f" + ~{mb(jpg)} from JPEG images" if jpg else ""))
        for p in delete:
            print(f"    - {p.relative_to(v)}")
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
