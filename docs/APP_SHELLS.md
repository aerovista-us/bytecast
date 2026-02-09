# ByteCast App Shells
Date: 2026-02-08

This document defines how the two shell apps work and where module ownership boundaries are enforced.

## Shell entry points
- Training Hub: `../training_hub/index.html`
- Seed Builder Studio: `../seed_builder_studio/index.html`

Both shells are orchestration layers only:
- They load `data/modules.json`
- They parse `.CODEX/bytecast_canon_map_2026-02-08.md` for status badges
- They provide launch and copy-path actions

They do not modify module internals.

## Module ownership boundaries

## Training Hub owns
- `training_hub/*`
- `training_hub/data/modules.json`

Training Hub links into:
- `aerovista_offer_pack/app/index.html`
- `lift_lab_bytecast_bundle/site/index.html`
- `docs/*`
- `episodes/*`
- `.CODEX/episode_registry.json`

## Seed Builder Studio owns
- `seed_builder_studio/*`
- `seed_builder_studio/data/modules.json`

Seed Builder Studio links into:
- `full_seed_starter/av_seedgen_python_profiles/*`
- `full_seed_starter/bytecast_ep_profile_portrait/*`
- `template/*`
- `seed_orchard_ui/*`
- `docs/SEED_STANDARD.md`
- `docs/SEED_OPTIONS.md`

## Shared governance files
- CANON map: `../.CODEX/bytecast_canon_map_2026-02-08.md`
- Migration plan: `../.CODEX/episode_content_naming_and_2app_migration_plan_2026-02-08.md`
- Episode registry: `../.CODEX/episode_registry.json`

## Operating rules
1. Add or remove module links via each shell's `data/modules.json`.
2. Keep `canon_path` values aligned to CANON map paths for status badge accuracy.
3. If a module changes class (Primary, Legacy, Duplicate, Archive), update CANON map first.
4. Module internals remain in their own project folders and keep independent release cadence.
