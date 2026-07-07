# TEMPLATE_GENERATOR_NOTES — Seed Generator Conventions

Date: 2026-02-07

This doc describes how the generator should stamp out seeds.

## Generator outputs

The generator should produce:
- A folder named `seed_<topic>_<v#>/`
- A zip named `seed_<topic>_<v#>.zip`

## Template injection rules

### styles.css
- Insert theme tokens at the top of `:root`
- Keep tokens consistent with SEED_STANDARD

### index.html
- Hero with:
  - H1 headline
  - subheadline
  - 2 CTAs
  - metadata pills
- 1–3 sections with a clear interactive element each
- Footer with version marker + links

### app.js
Must include:
- Minimal JS interactions
- Optional modules (feature flags / simple config)
- Optional analytics (Umami) loader scaffold

### README.md
Must include:
- How to run (`file://` and `http://`)
- Asset replacement list
- **Seed Options** section (feature toggles + overrides)
- Version marker:
  - name, version, date, change notes

## QA checklist (every seed)

- Mobile: buttons not cramped, text readable
- Desktop: hero doesn’t crop headline area badly
- No console errors
- Tab navigation works end-to-end
- Cards and path buttons work without reload
- All assets load (no 404s)
