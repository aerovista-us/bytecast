# Agent Day 4 — The Handoff Is the Work

**Status:** Live pack at `episodes/the_handoff_is_the_work/`  
**Episode code:** `AGENT-D4`  
**Placement:** ByteCast → Getting Started → Required  
**Journey:** `p1_golden_path` step `handoff_gates` (after `avcc_gates`, before TR-001A)

## Product intent

Day 4 makes agents **durable across time**. Day 1 finds the door, Day 2 finds the source, Day 3 turns signal into action, and Day 4 teaches agents to **leave the system better documented than they found it**.

Grounded in onboarding culture (EOD Capsules as daily operational visibility, documentation as shared knowledge), operations framework (release boards, registry, P1/P2/P3, document versioning), and legal guardrails on confidential evidence in handoffs.

## What the pack includes

| Tab | Content | Journey step |
|-----|---------|--------------|
| **Gate** | Days 1–3 prerequisite + handoff discipline commitment | `handoff_gate` |
| **Journey** | 10 segments: cold open → why handoffs → trail system → handoff packet → EOD → state update → anti-duplication → confidentiality → formula → closing | `handoff_segments` |
| **Reference** | Trail System (7 surfaces), Handoff Packet (10 parts), Final Formula | — |
| **Check** | 6-question handoff discipline quiz (80% pass) | `handoff_engage` |
| **Prove** | Agent Handoff Packet + EOD Capsule Stub (16-part drill) | `handoff_prove` + `handoff_gates` |

## Completion artifacts

Journey step `handoff_prove` records:

- `handoffPacketSubmitted`, `taskTitle`, `currentState`, `nextAction`, `ownerLane`, `eodPriority`, `eodConfidence`
- Full `handoffPacket` bundle (all drill fields including EOD stub)

## Agent onboarding series map

| Day | Title | Teaches |
|-----|-------|---------|
| **Day 1** | The First Door | Culture, doors, trust, lost protocol |
| **Day 2** | Finding the Source of Truth | Authority, verification, conflicts, evidence |
| **Day 3** | From Signal to Action | AVCC judgment, COS brief, P1/P2/P3 |
| **Day 4** | The Handoff Is the Work *(this pack)* | Trail system, handoff packets, EOD Capsules, state discipline |
| **Day 5** | Working the Queue *(planned)* | P1/P2/P3 queue discipline, blocked vs parked vs active |

## Authoring

- Canonical script: [`agent_day4/THE_HANDOFF_IS_THE_WORK_SCRIPT.md`](./agent_day4/THE_HANDOFF_IS_THE_WORK_SCRIPT.md)
- Profile: [`../episodes/the_handoff_is_the_work/bytecast_ep_profile.json`](../episodes/the_handoff_is_the_work/bytecast_ep_profile.json)
- After catalog edits: `npm run sync:catalog`

## Narration

1. `python scripts/handoff_is_the_work_voiceover_build.py`
2. `export NXCORE_TTS_URL="http://127.0.0.1:5315/api/generate"` → `npm run forge:agent-day4`

**Updated:** 2026-07-09
