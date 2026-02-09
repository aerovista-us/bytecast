# Lift Lab ByteCast Bundle

This bundle is a drop-in “Episode Page + Program Docs” starter for AeroVista Lift Lab.

## What’s inside
- `site/` — a self-contained ByteCast episode page (static HTML) that loads JSON-driven slides and missions
- `docs/` — playbook, contributing template, first tasks, episode script
- `content/` — JSON: slides, missions, contributor ledger
- `.github/ISSUE_TEMPLATE/` — issue templates for bug/docs/ux

## Quick preview
Use a local static server so JSON loads reliably:

```bash
# From lift_lab_bytecast_bundle/
python -m http.server 8090
```

Then open:
- `http://localhost:8090/site/index.html` (main page)
- `http://localhost:8090/seed_bytecast.html` (launcher/redirect)

## Customize
- Edit `content/slides.json` for the slideshow
- Edit `content/missions.json` for the mission cards
- Edit `content/contributor_ledger.json` for the "updated" stamp
- Replace audio file in `site/assets/` and update the `<audio>` sources in `site/index.html`

## Included UX behaviors (streamlined)
- Mission completion is saved in localStorage (`liftlab_done`)
- Mission filter is saved in localStorage (`liftlab_track_filter`)
- Mission progress summary updates live
- Arrow keys control slides (`Left`/`Right`)
- `M` jumps to Missions

## Suggested next step
Put this into a repo like:
`aerovista-us/lift-lab-playground`
and enable GitHub Pages.
