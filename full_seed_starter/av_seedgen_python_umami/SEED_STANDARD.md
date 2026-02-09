# SEED_STANDARD.md — Static Experience Seed Bundle

## Purpose
A repeatable, static-first bundle that works locally and deploys cleanly (GitHub Pages).
Design goal: consistent structure + fast reskin.

## Required files
- index.html
- styles.css
- app.js
- PROMPTS.md
- deploy_github_pages.md
- README.md
- assets/ (includes placeholders)

## Optional
- manifest.webmanifest
- sw.js
- PWA icons (assets/icon-192.png, assets/icon-512.png)

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
    hero.jpg
    paper.jpg
    favicon.svg
    icon-192.png              (optional)
    icon-512.png              (optional)
    README_assets.md
```

## Core rules
- Theme tokens in :root
- Hero: headline, sub, 2 CTAs, pills
- 2–3 interactive modules max (reveal cards, progress path, ambient toggle, quiz gate)
- Minimal JS (no frameworks)
- Accessibility baseline (skip link, focus-visible, aria-expanded)
