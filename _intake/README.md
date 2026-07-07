# Shipping Intake — ByteCast



Source: `\\100.115.9.61\Collab\av-share\_SHIPPING-RECEIVING`



Items promoted from the shipping/receiving share into **ByteCast** on July 6, 2026.



## Promotion status (2026-07-07)

Session handoff: [`docs/HANDOFF_2026-07-07.md`](../docs/HANDOFF_2026-07-07.md)



| Item | Destination | Status |

|------|-------------|--------|

| Contributor pipeline seed bundle | `_intake/aerovista_contributor_pipeline_seed/` | **Partial** — schemas → `docs/schemas/`; shared → `assets/shared/`; examples stay in `_intake/` |

| Legacy episode HTML (EP01–EP06) | repo root `bytecast-ep01.html` … `bytecast-ep06.html` | **Registered** — canonical packs `episodes/shareholder_s1_ep01/` … `ep06/` redirect to legacy players |

| Season 1 index | repo root `bytecast-season1.html` | **Registered** — series `start_path`, Training Hub card |

| Mobile player prototypes | `assets/prototypes/mobile-player-*.html` | **Documented** — reference only; see `docs/PLAYER_UX.md` |

| Umami integration doc | `docs/UMAMI.md` | **Merged** — canonical content in `docs/SEED_OPTIONS.md#analytics-umami` |

| Playlist skeleton | `_intake/.../bytecast_playlist_skeleton/` | **Archived** — compare against `seed_bytecast.html` + registry; no second generator path |



## Moved into this repo



| Item | Source | Destination |

|------|--------|-------------|

| Contributor pipeline seed bundle | `INBOX/aerovista_contributor_pipeline_seed/` | `_intake/aerovista_contributor_pipeline_seed/` |

| Legacy episode HTML (EP04–EP06) | `OUTBOX/AV-LT/AV-DOCS-OnBoarding/` | repo root `bytecast-ep04.html` … `bytecast-ep06.html` |

| Season 1 index | `OUTBOX/AV-LT/AV-DOCS-OnBoarding/` | repo root `bytecast-season1.html` |

| Mobile player prototypes | `INBOX/html/` | `assets/prototypes/mobile-player-*.html` |

| Umami integration doc | `INBOX/Documents/UMAMI.md` | `docs/UMAMI.md` (redirect to SEED_OPTIONS) |



## Already in ByteCast (not re-copied)



- Art Localized phase packs → `episodes/Art.Localized/`

- BYTECAST / SEED manuals → `docs/` (canonical)

- Legacy EP01–EP03 HTML → repo root

- Day 1 episodes, Training Hub, Seed Builder → `episodes/`



## Left in shipping (not ByteCast)



NXCore ops, work orders, CX product HTML, client jumpstart kits, consolidated_data indexes, and `node_modules` trees remain in `_SHIPPING-RECEIVING`.



## Deferred



Shipping `INBOX/Documents/EP01_*.md` and `EP02_*.md` — schedule content archaeology vs `docs/day1/EP-001_VOICEOVER.md` after Season 1 registration is stable.

