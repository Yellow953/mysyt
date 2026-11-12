# Long-form memory (separate from Shorts)
Created 2026-11-03. Everything here is about LONG-FORM only (~5 min stories). Shorts memory (`memory/short-form/strategy.md`, `learnings.md`, `viral-playbook.md`, `video-log.csv`, `competitors.md`) is read-only for the long-form skill; propose changes, never silently edit.

| File | Holds |
|---|---|
| `state.json` | Pipeline state: ideas, approvals, stage per project, next action. READ FIRST. |
| `playbook.md` | Long-form fundamentals (structure, hook, retention, packaging). Starts as hypotheses. |
| `competitor-intelligence.md` | Analysed long-form videos with evidence level (WATCHED / METADATA / INFERRED) |
| `ideas-by-pillar.md` | LIVE backlog, one section per pillar (rejections + reasons) |
| `ideas-backlog.md`, `ideas-v2.md` | v1 / v2 idea files, kept as history, not edited |
| `pillars.md`, `character-and-attraction-policy.md`, `thumbnail-experiments.md`, `policy-notes.md`, `pillar-channel-map.md` | Pillar definitions, tier rules, experiments, YouTube policy notes, channel map |
| `story-patterns.md` | Reusable storytelling mechanisms (with confidence) |
| `packaging-learnings.md` | Title/thumbnail findings |
| `performance-learnings.md` | Our long-form results and approved learnings |
| `research-log.md` | One line per research run: date, what, cost, what it could not show |
| `experiments.md` | Hypotheses and how we test them |
| `shorts-baseline.sha` | SHA-256 of Shorts files at build time, to prove the build did not touch them |

## Entry discipline
Every learning: `type` (observation / hypothesis / verified), evidence, confidence (low/med/high), date. One video never becomes a rule: verified needs >= 2 videos or a clear outlier flagged TENTATIVE. Do not claim to know YouTube's algorithm.

## Folder layout and cleanup (Joe, 2026-11-04, option A reorg)
- Per-video long-form folders: `videos/long-form/<slug>/` (Shorts: `videos/short-form/<slug>/`). Discovery, hunts, fact-checks and critic reviews: `research/long-form/` (Shorts research: `research/short-form/`). Shorts memory: `memory/short-form/`; shared competitor data: `memory/shared/competitors.md`.
- Scripts: `scripts/short-form/` (9:16 tools), `scripts/long-form/` (16:9 tools + `cleanup_lf.py`), `scripts/shared/` (`build_voice.py`, `captions.py`).
- Cleanup: Shorts `scripts/short-form/cleanup_videos.py` only touches `videos/short-form/` (original behavior, unchanged). Long-form: `scripts/long-form/cleanup_lf.py <slug>` = CAREFUL mode (explicit slug only, dry run by default, needs mp4 + thumbnail + upload.md, deletes only old renders and backup/scratch folders, images -> JPEG, audio kept; opt-in `--images delete`, `--audio clips`).
- Everything moved by `/private/...scratchpad/migrate.py`; (the backup folder `.claude/_backup-2026-11-04-reorg/` was deleted in the 2026-11-05 cleanup). Old baseline `shorts-baseline.sha` is historic (old paths); the new one is `shorts-baseline-after-reorg-2026-11-04.sha`.
