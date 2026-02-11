# ByteCast Workspace Manifest

Read-only index of what lives where. For runnable URLs and visitor flow, see [NAVIGATION_MAP.md](NAVIGATION_MAP.md) and [docs/SITE_MAP.md](docs/SITE_MAP.md). For project classification and cleanup queue, see [.CODEX/bytecast_canon_map_2026-02-08.md](.CODEX/bytecast_canon_map_2026-02-08.md).

---

## Public doors

| Door | Path | Purpose |
|------|------|---------|
| Workspace entry | [index.html](index.html) | Journey + primary doors |
| ByteCast Playlist | [seed_bytecast.html](seed_bytecast.html) | Episode discovery, resume, next action |
| Training Hub | [training_hub/index.html](training_hub/index.html) | Module router, quest map |
| Seed Builder Studio | [seed_builder_studio/index.html](seed_builder_studio/index.html) | Tooling router, generator/orchard |
| Docs Portal | [docs/index.html](docs/index.html) | Standards, governance, quick links |

---

## Canonical episodes

- **EP-001:** [episodes/welcome_to_bytecast/](episodes/welcome_to_bytecast/)
- **EP-002:** [episodes/aerovista_7_division_overview/](episodes/aerovista_7_division_overview/)

Other episodes (e.g. EoS, planned) are listed in the episode registry.

---

## Runtime data

| File | Role |
|------|------|
| [data/episode_registry.json](data/episode_registry.json) | Episode list and paths (used by Playlist) |
| [data/journey_steps.json](data/journey_steps.json) | Journey loop / golden path config |

---

## Key packs (linked from doors)

- **Offer Pack app:** [aerovista_offer_pack/app/](aerovista_offer_pack/app/)
- **Lift Lab training site:** [lift_lab_bytecast_bundle/site/](lift_lab_bytecast_bundle/site/)
- **Episode template baseline:** [template/](template/)
- **Seed Orchard UI:** [seed_builder_studio/seed_orchard_ui/](seed_builder_studio/seed_orchard_ui/)

---

## Archives

- **Phase 4 retired (2026-02-08):** [_archive/phase4_retired_2026-02-08/](_archive/phase4_retired_2026-02-08/) — retired ep2 slot and duplicate seedgen folders.
- **Tmp review runs:** [_archive/tmp_review_runs/](_archive/tmp_review_runs/) — one-off generator/test outputs.
- **Hold window / policy:** archives are kept for rollback review until the **2026-03-08** compatibility cycle review.

---

## References

- [NAVIGATION_MAP.md](NAVIGATION_MAP.md) — Intentional visitor flow and maintainer links
- [docs/SITE_MAP.md](docs/SITE_MAP.md) — Runnable pages and GitHub Pages URLs
- [.CODEX/bytecast_canon_map_2026-02-08.md](.CODEX/bytecast_canon_map_2026-02-08.md) — Primary / Legacy / Archive classification and cleanup queue
