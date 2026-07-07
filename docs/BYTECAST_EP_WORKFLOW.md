# ByteCast Episode Workflow
Date: 2026-07-06

## Canonical episode path (effective now)
- New episode folders must use content slugs:
  - `episodes/<content_slug>/`
- Do **not** create new numeric folders (`ep1`, `ep2`, `ep3`, ...).
- Keep numeric paths only as temporary legacy compatibility wrappers.

## Create a new episode
1) Pick a content slug (example: `seed_playbook`)
2) Create `episodes/<content_slug>/` by copying the template folder
3) Edit `bytecast_ep_profile.json`:
   - `episode.code`, `episode.title`, `episode.date`
   - `teaching_mode` (optional): one of `BriefingSync`, `GuidedAudioSlides`, `VisualHotspot`, `ReadAloudScript`, `VoiceoverSections`, `MissionLab`, `SeedDoProve` — see [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md)
   - `content.tags`, `summary_short`, `summary_long`
   - `media.audio_files[0].path`
   - `slides[]`, `engagement.quest`, `engagement.quiz`
4) Drop the audio at the JSON path
5) Register the episode in both registry mirrors:
   - `data/episode_registry.json`
   - `.CODEX/episode_registry.json`
6) Set the episode's `series_id`, `series_name`, and `sequence` so grouped series views stay accurate in the Playlist and Training Hub.
7) Run:
```bash
python -m http.server 8080
```
Open:
- Local: `http://localhost:8080`
- GitHub Pages: `https://aerovista-us.github.io/bytecast/`

## Episode page shell (reference episodes)
**Day 1 Golden Path** episodes **EP-001**-**EP-004** (`welcome_to_bytecast`, `aerovista_7_division_overview`, `the_main_doors`, `current_truth_basics`) use a **tabbed lesson panel** below the hero: primary lesson content lives in one `tabsHost` card with tabs (episode-specific labels such as Audio/Slides/Engagement/About AV, or Listen/Slides/Doors/Engage, etc.). **Cross-App Visual Lanes** is not on these pages - copy from `seed_bytecast.html` or hub shells if you need that map.

Episodes such as **EP-003** (`the_main_doors`) and **EP-004** (`current_truth_basics`) also share:

- **On-page nav** (`pathRail`): jump links to Listen, Slides, episode-specific sections (for example doors or reference), Engage, and Next.
- **Slides**: deck bar shows progress, dot navigation, and a small keyboard hint; each slide can show a **slide id** chip from `slides[].id`.
- **Gates**: `bytecast_loop.js` steps (listen / slide / engage) drive a **gate pill row** and the short `gateNote` line; the primary **Next** control is emphasized only when all gates are complete.
- **Quiz**: after **Grade**, choices highlight correct vs wrong; optional per-question `explain` text in `bytecast_ep_profile.json` appears under **Why**.
- **Hero pills**: when `episode.runtime_target_minutes` is set, a **VO target** pill shows approximate narration length.
- **Audio**: use an empty `<audio controls>` in HTML; `main()` fills `<source>` elements from `media.audio_files` (fallback placeholder if none).

## Quality checks
- No console errors
- Slides navigate (buttons + arrows)
- Audio loads + keyboard shortcuts work
- Quest state persists
- Quiz grades and shows pass/fail (and explains when present in profile)
