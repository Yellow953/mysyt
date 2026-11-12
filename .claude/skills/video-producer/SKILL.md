---
name: video-producer
description: Produce a finished video from an approved videos/short-form/<slug>/scenes.json: Higgsfield images with the Mr. Yellow Scarf element, local Kokoro voice, local Whisper captions, local ffmpeg edit with motion, music and burned-in captions. Use when Joe says "produce it" after he approved the script.
---

# Video Producer

Precondition: Joe approved the script. Otherwise stop and run `script-writer`.
Read `memory/short-form/learnings.md` first.

## 0. Budget check
- `balance` → current credits.
- Estimate: images × price per image for the chosen model (check with `models_explore` if not yet known; record the real price in `memory/short-form/learnings.md` → "Joe's preferences / costs" once measured).
- **> 20 credits in this run → ask Joe first.** Write the estimate to `videos/short-form/<slug>/cost.md`.

## 1. Voice (Higgsfield, ~0.15-0.6 credit per clip)
Voice is **Grady** (text2speech_v2, variant elevenlabs, preset voice_id `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678`). Record PHRASE BY PHRASE:
- `audio/performance.json`: list of {text, tag, pause, clip}. Tags ([dry], [deadpan], [excited], [curious], [warm]...) go in front of the text in the prompt; they are not spoken. Pauses 0.3-0.7 s (longer after questions and punchlines).
- Send clips with `generate_audio_batch`, 8 at a time (429 rate limit beyond ~10); resubmit failures in a smaller batch. Download each to `audio/clips/NN.mp3`.
- `.venv/bin/python scripts/shared/build_voice.py videos/short-form/<slug>` → `audio/voice.wav` + `audio/segments.json` (exact phrase times).
- **Measure**: if total > ~55 s, cut the flattest line and re-record just that clip.

## 2. Captions and timing (local, free)
`.venv/bin/python scripts/shared/captions.py videos/short-form/<slug>` reads `segments.json` (no whisper needed; whisper hallucinated on long pauses) → `audio/timing.json` (scene start/end) and `audio/captions.json` (2-3 word chunks, current word highlighted, held ≥ 0.7 s). Check shot lengths: aim 2.5-6 s; merge beats under ~2 s, split beats over ~6 s (two camera moves on the same image: copy the image to a new scene id).

## 3. Images (Higgsfield, credits)
- Model: `gpt_image_2` (0.5 credit, element tag keeps the character). Max 8 concurrent jobs: submit 8, wait, then the rest. After a timeout, check `show_generations` before resubmitting.
- Download to `images/scene_XX.png`, build a contact sheet and QC at >= 300 px per scene: round white head, dot eyes, **yellow scarf as the only YELLOW in a bright, saturated picture (style v4)**, thin stick limbs, **exactly two arms and two hands** (gestures are the risk), no garbled text, no stray signs. Regenerate failures as 2 variants (1 credit) and pick the cleaner one.
- Log credits in `cost.md`.

## 4. Assemble (local, `scripts/short-form/assemble.py`)
- Pillow draws the frames (zoom/pan per scene, captions at ~73% height, auto-fit to 80 px side margins) and pipes to ffmpeg (Homebrew ffmpeg has no libass/drawtext). 1080×1920, 30 fps, H.264/AAC.
- Music (Joe, 2026-10-31): a DIFFERENT track per video, matched to the theme (pirates -> sea shanty, space -> ambient, tech -> cinematic...). Pick from `memory/short-form/music-shortlist.md`, set `"music": "<file in assets/music>"` in scenes.json (assemble.py otherwise rotates least-used and logs to assets/music/used.json). Volume ~0.22, ducked under the voice, fade in/out. YouTube Audio Library tracks need no attribution. Ask Joe before downloading new tracks.
- Shorts: last line leads into the first (loop). Length ≤ ~55 s.

## 5. Check and hand over
- `ffprobe` duration, resolution and audio; extract 4 frames and look at them (captions readable, nothing cut off).
- Open the video for Joe (`open output/<slug>.mp4`).
- Update `cost.md` and add the video's row to `memory/short-form/video-log.csv` with status `rendered`.
- Next: `thumbnail-maker`, then `publisher`.

## Notes 2026-10-27
- Voice: Grady (Higgsfield text2speech_v2 / elevenlabs), one clip per phrase with emotion tags + pauses in `audio/performance.json`; `scripts/shared/build_voice.py` builds `voice.wav` and `segments.json`; `scripts/shared/captions.py` uses exact phrase times; `scripts/short-form/assemble.py` renders (captions auto-fit, music from `assets/music/` ducked under voice).
- Images: gpt_image_2 (0.5 credit) in the approved ink style; max 8 concurrent jobs; check show_generations before resubmitting after a timeout.
- Finish with a thumbnail (see publisher skill) before handing over.

## Notes 2026-10-31 (attraction batch)
- No emoji in scenes.json overlay_text (font shows a box); use "A — B" for long overlays (two auto-fit lines).
- Download Higgsfield files one stream at a time, then verify each PNG decodes (PIL load); resume bad ones with `curl -C -`.
- Split-screen hooks: say "EXACTLY in the middle, two EQUAL halves".
- Scenes over ~9 s: add a `moves` array.

## Notes 2026-11-01 (two-people-restart)
- `text2speech_v2` calls need `variant: "elevenlabs"`; the Audio Library download lands in ~/Downloads/Mr Yellow Scarf/.
- Hook/cover scenes: place the characters in the upper-middle (heads ~35% of the height) so the 73% caption line doesn't cover faces.
- Write ~95-100 words for a 55 s Short (112 words ran 66 s).

## Notes 2026-11-01 (modern-person-in-the-past batch)
- Style v4 is BRIGHT EXPRESSIVE CARTOON (Joe, 2026-11-08; glossy digital paint, vivid sky, big reactions; women glamorous and cheeky per the female-character rule): use the style block in script-writer SKILL.md; QC for anachronisms and wrong props (laptop in 1929, frying pan for a gold pan) and regenerate those scenes (1 credit).
- Higgsfield batches: 8 images / 7-8 audio clips per call; 429s hit 1-2 clips per batch, resubmit only those (do not resend a job that already has an id). Run downloads as ONE sequential background python script (curl -C -), not several shells; `captions.py` needs audio/narration.txt (join performance.json texts); thumbnail text at y 0.64 when the mascot's head is in the upper half.
- Music: Chrome may be disconnected; earlier Audio Library downloads may already sit in ~/Downloads/Mr Yellow Scarf/ (check before asking Joe).
- Music default (Joe, 2026-11-01): Country Music - Hugh Mitchel.mp3 on every video unless he asks for a themed track; supersedes the per-video rotation.

## Notes 2026-11-05 (cut-out animation track, pilot)
- Alternative to the slideshow assemble.py for short (15-35 s) animated Shorts: sprites on magenta (gpt_image_2) -> `scripts/short-form/cutout.py` -> `sprite_meta.py` -> edit `remotion/src/TrashVolcano.tsx` as the template -> render with Chrome (`--browser-executable`). SFX from `make_sfx.py`. Details in learnings.md section D. Joe's choices: same image quality (no 4K), any number of locations, local cut-outs.

## Notes 2026-11-05 (Joe's feedback on cut-out pilot)
- Music: different track per video (Country Music default retired). Cut-out Shorts: render 60 fps, slide transitions instead of hard cuts, anticipation squash on swaps, frame the character with margins, and always add a closing beat that loops to frame 0.
- (2026-11-05, round 2) Cut-out scenes: ground layer in FRONT of set pieces (sunk 25-70 px) with tufts + shadow, ground line low (~73%), captions under it; effects = generated sprites (lava, fire, smoke), not code circles. Template: remotion/src/TrashVolcano.tsx.

## Notes 2026-11-07 (Joe's Emu War feedback)
- Mix colorful illustrations with cut-out animation, vivid palettes, a punchy hook (premise line over a striking image, punch image on the key word), synthesized gun/action SFX, evenly spaced animal groups. Vertical Remotion composition: remotion/src/EmuShort.tsx (9:16, shots in SHOTS, times in shortShots.json). Details: memory/short-form/learnings.md section A 'Illustrated + animated mix'.

## Notes 2026-11-08 (cut-out batch)
- Cut-out Shorts: mix animation with >= 1 whole illustrated image (hook/reveal), strong frame-0 hook with punch, designed thumbnail from that image. Render `--concurrency=1 --gl=angle` (concurrency 3 tiles frames); frame-scan before reporting. Brief template: videos/short-form/2026-11-08-cutout-batch-brief.md.

## Notes 2026-11-12 (Joe adopted the Higgsfield-review learnings)
- **Grady consistency:** in performance.json keep the per-phrase emotion tag ([dry], [curious]...) but put the SAME short delivery line first on every clip of a video (e.g. `[wry conversational storyteller, dry timbre, lively pace, starts speaking immediately]`). The repeated line keeps his tone the same across clips; "starts speaking immediately" removes the lead-in silence. Numbers and dates as WORDS in the clip text. Count each performed bracket ([sighs], [scoffs], [dry laugh]) as ~1 s.
- **Pace gate:** after build_voice, any phrase faster than ~2.9 words/s (words ÷ clip speech time) is rushed: shorten the text and re-record that clip; never speed-change audio.
- **Mix:** `assemble.py` now applies `loudnorm` (−14 LUFS, true peak −1.5) to the final mix for every Short; tested 2026-11-12 (−13.9 LUFS out). After render, check that the music never sits above the voice (listen to the loudest music passage on phone speakers).
- **SFX rule:** each effect must mark something that visibly happens (contact, impact, a reveal, a counter tick); a physical event gets a physical sound; no whoosh on every cut; place it on the visible action, not on the word.
- **Frame check:** spot-check frames at 25/50/75% of the video: the picture on screen must show what is being said at that moment.
