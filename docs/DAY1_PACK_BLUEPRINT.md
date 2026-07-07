# Day 1 pack blueprint â€” Welcome, Navigation, and Current Truth

**Sequence:** EP-001 â†’ EP-002 â†’ EP-003 â†’ EP-004 â†’ TR-001A â†’ (Golden Path continues: Seed â†’ Publish â†’ Badge).

## Golden Path (default journey)

The **canonical onboarding journey** is journey id **`p1_golden_path`** in [`data/journey_steps.json`](../data/journey_steps.json): EP-001â€“004 gate steps (`ep001_gates` â€¦ `ep004_gates`), **`tr001a_day1_foundations`** (TR-001A), then seed export / publish / **`p1_golden_path_v1`** badge. The Playlist (`seed_bytecast.html`), episode pages, and `ByteCastLoop` all use this id as the default when no other journey is active.

**Legacy (optional, not on the default path):**

- Folder alias **`ep1`** â†’ use **`episodes/welcome_to_bytecast/`** (see `legacy_paths` on EP-001 in `data/episode_registry.json`).
- **`episodes/training_missions/tr_001_golden_path/`** â€” older missions pack; Training Hub lists it as legacy; Day 1 proof for `p1_golden_path` is **TR-001A** only.

**Authoring outline:** If you keep a Word outline for EP-001â€“004 (e.g. `episodes/1-4.outline.docx`), treat it as **source material** only â€” runtime pages and the journey graph are the slugs above and `journey_steps.json`, not numeric `ep1` paths.

## Learner outcome

By end of Day 1 the learner can explain: what ByteCast is; how the loop and doors work; what AeroVistaâ€™s division model is; what ACOS and SOT mean at a beginner level; why **current truth is declared, not guessed**; and what **not** to open yet (internal/builder/raw surfaces).

## Pack components

| Code | Slug | Role |
|------|------|------|
| EP-001 | `welcome_to_bytecast` | ByteCast shape, loop, five doors, path-not-pile |
| EP-002 | `aerovista_7_division_overview` | Mission, seven peer divisions + HQ, ecosystem |
| EP-003 | `the_main_doors` | Doors in depth; learner vs internal |
| EP-004 | `current_truth_basics` | ACOS visibility, SOT trust, newest-file trap |
| TR-001A | `tr_001a_day1_foundations` | 8Ã— MC + 2Ã— short text + routing scenario; â‰¥80% MC (7/8+) |

## Proof gates (journey)

- Each EP: `ep00X_listen` â†’ `ep00X_slide` â†’ `ep00X_engage` with quiz meta on engage.
- **Listen proof (EP-001â€“004):** hidden optional narration audio **or** completing **Read episode overview** via Web Speech TTS (see [day1/LISTEN_MODE.md](./day1/LISTEN_MODE.md)).
- TR-001A: `tr001a_day1_foundations` with 8-question MC pass (â‰¥80%) + two written fields + scenario selection + timestamps.

## Explicitly out of scope for Day 1

Founderâ€™s Map depth; runtime vs founder intent; SSH/Docker/ports; raw runtime JSON; Seed Orchard internals; advanced builder; deep architecture.

## Audio / assets

Dedicated narration files may replace shared placeholder audio per episode; EP-003/EP-004 may temporarily use `../welcome_to_bytecast/assets/welcome_to_bytecast.mp3` until narrated tracks exist. Those files are used from a **hidden** `<audio>` element when present (no visible Audio tab on Day 1 episodes). Script text for TTS lives in bundled `voiceover_sections.json`; see [day1/LISTEN_MODE.md](./day1/LISTEN_MODE.md).

**Updated:** 2026-03-23

