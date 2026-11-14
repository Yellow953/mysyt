#!/usr/bin/env python3
"""Boss v3 (Joe's ChatGPT script, VERBATIM). Rows + image prompts. Run: .venv/bin/python scripts/long-form/boss2_data.py
writes script.md, audio/performance.json, audio/prompts.json, images/prompts.json in videos/long-form/pov-boss-laughed-idea/"""
import json, os
P = "/Users/yellow/Projects/MrYellowScarf/videos/long-form/pov-boss-laughed-idea/"
# (tag, text, image id) one voice clip per row; text is Joe's script word for word (only grouped)
ROWS = [
("low", "POV: You've just spent three weeks working on an idea that could change your entire company.", "a1"),
("dry", "You've stayed late. Skipped lunch. Even worked on weekends.", "a1"),
("curious", "And today, you're finally presenting it to your boss. You finish your presentation. Silence.", "a3"),
("deadpan", "Your boss looks at the screen. Then looks at you. And starts laughing.", "a4"),
("dry", "\"That's your idea?\" The entire room starts smiling.", "a3"),
("wry", "He leans back in his chair. \"Listen, I appreciate the enthusiasm. But maybe leave the big decisions to people who actually understand business.\"", "a4"),
("low", "Everyone laughs. You force a smile. But inside... Something just changed.", "a7"),
("low", "Because six months from now, this same man will be begging you to come back into his office. And this time... He won't be laughing.", "a8"),
("dry", "You've worked at this company for three years. Three years of doing everything right.", "b1"),
("dry", "You arrive early. Finish your tasks. Help your coworkers.", "b1"),
("dry", "Whenever something breaks, you're the person they call.", "b3"),
("curious", "But somehow, whenever there's a promotion, someone else gets it. Your boss barely knows your name.", "b4"),
("deadpan", "And when he does notice you, it's usually because something went wrong.", "b5"),
("curious", "That's why you came up with the idea. You noticed the company was wasting thousands of dollars every month on a problem nobody seemed interested in fixing.", "b6"),
("dry", "You found a solution. You calculated the costs. You even built a working prototype.", "b7"),
("low", "You weren't asking for a promotion. You just wanted someone to listen. But instead, you became the office joke. And the worst part? Your boss wasn't finished.", "b8"),
("dry", "The next morning, you arrive at work. Your idea is already being discussed. Not because anyone wants to use it. But because your boss turned your presentation into a joke.", "c1"),
("wry", "Your coworkers start calling it \"the million-dollar genius plan.\" You laugh along. What else can you do?", "c2"),
("curious", "Then, two weeks later, something interesting happens. You notice a competitor announcing a new system.", "c3"),
("low", "You open their website. And suddenly, your stomach drops. It's almost exactly the same solution you proposed.", "c4"),
("dry", "They've already launched it. And according to the announcement, it's saving them a fortune.", "c3"),
("low", "You sit there staring at the screen. Your idea wasn't stupid. Your company just refused to listen. But now, the situation is about to get much worse.", "c4"),
("dry", "Over the next few months, things begin changing. Your competitor becomes faster. Their costs drop. Customers start leaving.", "d1"),
("dry", "Your company tries to respond, but it's already behind.", "d1"),
("curious", "Suddenly, the same managers who laughed at your idea are sitting in emergency meetings. Your boss is furious. He demands solutions.", "d3"),
("dry", "The engineering team works overtime. Marketing launches new campaigns. But nothing seems to work.", "d3"),
("low", "And then, during one meeting, someone brings up an old presentation. Your presentation.", "d5"),
("deadpan", "One of the managers asks: \"Didn't someone suggest something similar months ago?\" Everyone goes quiet. Your boss looks uncomfortable. Because he remembers. And so does everyone else.", "d6"),
("dry", "It's Tuesday morning. You're working at your desk when your phone rings. Your boss.", "e1"),
("low", "\"Can you come to my office?\" Your stomach tightens.", "e1"),
("dry", "You walk down the hallway. Open the door.", "e3"),
("curious", "And there he is. Same expensive suit. Same desk. Same man who laughed at you in front of everyone. But something is different. He isn't smiling.", "e4"),
("dry", "He asks you to sit down. Then he says: \"I've been looking at your old proposal.\" You say nothing.", "e5"),
("curious", "He continues. \"Turns out... you were onto something.\" He pauses. \"We want to revisit your idea. We need you to lead the project.\"", "e4"),
("low", "For a moment, you don't know what to say. Three months ago, he called your idea ridiculous. Now he wants you to save the company with it. But this is where you have a decision to make.", "e7"),
("dry", "You could say yes. Take the promotion. Get the recognition you wanted. And spend the next year fixing a problem you tried to prevent.", "f1"),
("curious", "Or you could do something else. You look at your boss. And calmly say:", "f2"),
("dry", "\"I appreciate the offer. But I suggested this months ago. And you made it very clear what you thought of it.\" Silence.", "f3"),
("dry", "You explain that you're willing to discuss the project. But this time, you want proper authority, resources, and compensation.", "f4"),
("curious", "Your boss looks surprised. He expected you to accept immediately. But you're not the same employee who walked into that conference room six months ago.", "f5"),
("warm", "You've learned something. Being good at your job doesn't mean you should accept being treated badly.", "f6"),
("warm", "And sometimes, the biggest mistake isn't having a bad idea. It's staying somewhere that refuses to recognize a good one.", "f6"),
("curious", "So what happens next? Maybe your boss accepts your terms. Maybe you leave and find a company that actually values your work.", "g1"),
("warm", "But one thing is certain. You no longer need that man's approval to know what you're capable of.", "g2"),
("warm", "Because the person who laughed at your idea... Was never the person who decided whether it was valuable.", "g3"),
("curious", "What would you have done? Taken the promotion... Or walked away?", "g4"),
]
STYLE = ("Style: expressive modern cartoon illustration, glossy digital painting, vivid saturated colors, bright cheerful daylight with a bright blue sky and soft white clouds through the windows, "
 "detailed textured office, thin dark outlines, exaggerated big emotions, polished YouTube-explainer look, 16:9. BRIGHT, no dark, dim, night or faded colors. "
 "No text, signs, lettering, labels, digits, logos, and no readable words on screens, papers or posters anywhere (use plain icon shapes only). "
 "Mr. Yellow Scarf ('you') keeps his plain white round head, black dot eyes, thin black stick limbs and bright yellow scarf; the scarf is the only yellow in the picture. "
 "Side characters are simple tan-headed stick figures in plain clothes with no scarf. THE BOSS: tan head, slicked dark hair, red tie, navy suit, a big orange-brown watch (never yellow). "
 "Exactly two arms and two hands per figure, at most 3 characters, simple clean composition. Family-friendly.")
M = "<<<aa6661ee-d997-489c-9e1b-9b9adbed8c94>>>"
IMGS = {
"a1": f"{M} hunched over a desk piled with papers and coffee cups in a bright sunny office, tired but determined, laptop open, a wall clock and a calendar with a sunny window behind.",
"a3": f"{M} standing at a big wall screen showing simple colourful chart icons, presenting in a bright conference room; the boss sits at the head of a long table and three coworkers sit along the sides, everyone looking at him; awkward silence.",
"a4": "The boss (tan head, slicked dark hair, red tie, navy suit, big orange-brown watch) laughing hard, leaning far back in his chair with mouth wide open and tears of laughter, in a bright conference room; a small stick-figure mascot with a white round head and yellow scarf stands deflated at the edge.",
"a7": f"{M} close-up, chest-up, forcing a very wide fake smile with a sweat drop, while blurred laughing coworkers fill the bright background.",
"a8": f"{M} sitting calmly at a desk in a small bright office with arms folded and a calm smile; the boss (tan head, slicked dark hair, red tie, big orange-brown watch) stands at the open door with hands pressed together, begging, sweating, looking desperate.",
"b1": f"{M} at a tidy desk in a bright sunrise office with a coffee mug and a laptop, early morning, nobody else there yet, proud and organised.",
"b3": f"{M} standing calmly while a printer smokes and sparks, a ringing phone on the desk, and two panicked coworkers point at him asking for help; bright office.",
"b4": f"The boss (tan head, slicked dark hair, red tie, navy suit, big orange-brown watch) handing a big golden trophy to a smiling coworker while {M} claps small and unnoticed in the background; bright office.",
"b5": f"The boss (tan head, slicked dark hair, red tie, navy suit, orange-brown watch) pointing angrily at {M} with a frown while he looks down sadly; bright office.",
"b6": f"{M} holding a magnifying glass looking up at a broken pipe in the office ceiling that leaks gold coins and money bags onto the floor; bright office.",
"b7": f"{M} proudly standing next to a desk with a small shiny gadget prototype, a calculator and rolled blueprints (no text); bright office.",
"b8": f"{M} standing alone in the foreground looking hurt, while two coworkers whisper and giggle in the bright office background.",
"c1": f"A group of coworkers gathered around laughing while the boss (tan head, slicked dark hair, red tie, big orange-brown watch) tells a story with wide arms; {M} arrives at the doorway of the bright office and sees them.",
"c2": f"A coworker handing {M} a toy gold crown as a joke, {M} giving a forced smile with a sweat drop; bright office.",
"c3": f"{M} sitting at a laptop with a curious face; the laptop screen shows a rocket and confetti icon; bright office.",
"c4": f"{M} with a shocked face, hands on cheeks, in front of a laptop; the screen shows a gadget that looks identical to the prototype on his desk beside it; bright office.",
"d1": "Three stick-figure customers with shopping bags walking out of a worn-out old shop and across the street toward a shiny new rival shop with a big happy crowd, bright sunny street under a blue sky.",
"d3": "An emergency meeting in a bright office: the red-faced boss (tan head, slicked dark hair, red tie, big orange-brown watch) pounding the table, two managers sweating, a big red falling-arrow chart icon on the wall behind them.",
"d5": "A manager holding up an old presentation folder in a meeting while everyone at the table turns to look at it in surprise; the boss (tan head, slicked dark hair, red tie, big orange-brown watch) at the head of the table frozen; bright conference room.",
"d6": "A silent meeting in a bright conference room: the boss (tan head, slicked dark hair, red tie, navy suit, big orange-brown watch) sweating with an uncomfortable face while two managers glance awkwardly at each other.",
"e1": f"{M} at his desk with a ringing phone whose screen shows a little boss face icon; he looks worried; bright office.",
"e3": f"{M} walking down a long bright office hallway toward a big wooden door at the end, seen from behind.",
"e4": "The boss (tan head, slicked dark hair, red tie, expensive navy suit, big orange-brown watch) behind a big wooden desk in a bright corner office, serious and tired, not smiling.",
"e5": f"{M} sitting opposite the boss (tan head, slicked dark hair, red tie, big orange-brown watch) across a desk; the boss holds a thick folder; serious tense mood in a bright office.",
"e7": f"{M} close-up thinking with a hand on his chin; a thought bubble on one side with a golden trophy and on the other side an open door with sunlight.",
"f1": f"Split image. Left half: {M} shaking the boss's hand while holding a golden trophy. Right half: {M} looking exhausted, chained to a desk buried in towering papers. Bright colours.",
"f2": f"{M} sitting with arms folded, calm and confident, looking straight at the boss across a desk; bright office.",
"f3": "The boss (tan head, slicked dark hair, red tie, big orange-brown watch) stunned with mouth open and eyebrows raised, freezing, bright office.",
"f4": f"{M} standing with a briefcase confident; on the desk in front of him three icons: a key, a toolbox and a money bag; the boss (tan head, slicked dark hair, red tie) watching; bright office.",
"f5": f"The boss (tan head, slicked dark hair, red tie, big orange-brown watch) looking surprised and impressed at {M} who stands taller and confident; bright office.",
"f6": f"{M} standing tall in a warm sunbeam in a bright office, calm confident smile, hands on hips.",
"g1": f"{M} standing at a fork in the road: the left path leads to a grey office building, the right path leads to a sunny new office with a welcoming team waving; blue sky.",
"g2": f"{M} walking down a long bright hallway toward warm sunlight, seen from behind.",
"g3": f"{M} walking out through a door that is closing behind him, a tiny small boss (tan head, slicked dark hair, red tie) visible behind it looking small; bright.",
"g4": f"{M} in the middle thinking; on the left a golden promotion trophy on a pedestal, on the right an open sunny road with a backpack; split composition, bright.",
}
if __name__ == "__main__":
    perf, pr, tbl = [], {}, []
    for i, (tag, text, img) in enumerate(ROWS, 1):
        perf.append({"text": text, "tag": tag, "pause": 0.45, "clip": f"{i:02d}.mp3", "row": i, "img": img})
        pr[str(i)] = f"[{tag}] {text}"
        tbl.append(f"| {i} | [{tag}] {text} | {img} |")
    os.makedirs(P + "audio", exist_ok=True); os.makedirs(P + "images", exist_ok=True)
    json.dump(perf, open(P + "audio/performance.json", "w"), indent=1)
    json.dump(pr, open(P + "audio/prompts.json", "w"), indent=1)
    json.dump({k: v + " " + STYLE for k, v in IMGS.items()}, open(P + "images/prompts.json", "w"), indent=1)
    words = sum(len(t.split()) for _, t, _ in ROWS)
    open(P + "script.md", "w").write(
"# POV: Your Boss Laughed at Your Idea... Big Mistake. (script v3, 2026-11-14: Joe's ChatGPT script, WORD FOR WORD)\n\n"
f"Status: for production. Narration = Joe's pasted script verbatim, grouped into {len(ROWS)} voice clips ({words} words). Nothing added or cut; the closing on-screen text 'What would YOU have done? Taken the promotion... Or walked away?' is also spoken.\n"
"Look: bright daylight, seawater look (Joe 2026-11-14: no dark or faded visuals), no flash overlays. Mascot = 'you' (POV). Boss: slicked dark hair, red tie, big orange-brown watch.\n"
"Previous version (v2 Shelf Clip) archived in v2_archive/.\n\n| # | Narration (Grady) | Image |\n|---|---|---|\n" + "\n".join(tbl) + "\n")
    print(len(ROWS), "rows,", words, "words,", len(IMGS), "images")
