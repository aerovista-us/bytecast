# ByteCast Navigation Map (Intentional)

**Generated:** 2026-02-10  
**Goal:** Keep visitor-facing pages focused on *journey doors*, while preserving internal/builder links behind clearly labeled “Maintainers (Internal)” collapses (or inside the Docs Portal).

If you want a runnable-page inventory (paths + GH Pages URLs), use `docs/SITE_MAP.md`.

---

## Primary Doors (Visitor-Facing)

- `index.html` (Workspace Entry): doors + journey only
- `seed_bytecast.html` (ByteCast Playlist): episodes + resume + next action
- `training_hub/index.html` (Training Hub): module router + quest map
- `seed_builder_studio/index.html` (Seed Builder Studio): tooling router + quest map
- `docs/index.html` (Docs Portal): builder docs + governance + raw data

---

## `index.html` (Workspace Entry)

**Purpose:** Explain the loop and offer doors.

**Visitor-facing links (always visible):**
- `./seed_bytecast.html` → ByteCast Playlist
- `./training_hub/index.html` → Training Hub
- `./seed_builder_studio/index.html` → Seed Builder Studio
- `./docs/index.html` → Docs Portal
- `./episodes/welcome_to_bytecast/index.html` → Start EP-001 (Listen)
- `./episodes/aerovista_7_division_overview/index.html` → EP-002 (Overview)

**Maintainers (collapsed):**
- `./template/index.html` → Episode template baseline
- `./training_missions/tr_001_golden_path/index.html` → TR-001 missions pack
- `./seed_builder_studio/seed_orchard_ui/index.html` → Seed Orchard app
- `./aerovista_offer_pack/app/index.html` → Offer Pack app
- `./lift_lab_bytecast_bundle/site/index.html` → Lift Lab training site
- `./episodes/eos_2026_02_09/index.html` → EoS episode pack
- `./data/episode_registry.json` → Runtime episode registry (raw)
- `./data/journey_steps.json` → Journey loop config (raw)

---

## `seed_bytecast.html` (ByteCast Playlist)

**Purpose:** Episode discovery + resume + “next recommended action”.

**Visitor-facing links (always visible):**
- `./index.html` → Overview
- `./training_hub/index.html` → Training Hub
- `./seed_builder_studio/index.html` → Seed Builder Studio
- `./docs/index.html` → Docs Portal
- `./episodes/{slug}/index.html` → Episode packs (from `data/episode_registry.json`)

**Maintainers (collapsed):**
- `./training_missions/tr_001_golden_path/index.html` → TR-001 missions pack
- `./seed_builder_studio/seed_orchard_ui/index.html` → Seed Orchard app
- `./docs/index.html` → Governance + raw data + ops logs

---

## `training_hub/index.html` (Training Hub)

**Purpose:** Learner-facing module router (content lives in the packs).

**Top nav (always visible):**
- `../index.html` → Workspace Entry
- `../seed_bytecast.html` → ByteCast Playlist
- `../seed_builder_studio/index.html` → Seed Builder Studio
- `../docs/index.html` → Docs Portal

**Modules (from `training_hub/data/modules.json`):**
- `../aerovista_offer_pack/app/index.html` → Offer Pack app
- `../lift_lab_bytecast_bundle/site/index.html` → Lift Lab training site
- `../training_missions/tr_001_golden_path/index.html` → TR-001 missions pack
- `../docs/index.html` → Docs Portal
- `../seed_bytecast.html` → ByteCast Playlist

---

## `seed_builder_studio/index.html` (Seed Builder Studio)

**Purpose:** Tooling router (generator/template/orchard + standards).

**Top nav (always visible):**
- `../index.html` → Workspace Entry
- `../seed_bytecast.html` → ByteCast Playlist
- `../training_hub/index.html` → Training Hub
- `../docs/index.html` → Docs Portal

**Modules (from `seed_builder_studio/data/modules.json`):**
- `./profiles_generator/index.html` → Profiles Generator landing
  - Manual: `../full_seed_starter/av_seedgen_python_profiles/README.md`
- `../template/index.html` → Episode Template Baseline
- `./seed_orchard_ui/index.html` → Seed Orchard
- `../full_seed_starter/bytecast_ep_profile_portrait/index.html` → Portrait profile template (legacy)
- `../docs/SEED_STANDARD.md` → Seed Standard
- `../docs/SEED_OPTIONS.md` → Seed Options

---

## `docs/index.html` (Docs Portal)

**Purpose:** The one place internal/builder links should live in an organized way.

Contains:
- Contributor ramp: `FIRST_TASKS`, `CONTRIBUTING`, `TROUBLESHOOTING`, `SITE_MAP`
- Standards + manuals: `SEED_STANDARD`, `SEED_OPTIONS`, `LOOP_STANDARD`, `BYTECAST_*`
- Governance: `.CODEX/*` CANON, migration, analytics
- Operations: session reports + checklists
- Raw runtime data: `data/*.json`, `assets/badges/badges.json`

