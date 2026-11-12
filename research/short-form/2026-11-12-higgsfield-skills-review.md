# Review: Higgsfield faceless skills + blog (2026-11-12)

Sources: 4 skill files Joe pasted (higgsfield-faceless-production, -faceless-script, -youtube-packaging, higgsfield-explainer), blog higgsfield.ai/blog/faceless-channel-one-prompt (read in full), adilinthewildtempo blog (fetch returned an empty body, no content). Live Higgsfield catalog checked the same day (read-only, 0 credits).

## Verified in the Higgsfield catalog today
- **Music:** `elevenlabs_music_v2_5` (and v2): prompt → music, duration 3-600 s, `force_instrumental`, `batch_size` 1-4 variations. Price not yet quoted.
- **No SFX model** in the audio catalog (search only returned music models; `sonilo_music` is "game pipeline only"). Keep `make_sfx.py`.
- **Explainer presets** (`get_explainer_presets`): 22 styles, all 9:16 (Stickman Cartoon, Whiteboard Doodle, Paper collage, Hand Drawn, Pixel Art...). These belong to the server-side explainer workflow, which generates a video clip per block. That is costly and would not keep our character. Not for us now.
- `/faceless-video` is not a real preset (it falls back to ordinary generation).
- Also exists: `virality_predictor` (scores a finished video's hook, retention risk and engagement), `dubbing`, `reframe` (16:9 → 9:16), `video_analysis_create`. Prices unknown.

## Worth adopting (proposals, need Joe's OK)
### Script
1. **Causal-link test (Stage G review):** every beat must connect to the next with "because / therefore / but / unless". If a link only works as "and another fact", move it, connect it or cut it. The playbook says "developments must follow from each other" but gives no test.
2. **Premise contract for what-if / thought experiments:** "We change [X], keep [Y] fixed, follow [Z], answer [Q]." Allow one stipulated impossible event, then apply consistent consequences with no extra miracles. Clarify ambiguous premises first: diameter vs mass, sudden vs gradual, temporary vs permanent. Often that distinction IS the story.
3. **Outline beats in four fields (Stage E):** current state → change/question → mechanism → visible consequence. This forces every beat to have a picture.
4. **Hook ↔ ending contract:** a time hook needs a time payoff; a "which is worse" hook needs a fair comparison with the same criteria on both sides. The playbook already covers part of this.
5. **50-recipe library** (hook/intro/body/recap/outro): science "what if" oriented. Useful for the long-form what-if pillar and thought-experiment Shorts. Not useful for the T1-T3 competitor-format plan.

### Long-form
6. **Watch-hour math:** the blog recommends 10-minute videos. At ~4 min average watched, 4,000 h takes ~60K views. Our ~5 min format at ~2 min average needs ~120K views. Test: 8-10 min once the format holds.
7. **Open loop roughly every minute**, and the hook opens on the payoff, not on backstory.
8. **Shorts cut from long-form:** each Short teaches one distinct thing (a consequence, a corrected misconception, or a comparison) and works without the long video's intro.

### Higgsfield / production
9. **Original music per video** with `elevenlabs_music_v2_5`, instrumental, length = video length. Prompt = use case + instrumentation + energy arc + ending + exclusions, no artist names. Fixes our recurring music problems: the same track on repeat, Audio Library downloads that need Chrome and Joe's OK, and license checks. Quote the price first.
10. **SFX rule:** each effect must answer "what happened, and why does sound help?" A physical event gets a physical sound. No whoosh on every cut. Place the effect on the visible action, not on the word. Prompt template if we ever get an SFX model: source + material/scale + distance + shape + duration + exclusions.
11. **Loudness:** the Remotion mix scripts already apply loudnorm -14 LUFS, but the slideshow `assemble.py` does not (fixed volume 0.22 only). Add loudnorm there.
12. **Voice continuity:** the docs warn that separately voiced sentences lose flow. Possible test: one Grady clip per 2-3 sentences instead of one per phrase, split by silence detection. Hypothesis only; Joe currently likes phrase-by-phrase.
13. **virality_predictor calibration:** run it on one video we know did well (volcano, 34.5% swiped) and one flop. Trust it before uploads only if it ranks them correctly.
14. **Packaging:** 3 thumbnail/title options must test 3 different promises (consequence / scale-contrast / unanswered question), not colour variants. Title and image do different jobs. YouTube Test & Compare is long-form only and picks by watch-time share.

## Not adopting (conflicts with our rules)
- The "autopilot, decide and announce, no questions" contract. Joe has 3 stops (ideas, outline, script).
- Per-block AI video clips plus server-side assembly. This replaces our character pipeline and costs far more credits.
- Custom or cloned voice. Grady is the brand.
- About 20 Shorts per video and a "daily Shorts" cadence. We change one variable per batch.

---
# Deep dive (same day): Higgsfield's own bundled workflows
Read via get_workflow_instructions / get_workflow_bundle_file (free, read-only): `faceless-video` v2.4 SKILL.md (121K chars; read golden rules, types, Phase 3 script, Phase 8b thumbnail), references `scriptwriter.md`, `history-longform.md`, `vo_and_captions.md`, `topic-sourcing.md`, `picture-flow.md` (all read in full), and `thumbnail-generation` v1.3 SKILL.md + `thumbnail-frameworks.md` (read in full). NOT read: the `narration` and `video-montage` workflows, kids/style references, and the scripts. These are Higgsfield's production rules; several cite their own dev runs ("dev 2026-07-29"). That is internal QA, not view data.

## Script craft (scriptwriter.md)
- **Failure mode = a list.** "Facts are material; shape is the product."
- **Through-line object:** ONE physical object/process in EVERY beat that escalates monotonically (a fuse burning down, a stack growing until it blocks a door, a map filling with dots). The payoff resolves it. If the ending can't pay it off, pick another object. It gets its own prop asset so it never morphs.
- **Hook: first sentence ≤ 8 words**, the raw surprising fact stated flat ("understatement makes a big number bigger"). No windup clause. A question hook is allowed if the answer is withheld to the payoff.
- **Early stakes beat:** why should I care (the misconception "everyone blames X, wrong", or proximity: "it touches you this week").
- **Reorder test:** if the build beats could be shuffled without loss, you listed instead of escalated. Each must be bigger, weirder or more specific than the last.
- **Turn test:** does it change what the viewer thought two beats ago? A summary is not a turn.
- **Payoff kicker reframes the hook:** echo its image or number with a new meaning, don't repeat it.
- Humor = deadpan setup → absurd punch.
- **Line hygiene:** no filler ("you know", "basically", "so yeah"); one modifier per thing; no content word repeated within 6 words; no 5+ word phrase repeated across beats; every line carries ONE new concrete. Too short? Add a FACT, never an adjective. Too long? Cut modifiers first, facts last.
- Research is done when you hold: a hook stat, 3-5 concretes, the counterintuitive turn, and physical specifics the shots can stage. Spoken numbers checked against a second source.
- **Show what the line names:** if the line says spices, spices are on screen. A visual that could belong to any line gets rewritten.

## Long-form documentary skeleton (history-longform.md)
1. **Cold open in medias res** (most dramatic minute, no setup) → 2. **explicit rewind line** ("to understand how he got there, go back six months") → 3. **5-8 chapters of ~1.5-2.5 min**, each a mini-arc (setup → pressure → turn) that **ends on a hand-over hook** ("that answer was coming faster than anyone expected") → 4. **≥1 human vignette per chapter** (one named person, zoomed in) → 5. **honest uncertainty in one line** where historians disagree (builds trust) → 6. **meaning chapter** (before/after stated plainly) → 7. one-block outro/CTA.
- **Motif ledger:** each recurring action beat (stamp slams, marches) at most once per chapter, ~3 per film, never back to back. Rotate device class: scene → map → quantity → scene → vignette, never 3 of a class in a row. Every chapter has ≥1 map beat and ≥1 quantity beat shown visually (coin stacks growing), with the VO carrying the numbers.
- **Era map:** a character asset per era (young/old king), each later era generated with the first image as a reference ("the SAME person, now...").

## Pace and visuals (picture-flow.md, golden rules)
- Their stills mode ("narrated stills", the same family as our slideshow Shorts): **a frame every ~0.7-1.2 s, hard cap 1.5 s per frame**; 1 min = 45-70 frames. They call a frame lingering while the narrator talks "the slideshow we are killing". Ours: 2.5-6 s per shot.
- **The cheap trick: micro-variation edits.** About half the frames are EDITS of the previous frame (previous job id as the ONLY reference, no asset sheets), prompt "keep it EXACTLY... change ONLY: {one visible thing: hand moves, head turns, mouth opens, object enters}". Rhythm = 1 new framing + max 2 edits, then a new framing. Longer chains read as "one picture with glitches". The change must be visible at a glance (an eyebrow or colour tweak is wasted).
- Shot mix W/M/C, never two close-ups in a row. CU → MEDIUM is "the money transition" (emotion close, then the resulting movement wide).
- Motion clips: 10 s blocks of 5 hard cuts (~2 s each); vary shot size AND angle every cut; ≤ 2 blocks (~20 s) per location; motion from frame 1 (no frozen opening).
- **Frame drift:** frame duration = next word start − this word start, from STT. Spot-check frames at 25/50/75% so the picture matches the word being said.

## Voice (vo_and_captions.md), ElevenLabs specifics
- One {DELIVERY} phrase repeated VERBATIM on every clip keeps the timbre consistent across clips (e.g. "wry conversational explainer, dry timbre, lively pace") + 2-4 words of per-beat mood + "starts speaking immediately" (kills the leading pause).
- ElevenLabs pauses ~0.7 s at a period and ~0.5 s at a comma. Performed brackets ([scoffs], [sighs], [dry laugh], [mock gasp], [whispers]) cost ~1 s each. Numbers and dates written as words (digits silently blow the length).
- Pace gate: over 2.9 words/s = RUSHED, rewrite. No internal pause ≥ 0.8 s inside a line.
- Their two modes disagree: motion = one clip per 10 s block, stills = ONE continuous narration (they call per-phrase snippets "the old bug") plus Whisper word timing. Ours is per-phrase clips.

## Mix
- Normalize the VOICE first, then put music/SFX under it, then measure. Music bed ~0.10 (hard max 0.20), sidechain-ducked under the voice, loudnorm −16 LUFS. Check per-section mean volume: every block within ~3 dB, speech ≈ −18 to −21 dB. Seen failure: music louder than the narrator because the bed was mixed before voice normalization. Ours: music 0.22 in assemble.py, no loudnorm there.
- They generate the bed at the video's exact length (`sonilo_music`; ours would be `elevenlabs_music_v2_5`).

## Thumbnails (thumbnail-generation + 16 frameworks)
- Every thumbnail opens an **information gap**. Brainstorm ≥ 5 concepts across frameworks, often combining 2. Must read at ~120 px wide.
- 16 frameworks: before/after split, social UI (generic DM/review card), three-step progression, real screenshot, posed portrait, posed action mid-moment, "DAY N" badge (pick a day in the last 20% of the arc), graphical/chart, landscape-as-hero, map/aerial route, product-as-answer, text as callout or answer to the title, repetition of one object, extreme size difference, generic "breaking news" chyron, amplified reality (exaggerate ONE real element, plausibly).
- Default: clean render, text added later as an overlay. 11 emotion presets (shock, hype, fear, confusion, determination, smug, charisma, disgust, awe, rage, laugh). Variants differ only by emotion or camera take (low-angle hero / extreme close-up / wide dutch tilt).
- Model routing: nano_banana_pro 4K for the main render; seedream for surgical i2i tweaks (emotion swap, background swap) chained off the finished render.
- Their faceless covers: hook title of 3-6 words, always 16:9, style key as the reference, one variant.

## Topic sourcing
- 3-4 searches: "{subject} trending topics {month year}", "most searched questions about {subject}", "{subject} surprising facts / why does", "{subject} forgotten history". A topic needs ALL FOUR: a why/how question at its core, one surprising number or reversal, visual potential, appeal beyond fans ("the real reason X costs so much", "what X got wrong for 200 years").

## New proposals from the deep dive (for Joe)
15. **Through-line object** in every script (Shorts and long-form).
16. **≤ 8-word first sentence** + **reorder test** + **turn test** + **kicker echoes the hook** in the self-review.
17. **Line hygiene** check (no filler, one new concrete per line, no repeated 5-word phrases).
18. **Long-form skeleton:** cold open in medias res → rewind line → chapters ending on hand-over hooks → vignette per chapter → one honest-uncertainty line → meaning → short CTA. Plus a motif ledger and device-class rotation.
19. **Faster picture changes in slideshow Shorts:** hold ≤ ~1.5-2 s via micro-variation edits (new framing + up to 2 edits). Cost: ~45 frames/min × 0.5 cr ≈ 22 cr per Short (vs ~8-9 now), so the >20-credit rule applies. A batch test vs our 2.5-6 s shots; cut-out animation already got 34.5% swiped vs ~50-80%.
20. **Grady consistency:** one verbatim delivery line + "starts speaking immediately" on every clip; numbers as words; RUSHED gate at 2.9 w/s; count brackets as ~1 s.
21. **Mix:** voice normalized first, music ~0.10-0.15 (now 0.22), loudnorm, per-section volume check.
22. **Thumbnail frameworks:** brainstorm ≥ 5 across the 16 before picking; must read at 120 px.
