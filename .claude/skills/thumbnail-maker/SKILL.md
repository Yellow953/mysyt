---
name: thumbnail-maker
description: Create 2-3 A/B thumbnail variants for a Mr. Yellow Scarf video from the approved thumbnail concepts, using Higgsfield for the art and local Pillow for the text overlay. Use when Joe says "thumbnails" or after video-producer finishes a long-form video (Shorts get one cover frame).
---

# Thumbnail Maker

Read `memory/short-form/learnings.md` (thumbnail rules there override everything) and playbook §4. Concepts come from `videos/short-form/<slug>/script.md`.

## Shorts
Shorts thumbnails matter less (the feed autoplays). Make **one** 1080×1920 cover: the most striking scene image + 2–3 word text. Usually reuse a scene image (0 credits).

## Long-form: 2–3 variants (1280×720, 16:9)
1. **Art (Higgsfield):** one image per concept, no text in the image. Prompt:
   `<<<aa6661ee-d997-489c-9e1b-9b9adbed8c94>>> with an EXTREME [emotion] face, [what he is reacting to], [contrast character: more detailed, attractive or dramatic, reacting], bright saturated [color] background, single clear focal point, thick black outlines, flat colors, hand-drawn 2D cartoon, 16:9, empty space on the [left/right] for text, bottom-right corner empty.`
   Count credits (≤ 20 per run without asking Joe).
2. **Text (local, `scripts/short-form/thumbnail.py`; build on first use):** Pillow overlay, 2–3 words max, huge, yellow #FFD60A with thick black stroke, font from `assets/fonts/` (bold condensed). Never repeat the title's words.
3. **Phone test:** also save a 160×90 copy and look at it. Can you read the words and see the emotion? If not, simplify.
4. Save `videos/short-form/<slug>/output/thumb_A.png`, `thumb_B.png`, `thumb_C.png` (+ `_small` versions).

## Hand over
Show Joe the variants side by side with the concept behind each, and recommend which to upload first. Joe uses YouTube's **Test & Compare** with all of them.
Log `thumbnail_style` in `memory/short-form/video-log.csv`.


## Update 2026-10-27 (Joe): reuse existing images, no new art credits
Step 1 (Art via Higgsfield) is SUSPENDED. Use existing scene images only: choose the scene whose image has the strongest single emotion and empty space at the top; crop/zoom with Pillow (`scripts/short-form/thumbnail.py` already cover-crops to 1080x1920 or `--size 1280x720`), or composite two scene images (e.g. split before/after). Text via `scripts/short-form/thumbnail.py`. Long-form variants: use 2-3 different scene images, not new generations.
