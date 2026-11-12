# Cost: 2026-10-27-farming-worst-deal
- Model: gpt_image_2 (low quality, 1k, 752x1344), 0.5 credits/image.
- 12 final images + 3 style tests (ink style) = 15 generations ≈ 7.5 credits. No redos needed.
- Voice, captions, edit: local, 0 credits. Music: none yet (awaiting Joe's approval of a track).

## Voice (2026-10-27)
- Voice switched from Kokoro am_puck to Grady (Higgsfield text2speech_v2, variant elevenlabs) at Joe's request (more emotion). 4 voice samples + 1 tag test + 22 phrase clips (one per phrase, emotion tags like [deadpan], pauses added locally, exact phrase times drive captions).
- Pipeline: scripts/shared/build_voice.py (clips + performance.json -> voice.wav + segments.json), scripts/shared/captions.py (uses segments.json), scripts/short-form/assemble.py. Tags are not spoken aloud (verified by transcribing every clip); their audible effect is judged by Joe.
- v2 render: 57.4 s, shots 2.9-8 s. Previous renders kept: output/v1_fast_voice.mp4 (Kokoro, fast).
- v3 (2026-10-27): + CTA (2 extra Grady clips), dropped "Then came farming.", pauses x0.85, country music bed (volume 0.22, ducked). 58.5 s. Files: output/v3_grady_country_cta.mp4. Scene 13 reuses scene 10's image.
