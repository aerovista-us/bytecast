# ByteCast Workspace CANON Map
_Updated: 2026-02-11 (file name kept stable for link compatibility)_

This map classifies projects in `\\100.115.9.61\Collab\mini.shops\bytecast` using:
- `Primary`: current source of truth for active work
- `Legacy`: still useful, but not the main source
- `Duplicate`: overlapping copy that should be merged/removed
- `Archive`: historical handoff/output, keep read-only

## Portfolio Map

| Path | Class | Role | Current status | Next action |
|---|---|---|---|---|
| `index.html` | Primary | Workspace entry (sacred overview) | Active and maintained | Keep doors-only; gate internal links |
| `seed_bytecast.html` | Primary | Playlist hub (episodes + quest map + next action) | Active and maintained | Keep visitor-safe; route to Training/Seed |
| `training_hub` | Primary | Shell: onboarding + module router + quest map | Active and maintained | Keep orchestration-only (no content hosting) |
| `seed_builder_studio` | Primary | Shell: tooling router + Orchard access | Active and maintained | Keep orchestration-only; manuals as secondary links |
| `docs` | Primary | Docs portal + standards + ops links | Active and maintained | Keep internal links here (governance/raw data) |
| `data` | Primary | Runtime registries/config | Active and maintained | Edit carefully; small changes only |
| `assets` | Primary | Shared runtime assets (icons, badges, shared JS) | Active and maintained | Keep lean; avoid app-specific logic |
| `aerovista_offer_pack` | Primary | Main offer/training app + content system | Active and maintained | Keep as primary training product |
| `episodes` | Primary | Canonical slug-based episode output root | Active and maintained | Use `episodes/<content_slug>/` for all new episodes |
| `training_missions` | Primary | Training packs (missions) | Active and maintained | Grow ladder here; keep packs standalone |
| `template` | Primary | Canonical ByteCast episode baseline template | Usable baseline | Keep as default template for new packs |
| `vendor` | Primary | Bundled runtime vendor libs | Active and maintained | Keep minimal; pinned libs only |
| `ep1` | Legacy | Compatibility wrapper for EP-001 | Redirect-only wrapper | Review retirement on 2026-03-08 |
| `ep3` | Legacy | Compatibility wrapper for EP-002 | Redirect-only wrapper | Review retirement on 2026-03-08 |
| `full_seed_starter` | Primary | Generator and template toolkit umbrella | Active but mixed quality | Use sub-map below to consolidate |
| `lift_lab_bytecast_bundle` | Primary | Non-coder training bundle (site + docs + content) | Active and recently streamlined | Keep as primary training/onboarding bundle |
| `seed_builder_studio/seed_orchard_ui` | Primary | Seed Orchard (export + publish proof) | Active and maintained | Keep as the seeding app used by journeys |
| `_archive/phase4_retired_2026-02-08` | Archive | Phase 4 retired-path safety archive | Active archive | Hold until 2026-03-08 review window |
| `_archive/tmp_review_runs` | Archive | One-off generator/test outputs | Archive | Keep read-only unless re-running comparisons |

## `full_seed_starter` Sub-Map

| Path | Class | Role | Current status | Next action |
|---|---|---|---|---|
| `full_seed_starter/av_seedgen_python_profiles` | Primary | Best canonical generator candidate (profiles-capable) | Working | Promote as default generator |
| `full_seed_starter/av_seedgen_python_umami` | Legacy | Analytics-focused variant | Working variant | Merge features into canonical generator |
| `full_seed_starter/av_seedgen_python` | Legacy | Baseline generator variant | Working but superseded | Keep until merge is complete |
| `full_seed_starter/bytecast_ep_profile_portrait` | Legacy | Specialized portrait ByteCast template | Usable niche template | Keep as optional profile/template |
| `full_seed_starter/docs_md_files` | Primary | Canonical docs source pack for generator standards | Useful source material | Keep and sync into generator outputs |
| `full_seed_starter/nxcore_end_of_session_bundle` | Archive | Operational handoff/history bundle | Historical snapshot | Keep read-only archive |
| `_archive/phase4_retired_2026-02-08/av_seedgen_python (2)` | Archive | Retired duplicate of baseline generator | Parity confirmed and moved | Hold until 2026-03-08 review window |
| `_archive/phase4_retired_2026-02-08/av_seedgen_python_profiles (2)` | Archive | Retired duplicate of profiles generator | Parity confirmed and moved | Hold until 2026-03-08 review window |
| `_archive/phase4_retired_2026-02-08/ep2` | Archive | Retired legacy episode slot | Retired and moved | Do not reuse numeric path |

## Canonical Build Path (Recommended)

1. Author standards and guidance in `docs`.
2. Build/maintain generators in `full_seed_starter` (primary target: `av_seedgen_python_profiles`).
3. Use `template` as baseline for manual episode starts.
4. Publish new episodes under `episodes/<content_slug>/` (keep `ep1`/`ep3` as temporary wrappers until 2026-03-08).
5. Keep `aerovista_offer_pack` as business/training core content source.

## Immediate Cleanup Queue

1. Run compatibility-cycle decision for `ep1` and `ep3` wrappers on **2026-03-08**.
2. Merge useful deltas from `full_seed_starter/av_seedgen_python_umami` into `full_seed_starter/av_seedgen_python_profiles`.
3. After 2026-03-08: remove `_archive/phase4_retired_2026-02-08/` only if no rollback requests.
