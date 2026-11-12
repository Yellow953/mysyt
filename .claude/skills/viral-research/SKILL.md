---
name: viral-research
description: Stage A (Discover). Refresh memory/shared/competitors.md from the competitor channels Joe follows (read-only YouTube in Claude in Chrome), find their outlier videos, and analyse why each concept may have worked. Use when Joe says "research what's viral" or "refresh competitors", when memory/shared/competitors.md is older than 7 days, or before script-writer Stage B if the data is stale.
---

# Viral Research = Stage A: Discover

Goal: know which CONCEPTS have already proven demand on the channels Joe follows, with real numbers and an honest "why".
Output: updated `memory/shared/competitors.md` + a dated note `research/YYYY-MM-DD-discover.md` (method, what changed, deconstructions too long for the table).
Then hand over to `script-writer` Stage B. Do NOT invent ideas here.

## Rules
- Browser is read-only: search, open, read. No likes, subscribes, comments or settings changes.
- Numbers only from what you see on the page, with the date seen. Never estimate views, subs or dates. Blank beats a guess.
- Mark every "why" as **obs:** (seen in the video, title, description, chapters, captions or comments) or **hyp:** (our guess). Views alone never prove why.
- If Chrome is unavailable: say so to Joe, work from local `memory/shared/competitors.md` + `research/`, and label the result "local data, numbers dated <seen>". WebSearch cannot see YouTube stats.
- Long mechanical browsing (many channel pages) can go to a cheap subagent (Haiku/Sonnet); it must return table rows, not prose.

## 1. Refresh the channels
For each channel in `memory/shared/competitors.md` §1 (start with the ones whose numbers are oldest):
1. Open the channel's Videos tab sorted by Popular, then Latest, AND its Shorts tab (record whether it posts Shorts and how they do: we make Shorts, so Short-format proof counts most).
2. Record subs, video count, and the views of its ~10 latest videos → **typical views = median of those** (write it in the channel row with the date).
3. Every video with views ≥ 3× the typical views is an outlier → a row in §2a (or update the existing row). Also note clear flops (≤ 0.3×) on the same format: flops teach as much as hits.
New channels Joe names go into §1. Channels found by search go into §2b only when a video is an outlier.

## 2. Analyse the outliers (top 5-8 not yet analysed)
Open the video (Shorts as `youtube.com/watch?v=<ID>`). Read title, description/chapters, the first 10-20 s (captions on, muted), the end, and the top ~20 comments. Fill the row:
- premise / central question, hook (short quote ok), curiosity gap
- emotional triggers (curiosity, surprise, relatability, fear, humor, status/money, taboo, social tension)
- structure and payoff (how it escalates, what the ending delivers)
- format (S/L, length, visual style)
- packaging: the thumbnail (focal character, expression, text, contrast, whether a female character appears and her role: subject, other half of the premise, conflict, decoration) and the first 1-3 s (first frame + first line); does the female character appear in the video or only the thumbnail?
- why it may have worked (obs vs hyp); what the comments asked that the video didn't answer (a possible angle for us)
Copyright: save the analysis, at most one short quote per video. Never download videos (yt-dlp etc.).

## 2b. Thumbnail survey (when packaging evidence is thin)
Per channel, screenshot the Popular grid and the Latest grid and code every visible thumbnail into `memory/shared/competitors.md` §5: views, vs norm, focal subject, female character (none / decoration / part of the premise / subject), expression, text. Compare hits vs ordinary videos WITHIN each channel; report counts, not impressions, and what else differs (topic, title).

## 3. Mark what's used
Check §3 against `memory/short-form/video-log.csv` (`inspired_by`) so Stage B sees which source concepts we already drew from.

## 4. Report to Joe (short)
5-8 lines: the strongest proven concepts (video, channel, views vs norm, one-line why), anything that flopped on a format we like, and what the data could NOT show. Then offer Stage B.
