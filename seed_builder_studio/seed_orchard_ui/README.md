# Seed Orchard UI

A static front-end concept where you enter a few simple inputs, plant a seed, and harvest actionable output cards.

## Run
- Open `index.html` directly, or
- Serve locally: `python -m http.server 8080`
  - Local: `http://localhost:8080/seed_builder_studio/seed_orchard_ui/`
  - GitHub Pages: `https://aerovista-us.github.io/bytecast/seed_builder_studio/seed_orchard_ui/`

## Inputs
- Seed Name
- Core Goal
- Audience
- Harvest Size
- Intensity

## Output
- Animated growth phases
- 3 to 5 generated "fruit" cards
- Each fruit includes:
  - output concept
  - reason it matters
  - first action
  - effort + signal tags

## Export
- `Export Runnable Pack (ZIP)`
  - Requires `http(s)` (GitHub Pages or a local server), because it fetches the canonical baseline at `template/index.html`.
  - Produces a runnable pack ZIP containing:
    - `index.html` (template)
    - `data/bytecast_ep_profile.json` (generated from your seed harvest)
    - placeholder `assets/` + `docs/`
- `Export Seed Artifact (JSON)`
  - Exports the raw seed artifact for debugging.

## Loop integration
- Marks `seed_export_v1` complete via `ByteCastLoop.markStepDone(...)` when you export.
