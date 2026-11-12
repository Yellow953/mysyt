---
name: long-form-video
description: Orchestrates the Mr. Yellow Scarf LONG-FORM (~5 min story video) production team - competitor research, idea discovery, story development, fact-checking, packaging, script, critical review, production handoff and performance analysis - across sessions via memory/long-form/state.json and specialist agents. Use when Joe says "long-form", "long video", "continue the long-form project", "run the long-form research agent", "find new viral video opportunities", "study the latest breakout videos", "develop this idea into a story", "review this script", "create thumbnail concepts", or "analyze our latest long-form performance". NOT for Shorts (use script-writer, video-producer, performance-review for Shorts).
---

# Long-Form Video (orchestrator)
Independent from the Shorts skills. Never edit Shorts skills, `memory/short-form/strategy.md`, `learnings.md`, `viral-playbook.md`, `video-log.csv`, `competitors.md`, `scripts/` or `videos/`. Read them when useful (shared brand, character, voice, competitor data). If a long-form finding applies to both formats, PROPOSE the shared-file change to Joe; never apply it silently. Don't auto-convert Shorts to long-form or the reverse.

## Working rules (Joe 2026-11-04): cheap, fast, creative first
All `lf-*` agents run on `haiku`. One agent pass per step, one quick review, max one revision round. NO fact-check gate for what-if/POV/hypothetical ideas (creativity first); light 2-source check only for real stories, hedge shaky claims instead of auditing. Full text in memory/long-form/playbook.md 'Working rules'. This overrides the heavier verification steps in the stage reference files.

## Six pillars (approved 2026-11-03) and length
Every idea and project carries a `pillar` (1 POV, 2 origins, 3 what-if, 4 unbelievable real stories, 5 business/money/power, 6 romance/sexuality/scandal/behavior). Details, patterns and verification rules: `memory/long-form/pillars.md`. PREMISE FIRST: never start from a topic. Video length stays ~5 minutes for all pillars (Joe). Present ideas organised by pillar with the full sheet (title, premise, hook, progression, conflict, twist, payoff, thumbnail concept, character direction, why click, competitor comparison, research feasibility, duration) and, for pillar 6, a note on attractive-but-not-explicit, non-misleading presentation. Character/attraction rules: `character-and-attraction-policy.md` (tiers 0-2). Backlog: `ideas-by-pillar.md` (old v1/v2 files stay as history). Discovery flow: hunters -> fact-checker -> packaging -> critic (see `references/stage-1-discovery.md`). Prefer three excellent ideas to ten average ones.

## Start of every long-form session (silent)
1. Read `memory/long-form/state.json`, then `README.md`, `playbook.md`, `experiments.md`, and the active project's files in `videos/long-form/<slug>/`.
2. Read shared context: CLAUDE.md (character, voice, hard rules).
3. Tell Joe in 3 lines: where each project/idea stands, the `next_action`, and what you suggest. Do not re-ask decisions already recorded in state.json.
4. If `competitor-intelligence.md` is older than 7 days (see research-log.md), suggest a scout run.

## Routing (what Joe says -> what runs)
| Joe says | Do |
|---|---|
| "run the long-form research agent", "study latest breakout videos", "find new viral opportunities" | Stage 1 -> `references/stage-1-discovery.md` (agent `lf-scout`) |
| "continue the long-form project" | Read state.json, resume at `next_action` of the furthest project |
| "develop this idea into a story" | Stage 2 -> `references/stage-2-story.md` |
| "create thumbnail concepts" | Stage 3 -> `references/stage-3-packaging.md` |
| "write the script" / "review this script" | Stage 4 -> `references/stage-4-script.md` (review alone = `lf-critic`) |
| "produce it" | Stage 5 -> `references/stage-5-production.md` |
| "analyze our latest long-form performance" | Stage 6 -> `references/stage-6-learning.md` (agent `lf-analyst`) |

## Agents (`.claude/agents/lf-*.md`)
`lf-pillar-scout` (finds channels/breakouts per pillar), `lf-scout` (deep WATCHING of competitor videos, Chrome read-only), `lf-story-hunter` (premise/story hunting per pillar, no scoring), `lf-story-architect`, `lf-fact-checker`, `lf-scriptwriter`, `lf-packaging`, `lf-critic` (the ONLY scorer), `lf-analyst`. Only ONE Chrome agent at a time (they share the tab group). Subagents cannot spawn subagents: YOU call them. Give each the project slug, the files to read, and the file to write. Run independent ones in parallel (e.g. fact-checker + packaging after the outline). Not every task needs every agent. If a subagent cannot use Chrome, do the browsing yourself and hand it the captured data.

## Your job as orchestrator
- Specialists return findings; YOU reconcile disagreements, separate evidence from assumption, and present ONE coherent recommendation to Joe (what the critic objected to, what you accepted and why).
- Never present speculation as fact; never claim a video was watched when only metadata was read.
- Keep Joe's time small: short summaries, files for detail.

## Gates (never skip; approval only from Joe in chat)
1. After research: 10 ideas, scored, top 3 recommended -> STOP.
2. After story outline (+ claim table) -> STOP.
3. After packaging (5 titles, 3 thumbnail concepts, recommended pair) -> STOP.
4. After script + critic review -> STOP.
5. Production handoff prepared -> STOP before any paid generation, upload, or edit of shared files.
6. After publishing: stats, analysis, PROPOSED learnings; record them only after Joe approves.
Record every approval in state.json with date and what was approved, and update `stage`, `gate_status` and `next_action` after every step. Rejected ideas are stored with Joe's reason.

## Hard rules (inherited from CLAUDE.md)
Ask before: >20 credits in a run (a ~5 min video is roughly 20-30 credits), uploads, publishing, comment replies, deleting files. No fake engagement. Facts real, jokes may exaggerate. Monetization-safe. Never print secrets. Browser is read-only unless Joe OKs a click.

## End of every long-form session
Update state.json (stage, approvals, next_action, date), `research-log.md` if research ran. Add only evidence-backed, typed entries to long-form memory files (no one-video rules). List Joe's corrections this session and update the relevant long-form agent/reference/playbook so defaults match; tell him in one line which rules changed. Do NOT touch shared Shorts files; list proposals instead.
