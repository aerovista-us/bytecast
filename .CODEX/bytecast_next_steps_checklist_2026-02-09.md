# ByteCast Next Steps Checklist
_Created: 2026-02-09_

This is a small, execution-oriented checklist aligned to the shipped “packs + shells” architecture.

## Fixes (now)
1. Verify Seed Builder “Seed Orchard UI Concept” opens from shell:
   - `seed_builder_studio/data/modules.json` must point to `./seed_orchard_ui/index.html`
2. Decide wrapper location (avoid duplicates):
   - Keep root `ep1/` + `ep3/` as the only wrappers
   - Retire `episodes/ep1/` and `episodes/ep3/` redirect-only folders when safe
3. Decide Training Hub duplication:
   - Prefer root `training_hub/` as source of truth
   - Treat `lift_lab_bytecast_bundle/training_hub/` as a duplicate copy (keep for now, retire later)

## Governance sync (every structural change)
1. CANON map update:
   - `.CODEX/bytecast_canon_map_2026-02-08.md`
2. Episode registry update:
   - `.CODEX/episode_registry.json`
3. Root doors update (links + icons only):
   - `index.html`

## Orchard readiness (later, but planned)
Orchard lane is connector-only:
- stage view: Seed -> Signal -> Scale -> Drop
- handoff view: who owns next action + what file is output
- validation view: quality gates from `docs/SEED_STANDARD.md`

When Orchard becomes a real pack:
- Promote it to its own top-level folder (e.g. `seed_orchard_ui/`)
- Keep it linked from Seed Builder shell (do not move it into Training Hub or ByteCast App)

