# ByteCast Template Manual
Date: 2026-02-07

## Canonical template pattern
Best-of-both-worlds:
- `index.html` (full UI template)
- `bytecast_ep_profile.json` (episode content)
- `assets/<episode-audio>.mp3`

### Lesson shell (template `index.html`)
- Below the hero, the template uses a **single panel with tabs**: **Audio**, **Slides**, **Engagement**, **About AV**.
- The **Cross-App Visual Lanes** animated workspace map is **intentionally omitted** from the episode template to keep new episodes lightweight. For special pages, reuse the SVG block from `seed_bytecast.html`, `welcome_to_bytecast/index.html`, `episodes/training_hub/index.html`, or similar.

Template should:
- Try `fetch("bytecast_ep_profile.json")` (http mode)
- Fall back to embedded JSON (file:// mode)

## Theme system
Default: **Venta Black + Neon Blue**
Optional presets:
- `ghostwave` (purple glow)
- `embercore` (warm highlights)

## Controls
- ← / → slides
- Space play/pause
- J/L seek -10/+10
- M mark moment

## Publishing
- GitHub Pages: commit the folder to a repo with Pages enabled
- Audio must be included and path must be relative


