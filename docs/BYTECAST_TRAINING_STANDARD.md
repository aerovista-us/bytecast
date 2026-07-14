# ByteCast training standard (canonical)

**Audience:** Authors of episodes, training missions, and Training Hub modules.  
**Companion:** [`LOOP_STANDARD.md`](./LOOP_STANDARD.md) (journey JSON + `markStepDone`), [`BYTECAST_PROOF_SCHEMA.md`](./BYTECAST_PROOF_SCHEMA.md), [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md) (Pulse → Path → Depth + content types).

## Content layer (pick first)

Before teaching mode or journey wiring, classify the artifact per product direction:

| Layer | Content types | See |
|-------|---------------|-----|
| **Pulse** | Signal (company news, briefings) | [Product direction — Content types](./BYTECAST_PRODUCT_DIRECTION.md#content-types-authoring) |
| **Path** | Lesson, How-to, Practice | Same |
| **Depth** | Handoff to another app or method | Same |

Pulse content does not require Golden Path proof. Path content follows the lesson shape below.

## Lesson shape (required)

Every training artifact MUST declare these sections (in copy or structured blocks):

1. **Objective** — One sentence: what the learner can do after this lesson.
2. **Why it matters** — Tie to workflow, quality bar, or customer/internal outcome.
3. **Teach** — Core content (audio, slides, prose, diagrams).
4. **Check** — A scored or rubric-based verification (quiz, scenario checklist, etc.). Passing the check = **understanding**.
5. **Apply** — One concrete action in-context (open X, run Y, fill Z).
6. **Prove** — Artifact the learner produces (URL, export, short text, screenshot ref) stored in step `meta` for audit.
7. **Advance** — Explicit rule for what unlocks next (which step ids + which `meta` fields).

Shells (Playlist, Training Hub) **route only**. Packs **emit** completion and proof via `ByteCastLoop.markStepDone(stepId, meta)`.

## Completion vs understanding vs proof

| Layer | Meaning |
|-------|---------|
| Completion | Lesson surface finished; step may be marked `done` only when your pack says so. |
| Understanding | Check passed; store booleans/scores in `meta`. |
| Proof | Artifact fields in `meta` for teacher review and badge `minProof`. |

Do not treat “clicked through” as understanding unless your check says so.

## Teaching modes (content-first delivery)

Choose the **teaching mode** from what the content is trying to accomplish. Objective → Advance still applies; modes only define how **Teach** and **Check** are delivered.

| Mode | When to use | Primary surfaces | Proof expectation |
|------|-------------|------------------|-------------------|
| **BriefingSync** | Stakeholder narratives, company status | Audio-synced slides (Season 1 style) | Optional completion; not a Golden Path gate |
| **GuidedAudioSlides** | Onboarding, concept lanes | MP3 + slide deck + Engage quiz | Full quiz meta on journey steps |
| **VisualHotspot** | Maps, architecture posters | Infographic + overlays | Hotspot + routing quiz |
| **ReadAloudScript** | Creative / collaboration content | Browser TTS + script + slides | Engage + written proof |
| **InteractiveScript** | Agent Day orientation (D1+) | Stepper journey + animated SVG + practice labs + quiz | Labs + engage + written proof |
| **VoiceoverSections** | Sales / revenue training | Section JSON + slides | Scenario quiz |
| **MissionLab** | Hands-on operator skills | Training mission HTML | TR-style proof bundle |
| **SeedDoProve** | Repeatable tool output | Seed Builder + Orchard | Artifact hash + publish URL |

**Rule:** Do not force Listen → Engage → Do → Prove on every pack. Use the full loop when the lesson requires demonstrated skill or a durable artifact.

Declare `teaching_mode` in `bytecast_ep_profile.json` when authoring under `episodes/`. Legacy root HTML (Shareholder Season 1) declares mode in [`data/episode_registry.json`](../data/episode_registry.json).

Live series baseline: [`CONTENT_PATTERN_MATRIX.md`](./CONTENT_PATTERN_MATRIX.md).

**Agent Day interactive shell** (pilot: Day 1): `interactives.journey_mode: "stepper"` in profile; shared JS/CSS under `assets/shared/agent_day_*.js`. Journey is one segment at a time (visual + takeaway + micro-check); **Practice** tab runs scenario labs before journey completion. See [`AGENT_DAY1_FIRST_DOOR.md`](./AGENT_DAY1_FIRST_DOOR.md).

## Journey integration

- Register steps in `data/journey_steps.json`.
- Use `unlock_requires` on a step to require **prior step `meta` fields** before the step is considered unlocked (see LOOP_STANDARD).
- Badge `minProof` must list every critical proof field for issuance.

## Templates

- Lesson (HTML/markdown): [`templates/LESSON_TEMPLATE.md`](./templates/LESSON_TEMPLATE.md)
- Module manifest row: [`templates/MODULE_METADATA_TEMPLATE.md`](./templates/MODULE_METADATA_TEMPLATE.md)
- Rubrics: [`TRAINING_RUBRICS.md`](./TRAINING_RUBRICS.md)

## Agent onboarding spine (Days 1–10)

**Required Day 1** is [`AGENT-D1` / The First Door](../episodes/the_first_door/) — operating law, doors, trust, Day 1 Readiness Note. See [`AGENT_DAY1_FIRST_DOOR.md`](./AGENT_DAY1_FIRST_DOOR.md).

**Required Day 2** is [`AGENT-D2` / Finding the Source of Truth](../episodes/finding_source_of_truth/) — authority ladder, truth labels, source checks, evidence packets. See [`AGENT_DAY2_SOURCE_OF_TRUTH.md`](./AGENT_DAY2_SOURCE_OF_TRUTH.md).

**Required Day 3** is [`AGENT-D3` / From Signal to Action](../episodes/from_signal_to_action/) — AVCC judgment chain, COS brief, P1/P2/P3, Signal-to-Action Brief. See [`AGENT_DAY3_SIGNAL_TO_ACTION.md`](./AGENT_DAY3_SIGNAL_TO_ACTION.md).

**Required Day 4** is [`AGENT-D4` / The Handoff Is the Work](../episodes/the_handoff_is_the_work/) — AeroVista Trail System, Handoff Packet structure, EOD Capsule discipline, Agent Handoff Packet drill. See [`AGENT_DAY4_HANDOFF_IS_THE_WORK.md`](./AGENT_DAY4_HANDOFF_IS_THE_WORK.md).

**Required Days 5–10** extend the spine — queue, access boundaries, builder/client experience, writing, deliverables, and trusted-agent capstone. See [`AGENT_DAYS_5_10.md`](./AGENT_DAYS_5_10.md). Source reference pack: [`episodes/gold.path/`](../episodes/gold.path/). Rebuild HTML packs: `npm run build:agent-days-5-10`.

| Day | Code | Episode |
|----:|------|---------|
| 5 | AGENT-D5 | [Working the Queue](../episodes/working_the_queue/) |
| 6 | AGENT-D6 | [Safe Access & Boundaries](../episodes/safe_access_boundaries/) |
| 7 | AGENT-D7 | [Builder & Client Experience](../episodes/builder_client_experience/) |
| 8 | AGENT-D8 | [Writing Like AeroVista](../episodes/writing_like_aerovista/) |
| 9 | AGENT-D9 | [From Draft to Deliverable](../episodes/from_draft_to_deliverable/) |
| 10 | AGENT-D10 | [Trusted Agent Capstone](../episodes/trusted_agent_capstone/) |

Legacy EP-001–EP-004 remain optional reference. Golden Path: Days 1–10 → TR-001A → Seed → badge.

**Updated:** 2026-07-10
