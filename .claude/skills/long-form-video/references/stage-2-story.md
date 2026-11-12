# Stage 2: Story development
Agents: `lf-fact-checker` and `lf-story-architect`. Files in `videos/long-form/<slug>/`.
1. `lf-fact-checker` -> `research.md` (claim table with status). Needs the premise only; start first.
2. `lf-story-architect` -> `outline.md`, built within what the claim table allows (re-run after research if the story changes). Hook options (2-3), ending options (2), beat purposes, ~5 min runtime, [verified]/[disputed]/[dramatization] marks.
3. Resolve: any beat that rests on a disputed/unsupported claim -> rewrite honestly or cut. If research kills the story, say so and propose the next idea; do not force it.
4. Present to Joe: premise, strongest hook and payoff, the beat list, honest-uncertainty spots. STOP. Update state.json (gate `2_story`).
