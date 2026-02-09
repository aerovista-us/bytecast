# Umami Analytics Standard (ByteCast Workspace)
_Created: 2026-02-09_

Goal: consistent “how far they got” telemetry across packs without coupling runtimes.

## Operating rules
1. Analytics must be optional:
   - Works when hosted (GitHub Pages, Firebase, etc.)
   - Safe to run when analytics is disabled or blocked
2. Packs must not depend on analytics:
   - No runtime errors if script is missing
3. One shared include:
   - Prefer a single shared file for helper logic
   - Each pack can include it with a relative path appropriate to its location

## Recommended shared file (future implementation)
- `assets/analytics/umami.js`

Minimal behavior:
- `track(name, data)` wrapper that no-ops if Umami is absent
- helper to send milestone events only once per session

## Event names (canonical)
Episodes (ByteCast packs):
- `bc_open` { slug, code }
- `bc_slide` { slug, code, i }
- `bc_audio_play` { slug, code }
- `bc_audio_25` { slug, code }
- `bc_audio_50` { slug, code }
- `bc_audio_75` { slug, code }
- `bc_audio_95` { slug, code }
- `bc_quest_check` { slug, code, id }
- `bc_quiz_start` { slug, code }
- `bc_quiz_pass` { slug, code, score }
- `bc_quiz_fail` { slug, code, score }

Shells (routing and discovery):
- `hub_open` { hub: "training" | "seed" }
- `hub_module_open` { hub: "training" | "seed", module_id, class }

Seed tooling (generator/export):
- `seed_open` { tool }
- `seed_generate` { tool, kind }
- `seed_export` { tool, kind }

Badges (proof events):
- `badge_issued` { kind, slug, code }

## Where to hook “how far they got” (patterns)
Episodes:
- slide change handler
- audio timeupdate milestones (25/50/75/95)
- quiz pass/fail on submit
- quest item toggle

Training:
- module open
- mission complete / reset (Lift Lab)

Seed Builder:
- generator launch
- export/package steps

## Privacy / safety
- Do not send personal data.
- Use only pack identifiers and progress signals.
- Keep analytics off by default in local testing if desired.

