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
- `href` (string, required): root-relative path inside this repo (example: `episodes/welcome_to_bytecast/index.html`).
- `cta` (string, optional): button label for the primary next action.
- `depends_on` (string[], optional): step IDs that must be complete before this step unlocks.
- `complete_when` (object, optional): completion rule override.
  - `{ "type": "step_done", "id": "<stepId>" }`
  - `{ "type": "steps_all", "ids": ["a","b"] }`
  - `{ "type": "steps_any", "ids": ["a","b"] }`
  - `{ "type": "badge_has", "badge_id": "p1_golden_path_v1" }`

If `complete_when` is omitted, completion defaults to `workflow.v2.steps[step.id].done === true`.

## Badge Contract

Journeys can declare badges:

```json
{
  "id": "p1_golden_path_v1",
  "label": "P1: Golden Path",
  "requires": ["ep001_gates", "tr001_golden_path", "seed_export_v1"]
}
```

Badge issuance is local-first and stored in:

- `localStorage["bytecast.badges.v1"]`

The loop engine will mint badges when `requires` are satisfied.

## Completion API (Packs Emit, Shells Render)

Any pack can mark completion like this:

```js
const Loop = window.ByteCastLoop;
Loop.markStepDone("seed_export_v1", { artifactName: "my_seed.json" });
```

This writes:

- `localStorage["bytecast.workflow.v2.<journeyId>"]` (generic `steps` map, per journey)
- `localStorage["bytecast.workflow.v1"]` (compat flags kept in sync for older packs)

## Proof Payloads (Meta)

`meta` is free-form, but should follow a consistent shape for “proof-of-work”.

Recommended fields:

- Episode completion: `{ episodeSlug, episodeCode, gate, durationSec }`
- Training completion: `{ moduleId, missionId, checkpointsPassed }`
- Seed completion: `{ artifactName, artifactHash, filesCount, schema }`
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
