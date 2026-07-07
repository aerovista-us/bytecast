# AeroVista Contributor Pipeline — Seed Bundle
Generated: 2026-02-09

This bundle standardizes **Learn → Do → Prove** for any AeroVista tool/module:

1. **Manual**: teach a human how to use the tool.
2. **Journey**: ByteCast (overview) → Training (hands-on) → Seeder (repeatable).
3. **Badge**: minted only after evidence proves completion (non-recreatable).

## What’s inside
- `schemas/` — JSON Schemas for manifests, journeys, badges, evidence.
- `templates/` — Markdown templates for manuals + ByteCast + Training + Seed app.
- `shared/` — Umami config snippet, postMessage bridge contract, helper JS.
- `bytecast_playlist_skeleton/` — “Indexer / Overlay Player” starter (static-site friendly).
- `examples/` — One complete example tool wired end-to-end.

## Design rules (lock these)
- Everything is a **standalone module** (episodes, training, seed apps, hubs).
- The **Command Center** is orchestration only: discovery + overlay + progress ledger.
- **Umami** is enabled by default (can be disabled via `window.__UMAMI__.enabled = false`). See `SEED_OPTIONS.md`.

## Quick start
1. Copy `examples/tool_example/` and rename IDs.
2. Add your tool’s card to 'bytecast_playlist_skeleton/registry.json`.
3. Host the folder (GitHub Pages works) and open `bytecast_playlist_skeleton/index.html`.

## Next step
Customize the templates, then use the schemas to validate every module and journey.
