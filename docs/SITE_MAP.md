# ByteCast Site Map (GitHub Pages)
Base: `https://aerovista-us.github.io/bytecast/`

This is a reference map of the runnable pages (packs + shells) in the `bytecast/` workspace.

## Primary doors

| Area | Repo path | GitHub Pages URL | Lane |
|---|---|---|---|
| Workspace entry (sacred indexer) | `index.html` | `https://aerovista-us.github.io/bytecast/` | Doors + journey only |
| ByteCast App (launcher) | `seed_bytecast.html` | `https://aerovista-us.github.io/bytecast/seed_bytecast.html` | Episode discovery + resume + progress |
| Training Hub (shell) | `training_hub/index.html` | `https://aerovista-us.github.io/bytecast/training_hub/index.html` | Onboarding + module routing |
| Seed Builder Studio (shell) | `seed_builder_studio/index.html` | `https://aerovista-us.github.io/bytecast/seed_builder_studio/index.html` | Tooling + generator routing |

## Episodes (publishable packs)

Source of truth: `.CODEX/episode_registry.json`

| Episode | Repo path | GitHub Pages URL | Notes |
|---|---|---|---|
| EP-001 | `episodes/welcome_to_bytecast/index.html` | `https://aerovista-us.github.io/bytecast/episodes/welcome_to_bytecast/index.html` | Audio expected at `episodes/welcome_to_bytecast/assets/welcome_to_bytecast.aac` |
| EP-002 | `episodes/aerovista_7_division_overview/index.html` | `https://aerovista-us.github.io/bytecast/episodes/aerovista_7_division_overview/index.html` | Pulls Offer Pack JSON; audio at `episodes/aerovista_7_division_overview/aerovista_7_division_overview.aac` (optional fallback: `assets/bytecast-ep2.mp3`) |

Runtime-safe registry mirror (used by Playlist):
- `data/episode_registry.json`

## Training Hub modules (linked packs)

Manifest: `training_hub/data/modules.json`

| Module | Repo path | GitHub Pages URL |
|---|---|---|
| Offer Pack App | `aerovista_offer_pack/app/index.html` | `https://aerovista-us.github.io/bytecast/aerovista_offer_pack/app/index.html` |
| Lift Lab Training Site | `lift_lab_bytecast_bundle/site/index.html` | `https://aerovista-us.github.io/bytecast/lift_lab_bytecast_bundle/site/index.html` |
| TR-001 Golden Path Missions | `training_missions/tr_001_golden_path/index.html` | `https://aerovista-us.github.io/bytecast/training_missions/tr_001_golden_path/index.html` |
| Docs index | `docs/README.md` | `https://aerovista-us.github.io/bytecast/docs/README.md` |
| Episodes index | `episodes/README.md` | `https://aerovista-us.github.io/bytecast/episodes/README.md` |
| Episode registry (runtime mirror) | `data/episode_registry.json` | `https://aerovista-us.github.io/bytecast/data/episode_registry.json` |

## Seed Builder modules (linked packs)

Manifest: `seed_builder_studio/data/modules.json`

| Module | Repo path | GitHub Pages URL |
|---|---|---|
| Profiles Generator (README) | `full_seed_starter/av_seedgen_python_profiles/README.md` | `https://aerovista-us.github.io/bytecast/full_seed_starter/av_seedgen_python_profiles/README.md` |
| Episode Template Baseline | `template/index.html` | `https://aerovista-us.github.io/bytecast/template/index.html` |
| Seed Orchard UI (concept) | `seed_builder_studio/seed_orchard_ui/index.html` | `https://aerovista-us.github.io/bytecast/seed_builder_studio/seed_orchard_ui/index.html` |
| Portrait Template Variant | `full_seed_starter/bytecast_ep_profile_portrait/index.html` | `https://aerovista-us.github.io/bytecast/full_seed_starter/bytecast_ep_profile_portrait/index.html` |
| Seed Standard | `docs/SEED_STANDARD.md` | `https://aerovista-us.github.io/bytecast/docs/SEED_STANDARD.md` |
| Seed Options | `docs/SEED_OPTIONS.md` | `https://aerovista-us.github.io/bytecast/docs/SEED_OPTIONS.md` |

## Other notable packs

| Area | Repo path | GitHub Pages URL | Lane |
|---|---|---|---|
| Lift Lab bundle launcher | `lift_lab_bytecast_bundle/seed_bytecast.html` | `https://aerovista-us.github.io/bytecast/lift_lab_bytecast_bundle/seed_bytecast.html` | Bundle-local redirect/launcher |
| Template baseline | `template/index.html` | `https://aerovista-us.github.io/bytecast/template/index.html` | Canon episode starter |

## Compatibility wrappers (temporary)

These exist to avoid dead links until the 2026-03-08 review window.

| Wrapper | Repo path | GitHub Pages URL | Canon target |
|---|---|---|---|
| `ep1` | `ep1/index.html` | `https://aerovista-us.github.io/bytecast/ep1/index.html` | `episodes/welcome_to_bytecast/` |
| `ep3` | `ep3/index.html` | `https://aerovista-us.github.io/bytecast/ep3/index.html` | `episodes/aerovista_7_division_overview/` |

## Governance / reference

| Doc | Repo path | GitHub Pages URL |
|---|---|---|
| CANON map | `.CODEX/bytecast_canon_map_2026-02-08.md` | `https://aerovista-us.github.io/bytecast/.CODEX/bytecast_canon_map_2026-02-08.md` |
| Migration plan | `.CODEX/episode_content_naming_and_2app_migration_plan_2026-02-08.md` | `https://aerovista-us.github.io/bytecast/.CODEX/episode_content_naming_and_2app_migration_plan_2026-02-08.md` |
| System manual | `.CODEX/bytecast_system_manual_2026-02-09.md` | `https://aerovista-us.github.io/bytecast/.CODEX/bytecast_system_manual_2026-02-09.md` |
| Analytics standard | `.CODEX/umami_analytics_standard_2026-02-09.md` | `https://aerovista-us.github.io/bytecast/.CODEX/umami_analytics_standard_2026-02-09.md` |
| Episode registry (builder) | `.CODEX/episode_registry.json` | `https://aerovista-us.github.io/bytecast/.CODEX/episode_registry.json` |
