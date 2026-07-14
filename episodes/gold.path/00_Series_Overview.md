# AeroVista Agent Onboarding ByteCast Series — Days 1–10

## Purpose

This series acclimates new agents into the AeroVista environment before they are allowed to operate independently. The goal is to create agents that reduce confusion, protect trust, preserve source-of-truth discipline, and leave useful operational trails.

## Live episode packs

| Day | Law | Live slug | Status |
|----:|-----|-----------|--------|
| 1 | Find the door | `the_first_door` | Live + Day 1 audio forged |
| 2 | Find the source | `finding_source_of_truth` | Live |
| 3 | Turn signal into action | `from_signal_to_action` | Live |
| 4 | Leave the trail | `the_handoff_is_the_work` | Live |
| 5 | Work the queue | `working_the_queue` | Live (from this pack) |
| 6 | Protect the boundary | `safe_access_boundaries` | Live (from this pack) |
| 7 | Serve without exposing | `builder_client_experience` | Live (from this pack) |
| 8 | Write to move work | `writing_like_aerovista` | Live (from this pack) |
| 9 | Finish the slice | `from_draft_to_deliverable` | Live (from this pack) |
| 10 | Earn trust (capstone) | `trusted_agent_capstone` | Live (from this pack) |

After Day 10: **TR-001A** mission gate, then practice builder / publish path.

## Reference docs in this folder

- Days 1–4 scripts also live under `docs/agent_day1` … `agent_day4` (canonical for live packs).
- Days 5–7: `day_05_*` … `day_07_*`, `master_reference_days_5_7.md`
- Days 8–10: `day_08_*` … `day_10_*`, `master_reference_days_8_10.md`
- Unified manifest: `manifest.json`

## Rebuild Days 5–10 from reference scripts

```bash
npm run build:agent-days-5-10
npm run sync:catalog
npm run upgrade:trainings
```

**Updated:** 2026-07-10
