# Production notes v4 (2026-11-14). Render-ready, NOT rendered, NOT uploaded.
v3 (flat beige ink look) is in v3_archive/ (audio, images, qc, output, old public/mnylf copy, old code). v1 in v1_archive/.

## What changed from v3 (Joe's complaints)
- Narration = script.md VERBATIM (48 rows, 797 words); audio/performance.json built from the table, [pause] -> "..." in the TTS prompt + pause 0.8 s after row 5. check_clips: 0 flags.
- Look = seawater/emu-war: glossy painted saturated 16:9 backgrounds (gpt_image_2 low 1k, same style block as script-writer SKILL.md) with the standard mascot. Side characters are simple tan-headed stick figures (v3 sprites reused: cashier, doctor, farmer, baker, barber, rich people, ... + new engineer/electrician/builder/mechanic/farmer2/shoemaker2).
- 15 whole illustrations (rows 1,3,4,6,8,14,21,22,26,30,32,37,42,44,47, several cut into 2-5 crops with flash cuts), 7 character-free painted backgrounds (meadow, sunset, shop, storm, night, square, yard) behind cut-out sprites for CUT rows. 0 regenerations, no local patching.
- Hook (rows 1-5): night city + clock push; code phone with falling bank balance; wallet then code piggy bank that cracks; rich people with zero bubbles; wide "everything still exists" crops; storm + equals; giant $100,000,000,000,000 counter falling to $0 then smash cut to black (boom). Clock tick every second + heartbeat pulse every 1.15 s (audio) + pulsing vignette (video) through the hook.
- Captions: ROOT CAUSE of the v3 lag found and fixed in timeline_mnylf.py: voice.wav is 24 kHz but mlx_whisper assumes a numpy array is 16 kHz, so every word time was x1.5 late (the old OVERRUN guard only squeezed it). Audio is now resampled to 16 kHz first; rerun shows 0 OVERRUN lines. Spot check rows 1,5,12,23,35,48: all word times inside the row segment. Remotion captions read the same mnylfTimeline.json segments; mix has no lead-in offset (voice placed at t=0).
- Music: assets/music/Resolution Or Reflection - The Grey Room, Clark Sims.mp3 looped (178 s -> 398 s, 1.5 s crossfades), ducked under voice; two-pass loudnorm -14.0 LUFS, true peak -3.9 dBTP. Added to used.json.

## Files
- Code: remotion/src/MnyLF.tsx (shots per row in the SHOTS blocks), MnyLFRoot.tsx (MnyLF30 / MnyLF60), mnylfIndex.ts, mnylfTimeline.json, mnylfMeta.json; assets remotion/public/mnylf/ (img_NN.png, bg_*.png, sprites, wav SFX); remotion/mnylf_stills.mjs.
- Scripts: scripts/long-form/timeline_mnylf.py, mix_mnylf.py, split_sheet_mnylf.py, make_sfx_mnylf.py; render case money2 in render_pending.sh.
- Audio: audio/clips/01-48.mp3, performance.json, prompts.json, voice.wav 395.9 s, segments.json, mix.wav (total video 398.1 s = 6:38).
- Images: images/raw (ILL + bg), images/sprites_raw (2 sheets), images/sprites; qc/stills_sheet1.png, stills_sheet2.png (24 frames). Thumbnail unchanged (thumbnail/thumbnail.png).
- captions.py is NOT used (it needs a Shorts scenes.json): captions come from timeline_mnylf.py word times.

## Render (Joe runs it, one render at a time)
`bash scripts/long-form/render_pending.sh money2` (8 chunks of 2986 frames of 23887 at 60 fps, 1920x1080, resumable, muxes audio/mix.wav).

## Weak spots
- 398 s is longer than the usual 5 min, by Joe's choice (exact script).
- Sprites come from 1k sheets: people slightly soft at ~470 px; fine at 1080p.
- Zero "bubbles" in row 3 are red rings (read as 0), not digits. Hook counters are the only digits on screen.
- Long rows (23, 29, 31, 35, 40) have 2-3 parts with white-flash cuts but no motion in sprites beyond idle; SFX timing/flash not viewed in motion.
- Row 4 and 44-47 reuse the same bg_square/sunset backdrops several times.
