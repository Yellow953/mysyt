# Cost: ikea-ice-storm-30-days (2026-11-18)
- Cap 33 cr (target <= 28). Balance at start 427.92; the account is shared by 3 parallel builds, so the balance delta is not reliable. Per-item estimate below.
- Voice (Grady, text2speech_v2, billed per character ~0.0032 cr): 54 clips, 6,941 chars incl. tags ~ 22.2 cr. Rate-limit failures (429) were resubmitted (not charged). Rows 35-38 batch timed out twice at submit (outcome unknown); at most ~1.1 cr could have been double-billed.
- Art (gpt_image_2_6, 0.25 cr each, 16:9): 3 sprite sheets + 7 backgrounds + 24 illustrations + 2 redos (i17, i40) = 36 images ~ 9.0 cr.
- Music: no credits (Higgsfield music models not available in the catalog); library tracks reused (Medieval Astrology default, Resolution Or Reflection, Keep It Movin' as auditions).
- Thumbnail: Joe, Google Flow (free).
- TOTAL ~ 31.2 cr (at most ~32.3 with a possible double-billed batch); under the 33 hard cap, over the 28 target.
