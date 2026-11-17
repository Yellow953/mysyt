# Long-form playbook (v0, 2026-11-03: all HYPOTHESES until our data says otherwise)
Brand and character rules are shared with Shorts (see CLAUDE.md). This file is long-form only.

## Goal
Fascinating stories that happen to teach something, not educational videos that happen to be animated. Target ~5 min for every pillar (Joe, 2026-11-03: keep videos 5 mins; story may run a little over/under). Not a stretched Short.

## Structure (flexible)
1. Cold open (0-30 s): drop into the most gripping moment or question; no greeting, no channel intro.
2. Setup: only what the viewer needs to care.
3. Development -> complications -> unexpected turns. Every section must advance the story, raise stakes, or deliver something surprising.
4. Major reveal, climax, resolution. Open a new question as each old one closes.
5. Natural CTA at the end (one line, in character).

Avoid: long greetings, generic intros, background dumps, statistics piles, repeated narration, predictable endings, padded scenes.

## Ideas
- Global, story-first (never default to Middle East/Lebanon). Starting areas: forgotten history, strange events, psychology, wealth/power, rise and fall, survival, mystery, odd decisions, rivalries, real-life unbelievable events, strange discoveries.
- From a competitor hit: extract the emotional appeal, why they clicked, why they stayed, the mechanism; then pick a different subject/character/perspective. Never reproduce a script or swap the subject only.
- Reject generic ideas. Score: click potential, story strength, retention, visual potential, research feasibility, originality.

## Packaging comes BEFORE the script
Per idea: 5 titles, 3 thumbnail concepts, curiosity gap, intended emotion, why title+thumbnail work together, recommended pair. Thumbnails: readable on mobile, few words, strong expression, not a repeat of the title. Mascot appearance and style block: shared with Shorts (see script-writer SKILL style block).

## Fact discipline
Label every claim: verified / strongly supported / disputed / speculation / dramatization. Never invent events or dialogue as fact; imagined scenes are fine when framed as dramatization.

## Metrics (long-form)
Impressions, CTR, first-30-s retention, retention curve, avg view duration, watch time, subs gained, traffic sources, views over time, comments/shares. Compare to OUR long-form baseline, not Shorts.

## Pillars
Six pillars (see pillars.md), premise first. Attraction/romance rules: character-and-attraction-policy.md. Thumbnail experiments: thumbnail-experiments.md.

## Working rules (Joe, 2026-11-04): cheap, fast, creative first
1. ALL long-form agents run on the cheapest model (`model: haiku` in every `lf-*` agent file). Never override a subagent to a pricier model unless Joe asks. Keep prompts short and demand short returns.
2. SPEED: ideas = ONE agent pass (a few strong ideas), not 6 hunters + 12 fact-checks + critics. Script = ONE writer pass + ONE quick review, then show Joe. At most one revision round unless Joe asks. Don't re-run reviews on small edits. Do not spawn agents to answer questions you can answer yourself.
3. CREATIVITY OVER ACCURACY for hypotheticals / what-ifs / POV / thought experiments (pillars 1 and 3): NO fact-check gate. Good premise, escalation, humor and a payoff come first; keep only a quick sanity check on any real number used and label imagination as imagination.
4. Real stories (pillars 2, 4, 5, 6): proportional light check ONLY: confirm the core story is real with 2 sources and don't state anything shaky as fact (hedge it in narration). No multi-agent source audits, no reopening primary filings, no per-claim tables unless Joe asks. Story, hook, twist and payoff are judged first; facts must not slow or flatten them.
5. Present to Joe quickly and short: title, premise, hook, twist, payoff, thumbnail idea. Detail lives in files.

## Production style rules (Joe, 2026-11-04, feedback on the McDonald's video)
1. NO on-screen text except the captions at the bottom: no overlay plates, no source tags, no stat boxes, no "DRAMATIZATION" labels. Real-logo badges (golden arches etc.) are fine. `overlay_text` stays empty in scenes.json.
2. NO disclaimer lines, spoken or on screen, at the start or mid-video. Keep honesty inside the narration instead: say "say your restaurant sells..." / "imagine..." for invented numbers, hedge shaky facts ("by most accounts"), and put the "illustration / not affiliated" notes in the description and pinned comment.
3. Images must not look zoomed or cropped: assemble_lf.py now crops only ~2% (BUF 1.02) with zoom/pan of at most 3%. Compose scenes with the subject well inside the frame (heads in the upper-middle, nothing important near the edges).
4. Thumbnails: when the video is about a real brand, put the real logo on the sign/object in the art (composited locally); text stays minimal.

## Voice QC rule (2026-11-04, McDonald's)
After recording clips and BEFORE build_voice.py, run `.venv/bin/python scripts/long-form/check_clips.py videos/long-form/<slug>`: it transcribes every clip and flags any whose speech does not match performance.json. The McDonald's first pass had clips 01-08 holding the wrong speech (the removed disclaimer played in the opening while the captions showed the right words) and nothing caught it. Also: after the final render, transcribe the first 45 seconds of the MP4's audio and read it against the script. Map batch results to prompts by prompt text, never by job order.

## Production directives (Joe, 2026-11-06, Emu War)
1. Scene change at least every 5 s (never shorter than ~5 s per scene; ~60 scenes max for 5 min).
2. Use animating characters via the Remotion cut-out method from the last Short (remotion/src/TrashVolcano.tsx template, sprites on magenta -> scripts/short-form/cutout.py -> sprite_meta.py, Chrome render, SFX from make_sfx.py; see learnings.md section D and video-producer notes 2026-11-05). Needs a 16:9 long-form variant of the template (read-only reuse, copy, don't edit the Shorts files).
3. Music: NEW track(s) from the YouTube Audio Library each video, not one already in assets/music/ (see used.json).

## Remotion cut-out pipeline for long-form (built 2026-11-06, Emu War)
- Files: remotion/src/EmuWar.tsx (data-driven shots; edit the SHOTS array), EmuRoot.tsx + emuIndex.ts (entry), emuShots.json (shot times from voice), emuCaps.json, emuMeta.ts; assets in remotion/public/emu/. Render: `npx remotion render src/emuIndex.ts EmuWar60 out.mp4 --browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --concurrency=8` (30 min for 5:20 at 1080p60; draft with EmuWar30 --scale=0.5 about 16 min).
- Flow: performance.json (one clip per script row) -> Grady clips -> check_clips.py -> build_voice.py -> captions.py -> shots (groups of clips, each shot >= 5 s) -> sprites on magenta (~0.5 cr, 21 sprites enough for 37 shots) -> cutout.py --global -> sprite_meta.py -> shots in SHOTS -> stills -> half-scale draft -> final.
- Voice cost measured: ~0.32 credit per clip. zsh: a no-match glob aborts the command; do not trust an empty grep result when the command errored.
- Story structure (Joe, 2026-11-06): when the story's resolution is a mechanism (e.g. the bounty), give it its own half of the video with a mini-arc, not a tag-on ending. Title says "emus" (never "ostriches").

## Joe's feedback on the first Emu War cut (2026-11-06) -> standing long-form rules
1. THUMBNAILS: not boring. Use the colorful hand-drawn watercolor style (style v2), a giant expressive character/animal close-up plus the small panicked mascot, blazing high-contrast colors, minimal text. Generate 3 compositions and pick the best at phone size (the flat "mascot beside a gun" thumbnail was rejected as boring). Never keep art with garbled lettering (crate/sack words); reject it.
2. COLOR: animated scenes must be vivid, not faded: saturated sky/ground palettes, CSS saturate ~1.3, warm-tinted emus. Pale pastel backgrounds are out.
3. MIX OF STYLES: not all animation. Mix colorful generated illustrations (Ken Burns push, ~0.5 cr each) with Remotion cut-out animation: roughly 40-50% illustrated on story peaks (hook, deal, parliament, climax, finale), animation for the connecting beats.
4. HOOK (first 5 s) must be punchy: lead with the premise in one line over the most striking illustrated image, then hit the second image on the punchline word (zoom punch + thud). The old "date + gun jams" opening was too slow; keep the date line for second 8.
5. Truncated PNG downloads happen again: always verify every image with PIL load() after download.
6. (Joe 2026-11-06) Sound: add synthesized machine-gun/action SFX on gun moments, heaviest in the hook (mg_burst/mg_short in remotion/public/emu, made locally). Spacing: emu groups use fixed row spacing (flock rows), never random clumps; keep the mascot and groups clear of each other.

## Script rules from Joe (2026-11-07, medieval-privacy rewrite)
1. STORY OVER FACTS, always. A script is one want + escalating attempts/obstacles + a payoff, with funny set pieces. Facts are one hedged line each, only where they sharpen a scene. No fact ladder, no "historians disagree" thesis section, no explainer beats. If a beat exists only to deliver a fact, cut it.
2. NO NAMES for the mascot or the people around him. The narrator is "you"; others are "your wife", "your mother". Anyone can imagine being him. Never "I'm Mr. Yellow Scarf" or "I" in narration.
3. Intimate/romantic ideas: go up to tier 2 (heat, longing, whispers, closeness, innuendo, clothed adults, ends at the closed door). Do not fall back to a dry, safe tone.
4. No gag that is introduced and then dropped (the cow). Every setup pays off.

## Image style v4 "Bright Expressive Cartoon" (Joe, 2026-11-08) - REPLACES v3 below for all new videos
Use the style block and the female-character rule in `.claude/skills/script-writer/SKILL.md` (same block for Shorts and long-form, 16:9 for long-form). Glossy digital paint, vivid blue sky or sunset glow, detailed textured environments, thin dark outlines, big exaggerated reactions. Scarf only yellow. CSS saturate ~1.05.

### (RETIRED 2026-11-08) Image style v3 "mid color" (Joe, 2026-11-07)
Joe: "too colorful like the previous version, not barely any color either: the mid, like the competitors." Style v3 = hand-drawn ink, flat watercolor fills at MEDIUM saturation: warm earthy palette (ochre, rust, dusty teal, olive, slate blue, warm cream) with one or two stronger accents per scene, thin wobbly black outlines, warm firelight glow for night scenes. No neon, no candy colors, no pale washed-out pastels. CSS saturate ~1.05 (not 1.3). The scarf stays the ONLY yellow. Thumbnails may be a touch punchier than the video but still in this palette. Reference look: Ink Story / Relic Explains / Lore-style channels.
Music rule (Joe, 2026-11-07): pick a NEW track whose mood matches the video (medieval-privacy = sexy, relaxing, smooth); never reuse a used.json track.


Female lead look (Joe, 2026-11-07, medieval-privacy; SUPERSEDED for later videos by the 2026-11-08 approved glamorous look below): attractive and sexy within tier 2: long wavy hair, eyelashes, rosy cheeks, confident half-smile, sultry playful eyes, flirty posture, fitted but fully covering period dress.

## Joe preference (2026-11-12)
- No "worst deal in history" premises (channel-wide, see CLAUDE.md) (rejected the Ronald Wayne $800 Apple idea and that genre: sold-too-early, passed-on-a-fortune stories). Pitch premises where the viewer/character has something to win, survive or figure out instead.

## Joe feedback on the first Money and Boss videos (2026-11-14) -> standing long-form rules
1. A script must be understandable on one watch: ONE straight line in time order, no rewinds or "go back five years" devices, every step answers "why does this happen next?", one idea per row, few numbers (only those the story needs). If the title already promises the ending, say so in row 1 and show how we get there. Test: could a 12-year-old retell it after one watch?
2. Visuals: use the flat hand-drawn ink style of the medieval-privacy and seawater videos, NOT a busy glossy painted look (the Money/Boss images had scribbled screens, smudged faces and tube-bodied mascots). At most 3 characters and 1-2 props per image; no screens, papers or signs with content (icons only); the mascot stays a stick figure.
3. No blanket autonomy over scripts: Joe approves the script before production (his earlier "don't ask me anything" run produced two videos he rejected).
4. Never run two Remotion renders at once, and don't run subagents to babysit renders (it crashed Chrome and burned Joe's token budget). Use scripts/long-form/render_pending.sh.

## What Joe's ChatGPT script taught us (2026-11-14, what-if money video)
Open on a paradox, not an intro ("everything still exists, so why would the world collapse?"); keep 2-3 named open loops and answer each later; make each chapter the CONSEQUENCE of the previous one and escalate the scale (person, shop, factory, hospital, society); use a concrete example anyone can follow (farmer-doctor-shoemaker) and one surprise reversal (billionaire with an empty fridge); end by reframing the premise. Our adaptation: short rows, the mascot lives it, humour in his voice. Joe liked this structure: prefer it over gag-chains for what-if videos.

## Joe feedback (2026-11-14, money v4 render): no dark or faded visuals
- Standing rule: every long-form image is BRIGHT daylight, saturated, blue sky with soft clouds (the seawater look). No night scenes, no dusk/storm purple, no dark overlays, no brightness-dimming or grayscale fades on backgrounds. If a story beat needs "darkening" (night, storm), use a bright scene with a few grey clouds, never a dark image.
- Prompts must say "bright cheerful daylight, no dark or night colors". Check brightness (mean luma >= ~90) of every background and illustration before building.
- Money v4 fix: regenerated img_01, img_42, img_22, bg_night, bg_storm, bg_yard as bright daytime (3 credits); removed the dark overlays in MnyLF.tsx; old dark render kept in output/chunks_old_dark/.
- Joe 2026-11-14 (money v4): a pale-blue "glitch" at every in-scene shot change (e.g. 1:53, 1:54) was our own white flash overlay (50% white, fading over 0.18 s) washing out the blue sky. Rule: NO white/colour flash overlays on cuts; use a clean cut or a slide only. Checked by scanning frames for blue-channel jumps.

## Joe feedback (2026-11-14, boss v3): use ChatGPT scripts verbatim; consistent cartoon boss
- When Joe pastes a ChatGPT script and says "use it exactly as is", the narration is verbatim (only grouped into voice clips); no paraphrase. Both money v4 and boss v3 were built that way.
- The recurring side character (the boss) must stay a simple cartoon stick figure (round tan head, slicked dark hair, red tie, navy suit, big orange-brown watch). Gpt_image_2 drifts to a realistic human in meeting/office-desk scenes: add "Simple flat cartoon stick-figure characters with round tan ball heads, dot eyes, thin black stick arms and legs, minimalist hand-drawn" at the START of the prompt, and QC every image of the recurring character on a contact sheet.
- Cheap pipeline that worked (no sprites): one bright whole illustration per script row (35 images for 46 rows, rows reuse images), several camera crops per row in Remotion (wide push / left crop / right crop / pull-out, 0.14 s crossfade), word-highlight captions, soft whoosh only on picture changes. Total about 35 credits, built without agents.

## Joe feedback (2026-11-14, boss v3): mix images AND animation, about 50/50 (STANDING RULE for the next long-forms)
- Joe: "why using only image scenes, no animations? it should be 50/50." Boss v3 was all whole illustrations with camera crops, which he does not want as the default. Money v4 and seawater mixed whole illustrations (ILL) with cut-out animated scenes (CUT: mascot + sprites moving on a painted background, pops, walks, props).
- Rule: roughly half the rows are CUT scenes (sprites that move: enter, walk, shake, point, pop in, props appear on beats), half are ILL. Plan this in the script table (mark each row ILL or CUT) BEFORE generating art, and budget the sprite sheets (about 6-8 sheets).
- Cheap-pipeline note above (all-ILL, 35 images) is only the fallback; it is NOT the 50/50 look.
- Joe chose thumbnail B "THEY LAUGHED" for the boss video (Flow, 2026-11-14); thumbnail A "MONEY GONE?!" for the money video. Both won on a clear big face + 2 words.
- Music: Joe disliked "Mirror Mirror" under the boss video. Audition 3 candidates (voice + music mixes) before picking; he listens, then we render.

## Joe feedback (2026-11-15, island POV): women use the approved glamorous look
- Joe: "make sure the visuals of the women is the one we agreed upon with a bit of sexualisation." Standing rule for every long-form with women in focus = the female-character rule in .claude/skills/script-writer/SKILL.md (Joe 2026-11-08, glamorous Egyptian queen sample): hourglass figure, short/slit period outfit with plunging neckline, bare shoulders and legs, flirty half-closed eyes, rosy blush, braided/wavy hair; orange-gold jewelry so the scarf stays the only yellow; adults, no nudity. Mascot stays a stick figure.
- Flag age-restriction/limited-ads risk to Joe at upload (tier 2). Works as ILL images AND as magenta-sheet sprites (gpt_image_2 keeps the look; sheets split with scripts/long-form/split_sheet_island.py; check for merged blobs and mislabeled poses).
- Pipeline facts: Higgsfield plus plan = max 8 concurrent image jobs and text2speech rate limits at ~8 per batch (resubmit failures with the next batch); the island data/mix/timeline scripts (island_data.py, timeline_island.py, mix_island.py) are the cleanest template for the next long-form with a pasted script.
- Music: every library track is already used; with credits capped, the least-used track was picked (Mediterranean View) and 3 audition mixes made (optA/optB/optC). Joe picks, then copy to audio/mix.wav.

## Pipeline facts (2026-11-15, cattle rancher video; no new Joe corrections this session)
- Cheapest build so far: 54 voice clips + 3 sprite sheets + 6 backgrounds + 27 illustrations (37 images) = 27.25 cr total (about 0.27 cr per image, 0.32 per voice clip). Template for a pasted script: scripts/long-form/cattle_data.py, timeline_cattle.py, mix_cattle.py, remotion/src/CattleLF.tsx (row -> ILL/CUT tables), render_pending.sh case `cattle`.
- text2speech_v2 rate-limits about 1 of every 8 clips per batch (429): resubmit the failures in the next batch; keep a jobs.txt (row -> job id) and rebuild download URLs from jobs_wait result_url (the URL has a timestamp, it cannot be guessed).
- Downloads: always `curl --max-time 40 --retry 2` and PIL-verify; a hung curl truncated one image. zsh does not word-split `$VAR`: pass frame lists literally to node scripts.
- gpt_image_2_6 sometimes darkens corners of "worried/uncertain" scenes (i47): say "no grey or dark clouds, no dark corners, no vignette" and QC the contact sheet.

## Pasted-script builds, 2026-11-16 (yacht, zombie)
- Joe's pasted ChatGPT scripts are shorter than their timestamps: Grady reads them in ~75% of the stated time (yacht 378 words = 2:50, zombie ~3:48 vs "5:00"). Verbatim rule kept, no padding; warn Joe up front that the video will run short, or ask for a longer script.
- Image cost ran ~1 cr each for yacht (36 cr total) vs ~0.27 for cattle/zombie; sprite sheets must be requested on flat magenta (two came back on dark gradients, redone).
- Parallel builds work with prefixed files (yacht_*, zombie_*); render_pending.sh gets an additive case each. Subagents hand back mid-render: finish QC from the main session.
- Flow thumbnail prompts (2026-11-17): the yacht style (glossy digital painting, ONE giant close-up face, simple background, 'no text', add text after) beat the zombie v1 (flat 2D thick outlines, small faces, text baked in). Use the yacht recipe by default for thumbnails.
