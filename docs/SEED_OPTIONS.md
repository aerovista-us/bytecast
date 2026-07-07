# Seed Options
Date: 2026-07-06

Common knobs each seed can support.

## Options
- **Analytics**: Umami — see [Analytics (Umami)](#analytics-umami) below
- **Themes**: UI palette presets
  - default: Venta Black + Neon Blue
  - optional: Ghostwave (purple), Embercore (warm)
- **Offline mode**
  - file:// safe vs http:// recommended
  - JSON-driven seeds should include a file fallback (embedded JSON)

## Analytics (Umami)

### Standard config block
```js
window.__UMAMI__ = {
  enabled: true,
  url: "https://stats.aerocoreos.com",
  websiteId: "5f012bc0-4545-474a-a689-19c01818fadc",
  domains: ["aerovista-us.github.io"]
}
```

Intake snippet reference: `_intake/aerovista_contributor_pipeline_seed/shared/umami_config_snippet.html`

### Loader behavior (recommended)
- If `enabled === false`, do nothing.
- Load Umami script dynamically from `url`.
- Swallow script load errors (no UI break).
- Optional: only activate for allowed `domains`.

### Shared bridge
- `assets/shared/umami_bridge.js` — canonical loader helper promoted from intake seed bundle.
- Iframe/postMessage contract for embedded seeds: `assets/shared/postmessage_contract.md`

## JSON validation schemas (intake promotion)

Canonical copies for seed/journey validation scripts:

- `docs/schemas/badge.schema.json`
- `docs/schemas/evidence.schema.json`
- `docs/schemas/journeys.schema.json`
- `docs/schemas/module_manifest.schema.json`

Source archive: `_intake/aerovista_contributor_pipeline_seed/schemas/`

## Recommended README “Seed Options” section
### Seed Options
- Analytics (Umami): Enabled by default. Disable by setting `window.__UMAMI__.enabled = false`.
- Theme: Default `venta-neon`. Use a theme selector (if present) or set `data-theme` on `<html>`.
- Run mode: For best reliability, serve via HTTP.
  - Local: `python -m http.server 8080` then open `http://localhost:8080`
  - GitHub Pages base: `https://aerovista-us.github.io/bytecast/`
