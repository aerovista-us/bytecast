# Day 1 listen mode (TTS + teleprompter)

Day 1 episodes **EP-001â€“EP-004** and training **TR-001A** use a shared **listen mode**: script text from the repo is bundled as JSON, the **Web Speech API** reads it aloud, and a **small teleprompter pane** scrolls and highlights the active chunk.

## Authoring and build

- **Source scripts:** `docs/day1/EP-001_VOICEOVER.md` â€¦ `EP-004_VOICEOVER.md` (per-scene `##` headings); `docs/day1/TR-001A_SCRIPT.md` for TR-001A.
- **Runtime bundle:** `voiceover_sections.json` next to each page under `episodes/<slug>/assets/` or `episodes/training_missions/tr_001a_day1_foundations/assets/`.
- **`file://` note:** Browsers use a null origin for local files, so **`fetch()` cannot load the `.json`** and **`crossorigin` on `<audio>`** breaks local MP3/AAC. The build also writes **`voiceover_sections.load.js`**, which assigns `window.ByteCastVoiceoverSections`; `listen_mode.js` injects that script automatically on `file:`. Hidden episode audio omits `crossorigin` so optional narration files load from disk.
- **Regenerate** from the bytecast repo root:

```bash
python scripts/voiceover_md_to_json.py
```

## Runtime assets

- `assets/shared/listen_mode.css` â€” teleprompter pane, controls, dim-while-playing (top bar stays usable via exempt regions).
- `assets/shared/listen_mode.js` â€” `ByteCastListenMode.init({ â€¦ })`, `attachSectionButton(â€¦)` for **Read this section**. Starting a new **Read this section** while audio is playing **stops** the current run and starts the new one. After payload load, `window.ByteCastVoiceoverSections` is cleared so a stale global cannot leak across tools.
- **Dim while playing:** `body.bytecast-listen-dim` dims `main.wrap` children (Day 1 episodes) and `main.shell` children (**TR-001A**), except `.topbar` / `.navtop` and elements with **`bytecast-listen-dim-exempt`**.

## Listen gate (episodes only)

For EP-001â€“EP-004, journey **listen** proof is satisfied when **either**:

1. **Hidden audio:** the episodeâ€™s optional MP3/AAC is present, loads, and playback reaches **â‰¥ 30 seconds** (or `ended`), or  
2. **TTS milestone:** the learner completes **Read episode overview** end-to-end without cancelling (Stop clears the run).

`ByteCastListenMode.init` accepts `onListenGate`, `hiddenAudio`, and `audioListenSeconds` (default 30). TR-001A passes a no-op `onListenGate`; it does not use the episode listen workflow step.

## Edge fallback (optional)

Copy in the UI reminds learners they can select text in the pane and use **Ctrl+Shift+U** (Microsoft Edge) as an optional system read-aloud; primary playback remains programmatic TTS.

**Read aloud on the Slides tab:** Diagrams are SVG; Edgeâ€™s line highlighter can throw if it tries to track text inside SVG. Slides mark `.slide-visual` with **`aria-hidden="true"`** and **`user-select: none`** so Read aloud and selection focus on the HTML copy in the slide **card** / **takeaway** column. Programmatic TTS also **stops when the Listen tab is hidden** so Edge is less likely to mix browser Read aloud with page `SpeechSynthesisUtterance` traffic.

## QA checklist

- **Browsers:** Chrome and Edge â€” overview and section reads, **Stop** cancels speech and dimming.
- **Scroll:** active chunk stays visible in the teleprompter viewport while speaking.
- **Double-click:** starting the same control while already speaking should not queue duplicate utterances (guarded in JS).
- **`file://`:** open episode HTML from disk; confirm narration loads (via `voiceover_sections.load.js`) and optional MP3/AAC does not console-error for CORS.
- **Gate:** with no audio sources, completing overview still marks listen; with audio, 30s playback marks listen without using the visible player (player UI is removed on Day 1 episodes).

## See also

- Pack context: [DAY1_PACK_BLUEPRINT.md](../DAY1_PACK_BLUEPRINT.md)

