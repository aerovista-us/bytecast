# AVCC — Current Knowledge Reference
_Last updated: 2026-02-04 (America/Los_Angeles)_

This is a clean, standalone note capturing everything currently known about **AeroVista Command Center (AVCC)** from our conversations—plus a few explicitly marked assumptions to guide the next build.

---

## 1) Purpose & Strategy

### 1.1 Role (known)
- AVCC is your **central ops + business dashboard**.
- You want AVCC to become the **default user entry point** (the first thing you open).
- AVCC is the best tool to solve your two top pain points:
  - **Not using what’s built** → fix by making AVCC the daily doorway.
  - **Not finishing what’s started** → fix by making AVCC the finishing lane and scoreboard.

### 1.2 Operating stance (known)
- Move **smart and forward**.
- Avoid big, time-consuming security/backup/firewall overhauls right now.
- You plan to stand up a **second server** (NXCore alternative / clean-slate baseline) soon; AVCC should support that transition.

---

## 2) Technical Context

### 2.1 Stack (known)
- AVCC is **Svelte-based**.

### 2.2 Running modes (known)
- You sometimes run/open AVCC from **file://** (local file open), and sometimes via a local web host for testing.
- You want read-only probes without auth initially.

---

## 3) Canonical Paths & Where AVCC Lives

### 3.1 Known canonical UNC paths (known)
- Active dev path:
  - `\\100.115.9.61\acos\aerovista-command-center`
- Distribution/cloning root (built artifacts):
  - `\\100.115.9.61\acos\Apps`
- Concept branch path:
  - `\\100.115.9.61\acos\aerovista\aerovista-command-center`

### 3.2 Related environment reality (known)
- You access NXCore shares via Windows mapped drives (X:/Z:) and UNC paths.
- AVCC should be able to link out to:
  - NXCore-hosted web apps on `http://100.115.9.61:<port>/`
  - File/share paths and runbooks (UNC or mapped drive).

---

## 4) Roadmap You’ve Already Defined

### Phase 1 (fast win) — (known)
- Search + tags + nicer cards + command palette.

### Phase 2 (big value) — (known)
- Live health badges + latency.
- “Copy compose/logs” style buttons.
- Smart categories.

### Phase 3 (boss mode) — (known)
- Not yet specified.

---

## 5) Health & Latency Probing Approach

### 5.1 Current workaround (known)
- “No relay” reachability probe using browser image request:
  - request: `http://host:port/favicon.ico?ts=...`
  - `onload = UP`, `onerror = DOWN`

### 5.2 Planned improvement (known)
- Later replace/augment with a **docker relay** (central check service) to improve reliability and avoid browser quirks.

---

## 6) Known UX / Layout Issues

### 6.1 Desktop layout regression (known)
- After Phase 2 layout changes:
  - Desktop view looks bad because the **left column is mostly empty** except “Refresh now” and a reachability/latency checkbox.
  - Mobile impact is less noticeable.

### 6.2 Status badge confusion (known)
- Many cards show both **healthy** and **down** in the same badge (likely logic layering / render state mismatch).

---

## 7) Known Runtime Errors / Breakpoints

### 7.1 Reported crash (known)
- Error:
  - `app.js:192 Route render failed: compose ReferenceError: trackPreviewEl is not defined`
- Trigger context (known):
  - occurs after clicking “punch one back” (exact feature context not fully mapped yet).

### 7.2 Regression risk (known)
- Prior “full replacement” attempts fixed issues but **dropped features**.
- Requirement: fixes must preserve **all existing functionality** (or add more), no regressions.

---

## 8) Constraints & Inputs

### 8.1 Constraints (known)
- No feature regressions.
- AVCC should not rely on `val.dev/...` files (explicitly not part of AVCC).
- Scan safety is non-negotiable: avoid drive-root recursion on mapped drives (X:/Z:) and external SSDs.

### 8.2 Canon vs Reference (rule)
- **CANON = current operating truth**. Must be updated when reality changes.
- **REFERENCE = historical/aspirational/context**. Allowed to be stale; never treated as authoritative.

### 8.3 No-root-scan doctrine (1 sentence)
If we need to discover what exists, we **update a curated index (paths + 1-liners)** instead of scanning drive roots.

### 8.4 Inventory CSV (CANON required, path/schema pending)
- **Status:** PATH NOT CAPTURED → must be confirmed.
- **Required fields (proposed, confirm):**
  - `service_name`, `division`, `url`, `port`, `health_url`, `stack`, `owner`, `notes`
- **Action:** confirm canonical path + schema and record here.

---

## 9) CANON — AVCC Operating Truth (2026-02-04)
- **Source of truth (code):** `Y:\aerovista-command-center` (NXCore: `/srv/ACOS/aerovista-command-center`)
- **Primary URL:** `http://100.115.9.61:3001/`
- **Fix status rule:** Only mark fixes **Applied** when **code + runtime** are both verified.  
  Current P0 fix status: **code-verified, runtime pending** (see audit + upgrade reports).

---

## 10) REFERENCE — Current NXCore Runtime Snapshot (user-provided)
_This is a point-in-time snapshot from a `docker ps` you pasted; treat as “Reference: may be outdated.”_

### 10.1 Notable signals
- `mmv2-scheduler` is in a restart loop (`Restarting (99)`).
- `whisper_worker` is flapping (recent restarts).
- `autoheal` shows `health: starting` (watch if it never stabilizes).
- Traefik is present (`traefik:v2.10.7`) and is the primary HTTP entrypoint on ports 80/443 + dashboard on 8083.

---

### 10.2 AVCC repo + runtime audit (measured on 2026-02-03)
_Reference snapshot: useful for debugging drift; not guaranteed current tomorrow._

### Source location (confirmed)
- Windows: `Y:\aerovista-command-center`
- NXCore on-disk: `/srv/ACOS/aerovista-command-center`
- Running container is started via: `/srv/ACOS/aerovista-command-center/docker-compose.yml` (Compose labels confirmed)

### Repo shape (high level)
- Frontend: Svelte + Vite at repo root (`src/`, `public/`, `vite.config.js`, `svelte.config.js`)
- Backend: Node/Express under `backend/src/`
- Docker build: multi-stage `Dockerfile` builds frontend to `dist/`, then copies to `backend/public/` and runs `node src/server.js`
- Big folders present locally: `node_modules/`, `dist/` (both gitignored; avoid scanning them)

### Container wiring (confirmed)
- Service name: `aerovista-command-center` (port `3001`)
- Bind mounts:
  - `/srv/ACOS/aerovista-command-center/_data/sql` → `/data/sql` (RW; SQLite DB lives here)
  - `/srv/ACOS/aerovista-command-center/apps` → `/app/apps` (RO; “PortableApps manifests”)
  - `/srv/ACOS/aerovista-command-center/backend/src` → `/app/backend/src` (RO; backend code overlay)

### Health (confirmed)
- `http://100.115.9.61:3001/api/health` returns `status: ok`
- Container status: `Up (healthy)`; started at `2026-01-18T15:50:17Z`

### Observed integration noise (logs)
- AVCC logs show periodic failures talking to:
  - NXCal (`NXCAL_API_URL=http://100.115.9.61:5208`)
  - AeroCore Registry (`http://100.115.9.61:8091/registry/services.seed.json`)
- Manual checks from Windows on 2026-02-03 returned 200s for:
  - `http://100.115.9.61:5208/health`
  - `http://100.115.9.61:5208/api/alerts/p1`
  - `http://100.115.9.61:5208/api/events/agenda`
  - `http://100.115.9.61:8091/registry/services.seed.json`
So treat the log errors as **intermittent** until proven otherwise (network blips, timeouts, or error logging that hides details).

### Git status (FYI)
- Branch: `main` (ahead of `origin/main` by 3 commits when checked from the mapped drive)
- Working tree is not clean (many modified/deleted/untracked files); assume the repo is mid-refactor/WIP.

---

## 11) Product Decision: Make AVCC the Default Entry Point

### 11.1 What “default entry point” implies (assumed, but consistent)
- One obvious URL/shortcut.
- A “Start Here” homepage.
- AVCC becomes the canonical place to:
  - open apps
  - see health
  - see what’s next
  - ship and close loops

### 11.2 AVCC as the Use → Finish Engine (assumed, but aligned)
- AVCC should enforce:
  - Defaults (what you use daily)
  - Adoption tethers (all work routes back through AVCC)
  - WIP limits (max 2 active builds)
  - Small Definition of Done
  - Weekly ship list

---

## 12) Minimal “Definition of Done” for AVCC MVP
_This is the smallest finish line that makes AVCC usable daily._ (assumed, but practical)

- ✅ **Home**: Start Here (Open Apps / Today / Ship / Search / Notes)
- ✅ **Apps Directory**: authoritative list with open link + basic status/latency + copy helpers
- ✅ **Board**: Now / Next / Parked / Shipped with WIP limit (NOW max 2)
- ✅ **Search**: at least apps + notes/runbooks (full-text or indexed)
- ✅ **One-click entry**: pinned tab / startup page / shortcut / optional PWA

---

## 13) NXCore-Alt Compatibility (Forward Plan)

### 13.1 Dual-environment display (assumed)
- AVCC should eventually show:
  - **NXCore (current)** links
  - **NXCore-Alt (clean baseline)** links
- Migration becomes “flip links,” not “relearn the system.”

---

## 14) Open Questions (kept small)
_Not blockers—just placeholders for when you want to lock specifics._
- What are the exact routes/pages you want as the AVCC MVP (e.g., `/`, `/apps`, `/board`, `/search`)?
- Where should the inventory CSV live and what’s its schema?
- Should the board persist to a DB now or local storage first?

---

## 15) 2-Track Plan (recommended next focus)

### Track A — NXCore Stabilize (3–5 targeted fixes, nothing more)
Goal: stop the bleeding and make AVCC usable as the daily doorway.

1) **Stop restart loops**: fix `mmv2-scheduler` restart reason and make it either healthy or intentionally disabled.
2) **Stabilize speech pipeline**: stop `whisper_worker` flapping (resource limits, missing model, volume perms, or upstream dependency).
3) **Fix AVCC correctness**: resolve `trackPreviewEl is not defined` crash and the “healthy+down badge” confusion (single source of truth for status).
4) **Lock inventory truth**: make one authoritative inventory source (your CSV or a small JSON) that drives the Apps directory + probing targets.
5) **Triage the doorway**: ensure “Start Here / Apps” is fast, always loads, and has reliable links (NXCore now, NXCore-Alt later).

### Track B — NXCore-Alt Bootstrap (clean baseline)
Goal: build the gold baseline where conventions are enforced day 0 (ports, stacks, secrets, indexes) so migration becomes link-flips.

## 16) Change Log
- 2026-02-02: Created standalone AVCC knowledge reference.
- 2026-02-04: Added explicit CANON/REFERENCE partition and inventory CSV placeholder (path/schema pending).
