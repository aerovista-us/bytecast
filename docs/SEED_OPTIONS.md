# Seed Options
Date: 2026-02-07

Common knobs each seed can support.

## Options
- **Analytics**: Umami
  - default: enabled
  - can be disabled in config block or via build flag
- **Themes**: UI palette presets
  - default: Venta Black + Neon Blue
  - optional: Ghostwave (purple), Embercore (warm)
- **Offline mode**
  - file:// safe vs http:// recommended
  - JSON-driven seeds should include a file fallback (embedded JSON)

## Recommended README “Seed Options” section
### Seed Options
- Analytics (Umami): Enabled by default. Disable by setting `window.__UMAMI__.enabled = false`.
- Theme: Default `venta-neon`. Use a theme selector (if present) or set `data-theme` on `<html>`.
- Run mode: For best reliability, serve via HTTP.
  - Local: `python -m http.server 8080` then open `http://localhost:8080`
  - GitHub Pages base: `https://aerovista-us.github.io/bytecast/`
