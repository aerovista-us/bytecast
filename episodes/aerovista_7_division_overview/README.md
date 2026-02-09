# ByteCast EP-002 (Fixed)

## Why EP-2 looked "not built"
The `seed_bytecast.html` file you sent is **truncated** (it ends mid-slide), so the UI never fully rendered.
This bundle uses the complete EP-001 template and makes it JSON-driven (http + file:// fallback).

## Run (recommended)
```bash
python -m http.server 8080
```
Open: http://localhost:8080

## Audio
Put your audio at: `assets/bytecast-ep2.mp3`

## Edit content
Edit `bytecast_ep_profile.json` (slides, tags, quiz, quest).
