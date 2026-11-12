# Start Here (for Joe)

## First time
1. Put this folder on your Mac, e.g. `~/Projects/mr-yellow-scarf`.
2. Copy your favourite Mr. Yellow Scarf image into `assets/character/`.
3. Open Terminal in the folder and run:
   ```
   claude --chrome
   ```
4. Say: **"run setup"**. Claude installs the local tools, saves the character in Higgsfield, lets you pick a voice, and walks you through YouTube API access.

## Every day (≈ 1 hour)
Open Claude Code in the folder (`claude --chrome`) and just say **"good morning"**.
It reads its memory, tells you where we are in the strategy, and suggests today's job.

## Things you can say
| Say | What happens |
|---|---|
| "research what's viral" | Refreshes the competitor channels in Chrome: outlier videos and why they worked |
| "next idea" / "make a short about X" | 3 idea candidates built on proven competitor videos → you pick → outline → you OK → script → you OK |
| "produce it" | Images (Higgsfield), local voice, local edit, captions → finished video |
| "thumbnails" | 2–3 A/B thumbnail variants |
| "upload it" | Uploads private + metadata; schedules in Studio after your OK |
| "check comments" | Drafts replies for you to approve, pins/hearts the best |
| "how are we doing" | Pulls stats, learns from them, updates the strategy |

## What it always asks you first
Spending > 20 credits, uploading, publishing, posting replies, deleting files.

## Where the memory lives
`memory/short-form/` (Shorts: strategy, learnings, playbook, video log, idea backlog), `memory/long-form/` (long-form: state.json, playbook, pillars, backlog) and `memory/shared/` (competitors). Videos live in `videos/short-form/` and `videos/long-form/`. You can open and edit any of them.
