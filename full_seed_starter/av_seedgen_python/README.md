# AV SeedGen (Python) — Static Experience Seed Bundle Generator

This generates the standardized “Seed Bundle” structure we just locked in:
- `index.html`, `styles.css`, `app.js`
- `PROMPTS.md`, `README.md`, `deploy_github_pages.md`
- `assets/` placeholders
- Optional PWA: `manifest.webmanifest` + `sw.js`

## Requirements
- Python 3.9+ recommended (3.8+ should work)

## Quick start
```bash
python seedgen.py --name celestine_jungle --title "Celestine • Jungle Manuscript Awakening" --tagline "Notice the threads."
```

### Output
Creates a folder in `./out/<seed_name>/` and also optionally writes a zip.

## Common commands
Generate (no PWA):
```bash
python seedgen.py --name my_drop --title "My Drop" --tagline "A vibe."
```

Generate + PWA + zip:
```bash
python seedgen.py --name my_drop --title "My Drop" --tagline "A vibe." --pwa --zip
```

Custom palette:
```bash
python seedgen.py --name my_drop --title "My Drop" --tagline "A vibe." \
  --bg0 "#070a0c" --bg1 "#0b0f12" --ink "#e9efe7" --muted "#a9b6a8" --accent "#f2d48f"
```

## Notes
- Everything is relative paths. GitHub Pages friendly.
- Place your final images in `assets/` (hero, textures, icons).
