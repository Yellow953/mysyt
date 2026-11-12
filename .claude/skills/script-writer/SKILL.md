---
name: script-writer
description: Stages B-H for a Mr. Yellow Scarf Short. Turn proven competitor concepts (memory/shared/competitors.md) into fresh, packageable story ideas, get Joe's pick, research only what the story needs, outline the story, write the script, review it as a creator, and hand off scenes.json. Stops for Joe after the ideas, the outline and the script. Use when Joe says "next idea", "make a short about X", "write the script", or asks for ideas.
---

# Script Writer (rebuilt 2026-11-01)
Think like a YouTube strategist, a storyteller, a packaging designer, an editor, a careful researcher and an honest analyst. Use judgment; nothing here is a form to fill.
Read first: `memory/short-form/viral-playbook.md` (the fundamentals: idea, hook, story, beats, emotion, visuals, payoff, packaging), `memory/short-form/learnings.md` (validated + hypotheses), `memory/shared/competitors.md`, the last 15 rows of `memory/short-form/video-log.csv`, `memory/short-form/ideas-backlog.md`, `memory/short-form/strategy.md` (what this batch is testing).

```
A Discover (viral-research) → B Ideas → C Choose → STOP (Joe) → D Research → E Outline → STOP (Joe) → F Script → G Review → STOP (Joe, no credits before OK) → H Handoff
```
Never skip a stop. Joe can pick, change or reject everything at each one. If he brings his own topic, start at B and still find the closest proven source concept (or say none exists).

## B. Ideas from proven concepts
1. If competitors.md is > 7 days old, say so and offer Stage A first.
2. Take the strongest proven videos (high vs norm, ideally ≥ 2 hits on the same mechanism; note long-form-only proof). For each, name the **mechanism**: why someone would care (the question everyone wonders, being inside the situation, the ladder, the taboo, the conflict). Separate it from the topic, title, characters and look.
3. Build 2-3 variations per mechanism that tell a genuinely different story: a new situation, point of view, consequence, deeper human angle, better question, different payoff, or a combination. Look for gaps (familiar topic, unexplored angle). Not allowed: reworded titles, changed numbers, swapped characters.
4. Duplicate check against video-log, backlog, competitors.md, research/; search YouTube when browsing works. "Not found in our data" ≠ "nobody made it".
5. **Historical picks are global and story-first (Joe, 2026-10-31).** Choose by storytelling potential, curiosity, emotion, visual potential and audience relevance, never by region. Look across ancient, medieval and modern history and every continent: wars, disasters, escapes, money and power, strange laws and jobs, betrayal, ambition, revenge, survival, injustice. Tag every candidate with `region/era`. Before presenting a batch, list the `region_era` of the last 15 historical rows in video-log.csv and say if the new batch repeats a region or era; that is a flag, not a quota. Avoid the same famous figures, civilizations and event types; prefer a lesser-known story only when its narrative is stronger, never because it is obscure. A Middle Eastern story is fine when it is genuinely the strongest. "Fills a gap in a region" is never a reason to pick an idea.
6. Give every variation a **packaging concept**: title + first frame + thumbnail (and whether the female co-star belongs, per playbook §9).
7. **Competitor-format test plan (Joe, 2026-11-12).** While the plan in `memory/short-form/strategy.md` is open, build each batch in ONE proven format, in plan order (T1 story parable → T2 wronged-you time-jump POV → T3 news-jack), and tag `angle`/`hook_type` in video-log.csv with the format. T1 skeleton (Ricks Clips, 28M/33M): line 1 = strange action with no context → "You see," + stakes → mockery → false failure → disaster proves him right → mechanism in 1-2 lines → cut mid-sentence so the end loops into line 1. Real stories only (dramatized scenes are fine, invented events are not). Never write a question-explainer Short ("How does X work?") during the plan: it flopped at ~1/100 on the same channel.

## C. Choose, then STOP
Judge each variation in a few honest sentences, using the playbook: the one-sentence test, the story (who, what they face, what changes, what we're waiting for), escalation, why the ending would satisfy, visuals, packaging, originality vs the source, fit with our audience, how much explaining it needs, and whether it's still interesting without the jokes. Reject anything that needs a long explanation, is a fact list, or rests on a punchline. **Story test for history:** does someone (a person, group or civilization) have something to lose, meet a conflict, surprising decision or unexpected development, and reach a reveal, reversal or consequence? Choose it because something compelling happens to someone, not because its facts are interesting. If the dramatic claim rests on one late source, say so now.
Present the best 3 to Joe: title · source video(s) with dated numbers · the mechanism kept · what's new · central question · hook + first frame · story in 4-6 beats · climax and payoff · packaging (title/thumbnail, co-star or not) · what research must verify and the risks (repetition, Short vs long proof). Recommend one and say why. Save them in `memory/short-form/ideas-backlog.md` (status `proposed`). **STOP.**

## D. Research what the story needs
Verify the premise and every claim the narration will make; look for the human story, a better turn or a stronger ending; stop when the story is solid. Sources: primary documents, museums/archives/universities, peer-reviewed work, then reliable secondary sources; independent agreement for contested claims. Save `videos/short-form/<slug>/research.md`: a table of the claims the video uses (claim · source · known/probable/disputed/hypothetical · conflicts), then short notes. Never invent dialogue, quotes, numbers, motives or events; an unverifiable scene is cut or shown as clearly illustrative. Real suffering gets context. If the idea turns out weak or misleading, tell Joe and propose a stronger one.

## E. Outline, then STOP
`videos/short-form/<slug>/outline.md`, short: central question · premise · main character(s), what they want/face · the conflict · 2-3 hook + first-frame options · the beats (each: what happens, what we SEE, why it earns its place) · the turn and the climax/reveal · 2-3 endings (recommend one, say why it pays off the hook) · the emotional journey · 2-3 title + thumbnail options · estimated length (Grady ~2 words/s incl. pauses). Explain major creative choices in a few lines. **Also (playbook §13, 2026-11-12):** the **through-line object** (what it is, how it escalates, how the payoff resolves it); each beat written as **current state → change → why (because/therefore/but) → what we SEE**; the **loop map** (main question at frame 0, the re-hook at ~20-25 s, where each loop closes); what-if ideas open with the **premise contract** ("we change X, keep Y fixed, follow Z, answer Q"). **STOP.**

## F. Script
`videos/short-form/<slug>/script.md` as a beat table: Time | Voiceover | Visual action | On-screen text | SFX/transition. Natural, conversational narration in Mr. Yellow Scarf's voice (slightly lazy, sarcastic everyman, big honest reactions), tone matched to the subject. Count the words; timestamps match the estimate. Facts match research.md. Titles, thumbnail concept, cost estimate and sources at the bottom.

## G. Review as a creator, then STOP
Watch it in your head as a viewer scrolling the feed. Is the idea strong enough? Would the first frame and line stop the swipe? Is the premise clear at once? Does the middle stay as interesting as the start? Any fact, explanation, joke or image that doesn't earn its place? Are the visuals clear and memorable? Does the ending deliver the hook? Anything misleading, unsupported, repetitive or boring? Then run the **playbook §13 checks** and fix every miss: first sentence ≤ 8 words · every beat linked by because/therefore/but (no "and another fact") · reorder test (shuffle the middle: if nothing is lost, rewrite) · turn test (changes what we thought two beats ago) · a re-hook at ~20-25 s and no stretch where every question is answered · through-line present in every beat and resolved · kicker echoes the hook · line hygiene (one new concrete per line, no filler, no repeated phrase) · every visual shows what its line names. **Revise instead of defending.** Add 2-4 lines at the bottom of script.md: what you changed and the key creative decisions. Show Joe. **STOP; no credits until he approves.** If Joe pastes his own script, use it near-verbatim and only fix factual slips (noted).

## H. Production handoff (needed by `video-producer`)
Slug `YYYY-MM-DD-short-title`, folder `videos/short-form/<slug>/`. script.md also holds 3-5 titles, the thumbnail concept, a cost estimate and sources. After approval write `scenes.json` and `audio/performance.json`, and add the video-log row with `inspired_by` (source video(s)), `hypothesis` (one line: what we expect and why), `co_star` (yes/no), `first_frame` (one line) and `region_era` (e.g. "Caribbean, 17th-18th c"; "Global" for non-history).

### scenes.json
One scene per 2.5-6 s (split beats over ~6 s, merge beats under ~2 s). On-screen text goes in `overlay_text` (drawn locally; no emoji).
```json
{
  "slug": "...",
  "format": "short",
  "aspect": "9:16",
  "voice": {"voice": "Grady", "engine": "higgsfield text2speech_v2 elevenlabs", "mode": "phrase clips (audio/performance.json)"},
  "scenes": [
    {
      "id": 1,
      "text": "narration spoken during this scene",
      "image_prompt": "full Higgsfield prompt",
      "uses_character": true,
      "overlay_text": "",
      "motion": "zoom_in"
    }
  ]
}
```
`motion`: zoom_in | zoom_out | pan_left | pan_right | shake | none.

### Image prompt (keep the style block identical every time; consistency is the brand)
`<<<aa6661ee-d997-489c-9e1b-9b9adbed8c94>>> [costume/pose/EXPRESSION] [setting, secondary characters]. Style: expressive modern cartoon illustration, glossy digital painting, vivid saturated colors, bright blue sky with soft clouds (or a glowing orange sunset sky for dramatic scenes), detailed textured landscape and props, thin dark outlines, exaggerated big emotions with sweat drops and small motion lines, polished YouTube-explainer look, 9:16 vertical. No text, signs, lettering, labels, digits, logos or calligraphy anywhere in the image. The main character keeps his plain white round head, black dot eyes, thin black stick limbs and his bright yellow scarf; the scarf is the only yellow in the picture, so keep every other object, wall, sand and light away from yellow (gold = orange-gold). Anatomy check: every human figure has exactly two arms and two hands, no extra arms or hands. Family-friendly: nothing graphic.` (style v4 BRIGHT EXPRESSIVE CARTOON, Joe 2026-11-08, used for Shorts AND long-form; v1 muted, v2 colorful watercolor and v3 mid-color are all RETIRED. For period scenes name the period props and add "no computers or modern objects".)
- Night scenes add: `Night scenes use soft deep blue and indigo washes with a warm orange firelight glow, calm and uncluttered.`
- Any hand gesture: add `exactly two arms and two hands, no extra arms or hands`. Two characters: add `only the main character wears a scarf`.
- Scenes without him: drop the element tag, keep the style block.
- **Female characters (Joe, 2026-11-08, approved sample = glamorous Egyptian queen): gorgeous glamorous cartoon woman, hourglass figure, short or slit period-correct dress with a plunging neckline, bare shoulders and legs, playful wink or smirk or half-closed flirty eyes, rosy blush, leaning in close, heart shapes floating, the mascot reacting big (blush, spiral eyes, sweat drop, frozen). Tasteful and cheeky, no nudity, no drool or tongue gags, nothing explicit. Gold jewelry is orange-gold so the scarf stays the only yellow. Keep her outfit simple per scene for consistency.** Add this line to the prompt whenever a woman is a focus of the shot.
- Monetization-safe: no gore, nudity or graphic violence; romance cheeky, never explicit.

### Titles + thumbnail
3-5 title options. One thumbnail concept built from a planned cover scene (no extra image), one big emotion, 2-3 words, text between 12% and 88% of the height.
