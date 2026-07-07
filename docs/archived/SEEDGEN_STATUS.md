# AeroVista Seed Generator (Python) — Status
Date: 2026-02-07

## Current state
Multiple generator packs exist (baseline, profiles, full pack, umami variant). Direction is correct; drift risk exists.

## What’s working
- Generator produces zipped seeds.
- Profiles concept exists (seed/episode JSON).

## Risks
- Variants may diverge in behavior and docs.
- Needs validation to prevent truncated/broken outputs.

## Next actions
1) Choose one canonical generator (profiles-capable + umami-capable)
2) Add validation: closing tags, required ids, referenced assets
3) Ensure `/docs` set is injected by default
