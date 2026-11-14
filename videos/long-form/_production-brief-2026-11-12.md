# Production brief (2026-11-12) for the 2 long-forms Joe delegated in full
Joe, 2026-11-12: "proceed with 2 videos until you give me the final video, don't ask me anything, pick what's best for the channel." So produce the video end to end without stopping for approvals. Credits for THIS video are pre-approved up to a **hard cap of 40 credits** (target ≤ 32). **Do NOT upload or publish** anything, and don't touch YouTube Studio.

## Template: copy the seawater long-form (finished 2026-11-08), do not edit its files
- Read `videos/long-form/seawater-desalination/production-notes.md` and `cost.md` first.
- Code to copy (new names, never edit the originals):
  - `remotion/src/SeaLF.tsx`, `SeaLFRoot.tsx`, `sealfIndex.ts`, `sealfTimeline.json`, `sealfMeta.json`
  - assets in `remotion/public/sealf/`
  - `scripts/long-form/split_sheet.py`, `make_sfx_sealf.py`, `mix_sealf.py`
  - `scripts/short-form/cutout.py` and `sprite_meta.py` (read-only use)
- Shared tools:
  - `scripts/shared/build_voice.py`, `scripts/shared/captions.py`
  - `scripts/long-form/check_clips.py` (run it before `build_voice.py`)
  - python is `.venv/bin/python`
- Rules: `memory/long-form/playbook.md`, especially Production style rules, Voice QC, Production directives and Remotion pipeline. Character: CLAUDE.md.

## Pipeline
1. **Performance file:** `audio/performance.json`, one clip per script row, same format as seawater's: `{text, tag, pause, clip, row}`. Strip `[pause]` from the text and use the pause field instead.
2. **Voice:** Grady via Higgsfield `text2speech_v2`, `variant: "elevenlabs"`, preset voice_id `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678` (~0.32 cr per clip).
   - Put the delivery tag in front of the text.
   - Map results to rows by prompt text, never by job order.
   - Download to `audio/clips/NN.mp3`.
   - Run `check_clips.py`, then `build_voice.py`, then `captions.py`.
3. **Art:** style v4, bright expressive cartoon, matching the seawater video. Use the style block in `.claude/skills/script-writer/SKILL.md`.
   - Model `gpt_image_2`, 0.5 cr each, 16:9 for whole illustrations.
   - Put `<<<aa6661ee-d997-489c-9e1b-9b9adbed8c94>>>` in every prompt that shows Mr. Yellow Scarf.
   - Run at most 8 jobs at once. After a timeout, check `show_generations` before resubmitting.
   - Whole illustrations for the rows marked ILL. You may merge adjacent ILL rows into one image, but every on-screen shot must change at least every 5 s.
   - Sprite and prop sheets on flat magenta (#FF00FF) for the CUT rows: `split_sheet.py`, then `cutout.py --global`, then `sprite_meta.py`. Seawater got ~21 sprites out of 6 sheets.
   - QC everything on a contact sheet at readable size:
     - round white head, dot eyes, thin stick limbs, exactly 2 arms and 2 hands
     - the scarf is the ONLY yellow
     - NO readable or garbled text on props or signs; icons only
   - Regenerate failures once.
4. **Remotion composition:** a new prefixed composition, shots driven by word timings like SeaLF. Captions are the ONLY on-screen text, so no `Txt`/`Num` overlays with words. Scene change at least every 5 s, motion at most ~3%, subjects well inside the frame.
5. **SFX and music:**
   - SFX: generate locally like `make_sfx_sealf.py`.
   - Music: every Audio Library track we have is already used, and Studio won't load. So generate ONE instrumental bed with Higgsfield music (`elevenlabs_music` / `models_explore` to find it; force instrumental; length = video length; mood arc taken from the script).
   - Check the price first. Spend at most 4 cr on music. If it costs more, use the least-used track in `assets/music/` and note that in `cost.md`.
   - Mix to about -14 LUFS with the voice on top and the music ducked (~0.2).
6. **Render:** draft at 30 fps half scale, check 6 stills, then the final at 1080p60. Use the Chrome browser executable as in the notes, with `--concurrency=2`, because another render may be running in parallel. Mux the audio.
7. **Final QC:**
   - Transcribe the first 45 s of the final mp4 and compare it with the script.
   - Check the duration.
   - Spot-check 8 frames for text or garbled-art problems.
8. **Thumbnail:**
   - The concept is in the outline/script header.
   - 2 variants with `gpt_image_2` at medium quality, 16:9 (~4 cr), with the element tag. Bold, readable at mobile size.
   - Pick the better one and save it to `thumbnail/thumbnail.png` (1280x720).
   - If text is needed, composite it locally with `thumbnail_lf.py` (one or two words max).
9. **Packaging and records:**
   - `upload.md` in the same format as seawater's: title (given), description, tags, and a pinned comment that includes the fiction/what-if note.
   - `cost.md` with real credits spent.
   - `production-notes.md` with files, render command and problems hit.
   - Add the track to `assets/music/used.json` (or "generated").

## Never
- Upload or publish anything.
- Edit Shorts files, or other projects' code and assets.
- Print secrets.
- Use any "worst deal" wording, which Joe banned.

## Report back (short)
- Final mp4 path, duration and LUFS.
- Thumbnail path.
- Credits spent.
- Any weak spots you could not fix.
