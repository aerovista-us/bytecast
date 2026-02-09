# SEED_STANDARD.md — Static Experience Seed Bundle (Canonical)

## Folder structure (canonical)
```
(root)
  index.html
  styles.css
  app.js
  PROMPTS.md
  deploy_github_pages.md
  README.md
  manifest.webmanifest        (optional)
  sw.js                       (optional)

  /assets
    hero.jpg                  (required placeholder)
    paper.jpg                 (optional placeholder)
    favicon.svg               (required placeholder)
    icon-192.png              (optional PWA)
    icon-512.png              (optional PWA)
    README_assets.md
```

## Principles
- Static-first, no frameworks, no build step
- Theme tokens in `:root` for fast reskins
- 2–3 interactive modules max (reveal cards, path steps, ambient toggle, quiz gate)
- Accessible by default (skip link, focus-visible, aria-expanded)
- Works on `file://` and hosted `http://`
