# ByteCast EP-001

**Welcome to ByteCast: How to Use This + Why It Matters**  
Date: 2026-02-07

## Run
- Double-click `index.html`
- Or serve: `python -m http.server 8080` then open `http://localhost:8080`

## Replace
- `assets/audio_placeholder.wav` (placeholder)

## Layout
- **Tabs:** Audio, Slides, Engagement, About AV (one panel below the hero).
- The animated **Cross-App Visual Lanes** SVG is **not** in this template; copy it from `seed_bytecast.html`, `welcome_to_bytecast/index.html`, or hub shells when you need that map.

## Keys
- Slides: ← / → (works when the Slides tab is available)
- Audio: Space play/pause, J/L seek, M mark
- Speed: S, Loop: R, Mute: K
- Tabs: ← / → when focus is in the tab bar

## Recruitment CTA
If you want in, don’t ask for permission — ship a small win. Proof-of-work gets noticed.


## JSON-driven template
This build loads a profile JSON at runtime (via `fetch()`), so **use a local server**:
- `python -m http.server 8080`
- open `http://localhost:8080`

Preferred (pack contract): edit episode content in `data/bytecast_ep_profile.json`.

Compatibility: `bytecast_ep_profile.json` at the root is still supported, but `data/` is the canonical location going forward.
