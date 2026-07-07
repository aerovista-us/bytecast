# ByteCast Navigation Map (Intentional)

**Generated:** 2026-02-10 Â· **Golden Path note:** 2026-03-23  
**Goal:** Keep visitor-facing pages focused on *journey doors*, while preserving internal/builder links behind clearly labeled â€œMaintainers (Internal)â€ collapses (or inside the Docs Portal).

**Default onboarding (Golden Path, Day 1):** Journey id `p1_golden_path` in `data/journey_steps.json` â€” `episodes/welcome_to_bytecast` (EP-001) through `episodes/current_truth_basics` (EP-004), then `training_missions/tr_001a_day1_foundations` (TR-001A), then Seed / badge. Legacy `training_missions/tr_001_golden_path` is optional only.

If you want a runnable-page inventory (paths + GH Pages URLs), use `docs/SITE_MAP.md`.

---

## Primary Doors (Visitor-Facing)

- `index.html` (Workspace Entry): doors + journey only
- `seed_bytecast.html` (ByteCast Playlist): episodes + resume + next action
- `episodes/training_hub/index.html` (Training Hub): module router + quest map
- `episodes/seed_builder_studio/index.html` (Seed Builder Studio): tooling router + quest map
- `docs/index.html` (Docs Portal): builder docs + governance + raw data

---

## `index.html` (Workspace Entry)

**Purpose:** Explain the loop and offer doors.

**Visitor-facing links (always visible):**
- `./seed_bytecast.html` â†’ ByteCast Playlist
- `./episodes/training_hub/index.html` â†’ Training Hub
- `./episodes/seed_builder_studio/index.html` â†’ Seed Builder Studio
- `./docs/index.html` â†’ Docs Portal
- `./episodes/welcome_to_bytecast/index.html` â†’ Start EP-001 (Listen)
- `./episodes/aerovista_7_division_overview/index.html` â†’ EP-002 (Overview)

**Maintainers (collapsed):**
- `./template/index.html` â†’ Episode template baseline
- `./episodes/training_missions/tr_001_golden_path/index.html` â†’ TR-001 missions pack
- `./episodes/seed_builder_studio/seed_orchard_ui/index.html` â†’ Seed Orchard app
- `./episodes/aerovista_offer_pack/app/index.html` â†’ Offer Pack app
- `./lift_lab_bytecast_bundle/site/index.html` â†’ Lift Lab training site
- `./episodes/eos_2026_02_09/index.html` â†’ EoS episode pack
- `./data/episode_registry.json` â†’ Runtime episode registry (raw)
- `./data/journey_steps.json` â†’ Journey loop config (raw)

---

## `seed_bytecast.html` (ByteCast Playlist)

**Purpose:** Episode discovery + resume + â€œnext recommended actionâ€.

**Visitor-facing links (always visible):**
- `./index.html` â†’ Overview
- `./episodes/training_hub/index.html` â†’ Training Hub
- `./episodes/seed_builder_studio/index.html` â†’ Seed Builder Studio
- `./docs/index.html` â†’ Docs Portal
- `./episodes/{slug}/index.html` â†’ Episode packs (from `data/episode_registry.json`)

**Maintainers (collapsed):**
- `./episodes/training_missions/tr_001a_day1_foundations/index.html` â†’ TR-001A (Golden Path)
- `./episodes/training_missions/tr_001_golden_path/index.html` â†’ TR-001 missions pack (**legacy**)
- `./episodes/seed_builder_studio/seed_orchard_ui/index.html` â†’ Seed Orchard app
- `./docs/index.html` â†’ Governance + raw data + ops logs

---

## `episodes/training_hub/index.html` (Training Hub)

**Purpose:** Learner-facing module router (content lives in the packs).

**Top nav (always visible):**
- `../index.html` â†’ Workspace Entry
- `../seed_bytecast.html` â†’ ByteCast Playlist
- `../episodes/seed_builder_studio/index.html` â†’ Seed Builder Studio
- `../docs/index.html` â†’ Docs Portal

**Modules (from `training_hub/data/modules.json`):**
- `../episodes/aerovista_offer_pack/app/index.html` â†’ Offer Pack app
- `../lift_lab_bytecast_bundle/site/index.html` â†’ Lift Lab training site
- `../episodes/training_missions/tr_001a_day1_foundations/index.html` â†’ TR-001A (Day 1; Golden Path)
- `../episodes/training_missions/tr_001_golden_path/index.html` â†’ TR-001 missions pack (**legacy**)
- `../docs/index.html` â†’ Docs Portal
- `../seed_bytecast.html` â†’ ByteCast Playlist

---

## `episodes/seed_builder_studio/index.html` (Seed Builder Studio)

**Purpose:** Tooling router (generator/template/orchard + standards).

**Top nav (always visible):**
- `../index.html` â†’ Workspace Entry
- `../seed_bytecast.html` â†’ ByteCast Playlist
- `../episodes/training_hub/index.html` â†’ Training Hub
- `../docs/index.html` â†’ Docs Portal

**Modules (from `seed_builder_studio/data/modules.json`):**
- `./profiles_generator/index.html` â†’ Profiles Generator landing
  - Manual: `../full_seed_starter/av_seedgen_python_profiles/README.md`
- `../template/index.html` â†’ Episode Template Baseline
- `./seed_orchard_ui/index.html` â†’ Seed Orchard
- `../full_seed_starter/bytecast_ep_profile_portrait/index.html` â†’ Portrait profile template (legacy)
- `../docs/SEED_STANDARD.md` â†’ Seed Standard
- `../docs/SEED_OPTIONS.md` â†’ Seed Options

---

## `docs/index.html` (Docs Portal)

**Purpose:** The one place internal/builder links should live in an organized way.

Contains:
- Contributor ramp: `FIRST_TASKS`, `CONTRIBUTING`, `TROUBLESHOOTING`, `SITE_MAP`
- Standards + manuals: `SEED_STANDARD`, `SEED_OPTIONS`, `LOOP_STANDARD`, `BYTECAST_*`
- Governance: `.CODEX/*` CANON, migration, analytics
- Operations: session reports + checklists
- Raw runtime data: `data/*.json`, `assets/badges/badges.json`






