# Seed Standard (Site Seeds)
Date: 2026-02-07

## Purpose
A **Seed** is a small, shippable artifact (often single‑file) that demonstrates an idea clearly and can be shared quickly.

## Required properties
- **Portable**: works from a folder without external build steps (unless explicitly labeled).
- **Self-contained**: includes all JS/CSS needed (or documents the required files).
- **Clear intent**: users should know what it is in 10 seconds.
- **Readable**: includes inline comments or a short README.
- **Safe defaults**: no destructive operations; no hidden tracking; optional analytics only.

## Canonical structure
Recommended:
- `index.html` (primary experience)
- `README.md` (run instructions + options)
- `assets/` (optional audio/images/data)
- `docs/` (this docs set, optional but recommended)

## Runtime modes
- **file:// mode**: open `index.html` directly (best for “single-file” seeds).
- **http:// mode**: run local server (best for fetch(), audio reliability, PWA).

## Quality gates
- No console errors on load
- Works on desktop + mobile
- Has an obvious “start” path
- Includes a short “what to do next” section


---

## Imported reference (existing standard)

# standard “Seed Bundle” pattern you can reuse for any static drop (music experience, microsite, product page, onboarding gate, etc.).

SEED_STANDARD.md.

---
## SEED_STANDARD.md — Static Experience Seed Bundle
### Purpose

A repeatable, static-first web bundle that:

Works by double-click (file://) and served (http://)

Deploys cleanly to GitHub Pages

Has a consistent “starter kit” structure:

One page experience

Theme tokens

Minimal JS for interaction

Art prompts + deploy doc

Optional PWA layer

Placeholder assets so it runs immediately




---

### Standard Folder Structure

/(root)
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

### What each file is for

index.html

The entire experience in one page

Must include: hero, 1–3 core sections, CTA, footer

Uses semantic HTML + accessible buttons/links

References assets relatively (assets/...)


styles.css

Contains:

:root theme tokens (colors, spacing, radius, shadow)

layout + components (buttons, cards, grids)


No external libraries required


app.js

Tiny JS only:

toggles

progressive reveal

step/path progression

optional PWA install prompt


No dependencies


PROMPTS.md

Art direction prompts for:

Hero image

Section backgrounds

Card textures

Icon set


Includes negative prompt + crop guidance


deploy_github_pages.md

Short deploy recipe for Pages (branch + root)


README.md

“What is this, how to run it, where to replace assets”


manifest.webmanifest (optional)

PWA metadata and icon references


sw.js (optional)

Cache-first service worker

Must have versioned cache name (seed-name-v1)


assets/

Always includes placeholders so the seed works immediately




---

Core Design Rules (So Seeds Feel Consistent)

1) Theme Tokens First

In styles.css, start with tokens:

--bg0, --bg1, --ink, --muted

1–2 accent colors (ex: --gold)

--radius, --shadow, --max, --pad


This makes “reskinning” fast.

2) Hero Pattern

Hero should include:

big headline

subheadline (max ~70 chars wide)

2 CTAs (primary + secondary)

2–4 “pill” badges (quick metadata)

background image + subtle overlay (no text baked into image)


3) Section Pattern

Each section should have:

.section__head with title + short guide text

1 clear interactive element:

reveal card

progress path

tabs

mini quiz gate

audio player toggle



4) Minimal JS Philosophy

JS is only for:

class toggles

sequential unlock

progress bar updates

localStorage state (optional)


No complex router, no build step.

5) Accessibility Baseline

keyboard focus styles (:focus-visible)

aria-expanded for toggles

no interaction that requires hover only

skip link present



---

“Seed” Naming + Versioning

Seed IDs

Use a consistent naming scheme:

Folder name: seed_<topic>_<v#>

Zip name: seed_<topic>_<v#>.zip


Example:

seed_celestine_v1.zip


Internal Version Marker

In README.md, include:

Seed name

Seed version

Date created

Change notes



---

Standard Interactive Modules (Pick 2–3)

Module A — Reveal Cards

click/tap to expand hidden “margin note”

good for “insights” / “rules” / “chapters”


Module B — Path/Quest Steps

sequential unlock

“Mark complete” buttons

progress bar meter


Module C — Gate Quiz (Optional)

5–10 questions

80% pass threshold

completion badge

store result in localStorage (non-security)


Module D — Ambient Toggle

a single button toggles body.is-ambient

CSS adjusts overlays/glow intensity



---

Asset Requirements and Specs

Required

assets/hero.jpg

recommended: 2560×1440 or larger (16:9)

no text on the image


assets/favicon.svg

simple mark that looks good at 16–64px



Optional but recommended

assets/paper.jpg

subtle texture, used behind cards


assets/icon-192.png, assets/icon-512.png

if PWA is enabled




---

Local Dev + QA Checklist

Run modes

File open: double click index.html (should still work)

HTTP serve: python -m http.server 8080


QA checklist

Mobile: buttons not cramped, text readable

Desktop: hero doesn’t crop headline area badly

No console errors

Tab navigation works end-to-end

Cards and path buttons work without reload

All assets load (no 404s

*(Truncated here; keep `site-seed-standardized.md` as authoritative.)*
