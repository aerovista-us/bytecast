# SEED_OPTIONS — Feature Toggles & Defaults

Date: 2026-02-07

This seed standard supports optional layers. Everything should still run when opened as `file://`.

## Options in `app.js`

### Analytics (Umami)
Configured via `window.__UMAMI__`. Loader should:
- Only run when `enabled: true`
- Auto-disable on `file://` (recommended)
- Optionally restrict to allowed domains
- Support `?no_analytics=1` for one-off disabling

See: `ANALYTICS_UMAMI.md`

### PWA (optional)
If enabled, include:
- `manifest.webmanifest`
- `sw.js`
- `assets/icon-192.png`, `assets/icon-512.png`

Service worker should:
- Use a versioned cache name (`seed-name-v1`)
- Cache essential files
- Skip caching giant media unless intended

### localStorage state (optional)
Allowed for:
- “completed” markers
- progress state
- quiz pass status (non-security)

Not allowed for:
- access control / auth assumptions

### Modules you can include (pick 2–3)
- Reveal Cards
- Path/Quest Steps
- Gate Quiz
- Ambient Toggle
- Audio Player Toggle (simple HTML5 audio)

## Runtime modes

### File open mode (`file://`)
Should still work:
- layout + content
- core interactions
- no hard dependency on network

### HTTP serve mode (`http://`)
Should support:
- PWA install + service worker caching
- analytics (if enabled)
- clean relative asset loading

## Overrides

Recommended URL query overrides:
- `?no_analytics=1` → disables Umami loader
- `?debug=1` → optional: enable console logging (if you add it)
