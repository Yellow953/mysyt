"""Long-form YouTube upload with automatic retry/resume (network blips killed the plain uploader on 2026-11-04).
Usage: .venv/bin/python scripts/long-form/upload_lf.py <slug> [--dry-run] [--category 27]
Reads videos/long-form/<slug>/upload.md (same format as the Shorts uploader), uploads PRIVATE, then sets the thumbnail after
processing. Reuses parse_pack/credentials from scripts/short-form/youtube_upload.py (unchanged)."""
import argparse, importlib.util, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
spec = importlib.util.spec_from_file_location("yu", ROOT / "scripts/short-form/youtube_upload.py")
yu = importlib.util.module_from_spec(spec)
spec.loader.exec_module(yu)

ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("--dry-run", action="store_true")
ap.add_argument("--category", default="27")
a = ap.parse_args()

title, desc, video, thumb, tags = yu.parse_pack(a.slug)
for p in (video, thumb):
    if not p.exists():
        sys.exit(f"Missing file: {p}")
print(f"Title: {title} ({len(title)} chars)\nVideo: {video} ({video.stat().st_size/1e6:.0f} MB)\nThumb: {thumb}\nTags: {tags}\nVisibility: private")
if a.dry_run:
    sys.exit("Dry run, nothing uploaded.")

from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

yt = build("youtube", "v3", credentials=yu.credentials())
body = {"snippet": {"title": title, "description": desc, "tags": tags, "categoryId": a.category,
                    "defaultLanguage": "en", "defaultAudioLanguage": "en"},
        "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": False, "containsSyntheticMedia": False}}
req = yt.videos().insert(part="snippet,status", body=body,
                         media_body=MediaFileUpload(str(video), chunksize=4 * 1024 * 1024, resumable=True))
resp, fails = None, 0
while resp is None:
    try:
        status, resp = req.next_chunk(num_retries=5)
        if status:
            print(f"  {int(status.progress() * 100)}%", flush=True)
    except Exception as e:  # broken pipe / connection reset / 5xx: resume from the server's offset
        fails += 1
        if fails > 25:
            sys.exit(f"Giving up after {fails} network errors: {e}")
        print(f"  network error ({type(e).__name__}), resuming in 5 s [{fails}]", flush=True)
        time.sleep(5)
vid = resp["id"]
print(f"Uploaded (private): https://youtu.be/{vid}", flush=True)
for _ in range(36):
    st = yt.videos().list(part="processingDetails", id=vid).execute()["items"][0]["processingDetails"]
    if st.get("processingStatus") in ("succeeded", "failed", "terminated"):
        break
    time.sleep(10)
time.sleep(10)
try:
    yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(thumb))).execute()
    print("Thumbnail set (after processing). Check it in Studio.")
except Exception as e:
    print(f"Thumbnail not set ({e}). Add it in Studio.")
print(f"Studio: https://studio.youtube.com/video/{vid}/edit")
