#!/usr/bin/env python3
"""POV: stuck on a yacht with your crush (Joe's script VERBATIM, grouped into voice clips). Writes audio/performance.json + audio/prompts.json.
Run: .venv/bin/python scripts/long-form/yacht_data.py"""
import json, os
P = "/Users/yellow/Projects/MrYellowScarf/videos/long-form/pov-yacht-crush/"
ROWS = [
("curious","You wake up on a beautiful yacht."),
("warm","Crystal-clear water surrounds you. There's food, drinks, a swimming pool, and enough luxury to make a billionaire jealous."),
("curious","Then you hear someone behind you."),
("warm","It's your crush."),
("curious","And when you ask where everyone else is... You discover you're completely alone."),
("dry","At first, things are incredibly awkward."),
("wry","You don't know whether to talk, swim, or pretend you're busy checking the yacht."),
("warm","She walks around in her swimsuit, enjoying the sun, while you try your best to act completely normal."),
("warm","You make breakfast together, explore the yacht, and accidentally discover there's a jacuzzi."),
("wry","Suddenly, this isn't such a bad situation."),
("warm","You spend hours swimming in the ocean."),
("warm","You race each other across the deck, jump into the water, and enjoy expensive food."),
("curious","You even discover a bedroom with a massive panoramic ocean view."),
("warm","Everything feels like a dream."),
("low","But there's one problem. Neither of you knows how to get back to shore."),
("curious","You check the navigation system. The yacht is far from land."),
("dry","You try the radio, but nobody answers."),
("low","The weather starts getting worse, so you decide to stay inside."),
("curious","Now you're sharing the same space, with nowhere to go and absolutely no distractions."),
("warm","You sit together on the sofa, watching movies."),
("warm","You start talking about childhood memories, relationships, embarrassing moments, and your biggest secrets."),
("warm","She starts laughing at your terrible jokes."),
("warm","At some point, she rests her head on your shoulder."),
("curious","And you realize something. This is the most comfortable you've ever felt around her."),
("curious","Later that night, you both go outside."),
("warm","The ocean is calm again. The sky is full of stars."),
("curious","She looks at you and asks: \"Can I ask you something?\""),
("low","You say yes. She smiles."),
("warm","\"Did you always like me?\""),
("wry","Your brain completely stops working."),
("curious","You finally admit it. But before you can say anything else, she tells you something unexpected."),
("warm","\"Good. Because I was hoping you'd say that.\""),
("curious","The next morning, the weather is perfect."),
("dry","You finally figure out how to contact someone and arrange a way back."),
("wry","But neither of you seems particularly excited about leaving."),
("warm","As the sun rises, she looks at you and says: \"Maybe we should get lost together again sometime.\""),
("wry","And honestly... You wouldn't mind getting stuck there for another week."),
]
if __name__ == "__main__":
    os.makedirs(P + "audio/clips", exist_ok=True)
    perf = [{"text": t, "tag": g, "pause": 0.45, "clip": f"{i:02d}.mp3", "row": i} for i, (g, t) in enumerate(ROWS, 1)]
    json.dump(perf, open(P + "audio/performance.json", "w"), indent=1)
    json.dump({str(i): f"[{g}] {t}" for i, (g, t) in enumerate(ROWS, 1)}, open(P + "audio/prompts.json", "w"), indent=1)
    print(len(ROWS), "rows", sum(len(t.split()) for _, t in ROWS), "words")
