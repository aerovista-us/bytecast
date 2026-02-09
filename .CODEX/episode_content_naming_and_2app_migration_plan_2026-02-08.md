# Episode Content Naming + 2-App Migration Plan
_Created: 2026-02-08_

## Goal
Move from numeric episode folders (`ep1`, `ep2`, `ep3`) to content-based naming, while establishing the agreed 2-app model:

1. `training_hub` (learning + onboarding + contributor workflows)
2. `seed_builder_studio` (seed/template/generator workflows)

Do this without breaking current runnable content.

## Migration Progress
1. Phase 0: Completed
2. Phase 1: Completed
3. Phase 2: Completed
4. Phase 3: Completed
5. Phase 4: Completed

---

## Guiding Rules
1. Folder names should reflect episode content, not release order.
2. `episode.code` in JSON remains the ordering/version signal (e.g., `EP-001`, `EP-002`).
3. Migration must be non-breaking: existing links continue to work until cutover is complete.
4. Keep episode packs portable and independently publishable.

---

## Target Naming Standard

## Episode folder pattern
`episodes/<content_slug>/`

Examples:
- `episodes/welcome_to_bytecast`
- `episodes/aerovista_7_division_overview`
- `episodes/seed_playbook`

## Required metadata (inside each `bytecast_ep_profile.json`)
- `episode.code` (sequence/version marker)
- `episode.title` (human-readable)
- `episode.date`
- `content.tags`

## Slug rules
1. lower-case
2. words separated by `_`
3. no punctuation
4. describe topic, not number

---

## Proposed Mapping (Current -> Target)
1. `ep1` -> `episodes/welcome_to_bytecast`
2. `ep3` (contains EP-002 content) -> `episodes/aerovista_7_division_overview`
3. `ep2` (empty) -> retire after migration validation

Note:
- Keep `ep1` and `ep3` as compatibility wrappers during transition.

---

## 2-App Target Shape

## App A: Training Hub
Combine:
- `aerovista_offer_pack`
- `lift_lab_bytecast_bundle`
- `docs` (indexed/shared docs layer)

Purpose:
- onboarding, contributor pathways, training content, mission/task progress.

## App B: Seed Builder Studio
Combine:
- `full_seed_starter`
- `template`
- `seed_builder_studio/seed_orchard_ui` (current location)

Purpose:
- generate, customize, and package seed/episode outputs.

## Keep Separate
- `episodes/*` outputs (publishable content packs)
- root `assets` support folder
- ByteCast App launcher: `seed_bytecast.html` (episode discovery/resume)
- Workspace indexer: `index.html` (sacred “doors + journey” page)

---

## Phased Execution Plan

## Phase 0 - Prep (no behavior changes)
1. Add canonical episode index file:
   - `.CODEX/episode_registry.json`
   - includes slug, title, code, source path, status.
2. Freeze creation of new numeric folders (`epN`).
3. Define and publish slug naming rules in docs.

Acceptance:
- New episodes are planned by slug in registry before folder creation.

## Phase 1 - Create New Episode Paths
1. Create `episodes/` root.
2. Copy current episode packs into slug-based folders.
3. Keep original `ep1` and `ep3` folders intact for compatibility.

Acceptance:
- Old and new paths both run locally.
- Episode JSON content matches source.

## Phase 2 - Compatibility + Routing
1. Convert old `ep1`/`ep3` roots to simple launchers or readme notices pointing to `episodes/<slug>`.
2. Update docs references to new slug paths.
3. Keep compatibility stubs for one full cycle.

Acceptance:
- Existing bookmarks do not dead-end.
- New documentation only references slug-based episode paths.

## Phase 3 - 2-App Consolidation (Shell First)
1. Create app shells (no deep rewrites yet):
   - `training_hub/`
   - `seed_builder_studio/`
2. Add module manifest files:
   - `training_hub/data/modules.json`
   - `seed_builder_studio/data/modules.json`
3. `training_hub` modules (link-orchestrate only):
   - `aerovista_offer_pack/app/index.html`
   - `lift_lab_bytecast_bundle/site/index.html`
   - `docs/README.md`
   - `episodes/README.md` + `.CODEX/episode_registry.json`
4. `seed_builder_studio` modules (link-orchestrate only):
   - `full_seed_starter/av_seedgen_python_profiles/README.md`
   - `template/index.html`
   - `seed_builder_studio/seed_orchard_ui/index.html`
   - `docs/SEED_STANDARD.md` + `docs/SEED_OPTIONS.md`
5. Add shared shell capabilities in both apps:
   - consistent top navigation
   - module cards with status badges from CANON map
   - quick launch links + path copy buttons
6. Keep original module internals untouched in this phase.

### Phase 3 deliverables
1. `training_hub/index.html`, `training_hub/app.js`, `training_hub/styles.css`
2. `seed_builder_studio/index.html`, `seed_builder_studio/app.js`, `seed_builder_studio/styles.css`
3. module manifest JSON files for both shells
4. docs update describing shell usage and module ownership boundaries

Acceptance:
- Both apps are runnable and act as clear entry points.
- Existing project internals remain stable.
- No module path rewrite required to launch modules.

### Phase 3 status update (2026-02-08)
1. `training_hub` shell scaffold is created:
   - `training_hub/index.html`
   - `training_hub/styles.css`
   - `training_hub/app.js`
   - `training_hub/data/modules.json`
2. `seed_builder_studio` shell scaffold is created:
   - `seed_builder_studio/index.html`
   - `seed_builder_studio/styles.css`
   - `seed_builder_studio/app.js`
   - `seed_builder_studio/data/modules.json`
3. Both shells now support:
   - top navigation parity
   - module cards with CANON-derived class badges
   - quick launch links and path copy buttons
   - filtering by class and category
4. Ownership and shell boundaries documented in:
   - `docs/APP_SHELLS.md`

## Phase 4 - Cleanup
1. Retire empty `ep2`.
2. Retire duplicate generator folders in `full_seed_starter` (`(2)` variants) after parity checks.
3. Update `.CODEX/bytecast_canon_map_2026-02-08.md` to reflect final canonical state.

### Phase 4 execution plan (drafted 2026-02-08)
1. `ep2` retirement checklist:
   - verify no docs, scripts, or shell manifests reference `ep2`
   - move `ep2` to archive or remove folder after zero-reference check
   - update registry placeholder entry status from `placeholder` to `retired` (or remove entry)
2. Duplicate generator parity checklist:
   - compare `full_seed_starter/av_seedgen_python` vs `full_seed_starter/av_seedgen_python (2)`
   - compare `full_seed_starter/av_seedgen_python_profiles` vs `full_seed_starter/av_seedgen_python_profiles (2)`
   - preserve unique files, then remove duplicate folders with `(2)` suffix
3. Canon synchronization checklist:
   - reclassify retired paths in CANON map
   - confirm shell `canon_path` keys still map correctly after cleanup
   - publish updated CANON map date and cleanup notes in end-of-session report
4. Compatibility wrapper review:
   - set review date for `ep1` and `ep3` wrapper retirement decision after one cycle
   - keep wrappers until review complete to avoid dead links

### Phase 4 status update (2026-02-08)
1. `ep2` retirement executed:
   - zero-reference audit run for path usage
   - `ep2` moved to `_archive/phase4_retired_2026-02-08/ep2`
   - `.CODEX/episode_registry.json` updated (`status: retired`)
2. Duplicate folder parity checks executed:
   - `full_seed_starter/av_seedgen_python` vs `full_seed_starter/av_seedgen_python (2)` -> identical (hash parity)
   - `full_seed_starter/av_seedgen_python_profiles` vs `full_seed_starter/av_seedgen_python_profiles (2)` -> identical (hash parity)
3. Duplicate retirement executed:
   - moved to `_archive/phase4_retired_2026-02-08/av_seedgen_python (2)`
   - moved to `_archive/phase4_retired_2026-02-08/av_seedgen_python_profiles (2)`
4. CANON map synchronized:
   - duplicates reclassified from `Duplicate` to archived retired paths
   - `ep2` reclassified as archived retired path
   - wrapper review date set for `ep1` and `ep3`: 2026-03-08

Acceptance:
- No duplicate canonical sources.
- Canon map and filesystem agree.

---

## Risk Controls
1. Use copy-first, delete-later migration.
2. Validate each migrated episode with:
   - profile JSON parse
   - local server launch
   - audio path check
3. Only remove legacy paths after one confirmed review cycle.

---

## Immediate Next 5 Actions (post-Phase 4 cleanup)
1. Launch both shells via local server and verify all module links open.
2. Keep compatibility wrappers (`ep1`, `ep3`) until review date 2026-03-08.
3. Plan `av_seedgen_python_umami` feature merge into `av_seedgen_python_profiles`.
4. Keep `_archive/phase4_retired_2026-02-08` read-only until compatibility cycle end.
5. On 2026-03-08, decide final removal of wrappers and retired archive.
