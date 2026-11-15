# Production notes: pov-island-only-women (2026-11-15)
- Script: Joe's pasted script, VERBATIM (54 clips, 856 words, voice 407 s, total 409.2 s). Data: scripts/long-form/island_data.py
- Voice: audio/clips/NN.mp3 (check_clips 0 suspicious) -> build_voice.py -> scripts/long-form/timeline_island.py -> remotion/src/islandTimeline.json
- Visual plan (50/50 rule): 30 CUT rows (painted bg + moving sprites) and 24 ILL rows (22 whole illustrations, several camera crops per row). Plan table is the CUT/ILL dicts in remotion/src/IslandLF.tsx.
- Sprites: mascot m_* from mnylf; Amazon women w_* and queen q_* cut from two magenta sheets (images/sprites). Meta: remotion/src/islandMeta.json (sprite_meta.py).
- Women look: approved glamorous style, tier 2 (visual-brief.md). Night scenes done as bright daylight (no-dark rule).
- Audio: scripts/long-form/mix_island.py -> audio/mix.wav (-14 LUFS), music Mediterranean View (ducked), soft whooshes, a few beat SFX.
- Render (Joe): `bash scripts/long-form/render_pending.sh island` (6 chunks, resumable) -> output/pov-island-only-women.mp4
- Stills check: scripts remotion/island_stills.mjs <outdir> <frames...>
- Known weak spots: sprite w_leap/w_cheer duplicates unused; i03/i05/i08 are the most revealing images (swap if YouTube limits ads).
