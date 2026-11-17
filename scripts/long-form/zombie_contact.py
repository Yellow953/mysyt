import sys, glob, os
from PIL import Image, ImageDraw
files = sorted(glob.glob(sys.argv[1] + "/**/*.png", recursive=True)); out = sys.argv[2]
TH = 300; cols = 6
ims = [Image.open(f).convert("RGBA") for f in files]
ims = [i.resize((max(1, int(i.width * TH / i.height)), TH)) for i in ims]
W = 330; rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (TH + 24)), (150, 200, 235))
d = ImageDraw.Draw(sheet)
for k, (f, i) in enumerate(zip(files, ims)):
    x, y = (k % cols) * W, (k // cols) * (TH + 24)
    i = i.copy(); i.thumbnail((W - 6, TH))
    sheet.paste(i, (x + 3, y + 20), i); d.text((x + 4, y + 4), os.path.basename(f), fill=(0, 0, 0))
sheet.save(out)
