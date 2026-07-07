# Founder Portfolio Frontend

**Updated:** 2026-03-31

This document identifies the current founder-facing portfolio front end across the active AeroVista workspaces and records the latest UI/UX pass.

## Canonical front end

- Primary founder portfolio app: `D:\SOT\ops-dashboard.html`
- Supporting catalog and visuals: `D:\SOT\ops-catalog.md`, `D:\SOT\reports\runtime_inventory.json`, `D:\SOT\reports\portfolio_rollup.json`, `D:\SOT\screenshots\`

## Companion map in this repo

- [`../founders-map_v6.html`](../founders-map_v6.html) - companion founder map and runtime/domain reference view
- [`../building blocks/founders-map_v6.html`](../building%20blocks/founders-map_v6.html) - mirrored source copy kept in sync with the companion map

## What this app is for

- Give the founder one readable front door for portfolio truth, runtime truth, screenshots, access paths, and review signals.
- Keep the page operational, not decorative: cards should reflect real surfaces, real runtime discoveries, or clearly labeled debt.
- Preserve the dark control-room look while making the page easier to scan under time pressure.

## 2026-03-31 UI/UX pass

- Promoted `D:\SOT\ops-dashboard.html` to the documented primary founder portfolio surface.
- Added a stronger founder briefing panel so the board explains itself before the user starts scrolling.
- Added focus chips for `All`, `Route-ready`, `Needs routing`, `Production`, `Watchlist`, and `Runtime only`.
- Split the main content into `Curated portfolio surfaces` and `Runtime-only discoveries`.
- Enriched catalog cards with runtime inventory signals where service names match.
- Kept screenshot-backed cards, copy/open actions, and the dark control-room visual language.

## Editing guidance

- Edit `D:\SOT\ops-dashboard.html` for founder portfolio UI changes.
- Edit `D:\SOT\ops-catalog.md` for curated card content and `D:\SOT\reports\...` generators for runtime and rollup data.
- Use [`../founders-map_v6.html`](../founders-map_v6.html) as the companion map, not the primary portfolio app.
- Keep labels plain and direct. If a service is not live, say so clearly instead of softening it into vague language.
- Preserve the dark control-room visual language: high contrast, restrained accent color, obvious status badges, and screenshot-led cards.

## Related docs

- [`./SITE_MAP.md`](./SITE_MAP.md)
- [`./PLATFORM_STATUS.md`](./PLATFORM_STATUS.md)
- [`../WORKSPACE_MANIFEST.md`](../WORKSPACE_MANIFEST.md)
