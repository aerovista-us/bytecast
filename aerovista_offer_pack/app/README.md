# AeroVista Offer Pack — Training & Reference App

Internal web app for training, reference, and consistent use across new hires, sales, and delivery. All content is driven by `data/offer-pack-data.json` so you can adjust copy and structure without changing code.

## Run locally

The app loads `data/offer-pack-data.json` via `fetch()`, so use a local server (file:// will block fetch in most browsers):

```bash
# From this directory (app/)
python -m http.server 8080

# Or from repo root
python -m http.server 8080
# Then open http://localhost:8080/aerovista_offer_pack/app/
```

Then open **http://localhost:8080** (or the path that serves `index.html`).

## What’s in the app

- **Home** — 30-second pitch, role shortcuts (Sales / Delivery / Offers), links to all sections
- **Continue where you left off** — Home shows a resume card for the last non-home section visited
- **Onboarding** — Non-coder contributor pathway with assumptions, ladder, guild tracks, and checklists
- **ByteCasts** — Non-coder training episodes with progress tracking and action prompts
- **Summit Courses** — structured contributor curriculum with persisted level/sort preferences, status badges (Locked/Ready/In Progress/Done), completion tracking, and a next-course recommendation banner
- **Home stats** — quick totals for divisions, offers, bundles, and QA lists
- **Divisions** — All 7 divisions; expand to see offers; click an offer for the full card (outcome, includes, client provides, exclusions, upsells, turnaround)
- **Division tools** — filter input, Expand all, Collapse all
- **Sales** — Playbook: pitch, qualification questions, objection handlers, close pattern, follow-up templates (with Copy buttons)
- **Delivery** — Fulfillment phases, revision policy, handoff; QA checklists (Web, Audio, Design, Drone) as tabs
  - QA checkboxes are persisted in localStorage
  - includes a one-click reset for QA checkbox state
- **Intake** — Client intake form sections and fields
- **Pricing** — Good / Better / Best grid per division
- **Bundles** — Three bundles with includes and outcome
- **One-pager** — Client-ready summary; print-friendly (top-bar Print button or Save as PDF)

## Adjust content on the fly

1. **Edit the JSON** — Change `app/data/offer-pack-data.json` (wording, new offers, pricing tiers). Refresh the page.
2. **Regenerate from markdown** — From `aerovista_offer_pack/`, run:
   ```bash
   node scripts/build-offer-pack-data.js
   ```
   This overwrites `app/data/offer-pack-data.json` from the existing `.md` files (offer-pack, one-pager, pricing, sales, delivery, intake, bundles, divisions/*/*.md). Then refresh the app.

## No-code contributions

Non-coders can contribute with high impact:

- **Testing:** reproduce issues with exact steps, expected vs actual, browser/device, screenshot/video.
- **Docs:** improve onboarding, FAQs, and troubleshooting flow.
- **Content:** refine copy in `app/data/offer-pack-data.json` (outcomes, includes, client-provided assets).
- **UX feedback:** point out confusing flows and accessibility friction (contrast, keyboard nav, readability).

Use:
- root `CONTRIBUTING.md` for pathways and ladder
- root `FIRST_TASKS.md` for starter tasks
- GitHub issue templates for bug/docs/feature requests
- `app/data/noncoder-onboarding.json` to edit onboarding assumptions, tracks, and ByteCasts without code changes
- `app/data/summit_courses.json` to edit Summit course catalog and completion criteria

## Beginner assumptions built into onboarding

The onboarding pages assume contributors may have:
- minimal computer knowledge
- low confidence with tools
- limited time blocks (45-90 minutes)
- phone-first access

The flow is designed around short, concrete actions and clear "what to do next" prompts.

## Keyboard and search

- **Ctrl+K** (or Cmd+K) — Open search.
- In search:
  - type to filter divisions, offers, objections, Summit courses
  - use Up/Down arrow keys to move through results
  - `Enter` to open selected result
  - `Esc` to close search
- **Theme** — Use the Theme button in the top bar to switch light/dark (preference is stored in localStorage).
- **Summit filter** — Filter course cards by level (`L0`-`L4`) in Summit Courses.
- **Summit sort** — Sort by recommended order, duration, name, or completion percentage.
- **Summit preference memory** — Level filter and sort mode are saved in localStorage between sessions.
- **Summit completion** — Track completion by checking criteria or marking complete; progress is saved in localStorage.
- **Print** — Use the Print button to open one-pager view and print that section cleanly.

## Deploy

Copy the `app/` folder (including `data/offer-pack-data.json`) to any static host (e.g. GitHub Pages, Firebase Hosting). No build step required.
