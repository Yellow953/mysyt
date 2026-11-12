"""Upload a finished video to YouTube as PRIVATE via the Data API v3.

  .venv/bin/python scripts/short-form/youtube_upload.py auth                 # one-time sign-in (re-run if token expires)
  .venv/bin/python scripts/short-form/youtube_upload.py upload <slug> --dry-run
  .venv/bin/python scripts/short-form/youtube_upload.py upload <slug>        # uploads PRIVATE, sets thumbnail

Reads videos/short-form/<slug>/upload.md (sections 1-4). Joe flips visibility in Studio.
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SECRETS = ROOT / "secrets"


def _vdir(slug):
    """videos/short-form/<slug> (Shorts) or videos/long-form/<slug> (long-form), reorganized 2026-11-04."""
    for kind in ("short-form", "long-form"):
        p = ROOT / "videos" / kind / slug
        if p.exists():
            return p
    return ROOT / "videos" / "short-form" / slug
CLIENT = SECRETS / "client_secret.json"
TOKEN = SECRETS / "token.json"
SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]


def credentials():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials

    if not TOKEN.exists():
        sys.exit("No token yet. Run: .venv/bin/python scripts/short-form/youtube_upload.py auth")
    creds = Credentials.from_authorized_user_file(str(TOKEN), SCOPES)
    if not creds.valid:
        try:
            creds.refresh(Request())
        except Exception as e:
            sys.exit(f"Token expired or revoked ({e}). Re-run the 'auth' command.")
        TOKEN.write_text(creds.to_json())
    return creds


def cmd_auth(_):
    from google_auth_oauthlib.flow import InstalledAppFlow

    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT), SCOPES)
    creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")
    TOKEN.write_text(creds.to_json())
    TOKEN.chmod(0o600)
    print(f"Saved {TOKEN}")


def section(text, n):
    m = re.search(rf"^## {n}\..*?\n(.*?)(?=^## \d+\.|^---|\Z)", text, re.S | re.M)
    if not m:
        sys.exit(f"upload.md: section {n} not found")
    return m.group(1).strip()


def parse_pack(slug):
    """upload.md, new SEO format: 1 Title, 2 Description (code block), 3 Hashtags (#tags), 4 Video, 5 Thumbnail.
    Legacy format (hashtags inside the title line; 3 Video, 4 Thumbnail) still works."""
    text = (_vdir(slug) / "upload.md").read_text()
    title = section(text, 1).splitlines()[0].strip()
    desc = re.search(r"```\n?(.*?)```", section(text, 2), re.S)
    if not desc:
        sys.exit("upload.md: description code block not found")
    desc = desc.group(1).strip()
    third = section(text, 3).strip()
    if third.startswith("#"):
        hashtags = re.findall(r"#(\w+)", third)
        video = Path(section(text, 4).splitlines()[0].strip())
        thumb = Path(section(text, 5).splitlines()[0].strip())
        if third.splitlines()[0].strip() not in desc:
            desc = desc + "\n\n" + third.splitlines()[0].strip()
    else:
        hashtags = re.findall(r"#(\w+)", title)
        video = Path(third.splitlines()[0].strip())
        thumb = Path(section(text, 4).splitlines()[0].strip())
    if len(title) > 100:
        sys.exit(f"Title is {len(title)} chars (max 100)")
    return title, desc, video, thumb, hashtags


def cmd_upload(a):
    title, desc, video, thumb, tags = parse_pack(a.slug)
    for p in (video, thumb):
        if not p.exists():
            sys.exit(f"Missing file: {p}")
    print(f"Title: {title} ({len(title)} chars)\nVideo: {video}\nThumb: {thumb}\nTags: {tags}\nVisibility: private")
    if a.dry_run:
        print("Dry run, nothing uploaded.")
        return

    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload

    yt = build("youtube", "v3", credentials=credentials())
    body = {
        "snippet": {
            "title": title,
            "description": desc,
            "tags": tags,
            "categoryId": a.category,
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": {
            "privacyStatus": "private",
            "selfDeclaredMadeForKids": False,
            "containsSyntheticMedia": a.synthetic,
        },
    }
    req = yt.videos().insert(
        part="snippet,status",
        body=body,
        media_body=MediaFileUpload(str(video), chunksize=8 * 1024 * 1024, resumable=True),
    )
    resp = None
    while resp is None:
        status, resp = req.next_chunk()
        if status:
            print(f"  {int(status.progress() * 100)}%")
    vid = resp["id"]
    print(f"Uploaded (private): https://youtu.be/{vid}")
    # A thumbnail set while YouTube is still processing the video gets overwritten by the auto frame
    # (seen 2026-10-31), so wait for processing to finish, then set it.
    import time
    for _ in range(24):
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


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(required=True)
    sub.add_parser("auth").set_defaults(fn=cmd_auth)
    u = sub.add_parser("upload")
    u.add_argument("slug")
    u.add_argument("--dry-run", action="store_true")
    u.add_argument("--category", default="27", help="27=Education, 23=Comedy")
    u.add_argument("--synthetic", action="store_true", help="set altered/synthetic disclosure")
    u.set_defaults(fn=cmd_upload)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
