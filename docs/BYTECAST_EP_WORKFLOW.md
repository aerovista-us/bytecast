# ByteCast Episode Workflow
Date: 2026-02-07

## Canonical episode path (effective now)
- New episode folders must use content slugs:
  - `episodes/<content_slug>/`
- Do **not** create new numeric folders (`ep1`, `ep2`, `ep3`, ...).
- Keep numeric paths only as temporary legacy compatibility wrappers.

## Create a new episode
1) Pick a content slug (example: `seed_playbook`)
2) Create `episodes/<content_slug>/` by copying the template folder
2) Edit `bytecast_ep_profile.json`:
   - `episode.code`, `episode.title`, `episode.date`
   - `content.tags`, `summary_short`, `summary_long`
   - `media.audio_files[0].path`
   - `slides[]`, `engagement.quest`, `engagement.quiz`
3) Drop the audio at the JSON path
4) Register the episode in `.CODEX/episode_registry.json`
5) Run:
```bash
python -m http.server 8080
```
Open:
- Local: `http://localhost:8080`
- GitHub Pages: `https://aerovista-us.github.io/bytecast/`

## Quality checks
- No console errors
- Slides navigate (buttons + arrows)
- Audio loads + keyboard shortcuts work
- Quest state persists
- Quiz grades and shows pass/fail
