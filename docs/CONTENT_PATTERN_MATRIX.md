# ByteCast Content Pattern Matrix

**Updated:** 2026-07-06  
**Purpose:** Baseline audit of how each live series teaches today. Use with [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md) teaching modes — pick delivery from content intent, not a fixed Listen→Engage→Do loop.

## Active series patterns

| Series ID | Representative pack | Teaching mode | Delivery shape | Proof depth |
|-----------|---------------------|---------------|----------------|-------------|
| `core_day1` | `episodes/welcome_to_bytecast/` | GuidedAudioSlides | MP3 + slide deck + Engage quiz + gate pills | Full — `engageQuizPassed` / `engageQuizScore` on journey |
| `infographic_training` | `episodes/av_ecosystem_map_pilot/` | VisualHotspot | Infographic image + hotspot overlays + routing quiz | Pilot — hotspot + quiz meta |
| `art_localized_training` | `episodes/Art.Localized/` | ReadAloudScript | Browser read-aloud + slides + creative scripts | Journey steps; lighter audio |
| `contributor_onboarding` | `episodes/contributor.onboarding/` | ReadAloudScript | Read-aloud + animated SVG + hub docs | Full onboarding proof on CO-EP steps |
| `lumina_revenue_lane` | `episodes/lumina_rev_101/` | VoiceoverSections | Section JSON voiceover + slides + scenario quiz | Quiz + TR-LUM-001 mission proof |
| `av_apparel_onboarding` | `episodes/av_apparel_ep1_welcome/` | GuidedAudioSlides | Audio/slides pattern aligned with Day 1 gates | Engage quiz on lane steps |
| `shareholder_season1` | `episodes/shareholder_s1_ep01/` | BriefingSync | Audio-synced slide players (legacy root HTML via redirect) | Light — step completion only; not on Golden Path |
| `internal_recap` | `episodes/eos_2026_02_09/` | BriefingSync | Internal recap / platform update | `publishable: false` |

## Missions and seeds (non-episode)

| Surface | Teaching mode | Proof |
|---------|---------------|-------|
| `episodes/training_missions/tr_001a_day1_foundations/` | MissionLab | Extended TR proof bundle |
| `episodes/training_missions/dispatchflow_sales_workbook.html` | MissionLab | Sales routing scores |
| `episodes/seed_builder_studio/seed_orchard_ui/` | SeedDoProve | Artifact hash + publish URL |

## Numbering note

**Day 1** uses registry codes `EP-001` … `EP-004` under `episodes/` (onboarding spine).  
**Shareholder Season 1** uses `S1-EP-01` … `S1-EP-06` under `episodes/shareholder_s1_ep01/` … `shareholder_s1_ep06/` (redirect to legacy root players) — different topics; do not merge numbering.

## Intake promotion (2026-07-06)

| Moved asset | Integration |
|-------------|-------------|
| `_intake/aerovista_contributor_pipeline_seed/` | Reference + schemas in `docs/schemas/`; worked example linked from `SEED_GENERATOR_MANUAL.md` |
| `bytecast-ep04.html` … `ep06.html`, `bytecast-season1.html` | Registered as `shareholder_season1` side lane |
| `assets/prototypes/mobile-player-*.html` | Reference only — see [`PLAYER_UX.md`](./PLAYER_UX.md) |
| `docs/UMAMI.md` | Merged into [`SEED_OPTIONS.md`](./SEED_OPTIONS.md) |
