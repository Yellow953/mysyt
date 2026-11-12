# Google Flow scene-image test (2026-11-12)
Driven by Claude in Chrome in Joe's Flow project "Nov 12 - 16:39". Model: Nano Banana 2.1 (Flow default). Agent mode, 2 images per prompt, image default 9:16.

## Setup facts
- Flow redirects to flow.google.com. Characters are PER PROJECT. Claude cannot use Upload (native macOS file picker); "Add from project" makes an "Untitled character" from an image already in the project (we used the LOST IN JUNGLE thumbnail).
- Attach the character in the prompt box: "+" → pick by NAME (the list re-sorts by recency; picking by position attached a wrong image once) → "Add to prompt".
- Downloads: 1K original = 768x1376 (same class as Higgsfield gpt_image_2 low, 752x1344); 2K upscale free; 4K needs a paid upgrade. Files land in ~/Downloads/Mr Yellow Scarf/ as JPG.
- Flow uses its own monthly AI credits (Agent settings say "spend credits"); Joe's plan allowance not checked.

## Results
1. 1929 trading-floor collapse (2 variants): strong composition, period detail, no text. Character drift: eyelids/pupils instead of dot eyes, white cartoon gloves (inherited from the reference thumbnail). Palette mostly red because the prompt asked for red/orange light.
2. Chart-flip office (2 variants), prompt adds: "eyes are two small SOLID BLACK DOTS (no eyelids, no pupils, no eye whites)... VERY THIN black stick-line arms and legs with tiny simple round hands (no gloves)". Result: on-brand (dot eyes, angled brows, thin stick limbs, two hands, scarf the only yellow), vivid v4 look, period props right, no text. Minor: he held the chart rather than flipping it upside down (action slightly off).
Verdict: quality ≥ our Higgsfield images; character holds when the dot-eye/stick-limb line is in the prompt. Saved: chart_flip_flow_1k.jpg.
