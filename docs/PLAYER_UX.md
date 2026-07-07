# Player UX Notes

**Updated:** 2026-07-06  
**Purpose:** Capture mobile player experiments from shipping intake without promoting them into Golden Path until validated across teaching modes.

## Reference prototypes (not linked from default routes)

| File | Pattern |
|------|---------|
| `assets/prototypes/mobile-player-neoamp-fullscreen.html` | Full-screen neo-amp shell with bezel, notch, and large transport controls |
| `assets/prototypes/mobile-player-thumb-dock-v2.html` | Thumb-zone dock for play/pause and scrub on small viewports |

These stay in `assets/prototypes/` as design references. Do not wire into `p1_golden_path` until tested on GuidedAudioSlides and BriefingSync players.

## Patterns worth keeping (future `listen_mode.js` work)

1. **Thumb dock** — Primary transport (play/pause, ±15s, scrub) pinned to bottom safe area on narrow screens; reduces reach for one-handed use.
2. **Neo-amp fullscreen** — High-contrast amp face with visible timecode and section label; good for BriefingSync slide-sync players.
3. **Safe-area padding** — Prototypes use `env(safe-area-inset-*)` on dock and header; adopt when merging mobile layout into shared listen chrome.

## Current production listen mode

Canonical implementation: `assets/shared/listen_mode.js` — Web Speech read-aloud + teleprompter for Day 1 and ReadAloudScript packs. See [`day1/LISTEN_MODE.md`](./day1/LISTEN_MODE.md).

**Promotion rule:** Only merge prototype code into `listen_mode.js` when it works across BriefingSync (Season 1 root HTML) and GuidedAudioSlides without breaking existing episode progress keys.
