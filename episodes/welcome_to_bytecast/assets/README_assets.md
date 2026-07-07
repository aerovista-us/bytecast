# Assets

Required:
- welcome_to_bytecast.aac (episode audio)

Bundled narration (regenerate from repo root: `python scripts/voiceover_md_to_json.py`):

- `voiceover_sections.json` — used over **http(s)** via `fetch`
- `voiceover_sections.load.js` — same payload for **file://** (null origin blocks `fetch` on `.json`)

Optional local assets:
- hero.jpg (optional)
- favicon.svg (optional)
