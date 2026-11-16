# Production notes: cattle-rancher-levels (2026-11-15)
- Script: Joe's pasted script, VERBATIM (54 clips, 733 words, voice 340 s, total 342.2 s). Data: scripts/long-form/cattle_data.py
- Voice: audio/clips/NN.mp3 (check_clips 0 suspicious) -> build_voice.py -> scripts/long-form/timeline_cattle.py -> remotion/src/cattleTimeline.json
- Visual plan (50/50 rule): 27 CUT rows (painted bg + moving sprites) and 27 ILL rows (whole illustrations, several camera crops per row). Plan = ILLROWS/CUT tables in remotion/src/CattleLF.tsx.
- Sprites: 24 from 3 magenta sheets (images/sprites), meta remotion/src/cattleMeta.json, public/cattle/. Mascot has a brown cowboy hat in every image/sprite.
- Rule checks: all images bright (mean luma >= 118), no dark overlays, no flash overlays, no on-screen text except captions, scarf only yellow, hay/dry grass orange-tan.
- Audio: scripts/long-form/mix_cattle.py <track> <out> -> audio/<out>.wav (-14 LUFS), voice-ducked music + soft whooshes + a few beat SFX. Auditions: optA Country Music (default, copied to mix.wav), optB Sunshine Cantina, optC Desert Drive. All library tracks were already used; no credits spent on music. To switch: cp audio/optB.wav audio/mix.wav
- Render (Joe): `bash scripts/long-form/render_pending.sh cattle` (6 chunks, resumable, ~1h) -> output/cattle-rancher-levels.mp4
- Stills check: node remotion/cattle_stills.mjs <outdir> <frames at 30fps...>
