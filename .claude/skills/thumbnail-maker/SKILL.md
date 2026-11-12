---
name: thumbnail-maker
description: Create Mr. Yellow Scarf thumbnails (long-form 16:9 variants and Shorts covers) in Google Flow (free) from the approved thumbnail concepts. Write Flow-ready prompts, then QC the images Joe brings back. Local Pillow text is only a fallback. Use when Joe says "thumbnails" or after a video is rendered.
---

# Thumbnail Maker (Google Flow route, Joe 2026-11-12)

Read `memory/short-form/learnings.md` (Packaging; those rules override this file) and playbook §4. Concepts come from the video's `script.md` (Shorts) or the long-form packaging stage.

**Why Flow:** Joe tested Google Flow (labs.google/flow) on 2026-11-12 (TOO COLD?! mammoth, LOST IN JUNGLE?). It keeps the character and renders the headline text well, and it's free. **Thumbnails NO LONGER use Higgsfield credits.** They no longer have to be cropped from scene images either (that 2026-10-27 rule is retired).

## 1. Write the Flow prompts
**Concepts first:** every thumbnail opens an information gap (the image raises a question the video answers) and must read at ~120 px wide. Brainstorm ≥ 5 concepts across these frameworks before choosing (combining 2 is fine): before/after split · three-step progression · posed portrait (big face, extreme emotion) · posed action mid-moment · "DAY N" badge (a day late in the story) · simple chart · landscape as the hero · map/route · object as the answer to the title · text callout · many copies of one object · extreme size difference (giant vs tiny) · generic "breaking news" banner (no real network) · one real element exaggerated (plausibly). It may exaggerate but must honestly represent the video.
One prompt per concept: 3 for long-form (each a DIFFERENT promise: consequence / contrast or scale / unanswered question, not colour variants), 1 for a Shorts cover. Save them in `<video folder>/thumbnail/flow-prompts.md` and show them to Joe.

Template (fill every [slot]; English; text in quotes is exact):
```
YouTube thumbnail, [16:9 | 9:16 vertical]. Mr. Yellow Scarf (the saved character / attached reference): plain white perfectly round head, eyes are two small SOLID BLACK DOTS (no eyelids, no pupils, no eye whites), simple eyebrows, VERY THIN black stick-line arms and legs with tiny simple round hands (no gloves), bright yellow scarf around his neck, [costume]. He has an EXTREME [emotion: shock / terror / panic / disgust / smug / awe] face with sweat drops, drawn LARGE (about half the frame, chest-up) on the [right | left] third. [What he reacts to: one clear secondary subject, e.g. a woolly mammoth behind him]. Background: vivid saturated [setting], glossy cartoon digital painting, thick dark outlines, high contrast, single clear focal point. Huge bold headline text at the [top-left | top] reading exactly "[2-4 WORDS]": chunky condensed letters, yellow-to-orange gradient fill with a thick black outline[, themed decoration such as icicles / vines / sand], never covering his face. No other text, no logos, no watermark. Keep the bottom-right corner clear.
```
- Headline: 2-4 words, adds to the title (never repeats it); a question or exclamation works ("TOO COLD?!").
- Shorts covers (9:16): all text between 12% and 88% of the height (Studio crops the top/bottom), face in the upper-middle.
- Real brand videos: leave a blank sign area and composite the real logo locally (logo rule in learnings).

## 2. Generation (Joe in Flow)
Joe pastes each prompt in Flow with the saved Mr. Yellow Scarf character, picks the best take, downloads it to `<video folder>/thumbnail/` (long-form: `thumb_A.png`, `thumb_B.png`, `thumb_C.png`; Shorts: `output/thumbnail.png`). Claude may drive Flow through Claude in Chrome only if Joe says so for that session.

## 3. QC (Claude)
Check each image at full size AND at 160x90 (`sips -Z 160` copy):
- headline spelled exactly; no stray text, logos or watermark
- character correct: round white head, dot eyes, stick limbs, yellow scarf
- emotion and the secondary subject readable at 160 px; bottom-right corner clear
- 16:9 at ≥ 1280x720 (YouTube max 2 MB per thumbnail upload: if bigger, save as high-quality JPEG)
If the text is misspelled: ask Joe for one re-roll, or remove the text and use the fallback overlay.

**Fallback (local, free):** `.venv/bin/python scripts/short-form/thumbnail.py <image> "LINE 1" "LINE 2" --out ... [--size 1280x720]` puts Pillow text on a clean image or a scene image.

## Hand over
Show the variants side by side with the concept behind each and recommend which to upload first. Long-form: Joe runs YouTube Test & Compare with all 3 (it picks by watch-time share; not available for Shorts). Log `thumbnail_style` (e.g. `flow-emotion-right-text-topleft`) in `video-log.csv`.
