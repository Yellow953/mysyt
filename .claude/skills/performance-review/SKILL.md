---
name: performance-review
description: Pull real stats for published Mr. Yellow Scarf videos from YouTube Studio (read-only via Claude in Chrome), compare each to the channel median, turn patterns seen in 2 or more videos into rules in memory/short-form/learnings.md, and update the strategy and phase. Use when Joe asks "how are we doing", weekly, or 48h / 7d / 28d after an upload.
---

# Performance Review

Stats come from **YouTube Studio in Chrome, read-only** (no API yet). Never change any setting.

## 1. Pull stats
For each video in `memory/short-form/video-log.csv` with status `published`, open Studio → Content → the video → Analytics (Advanced mode if needed) and record:
- views at 48h / 7d / 28d (fill the columns that have come due)
- CTR (impressions click-through), avg % viewed
- Shorts: **viewed vs swiped away**
- likes, comments, subscribers gained
- Traffic sources (Shorts feed / Browse / Suggested / Search / channel page) as % → `notes` (tells us whether the first frame or the thumbnail is our real packaging)
- Retention curve: where the big drops are (second marks) → `notes`
Read numbers off the page; never estimate. If a number isn't shown yet, leave it blank.

## 2. Compare
- Channel median per format (Shorts and long separately), using the 7d views.
- `vs_median` = video's 7d views ÷ median (e.g. `2.3x`).
- Compare with playbook benchmarks (CTR, % viewed, viewed vs swiped).

## 2b. Check the concept hypothesis
Judge three things separately (playbook §1): the idea + opening (viewed vs swiped), the story (retention graph: name the beat where it sags), the payoff (end retention, rewatch, comments). Compare videos with and without the female co-star (`co_star`) only across ≥ 3 pairs with similar topics; until then it's a hypothesis.
For each video, read `inspired_by` and `hypothesis` in the video log and compare:
- Did the concept pull like its source (relative to OUR median, not the source's views)? Viewed-vs-swiped tests the premise and hook; avg % viewed and the retention drops test the story and payoff.
- Did the payoff deliver the premise (look at where people leave and at the comments)?
- Which source concepts / angles look worth another test, and which formats are getting repetitive across our last batches?
Write the result as a one-line verdict in the video's `notes`. Correlation is not cause: name what else differed (topic, length, title, thumbnail, post time).

## 3. Learn (strict)
Look across videos at angle, hook_type, title_pattern, thumbnail_style, length, topic.
- A pattern seen in **≥ 2 videos** → `ACTIVE` rule in `memory/short-form/learnings.md` with evidence (slugs + numbers vs median).
- One huge outlier (≥ 5× median) → `TENTATIVE` rule.
- An existing rule contradicted by ≥ 2 newer videos → mark `RETIRED` with the reason. Never delete it.
- Correlation ≠ cause: say what else differed.
- Only write rules that change the NEXT idea choice (e.g. "you-in-it what-ifs from OminiAM/Awaken beat company histories on viewed-vs-swiped, 3 vs 3 videos"). Put them in learnings.md section B under "Concept lessons"; no generic writing tips.

## 4. Update the strategy
- Fill the Phase 1 angle table in `memory/short-form/strategy.md` (Shorts done, avg views, avg % viewed, verdict).
- Phase exit criteria met? Recommend moving phase, but **only move with Joe's OK**.
- Rewrite "Next actions" around what's winning (more of the winning angle/hook, drop losers).

## 5. Report to Joe (short)
3–5 lines: best and worst video and why, the new rules, what we do differently next. Offer a dashboard artifact if there are ≥ 5 videos.
