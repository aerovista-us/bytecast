# ByteCast platform status (canonical)

**Updated:** 2026-07-07  
**Purpose:** Single current snapshot for doors, episodes, journeys, training/proof, seeds, and known risks. Historical notes and Feb 2026 audits live under [`archived/`](./archived/).

**Product direction:** ByteCast is the employee operating–learning–comms spine (canonical — approved). See [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md). **Guardrail:** shareholder briefings are Pulse content, not the product identity. Implementation phased: home reframe → Pulse feed → catalog unification → handoffs.

## Public doors (learner / visitor)

| Door | Path | Current role |
|------|------|--------------|
| **Employee home (ByteCast)** | `index.html` → `episodes/training_hub/index.html` | **Primary front door** — Continue, Pulse, lifecycle sections |
| Playlist (Continue) | `seed_bytecast.html` | Resume episodes, badges, journey progress |
| Seed Builder Studio | `episodes/seed_builder_studio/index.html` | Contributor **Build** tools (not employee default) |
| Docs Portal (HTML) | `docs/index.html` | **Reference** — standards, reviewer tools |

Legacy label **Training Hub** retired in UI; path unchanged (`episodes/training_hub/`).

## Canonical runtime episodes

- **Core Day 1 spine:** `EP-001` `episodes/welcome_to_bytecast/`, `EP-002` `episodes/aerovista_7_division_overview/`, `EP-003` `episodes/the_main_doors/`, `EP-004` `episodes/current_truth_basics/`.
- **Contributor onboarding hub:** `EP-005` `episodes/contributor.onboarding/` plus wrapper pages `episodes/contributor_onboarding_ep0/` through `episodes/contributor_onboarding_ep4/`.
- **Additional active lanes:** Art Localized episodes `art_localized_ep0` through `art_localized_ep4`, AV Apparel episodes `av_apparel_ep1_welcome` through `av_apparel_ep3_ops_standards`, Lumina revenue episodes `lumina_rev_101` through `lumina_rev_106`, and **Shareholder Season 1** (`S1-EP-01` through `S1-EP-06` at `episodes/shareholder_s1_ep01/` … `shareholder_s1_ep06/`, legacy players at repo root).
- **Internal recap / non-default:** `EP-EOS` `episodes/eos_2026_02_09/` remains active, but it is not the default learner entry.

**Shareholder Season 1** is a publishable side lane (`shareholder_season1` series, `BriefingSync` teaching mode). It appears in Playlist and Training Hub but is **not** on `p1_golden_path`. Episode codes `S1-EP-04` (Portable Ecosystem) are distinct from Day 1 `EP-004` (Current Truth Basics).

**Audio gap (Season 1):** Players expect `EP01.aac`, `EP02.aac`, `EP03.aac`, `ep04.mp3`, `ep05.mp3`, `ep06.mp3` at repo root — **not yet in repo**. See [`HANDOFF_2026-07-07.md`](./HANDOFF_2026-07-07.md).

Registry mirrors:

- Runtime-safe registry: `data/episode_registry.json`
- Builder copy: `.CODEX/episode_registry.json`
- Both now carry grouped `series` metadata so Playlist and Training Hub can present each live lane as a series instead of a flat list.

## Active journeys and proof state

- **Default onboarding (Day 1):** `p1_golden_path` -> EP-001 through EP-004 -> `TR-001A` (`episodes/training_missions/tr_001a_day1_foundations/`) -> `seed_export_v1` -> `seed_publish_v1` -> badge.
- **Additional active journeys:** `seeding_v1`, `division_aerovista_v1`, `art_localized_training`, `contributor_onboarding_training`, `apparel_onboarding_v1`, `lumina_revenue_v1`, and **`shareholder_season1_v1`** (optional linear briefings, no badge, no Golden Path dependency).
- **Proof contract:** `data/journey_steps.json` uses `depends_on`, `unlock_requires`, and badge `minProof`. Engine behavior lives in `assets/shared/bytecast_loop.js`.
- **Reviewer surfaces:** [`teacher_review.html`](./teacher_review.html), [`proof_review.html`](./proof_review.html), [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md), and [`BYTECAST_PROOF_SCHEMA.md`](./BYTECAST_PROOF_SCHEMA.md).

## Training Hub and missions

- **Employee home shell:** `episodes/training_hub/index.html` (UI: **ByteCast**)
- **Pulse feed:** `data/pulse.json` — see [`PULSE_FEED.md`](./PULSE_FEED.md)
- **Manifest:** `episodes/training_hub/data/modules.json` (`lifecycle_section` on series, `home_featured` on starters)
- **Current Day 1 check:** `episodes/training_missions/tr_001a_day1_foundations/index.html`
- **Legacy Day 1 reference:** `episodes/training_missions/tr_001_golden_path/index.html`
- **Current sales lab:** `episodes/training_missions/dispatchflow_sales_workbook.html`
- **Current Lumina capstone:** `episodes/training_missions/tr_lum_001_revenue_routing/index.html`
- **Current Lumina seed handoff:** `episodes/seed_builder_studio/lumina_sales_brief/index.html`

Training Hub now explicitly surfaces registered series starts for Golden Path, Lumina Revenue, AV Apparel, The Art Localized, Contributor Onboarding, Infographic Training, **Shareholder Season 1**, Story + Context, and supporting reference tools.

## Shipping intake promotion (2026-07-06 → 2026-07-07)

- Contributor pipeline seed → `_intake/aerovista_contributor_pipeline_seed/`; JSON schemas promoted to `docs/schemas/`; shared Umami bridge at `assets/shared/umami_bridge.js`.
- Legacy Season 1 HTML registered as `shareholder_season1` side lane with `BriefingSync` teaching mode.
- **2026-07-07:** Canonical packs `episodes/shareholder_s1_ep01/` … `ep06/` (redirect to legacy root players); Playlist links fixed via registry `primary_path` update.
- Mobile player prototypes remain reference-only in `assets/prototypes/` — see [`PLAYER_UX.md`](./PLAYER_UX.md).
- Umami doc consolidated into [`SEED_OPTIONS.md`](./SEED_OPTIONS.md#analytics-umami).
- Content pattern baseline: [`CONTENT_PATTERN_MATRIX.md`](./CONTENT_PATTERN_MATRIX.md).
- Session handoff: [`HANDOFF_2026-07-07.md`](./HANDOFF_2026-07-07.md).

## Seeds and generator

- **Seed shell:** `episodes/seed_builder_studio/index.html`
- **Golden Path seeding surface:** `episodes/seed_builder_studio/seed_orchard_ui/index.html`
- **Lumina seed surface:** `episodes/seed_builder_studio/lumina_sales_brief/index.html`
- **Standards/manuals:** [`SEED_STANDARD.md`](./SEED_STANDARD.md), [`SEED_OPTIONS.md`](./SEED_OPTIONS.md), [`SEED_GENERATOR_MANUAL.md`](./SEED_GENERATOR_MANUAL.md), [`BYTECAST_TEMPLATE_MANUAL.md`](./BYTECAST_TEMPLATE_MANUAL.md)
- **Ongoing risk:** multiple generator variants still exist under `full_seed_starter/`; keep converging on one blessed profiles-capable path.

## Known legacy / reference surfaces

- `episodes/training_missions/tr_001_golden_path/` is still available for reference, but `TR-001A` is the canonical Day 1 gate.
- `episodes/training_missions/sales_quest_arcade_index.html` is now best treated as an earlier gameplay/reference pattern, not the primary current sales lane.
- Compatibility wrappers `ep1/` and `ep3/` still exist to prevent dead links while older paths retire.

## Current maintenance targets

0. Align new content with [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md) (Pulse → Path → Depth).
1. Keep `PLATFORM_STATUS.md`, `SITE_MAP.md`, `data/episode_registry.json`, `data/journey_steps.json`, and `episodes/training_hub/data/modules.json` aligned whenever a lane changes.
2. Run and record smoke tests for Golden Path, contributor onboarding, and Lumina revenue when loop or mission logic changes.
3. Reduce generator drift under `full_seed_starter/` while preserving one blessed profiles-capable path.
4. Keep legacy/reference surfaces labeled clearly so the default learner routes stay obvious.


