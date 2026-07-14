# ByteCast platform status (canonical)

**Updated:** 2026-07-14  
**Purpose:** Single current snapshot for doors, episodes, journeys, training/proof, seeds, and known risks. Historical notes and Feb 2026 audits live under [`archived/`](./archived/).

**Latest handoffs:** [`HANDOFF_2026-07-09.md`](./HANDOFF_2026-07-09.md) (Days 1–4 + forge) · Agent Days 5–10 + InteractiveScript: [`AGENT_DAYS_5_10.md`](./AGENT_DAYS_5_10.md)

**Product direction:** ByteCast is the employee operating–learning–comms spine (canonical — approved). See [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md). **Guardrail:** shareholder briefings are Pulse content, not the product identity. Implementation phased: home reframe → Pulse feed → catalog unification → handoffs.

## Public doors (learner / visitor)

| Door | Path | Current role |
|------|------|--------------|
| **Employee home (ByteCast)** | `index.html` → `episodes/training_hub/index.html` | **Primary front door** — Continue, Pulse, lifecycle sections |
| Playlist (Continue) | `seed_bytecast.html` | Resume episodes, badges, journey progress |
| Seed Builder Studio | `episodes/seed_builder_studio/index.html` | Contributor **Build** tools (not employee default) |
| Docs Portal (HTML) | `docs/index.html` | **Reference** — standards, reviewer tools |

Legacy label **Training Hub** retired in UI; path unchanged (`episodes/training_hub/`).

## Canonical runtime episodes

- **Agent onboarding spine (Golden Path):** Days **1–10** then TR-001A → seed → badge.
  - D1 `episodes/the_first_door/` (AGENT-D1)
  - D2 `episodes/finding_source_of_truth/` (AGENT-D2)
  - D3 `episodes/from_signal_to_action/` (AGENT-D3)
  - D4 `episodes/the_handoff_is_the_work/` (AGENT-D4)
  - D5 `episodes/working_the_queue/` (AGENT-D5)
  - D6 `episodes/safe_access_boundaries/` (AGENT-D6)
  - D7 `episodes/builder_client_experience/` (AGENT-D7)
  - D8 `episodes/writing_like_aerovista/` (AGENT-D8)
  - D9 `episodes/from_draft_to_deliverable/` (AGENT-D9)
  - D10 `episodes/trusted_agent_capstone/` (AGENT-D10)
  - Gate: `TR-001A` `episodes/training_missions/tr_001a_day1_foundations/`
- **Legacy Day 1 reference (optional):** `EP-001`–`EP-004` — no longer required on `p1_golden_path`.
- **Contributor onboarding hub:** `EP-005` + wrapper pages `contributor_onboarding_ep0`–`ep4`.
- **Additional active lanes:** Art Localized, AV Apparel, Lumina revenue, **Shareholder Season 1** (Pulse/side lane — not Golden Path).
- **Internal recap / non-default:** `EP-EOS` remains active, not the default learner entry.

**Teaching mode for Agent Days:** **InteractiveScript** — Gate → Journey (stepper) → Practice (labs) → Reference → Check → Prove. Shared assets: `assets/shared/agent_day_{episode,interactive,labs,visuals}.js`.

**Audio / narration:** NXCore forge (`npm run forge:agent-dayN` / `forge:agent-days-5-10`). Until WAVs exist, browser listen mode via `voiceover_sections.json`. Day 1 has forge pipeline + manifest; Days 2–10 forge on NXCore TTS `:5315`.

**Shareholder Season 1 audio gap:** Players expect AAC/MP3 at repo root — **not yet in repo**.

Registry mirrors: `data/episode_registry.json` · `.CODEX/episode_registry.json` · catalog: `data/catalog.json`.

## Active journeys and proof state

- **Default onboarding (Golden Path):** `p1_golden_path` → Agent Days **1–10** → `TR-001A` → `seed_export_v1` → `seed_publish_v1` → badge `p1_golden_path_v1`.
- **Additional journeys:** `seeding_v1`, `division_aerovista_v1`, `art_localized_training`, `contributor_onboarding_training`, `apparel_onboarding_v1`, `lumina_revenue_v1`, `shareholder_season1_v1`.
- **Proof contract:** `data/journey_steps.json` (`depends_on`, `unlock_requires`, badge `minProof`). Engine: `assets/shared/bytecast_loop.js`.
- **Reviewer surfaces:** [`teacher_review.html`](./teacher_review.html), [`proof_review.html`](./proof_review.html), [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md), [`BYTECAST_PROOF_SCHEMA.md`](./BYTECAST_PROOF_SCHEMA.md).

## Training Hub and missions

- **Employee home:** `episodes/training_hub/index.html`
- **Pulse:** `data/pulse.json`
- **Manifest:** `episodes/training_hub/data/modules.json`
- **Canonical check after Day 10:** `tr_001a_day1_foundations`
- **Legacy Day 1 reference:** `tr_001_golden_path`
- Sales / Lumina labs unchanged (DispatchFlow workbook, `tr_lum_001_revenue_routing`, Lumina seed brief)

## Training value principles (keep simple)

1. **One law per day** — shown in the law row; carried forward as a “pocket line” after Prove.
2. **Journey first, script optional** — stepper shows visual + takeaway; full script behind `<details>`.
3. **Three short labs** — Practice before Check; must pass when `labs_required`.
4. **Micro-checks** — only where a segment has an easy trap; skip crowded quizzes mid-journey.
5. **Day spine D1–D10** — orientation without dumping a syllabus.

## Shipping / deploy

- **GitHub Pages base:** `https://aerovista-us.github.io/bytecast/`
- **NXCore Collab path:** `/srv/Collab/mini.shops/bytecast` (also served on aerocore hosts when mirrored)
- Prefer commit → push `main` for Pages; forge WAVs on NXCore then commit manifests + WAVs if Pages should play offline audio.

## Seeds and generator

- Seed shell / Orchard / Lumina brief paths unchanged.
- Standards: [`SEED_STANDARD.md`](./SEED_STANDARD.md), [`SEED_OPTIONS.md`](./SEED_OPTIONS.md), [`SEED_GENERATOR_MANUAL.md`](./SEED_GENERATOR_MANUAL.md).
- **Ongoing risk:** multiple generator variants under `full_seed_starter/` — converge on one blessed profiles path.

## Known legacy / risks

| Item | Status |
|------|--------|
| EP-001–004 on Golden Path | Retired from required path; still playable as reference |
| Playwright `golden-path.spec.js` | Still models legacy EP-001 spine — update to Agent Days |
| Shareholder Season 1 audio | Missing binaries |
| PLATFORM_STATUS vs workspace | Synced 2026-07-14 to Days 1–10 |
| RydeSync | **Out of scope** for this repo (lives elsewhere) |

## Current maintenance targets

0. Align content with [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md).
1. Keep registry, journey, catalog, modules, and this status file aligned on every lane change.
2. Smoke Golden Path 1→10→TR-001A after journey or interactive changes.
3. Forge remaining Agent Day audio on NXCore TTS; prefer committing Day WAV+manifests for Pages.
4. Update Playwright Golden Path tests to Agent Day spine.
5. Reduce `full_seed_starter/` drift.
