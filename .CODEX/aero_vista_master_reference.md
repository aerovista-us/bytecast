# AeroVista Master Reference
_Last updated: 2026-02-04 (America/Los_Angeles)_

This document consolidates everything I **know** (from our chats) and what I can **safely assume** about your ecosystem, preferences, and active work. It’s meant to be a single “source-of-truth index” you can extend over time.

> **Scope note**
> - **Known** items are sourced from our prior conversations.
> - **Assumed** items are clearly labeled and based on strong patterns in your workflow.
> - This is a living reference; it’s designed so we can keep adding sections without refactoring the whole thing.

---

## 1) Identity & Operating Style

### 1.1 Who you are (context)
- **Timbr** — Fraud Prevention & Operational Compliance (international call centers in PH, NIC, US).
- Founder/CEO of **AeroVista LLC** with multiple sub-divisions.
- Location context you reference often: Coeur d’Alene, Idaho (CDA).

### 1.2 How you prefer to work (known)
- You use this chat as a **running notes log**.
- You want notes consolidated, indexed, and maintained as a **master index** with roll-ups:
  - **Active Tasks**
  - **Decisions**
  - **Ideas**
- You prefer **repeatable workflows** and **versioning** (Phase 1/2/3, P1/P2/P3, “golden baselines,” drift checks).
- You prefer “local-first, cloud-smart.”

### 1.3 Core principles (known)
- **One change = one compose stack** mindset.
- **Spine vs Module vs Release vs Artifact** separation.
- Avoid “global cleanup passes.”
- Prefer **reactive AI** rather than autonomous agents making changes.

### 1.4 Voice/lore preferences (creative, known)
- Timbr voice in lyrics: **wise grit**.
- Byte voice: **flirty tech prophet**.
- Jeanie w/ a Jay: **soulful, witchy**.
- BillyGoat: **chaos energy**.
- “SwampHop” is a **feel**, not a place.
- CDA pronunciation note (lyrics): spell **“ccore da a lane”** (phonetic preference).
- Pend Oreille (lyrics): **“ponder ray.”**

---

## 2) Top-Level Ecosystem Map

### 2.1 Organizations / brands (known)
- **AeroVista LLC** — umbrella.
- Divisions (as of 2025-08-16):
  1. Nexus TechWorks — full-stack engineering, AI/product, DevOps.
  2. SkyForge Creative Studios — game dev + immersive storytelling.
  3. EchoVerse Audio — AI-driven music production + sound.
  4. Summit Learning — educational content + mentoring.
  5. Lumina Creative — branding/marketing/digital media.
  6. Vespera Publishing — digital content/books/courses.
  7. Horizon Aerial & Visual — drone cinematography, mapping, 3D.

### 2.2 Flagship systems/apps you reference frequently (known)
- **NXCore** — your primary Linux server replacing the old server.
- **AeroVista Command Center (AVCC)** — ops/business dashboard.
- **EchoVerse Music Catalog/Library** — streaming, overlays, metadata.
- **NXCal** — canonical event/timeline ledger.
- **BytePad** — modular sticky-note/knowledge tool.
- **WorkerShop** — queue-based AI job dispatcher with “Front Desk” router.
- **EchoValentines / EchoStory** — interactive Valentine experiences (packs/cards/tracks/stickers).
- **RydeSync** — synchronized music + travel room sync.

### 2.3 “Neural Workstation / Neural Core” concept (known)
Anchors:
- Web-only dashboard (no Electron).
- AeroCoreOS styling.
- Reuse existing `nexus_unified_server.py` on port **5000**.
- REST endpoints:
  - `/health`
  - `/music/library`
  - `/files/list`
  - `/ai/insights` (POST)
  - `/analytics/summary`
- Mock mode + optional polling.
- Start with 2–3 systems (Music, Files, AI/Analytics).
- Reactive AI only.

---

## 3) Infrastructure & Hosting

### 3.1 NXCore (known)
- Ubuntu-based Linux server (you often mention Ubuntu 24.04 LTS).
- You use Docker Compose heavily.
- You access it locally and remotely.
- **NXCore is now the primary host** and fully replaces the old Linux server; it is the “everything box” (apps, storage, automation, local AI).

### 3.2 Storage mounts & shares (known)
External SSD mounts:
- `/srv/AeroDrive` (UUID `3655-78FC`)
- `/srv/NXDrive` (UUID `5A00-F9C3`)

Samba exports:
- `[AeroDrive]` and `[NXDrive]` restricted to user `glyph`.

Windows mapping that worked:
- `net use Z: \\100.115.9.61\AeroDrive /user:glyph *`
- `net use X: \\100.115.9.61\NXDrive /user:glyph *`

Group:
- `AV-Share` exists with GID `1006`.
- Drives use `gid=1006` via fstab.

### 3.2a Search scope & scan safety (important)
- Your “big folders” are often **untracked/uncommitted** and can exist anywhere across mounted drives; avoid repo-root or drive-root scans by default.
- Always state the intended scope before running anything recursive:
  - Which drive: `X:\` (NXDrive) vs `Z:\` (AeroDrive) vs local SSD letter(s)
  - Which subtree: exact folder (ex: `X:\NeXuS\Agent\...`)
  - What operation: search (`rg`), list files, inventory, etc.
- Default rule: **no recursive commands at drive root** (ex: `X:\`, `Z:\`) unless explicitly intended.
- Prefer narrow commands:
  - Search: `rg "term" X:\Path\To\Project` (not `rg` from `X:\`)
  - Git-aware search: run from the repo root *only when the repo is known-small*.
- Helpers (safe defaults):
  - `X:\.CODEX\tools\where.ps1` (print current scope + drive meaning)
  - `X:\.CODEX\tools\safe-rg.ps1 -Query "term" -Root X:\Path\To\Project` (refuses drive-root by default)

### 3.2b Canon vs Reference (rule)
- **CANON = current operating truth** (must be updated when reality changes).
- **REFERENCE = historical/aspirational/context** (allowed to be stale).
- No-root-scan doctrine: if we need to discover what exists, we **update a curated index (paths + 1-liners)** instead of scanning drive roots.

### 3.3 Reverse proxy & routing (known)
- You use **Traefik** in a Compose stack (`nxtraefik-traefik-1` referenced).
- You’ve debugged missing dynamic config files like `http-redirect.yml`, `middlewares.yml`, `tailnet-routes.yml`.

### 3.4 Remote access (known)
- You use **Tailscale** for remote access.

### 3.5 Web properties & deployment (known)
- AeroVista branding website deployed on Firebase.
- You also publish many apps via GitHub Pages.

---

## 4) Data Architecture (known direction)

### 4.1 Canonical pattern (known)
- Centralized **Core DB** for cross-app business truth.
- Separate **domain-specific DBs per app** (EchoVerse, RydeSync, etc.).
- **NXCal** as the canonical event/timeline ledger.
- Apps should publish summaries/events rather than merge all storage.
- This separation is **locked in** as the data architecture rule.

### 4.2 Practical implication (assumed, based on your pattern)
- Prefer event-sourcing-ish behavior for “what happened” in NXCal.
- Keep operational truth (projects/invoices/clients/metrics) in Core DB.
- Keep rich app-specific detail in each app DB.

---

## 5) “Memory Vault” & Knowledge Systems

### 5.1 Current intent (known)
- You want a scalable plan to scan hundreds of `.md` and chat logs into a second-brain system.
- You want to dramatically reduce size by filtering junk.
- You explicitly want to ignore:
  - `runs/` folders
  - `/json_inbox/`
- You’ve explored attaching Obsidian via “Open in Obsidian” links (dashboard UX), with the correct reality check that links open on the clicking machine.

### 5.2 MemoryMapping.v2 (known)
- You have a project at: `/srv/NXDrive/NeXuS/Agent/MemoryMapping.v2`
- You want it to integrate (not necessarily replace) the newer vault approach.

### 5.3 NeXuS consolidated docs pack (caution)
Location (Windows): `X:\NeXuS\❇️AeroSTARThere❇️\📃DOCUMENTS\Nexus CONSOLODATED`
- Treat this set as **helpful but potentially stale** (many files self-report “Last Updated: Jan 3, 2025”; verify against current reality before acting).
- Primary “map” docs:
  - `NeXuS_DOCUMENTATION_INDEX.md` (navigation across docs + pointers to other files that may live outside this folder)
  - `NeXuS_Documentation_Consolidation_Index.md` (consolidation roll-up)
- Key system specs (most referenced patterns):
  - `NEXUS_CONFIGURATION_SYSTEM.md` (config conventions, env template patterns)
  - `NEXUS_DATABASE_SYSTEM.md` (unified DB intent/schema tables)
  - `NEXUS_PORT_CONFIGURATION.md` (port registry conventions)
  - `NeXuS_Technical_Architecture_Consolidated.md` (high-level architecture roll-up)
- Operations / organization:
  - `NeXuS_FILESYSTEM_SUMMARY.md` + `NeXuS_FILESYSTEM_ANALYSIS.md` (critical vs irrelevant, reorg intent)
  - `NeXuS_IMPORT_EXPORT_SYSTEM.md` (INBOX/OUTBOX/RECYCLE.BIN pattern)
  - `NEXUS_FOLDER_MANAGER_README.md` (folder manager “workhorse” concept)
- UI / AeroCoreOS note:
  - `AeroCoreOS_Combined.md` (UI/IPC audit notes; some sections read like a point-in-time gap report)
- Agent meta:
  - `AI_AGENT\AGENT_TRAINING_GUIDE.md` (generic “how to search” methodology; does not account for NXDrive/SSD resource constraints—use with care).

### 5.4 AeroVista docs pack (AEROVISTA folder)
Location (Windows): `X:\NeXuS\❇️AeroSTARThere❇️\📃DOCUMENTS\AEROVISTA`
- Top-level intent: product + business planning artifacts for AeroVista, plus a standalone “AV.Divisions manager” app.
- Key top-level docs:
  - `AeroVista_Business_Operations_Consolidated.md` (company identity, revenue streams, org structure, brand, ops)
  - `AEROVISTA_MVP_ROADMAP.md` (3–6 month phased MVP integration plan; reads as planning guidance)
  - `AEROVISTA_MVP_TECHNICAL_GUIDE.md` (suggested stack; treat as aspirational, not authoritative)
  - `AEROVISTA_OFFLINE_AI_SYSTEM.md` + `AEROVISTA_INTEGRATION_AUDIT_REPORT.md` (offline AI integration notes + audit findings; point-in-time)
- Subfolders:
  - `AV.Divisions\` (docs + app)
    - `AEROCOREOS_README.md` / `AEROCOREOS_MODULE_SUMMARY.md` describe `aerocoreos_av_divisions_manager.py` (Flask app) for indexing/search/editing markdown in that tree.
  - `business\` (`company-overview.md`, `operations.md`, `divisions.md`)
  - `marketing\` (mostly assets + HTML flyers; large images live in `marketing\assets\`)

### 5.5 Target capabilities (assumed)
- Fast full-text search.
- Structured summaries (per file / per folder / per project).
- Tagging + semantic embeddings later.
- “Callable” retrieval: ask for a topic and get the exact doc + excerpt.

---

## 6) Automation & Ops

### 6.1 n8n automation stack (known)
- You’re deploying a self-hosted n8n stack on NXCore.
- Subtasks you’ve noted:
  - Docker Compose (n8n + Postgres + Traefik/NGINX behind Tailscale)
  - HTTPS
  - Seed workflows (webhooks & schedulers)
  - Map free vs enterprise features
  - Cost projection for executions
  - Backups/cron & monitoring
  - Document in SOP
- Priority: **P1**.

### 6.2 Reporting preferences (known)
- You like concise summaries and self-contained HTML reports.

### 6.3 “Daily Brief Builder” (known)
- You maintain a daily brief system and want P1 items surfaced first.

---

## 7) Product & UX Workstreams

### 7.1 AeroVista Command Center (AVCC) (known)
- Active focus area; flagged as a project to “kick back up.”
- UX roadmap (known):
  - Phase 1: Search + tags + nicer cards + command palette
  - Phase 2: Live health badges + latency + copy compose/logs buttons + smart categories
  - Phase 3: “Boss mode”

### 7.2 Founders Map / UI status probes (known)
- You’ve implemented reachability/latency probes via favicon fetch:
  - `<img src="http://host:port/favicon.ico?ts=...">` onload=UP, onerror=DOWN
- You noticed layout issues on desktop where left column becomes empty except Refresh and a checkbox.

### 7.3 EchoValentines / EchoStory (known)
- You’re building a “received” unboxing/opening experience (envelope theme).
- You’ve had a repeated focus on:
  - Sticker placement and sizing
  - To/From placeholders vs final text placement
  - Message block sizing
  - Card overall size and readability (mobile and desktop)
  - Track preview before sending
- You want pack standards:
  - Covers standardized (common landscape vs portrait mismatch noted)
  - Drift checks and manifest validation
- You had a Git issue with long filenames in generated assets.

---

## 8) Music System & Creative Output

### 8.1 EchoVerse Audio (known)
- You produce tracks and plan consistent deliverables per track:
  - Suno-ready lyrics with embedded sound headers
  - Track art prompt
  - Visualizer HTML drop-in

### 8.2 Triplet pattern requirement (known)
For every division track / track moving forward:
1) Full lyrics
2) Sonic Signature block
3) Anti Sound field (written as positive/flip logic)
4) Track art

### 8.3 Active music concepts (known)
- “Overclock the Grave” (heavy metal album project) distinct from Pittal Paddle.
- Pittal Paddle track “Racks in the Pit” with confirmed fire sections.
- Multiple narrative projects:
  - Split narrative song: Past Boy / Present Man, unreliable narrator chorus.
  - A follow-up Part II from the hero’s perspective.
- A 10-track SwampHop album based on a comprehensive status report (operational metrics → music).

### 8.4 EchoVerse Audio Player (current build, known)
- **Docker is primary** for EchoVerse runtime.
- **Main UI:** `http://100.115.9.61:8502`
- `5300` is **retired**.
- `5303` (DJ UI) is **semi-broken** and not usable.
- Entry + boot:
`index.html` loads ES modules from `player_files/` and registers a service worker.
`main.js` boots via `DOMContentLoaded` and loads `./tracks.json`.
- Feature set implemented (from files):
Header with Playlist + Queue; central player with cover art, seek bar, transport, shuffle, and volume.
Playlist overlay + close button + scrollable container.
Notes, About, Settings overlays and a floating utility FAB menu.
Theme selection + session import/export wiring in Settings.
Playlist rendering supports sort modes, list/grid toggle, and folder open/close state persistence.
Folder grouping uses `trackNormalizer.groupTracks()` when in folder mode.
Queue panel is dynamic, subscribes to `window.queueManager`, and supports drag/drop reorder.
Context menu: Play Next, Add to Queue, Star/Unstar, Add Note, Track Info, Copy Track Info.
Tracks source: `tracks.json` objects like `{album, title, path, cover}` across folders (ex: “synthetic-souls/audio”, “the pines”).

### 8.5 EchoVerse Player — Critical correctness issues (present in files)
- **session.js serialization is broken**: invalid syntax like `JSON.stringify([.this.#starredTracks])` prevents persistence.
- **track-normalizer.js grouping is corrupt**: `groups.get(key).versions.push({ .normalized, ... })` breaks folder grouping.
- **Queue remove clears entire queue**: `window.queueManager?.clear(queue)` removes the whole segment, not a single item.
- **Grid cover art hidden by default**: `TrackNormalizer` defaults `#fastLoad = true`, which forces `cover: null` even when present.
- **Import wiring mismatch**: inline handlers call `exportSession()` / `importSession(event)` while `main.js` wires `importSessionFromFile`, risking failed imports depending on globals.

### 8.6 EchoVerse Player — Immediate punch list (highest value)
1) Fix `session.js` serialization so starred/notes/folders/theme/sort persist.
2) Fix `track-normalizer.js` groupTracks object push so folder mode doesn’t crash.
3) Change queue remove behavior to remove a single item instead of clearing the queue.
4) Decide fast-load default (no covers) vs covers-on default (heavier but prettier).
5) Align import/export wiring between HTML handlers and `main.js`.

---

## 9) Repo & Release Notes

### 9.1 GitHub Pages inventory (known)
You listed many repos with Pages enabled (examples include):
- `aerovista-daily-brief-builder`, `bytepad`, `echostory`, `echovalentine`, `newyears26`, `www`, etc.
- You also noted a missing repo URL you wanted included: `https://github.com/aerovista-us/about`

### 9.2 AVCC dev path & dist path (known)
- Active dev path: `\\100.115.9.61\acos\aerovista-command-center`
- Distribution/cloning root: `\\100.115.9.61\acos\Apps`
- Concept branch path: `\\100.115.9.61\acos\aerovista\aerovista-command-center`

---

## 10) Compliance / Training Programs (Call Center)

### 10.1 Email campaign cadence (known)
- Fraud/cybersecurity awareness campaign transitioned from **2/day → 1/day**.

### 10.2 Quiz policy (known)
- Passing threshold: **80%**.
- Below 80%: another attempt.

### 10.3 Escalation (known)
- Violation escalation follows the COD policy in the employee handbook.

### 10.4 Reporting (known)
- NNB/ZTP audit scores are logged/reported only (no direct consequence enforced).

### 10.5 Slide/reporting work (known)
- End-of-month slides needed to supplement end-of-week PowerPoint.
- Automating decks from Excel is planned but not immediate.

---

## 11) Active Task Index (Known)

### 11.1 P1 tasks (known)
- n8n self-hosted deployment on NXCore (stack + HTTPS + backups + monitoring + SOP)
- Multi-project architecture rollout:
  - Org/folder/billing layout
  - Centralized Firebase Auth & domains; custom claims
  - Routing style (link-out vs reverse-proxy) for RydeSync
  - Redis tier/region & budget thresholds
  - Terraform scaffolds for projects + CI/CD + baseline IAM
- App portfolio priorities:
  - Consolidate AeroDash versions; archive broken/prototype after merge
  - Complete RydeSync-Next; retire older server after cutover
  - Standardize MindForge/BytePad naming, scope, packaging
- Firebase Functions deployment (aerovista-site):
  - Reinstall firebase-tools globally with bin-links
  - Ensure Gen-2 nodejs22, v2 imports
  - Emulator then deploy

### 11.2 P2 tasks (known)
- 4-week rollout milestones:
  - Week 1: shared projects, budgets, DNS; central Auth; bring av-rydesync online
  - Week 2: proxy/link integration; move room sync to Redis; harden RTDB
  - Week 3: division projects + subdomains + observability
  - Week 4: CSP/Cloud Armor hardening; cost dashboards; playbooks; UAT/cutover
- Build & docs:
  - Build setup for AeroVista Dashboard, RideSync, Rydebeats-sync
  - Document “Views” shared components

### 11.3 P3 tasks (known)
- Cleanups: archive broken versions; consolidate backup folders

### 11.4 Persistent rule (known)
- Keep reminders/tasks active until you explicitly confirm completion.

---

## 12) Standards & Conventions (Assumed but consistent with your patterns)

### 12.1 Folder taxonomy (assumed)
- **Spine**: canonical core systems
- **Modules**: app-specific implementations
- **Releases**: built artifacts and deploy-ready bundles
- **Artifacts**: exports, media masters, generated assets

### 12.2 Naming conventions (assumed)
- Prefer versioned directories (v2, v3) rather than overwriting.
- Prefer explicit SOT markers to declare “this is canonical.”

### 12.3 Documentation style (assumed)
- Each project should have:
  - README (what/why/how)
  - RUNBOOK (ops)
  - PORT_MAP (if applicable)
  - STORAGE_MAP (paths, volumes)
  - SECURITY_MATRIX (if it touches web/IPC/CSP)

---

## 13) Security & Safety Posture

### 13.1 Guiding posture (assumed)
- “Secure enough to move fast, but no risky shortcuts.”
- Prefer:
  - HTTPS everywhere
  - least privilege
  - secrets not committed to repos
  - auditable changes

### 13.2 Known security doc direction (known)
- You requested a detailed `SECURITY_MATRIX.md` describing App → IPC → CSP matrix.

---

## 14) What I’d Add Next (Recommended expansions)

### 14.1 Port registry (recommended)
Create a single canonical port registry file:
- service name
- compose stack
- internal port
- external port
- base URL
- health endpoint
- data volumes

### 14.2 Canonical “Where is truth?” map (recommended)
- Core DB: entities and canonical truth
- NXCal: event ledger
- App DBs: domain details

### 14.3 Release + artifact ledger (recommended)
- What was shipped
- From which commit
- Where the artifact lives
- How to roll back

---

## 15) Appendix: Known quick facts
- You prefer HTML emails styled like your “Phish Alert” example with brand styling and interactive mini-game components.
- You planned a daily fraud awareness email that includes a standalone HTML game and a short looping song (rallying anthem) tied to a 60-day closure notice.
- You run recurring checks for free Borderlands 4 items and want concise summaries + HTML reports.

---

## 16) TODO: Sections to fill with your input (optional)
If you want this document to become your true “everything bible,” here are blanks we can fill later:
- Full list of services + ports (authoritative)
- Full list of repos (authoritative)
- Canonical directory map for NXCore
- Backup schedule + retention policy
- “Golden baseline” list (what must not drift)
- Secrets/storage standard (where `.env` lives, how it’s protected)

---

### Byte Note — Operating Intent (2026-02-02)
- Primary pain points to solve: **not using what’s built** and **not finishing what’s started**.
- Strategy: run a strict **Use → Finish loop** (defaults, adoption tethers, WIP limits, small Definition of Done, weekly ship list).
- Execution stance: **move smart and forward**—do *minimal* safety work up front (no heavy backup/firewall overhaul right now), avoid slowing momentum.
- Near-term architecture move: stand up a **second server** as an NXCore alternative (a clean-slate build that represents how NXCore *should* have been built from the beginning).
- Intent for the second server:
  - Build from the ground up with clean conventions (canonical paths, port registry, compose standards, secrets handling pattern).
  - Use it as a **backup/parallel environment** and eventual migration target.
  - Treat NXCore as “production reality” while the alternative becomes the **gold baseline**.

### Change Log
- 2026-02-02: Initial master reference created.
- 2026-02-02: Added operating intent and second-server clean-slate plan.
- 2026-02-04: Marked NXCore as primary “everything box,” locked data-architecture separation, and added EchoVerse Audio Player runtime facts + current issues + punch list.
