# Agent Day 3 — From Signal to Action

**Status:** Live pack at `episodes/from_signal_to_action/`  
**Episode code:** `AGENT-D3`  
**Placement:** ByteCast → Getting Started → Required (flagship)  
**Journey:** `p1_golden_path` step `avcc_gates` (after `sot_gates`, before TR-001A)

## Product intent

Day 3 is the **flagship agent-behavior episode**. Agents stop being summarizers and learn **executive judgment** — how AVCC turns signals into direction.

Grounded in onboarding culture (platform strengthening, EOD Capsules), operations framework (P1/P2/P3, quality gates, NXCore verification), and legal guardrails on confidential evidence.

## What the pack includes

| Tab | Content | Journey step |
|-----|---------|--------------|
| **Gate** | Days 1–2 prerequisite + AVCC judgment commitment | `avcc_gate` |
| **Journey** | 10 segments: cold open → dashboard vs COS → judgment chain → COS brief → P1/P2/P3 → examples → mistakes → template → confidentiality → closing | `avcc_segments` |
| **Reference** | AVCC chain, COS brief sections, priority levels | — |
| **Check** | 6-question AVCC judgment quiz (80% pass) | `avcc_engage` |
| **Prove** | Signal-to-Action Brief (13 fields + final 8-sentence brief) | `avcc_prove` + `avcc_gates` |

## Completion artifacts

Journey step `avcc_prove` records:

- `avccBriefSubmitted`, `signalChanged`, `priority`, `confidence`
- Full `avccBrief` bundle (context, recommendation, impact, evidence, memory update, final brief)

## Agent onboarding series map

| Day | Title | Teaches |
|-----|-------|---------|
| **Day 1** | The First Door | Culture, doors, trust, lost protocol |
| **Day 2** | Finding the Source of Truth | Authority, verification, conflicts, evidence |
| **Day 3** | From Signal to Action *(this pack)* | AVCC judgment, COS brief, P1/P2/P3 |
| **Day 4** | The Handoff Is the Work | EOD Capsules, release boards, clean trails |
| **Day 5** | Working the Queue *(planned)* | P1/P2/P3 queue discipline, blocked vs parked vs active |

## Authoring

- Canonical script: [`agent_day3/FROM_SIGNAL_TO_ACTION_SCRIPT.md`](./agent_day3/FROM_SIGNAL_TO_ACTION_SCRIPT.md)
- Profile: [`../episodes/from_signal_to_action/bytecast_ep_profile.json`](../episodes/from_signal_to_action/bytecast_ep_profile.json)
- After catalog edits: `npm run sync:catalog`

## Narration

1. `python scripts/signal_to_action_voiceover_build.py`
2. `export NXCORE_TTS_URL="http://127.0.0.1:5315/api/generate"` → `npm run forge:agent-day3`

**Updated:** 2026-07-09
