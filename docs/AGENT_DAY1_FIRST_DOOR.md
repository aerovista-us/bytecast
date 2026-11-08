# Agent Day 1 — "The First Door"

**Status:** Live pack at `episodes/the_first_door/`  
**Episode code:** `AGENT-D1`  
**Placement:** ByteCast → Getting Started → **Required**  
**Journey:** `p1_golden_path` step `first_door_gates` (replaces EP-001–004 as the Golden Path gate)

## Product intent

Day 1 teaches **how to think inside AeroVista** before it teaches where every button lives.

**Do not** onboard agents by listing every app. Onboard them with the **operating law**:

> Find the source of truth. Ask better questions. Protect the rails. Finish usable slices. Escalate when lost. Leave evidence behind.

This aligns with AeroVista onboarding docs: ecosystem mental model, EOD Capsules, culture, confidentiality/IP boundaries, and infrastructure + creativity + storytelling as one system.

## What the pack includes

| Surface | Purpose |
|---------|---------|
| **Trust gate** | Required legal & trust acknowledgment (8 items) |
| **Journey** | Nine segments via **interactive stepper** — animated SVG, key takeaway, expandable script, micro-checks |
| **Practice** | Three hands-on labs: Route the Door, Name the State, Lost Agent Protocol |
| **Reference** | Operating law, seven doors, state labels |
| **Check** | Six-question operating-law quiz (80% pass) |
| **Prove** | Day 1 Readiness Note + EOD Capsule starter (stored in journey proof) |

## Interactive layer (2026-07)

Shared assets power the engage-first pattern:

| Asset | Role |
|-------|------|
| `assets/shared/agent_day_visuals.js` | Per-segment animated SVG + highlights + micro-checks |
| `assets/shared/agent_day_interactive.js` | Journey stepper + practice lab engine |
| `assets/shared/agent_day_interactive.css` | Stepper, lab, and protocol UI |

Profile flag: `interactives.journey_mode: "stepper"` and `interactives.labs` in `bytecast_ep_profile.json`.  
Journey completion requires **segments + practice labs** when `labs_required: true`.

Days 2–10 can adopt the same shell by adding `#journeyStepper`, `#practiceLabs`, and lab definitions to the profile.

## Completion artifacts

Journey step `first_door_prove` records:

- `readinessNoteSubmitted`, `agentIdentity`, `assignedLane`, `currentState`
- `eodCapsule` object (learned, verified, unknown, next)
- Full `readinessNote` field bundle for teacher review

Badge `p1_golden_path_v1` now requires First Door proof instead of EP-001–004 engage meta.

## Roadmap (recommended)

| Day | Working title | Focus |
|-----|---------------|--------|
| **Day 1** | **The First Door** (this pack) | Operating law, doors, trust, readiness note |
| **Day 2** | [**Finding the Source of Truth**](./AGENT_DAY2_SOURCE_OF_TRUTH.md) *(live)* | Authority ladder, truth labels, source checks, evidence packets |
| **Day 3** | [**From Signal to Action**](./AGENT_DAY3_SIGNAL_TO_ACTION.md) *(live)* | AVCC judgment, COS brief, P1/P2/P3 |
| **Day 4** | The Handoff Is the Work *(planned)* | EOD Capsules, release boards, clean trails |

## Legacy EP-001–004

Previous Day 1 episodes (`welcome_to_bytecast` … `current_truth_basics`) remain in the catalog as **optional reference** (`lifecycle: reference`). They are no longer on the Golden Path spine.

## Authoring

- Canonical script: [`agent_day1/THE_FIRST_DOOR_SCRIPT.md`](./agent_day1/THE_FIRST_DOOR_SCRIPT.md)
- Profile: [`../episodes/the_first_door/bytecast_ep_profile.json`](../episodes/the_first_door/bytecast_ep_profile.json)
- After catalog edits: `npm run sync:catalog`

## Narration (NXCore TTS)

1. `python scripts/first_door_voiceover_build.py`
2. `set NXCORE_TTS_URL=http://your-nxcore:8787` → `npm run forge:agent-day1`
3. See [`NARRATION_FORGE_BYTECAST.md`](./NARRATION_FORGE_BYTECAST.md)

**Updated:** 2026-07-08
