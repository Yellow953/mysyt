# Production notes (2026-11-08)
Finished. Final: output/seawater-desalination.mp4 (1920x1080, 60 fps, 4:51.6, -14.1 LUFS, peak -0.6 dBFS). Raw silent render: output/raw60.mp4.
Code: remotion/src/SeaLF.tsx (+SeaLFRoot.tsx, sealfIndex.ts, sealfTimeline.json, sealfMeta.json), assets remotion/public/sealf/. Tools: scripts/long-form/{split_sheet.py,make_sfx_sealf.py,mix_sealf.py}. Audio: audio/mix14.wav (muxed).
Render: --concurrency=1 --gl=angle --image-format=png --muted, about 38 min.
