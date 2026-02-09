# AV SeedGen (Python) — Profiles Edition

Generate standardized static “Seed Bundles” using named profiles (e.g. celestine, onboarding, music_drop).

## Requirements
- Python 3.9+ recommended (3.8+ should work)

## Quick Start
```bash
python seedgen.py --profile celestine --name celestine_jungle --title "Celestine • Jungle Manuscript Awakening" --tagline "Notice the threads." --pwa --zip
```

## Profiles
List available profiles:
```bash
python seedgen.py --list-profiles
```

Use a profile:
```bash
python seedgen.py --profile onboarding --name founder_welcome --title "Founder Welcome" --tagline "Earn your badge." --zip
```

Override anything:
```bash
python seedgen.py --profile music_drop --name dirty_bass_clean_signal --title "Dirty Bass, Clean Signal" --tagline "Press play. Find the signal." \
  --accent "#9cffea" --bg0 "#060608" --zip
```

## Output
- Folder: `./out/<seed_name>/`
- Optional zip: `./out/<seed_name>.zip` with `--zip`

## Notes
- Templates live in `./templates`
- Profiles live in `./profiles/*.json`
