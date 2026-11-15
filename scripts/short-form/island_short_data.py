#!/usr/bin/env python3
"""Island funnel Short (Joe's script verbatim, grouped into voice clips). Writes audio/performance.json + prompts.json."""
import json
P = "/Users/yellow/Projects/MrYellowScarf/videos/short-form/island-funnel-short/"
ROWS = [
("curious","Imagine waking up on an island...",0.35),
("dry","Where every single person is a beautiful woman.",0.35),
("deadpan","And you're the ONLY man.",0.6),
("warm","No competition. No dating apps. No rejection.",0.45),
("wry","Suddenly, you're the most interesting man in an entire civilization. And they can't stop asking about you.",0.5),
("dry","You're given a luxurious room, invited to royal dinners, and treated like a celebrity.",0.4),
("wry","You start thinking... This might actually be paradise.",0.55),
("low","Until one night, you overhear two guards talking.",0.35),
("deadpan","Apparently... The last man who came to this island never left.",0.45),
("low","And now the queen wants to see you.",0.6),
("curious","You thought you had found paradise. But would you still think that after discovering their secret?",0.5),
("dry","Watch the full story on Mr. Yellow Scarf.",0),
]
perf = [{"text": t, "tag": g, "pause": p, "clip": "%02d.mp3" % (i + 1)} for i, (g, t, p) in enumerate(ROWS)]
json.dump(perf, open(P + "audio/performance.json", "w"), indent=1)
json.dump({str(i + 1): "[%s] %s" % (g, t) for i, (g, t, p) in enumerate(ROWS)}, open(P + "audio/prompts.json", "w"), indent=1)
open(P + "audio/narration.txt", "w").write(" ".join(t for _, t, _ in ROWS))
print(len(ROWS))
