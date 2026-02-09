# SEED_STANDARD — Static Experience Seed Bundle

Date: 2026-02-07

A repeatable, static-first web bundle you can reuse for any drop (music experience, microsite, product page, onboarding gate, etc.).

## Goals

- Works by double-click (`file://`) **and** when served (`http://`)
- Deploys cleanly to GitHub Pages
- Consistent starter structure:
  - One-page experience
  - Theme tokens
  - Minimal JS for interaction
  - Art prompts + deploy doc
  - Optional PWA layer
- Placeholder assets so it runs immediately

## Standard folder structure

```
/(root)
  index.html
  styles.css
  app.js
  README.md
  PROMPTS.md
  deploy_github_pages.md

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

## What each file is for

### index.html
- Entire experience in one page
- Must include: hero, 1–3 core sections, CTA, footer
- Semantic HTML + accessible buttons/links
- Relative asset refs (`assets/...`)

### styles.css
- `:root` theme tokens (colors, spacing, radius, shadow)
- Layout + components (buttons, cards, grids)
- No external libs required

### app.js
- Tiny JS only:
  - toggles
  - progressive reveal
  - step/path progression
  - optional PWA install prompt
  - optional analytics loader
- No dependencies, no build step

### README.md
- “What is this, how to run it, where to replace assets”
- Includes Seed Options section (feature toggles)
- Includes internal version marker (seed name/version/date/notes)

### PROMPTS.md
- Art direction prompts for:
  - hero image
  - section backgrounds
  - textures
  - icons
- Include negative prompt + crop guidance

### deploy_github_pages.md
- Short deploy recipe for GitHub Pages

### manifest.webmanifest (optional)
- PWA metadata and icon refs

### sw.js (optional)
- Cache-first service worker
- Must have versioned cache name (example: `seed-name-v1`)

## Core design rules (consistency)

### 1) Theme tokens first
In `styles.css` start with tokens:
- `--bg0`, `--bg1`, `--ink`, `--muted`
- 1–2 accent colors (example: `--gold`)
- `--radius`, `--shadow`, `--max`, `--pad`

### 2) Hero pattern
Hero should include:
- big headline
- subheadline (max ~70 chars wide)
- 2 CTAs (primary + secondary)
- 2–4 pill badges (quick metadata)
- background image + subtle overlay (no text baked into image)

### 3) Section pattern
Each section should have:
- `.section__head` with title + short guide text
- 1 clear interactive element:
  - reveal card
  - progress path
  - tabs
  - mini quiz gate
  - audio player toggle

### 4) Minimal JS philosophy
JS is only for:
- class toggles
- sequential unlock
- progress bar updates
- optional localStorage state (non-security)

### 5) Accessibility baseline
- keyboard focus styles (`:focus-visible`)
- `aria-expanded` for toggles
- no interaction that requires hover-only
- skip link present

## Naming + versioning

Seed IDs:
- Folder name: `seed_<topic>_<v#>`
- Zip name: `seed_<topic>_<v#>.zip`

Internal version marker (in README):
- Seed name
- Seed version
- Date created
- Change notes

## Modules (pick 2–3)

- **Reveal Cards** — click/tap expand hidden “margin note”
- **Path/Quest Steps** — sequential unlock + progress bar
- **Gate Quiz (optional)** — 5–10 Qs, 80% pass, localStorage
- **Ambient Toggle** — toggles `body.is-ambient` for CSS glow mode
