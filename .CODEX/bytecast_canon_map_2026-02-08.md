# ByteCast Workspace CANON Map
_Updated: 2026-02-08_

This map classifies projects in `\\100.115.9.61\Collab\mini.shops\bytecast` using:
- `Primary`: current source of truth for active work
- `Legacy`: still useful, but not the main source
- `Duplicate`: overlapping copy that should be merged/removed
- `Archive`: historical handoff/output, keep read-only

## Portfolio Map

| Path | Class | Role | Current status | Next action |
|---|---|---|---|---|
| `aerovista_offer_pack` | Primary | Main offer/training app + content system | Active and maintained | Keep as primary training product |
| `assets` | Primary | Shared root asset placeholder | Minimal support folder | Keep lean; avoid project logic here |
| `docs` | Primary | Workspace standards/manuals/status control plane | Active reference docs | Keep as canonical docs index |
| `ep1` | Legacy | Compatibility wrapper for EP-001 | Redirect-only wrapper | Review retirement on 2026-03-08 |
| `ep3` | Legacy | Compatibility wrapper for EP-002 | Redirect-only wrapper | Review retirement on 2026-03-08 |
| `episodes` | Primary | Canonical slug-based episode output root | Active (new) | Use this for all new episodes |
| `full_seed_starter` | Primary | Generator and template toolkit umbrella | Active but mixed quality | Use sub-map below to consolidate |
| `lift_lab_bytecast_bundle` | Primary | Non-coder training bundle (site + docs + content) | Active and recently streamlined | Keep as primary training/onboarding bundle |
| `seed_orchard_ui` | Legacy | Seed-to-fruit concept UI | Usable prototype | Keep as concept module; integrate later |
| `template` | Primary | Canonical ByteCast episode baseline template | Usable baseline | Keep as default template for new episodes |
| `_archive/phase4_retired_2026-02-08` | Archive | Phase 4 retired-path safety archive | Active archive | Keep read-only through compatibility cycle |

## `full_seed_starter` Sub-Map

| Path | Class | Role | Current status | Next action |
|---|---|---|---|---|
| `full_seed_starter/av_seedgen_python_profiles` | Primary | Best canonical generator candidate (profiles-capable) | Working | Promote as default generator |
| `full_seed_starter/av_seedgen_python_umami` | Legacy | Analytics-focused variant | Working variant | Merge features into canonical generator |
| `full_seed_starter/av_seedgen_python` | Legacy | Baseline generator variant | Working but superseded | Keep until merge is complete |
| `full_seed_starter/bytecast_ep_profile_portrait` | Legacy | Specialized portrait ByteCast template | Usable niche template | Keep as optional profile/template |
| `full_seed_starter/docs_md_files` | Primary | Canonical docs source pack for generator standards | Useful source material | Keep and sync into generator outputs |
| `full_seed_starter/nxcore_end_of_session_bundle` | Archive | Operational handoff/history bundle | Historical snapshot | Keep read-only archive |
| `_archive/phase4_retired_2026-02-08/av_seedgen_python (2)` | Archive | Retired duplicate of baseline generator | Parity confirmed and moved | Delete after archive hold window |
| `_archive/phase4_retired_2026-02-08/av_seedgen_python_profiles (2)` | Archive | Retired duplicate of profiles generator | Parity confirmed and moved | Delete after archive hold window |
| `_archive/phase4_retired_2026-02-08/ep2` | Archive | Retired empty legacy episode slot | Retired and moved | Do not reuse numeric path |

## Canonical Build Path (Recommended)

1. Author standards and guidance in `docs`.
2. Build/maintain generators in `full_seed_starter` (primary target: `av_seedgen_python_profiles`).
3. Use `template` as baseline for manual episode starts.
4. Publish episode instances under `episodes/<content_slug>` and training program bundles under dedicated folders like `lift_lab_bytecast_bundle`.
5. Keep `aerovista_offer_pack` as business/training core content source.

## Immediate Cleanup Queue

1. Run compatibility-cycle decision for `ep1` and `ep3` wrappers on 2026-03-08.
2. Merge useful deltas from `full_seed_starter/av_seedgen_python_umami` into `full_seed_starter/av_seedgen_python_profiles`.
3. Keep `_archive/phase4_retired_2026-02-08` read-only until compatibility cycle ends, then remove if no rollback needed.
