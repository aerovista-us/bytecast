# ByteCast Site Map (GitHub Pages)
Base: `https://aerovista-us.github.io/bytecast/`

**Product direction:** Employee home is consolidating on Training Hub (`episodes/training_hub/`). See [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md).

This is a reference map of the runnable pages (packs + shells) in the `bytecast/` workspace.

## Primary doors

| Area | Repo path | GitHub Pages URL | Lane |
|---|---|---|---|
| Workspace entry (sacred indexer) | `index.html` | `https://aerovista-us.github.io/bytecast/` | Doors + journey only |
| ByteCast App (launcher) | `seed_bytecast.html` | `https://aerovista-us.github.io/bytecast/seed_bytecast.html` | Episode discovery + resume + progress |
| Training Hub (shell) | `episodes/training_hub/index.html` | `https://aerovista-us.github.io/bytecast/episodes/training_hub/index.html` | Onboarding + module routing |
| Seed Builder Studio (shell) | `episodes/seed_builder_studio/index.html` | `https://aerovista-us.github.io/bytecast/episodes/seed_builder_studio/index.html` | Tooling + generator routing |

## Local run (Docker Compose)

From the `bytecast/` repo root: `docker compose up` â†’ [http://localhost:8080](http://localhost:8080). See [DOCKER_COMPOSE.md](./DOCKER_COMPOSE.md).

## Episodes (publishable packs)

Source of truth: `data/episode_registry.json` (synced to `.CODEX/episode_registry.json`)

| Episode | Repo path | GitHub Pages URL | Notes |
|---|---|---|---|
| EP-001 | `episodes/welcome_to_bytecast/index.html` | `https://aerovista-us.github.io/bytecast/episodes/welcome_to_bytecast/index.html` | Audio: `assets/welcome_to_bytecast.mp3` (fallback: `assets/welcome_to_bytecast.aac`) |
| EP-002 | `episodes/aerovista_7_division_overview/index.html` | `https://aerovista-us.github.io/bytecast/episodes/aerovista_7_division_overview/index.html` | Pulls Offer Pack JSON; audio: `assets/bytecast-ep2.mp3` (fallback: `aerovista_7_division_overview.aac`) |
| EP-003 | `episodes/the_main_doors/index.html` | `https://aerovista-us.github.io/bytecast/episodes/the_main_doors/index.html` | Full slide deck + door cheat sheet + quest/quiz from `bytecast_ep_profile.json`; animated SVG via `bytecast_slide_art.js`; placeholder audio |
| EP-004 | `episodes/current_truth_basics/index.html` | `https://aerovista-us.github.io/bytecast/episodes/current_truth_basics/index.html` | ACOS / SOT / domain ownership slides + reference strip + five-question quiz; animated SVG; placeholder audio |
| EP-EOS | `episodes/eos_2026_02_09/index.html` | `https://aerovista-us.github.io/bytecast/episodes/eos_2026_02_09/index.html` | EoS recap pack; audio placeholder at `assets/audio_placeholder.wav` |
| ART-EP-0..4 | `episodes/art_localized_ep0/index.html` â€¦ `episodes/art_localized_ep4/index.html` | `https://aerovista-us.github.io/bytecast/episodes/art_localized_ep0/index.html` | Journey `art_localized_training` in `data/journey_steps.json`; wrapper pages forward to `episodes/Art.Localized/...`; listen mode uses browser read-aloud (no bundled MP3) |
| EP-005 | `episodes/contributor.onboarding/index.html` | `https://aerovista-us.github.io/bytecast/episodes/contributor.onboarding/index.html` | Contributor onboarding hub and supporting docs/pages after the folder move to `episodes/contributor.onboarding/` |
| CO-EP-0..4 | `episodes/contributor_onboarding_ep0/index.html` â€¦ `episodes/contributor_onboarding_ep4/index.html` | `https://aerovista-us.github.io/bytecast/episodes/contributor_onboarding_ep0/index.html` | Journey `contributor_onboarding_training` in `data/journey_steps.json`; wrapper pages forward to `episodes/contributor.onboarding/...`; listen mode uses browser read-aloud (no bundled MP3) |
| EP-LUM-101..106 | `episodes/lumina_rev_101/index.html` â€¦ `episodes/lumina_rev_106/index.html` | `https://aerovista-us.github.io/bytecast/episodes/lumina_rev_101/index.html` | Journey `lumina_revenue_v1`; six-part Lumina revenue lane that feeds `TR-LUM-001`. |
| EP-IG-001 | `episodes/av_ecosystem_map_pilot/index.html` | `https://aerovista-us.github.io/bytecast/episodes/av_ecosystem_map_pilot/index.html` | Infographic overlay pilot based on `AV_AppEchosystemMap.png`. |
| S1-EP-01..06 | `episodes/shareholder_s1_ep01/index.html` … `episodes/shareholder_s1_ep06/index.html` | `https://aerovista-us.github.io/bytecast/episodes/shareholder_s1_ep01/index.html` | Shareholder Season 1 briefings (`BriefingSync`); redirect to legacy root players. Portal: `bytecast-season1.html`. **Not** Day 1 EP-001–004. |

**Shareholder Season 1 portal:** `bytecast-season1.html` — journey `shareholder_season1_v1` (optional, no Golden Path gate).

Runtime-safe registry mirror (used by Playlist):
- `data/episode_registry.json`

Journey loop config (used by Playlist/Hub/Seeder CTAs):
- `data/journey_steps.json`

**Default Golden Path (Day 1):** journey id `p1_golden_path` â†’ EP-001â€“004 â†’ **TR-001A** (`episodes/training_missions/tr_001a_day1_foundations/`) â†’ Seed Orchard â†’ badge. See [`docs/DAY1_PACK_BLUEPRINT.md`](./DAY1_PACK_BLUEPRINT.md).

**The Art Localized â€” Training:** journey id `art_localized_training` â†’ ART-EP-0..4 (`episodes/art_localized_ep0/index.html` onward). Activate from the Playlist (â€œThe Art Localized â€” Trainingâ€) so the journey map and `Continue Learning` target the correct steps. Episodes now use browser read-aloud controls backed by the source pack scripts under `episodes/Art.Localized/`.

**Contributor Onboarding â€” Training:** journey id `contributor_onboarding_training` â†’ CO-EP-0..4 (`episodes/contributor_onboarding_ep0/index.html` onward). Wrapper pages forward to the moved source folder under `episodes/contributor.onboarding/`, and the pack uses browser read-aloud plus animated SVG slides.

## Training Hub modules (linked packs)

Manifest: `training_hub/data/modules.json`

| Module | Repo path | GitHub Pages URL |
|---|---|---|
| Golden Path Playlist Start | `seed_bytecast.html` | `https://aerovista-us.github.io/bytecast/seed_bytecast.html` |
| Offer Pack App | `episodes/aerovista_offer_pack/app/index.html` | `https://aerovista-us.github.io/bytecast/episodes/aerovista_offer_pack/app/index.html` |
| Lift Lab Training Site | `lift_lab_bytecast_bundle/site/index.html` | `https://aerovista-us.github.io/bytecast/lift_lab_bytecast_bundle/site/index.html` |
| TR-001A Day 1 Foundations | `episodes/training_missions/tr_001a_day1_foundations/index.html` | `https://aerovista-us.github.io/bytecast/episodes/training_missions/tr_001a_day1_foundations/index.html` |
| TR-001 Golden Path (legacy) | `episodes/training_missions/tr_001_golden_path/index.html` | `https://aerovista-us.github.io/bytecast/episodes/training_missions/tr_001_golden_path/index.html` |
| DispatchFlow Revenue Routing Lab | `episodes/training_missions/dispatchflow_sales_workbook.html` | `https://aerovista-us.github.io/bytecast/episodes/training_missions/dispatchflow_sales_workbook.html` |
| Revenue Engine Training | `episodes/revenue_engine_training/index.html` | `https://aerovista-us.github.io/bytecast/episodes/revenue_engine_training/index.html` |
| Lumina Revenue Lane Start | `episodes/lumina_rev_101/index.html` | `https://aerovista-us.github.io/bytecast/episodes/lumina_rev_101/index.html` |
| TR-LUM-001 Revenue Routing Mission | `episodes/training_missions/tr_lum_001_revenue_routing/index.html` | `https://aerovista-us.github.io/bytecast/episodes/training_missions/tr_lum_001_revenue_routing/index.html` |
| SEED-LUM-001 Lumina Sales Brief | `episodes/seed_builder_studio/lumina_sales_brief/index.html` | `https://aerovista-us.github.io/bytecast/episodes/seed_builder_studio/lumina_sales_brief/index.html` |
| AV Apparel Onboarding Start | `episodes/av_apparel_ep1_welcome/index.html` | `https://aerovista-us.github.io/bytecast/episodes/av_apparel_ep1_welcome/index.html` |
| The Art Localized Start | `episodes/art_localized_ep0/index.html` | `https://aerovista-us.github.io/bytecast/episodes/art_localized_ep0/index.html` |
| Contributor Onboarding Hub | `episodes/contributor.onboarding/index.html` | `https://aerovista-us.github.io/bytecast/episodes/contributor.onboarding/index.html` |
| Contributor Onboarding Episodes | `episodes/contributor_onboarding_ep0/index.html` | `https://aerovista-us.github.io/bytecast/episodes/contributor_onboarding_ep0/index.html` |
| AV Ecosystem Map Pilot | `episodes/av_ecosystem_map_pilot/index.html` | `https://aerovista-us.github.io/bytecast/episodes/av_ecosystem_map_pilot/index.html` |
| Shareholder Season 1 Portal | `bytecast-season1.html` | `https://aerovista-us.github.io/bytecast/bytecast-season1.html` |
| S1-EP-01 Briefing | `episodes/shareholder_s1_ep01/index.html` | `https://aerovista-us.github.io/bytecast/episodes/shareholder_s1_ep01/index.html` |
| ByteCasts Making of AV | `episodes/bytecasts_making_of_av/index.html` | `https://aerovista-us.github.io/bytecast/episodes/bytecasts_making_of_av/index.html` |
| ByteCast AeroVista Story Site | `episodes/bytecast_aerovista_story_site/index.html` | `https://aerovista-us.github.io/bytecast/episodes/bytecast_aerovista_story_site/index.html` |
| Docs index | `docs/README.md` | `https://aerovista-us.github.io/bytecast/docs/README.md` |
| Episodes index | `episodes/README.md` | `https://aerovista-us.github.io/bytecast/episodes/README.md` |
| Episode registry (runtime mirror) | `data/episode_registry.json` | `https://aerovista-us.github.io/bytecast/data/episode_registry.json` |
| Journey loop config | `data/journey_steps.json` | `https://aerovista-us.github.io/bytecast/data/journey_steps.json` |

**Sales training mission ladder:** `episodes/training_missions/dispatchflow_sales_workbook.html` is the current gameified lab for the sales offer ladder. It trains reps to identify when `Training Hub` should lead as the entry offer, when `DispatchFlow` is the primary offer, when `Visibility Layer` is the upsell, and when the prospect should be rerouted instead of forced into the ladder.

## Seed Builder modules (linked packs)

Manifest: `seed_builder_studio/data/modules.json`

| Module | Repo path | GitHub Pages URL |
|---|---|---|
| Profiles Generator (README) | `full_seed_starter/av_seedgen_python_profiles/README.md` | `https://aerovista-us.github.io/bytecast/full_seed_starter/av_seedgen_python_profiles/README.md` |
| Episode Template Baseline | `template/index.html` | `https://aerovista-us.github.io/bytecast/template/index.html` |
| Seed Orchard UI (concept) | `episodes/seed_builder_studio/seed_orchard_ui/index.html` | `https://aerovista-us.github.io/bytecast/episodes/seed_builder_studio/seed_orchard_ui/index.html` |
| Portrait Template Variant | `full_seed_starter/bytecast_ep_profile_portrait/index.html` | `https://aerovista-us.github.io/bytecast/full_seed_starter/bytecast_ep_profile_portrait/index.html` |
| Seed Standard | `docs/SEED_STANDARD.md` | `https://aerovista-us.github.io/bytecast/docs/SEED_STANDARD.md` |
| Seed Options | `docs/SEED_OPTIONS.md` | `https://aerovista-us.github.io/bytecast/docs/SEED_OPTIONS.md` |

## Other notable packs

| Area | Repo path | GitHub Pages URL | Lane |
|---|---|---|---|
| Lift Lab bundle launcher | `lift_lab_bytecast_bundle/seed_bytecast.html` | `https://aerovista-us.github.io/bytecast/lift_lab_bytecast_bundle/seed_bytecast.html` | Bundle-local redirect/launcher |
| Template baseline | `template/index.html` | `https://aerovista-us.github.io/bytecast/template/index.html` | Canon episode starter |
| Mobile player prototypes | `assets/prototypes/mobile-player-*.html` | `https://aerovista-us.github.io/bytecast/assets/prototypes/` | Reference UX only — see `docs/PLAYER_UX.md` |
| Shareholder Season 1 portal | `bytecast-season1.html` | `https://aerovista-us.github.io/bytecast/bytecast-season1.html` | Side lane briefings (not Golden Path) |

## Founder / internal surfaces

| Area | Repo path | GitHub Pages URL | Lane |
|---|---|---|---|
| Founder portfolio board (external SOT) | `D:\SOT\ops-dashboard.html` | `n/a (local SOT / shell-mounted surface)` | Primary founder portfolio app with screenshots, catalog cards, and runtime rollups |
| Founder companion map | `founders-map_v6.html` | `https://aerovista-us.github.io/bytecast/founders-map_v6.html` | Repo-local runtime and domain reference map |

## Compatibility wrappers (temporary)

These exist to avoid dead links until the 2026-03-08 review window.

| Wrapper | Repo path | GitHub Pages URL | Canon target |
|---|---|---|---|
| `ep1` | `ep1/index.html` | `https://aerovista-us.github.io/bytecast/ep1/index.html` | `episodes/welcome_to_bytecast/` |
| `ep3` | `ep3/index.html` | `https://aerovista-us.github.io/bytecast/ep3/index.html` | `episodes/aerovista_7_division_overview/` |

## Retired compatibility paths

These paths are no longer active content homes. They remain only as reference notices for older bookmarks.

| Retired path | Canonical target | Notes |
|---|---|---|
| `bytecasts_making_of_av/index.html` | `episodes/bytecasts_making_of_av/index.html` | Legacy snippets and alternate page experiments are retained under the canonical episode folder as reference-only material. |

## Governance / reference

| Doc | Repo path | GitHub Pages URL |
|---|---|---|
| CANON map | `.CODEX/bytecast_canon_map_2026-02-08.md` | `https://aerovista-us.github.io/bytecast/.CODEX/bytecast_canon_map_2026-02-08.md` |
| Migration plan | `.CODEX/episode_content_naming_and_2app_migration_plan_2026-02-08.md` | `https://aerovista-us.github.io/bytecast/.CODEX/episode_content_naming_and_2app_migration_plan_2026-02-08.md` |
| System manual | `.CODEX/bytecast_system_manual_2026-02-09.md` | `https://aerovista-us.github.io/bytecast/.CODEX/bytecast_system_manual_2026-02-09.md` |
| Analytics standard | `.CODEX/umami_analytics_standard_2026-02-09.md` | `https://aerovista-us.github.io/bytecast/.CODEX/umami_analytics_standard_2026-02-09.md` |
| Episode registry (builder) | `.CODEX/episode_registry.json` | `https://aerovista-us.github.io/bytecast/.CODEX/episode_registry.json` |
| Loop standard | `docs/LOOP_STANDARD.md` | `https://aerovista-us.github.io/bytecast/docs/LOOP_STANDARD.md` |
| Platform status | `docs/PLATFORM_STATUS.md` | `https://aerovista-us.github.io/bytecast/docs/PLATFORM_STATUS.md` |
| Session handoff (2026-07-07) | `docs/HANDOFF_2026-07-07.md` | `https://aerovista-us.github.io/bytecast/docs/HANDOFF_2026-07-07.md` |
| Docs portal (HTML) | `docs/index.html` | `https://aerovista-us.github.io/bytecast/docs/index.html` |
| Teacher / reviewer hub | `docs/teacher_review.html` | `https://aerovista-us.github.io/bytecast/docs/teacher_review.html` |
| Proof review (paste JSON) | `docs/proof_review.html` | `https://aerovista-us.github.io/bytecast/docs/proof_review.html` |
| Archived docs index | `docs/archived/README.md` | `https://aerovista-us.github.io/bytecast/docs/archived/README.md` |
| JSON validation schemas | `docs/schemas/*.schema.json` | `https://aerovista-us.github.io/bytecast/docs/schemas/` |
| Content pattern matrix | `docs/CONTENT_PATTERN_MATRIX.md` | `https://aerovista-us.github.io/bytecast/docs/CONTENT_PATTERN_MATRIX.md` |




