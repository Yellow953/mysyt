# Stage 1: Research and discovery
Agent: `lf-scout` (Chrome read-only). Output: `competitor-intelligence.md` rows, 10 idea cards, top 3.
1. Check research-log.md for freshness and what was already covered (avoid repeats).
2. Call `lf-scout` with: channels to cover (your 9 + discovered ones), max ~6 deep analyses, instruction to return top 3. For a narrow request ("breakout videos only") skip idea generation.
3. Sanity-check what comes back: evidence levels honest? mechanism extracted rather than topic copied? ideas global and non-generic? Reject generic ones yourself.
4. Optionally call `lf-critic` on the top 3 ideas (cheap, catches weak ones).
5. Present to Joe: top 3 with premise, mechanism, click/story/retention/visual scores, risks, plus a one-line list of the other 7. Say what could not be accessed.
6. Update state.json: ideas[] with status `recommended`/`candidate`, gate `1_discovery` = awaiting Joe. STOP.
On Joe's pick: record `approved` (date, which) and rejections with his reasons; create `videos/long-form/<slug>/` and a project entry {slug, idea, stage:"2_story", gate_status:"in_progress"}.
