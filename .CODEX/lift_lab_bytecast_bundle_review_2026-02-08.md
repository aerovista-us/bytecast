# Lift Lab ByteCast Bundle Review
_Updated: 2026-02-08_

## Scope
- Target: `lift_lab_bytecast_bundle`
- Goal: keep the bundle clean and streamlined while improving usability and reliability.

## Findings
1. `lift_lab_bytecast_bundle/seed_bytecast.html` was truncated and not valid HTML.
2. Bundle root docs (`CONTRIBUTING.md`, `FIRST_TASKS.md`) were pointing to unrelated app paths.
3. `docs/CONTRIBUTING.md` referenced `npm` workflow even though this bundle is static HTML + JSON.
4. Mission UI lacked quick filtering/status controls for day-to-day contributor use.

## Upgrades Applied
1. Replaced `seed_bytecast.html` with a minimal launcher redirect to `site/index.html`.
2. Upgraded `site/index.html`:
   - added mission track filter + persisted filter state
   - added live mission completion summary
   - added "Reset completed" button
   - added keyboard shortcuts (`Left`, `Right`, `M`)
   - added ledger updated stamp from `content/contributor_ledger.json`
   - added safer localStorage parsing for completion state
   - converted local docs references to clickable links
3. Streamlined docs:
   - `README.md` now uses local server preview and documents UX behavior
   - root `CONTRIBUTING.md` and `FIRST_TASKS.md` now route to bundle-local docs
   - `docs/CONTRIBUTING.md` now matches static-server workflow
   - `docs/FIRST_TASKS.md` path corrected to `site/index.html`

## Current Canon (Bundle)
- Primary entry: `lift_lab_bytecast_bundle/site/index.html`
- Launcher: `lift_lab_bytecast_bundle/seed_bytecast.html`
- Content sources:
  - `lift_lab_bytecast_bundle/content/slides.json`
  - `lift_lab_bytecast_bundle/content/missions.json`
  - `lift_lab_bytecast_bundle/content/contributor_ledger.json`
