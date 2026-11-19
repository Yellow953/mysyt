#!/usr/bin/env python3
"""IKEA ice storm 30 days (Joe's script VERBATIM, grouped into voice clips). Writes audio/performance.json + audio/prompts.json.
Run: .venv/bin/python scripts/long-form/ikea_data.py"""
import json, os
P = "/Users/yellow/Projects/MrYellowScarf/videos/long-form/ikea-ice-storm-30-days/"
ROWS = [
("curious","Imagine being trapped inside IKEA for 30 days. At first, it sounds amazing."),
("warm","Thousands of beds, couches, kitchens, bathrooms, food, and enough furniture to build an entire house."),
("low","But there's a problem. Outside, one of the worst ice storms in history is destroying everything."),
("low","Roads are frozen solid. Power lines are collapsing. Temperatures are dropping below minus 20 degrees."),
("dry","And you're completely alone inside a giant furniture store. Your only goal? Survive the next 30 days."),
("curious","It all starts when you visit IKEA just before the storm arrives. You notice the weather getting worse, but you don't think much of it."),
("low","Then the power suddenly goes out. Emergency lights turn on, and a loud announcement tells everyone to evacuate."),
("low","But when you reach the entrance, the automatic doors are frozen shut."),
("low","Outside, cars are sliding across the parking lot, trees are falling, and visibility is almost zero. There's no way you're making it home."),
("dry","So you head back inside. Your first priority is finding shelter."),
("warm","You choose one of the bedroom showrooms. There's a comfortable bed, blankets, pillows, and even a small living room next door."),
("dry","You drag a mattress into the display room, collect some blankets, and make yourself a sleeping area."),
("dry","Then you head to the restaurant. You find packaged food, snacks, and bottled drinks in the food market."),
("dry","You collect as much as you can carry. For now, you're safe. But the temperature inside the building is already starting to drop."),
("low","Three days have passed. The heating has stopped working. You wake up freezing, and your breath is visible in the air."),
("dry","You realize that sleeping in an ordinary showroom isn't going to work. So you move to the warehouse."),
("curious","There are enormous stacks of furniture boxes, mattresses, and insulation materials."),
("dry","You build a small enclosed shelter using mattresses, blankets, and furniture panels. It's not pretty, but it protects you from the cold."),
("dry","You also create a supply room. One section for food. One for clothes. One for tools and batteries. And one for medical supplies."),
("warm","You even find a camping section with sleeping bags, portable lights, and other useful equipment. Your little fortress is starting to look impressive."),
("low","But there's one problem. You have no idea how long the electricity will stay off."),
("low","One week. Outside, the entire parking lot has disappeared beneath thick layers of ice and snow."),
("low","You look through the windows and see abandoned cars completely frozen in place."),
("dry","Inside, the temperature keeps dropping. You start wearing multiple layers of clothing and sleeping inside a sleeping bag. You stop wasting energy walking around the store."),
("dry","Every morning, you check your food and water supplies. You discover that the restaurant has some remaining packaged ingredients, but fresh food is becoming harder to preserve."),
("curious","You also find a small maintenance area containing flashlights, tools, and emergency equipment."),
("low","Then you hear a loud cracking sound. A section of the roof has been damaged by the weight of the ice."),
("low","You rush toward the other side of the building. Some ceiling panels have collapsed, and water is leaking onto the floor."),
("low","Your survival base is no longer completely safe. You need to move."),
("dry","Twelve days have passed. You relocate your shelter to a different section of the warehouse, away from the damaged roof."),
("low","But now you have another problem. Parts of the store are completely inaccessible. Some aisles are flooded. Others are covered in broken ceiling panels and debris."),
("dry","You create a map showing which sections are safe. The bedroom showroom becomes your sleeping area. The kitchen displays become your cooking and preparation area. And the warehouse becomes your main storage base."),
("dry","You also start keeping a daily routine. Wake up. Check the building. Collect supplies. Exercise. Prepare food. And sleep."),
("low","It keeps you from going crazy. But being alone for almost two weeks is starting to affect you. You haven't spoken to another person."),
("wry","You even start talking to the IKEA mannequins. And honestly, they're becoming pretty good company."),
("low","Day eighteen. You wake up and discover that the water in one of the pipes has frozen. The bathrooms are becoming unusable."),
("dry","You still have bottled water, but you need to manage every drop carefully. You also discover that some of your food supplies are running low. The Swedish food market isn't exactly designed to feed one person for an entire month."),
("dry","So you start searching the warehouse and restaurant storage areas for anything you missed. You find more packaged food, but you also discover something important."),
("low","The emergency generator is almost out of fuel. Without electricity, you could lose your remaining lights, equipment, and any working refrigeration."),
("low","You check the maintenance area and realize you have to prioritize what little power remains. The next twelve days are going to be difficult. And outside, the storm hasn't stopped."),
("low","Only six days remain. You thought the worst was over. But then a powerful gust of wind hits the building."),
("low","You hear metal bending somewhere above you. A few seconds later, the emergency lights go out. Complete darkness."),
("low","You grab your flashlight and carefully move through the warehouse. Then you notice something terrifying."),
("low","The main entrance area is partially covered by fallen debris and ice. Even if the storm stopped right now, getting outside wouldn't be easy."),
("dry","You return to your shelter and gather your remaining food, water, warm clothing, and emergency supplies. You move everything closer to the safest interior section of the building."),
("low","You barely sleep that night. Every few minutes, you hear the building creaking under the weight of the ice. You start wondering if you'll ever see the outside world again."),
("warm","Finally, day thirty arrives. You wake up expecting another freezing morning. But something is different. It's quiet. No howling wind. No cracking ice."),
("warm","You look outside. The storm has finally stopped. Sunlight shines through the frozen windows."),
("warm","You pack your supplies and make your way toward the entrance. The doors are still blocked, but a section of the emergency exit is accessible. You carefully make your way outside."),
("curious","The entire parking lot looks like another planet. Cars are buried in snow. Trees are covered in ice. And the world is completely silent."),
("warm","But you're alive. You survived thirty days inside IKEA. And honestly? You'll never look at a furniture showroom the same way again."),
("curious","But here's the question. Would you survive 30 days inside IKEA during an ice storm?"),
("wry","And which section would you turn into your survival base? The bedroom showroom, the restaurant, or the giant warehouse?"),
("curious","Let me know in the comments. And subscribe to MrYellowScarf for more crazy survival challenges."),
]
if __name__ == "__main__":
    os.makedirs(P + "audio/clips", exist_ok=True)
    perf = [{"text": t, "tag": g, "pause": 0.45, "clip": f"{i:02d}.mp3", "row": i} for i, (g, t) in enumerate(ROWS, 1)]
    json.dump(perf, open(P + "audio/performance.json", "w"), indent=1)
    json.dump({str(i): f"[{g}] {t}" for i, (g, t) in enumerate(ROWS, 1)}, open(P + "audio/prompts.json", "w"), indent=1)
    print(len(ROWS), "rows", sum(len(t.split()) for _, t in ROWS), "words", sum(len(t) + 6 for _, t in ROWS), "chars")
