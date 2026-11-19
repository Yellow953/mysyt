---
name: demand-research
description: Off-YouTube demand research for Mr. Yellow Scarf. Uses live web search (Google Trends, Reddit, news, X, Wikipedia/Google search spikes) to find what people are curious about RIGHT NOW, then pairs each topic with a proven title framework backed by a real YouTube example. Use when Joe says "what's in demand", "what's trending", "trend research", "find trending topics" or wants ideas that don't come from competitor channels. Feeds script-writer Stage B/D as extra candidates; never replaces viral-research.
---

# Demand Research (off-YouTube trend lane)

Goal: find topics with live demand outside YouTube, then package them with title formats that already worked.
Output: `research/short-form/YYYY-MM-DD-demand.md` (Shorts) or `research/long-form/YYYY-MM-DD-demand.md` (long-form), plus a short chat summary. Ask Joe which format if unclear.
This is an ADD-ON lane. Stories still go through `script-writer` (3 stops for Joe). Do NOT write outlines or scripts here, and spend no credits.

## Read first
`memory/short-form/learnings.md` (Joe's preferences), `memory/short-form/viral-playbook.md`, `memory/short-form/video-log.csv` (avoid repeats), and `memory/shared/competitors.md` §1 (so you know our niche and proven concepts).

## Channel filters (drop a topic if it fails any)
- Monetization-safe: no war, nukes, invasions, terrorism, mass violence, graphic crime, politics/elections/politicians, tragedy, nudity. Romance only cheeky.
- Fits Mr. Yellow Scarf: relatable, funny, money/work/life/animals/tech/food/weird-but-true/pop-culture situations an everyman reacts to. No "worst deal in history" / sold-too-early premises.
- Facts must be real. Hypotheticals ("What if...") are fine only when clearly hypothetical and not about live real-world tragedies or named living people.
- Our speed: Shorts can use topics up to ~2 weeks old; long-form prefers topics with a longer tail (weeks to evergreen). Skip anything that dies in 72h.
- Original angle: topic demand is borrowed, the story and character are ours. Never copy another channel's script or layout.

## 1. Find demand (live web only)
Use WebSearch (standard mode first; extended for thin results). If no live search works, say so; never present old info as current.
Look across, last 7 days (today first):
- Google Trends / trending searches, "rising" queries
- Reddit: r/all rising, r/todayilearned, r/interestingasfuck, r/mildlyinteresting, r/AskReddit hot threads, niche subs that fit our topics
- News and explainers (general, tech, money, science, animals, food, weird news)
- X/Twitter viral posts and discussions
- Wikipedia most-viewed pages, Hacker News front page
- Product launches, viral memes, new studies, record-breaking things
Collect ~15 candidates. For each: what happened (1-2 sentences), real event date, why people care, source link, label **confirmed / rumor / speculation**. Never invent stats, views or engagement; blank beats a guess. Apply the filters, drop the rest.
Rank by: freshness, audience size, curiosity gap (an unanswered question), personal stakes (money, time, safety, status), story potential for our character, saturation (don't pick what every channel already covers).

## 2. Pair with proven title frameworks
For the top 8-10 topics, write up to 3 titles each using frameworks such as:
WHAT HAPPENS IF · WHY · THE HIDDEN CONSEQUENCES / what nobody tells you · EXPLAINED in N minutes · THE NEXT 24 HOURS · plus any others found in real winners.
Rule: a framework counts as PROVEN only if you found a real YouTube video using it that performed well. Record its title, channel, views and link (WebSearch/page seen; if you can't verify the number, write "unverified"). Prefer examples in our niche or format. If no example found, label the title **untested**.
Titles under ~65 characters where possible, no misleading clickbait; hypotheticals must read as hypotheticals.

## 3. Pick the top 5
For each: title, trending event + date, proven framework + example link, why people click (the curiosity/desire), thumbnail text (2-5 words that ADD to the title, never repeat it), video angle in our voice (what the story/character situation would be), evidence links, format fit (Short vs long-form) and shelf life.

## 4. Report to Joe (short, 8-12 lines)
- Top 5 as a compact list (title + one-line angle + format + shelf life)
- The ONE you'd research first and why
- What the data could NOT show (e.g. no search-volume numbers, YouTube saturation unchecked)
Then offer: hand the picks to `script-writer` as Stage D candidates (mark `source: demand-research`), and optionally check YouTube saturation for the chosen topic with `viral-research` (Chrome, read-only).

## Logging
When a demand-research idea becomes a video, put `demand-research` in `inspired_by` in `video-log.csv`, so `performance-review` can later compare trend-led vs competitor-led videos (a hypothesis for `learnings.md`, not a rule until ≥ 2 videos agree).
