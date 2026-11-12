# QC: mcdonalds-landlord images (35 scenes, gpt_image_2, 16:9, 1k, low)

Checked on a 640 px contact sheet (sheet_1-4 in the scratchpad). All 35 files open with PIL. No regeneration was done (cap reached, see report).
Main problem pattern: the model added a yellow scarf to stick-figure extras in scenes that have no main character. Scarf must be only on Mr. Yellow Scarf.

- 01 OK
- 02 OK
- 03 problem: a second stick figure (right half, Harry side) wears a yellow scarf; scene has no main character
- 04 problem: man walking out of the door with the box wears a yellow scarf (not the main character)
- 05 problem: walking stick figure with briefcase wears a yellow scarf (should be plain Ray Kroc)
- 06 problem: left figure in the handshake wears a yellow scarf
- 07 OK (main character has the scarf; others plain)
- 08 problem: right-hand stick figure at the counter wears a yellow scarf
- 09 OK
- 10 problem: figure in the spotlight wears a yellow scarf (should be plain Harry)
- 11 problem: standing figure in the suit wears a yellow scarf (should be plain Harry)
- 12 problem: left figure (plaid jacket) wears a yellow scarf
- 13 problem: small figure at the door wears a yellow scarf
- 14 OK
- 15 OK
- 16 problem: left figure handing coins wears a yellow scarf (should be plain landowner/company man)
- 17 OK
- 18 OK
- 19 OK
- 20 OK (scarf figure mopping is the main character, as prompted)
- 21 problem: figure inside the tollbooth/stand wears a yellow scarf (no main character requested)
- 22 problem: figure in front of the counter (Ray Kroc) wears a yellow scarf
- 23 OK
- 24 problem: an unrequested stick figure with a yellow scarf feeds a coin into the piggy bank
- 25 OK
- 26 problem: figure at the stand wears a yellow scarf (no main character requested)
- 27 problem: the actor in the poster frame wears a yellow scarf (should be plain)
- 28 OK
- 29 problem: Harry at the box wears a yellow scarf (should be plain)
- 30 problem (suspected, check at full size): right-hand tugging figure may show a yellow scarf at the neck
- 31 problem: walking figure on the road wears a yellow scarf (should be plain Harry)
- 32 problem: figure at the end of the road wears a yellow scarf (should be plain Harry)
- 33 OK
- 34 OK
- 35 OK

Summary: 16 OK (01, 02, 07, 09, 14, 15, 17, 18, 19, 20, 23, 25, 28, 33, 34, 35), 19 problem (03, 04, 05, 06, 08, 10, 11, 12, 13, 16, 21, 22, 24, 26, 27, 29, 30, 31, 32), 0 fixed.
