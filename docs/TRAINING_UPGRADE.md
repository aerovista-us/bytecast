# Training upgrade program

**Audience:** Maintainers improving ByteCast episode packs, profiles, and Training Hub lanes.  
**Companion:** [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md), [`CATALOG.md`](./CATALOG.md), [`data/training_upgrade_overlays.json`](../data/training_upgrade_overlays.json).

## What “better training” means here

Every publishable pack should meet the **lesson shape** (Objective → Why → Teach → Check → Apply → Prove → Advance) and declare a **teaching mode** matched to delivery — not force Listen → Engage → Do → Prove on briefings or Pulse content.

| Layer | Upgrade focus |
|-------|----------------|
| **Metadata** | `teaching_mode`, `lesson`, `thread_tags`, `related_next`, `handoff` on `bytecast_ep_profile.json` |
| **Copy quality** | Mojibake-free HTML, `start_here` / `key_line` where packs feel thin |
| **Checks** | Quizzes with ≥3 questions on skill lanes; pass thresholds documented |
| **Assets** | Audio under `assets/` or episode `assets/`; infographic PNG present before pilot goes live |
| **Navigation** | Series `related_next` chains; handoff footer on Day 1 + Lumina capstone |

## Automated upgrade (run after editing overlays)

```bash
npm run upgrade:trainings
npm run fix:mojibake   # HTML encoding repair (safe to re-run)
```

### What `upgrade:trainings` does

1. Reads `data/catalog.json` episode list and `data/training_upgrade_overlays.json`.
2. Applies **series defaults** (`teaching_mode`, base `thread_tags`) per lane.
3. Merges per-episode **lesson** blocks, navigation, handoffs, and quiz extras.
4. Activates Day 1 drafts when `activate: true` in overlay (EP-001, EP-002).
5. **Creates** missing profiles (Apparel EP-APP-001–003, Contributor hub).
6. **Syncs inline** `PROFILE` JSON in EP-001 and Apparel HTML packs.

Profile path overrides (Art Localized, Contributor episodes) live in `training_upgrade_overlays.json` → `profile_path_overrides`.

## Authoring workflow

1. **Edit overlays first** — add or refine `lesson`, `quiz_extra`, `handoff`, `related_next` under `episodes.<slug>` in `data/training_upgrade_overlays.json`.
2. Run `npm run upgrade:trainings`.
3. For pack-specific slides/quiz content, edit the generated or existing `bytecast_ep_profile.json` in the episode folder (overlays do not wipe slides).
4. Run `npm run check:episodes` before commit.
5. If catalog routing changed, edit `data/catalog.json` only, then `npm run sync:catalog`.

## Lane status (2026-07-08)

| Lane | Teaching mode | Upgrade status |
|------|---------------|----------------|
| **Agent Days 1–10** | ReadAloudScript + MissionLab shell | Days 1–4 live; **Days 5–10** with voiceover + forge packs (`build:agent-days-5-10-vo`, `forge:agent-days-5-10` on NXCore) |
| Day 1 EP-001–004 (legacy) | GuidedAudioSlides | Reference only; metadata + lesson shape; mojibake fixed |
| TR-001A | MissionLab | HTML encoding fixed |
| Lumina 101–106 | VoiceoverSections | Lesson + thread tags; LUM-106 handoff to revenue mission |
| Art Localized 0–4 | ReadAloudScript | Lesson blocks + extra quiz questions on Ep 0–1 |
| Contributor CO-EP-0–4 | ReadAloudScript | Lesson blocks + hub profile |
| AV Apparel APP-001–003 | MissionLab | **New profiles** + inline sync |
| Shareholder S1-EP-01–06 | BriefingSync | Pulse tags + S1 chain `related_next` |
| Ecosystem map pilot | VisualHotspot | Lesson block; **PNG still required** |
| EoS recap | BriefingSync | Internal lesson metadata |

## Still manual / asset-dependent

These cannot be fixed by metadata alone:

| Gap | Action |
|-----|--------|
| **No audio in repo** | NXCore forge (`npm run forge:agent-day*`) on port 5315; legacy MP3 via `scripts/vo_md_to_mp3.py`; Shareholder S1 audio still missing |
| **Ecosystem map PNG** | Add `episodes/infografic/AV_AppEchosystemMap.png` (or update profile path) |
| **Art / Contributor wrappers** | Canonical content lives under `Art.Localized/` and `contributor.onboarding/`; catalog `primary_path` wrappers redirect — consider inlining later |
| **Revenue Engine standalone** | Not in catalog spine; wire or retire |
| **Handoff footer on Lumina / Art / Apparel HTML** | Profiles ready; add `bytecast_handoff_footer.js` to pack templates when those surfaces should show thread chips |

## Quality bar checklist (per new episode)

- [ ] `teaching_mode` set
- [ ] `lesson.objective` + `lesson.advance` filled
- [ ] Engage quiz ≥3 questions OR explicit rubric in mission HTML
- [ ] `thread_tags` + `related_next` for series continuity
- [ ] Audio paths exist on disk OR `required: false` with Read fallback documented
- [ ] `npm run check:episodes` clean

**Updated:** 2026-07-10
