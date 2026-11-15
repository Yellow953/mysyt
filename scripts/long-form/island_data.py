#!/usr/bin/env python3
"""Island POV (Joe's script VERBATIM, grouped into voice clips). Writes audio/performance.json + audio/prompts.json.
Run: .venv/bin/python scripts/long-form/island_data.py"""
import json, os
P = "/Users/yellow/Projects/MrYellowScarf/videos/long-form/pov-island-only-women/"
ROWS = [
("low","POV: You wake up on a mysterious island. No phone. No money. No idea how you got here."),
("curious","But then you notice something. A beautiful woman is standing a few meters away. Then another. And another."),
("dry","You look around. They're everywhere. The island is filled with beautiful women."),
("deadpan","There are no men. Not one. You're literally the only man on the entire island."),
("wry","And suddenly, you realize... You might have just won the lottery. Or so you think."),
("low","Because you have absolutely no idea what kind of place you've just entered."),
("curious","Before you can even stand up, a group of women approaches you. They're tall, athletic, confident, and dressed like ancient warriors."),
("dry","One of them points a spear at you. Another starts speaking in a language you've never heard."),
("dry","You try explaining that you're lost. They look at each other. Then one of them suddenly shouts something."),
("curious","Within seconds, dozens of women surround you. You're escorted through the jungle toward an enormous hidden city."),
("low","And that's when you discover the truth. This isn't an ordinary island."),
("curious","It's home to the Amazons. An entire civilization of women who have lived here for generations."),
("wry","And apparently... They've never seen a man quite like you."),
("dry","You arrive at their capital. And to your surprise, you're treated like a royal guest."),
("warm","They give you a beautiful room overlooking the ocean. Fresh tropical fruit appears at your table."),
("dry","You receive new clothes, a comfortable bed, and everything you could possibly need."),
("curious","But there's something strange. Everywhere you go, people stare. Some women whisper to each other. Others approach just to ask questions."),
("wry","One warrior asks if all men look like you. You don't know whether to feel flattered or offended."),
("curious","Then, during dinner, the queen arrives. She sits across from you. Looks directly into your eyes."),
("low","And says something your translator eventually explains: \"You are the first man to enter our island in over a hundred years.\""),
("deadpan","A hundred years? You start wondering what happened to the last one."),
("dry","Over the next few days, life becomes... interesting. You become something of a celebrity."),
("warm","Women invite you to festivals. Some want to teach you archery. Others challenge you to races."),
("wry","A few even compete over who gets to show you around the city."),
("dry","For the first time in your life, you don't have to chase anyone's attention. It comes to you."),
("curious","But there's a problem. The Amazons are incredibly competitive."),
("dry","One morning, a warrior challenges you to a traditional strength competition. You confidently accept."),
("deadpan","Five seconds later... You're lying on the ground. The entire crowd bursts into laughter."),
("wry","Apparently, being the only man doesn't automatically make you the strongest person on the island."),
("dry","Still, you're enjoying yourself. Until you overhear something during a conversation between two guards."),
("low","They're discussing your arrival. And one of them says: \"The queen must decide what to do with him before the next full moon.\" What?"),
("curious","That night, curiosity gets the better of you. You sneak into the royal archives."),
("low","Inside, you discover ancient paintings showing another man arriving on the island. But the final painting is different. It shows the same man leaving... Alone."),
("curious","You hear footsteps. The queen is standing behind you."),
("dry","She tells you the island has a secret. For centuries, the Amazons have protected their civilization from outsiders."),
("curious","But they haven't always lived alone. Long ago, a man arrived here and became part of their society."),
("low","However, he eventually betrayed their trust and revealed the island's location to foreign invaders."),
("dry","The Amazons survived. But they made a decision. No outsider would ever be allowed to control their future again."),
("low","The queen looks at you. And says: \"You may stay here. But you must prove that you can be trusted.\""),
("wry","Suddenly, paradise feels a little more complicated."),
("dry","The next morning, you're brought before the entire city. The queen announces a challenge."),
("curious","You must participate in the island's traditional trials. Not because they expect you to defeat their warriors. But because they want to know who you really are."),
("dry","The first challenge is archery. You miss almost every target."),
("dry","The second is a race through the jungle. You finish last."),
("curious","The third is a test of intelligence. And surprisingly... You win."),
("warm","You help solve an ancient engineering problem that the Amazons have struggled with for years."),
("warm","For the first time, they aren't looking at you simply because you're a man. They're looking at you because you've actually contributed something."),
("warm","Even the queen smiles. And then she offers you something unexpected. A permanent place in their civilization."),
("dry","You now have everything. A beautiful island. An entire civilization of fascinating women."),
("wry","No bills. No office. No annoying boss. And a life most men could only dream about."),
("low","But there's one problem. You still have a life somewhere beyond this island. Your family. Your friends. Your old world."),
("curious","The queen approaches you one last time. \"Have you decided?\""),
("low","You look at the ocean. Then back at the city. And realize... For the first time in your life, you have absolutely no idea what you want."),
("curious","So tell me... Would YOU stay on the island... Or go back home?"),
]
if __name__ == "__main__":
    os.makedirs(P + "audio/clips", exist_ok=True)
    perf = [{"text": t, "tag": g, "pause": 0.45, "clip": f"{i:02d}.mp3", "row": i} for i, (g, t) in enumerate(ROWS, 1)]
    json.dump(perf, open(P + "audio/performance.json", "w"), indent=1)
    json.dump({str(i): f"[{g}] {t}" for i, (g, t) in enumerate(ROWS, 1)}, open(P + "audio/prompts.json", "w"), indent=1)
    print(len(ROWS), "rows", sum(len(t.split()) for _, t in ROWS), "words")
