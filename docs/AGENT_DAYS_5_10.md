# Agent Days 5–10 — Required Onboarding Extension

**Audience:** New AeroVista agents continuing the Golden Path after Day 4.  
**Source pack:** [`episodes/gold.path/`](../episodes/gold.path/) (reference scripts + completion drills).  
**Rebuild:** `npm run build:agent-days-5-10` then `npm run build:agent-days-5-10-vo` then `npm run sync:catalog`.

### NXCore forged audio (on NXCore host)

```bash
npm run probe:tts
npm run forge:agent-days-5-10
```

Until forge runs, **Listen mode** uses `assets/voiceover_sections.json` (browser read-aloud) — same pattern as Days 1–4 before WAV exists.

## Interactive layer (Days 1–10)

All Agent Day packs use **InteractiveScript** mode:

| Tab | Experience |
|-----|------------|
| **Journey** | Segment stepper — visual, key takeaway, expandable script |
| **Practice** | 3 day-specific scenario labs (must pass before journey complete) |
| **Reference** | Cards / steps from profile |
| **Check / Prove** | Quiz + completion drill |

Shared assets: `assets/shared/agent_day_{labs,visuals,interactive}.js`, `agent_day_episode.js`.

Upgrade existing packs: `npm run upgrade:agent-days-interactive`  
Rebuild Days 5–10 from gold.path: `npm run build:agent-days-5-10`

| Day | Law | Live pack |
|----:|-----|-----------|
| 1 | Find the door | [`the_first_door`](../episodes/the_first_door/) |
| 2 | Find the source | [`finding_source_of_truth`](../episodes/finding_source_of_truth/) |
| 3 | Turn signal into action | [`from_signal_to_action`](../episodes/from_signal_to_action/) |
| 4 | Leave the trail | [`the_handoff_is_the_work`](../episodes/the_handoff_is_the_work/) |
| 5 | Work the queue | [`working_the_queue`](../episodes/working_the_queue/) |
| 6 | Protect the boundary | [`safe_access_boundaries`](../episodes/safe_access_boundaries/) |
| 7 | Serve without exposing | [`builder_client_experience`](../episodes/builder_client_experience/) |
| 8 | Write to move work | [`writing_like_aerovista`](../episodes/writing_like_aerovista/) |
| 9 | Finish the slice | [`from_draft_to_deliverable`](../episodes/from_draft_to_deliverable/) |
| 10 | Earn trust (capstone) | [`trusted_agent_capstone`](../episodes/trusted_agent_capstone/) |

After Day 10: **TR-001A** mission gate, then practice builder / publish path.

## Episode shape (Days 5–10)

Each day uses the shared shell [`assets/shared/agent_day_episode.js`](../assets/shared/agent_day_episode.js):

1. **Gate** — commitment checklist  
2. **Journey** — script segments (read / listen)  
3. **Reference** — quick cards from the profile  
4. **Check** — six-question quiz (80% pass)  
5. **Prove** — completion drill fields from gold.path drill markdown  

Canonical scripts are copied to `docs/agent_day5/` … `docs/agent_day10/` on build.

## Completion artifacts

| Day | Prove artifact |
|----:|----------------|
| 5 | Queue Triage Card + One-Action Commitment |
| 6 | Access Boundary Review + Role-Scope Checklist |
| 7 | Builder/Client Response Card + Translation Drill |
| 8 | AeroVista Writing Pass + Evidence-Based Rewrite |
| 9 | Deliverable Readiness Card |
| 10 | Trusted Agent Readiness Brief + Live Work Approval Checklist |

## Audio / forge (not yet run for Days 5–10)

Listen mode uses `assets/voiceover_sections.json` generated from script paragraphs. NXCore forged WAV is optional — add forge packs under `tools/narration/agent_day5/` … when ready.

**Updated:** 2026-07-10
