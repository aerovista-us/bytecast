# {TITLE}

{DESCRIPTION}

## Run locally
- Double-click `index.html` (works as file://)
- Or serve: `python -m http.server 8080`

## Replace assets
- `assets/hero.jpg` (recommended 2560×1440+)
- `assets/paper.jpg` (optional texture)
- PWA icons: `assets/icon-192.png`, `assets/icon-512.png` (optional)

## Customize
Edit `styles.css` tokens under `:root` and copy changes across seeds.


## Seed Options

### Analytics (Umami)
This seed supports optional Umami analytics via `window.__UMAMI__` in `app.js`.

Defaults included:
- `enabled: true`
- `url: https://stats.aerocoreos.com`
- `websiteId: 5f012bc0-4545-474a-a689-19c01818fadc`
- `domains: ["aerovista-us.github.io"]`
- `disableOnFileProtocol: true` (won’t run on `file://`)

Overrides:
- Disable analytics for a session: add `?no_analytics=1` to the URL
- Or set `window.__UMAMI__.enabled = false`

Generated on: {DATE}
Seed name: {SEED_NAME}
