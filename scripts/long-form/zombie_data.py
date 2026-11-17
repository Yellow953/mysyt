#!/usr/bin/env python3
"""Zombie supermarket POV (Joe's script VERBATIM, grouped into voice clips). Writes audio/performance.json + prompts.json.
Run: .venv/bin/python scripts/long-form/zombie_data.py"""
import json, os
P = "/Users/yellow/Projects/MrYellowScarf/videos/long-form/pov-zombie-supermarket/"
ROWS = [
("warm","You're shopping at a supermarket with your crush."),
("curious","Everything seems normal until people suddenly start screaming."),
("urgent","A man crashes into the entrance, covered in blood."),
("low","Then you see it. He's not injured."),
("low","He's eating someone."),
("urgent","Within seconds, people start running in every direction."),
("urgent","You grab your crush's hand and run."),
("low","The supermarket doors lock behind you."),
("wry","And suddenly, you're trapped inside with hundreds of zombies outside."),
("urgent","You rush toward the storage area."),
("dry","You grab bottled water, canned food, batteries, and anything that could help you survive."),
("curious","Your crush is terrified. You try to reassure her, even though you're just as scared."),
("dry","You push shopping carts against the doors and block the windows with shelves."),
("warm","For now, you're safe."),
("low","But the supermarket lights suddenly go out."),
("curious","A few hours pass. You realize the supermarket is actually the perfect survival base."),
("warm","There's enough food for weeks, a pharmacy, clothes, and even a small storage room where you can sleep."),
("dry","You build barricades, collect supplies, and create a sleeping area."),
("warm","Your crush starts feeling more comfortable around you. You even manage to make her laugh during the apocalypse."),
("wry","For a moment, it almost feels like you're on a strange camping trip."),
("low","Then you hear glass breaking. One zombie has found its way inside."),
("urgent","You grab a metal baseball bat from the sporting goods section."),
("low","Your crush hides behind a shelf. You slowly move through the aisles."),
("urgent","Then another zombie appears. And another."),
("urgent","Suddenly, they're everywhere."),
("urgent","You run toward the storage room, but your crush trips."),
("urgent","You turn around, grab her hand, and pull her to safety just before the zombies reach you."),
("urgent","You slam the door shut."),
("low","But there's a problem. Your barricade won't hold forever."),
("curious","Three days have passed. Food isn't the problem. Water and electricity are."),
("dry","The supermarket's emergency generator is running low on fuel."),
("curious","You discover a maintenance room with a map showing an emergency exit behind the loading area."),
("low","But reaching it means crossing the entire supermarket."),
("dry","You prepare backpacks with food, water, medicine, and flashlights."),
("warm","Your crush looks at you and says: Promise me we're getting out of here together."),
("warm","You promise. Even though you have no idea if you can keep it."),
("low","You finally make your move. You sneak through the aisles."),
("low","Every sound makes you freeze."),
("low","You reach the loading area. But the emergency exit is blocked."),
("urgent","Then you hear growling behind you. A massive group of zombies is approaching."),
("urgent","You push a shopping cart into their path and create enough time to escape through a side door."),
("urgent","You and your crush sprint into the parking lot."),
("dry","You find an abandoned delivery van. You climb inside, start the engine, and drive away."),
("low","For the first time in days, you're outside. But the city is completely destroyed."),
("warm","You drive toward the countryside. Your crush looks at you and starts laughing."),
("curious","You ask what's so funny. She says: Of all the people I could've been trapped with during the zombie apocalypse... I'm actually glad it was you."),
("warm","You smile. Then you look at the road ahead."),
("low","A hundred zombies are standing in the middle of it."),
("low","You slowly stop the van. And realize..."),
("wry","This was only the beginning."),
("curious","TO BE CONTINUED?"),
]
if __name__ == "__main__":
    os.makedirs(P + "audio/clips", exist_ok=True)
    perf = [{"text": t, "tag": g, "pause": 0.4, "clip": f"{i:02d}.mp3", "row": i} for i, (g, t) in enumerate(ROWS, 1)]
    json.dump(perf, open(P + "audio/performance.json", "w"), indent=1)
    json.dump({str(i): f"[{g}] {t}" for i, (g, t) in enumerate(ROWS, 1)}, open(P + "audio/prompts.json", "w"), indent=1)
    print(len(ROWS), "rows", sum(len(t.split()) for _, t in ROWS), "words")
