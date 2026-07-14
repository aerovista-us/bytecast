# Narration forge — portable agent guide

**Audience:** Agents porting the AeroVista narration forge into another project  
**ByteCast instance:** [`tools/narration/`](../tools/narration/) + [`NARRATION_FORGE_BYTECAST.md`](./NARRATION_FORGE_BYTECAST.md)

## What to copy

| Piece | Required | Notes |
|-------|----------|-------|
| `tools/narration/<pack>/forge.config.json` | Yes | Pack paths + TTS endpoint |
| `tools/narration/<pack>/lines.master.json` | Yes | Generated or hand-authored lines |
| `tools/narration/<pack>/sequences.json` | Yes | Play order |
| `tools/narration/<pack>/voiceRecipes.json` | Yes | Voice → TTS params |
| `tools/narration/<pack>/bindings.json` | Recommended | Runtime manifest + episode hooks |
| `scripts/narration-forge-*.mjs` | Yes | Forge driver (adapt from `narration-forge-agent-day1.mjs`) |
| `assets/shared/nxcore_narration_player.js` | Recommended | Manifest MP3 player |
| `assets/shared/listen_mode.js` + `.css` | Fallback | Browser TTS teleprompter |

Optional: `scripts/run-from-root.cjs` UNC-safe bootstrap (Windows shares).

## Directory layout

```
docs/<pack>/SCRIPT.md              # Authoring source (markdown)
tools/narration/<pack>/
  forge.config.json
  lines.master.json
  sequences.json
  voiceRecipes.json
  bindings.json
episodes/<slug>/assets/
  voiceover_sections.json          # Runtime TTS sections
  narration.manifest.json          # Forged playlist
  narration/*.mp3
```

## Configuration files

### `forge.config.json`

- `packId`, `episodeCode`
- `linesMaster`, `sequences`, `voiceRecipes`, `bindings` (relative paths)
- `outputDir`, `runtimeManifest`
- `tts.endpoint` — typically `/api/generate`
- `tts.envUrl` — `NXCORE_TTS_URL`

### `voiceRecipes.json`

Maps recipe id → `{ voice, style, rate, format }` sent to TTS.

### `lines.master.json`

```json
{ "lines": [{ "id": "cold_open", "label": "...", "text": "...", "voiceRecipe": "byte-narrator" }] }
```

### `sequences.json`

Named playlists of `lineIds` (e.g. `full_journey`).

### `bindings.json`

Links manifest path, listen gate step id, fallback JS.

## TTS server (EchoVerse-compatible)

```
POST {NXCORE_TTS_URL}/api/generate
Content-Type: application/json

{ "text": "...", "voice": "byte", "format": "mp3", "style": "cinematic-grounded", "rate": "0.98" }

→ audio/mpeg body
```

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NXCORE_TTS_URL` | Base URL for NXCore TTS |
| `NARRATION_FORCE` | `1` = ignore incremental skip |
| `NARRATION_RETRIES` | Optional retry count (implement in forge script) |

## Workflow

1. **Scaffold** — copy `tools/narration/agent_day1/` as template  
2. **Author** — write `docs/<pack>/SCRIPT.md`  
3. **Build lines** — Python/Node script → `lines.master.json` + `voiceover_sections.json`  
4. **Forge** — `node scripts/narration-forge-<pack>.mjs`  
5. **Validate** — open episode; confirm manifest plays; fallback TTS works without MP3  
6. **Runtime** — wire `NxcoreNarrationPlayer` + `ByteCastListenMode` in episode HTML  

## Hashing / incremental builds

Forge script names files `{lineId}-{hash}.mp3`. If file exists and `NARRATION_FORCE` is not set, line is `[skip]`. Change text or recipe → new hash → regen.

## Windows / UNC

Run forge from repo root via `node scripts/...` with `working_directory` set to the UNC path, or use a `run-from-root.cjs` wrapper that `process.chdir`s to repo root before import.

## Reference — ByteCast files

| Concern | File |
|---------|------|
| Agent Day 1 forge | `scripts/narration-forge-agent-day1.mjs` |
| Script → sections | `scripts/first_door_voiceover_build.py` |
| Manifest player | `assets/shared/nxcore_narration_player.js` |
| TTS teleprompter | `assets/shared/listen_mode.js` |
| Episode player | `episodes/the_first_door/index.html` |

**Updated:** 2026-07-08
