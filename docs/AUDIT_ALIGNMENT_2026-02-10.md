# ByteCast Workspace Audit (Alignment + Completion Proof)

**Date:** 2026-02-10  
**Scope:** repo root `bytecast/` (GitHub Pages base `https://aerovista-us.github.io/bytecast/`)

This report verifies that the current implementation matches the locked architecture and that “completion” is backed by concrete stored state (local-first proof) rather than UI-only toggles.

## 1) Architecture Alignment (What Ships)

### Public/visitor surfaces (journey doors)
- `index.html` (Workspace Entry): doors + featured start; internal links gated.
- `seed_bytecast.html` (Playlist): episodes + quest map + next action; internal links gated.
- `training_hub/index.html` (Training Hub): quest map + module router.
- `seed_builder_studio/index.html` (Seed Builder Studio): module router.
- `docs/index.html` (Docs Portal): builder-facing governance + raw data + ops links.

### Standalone packs (emit completion; do not “own the loop”)
- Episode packs: `episodes/<slug>/index.html`
- Training pack: `training_missions/tr_001_golden_path/index.html`
- Seeder pack/app: `seed_builder_studio/seed_orchard_ui/index.html`

## 2) Source Of Truth (Loop Config)

- Journey config is runtime-facing JSON: `data/journey_steps.json`
- Episode registry is runtime-facing JSON: `data/episode_registry.json`

Evidence:
- Config declares journeys, steps, `depends_on`, `complete_when`, `badges.requires`, and `badges.minProof`.
  - `data/journey_steps.json:1`

## 3) Proof Of Completion (What “Done” Means)

### 3.1 Canonical storage (local-first)

The loop engine stores per-journey proof in `localStorage`:
- `bytecast.journey.active` = active journey id selected by the journey picker.
  - `assets/shared/bytecast_loop.js:6`
- `bytecast.workflow.v2.<journeyId>` = canonical per-journey steps map.
  - `assets/shared/bytecast_loop.js:3`
- `bytecast.badges.v1` = minted badge claims (local-first).
  - `assets/shared/bytecast_loop.js:4`

### 3.2 Completion API (packs emit; shells render)

Packs mark completion by calling:
- `ByteCastLoop.markStepDone(stepId, meta)`
  - `assets/shared/bytecast_loop.js:336`

The engine writes a v2 step record including `doneAt` and `meta`, then fires analytics:
- `step_done` event
  - `assets/shared/bytecast_loop.js:353`

### 3.3 Badge enforcement (requires + minProof)

Badges are minted only if:
- all required steps are complete, and
- any `minProof` fields are present on the required steps’ `meta`.

Evidence:
- Badge minting checks `minProof` keys and fields and calls `mintBadge()`.
  - `assets/shared/bytecast_loop.js:454`
- Guardrails warn on invalid configs (duplicate step ids; badges requiring missing steps; `minProof` referencing missing step ids).
  - `assets/shared/bytecast_loop.js:545`

## 4) Golden Path v1 (Config + Actual Emitters)

Golden Path journey config:
- `p1_golden_path` steps: `ep001_gates` -> `tr001_golden_path` -> `seed_export_v1` -> `badge_p1_golden_path_v1`.
  - `data/journey_steps.json:6`

### Step A: EP-001 gates (`ep001_gates`)

Config:
- `ep001_gates` completes when 3 sub-steps are done: `ep001_listen`, `ep001_slide`, `ep001_engage`.
  - `data/journey_steps.json:12`

Emitter (episode pack):
- EP-001 maps legacy flags to the v2 step ids and calls `Loop.markStepDone(...)`.
  - `episodes/welcome_to_bytecast/index.html:692`
  - `episodes/welcome_to_bytecast/index.html:694`

Proof shape today:
- `meta` is currently minimal (`{ episode: "EP-001" }`).
  - `episodes/welcome_to_bytecast/index.html:694`

### Step B: Training (`tr001_golden_path`)

Config:
- Depends on `ep001_gates`.
  - `data/journey_steps.json:26`

Emitter (training pack):
- TR-001 calls `Loop.markStepDone("tr001_golden_path", { mission: "tr_001_golden_path" })`.
  - `training_missions/tr_001_golden_path/index.html:315`

Proof shape today:
- `meta` includes `mission` key required by `minProof`.
  - `data/journey_steps.json:68`
  - `training_missions/tr_001_golden_path/index.html:315`

### Step C: Seed export (`seed_export_v1`)

Config:
- Depends on `tr001_golden_path`.
  - `data/journey_steps.json:37`

Emitter (Seed Orchard):
- Orchard calls `Loop.markStepDone("seed_export_v1", meta)` on export.
  - `seed_builder_studio/seed_orchard_ui/app.js:736`
  - `seed_builder_studio/seed_orchard_ui/app.js:809`

Proof shape today:
- `meta` includes artifact proof fields like `artifactName`, `artifactHash`, `filesCount`, etc.
  - `seed_builder_studio/seed_orchard_ui/app.js:736`

ZIP export (runnable pack):
- Orchard uses `fflate.zipSync` and emits a ZIP with `PACK_README.md` + `pack.manifest.json`.
  - `seed_builder_studio/seed_orchard_ui/index.html:118`
  - `seed_builder_studio/seed_orchard_ui/app.js:639`
  - `seed_builder_studio/seed_orchard_ui/app.js:706`
  - `seed_builder_studio/seed_orchard_ui/app.js:719`

### Step D: Badge (`p1_golden_path_v1`)

Config:
- Badge is minted when `requires` are satisfied and `minProof` is present.
  - `data/journey_steps.json:63`

Engine:
- `mintBadge()` writes to `bytecast.badges.v1` and fires `badge_minted`.
  - `assets/shared/bytecast_loop.js:132`
  - `assets/shared/bytecast_loop.js:137`

Playlist rendering:
- Playlist badge chips render matching SVG icons from `assets/badges/badges.json` with fallback to text.
  - `seed_bytecast.html:485`
  - `assets/badges/badges.json:2`

## 5) Multi-Journey Support (Journey Picker)

- Loop UI provides a small journey picker select.
  - `assets/shared/bytecast_loop_ui.js:270`
- Active journey selection is stored in `bytecast.journey.active`.
  - `assets/shared/bytecast_loop.js:6`

## 6) Audio Proof (EP-001 Reliability Check)

EP-001 profile declares:
- Primary mp3 path: `assets/welcome_to_bytecast.mp3`
- Optional aac fallback.
  - `episodes/welcome_to_bytecast/bytecast_ep_profile.json:26`

Files exist:
- `episodes/welcome_to_bytecast/assets/welcome_to_bytecast.mp3`
- `episodes/welcome_to_bytecast/assets/welcome_to_bytecast.aac`

Note: audio still requires serving via `http(s)` (GitHub Pages or local server) for reliable loading in all browsers.

## 7) What’s Not Fully Aligned Yet (Gaps)

1. **Publish step is not yet in the journey config.**
   - A `bc_badge_publish.svg` exists in the badge catalog, but `seed_publish_v1` is not defined in `data/journey_steps.json`.
2. **Episode/Training proof meta is minimal.**
   - EP-001 writes `{ episode: "EP-001" }`, not listened percent, duration, or gate detail.
   - TR-001 writes `{ mission: "tr_001_golden_path" }`, not checkpoints passed or duration.
3. **Badges are global-store (not per-journey).**
   - This is OK for v1, but it means badges persist across journeys (by design).

## 8) How To Verify Completion (Manual Checklist)

1. Open Playlist: `seed_bytecast.html`
2. Open DevTools -> Application -> Local Storage and verify keys appear:
   - `bytecast.journey.active`
   - `bytecast.workflow.v2.p1_golden_path`
   - `bytecast.badges.v1`
3. Complete EP-001 gates and verify `bytecast.workflow.v2.p1_golden_path` contains:
   - `steps.ep001_listen.done === true`
   - `steps.ep001_slide.done === true`
   - `steps.ep001_engage.done === true`
4. Complete TR-001 and verify:
   - `steps.tr001_golden_path.meta.mission` exists
5. Export a seed ZIP in Orchard and verify:
   - `steps.seed_export_v1.meta.artifactName` exists
   - `steps.seed_export_v1.meta.artifactHash` exists
6. Return to Playlist and confirm the badge chip appears (SVG icon if known; text fallback otherwise).

