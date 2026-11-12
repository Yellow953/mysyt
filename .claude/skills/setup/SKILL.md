---
name: setup
description: First-run install and health check for the Mr. Yellow Scarf pipeline (ffmpeg, espeak-ng, Python venv with Kokoro + Whisper, Higgsfield MCP, character element, channel voice, Claude in Chrome). Use on first run, when a tool is missing, or when something in the pipeline breaks.
---

# Setup / Health Check

Run every check, fix only what is broken, then report a status table to Joe.
Setup was completed on 2026-10-27; on later runs this is a health check.

## 1. System tools (Homebrew)
```bash
command -v ffmpeg ffprobe espeak-ng
```
Missing → `brew install ffmpeg espeak-ng`.

## 2. Python venv (`.venv`, Python 3.11)
```bash
.venv/bin/python -c "import kokoro, mlx_whisper, PIL, googleapiclient; print('OK')"
```
Missing → 
```bash
/opt/homebrew/bin/python3.11 -m venv .venv
.venv/bin/pip install --timeout 60 --retries 20 --resume-retries 50 \
  "kokoro>=0.9.4" soundfile mlx-whisper pillow numpy \
  google-api-python-client google-auth-oauthlib google-auth-httplib2
```
Joe's connection drops on big downloads. Always use the retry/resume flags, run in the background, and if it stalls (no growth in `~/Library/Caches/pip` for 20 s, ~0% CPU) kill it and rerun; the cache is reused.

## 3. Higgsfield
- `balance` → plan + credits. Report them.
- `show_reference_elements` → element `aa6661ee-d997-489c-9e1b-9b9adbed8c94` (Mr-Yellow-Scarf) must be `completed`.
- If missing: upload `assets/character/mr-yellow-scarf-reference.png` (media_upload → curl PUT → media_confirm), create the element (category auto), and update the ID in CLAUDE.md.

## 4. Voice
Channel voice is Kokoro `am_puck`, speed 1.05 (defaults in `scripts/short-form/tts.py`). Smoke test:
```bash
.venv/bin/python scripts/short-form/tts.py --text "Test." --out /tmp/claude-tts-test.wav
```
Voice-test samples were deleted in the 2026-11-05 cleanup; regenerate into `assets/voice-samples/` only if Joe asks to change voice.

## 5. Claude in Chrome
`list_connected_browsers` must return a browser. If empty:
1. Extension installed and enabled at `chrome://extensions` (official ID `fcoeoabgfenejglbffodgkkbkcdhcgfn`), logged in as Joe's account.
2. Native host exists: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.anthropic.claude_code_browser_extension.json`.
3. Joe runs `/chrome` → **Reconnect extension**. (2026-10-27 fix: the session had started before the native host; Reconnect solved it.)

## 6. YouTube API: DONE 2026-10-30
Project `mr-yellow-scarf`, YouTube Data API v3, OAuth consent External in **Testing** (Joe as test user; do NOT upload a logo, it triggers verification; publishing needs homepage + privacy URLs), Desktop client in `secrets/client_secret.json`, token in `secrets/token.json` (from `scripts/short-form/youtube_upload.py auth`, expires after 7 days in Testing). Test upload OK. Original steps: Google Cloud project → enable YouTube Data API v3 + YouTube Analytics API → OAuth consent screen (Joe as test user) → Desktop OAuth client → `secrets/client_secret.json`. Ask Joe before creating the project and before accepting any terms; Joe clicks "Allow" himself.

## Report
| Check | Status |
|---|---|
Then update `memory/short-form/strategy.md`.
