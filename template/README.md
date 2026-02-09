# ByteCast EP-001

**Welcome to ByteCast: How to Use This + Why It Matters**  
Date: 2026-02-07

## Run
- Double-click `index.html`
- Or serve: `python -m http.server 8080` then open `http://localhost:8080`

## Replace
- `assets/bytecast-ep1.mp3`

## Keys
- Slides: ← / →
- Audio: Space play/pause, J/L seek, M mark
- Speed: S, Loop: R, Mute: K

## Recruitment CTA
If you want in, don’t ask for permission — ship a small win. Proof-of-work gets noticed.


## JSON-driven template
This build loads `bytecast_ep_profile.json` at runtime (via `fetch()`), so **use a local server**:
- `python -m http.server 8080`
- open `http://localhost:8080`

Edit episode content in `bytecast_ep_profile.json`.
