# Production notes: boss v3 (2026-11-14)
- Script: Joe's ChatGPT script, verbatim (46 clips, 813 words). Data + prompts: scripts/long-form/boss2_data.py
- Voice: Grady, audio/clips/NN.mp3 -> check_clips.py (0 suspicious) -> build_voice.py (385.2 s) -> scripts/long-form/timeline_boss2.py (word timestamps, 16 kHz fix inherited) -> remotion/src/boss2Timeline.json (387.4 s total)
- Art: 35 bright whole illustrations (one per row, reused across rows), images/raw/<id>.png -> remotion/public/boss2/img_<id>.png (1920x1080). 5 boss images (d5,d6,e4,f3,f5) redone because the boss drifted to a realistic look; first versions in images/raw_v1_first/.
- Composition: remotion/src/Boss2LF.tsx (ids Boss230 / Boss260), several camera shots per row (wide push, left/right close crops, pull-out), 0.14 s crossfade, NO flash overlays, captions word-highlighted.
- Audio: scripts/long-form/mix_boss2.py -> audio/mix.wav (-14.0 LUFS, TP -3.9). Music: Mirror Mirror - Anno Domini Beats (looped, ducked); soft whooshes only where the picture changes.
- Render (Joe): `bash scripts/long-form/render_pending.sh boss2`  (6 chunks of 3874 frames, resumable, progress lines) -> output/pov-boss-laughed-idea.mp4
- Older versions: v1 and v2 (Shelf Clip script) in v2_archive/ and output/v1_rejected/
