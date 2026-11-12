# Danny Why "cutout-cartoon-shorts" method vs ours (2026-11-04)

Source: guide Joe pasted (Danny Why; skill `cutout-cartoon-shorts`, example "Can we throw trash in a volcano?").

## What it is
Every pose/prop/set piece = its own transparent PNG (Higgsfield `gpt_image_2_5`, `background: transparent`). Remotion (React) animates them: 2.5D multiplane camera, squash/anticipation pose swaps, real projectile physics, code-drawn effects (smoke, lava, sweat, faces on objects), SFX layer. 10-20 s, 60 fps, 4K.

## Comparison
| | Ours now | Cut-out method |
|---|---|---|
| Image unit | one finished full scene per beat (0.5 cr) | transparent sprites: poses, props, sets (4.25 cr at 4K/high) |
| Motion | Ken Burns zoom/pan on stills (Pillow + ffmpeg, 30 fps) | characters actually move (swap/squash, physics, effects) |
| Length | ~55-105 s, 8-12 scenes | 10-20 s, 4-6 lines, ~30 words |
| Script | story, many locations | one premise, one gag per line, frame 0 = premise, ends looping to frame 0 |
| Voice | Grady/ElevenLabs phrase by phrase + tags | ElevenLabs one take, plain text, no tags, no hype words/"!" |
| Sound | music bed only | SFX layer synced to actions (whoosh, plop, boom in a pause) |
| Cost/video | ~8-9 credits (55 s) = ~0.15 cr/s | ~50 credits (13 s) = ~3.8 cr/s as published |
| Reuse | none, every scene new | pose/prop library reusable across videos |

## Honest findings
- "Costs less" is NOT true as published: 4K + high quality is ~5x our per-image price and ~25x per second. It can be cheap only if (a) quality low/medium at 1k-2k (comp is 1080 wide), (b) poses are reused across videos. Needs a measured test.
- Our bottleneck (learnings H2/H6): 80% swiped in the first second, distribution not retention. Moving characters, premise at frame 0, short length and a seamless loop attack exactly that. Unproven on our channel.
- Mr Yellow Scarf (white round head, dot eyes, stick limbs) is almost the same character type as their example, ideal for cut-outs. Use the element tag; scarf must stay.
- Fit: best for single-location, single-gag premises (thought experiments, one-object gags). Poor fit for our multi-location history stories (levels, day-in-the-life) without rewriting them as 15-25 s one-scene bits.
- gpt_image_2_5 on our Higgsfield MCP: params variant flare/sunburst, quality low..max, resolution 1k/2k/4k, background auto/opaque/transparent. Transparent supported. Credit price per quality tier NOT yet measured.
- Remotion is not installed (node 26 + ffmpeg present).

## Steal immediately (no new tooling)
1. Script: frame 0 states the premise; plain talking words; no hype words; one gag per beat; last line loops to first.
2. SFX layer synced to beats, big sound inside a pause.
3. Shorter (15-25 s) as a length test.
4. Measure RMS pauses instead of trusting Whisper edges (we already use exact clip times).

## Proposed test (one change per batch)
Batch of 3 Shorts, ~20 s, cut-out + Remotion, single-location thought-experiment premises; compare swiped-away % and avg % viewed with batch 1 and the Nintendo/Kodak/Netflix baseline. Pilot first: 1 video, quote credits at quality medium/2k, build a reusable pose pack (~8 poses) for the mascot.

## Joe's decisions (2026-11-04)
Pilot approved with changes: keep our normal image quality/model (gpt_image_2, 0.5 cr; no 4K/high), Remotion for the edit, multi-location is fine, cut-outs made LOCALLY (scripts/short-form/cutout.py: generate on flat magenta #FF00FF, key it with numpy/scipy, no extra credits). Remotion project in /remotion.

## His research/script/packaging (Step 1 prompt) vs ours
Worth taking: (1) idea filter "a simple solution that makes people wonder why nobody does it / the obvious answer is wrong" + must be explainable in 20-30 s, needs no background knowledge and EASY TO SHOW in 2D (we had no explicit visualizability test at idea stage); (2) the model picks the best of several researched ideas by itself and checks earlier ideas to avoid repeats (we have video-log + backlog); (3) honest rule: if it cannot browse, say so; verify with primary sources (ours is stronger: claim tables); (4) script: opens on a specific question/statement, short connected spoken sentences, every sentence adds info, ban "Did you know / blow your mind", no CTA, answer near the end; casual voice, no hype words, no "!" (Step 2).
Not useful / weaker than ours: ideas are generic "surprising facts" picked cold, not grounded in proven outliers (ours: competitors.md); nothing on title or thumbnail (only the example title is a plain question; the frame-0 premise IS the cover in the Shorts feed).
