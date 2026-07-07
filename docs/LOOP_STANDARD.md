# ByteCast Loop Standard (Config-Driven Journey)

This workspace uses a **config-driven loop** so you can add/remove/reorder steps by editing JSON only.

- Config: `data/journey_steps.json`
- Loop engine: `assets/shared/bytecast_loop.js`
- Shared UI renderer: `assets/shared/bytecast_loop_ui.js`

## Goals

- Packs are standalone: no imports, no runtime coupling.
- Shells (Playlist/Training/Seeder) only **render status + route** using config.
- Packs only **emit completion** by calling `ByteCastLoop.markStepDone(stepId, meta)`.

## Step Object Contract

Each journey has a `steps` array. Each step object supports:

- `id` (string, required): stable step identifier. Never reuse an ID for a different meaning.
- `label` (string, required): human-readable name.
- `lane` (string, optional): `bytecast | training | seed | badge` (used for colors).
- `group` (string, optional): UI section name (used for collapse and readability).
- `order` (number, optional): sort key (engine + UI); lower means earlier.
- `estimatedMinutes` (number, optional): UI-only estimate.
- `href` (string, required): root-relative path inside this repo (example: `episodes/welcome_to_bytecast/index.html`).
- `cta` (string, optional): button label for the primary next action.
- `depends_on` (string[], optional): step IDs that must be complete before this step unlocks.
- `unlock_requires` (object[], optional): additional **proof gates** before the step is treated as unlocked (Training Hub map, Playlist next-step, `getNextStep`, etc.). Each entry: `{ "stepId": "<id>", "meta_fields": ["fieldA", "fieldB"] }`. The engine uses the same presence rules as badge `minProof` (non-empty strings, `true` for booleans, finite numbers).
- `complete_when` (object, optional): completion rule override.
  - `{ "type": "step_done", "id": "<stepId>" }`
  - `{ "type": "steps_all", "ids": ["a","b"] }`
  - `{ "type": "steps_any", "ids": ["a","b"] }`
  - `{ "type": "badge_has", "badge_id": "p1_golden_path_v1" }`

If `complete_when` is omitted, completion defaults to `workflow.v2.steps[step.id].done === true`.

## Proof bundle export (teacher review)

- `ByteCastLoop.buildProofBundle(journeyId?)` returns JSON: `{ schema, exportedAt, journeyId, workflow, badges, projects }` (`bytecast-proof-bundle-v1`). `projects` is an optional dated workstream list (onboarding, collaboration, etc.); see [`BYTECAST_PROOF_SCHEMA.md`](./BYTECAST_PROOF_SCHEMA.md) and [`proof_bundle_v1.schema.json`](./proof_bundle_v1.schema.json).
- Teachers paste that JSON into [`proof_review.html`](./proof_review.html) (Docs Portal).

## Meta validation helper

- `ByteCastLoop.proofMetaOk(wf2, stepId, fields)` → `{ ok, missing }` for rubrics and custom UI.

## Badge Contract

Journeys can declare badges:

```json
{
  "id": "p1_golden_path_v1",
  "label": "P1: Golden Path",
  "requires": [
    "ep001_gates",
    "ep002_gates",
    "ep003_gates",
    "ep004_gates",
    "tr001a_day1_foundations",
    "seed_export_v1",
    "seed_publish_v1"
  ],
  "minProof": {
    "ep001_engage": ["engageQuizPassed", "engageQuizScore"],
    "ep002_engage": ["engageQuizPassed", "engageQuizScore"],
    "ep003_engage": ["engageQuizPassed", "engageQuizScore"],
    "ep004_engage": ["engageQuizPassed", "engageQuizScore"],
    "tr001a_day1_foundations": [
      "mission",
      "understandingCheckPassed",
      "tr001aQuizPassed",
      "tr001aQuizScore",
      "tr001aWritten1",
      "tr001aWritten2",
      "tr001aScenarioRouting",
      "tr001aCompletedAt"
    ],
    "seed_export_v1": ["artifactName", "artifactHash"],
    "seed_publish_v1": ["publishedUrl"]
  }
}
```

Badge issuance is local-first and stored in:

- `localStorage["bytecast.badges.v1"]`

The loop engine will mint badges when `requires` are satisfied.

## Completion API (Packs Emit, Shells Render)

Any pack can mark completion like this:

```js
const Loop = window.ByteCastLoop;
Loop.markStepDone("seed_export_v1", { artifactName: "my_seed_pack.zip" });
```

This writes:

- `localStorage["bytecast.workflow.v2.<journeyId>"]` (generic `steps` map, per journey)
- `localStorage["bytecast.workflow.v1"]` (compat flags kept in sync for older packs)

## Proof Payloads (Meta)

`meta` is free-form, but should follow a consistent shape for “proof-of-work”.

Recommended fields:

- Episode completion: `{ episodeSlug, episodeCode, gate, durationSec }`
- Training completion: `{ moduleId, missionId, checkpointsPassed }`
- Seed completion: `{ artifactName, artifactHash, filesCount, schema, artifactType, packSchemaVersion, templateHash, profilePath }`
- Publish completion: `{ publishedUrl, publishedAt }`
- Badge: `{ badgeId, mintedAt, journeyId }`

## Workflow Storage Versions

- `bytecast.workflow.v1` = legacy fields used by older packs and early shells.
- `bytecast.journey.active` = active journey id selected by the picker.
- `bytecast.workflow.v2.<journeyId>` = canonical future format (per-journey):
  - `steps` map: `{ [stepId]: { done, doneAt, updatedAt, meta } }`

`assets/shared/bytecast_loop.js` maintains **v1 compatibility automatically**.
Do not delete v1 usage until all active packs have been updated and a retirement date is set.

## Adding a New Step Safely

1. Add the new pack page under a standalone folder.
2. Add a step entry in `data/journey_steps.json` pointing to the pack.
3. In the pack, call `ByteCastLoop.markStepDone("<stepId>", meta)` at the moment completion is earned.
4. Reload Playlist; the quest map should show the new step automatically.

### Example: Apparel Ops Journey

The `apparel_onboarding_v1` journey shows the full shell flow:

- Listen → Slide → Engage across three AV Apparel ByteCasts:
  - `episodes/av_apparel_ep1_welcome/index.html` (EP-APP-001)
  - `episodes/av_apparel_ep2_catalog/index.html` (EP-APP-002)
  - `episodes/av_apparel_ep3_ops_standards/index.html` (EP-APP-003)
- Training:
  - `apparel_practice_fix` (practice catalog clean-up anchored in `episodes/av_apparel/workflows.md`)
  - `apparel_real_work_order` (real change request anchored in `episodes/av_apparel/onboarding.md`)
- Seed:
  - `apparel_seed_export` (Apparel-specific workflow Seed via Seed Orchard)
- Badge:
  - `apparel_ops_ready_v1` badge once all gates + practice + work order + seed are complete.

Each ByteCast emits:

```js
ByteCastLoop.markStepDone("epapp1_listen", { episodeSlug: "av_apparel_ep1_welcome", episodeCode: "EP-APP-001", gate: "listen" });
ByteCastLoop.markStepDone("epapp1_slide",  { episodeSlug: "av_apparel_ep1_welcome", episodeCode: "EP-APP-001", gate: "slide" });
ByteCastLoop.markStepDone("epapp1_engage", { episodeSlug: "av_apparel_ep1_welcome", episodeCode: "EP-APP-001", gate: "engage" });
```

The journey config then uses `steps_all` rules (for example, `epapp1_gates`) to keep the Quest Map simple while still giving you per-gate visibility in storage.
