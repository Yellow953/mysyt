#!/usr/bin/env python3
"""Lottery winner levels (script VERBATIM, grouped into voice clips). Writes audio/performance.json + audio/prompts.json.
Run: .venv/bin/python scripts/long-form/lot_data.py"""
import json, os
P = "/Users/yellow/Projects/MrYellowScarf/videos/long-form/lottery-winner-levels/"
ROWS = [
("curious","You are holding a piece of paper."),
("dry","Say it's worth four hundred million dollars."),
("low","You checked the numbers three times. You checked them again in the bathroom, with the door locked."),
("dry","The odds of this, by most accounts, are about one in three hundred million."),
("wry","So congratulations. You have just beaten the universe."),
("low","Now comes the hard part. Because the paper is the easy part."),
("dry","The first rule of your new life is simple. Do not lose the ticket."),
("dry","You put it in a book. Then you worry about the book. So you move it to the freezer. Then you remember freezers have fires."),
("dry","You sign the back, in your best handwriting, with a pen that you test twice."),
("wry","You have not told anyone. Your face has told everyone."),
("wry","Your dog looks at you strangely. Even he knows something is different."),
("dry","And you still have to go to work tomorrow, because you can't quit a job with a piece of paper."),
("dry","Next, the lottery office."),
("dry","They tell you the headline number isn't what you get. If you take the lump sum, it's roughly half of the advertised jackpot. Then taxes take a big bite out of that."),
("warm","Say you walk out with a bit over a hundred million."),
("curious","You stand on the sidewalk, unsure whether to cry or do the math again."),
("low","Then you remember that in some places, winners can't stay anonymous. Your name will be public."),
("wry","Which is the moment the phone starts to ring."),
("dry","It's your cousin. The one you haven't spoken to in nine years."),
("wry","He has a business idea. A food truck. Shaped like a boat."),
("dry","Then it's a friend from school. Then someone who says they went to school with you, and you've never seen them in your life."),
("wry","By the end of the week, you have a hundred and forty voicemails, and eleven of them are crying."),
("dry","You say yes to the first one, because you feel guilty."),
("dry","You say no to the next ten, because you feel guilty."),
("low","You are rich, and somehow, you have never felt so poor in friends."),
("warm","Okay. Time to have a little fun."),
("warm","You buy a house. A bigger house. A house with a room that's just for coats."),
("wry","You buy a car that has a name. You buy a watch that costs more than your old car."),
("warm","Then you buy everyone dinner. Everyone. At a restaurant that has no prices on the menu."),
("warm","It is the best month of your life."),
("low","But quietly, somewhere in your head, a small voice asks one question. What does this cost per year to keep?"),
("wry","You tell the voice to be quiet. It is not quiet."),
("curious","Here is something researchers found. A study of lottery winners in Florida looked at who went bankrupt, and when."),
("dry","Mid-sized winners were actually less likely to go bankrupt right after winning. But three to five years later, they were about fifty percent more likely than the smallest winners to file."),
("dry","And within five years, even the big winners were just as likely to file as people who won almost nothing."),
("low","The money didn't prevent the problem. It postponed it."),
("low","You are on year three. You own four houses. You are paying for two of them in ways you don't fully understand."),
("low","Someone you trusted has been taking a very generous fee."),
("wry","And your cousin's boat-shaped food truck has sunk. Twice."),
("curious","So you do something unusual."),
("warm","You sit down at the kitchen table, with a real financial planner, and you ask the only question that matters."),
("curious","What would happen if I did nothing?"),
("warm","The planner nods slowly. The way people nod when they've been waiting years for someone to ask."),
("dry","You sell two of the houses. You say sorry to a few people. You stop saying yes to everyone."),
("dry","You put the rest into boring things. The kind of boring that doesn't come with a food truck."),
("warm","It feels like losing. It feels like losing, and it's the best decision you've made since you signed the back of the ticket."),
("warm","Ten years later, you wake up on an ordinary Tuesday."),
("dry","You live in one house. You drive one car, an old one that you refuse to replace."),
("warm","Your life is almost completely normal. The only thing that changed is that you stopped worrying about Tuesday."),
("warm","On the wall in your kitchen, there's a frame. And inside it, a piece of paper. The ticket."),
("low","It is worth nothing now. It was never the point."),
("warm","The point was the thing it let you stop doing, which is wondering how you'll pay for everything."),
("curious","The study didn't ask who was happiest. But the ones who didn't crash seem to have done one thing right. They kept their Tuesday."),
("wry","Would you take the money, or keep your Tuesday? Tell us in the comments. And subscribe, because we've got more lives to try on."),
]
if __name__ == "__main__":
    os.makedirs(P + "audio/clips", exist_ok=True)
    perf = [{"text": t, "tag": g, "pause": 0.45, "clip": f"{i:02d}.mp3", "row": i} for i, (g, t) in enumerate(ROWS, 1)]
    json.dump(perf, open(P + "audio/performance.json", "w"), indent=1)
    json.dump({str(i): f"[{g}] {t}" for i, (g, t) in enumerate(ROWS, 1)}, open(P + "audio/prompts.json", "w"), indent=1)
    print(len(ROWS), "rows", sum(len(t.split()) for _, t in ROWS), "words")
