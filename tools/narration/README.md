# Narration forge (ByteCast)



Portable narration pipeline for episode packs. Uses **NXCore EchoVerse-compatible TTS** when available; browser read-aloud remains the fallback.



## Agent Days 1–4



| Day | Build lines | Forge |

|----:|-------------|-------|

| 1 | `python scripts/first_door_voiceover_build.py` | `npm run forge:agent-day1` |

| 2 | `python scripts/source_of_truth_voiceover_build.py` | `npm run forge:agent-day2` |

| 3 | `python scripts/signal_to_action_voiceover_build.py` | `npm run forge:agent-day3` |

| 4 | `python scripts/handoff_is_the_work_voiceover_build.py` | `npm run forge:agent-day4` |



## Agent Days 5–10



| Step | Command |

|------|---------|

| 1. Build / refresh episode packs | `npm run build:agent-days-5-10` |

| 2. Build voiceover + forge inputs | `npm run build:agent-days-5-10-vo` |

| 3. Probe TTS (on NXCore host) | `npm run probe:tts` |

| 4. Forge WAV segments | `npm run forge:agent-days-5-10` |



One-liner after packs exist:



```bash

npm run narrate:agent-days-5-10

```



Forge dirs: `tools/narration/agent_day5/` … `agent_day10/`



### Files (per day)



```

docs/agent_dayN/*.md

tools/narration/agent_dayN/

  forge.config.json

  lines.master.json

  sequences.json

  voiceRecipes.json

  bindings.json

episodes/<slug>/assets/

  voiceover_sections.json

  voiceover_sections.load.js

  narration.manifest.json   # after forge

  narration/*.wav

```



### Environment



| Variable | Purpose |

|----------|---------|

| `NXCORE_TTS_URL` | Full generate URL, e.g. `http://127.0.0.1:5315/api/generate` (default port **5315**) |

| `NARRATION_FORCE` | `1` = regenerate all lines even if file exists |



TTS contract: `POST {NXCORE_TTS_URL}/api/generate` with JSON `{ engine, text, voice, speed, format: "wav" }` → audio body. **Starter MVP only supports WAV**.



## See also



- [`../docs/NARRATION_FORGE_BYTECAST.md`](../docs/NARRATION_FORGE_BYTECAST.md)

- [`../docs/NARRATION_FORGE_PORTABLE_GUIDE.md`](../docs/NARRATION_FORGE_PORTABLE_GUIDE.md)

- [`../docs/AGENT_DAYS_5_10.md`](../docs/AGENT_DAYS_5_10.md)

- [`../docs/day1/LISTEN_MODE.md`](../docs/day1/LISTEN_MODE.md)

