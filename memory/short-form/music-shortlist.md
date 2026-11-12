# Music shortlist (YouTube Audio Library, picked 2026-10-31 by theme; Joe: "not any random song, match the theme")
Source: YouTube Studio > Audio library (read-only browse). Matched by title, genre and mood (not auditioned by Claude: Joe, please give each a quick listen). Rule: one theme-matched track per video, never the same track twice in a row; set `"music": "<file name>"` in scenes.json, otherwise `scripts/short-form/assemble.py` picks the least-used track (log: assets/music/used.json).

| Theme | Track | Artist | Genre / mood | Length |
|---|---|---|---|---|
| Pirates / sea | Drunken Sailor | Cooper Cannell | Country & Folk / Bright | 1:52 |
| Pirates, attack beat (alt) | Overboard | The Grey Room / Golden Palms | Alt & Punk / Dramatic | 3:04 |
| Space / big what-if (Sun, Moon) | Paulseante | Schwartzy | Ambient / Dramatic | 2:58 |
| Tech / internet what-if | Blue Screen Of Death | The Soundlings | Cinematic / Dramatic | 2:02 |
| Calm deadpan "documentary" what-if | True Crime Documentary and Chill | Rod Kim | Dance & Electronic / Calm | 2:05 |
| Medieval knight / battle history | The Battle of 1066 | Patrick Patrikios | Cinematic / Dark | 2:03 |
| Gladiator / Rome | How To Train Your Dragnet | Ezra Lipp | Cinematic / Dramatic | 2:23 |
| Quirky everyday objects (pencil, inventions) | Silly Snickerdoodle | Joel Cummins | Children's / Happy | 2:03 |
| Sneaky / mystery comedy | Sneaky Spelunking | Joel Cummins | Children's / Bright | 2:02 |
| Generic cartoon comedy | Demented 90s Cartoon Theme | Rod Kim | Pop / Bright | 1:31 |
Currently in assets/music: Country Music - Hugh Mitchel.mp3 (used for every video so far).

## Picked 2026-10-31 for the day-in-the-life batch (found by searching the library for "medieval", "march", "war")
- Knight: **Medieval Astrology** (Underbelly & Ty Mayer, Cinematic / Dramatic, 2:18). Alt: The Battle of 1066.
- WW2 soldier: **Trudging Along** (Godmode, Ambient / Calm, 2:07). Alt: March of the Hares (Alt & Punk / Dramatic, Nathan Moore, 2:24) for the attack beat.
- Pirates used: Drunken Sailor (Cooper Cannell).

## Picked 2026-10-31 for the attraction batch (Joe: new tracks from the YouTube Audio Library)
- What If Everyone Could See Your Crush: **Bright Side** (David Simon-Baker, Victoria George, Country & Folk / Bright, 4:02) DOWNLOADED to assets/music/ (set "music" in scenes.json; trim/fade handled by assemble.py).
- Every Level of Being Attractive: **Keep It Movin'** (Jahdean, Hip-Hop & Rap / Inspirational, 2:09). Download clicked but did not arrive.
- Validation trap: **Mirror Mirror** (Anno Domini Beats, Hip-Hop & Rap / Dramatic, 2:28); calmer alt: Resolution Or Reflection (The Grey Room, R&B & Soul / Calm, 2:58). Download clicked but did not arrive.
Note: Studio downloads start after ~1 min and a 4-min track is ~10 MB; the 2nd and 3rd clicks produced no file. Retry or Joe downloads them by hand into assets/music/.

## 2026-11-01: Two-people-restart: **Resolution Or Reflection** (The Grey Room, Clark Sims, R&B & Soul / Calm, 2:58) DOWNLOADED to assets/music/. The Studio download lands in ~/Downloads/Mr Yellow Scarf/ (not ~/Downloads) after ~1 min; copy it from there.

## 2026-11-01: modern-person-in-the-past batch
Chrome was disconnected, so no new Audio Library downloads. Two tracks from the earlier attraction batch had actually arrived in ~/Downloads/Mr Yellow Scarf/ and were copied to assets/music/: **Mirror Mirror** (Anno Domini Beats) used for the 1929 crash Short, **Keep It Movin'** (Jahdean) for the Gold Rush Short. Coffeehouse Short uses Resolution Or Reflection (reused) until Joe downloads a warm oud/acoustic track (search the library for "oud", "arabic", "cafe"); then set `music` in scenes.json and re-run assemble.py. Themed picks still wanted: noir piano/jazz (crash), banjo/western (gold rush).

## 2026-11-05: Joe asked to stop reusing the same track
Volcano Short uses Keep It Movin' (Jahdean) from assets/music (upbeat; not auditioned by Claude). Wanted cartoon-style picks to download if Joe OKs: Demented 90s Cartoon Theme (Rod Kim), Silly Snickerdoodle (Joel Cummins), Sneaky Spelunking (Joel Cummins).
