# Stage 5: Production handoff (after Joe approves script AND packaging)
Prepare, in `videos/long-form/<slug>/`: `scenes.json` (scene breakdown, ~35-50 scenes for 5 min, 16:9), audio performance file (phrase-by-phrase for Grady, same format as Shorts `audio/performance.json`), visual prompts (shared style block, element tag `<<<aa6661ee-d997-489c-9e1b-9b9adbed8c94>>>`), character instructions, thumbnail brief + prompts, upload.md (title, description, hashtags/tags, pinned comment, sources and credits).
Cost estimate -> `cost.md` (images ~0.5 credit each, voice ~0.3/clip, thumbnails ~2-5/concept). STOP and get Joe's OK: any run over 20 credits, any thumbnail spend, any upload.
Tooling gap (audited 2026-11-03): `scripts/short-form/assemble.py` is hard-coded to 1080x1920 and `scripts/short-form/thumbnail.py` defaults to vertical. Do NOT edit them. When the first long-form project reaches production, build separate tools under `scripts/long-form/` (16:9 1920x1080 assembler, 16:9 thumbnail compositor), reuse `scripts/shared/build_voice.py` and `scripts/shared/captions.py` only after checking they are format-agnostic, and ask Joe before creating them. Produce with the `video-producer` skill's conventions (voice Grady, Higgsfield, QC at readable size) without modifying that skill. Upload follows the `publisher` conventions (private upload, Joe schedules).

## Style rules from Joe (2026-11-04)
Captions are the ONLY on-screen text (no overlay_text, no disclaimers, spoken or written; honesty lives in the narration wording + description). Keep image crop/zoom minimal (assemble_lf BUF 1.02, motion <= 3%). Real logos: badge only (logo field) or composited onto signs in the art. Details: memory/long-form/playbook.md "Production style rules".

## Voice QC (2026-11-04)
After recording and BEFORE build_voice.py run scripts/long-form/check_clips.py <folder> (transcribes every clip, flags mismatches). After the final render transcribe the first 45 s of the mp4 audio and compare with the script. Map batch audio results to prompts by prompt text, not order.

## Update 2026-11-06 (Joe)
Production default is now the Remotion cut-out method (see memory/long-form/playbook.md 'Remotion cut-out pipeline for long-form'), scenes >= 5 s, a NEW YouTube Audio Library track each video (not already in assets/music/used.json), 60 fps final. assemble_lf.py (slideshow) is the fallback only.
