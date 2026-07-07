# ByteCast training standard (canonical)

**Audience:** Authors of episodes, training missions, and Training Hub modules.  
**Companion:** [`LOOP_STANDARD.md`](./LOOP_STANDARD.md) (journey JSON + `markStepDone`), [`BYTECAST_PROOF_SCHEMA.md`](./BYTECAST_PROOF_SCHEMA.md).

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
| **VoiceoverSections** | Sales / revenue training | Section JSON + slides | Scenario quiz |
| **MissionLab** | Hands-on operator skills | Training mission HTML | TR-style proof bundle |
| **SeedDoProve** | Repeatable tool output | Seed Builder + Orchard | Artifact hash + publish URL |

**Rule:** Do not force Listen → Engage → Do → Prove on every pack. Use the full loop when the lesson requires demonstrated skill or a durable artifact.

Declare `teaching_mode` in `bytecast_ep_profile.json` when authoring under `episodes/`. Legacy root HTML (Shareholder Season 1) declares mode in [`data/episode_registry.json`](../data/episode_registry.json).

Live series baseline: [`CONTENT_PATTERN_MATRIX.md`](./CONTENT_PATTERN_MATRIX.md).

## Journey integration

- Register steps in `data/journey_steps.json`.
- Use `unlock_requires` on a step to require **prior step `meta` fields** before the step is considered unlocked (see LOOP_STANDARD).
- Badge `minProof` must list every critical proof field for issuance.

## Templates

- Lesson (HTML/markdown): [`templates/LESSON_TEMPLATE.md`](./templates/LESSON_TEMPLATE.md)
- Module manifest row: [`templates/MODULE_METADATA_TEMPLATE.md`](./templates/MODULE_METADATA_TEMPLATE.md)
- Rubrics: [`TRAINING_RUBRICS.md`](./TRAINING_RUBRICS.md)

## Day 1 pack alignment (onboarding spine)

The **Day 1 — Welcome, Navigation, and Current Truth** sequence (EP-001 → EP-002 → EP-003 → EP-004 → TR-001A) follows this standard end-to-end: each episode declares Objective through Advance; **Engage** quizzes write `engageQuizPassed` / `engageQuizScore` on `ep00X_engage`; TR-001A writes extended proof meta for teacher review (see `BYTECAST_PROOF_SCHEMA.md`). Shells remain routers only.

## Versioning

- Standard doc: bump **Updated** line when semantics change.
- Proof payloads: use `schema` field in bundles per `BYTECAST_PROOF_SCHEMA.md`.

**Updated:** 2026-07-06
