# ByteCast System Manual (Standalone Packs + Thin Shells)
_Created: 2026-02-09_

## One sentence
ByteCast stays future-proof by shipping everything as standalone packs and connecting them only through thin orchestration shells and governance files.

## The rule set (non-negotiable)
1. Packs are independent: no cross-imports, no shared runtime coupling.
2. Shells orchestrate only: they link to packs; they do not modify pack internals.
3. Episodes are slug-based: `episodes/<content_slug>/` is canon; numeric `epN` creation is frozen.
4. Root index is sacred: it explains the journey and links the doors; no deep logic.
5. Governance lives in `.CODEX`: CANON map + registry + migration plan are source of truth for structure.

## What is a “pack”
A pack is a folder you can copy anywhere and it still works when served statically.

Examples:
- Episode pack: `episodes/welcome_to_bytecast/`
- Training pack: `lift_lab_bytecast_bundle/site/`
- Content app pack: `aerovista_offer_pack/app/`
- Generator/toolkit pack: `full_seed_starter/av_seedgen_python_profiles/`

## What is a “shell”
A shell is a UI router with a manifest. It shows status, filters, and launches packs.

Shells in this workspace:
- Training Hub shell: `training_hub/`
- Seed Builder Studio shell: `seed_builder_studio/`

Shell operating rules:
- All modules must live in `data/modules.json`.
- `canon_path` must match a CANON map path for accurate status badges.

## The “ByteCast -> Training -> Seeder -> Badge” flow
This is the intended user journey (it must remain obvious in root entry and shells):
1. ByteCast cycle (content): listen -> slide -> interact
2. Training cycle (alignment): onboarding + tasks + reference modules
3. Seeder cycle (real work): generate / package / export
4. Badge (proof): completion marker that can be verified and cannot be “faked” by UI clicks alone

## Canon lanes (what owns what)
Episodes (publishable content):
- Own: player + slides + quest/quiz for that one episode
- Path: `episodes/<slug>/`

ByteCast App launcher (discovery/resume):
- Own: episode discovery, resume, progress overview
- Path: `seed_bytecast.html`

Training Hub shell (navigation + progress):
- Own: module routing, training modules index, local progress display
- Path: `training_hub/`

Seed Builder Studio shell (tool access):
- Own: routing to generator/toolkits/templates and seed standards
- Path: `seed_builder_studio/`

Offer Pack (business/training content system):
- Own: divisions/offers/pricing/SOP content system
- Path: `aerovista_offer_pack/app/`

Lift Lab bundle (curriculum experience):
- Own: non-coder onboarding site and training content bundle
- Path: `lift_lab_bytecast_bundle/site/`

Orchard (connector, not a hub replacement):
- Own: seed pipeline stages, handoffs, validation, packaging checkpoints
- Current path: `seed_builder_studio/seed_orchard_ui/` (concept)

## Compatibility policy (wrappers + archive)
- Root `ep1/` and `ep3/` are compatibility stubs through 2026-03-08.
- `_archive/phase4_retired_2026-02-08/` stays read-only until the same review window.

## Where to update when structure changes
1. Update CANON map:
   - `.CODEX/bytecast_canon_map_2026-02-08.md`
2. Update registry:
   - `.CODEX/episode_registry.json`
3. Update shell manifests:
   - `training_hub/data/modules.json`
   - `seed_builder_studio/data/modules.json`
4. Update root doors (links only):
   - `index.html`

