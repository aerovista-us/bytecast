# Narration forge — ByteCast integration

**Audience:** Maintainers forging episode audio via NXCore TTS  
**Pilot packs:** Agent Day 1 — [`the_first_door`](../episodes/the_first_door/) · Day 2 — [`finding_source_of_truth`](../episodes/finding_source_of_truth/) · Day 3 — [`from_signal_to_action`](../episodes/from_signal_to_action/) · Day 4 — [`the_handoff_is_the_work`](../episodes/the_handoff_is_the_work/)  
**Portable pattern:** [`NARRATION_FORGE_PORTABLE_GUIDE.md`](./NARRATION_FORGE_PORTABLE_GUIDE.md)

## Why two listen paths?

| Path | When | Quality |
|------|------|---------|
| **NXCore forged WAV** | TTS service reachable; `npm run forge:agent-day1` completed | Production Byte narrator (piper `en_US-amy-medium`) |
| **Browser listen mode** | No forged audio yet or offline | Web Speech API teleprompter (`listen_mode.js`) |

The First Door player tries **forged manifest first**, then falls back to TTS sections from `voiceover_sections.json`.

## Quick workflow (Agent Day 1)

```bash
# 1 — Parse script → voiceover JSON + forge lines
python scripts/first_door_voiceover_build.py

# 2 — Generate WAVs on NXCore (EchoVerse /api/generate on port **5315**; starter MVP is **wav only**)

**Linux / bash (on nxcore):**

```bash
export NXCORE_TTS_URL="http://127.0.0.1:5315/api/generate"
npm run probe:tts          # verify before long forge
npm run forge:agent-day1
```

**Windows PowerShell:**

```powershell
$env:NXCORE_TTS_URL = "http://127.0.0.1:5315/api/generate"
npm run probe:tts
npm run forge:agent-day1
```

Do **not** use `$env:...` in bash — that is PowerShell only.
npm run forge:agent-day1

# 3 — Open episode (GitHub Pages or local server)
# episodes/the_first_door/index.html
```

## What gets generated

| Output | Purpose |
|--------|---------|
| `episodes/the_first_door/assets/voiceover_sections.json` | Section text for teleprompter + per-segment TTS |
| `tools/narration/agent_day1/lines.master.json` | Forge input lines |
| `episodes/the_first_door/assets/narration/*.wav` | Forged audio per segment |
| `episodes/the_first_door/assets/narration.manifest.json` | Runtime playlist for `nxcore_narration_player.js` |

## Authoring source

Edit [`agent_day1/THE_FIRST_DOOR_SCRIPT.md`](./agent_day1/THE_FIRST_DOOR_SCRIPT.md) — re-run step 1 (and step 2 if voices should update).

## Legacy options (still valid)

Day 1 legacy EP-003/004 docs describe Edge TTS and OpenAI scripts:

- [`day1/README_VO_AUDIO.md`](./day1/README_VO_AUDIO.md)
- `scripts/vo_md_to_mp3.py`, `scripts/voiceover_md_to_json.py`

Prefer **narration forge + NXCore** for new packs (Agent Day 1, Day 2 SOT, Day 3 AVCC).

## Journey proof

Completing forged or browser **full journey** listen marks `first_door_segments` when the learner finishes all sections / full overview audio.

**Updated:** 2026-07-08
