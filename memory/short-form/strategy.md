# Channel Strategy: Live State
_Last updated: 2026-11-12 by Claude (performance review: why so few views)_

## Current phase
**Phase 0: Setup**

## Current goal
Get the pipeline working end to end and publish the first test Short.

## Phase plan
| Phase | Goal | Exit criteria (evidence needed to move on) |
|---|---|---|
| 0 Setup | Tools installed, character element saved, voice chosen (OAuth deferred) | 1 test Short rendered and approved by Joe |
| 1 Shorts testing | Find the winning angle | 12 Shorts out (4 angles × 3), ≥ 14 days of data each |
| 2 Long-form | Prove long videos work on the winning angle(s) | 8 long videos out; at least 1 with views ≥ 3× channel median |
| 3 Scale | Monetize and grow | YPP eligible; steady 1–2 long + 4–6 Shorts per week |

## Test angles (Phase 1)
| # | Angle | Shorts done | Avg views | Avg % viewed | Verdict |
|---|---|---|---|---|---|
| 1 | Weird jobs in history | 0/3 | n/a | n/a | n/a |
| 2 | Everyday life in odd places/times | 0/3 | n/a | n/a | n/a |
| 3 | Body & survival questions | 0/3 | n/a | n/a | n/a |
| 4 | History stories, global (renamed 2026-10-31 from "Middle East & Silk Road"; chosen by story, not region) | 0/3 (earlier Roman/Taklamakan/Sultan's brother Shorts count) | n/a | n/a | n/a |

## Next actions
- [x] Setup done (2026-10-27): ffmpeg + espeak-ng installed ✓, Higgsfield MCP connected ✓ (Plus, 999 credits), Claude in Chrome connected ✓ (2026-10-27); Kokoro + Whisper + YouTube libs installed in .venv ✓; 4 voice samples in assets/voice-samples/.
- [x] Save Mr. Yellow Scarf as a Higgsfield reference element (aa6661ee-d997-489c-9e1b-9b9adbed8c94, 2026-10-27)
- [x] Pick the channel voice: Kokoro am_puck @ 1.05 (2026-10-27)
- [x] YouTube API upload DONE 2026-10-30 (private uploads via scripts/short-form/youtube_upload.py; Joe sets visibility/schedule in Studio). Comments/analytics API not set up (Studio via Chrome instead). Test upload was a duplicate private copy of kodak-digital-camera (https://youtu.be/mDeeGQnZsi0); Joe deletes it in Studio. Joe publishes/schedules in Studio; API audit not needed for now.
- [x] Created all 8 skills + quality-reviewer agent (2026-10-27). scripts/shared/captions.py, assemble.py, thumbnail.py get built on first use by video-producer / thumbnail-maker.
- [x] viral-research DONE (2026-10-27): 6 videos deconstructed with the watch-with-subtitles method, plus search sweep. Full report: research/short-form/2026-10-27-viral.md. Ideas-backlog refilled (15 ideas: 9 new, 6 existing; 3 new Middle East ideas, 2 of them at 17). Raw notes: research/short-form/2026-10-27-notes-draft.md.
- [ ] Add royalty-free music to assets/music/ (with license file) and a bold font to assets/fonts/ before the first render
- [ ] First Short READY TO POST 2026-10-27 (v4: captions auto-fit, music in assets/music/): videos/short-form/2026-10-27-farming-worst-deal/output/2026-10-27-farming-worst-deal.mp4 + upload pack videos/short-form/2026-10-27-farming-worst-deal/upload.md. Joe uploads manually. Open: confirm music license in Audio Library, Joe uploads then sends the link. Next: Short #2 (backlog), thumbnails not needed for Shorts. Mamluk Short shelved.

- [ ] **Competitor-format test plan (Joe 2026-11-12: "try all the things that worked").** Source: research/short-form/2026-11-12-three-new-channels.md + memory/shared/competitors.md. One format per 3-Short batch, in this order:
  - **T1 Story parable (H10), FIRST.** ~60 s, real mocked-genius stories: strange action at line 1 with no context → "You see," stakes → mockery → false failure → disaster proves him right → mechanism revealed in 1-2 lines → cut mid-sentence so it loops to line 1. Model: Ricks Clips (28M/33M; his explainers 131-316K). Next step: script-writer Stage B, 6-8 real candidates (e.g. Semmelweis, Wegener, the Hindenburg/Titanic warners), Joe picks 3.
  - **T2 Wronged-you time-jump POV (H11).** ~45 s Short: "POV: [she/boss/family] laughed at you — N years later...". Model: POV Simple Finance (684K), Nate's Money Map. Also hand to the long-form track as a candidate pillar (memory/long-form/ideas-backlog.md).
  - **T3 News-jack (H12).** Opportunistic: one Short within 48 h of the next huge money/tech event. Model: Paper Billions (990K in 4 days).
  - Applies to all: cliffhanger-cut loop ending (Ricks + our volcano replay data, H8); YOU/other labels at frame 0 (POV Simple Finance thumbnails, H9).
- [ ] Still open from Der Framer: H9 relatable-cringe batch (3 rendered, uploaded private 11-09) awaiting publish + stats.

- [ ] **Higgsfield skills review (2026-11-12):** research/short-form/2026-11-12-higgsfield-skills-review.md. 22 proposals incl. a deep dive into Higgsfield's own faceless-video/thumbnail workflows (through-line object, ≤8-word hook, reorder/turn tests, line hygiene, long-form documentary skeleton, ≤1.5-2 s picture changes via micro-variation edits, Grady delivery consistency, mix levels, 16 thumbnail frameworks; earlier: causal-link test, premise contract, 4-field outline beats, generated music via elevenlabs_music_v2_5, loudnorm in assemble.py, virality_predictor calibration, 3-promise packaging, 10-min long-form math). APPLIED 2026-11-12 (Joe: 'apply the learning'): retention craft = playbook §13 + script-writer/lf agents; Grady consistency, pace gate, SFX rule, loudnorm in assemble.py (tested -13.9 LUFS); 16 thumbnail frameworks. As tests: H13 fast picture changes, H14 generated music, H15 virality predictor, L-len10. Next: test Google Flow (thumbnails, then maybe scene images).

## Decisions made
- 2026-11-12: Thumbnails (Shorts covers + long-form) move to Google Flow, free (Joe tested it). Claude writes Flow prompts and checks results; 0 Higgsfield credits on thumbnails. Skills updated: thumbnail-maker, publisher, lf-packaging, long-form stage 3.
- 2026-10-26: Channel/character name "Mr. Yellow Scarf". Style: simple paint-style cartoon (Lore Explained-like but original), yellow scarf ties to the Yellow brand.
- 2026-10-26: Images through Higgsfield MCP on the Plus plan (~0.25 credits/image). Move to the pay-per-use API only if needed.
- 2026-10-27: Start with Shorts, then long-form for winners.
- 2026-10-27: Channel voice = Kokoro `am_puck`, speed 1.05 (picked from michael, puck, lewis, fenrir samples).
- 2026-10-27: Skip YouTube API/OAuth for now. Joe uploads manually from Studio until quality is proven; Claude prepares title, description, tags and thumbnail as an upload pack. Stats come from Studio in Chrome (read-only) instead of the Analytics API.
- 2026-10-27: YouTube API project not audited yet, so uploads land private and Joe schedules in Studio. Submit the audit in the background.

## Open questions for Joe
- (none)

## Update 2026-10-27 (shorts sweep)
- Shorts sweep done (Sonnet subagent): research/short-form/2026-10-27-shorts-sweep.md, 10 new ideas added to ideas-backlog.md (all unverified; multiples are views/subs). Waiting on Joe to pick Short #4; show hook + outline before credits.

## Update 2026-10-27 (3 new Shorts scripted)
- Joe picked ideas 5, 6, 8. Scripted + reviewer PASS (round 3): videos/short-form/2026-10-27-roman-legionary-pay (10 img), videos/short-form/2026-10-27-taklamakan-survival (10 img, ~53 s: trim pauses if > 52 s after recording), videos/short-form/2026-10-27-sultans-brother (12 img). ~32 images = ~16 credits + ~10 voice, over the 20-credit rule: waiting on Joe's OK to produce. scripts/short-form/assemble.py now supports a scenes.json "moves" array (several camera moves per scene).
- Check scene crops at 270 px (Roman cover scene 3) once images exist.

## Update 2026-10-27 (3 Shorts produced)
- PRODUCED (~25 credits total, balance 1026.5): roman-legionary-pay (51.9 s), taklamakan-survival (52.4 s), sultans-brother (54.1 s, a bit long). Each has output/<slug>.mp4, thumbnail.png and upload.md in videos/short-form/<slug>/. Waiting on Joe's feedback and uploads. 6 Shorts now exist (farming, ancient-free-time, fur-to-fashion + these 3); next: performance-review at 48 h after the first uploads.

## Update 2026-10-28 (all 6 Shorts uploaded)
- Joe uploaded all 6 (Studio screenshot). Farming: public 2026-10-27, 3 views so far. Scheduled (17:00 Lebanon, times assumed from Joe's pattern; dates from Studio): ancient-free-time Oct 28, fur-to-fashion Oct 29, roman-legionary-pay Oct 30, sultans-brother Oct 31, taklamakan-survival Nov 1 (Joe swapped the last two). Studio list shows Short lengths 0:50-0:59.
- Next: run performance-review ~48 h after each goes live (farming first, ~Oct 29-30); after ~Nov 3 compare angles. Keep the backlog stocked (research done 2026-10-27; 7 unused ideas from the sweep). Phase stays 0 until Joe says the test Short is approved; Phase 1 data starts now.

## Update 2026-10-27 (late)
- Short #1 (farming) ready to post; Joe uploads manually (upload pack + thumbnail in its folder).
- Short #2 pivot: Joe rejected two-sleeps ("not engaging, boring") and Mamluk; chose "what did humans do all day" as OUR OWN Short: videos/short-form/2026-10-27-ancient-free-time/ (script v3, review PASS round 3). Waiting on Joe's OK to produce (~6 credits images + 2-4 voice + 0.5 thumbnail).
- Learned: Joe wants engaging hooks with a spoiler/twist, jokes every few seconds, second person; originality: never condense another channel's video.
- 2026-10-27 (night): Short #2 "What Ancient Humans Did After Lunch" PRODUCED (54 s, ~10 credits): videos/short-form/2026-10-27-ancient-free-time/output/2026-10-27-ancient-free-time.mp4 + thumbnail.png + upload.md. Waiting on Joe's feedback and uploads (Short #1 farming first, #2 evening slot test). Next: after first stats, run performance-review at 48 h.
- 2026-10-27: Joe scheduled Short #2 (ancient-free-time) in Studio for Wed 2026-10-28 17:00 (his time, Lebanon). Farming Short: Joe to post/confirm and send link. New rule: thumbnails reuse existing scene images (no new credits).
- 2026-10-27 (night): Short #3 lice-puzzle draft (videos/short-form/2026-10-27-clothes-lice/, review PASS) SHELVED: Joe wants the fur-to-fashion arc instead. New: videos/short-form/2026-10-27-fur-to-fashion/.
- 2026-10-27 (night): Short #3 'fur-to-fashion' SCRIPTED, review PASS round 3: videos/short-form/2026-10-27-fur-to-fashion/. Waiting on Joe's OK to produce (~4.5 credits images + 2-3 voice; thumbnail from scene 2).
- 2026-10-27 (late night): Short #3 'fur-to-fashion' PRODUCED (49.5 s, ~10 credits): videos/short-form/2026-10-27-fur-to-fashion/output/2026-10-27-fur-to-fashion.mp4 + thumbnail.png (female lead before/after) + upload.md. Suggested slot Thu 17:00 Lebanon. Waiting on Joe's feedback and the links of the posted Shorts.

## Update 2026-10-28 (research reset)
- Joe unhappy with quality + repeating research. Ran new research on 11 reference channels (research/short-form/2026-10-28-viral.md): 4 videos deconstructed, 10 parallel ideas in 3 new formats (thought experiment, POV, tech history). Waiting on Joe to pick which 2-3 to script. Open questions: Shorts vs long-form for these formats; style upgrade (labels/counters, bolder colour) vs current approved ink style.

## Update 2026-10-29 (tech-history batch rendered)
- Joe chose tech history (3 Shorts) and said go: scripted (reviewer 3 rounds), produced: videos/short-form/2026-10-29-blockbuster-netflix (49 s), -kodak-digital-camera (53 s), -nintendo-before-mario (53 s). Each has output/<slug>.mp4, thumbnail.png, upload.md, cost.md. ~24.5 credits total (balance 1001.95). Waiting on Joe to watch + upload; no schedule suggested yet (suggest 3 different slots to test).
- Batch test rule: 3 Shorts per topic/format; compare avg views + % viewed vs the first 6 Shorts at ~7 days. Next batches: thought experiments (food runs out / pencil), POV (first human to eat X).

## Update 2026-10-29 (schedule, from Joe's Studio screenshot)
- Public: farming 10-27 (6 views), ancient-free-time 10-28 (2), fur-to-fashion 10-29 (0, just live). Scheduled: roman-legionary-pay + sultans-brother 10-30; taklamakan + blockbuster-netflix 10-31; kodak + nintendo 11-01 (times not shown in the list). Next batch: thought experiments (Sun disappears, internet dies/food, pencil from scratch). Review stats ~48 h after each goes live.

## Update 2026-10-29 (thought-experiment batch scripted, awaiting production OK)
- Joe's picks: Sun disappears, pencil from scratch (forest + mine), internet dies: what still works. Scripts v3, reviewer PASS (sun r3, pencil r3, internet r2): videos/short-form/2026-10-30-sun-disappears (10 img), -pencil-from-scratch (10 img), -internet-dies (9 img). ~24 credits to produce (29 images + 30 voice clips); waiting on Joe's OK (over the 20-credit rule).

## 2026-10-29 (late): thought-experiment batch produced
Sun disappears (45 s), pencil from scratch (51 s), internet dies (52 s) rendered with thumbnails and upload.md in videos/2026-10-30-*/. Cost 22.3 credits (balance 968.15). Thumbnail text for split covers sits at the bottom (y 0.64) so it does not cover faces. Next: Joe uploads/schedules (Lebanon night = US evening), performance review ~48 h after each goes live, compare tech vs thought-experiment vs first six at ~7 days. Next batch candidate: POV ("you're the first human to eat X").

## 2026-10-30: research round 3 (9 channels from Joe)
Findings in research/short-form/2026-10-30-viral.md: timeline what-if (OminiAM 1.05M on 5K subs), "your life at every level of X" (Arnie 164K subs/18 videos), day-in-the-life myth flip (Ink Story 328K). Next: Joe picks 3 for the next batch; verify facts, script, reviewer, then ask before spending credits (~22 per batch).

## 2026-10-31: pirates script (new script DNA test)
videos/short-form/2026-10-30-pirates-all-day/: script v4 (117 words, 10 scenes, reviewer 3 rounds, last round REVISE-minor fixes applied). Joe asked to see the script first; images/voice NOT produced (~8 credits). Next: Joe's feedback on the script, then produce; then 2 more day-in-the-life topics (knight, gladiator).

## 2026-10-31: script system reset (Joe)
Joe: reviewer + old rules/agents were ruining scripts. Reset: memory/script-template.md (his pirates script) is the model; script-writer skill and quality-reviewer rewritten (backups in .claude/_backup-2026-10-31/); CLAUDE.md gate changed; conflicting learnings marked RETIRED. Pirates v8 = his script near-verbatim, awaiting his OK to produce (~7 credits).

## 2026-10-31: pirates video produced
videos/short-form/2026-10-30-pirates-all-day/output/ (55.9 s, thumbnail WORST JOB AT SEA, upload.md in the SEO package format). Cost 8.5 credits (balance 959.65). Script = Joe's template trimmed to the length rule (first cut ran 64 s, trimmed 4 lines and re-recorded). Next: Joe reviews/uploads; then batch partners (knight, gladiator) using memory/script-template.md beat sheet.

## 2026-10-31: music rotation
Downloaded "Drunken Sailor - Cooper Cannell.mp3" (YouTube Audio Library, 4.5 MB) into assets/music/; pirates video re-rendered with it (scenes.json "music" field; same loudness as the old track, -13.0 vs -13.4 dB). Other shortlist tracks (memory/short-form/music-shortlist.md) wait for Joe's OK to download: Paulseante (Sun), Blue Screen Of Death (internet), Silly Snickerdoodle (pencil). Until then the Sun/internet/pencil renders still use the old Country track.

## 2026-10-31: pirates uploaded (private)
https://youtu.be/G-_DOTYuAYI (private, API upload with SEO title/description/hashtags + thumbnail). Joe flips it to public or schedules it in Studio: https://studio.youtube.com/video/G-_DOTYuAYI/edit. Performance review 48 h after it goes live.
- (2026-10-31) Day-in-the-life batch: knight + WW2 soldier scripted from the template beat sheet, reviewed once each (facts + engagement), awaiting Joe's OK; music planned: Medieval Astrology (knight), Trudging Along (WW2). Cost ~7 credits each.

## 2026-10-31: knight + WW2 produced
videos/short-form/2026-10-31-knight-all-day (56.6 s, music Medieval Astrology) and videos/short-form/2026-10-31-ww2-soldier-all-day (55.6 s, music Trudging Along), thumbnails + SEO upload.md ready. Cost 15.2 credits total (balance 944.45). Day-in-the-life batch (pirates, knight, WW2) is complete; next: Joe uploads/schedules, performance review 48 h after each goes live, compare formats (tech vs thought-experiment vs day-in-the-life). Lesson: Grady runs ~0.5 s/word slower than my estimate, so aim for ~100 words (not 110) to land at ~55 s.

## 2026-10-31: knight + WW2 uploaded (private)
Knight https://youtu.be/bTSJYmQ5xko , WW2 https://youtu.be/IJu5xmLoS7k (thumbnails confirmed in Studio). Joe schedules/publishes in Studio. Performance review 48 h after each goes live.

## 2026-10-31: LEVELS batch scripted (Joe's picks)
Joe chose 3 LEVELS Shorts: Egypt (slave -> free farmer -> pharaoh), Royal Navy (recruit -> sailor -> carrier captain), Business (hustler -> startup -> CEO). Scripts v1 in videos/short-form/2026-10-31-levels-egypt|navy|business/script.md (105-109 words, template voice, overlay LEVEL 1/2/3). Research: research/short-form/2026-10-31-levels-topics.md. Waiting on Joe's OK; no credits spent (~8 each when produced); music not chosen yet. Quality-reviewer not run yet (once per script, after Joe's feedback).

## 2026-10-31 (later): Joe replaced my LEVELS drafts
Joe rejected my 3-rung LEVELS scripts as repetitive and pasted his own (7 rungs each). Saved as videos/short-form/2026-10-31-levels-navy|egypt|business/script.md (old ones in script-v1-rejected.md); format rules in memory/script-formats.md #4 + learnings.md. ~190-200 words each (~90 s est.): waiting on Joe's decision to trim vs keep length, then OK to produce (9 scenes each, ~10-11 credits each). No credits spent.

## 2026-10-31 (night): LEVELS batch produced
videos/short-form/2026-10-31-levels-navy (97 s), -egypt (105 s), -business (105 s): output/<slug>.mp4, thumbnail.png, upload.md. ~22 credits. Joe's wording kept (only fix: navy "more than a thousand people"). Music reused existing tracks (Trudging Along, Medieval Astrology, Country Music) because new downloads need Joe's OK. Length is ~100 s, not 55 s: first test of long Shorts. Next: Joe watches, uploads/schedules; performance-review 48 h after live; compare LEVELS vs MYTH/DAY on % viewed and retention.

## 2026-10-31 (night): LEVELS batch uploaded (private)
Navy https://youtu.be/SDiQB5zXBIY , Egypt https://youtu.be/QJfeDOLSukY , Business https://youtu.be/d88rqPbcJcM (API, thumbnails set after processing). Joe confirms thumbnails in Studio and schedules/publishes. Performance review 48 h after each goes live.

## 2026-10-31 (night): attraction batch produced (Joe's 3 ideas)
videos/short-form/2026-10-31-what-if-crush (58 s, music Bright Side), -levels-attractive (79 s, Country Music fallback; planned Keep It Movin), -validation-trap (53 s, Trudging Along fallback; planned Mirror Mirror). Each has output/<slug>.mp4, output/thumbnail.png, upload.md, cost.md. ~19.6 credits total. Music: the 2nd/3rd Audio Library downloads never arrived (Studio download starts after ~1 min); re-render with the right tracks once Joe puts them in assets/music/ (set "music" in scenes.json, run assemble.py). Nothing uploaded. Next: Joe watches, uploads/schedules; performance review 48 h after each goes live; compare attraction batch vs day-in-the-life vs LEVELS.

## 2026-10-31: script system reset #2 (Joe)
Joe: script skills and reviewer weren't good. Replaced with his researcher/scriptwriter brief: .claude/skills/script-writer/SKILL.md (research → patterns → ideas → HOOK/SETUP/DEVELOPMENT/ESCALATION/PAYOFF → timestamped stickman storyboard → accuracy → learn from performance) + a production-handoff section (scenes.json, style block). Removed: quality-reviewer agent, memory/script-template.md, memory/script-formats.md, old script-writer (all in .claude/_backup-2026-10-31-script-reset/). Old script rules in learnings.md marked RETIRED. Next: write the next Short with the new skill and show Joe the script before credits.

## 2026-10-31 (late): staged idea workflow (Joe)
Joe: the strike script was a weak lunch joke, repetitive humor, unsatisfying ending; fix the workflow, not add rules. Built: memory/shared/competitors.md (single competitor dataset, migrated + refreshed OminiAM/Arnie/Ink Story live), viral-research = Stage A Discover, script-writer = Stages B-H with stops after ideas, outline and script; video-log gained inspired_by/hypothesis; performance-review checks the hypothesis; backlog = concept cards (old list archived); playbook /20 score removed. Backups: .claude/_backup-2026-10-31-staged/. Test run: 2 candidates presented (appendix through the centuries, recommended; last human 24 h). Next: Joe picks → Stage E research. Also overdue: performance-review (log has no stats for 8+ published Shorts).
- (2026-10-31, later) Joe approved appendix idea + "Can 2 People Restart Humanity?" (instead of last-human). Pitcairn outline v1 rejected as oversimplified/inaccurate; rebuilt as v2 with a claim/evidence record (videos/short-form/2026-10-31-two-people-restart/research.md, outline.md; v1 kept). script-writer upgraded: three qualities (appeal/originality/story), story viability check, research-discovers-the-story with claim/evidence table, outline with hook/ending options and beat purposes, creative review. Waiting: Joe on outline v2 (and the appendix outline).

## 2026-11-01: fundamentals reset (Joe: "I just want to nail the videos")
Rewritten: memory/short-form/viral-playbook.md (the fundamentals: idea first, hook opens a question, story beats information, every beat earns its place, emotion, visual storytelling, payoff, packaging incl. first frame + female co-star, metrics map); script-writer slimmed to judgment (packaging at idea stage, proportional research, creator review); viral-research + Shorts tab + thumbnail survey; performance-review + traffic sources + co-star pairs; learnings.md rebuilt (preferences / validated / hypotheses / pipeline; old file in memory/short-form/archive/); video-log + co_star, first_frame. Backups: .claude/_backup-2026-11-01-fundamentals/.
**Rule: one change per batch.** Each batch of 3 tests ONE thing (format, length, co-star, hook style) so results are comparable. Stop switching formats daily until we have data.
- (2026-11-01) First real stats + thumbnail survey: research/short-form/2026-11-01-thumbnails-and-own-stats.md. 6/7 public Shorts got 0-8 views; Blockbuster 505 views, 80.2% swiped, ~43% viewed, 100% Shorts feed → our bottleneck is the first second. Women in hits on 3/9 competitor channels only, and as part of the premise. Outlines rewritten story-first: two-people v3, appendix v2. Waiting: Joe's approval of the outlines. 8 Shorts scheduled Nov 1-4: run performance-review ~48 h after each.

## 2026-10-31 (late): global history rule + Mansa Musa research (Joe)
Joe approved: history is chosen by story potential, not geography; flag repeated regions/eras among the last 15 historical ideas, no quotas. Applied (backups in .claude/_backup-2026-10-31-global-history/): script-writer SKILL.md (Stage B item 5, Stage C story test, handoff field), learnings.md section A, viral-playbook.md section 2, strategy.md test angle 4 renamed, ideas-backlog.md (card format Region/era, archive note, card C updated), video-log.csv (new last column region_era, backfilled for history rows; no script reads the CSV, skills name columns only, all rows still 30 columns).
Mansa Musa (card C): outline v2 awaiting Joe. Findings: price fall and 12 years = al-Umari only (Schultz 2006 disputes; full text not obtainable: academia.edu 403, UChicago Mamluk Bibliography record has no abstract); borrowing in Cairo reported by later writers per secondary sources, details unverified; a debt owed by Musa is cited at Levtzion & Hopkins pp. 299, 358 (merchant Siraj al-Din sent to Mali in 1334, via Wikipedia "Al-Sahili"). No script written, no credits spent.

## 2026-10-31: 7 new competitor channels added (Joe)
Cave Crush, Logical Money, Human Origins, Legend POV, Nate's Money Map, Built On You, Apefully added to memory/shared/competitors.md §1 + outlier rows in §2a (numbers seen 10-31, Latest tab only). Not done: Shorts tabs, Popular sort, opening videos (all "why" is hyp from titles). Standouts: Nate's Money Map "boss wrongs you" POV 301K/232K on 1K subs; Apefully "Why Evolution..." 520K; Cave Crush intimate-body cavemen 92K.

## 2026-11-01: appendix + Mansa Musa dropped (Joe)
Joe deleted both ideas. Removed videos/short-form/2026-10-31-appendix-centuries/ and the backlog cards/row for appendix and Mansa Musa (older mentions in strategy.md history, research/ notes and .claude/_backup-* are left as records). Pending outline now: only "Can 2 People Restart Humanity?" v3.

## 2026-11-01: two-people-restart rebuilt from scratch (Joe)
Old v1-v3 moved to videos/short-form/2026-10-31-two-people-restart/_old-before-restart/. New research.md (15-claim table) + outline v4: hook "you and one stranger", story = Charles II cost -> Pingelap (~20 survivors, hidden gene) -> Pitcairn (the killer was each other) -> "two no, ~20 yes, find 18 more". Waiting on Joe's OK on the outline (hook, ending A/B, taboo level, co-star). No script, no credits.
- (2026-11-01) Joe approved outline v4 (hook 1, ending A, taboo implied, co-star yes). script.md v1 written (104 words, 10 scenes, ~55 s, self-review inside). Waiting on Joe's OK on the script; no scenes.json, no credits until then.

## 2026-11-01: two-people-restart PRODUCED
videos/short-form/2026-10-31-two-people-restart/output/ (59 s, 10 scenes, thumbnail ONLY TWO?, upload.md, cost.md ~10.5 credits). Script trimmed from 112 to 104 words after the first voice cut ran 66 s (cut "The dynasty ended", "In the 1770s" moved to overlay, "On Pacific island" kept). New music: Resolution Or Reflection (The Grey Room) in assets/music/. Next: Joe watches, uploads/schedules; performance-review 48 h after live; compare co-star video vs others (H1).

## 2026-11-01: two-people-restart uploaded (private)
https://youtu.be/QiZak0qtzdU (API upload, thumbnail set after processing). Joe confirms the thumbnail in Studio and publishes/schedules: https://studio.youtube.com/video/QiZak0qtzdU/edit. Performance review 48 h after it goes live (co-star test H1).

## 2026-11-01: competitor gap analysis (Joe asked for untested topics/styles)
From memory/shared/competitors.md (numbers 10-31/11-01, no live refresh: Chrome disconnected). Untested styles with competitor proof: worst-jobs Shorts (angle 1 is still 0/3), modern-person-in-the-past Shorts, POV boss-wrongs-you (Nate), allegory "X is killing you" (Day One 5.6M), body/evolution flaws (Apefully), intimate-detail ancient life (Cave Crush, Human Origins), invention origins (Quill, Relic), survival counter (SARAAB). Presented to Joe in chat; waiting on his pick for the next batch (one change per batch). Nothing written to the backlog yet.

## 2026-11-01: TEST PLAN (Joe's list): 8 style batches x 3 Shorts, one style per batch
Joe's rule: test each idea style in a batch of 3 Shorts. Proposed order and topics (all unverified, Joe can swap): 1 Modern person in the past (smartphone to 1700 / modern dentist in Rome / barista in Ottoman coffee ban 1550s); 2 Worst job in history (whipping boy / executioner can't buy bread / groom of the stool; spare: match girls); 3 Allegory "X is killing you" (Comfort / Procrastination / Your phone); 4 Body & evolution (goosebumps / appendix / why we cry; spare: sleep); 5 Intimate details of the past (where ancient people slept / teeth before toothbrushes / privacy in a castle); 6 How did humans invent X (soap / glasses / the clock; Joe to confirm, avoid Relic's toilet); 7 Survival with a day counter (30 days in an Ice Age cave / 7 days in a WW1 trench / 30 days of medieval winter); 8 Survival/zombies (Joe mentioned a channel doing it: name needed, then research). Waiting: Joe picks which batch goes first. Compare each batch's avg views and % viewed against the channel median; no credits before script approval.

## 2026-11-01: batch 1 (Modern person in the past) SCRIPTED
Joe picked: Starbucks-style coffeehouse in Istanbul (#3), you know the 1929 crash and make money (#7), and from B/C I chose C (Gold Rush pans, Sam Brannan; safer than Bitcoin advice and a third way to get rich). Scripts v1 (~95 words each, ~52 s, research.md claim tables, self-review inside): videos/short-form/2026-11-01-coffeehouse-1554, -crash-1929-rich, -gold-rush-shovels. Joe skipped the outline stop and asked for scripts directly. Waiting on Joe's OK per script (changes), then scenes.json + production (~24 credits total, over the 20-credit rule: ask). Logged in video-log (status scripted). Open: music downloads need Joe's OK; Livermore proof line optional in the crash script.

## 2026-11-01: batch 1 PRODUCED (style v2 colorful)
Joe said go + "new music" + "more colorful". Rendered: videos/short-form/2026-11-01-coffeehouse-1554 (54.7 s), -crash-1929-rich (56.4 s), -gold-rush-shovels (51.2 s), each with output/<slug>.mp4, thumbnail.png, upload.md, cost.md (~8-9 credits each, ~25 total, balance before 936). Scripts kept as approved (no changes); crash pauses trimmed to 0.3 s. Music: crash = Mirror Mirror, gold = Keep It Movin' (both new, found in ~/Downloads/Mr Yellow Scarf/ since Chrome was disconnected); coffeehouse = Resolution Or Reflection (REUSED; needs a warm oud/acoustic track from Joe). New style v2 recorded in learnings (A, H7) and script-writer/video-producer skills. Next: Joe watches, uploads/schedules (suggest 3 different slots); performance-review ~48 h after live; then batch 2 (worst jobs).
- 2026-11-01: Joe asked for Country Music on all three batch-1 videos; re-rendered. Now the default music.

## 2026-11-03: stats pull + Planet Cosmic added
- Planet Cosmic (@PlanetCosmic, 669 subs) saved in competitors.md: one 458K hit (Ancient Pleasure, 2nd upload) vs 470 for the first upload of the same title; 15 of 16 videos under ~2K.
- Our public Shorts views (11-03, public channel page; Studio would not render in Chrome, so no CTR/viewed-vs-swiped/retention): Nintendo 1.2K, WW2-all-day 1.1K, Blockbuster 619, Kodak 566, Navy ladder 416, knight 22, farming 8, sultan 9, pirates 6, free-time 3, taklamakan 3, roman 1, fur 0. Not yet public: Egypt, Business, two-people, batch 1.
- Pattern (tentative, 2 batches): tech-brand history (3/3) and WW2 got hundreds-1K; early history/ancient Shorts (6) all < 10 despite being up to a week old. Next: retry Studio for viewed-vs-swiped, review again after Egypt/Business/two-people/batch 1 are live (~7 d).

## 2026-11-03 (later): Studio stats pulled (Studio works when reached via sidebar click; direct /analytics URLs error)
- Channel 28 d: 2,418 views, 8.3 h watch, +3-5 subs, 93.7% of views from the Shorts feed, 42.2% stayed / 57.8% swiped. Nintendo gave all 3 subs.
- Per video (avg % viewed / engaged views): Nintendo 43.6% / 648 of 1177 (55%); Kodak 64.5% / 211 of 566 (37%); Netflix 57.2% / 162 of 624 (26%). Tiny ones (<15 views): pirates 98.8%, farming 98.4%, knight 79.9%, sultan 43.7%, free-time 56.7%, fur 29.2%; 4 of 5 have almost no engaged views, so the % is a few friends.
- Not captured: per-video viewed-vs-swiped for WW2/Navy (published Nov 3, outside the Nov 2 window). Next: re-pull at 7 d.

## 2026-11-03: Long-form track added (Joe), parallel to Shorts
Joe approved running long-form IN PARALLEL with the Shorts phases (they are unchanged; the Phase 2 gate above does not block this track). Target ~5 min story videos. Everything lives in its own skill (`long-form-video`), agents (`lf-*`), memory (`memory/long-form/`, state in `state.json`) and folder (`research/long-form/`). Long-form results are tracked separately and never mixed with Shorts stats. Next: run long-form Stage 1 discovery.

## 2026-11-04: cut-out animation method analysed (Joe pasted Danny Why guide)
Comparison + proposed pilot in research/short-form/2026-11-04-cutout-method-vs-ours.md; hypothesis H8 added. Key: not cheaper as published (~25x credits/second), but may fix our first-second swipe problem; best for single-location 15-25 s premises. Waiting on Joe's OK for a 1-video pilot (install Remotion, quote credits at medium/2k first). No credits spent. Balance 872.6.

## 2026-11-05: cut-out pilot started
Remotion installed (remotion/, v4.0.540; install needed --maxsockets=2 after ECONNRESETs). Joe picked the idea 'Why don't we throw our trash at the Sun?'. Script v1 + claim table in videos/short-form/2026-11-05-trash-at-the-sun/script.md. Waiting on Joe's OK on the script; then pose pack (gpt_image_2 on magenta, local cutout.py) + Remotion build. No credits spent.

## 2026-11-05 (later): pilot topic switched to volcano (Joe's call)
Joe chose 'trash in a volcano' over the Sun to see the animation test (it is the reference video's question; ours has a different answer and gags). Script v1 + verified claims: videos/short-form/2026-11-05-trash-in-volcano/script.md. Sun script kept as backup. Waiting on Joe's OK, then pose pack + Remotion. No credits.

## 2026-11-05: cut-out pilot PRODUCED (volcano)
videos/short-form/2026-11-05-trash-in-volcano/output/2026-11-05-trash-in-volcano.mp4 (31 s, 1080x1920, 30 fps, 930 frames, audio OK, peak -3.6 dB). ~6 credits. Script v2 (Joe: make it more interesting) + upload.md + cost.md written; video-log row added (rendered). Waiting on Joe's feedback on the look/animation; if he likes it: upload, compare swipe-away vs slideshow Shorts (H8), then a batch of 3. Not uploaded.

## 2026-11-05 (later): volcano pilot v3
Joe's round-2 feedback: volcano floated, lava/smoke looked bad, character not on the ground/bottom empty, factory badly placed. Fixes: ground drawn in front of set pieces, everything lower/bigger, new sprites (smoke x2, lava splash, fire, bin) ~4 credits total extra, 60 fps, slide transitions, recycle ending. v3 rendering to output/2026-11-05-trash-in-volcano.mp4 (v1, v2 kept). Pilot total ~11 credits. Waiting on Joe's verdict before upload.

## 2026-11-05: volcano pilot UPLOADED (private)
https://youtu.be/NoqnhJFxRoY (v4, 34.7 s, 60 fps; thumbnail = loop frame; Studio: https://studio.youtube.com/video/NoqnhJFxRoY/edit). Joe approved ('i like the video now') and asked for a schedule slot; Joe sets visibility/schedule in Studio. Next: performance-review at 48 h (swiped-away vs slideshow Shorts, H8), then batch of 3 cut-out Shorts if it works. Joe also asked for a project cleanup (old versions/scripts): inventory first, delete only after his OK.

## 2026-11-05: project cleanup (Joe's OK on 3 groups)
Deleted: old Shorts versions (volcano v1-v3; farming v1-v4, ancient-free-time v1-v3, fur-to-fashion v1: duplicates verified byte-identical to the final before removal), long-form mcdonalds-landlord/_prev drafts, 7 .claude/_backup-* folders, assets/voice-samples, __pycache__. KEPT (Joe did not pick): Shorts scene images + voice clips (~480 MB, could shrink to JPEG later), .venv, remotion/node_modules, all finals, scripts, upload packs, logs.

## 2026-11-06: stats check (Studio, 28 d to Nov 4)
(Correction: "post one per day, not two" was an unsupported guess; Nov 3 WW2+Navy went live together and both won. Keep cadence; test topic familiarity instead.)
Channel: 4.7K views, 2.3K engaged, +6 subs (5 total), 93.4% Shorts feed, 4.8% search, 48.9% stayed / 51.1% swiped (up from 42.2% on 11-03). Views per Short: Nintendo 1.2K, WW2-all-day 1.2K, Navy ladder 919, Netflix 621, Kodak 575; the other 15 Shorts all < 40 (knight 39, Egypt 18, farming/sultan 11, business 7, pirates 9, free-time 4, taklamakan 4, roman 3, fur 9, two-people 5, gold-rush 6). Bimodal: either the feed tests it and scales, or it dies at the seed batch. Same format twice split (Navy 919 vs Egypt 18 vs Business 7; WW2 1.2K vs knight 39 vs pirates 9) so format is not the cause; topic familiarity/search demand is the leading suspect. Egypt/Business/two-people/gold-rush are only 1-2 d old. Not pulled: per-video impressions, viewed-vs-swiped. Long-form McDonald's Nov 5: 1 view (3 h old). Next: pull per-video viewed-vs-swiped for the 5 winners vs 5 flops; wait for batch 1 + volcano to go live before judging.

## 2026-11-07: Emu War funnel Short produced (not uploaded)
Joe asked for a Short to funnel traffic to the Emu War long-form (videos/long-form/emu-war). Brief: "went to war with emus, and lost, then the farmers killed the emus for the bounty". Script (v1, Joe OK'd): 8 phrases, 48.6 s; "lost" framed as "by the headlines" (disputed fact). Made with the Remotion cut-out method in 9:16 (new composition EmuShort in remotion/src), reusing the long-form's 10 illustrated scenes + sprites; synthesized machine-gun SFX; music Santa Clarita; cost ~2.6 credits. Files: videos/short-form/2026-11-07-emu-war-short/ (output/emu-war-short.mp4, thumbnail/thumbnail.png, upload.md). NEXT: Joe reviews; post the Short 1-2 days AFTER the long-form goes live and link the long-form as the related video; performance-review both at 48 h (does the Short move long-form views?). Hypothesis to log: funnel Shorts -> long-form.

(2026-11-07 later) Joe: Short looks good, cover needed improving. New cover = cov_v3 (white-flag gunner vs medal emu, 'ARMY LOST?'), alternates v1/v2; +1.5 credits (project ~38.1 of 40).

## 2026-11-07: Emu War long-form + Short UPLOADED (private)
Long-form https://youtu.be/GDpXMv-qSHA (Studio: https://studio.youtube.com/video/GDpXMv-qSHA/edit); Short https://youtu.be/gj-6VgeAQz4 (cover v1 set; Studio: https://studio.youtube.com/video/gj-6VgeAQz4/edit). Joe re-ran 'auth' (token had expired). Studio shows no thumbnail A/B test for the Short, so test v1 vs v2 by manual swap after ~24 h. Joe schedules in Studio (suggested: long Sun 8 Nov 12:00 ET = 19:00 Lebanon; Short 15:00 ET = 22:00 Lebanon). Set the long video as the Short's Related video.

## Update 2026-11-08 (long-form medieval-privacy + funnel Short)
Long-form "How Did Medieval Couples Get Any Privacy?" rendered (v2, 4:27, 1080p60, ~35.6 credits), title 1 + thumbnail C1 chosen by Joe, not uploaded. Funnel Short rendered (49.7 s, 0 credits) in videos/short-form/medieval-privacy-short/, not uploaded; post 1-2 days after the long-form is live and link it. Next: Joe reviews both, uploads private on his word.

## 2026-11-08: image style v4 chosen
Joe picked style A (bright expressive cartoon) for ALL videos (Shorts + long-form) and the glamorous/cheeky female-character recipe (Egyptian queen sample). Saved in learnings.md section A, script-writer style block, video-producer, lf-packaging, long-form playbook. v1/v2/v3 retired. Image model stays gpt_image_2 low (0.5 cr, cheapest that holds the character). Next: first video produced in v4 (test on a non-gold-rush topic); compare v4 vs v1 first-second metrics.

## 2026-11-08: volcano stats + 5 cut-out ideas proposed
Volcano Short (cut-out pilot, H8) = our best swipe rate so far: 34.5% swiped vs 51% channel, ~1.0K views/48 h, avg view 0:21/0:35, 622 engaged views from 202 unique viewers (replays), 95.5% Shorts feed, 0 subs. H8 marked supported (1 video). Proposed next batch of 5 single-gag ~30 s cut-out Shorts (Sun trash [script exists], Mariana Trench trash, nuke a hurricane, drink seawater, dig through the Earth); waiting on Joe's pick of 3. All facts unverified until script stage; no credits spent.

## 2026-11-08 (later): cut-out batch of 4 SCRIPTED (Joe picked #1,3,4,5)
Scripts v1 (~52-60 words, ~27 s each), claims tables, beat sheets: videos/short-form/2026-11-05-trash-at-the-sun (existing), 2026-11-08-nuke-hurricane, -drink-seawater, -dig-through-earth. Facts SUPPORTED via secondary sources; primary-source checks (NOAA hurricane FAQ page, seawater salt vs blood, Earth diameter) are open before upload. Waiting on Joe's OK per script; no credits spent. Production: reuse the volcano pose pack, new sprites per video (~3-6 credits each).
- (2026-11-08, Joe's edits) #1 Sun now = a rocket FILLED with trash dumped in the Sun (script v2, ~42 s, rocket-count gag); #3 seawater expanded to ~60 s with GCC desalination plants (v2, ~134 words, facts via secondary sources: 40% of world desal, Kuwait ~90%, Ras Al-Khair ~1M m3/day). Estimated credits for the batch of 4: ~25+ (seawater ~10, 2 locations), so it needs Joe's OK (over 20). No credits spent.

## 2026-11-08 (batch 4/4): dig-through-earth PRODUCED (not uploaded)
videos/short-form/2026-11-08-dig-through-earth/ : 23.4 s, 1080x1920 60fps, ~3.8 credits. Whole Earth-cutaway image = hook + cover (zoom 2.2 -> 1.0, punch on "Earth", pin-line "12 KM", "12,742 KM" diameter bar) mixed with cut-out digging, thermometer "180 C", fill-in loop. Covers: "12 KM ONLY" (recommended) / "DIG TO CHINA?". Music Santa Clarita. Facts: Kola 12,262 m + ~180 C supported (stop year disputed, script avoids it), diameter = 2 x NASA 6,371 km radius.

## 2026-11-08 (end): cut-out batch of 4 PRODUCED (not uploaded)
Sun 39.4 s (5.2 cr), hurricane 27.9 s (5.3), seawater 59.3 s (7.3), dig 23.4 s (3.8) = ~21.6 credits. Each: output mp4 + thumbnail A/B + upload.md in videos/short-form/<slug>/ (Sun slug 2026-11-05-trash-at-the-sun). Facts softened on primary sources (see each script.md). Open for Joe: thumbnail pick per video, Bright Side/Sunshine Cantina/Santa Clarita are reuses, dig is short (23 s). Next: Joe reviews, uploads private on his word, stagger posting; performance-review at 48 h to confirm H8 (compare vs volcano: 34.5% swiped, ~1K views).

## 2026-11-08 (night): cut-out batch of 4 UPLOADED (private, cover A on each)
Sun https://youtu.be/-TRg89bXeRA , hurricane https://youtu.be/-Vz0iC35BOE , seawater https://youtu.be/h_qQ8rZhvCI , dig https://youtu.be/tuJvAiAThWk (API, thumbnails set after processing; upload.md rewritten in the uploader's numbered format, old packs in upload-draft.md). Joe confirms thumbnails in Studio, schedules/publishes (stagger over a few days). Performance-review 48 h after each goes live (H8: compare vs volcano 34.5% swiped).

## 2026-11-09: Der Framer teardown (Joe)
Analysed @der_framer (52K subs, 45 Shorts, floor 16K, median ~150K, 2 at ~1M): research/short-form/2026-11-09-der-framer.md. Mechanism = universal second-person cringe moment + labelled characters + word captions + escalation + out-of-world peak + abrupt loop end. Their peaks use copyrighted cartoon clips: we must make our own. H9 added to learnings. Waiting on Joe to pick a batch of 3 relatable-moment Shorts (one format change per batch). No credits spent.

## 2026-11-09: H9 batch SCRIPTED (Joe picked ideas 1, 2, 4)
videos/short-form/2026-11-09-crush-catches-staring | -boss-can-we-talk | -wave-back-wrong-person: script.md v1 each (~75-80 words, ~40 s, hook-build-peak-twist-abrupt end, original peak art, labels YOU/CRUSH etc). Waiting on Joe OK per script; est. ~15-18 credits for the 3 (cut-out + 2 whole images each). Not in video-log yet (status scripted only).

## 2026-11-09: what-if niche batch PRODUCED (not uploaded)
Joe picked 3 of 10 what-if ideas: videos/short-form/2026-11-09-swallow-gum (42.0 s), -never-cut-nails (41.0 s), -stop-blinking (41.3 s). ~13 credits total, parent QC clean (blink overlay fixed). Music reused: Los Encinos, Drunken Sailor, Resolution Or Reflection. Waiting on Joe: review, thumbnail pick (A/B), OK to upload private. Seawater long-form uploaded private 2026-11-09: https://youtu.be/joaca0kJEZg.

## 2026-11-09: H9 batch PRODUCED (not uploaded)
Crush 36.95 s (4.7 cr), boss 28.75 s (5.4 cr, shorter than target), wave 33.2 s (4.8 cr): ~14.9 credits. Each: output mp4 + thumbnail + upload.md + cost.md in videos/short-form/<slug>/. Open: crush final shot (she waves, not points), boss characters small/captions 100 px/boss has no scarf (correct), wave sprite magenta edge. Boss silent.mp4 intermediate left in output/. Next: Joe watches, approves fixes, uploads private on his word, stagger; performance-review 48 h after live comparing swipe 
## 2026-11-09: H9 batch PRODUCED (not uploaded)
Crush 36.95 s (4.7 cr), boss 28.75 s (5.4 cr, shorter than target), wave 33.2 s (4.8 cr): ~14.9 credits. Each has output mp4 + thumbnail + upload.md + cost.md in videos/short-form/<slug>/. Open: crush final shot (she waves, not points at the extinguisher), boss characters small and captions 100 px, wave sprite faint magenta edge. Boss output/silent.mp4 is a leftover intermediate. Next: Joe watches and approves fixes, uploads private on his word (stagger); performance-review 48 h after live comparing swipe rate vs volcano (34.5 percent swiped) for H9.

## 2026-11-09 (later): what-if batch UPLOADED (private, cover A)
gum https://youtu.be/6ySSBvKzGHA , nails https://youtu.be/8UNeBUskdOU , blinking https://youtu.be/slpJd90-XQo . Joe: check thumbnails in Studio, publish/schedule. performance-review ~48 h after each goes live.

## 2026-11-09 (later): H9 batch UPLOADED (private)
Crush https://youtu.be/r6U7i-C1aZA , Boss https://youtu.be/6JGnv01Lh9E , Wave https://youtu.be/aDF24oJnB80 (API, thumbnails set after processing; Joe liked all three, uploaded as-is without the small fixes). Joe confirms thumbnails in Studio and schedules/publishes (stagger). Performance-review 48 h after each goes live: swipe rate vs volcano (34.5 percent) for H9.

## 2026-11-12: performance review (Joe: "why so few views?")
Studio Advanced mode (28 d to 11-11): 6,269 views, 50.7% stayed, 59.9% avg viewed, +6 subs. Daily views fell from 695 (Nov 7) to 13 (Nov 11); stayed fell from 47-70% to 33-43% after Nov 8. Median Short ~12 views; 6/26 got 580-1,285. Diagnosis in research/short-form/2026-11-12-why-so-few-views.md: (1) the feed stops testing a Short after a weak seed, most flops were shown to almost no one; (2) even our hits are only average (best 65.6% stayed), so they stall at ~1K; (3) a hit format does not carry the next one (3 formats); (4) slow openings 21-40% stayed; (5) format changes every batch + 2-3 posts/day (H16). Video log filled with views/stayed/avg viewed.
Next: Joe checks the Starbucks Short (0 views in 6 d) for restrictions; re-pull Nov 9-12 Shorts on Nov 15; next batch = one format, 1/day, first line written to target ≥ 65% stayed.
