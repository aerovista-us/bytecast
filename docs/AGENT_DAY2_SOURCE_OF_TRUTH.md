# Agent Day 2 — Finding the Source of Truth

**Status:** Live pack at `episodes/finding_source_of_truth/`  
**Episode code:** `AGENT-D2`  
**Placement:** ByteCast → Getting Started → Required  
**Journey:** `p1_golden_path` step `sot_gates` (after `first_door_gates`, before TR-001A)

## Product intent

Day 1 teaches *you are in the world.* Day 2 teaches *how to know what is true inside the world* — before agents become beautifully written chaos machines.

Grounded in Week 1–2 onboarding (access, EOD Capsules, cultural immersion → systems, scan_dir, P1/P2/P3, cross-division work) plus document management, priority system, NXCore integration, and EOD reporting — with legal/compliance present throughout.

## What the pack includes

| Tab | Content | Journey step |
|-----|---------|--------------|
| **Gate** | Day 1 prerequisite + verification commitment (5 items) | `sot_gate` |
| **Journey** | 9 segments: cold open → why SOT → authority ladder → truth labels → source check → conflicts → evidence packet → legal/confidential → closing | `sot_segments` |
| **Reference** | Authority Ladder (7 rungs), Five Truth Labels, Source Check Method (6 steps) | — |
| **Check** | 6-question quiz (80% pass) | `sot_engage` |
| **Prove** | Source-of-Truth Drill + Conflict Note (18 fields) | `sot_prove` + `sot_gates` |

## Completion artifacts

Journey step `sot_prove` records:

- `sotDrillSubmitted`, `objectBeingChecked`, `truthLabel`, `packetConfidence`, `conflictSurfaced`
- Full `sotDrill` bundle (sources ranked, evidence packet, handoff note)

Badge `p1_golden_path_v1` now requires `sot_gates` and minProof on `sot_prove`.

## Agent onboarding series map

| Day | Title | Teaches |
|-----|-------|---------|
| **Day 1** | The First Door | Culture, doors, legal/trust, what to do when lost |
| **Day 2** | Finding the Source of Truth | Authority, verification, conflicts, evidence packets |
| **Day 3** | [**From Signal to Action**](./AGENT_DAY3_SIGNAL_TO_ACTION.md) *(live)* | AVCC judgment, COS brief, P1/P2/P3 |
| **Day 4** | The Handoff Is the Work *(planned)* | EOD Capsules, release boards, clean trails |

## Authoring

- Canonical script: [`agent_day2/FINDING_SOURCE_OF_TRUTH_SCRIPT.md`](./agent_day2/FINDING_SOURCE_OF_TRUTH_SCRIPT.md)
- Profile: [`../episodes/finding_source_of_truth/bytecast_ep_profile.json`](../episodes/finding_source_of_truth/bytecast_ep_profile.json)
- After catalog edits: `npm run sync:catalog`

## Narration

1. `python scripts/source_of_truth_voiceover_build.py`
2. `export NXCORE_TTS_URL="http://127.0.0.1:5315/api/generate"` → `npm run forge:agent-day2`

See [`NARRATION_FORGE_BYTECAST.md`](./NARRATION_FORGE_BYTECAST.md).

**Updated:** 2026-07-09
