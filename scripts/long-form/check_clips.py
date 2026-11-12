"""Voice QC for long-form (and any video folder): transcribe EVERY clip in audio/clips and compare it to the text it should say.
Usage: .venv/bin/python scripts/long-form/check_clips.py videos/long-form/<slug>
Reads audio/performance.json (text + clip per phrase), transcribes each clip with the fast whisper model, prints every phrase whose
speech does not match (similarity < 0.75, numerals ignored loosely) and the best-matching other clip. Run it BEFORE build_voice.py.
Born from the McDonald's video (2026-11-04): the first 8 clips held the wrong speech and the disclaimer played in the opening."""
import difflib, glob, json, os, re, subprocess, sys, tempfile
import mlx_whisper

MODEL = "mlx-community/whisper-small-mlx"
vdir = sys.argv[1].rstrip("/") + "/"
perf = json.load(open(vdir + "audio/performance.json"))
norm = lambda s: re.sub(r"[^a-z0-9 ]", "", s.lower().replace("-", " ")).strip()
sim = lambda a, b: difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()
tmp = tempfile.mkdtemp()
heard = {}
for c in sorted(glob.glob(vdir + "audio/clips/*.mp3")):
    wav = os.path.join(tmp, "c.wav")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", c, "-ar", "16000", "-ac", "1", wav], check=True)
    heard[os.path.basename(c)] = mlx_whisper.transcribe(wav, path_or_hf_repo=MODEL)["text"].strip()
bad = 0
for i, p in enumerate(perf):
    t = heard.get(p["clip"], "")
    s = sim(p["text"], t)
    if s < 0.75:
        bad += 1
        best = max(heard.items(), key=lambda kv: sim(p["text"], kv[1]))
        print(f"#{i:02d} {p['clip']} sim={s:.2f}\n   want: {p['text'][:80]}\n   has : {t[:80]}\n   best: {best[0]} ({sim(p['text'], best[1]):.2f})")
print(f"{bad} suspicious phrase(s) of {len(perf)} (numeral spelling differences such as '105' vs 'a hundred and five' can be ignored)")
