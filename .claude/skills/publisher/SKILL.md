---
name: publisher
description: Prepare a finished Mr. Yellow Scarf video for YouTube as an "upload pack" (final title, description, tags, thumbnail, settings checklist) that Joe uploads manually in YouTube Studio. Use when Joe says "upload it", "publish", or "get it ready for YouTube".
---

# Publisher

**Current mode: API-PRIVATE** (set up 2026-10-30). `scripts/short-form/youtube_upload.py` uploads to the channel as **private** (title, description, hashtags, thumbnail from `upload.md`); Joe flips to public or schedules in Studio (unaudited API project = private only). Always ask Joe before uploading (hard rule); run `--dry-run` first, and check `memory/short-form/video-log.csv` that the slug isn't already uploaded/scheduled (a test upload once duplicated Kodak). Never publish or change visibility yourself. Manual upload from the pack still works as a fallback.

## 1. Build `videos/short-form/<slug>/upload.md`
- **File:** `videos/short-form/<slug>/output/<slug>.mp4` (+ thumbnail paths)
- **Title (SEO package, Joe 2026-10-31):** search keywords/question first, <= ~60 chars, one ALL-CAPS emphasis word, one emoji, no hashtags, e.g. "What Did Pirates ACTUALLY Do All Day? ☠️".
- **Description:**
  - 2-3 short keyword-rich sentences that promise what the viewer will discover ("Forget X! Discover ... from A and B to C." + emoji). First ~100 chars matter most.
  - One short "Note:" line only for hypotheticals/contested claims. No source dump (sources stay in script.md).
  - For long-form: chapters (`00:00 …`), from the scene timings.
  - Hashtags go in section 3 of upload.md on their own line: 5-8, #Shorts first, then topic/niche/format (#History #DarkHistory #HistoryFacts #Stickman).
- **Tags:** 8–15, topic first then broad.
- **Settings checklist for Joe:**
  - Audience: Not made for kids.
  - Altered or synthetic content: the "realistic" disclosure is only required for realistic people/events. A cartoon is normally **No**, but follow Studio's current wording.
  - Category: Education (or Comedy). Language: English.
  - Shorts: link the related long video once it exists.
  - Long-form: end screen → most related video + subscribe; Test & Compare with all thumbnails.
  - Visibility: what Joe chooses (suggest best time from Studio's "When your viewers are on YouTube" once data exists; until then 14:00–17:00 in the audience's main timezone).
- **Pinned comment draft:** a genuine question viewers want to answer (playbook §7).

## 2. Tell Joe
Show the pack in chat, short. Ask him to reply with the video URL/ID once it's live.

## 3. After Joe uploads
Update the video's row in `memory/short-form/video-log.csv`: `status=published`, `upload_date`, `video_id`, `title`, `title_pattern`, `thumbnail_style`. Mark the backlog idea as used with the slug.

## API mode (ACTIVE)
- Upload: `.venv/bin/python scripts/short-form/youtube_upload.py upload <slug> [--dry-run] [--category 27|23] [--synthetic]` → prints the video URL; thumbnail is set automatically. Then write `video_id` and `status=uploaded-private` to `memory/short-form/video-log.csv`.
- If it says token expired/revoked: Joe runs `... youtube_upload.py auth` (OAuth app is in Testing mode, so the token expires every 7 days; Joe clicks through "unverified app" once).
- Quota: ~1,600 units per upload of 10,000/day. Publishing the OAuth app needs a homepage + privacy-policy URL; skipped on purpose.
- Still to do (optional): compliance audit so scheduled/public uploads work via API.

## Thumbnail is part of EVERY output (Joe, 2026-10-27)
Every finished video ships with a thumbnail. Make it before presenting the upload pack: `.venv/bin/python scripts/short-form/thumbnail.py <best scene image> "LINE 1" "LINE 2" --out videos/short-form/<slug>/output/thumbnail.png` (Shorts 1080x1920; long-form `--size 1280x720`, 2-3 variants). Pick the concept from the reviewed script (contrast character, one emotion, 2-3 words that add to the title, bottom-right clear), look at it, and show it to Joe next to the video and the title/description/pinned comment.


### Update (Joe, 2026-10-27): no new credits for thumbnails
Build the thumbnail from an EXISTING scene image (`images/scene_XX.png`): crop/zoom to the focal figure, or combine two scene images with Pillow, then add the text with `scripts/short-form/thumbnail.py`. Do not call Higgsfield for a thumbnail. If no scene image works as a cover, say so and propose which scene prompt to change before the next video's images are generated.


## Updated 2026-10-28 (Joe)
- When Joe says "generate details": per video give ONLY (1) title, (2) description, (3) hashtags line, (4) video link, (5) thumbnail link (SEO package format, 2026-10-31). See memory/short-form/learnings.md section A, Packaging.
