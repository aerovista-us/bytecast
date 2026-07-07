# Episodes (Canonical Paths)

Use content-slug folders for all current and new episodes.

## Active series
1. `Core Day 1` - `EP-001` to `EP-004`
2. `Infographic Training` - `EP-IG-001`
3. `AV Apparel Onboarding` - `EP-APP-001` to `EP-APP-003`
4. `The Art Localized` - `ART-EP-0` to `ART-EP-4`
5. `Contributor Onboarding` - `EP-005` hub plus `CO-EP-0` to `CO-EP-4`
6. `Lumina Revenue Lane` - `EP-LUM-101` to `EP-LUM-106`
7. `Internal Recap` - `EP-EOS-2026-02-09`

## Policy
- New episodes must use: `episodes/<content_slug>/`
- Do not create new numeric `epN` folders.
- Legacy numeric paths are temporary wrappers only.

## Registry
Keep both registry mirrors aligned:
- Runtime mirror: `data/episode_registry.json`
- Builder mirror: `.CODEX/episode_registry.json`

Each entry should include `series_id`, `series_name`, and `sequence` so the Playlist and Training Hub can present the training lanes as grouped series.

## Preflight
Run from the workspace root:

```powershell
npm run check:episodes
```

The preflight validates registry mirrors, Training Hub manifest mirrors, discoverable metadata, and local HTML links across `episodes/`.
