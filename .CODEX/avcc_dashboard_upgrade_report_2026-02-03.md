# AVCC Dashboard — Upgrade / Change Report
_Date: 2026-02-03_
_Status update: 2026-02-04 (code-verified, runtime not verified)_

## CANON decision (2026-02-04)
**Single truth:** The logger/timeouts/API unification work is **present in code** but **not yet runtime-verified** in this report.
- **Verified in code**:
  - Logger formats `Error` details: `Y:\aerovista-command-center\backend\src\utils\logger.js`
  - NXCal timeouts + aborts: `Y:\aerovista-command-center\backend\src\services\nxcalService.js`
  - Registry proxy timeouts: `Y:\aerovista-command-center\backend\src\routes\aerocoreos.js`
  - Frontend uses `api.js` for dashboard + service launcher:  
    `Y:\aerovista-command-center\src\modules\Dashboard.svelte`,  
    `Y:\aerovista-command-center\src\components\ServiceLauncherPanel.svelte`,  
    `Y:\aerovista-command-center\src\services\api.js`
- **Runtime verification**: **NOT CONFIRMED** (no live test captured here).

This report focuses on **AeroVista Command Center (AVCC)** as it is currently deployed on NXCore (`http://100.115.9.61:3001/`) and what I would upgrade next, in priority order, to support the prime directive: **Use → Finish**.

---

## 0) Current measured state (reference)

### Runtime
- AVCC backend health is OK: `GET http://100.115.9.61:3001/api/health` → `status: ok`.
- AVCC is deployed from `/srv/ACOS/aerovista-command-center` (Windows `Y:\aerovista-command-center`).

### Dashboard wiring (key integrations)
- Dashboard (`src/modules/Dashboard.svelte`) fetches NXCal data via gateway routes:
  - `/api/calendar/health`
  - `/api/calendar/agenda`
  - `/api/calendar/alerts/p1`
- Dashboard embeds a `ServiceLauncherPanel` using:
  - `registryUrl="/api/aerocore-registry"`

### Observed pain signals
- Backend logs show intermittent errors for NXCal + AeroCore registry calls, but error detail often prints as `{}` (low diagnostic value).
- Client-side call to `http://100.115.9.61:3001/api/aerocore-registry` can be slow/time out from Windows (5s test timed out).

---

## 1) P0 upgrades (reliability + truthfulness)
_Goal: the dashboard must be trustworthy and calm. If data is missing, it should say exactly why._

### 1.1 Fix error logging to show real error details (backend)
**Why:** current `logger` uses `JSON.stringify(error)` which renders most `Error` objects as `{}`. This hides the actual failure mode (timeout vs DNS vs 502 vs refused).

**Change:**
- Update `backend/src/utils/logger.js` to detect `Error` instances and log:
  - `name`, `message`, `stack`
  - plus any enumerable fields
- In routes (calendar bridge / registry), include structured context in logs:
  - target URL, HTTP status, request id

**Acceptance:** when NXCal/registry fails, logs show “timeout” vs “502” vs “ECONNREFUSED” with the URL and request id.
**Status (2026-02-04):** **Applied in code**, runtime not verified.

### 1.2 Add timeouts + aborts for all upstream fetches (backend)
**Why:** Node `fetch` can hang without a timeout; the dashboard becomes “randomly slow” and logs don’t explain it.

**Change:**
- In `backend/src/services/nxcalService.js` + the registry proxy route:
  - wrap fetch with `AbortController` and explicit timeouts (ex: 3–5s)
  - handle timeouts distinctly from other errors

**Acceptance:** upstream timeouts fail fast and return a stable JSON error shape (with `request_id`).
**Status (2026-02-04):** **Applied in code**, runtime not verified.

### 1.3 Unify frontend API calls through `src/services/api.js`
**Why:** `src/services/api.js` already has retry logic and consistent error handling, but the Dashboard and ServiceLauncherPanel bypass it with raw `fetch()`.

**Change:**
- Replace direct `fetch('/api/...')` in:
  - `src/modules/Dashboard.svelte`
  - `src/components/ServiceLauncherPanel.svelte`
  with `api.get('/calendar/...')` and `api.get('/aerocore-registry')`.
- Add an optional timeout in `api.js` (AbortController) for read-heavy calls.

**Acceptance:** consistent retries, consistent error UI, fewer “random reds”.
**Status (2026-02-04):** **Applied in code**, runtime not verified.

### 1.4 Make “demo analytics” explicit (or remove)
**Why:** the dashboard currently generates “trend data” without real history (derived distribution). If it looks real, it erodes trust.

**Change (pick one):**
- Label all non-source-of-truth analytics as **DEMO** in the UI, or
- remove the widgets until there is real historical capture.

**Acceptance:** nothing on the dashboard looks authoritative unless it’s real.

---

## 2) P1 upgrades (Use → Finish UX)
_Goal: AVCC becomes the daily doorway, not a “cool dashboard” that you don’t use._

### 2.1 Make “Start Here” and “Now/Next/Shipped” the default
**Why:** Use → Finish is achieved by defaults + frictionless daily behavior, not more modules.

**Change:**
- Add a default “Start Here” panel on Dashboard:
  - “Now (max 2)”, “Next”, “Parked”, “Shipped this week”
  - quick-add actions (task/project)
  - pin the 5 apps you actually open daily

**Acceptance:** opening AVCC tells you what to do next in <10 seconds.

### 2.2 Division pages as “clean portals” (EchoVerse first)
**Why:** Divisions reduce cognitive load and convert “tons of links” into “one home per division”.

**Current:** a first division page exists at `/pages/division-echoverse.html` with the major EchoVerse endpoints and a link to MemoryMapping v2 (`8522`).

**Next upgrades:**
- Add a consistent template for division pages:
  - “Open”, “Health”, “Runbook”, “Ports”, “Data paths”
- Move division page links into AVCC’s navigation (iframe tabs) and rebuild when ready.

**Acceptance:** one click = the right place for EchoVerse, every time.

### 2.3 Harden “service directory” behavior
**Why:** `ServiceLauncherPanel` becomes the canonical app directory only if it is reliable and fast.

**Change:**
- Cache registry results client-side for N seconds (ex: 30–60s) to avoid refetch storms.
- Add “last refreshed” timestamp and “stale but usable” state.
- Add “copy URL” / “copy compose” buttons when present in registry record.

**Acceptance:** registry panel loads fast even when 8091 is briefly slow.

---

## 3) P2 upgrades (standardization + ops hygiene)
_Goal: reduce drift and “mystery state”._

### 3.1 Secrets: stop embedding secrets in Compose
**Why:** `docker-compose.yml` contains `JWT_SECRET` inline. That is convenient but creates drift and accidental exposure.

**Change:**
- Move secrets into `.env` (not committed) and reference them from Compose.
- Align with NXCore-Alt conventions (`/srv/NXDrive/_secrets/<stack>/` + symlink).

**Acceptance:** Compose files are safe to share; secrets live in one predictable place.

### 3.2 Remove obsolete `version:` key from Compose
**Why:** Compose warns “attribute `version` is obsolete”; removing reduces noise.

**Acceptance:** `docker compose up` has no warning noise.

### 3.3 Reduce “WIP sprawl” in the repo
**Why:** `git status` indicates lots of deletions/untracked artifacts; this makes it hard to know what’s real and safe to deploy.

**Change:**
- Create a `_REFERENCE/` folder (or `docs/_reference/`) for “session logs / summaries / old deployment notes”.
- Keep a small CANON list: runbook, compose, ports, data paths, and the inventory source.

**Acceptance:** it’s obvious what is current truth vs historical notes.

---

## 4) P3 upgrades (performance + UX polish)
_Goal: fast load, low CPU, predictable layout._

### 4.1 Reduce dashboard weight
**Why:** Chart.js + multiple charts can be expensive; if it slows load, you won’t use it.

**Change:**
- Lazy-load charts only when widgets are visible.
- Default widgets to the minimum set (Start Here, Alerts, Service Directory).

### 4.2 Make “status colors” consistent system-wide
**Why:** “healthy + down at the same time” is usually a layering/state bug. A single status model prevents that.

**Change:**
- Standardize: `up | degraded | down | unknown`, with a single renderer and precedence rules.

---

## 5) Recommended next 3 changes (small, high leverage)

1) Backend logger fix (so failures are diagnosable).
2) Add timeouts to NXCal + registry fetch (backend), and unify frontend calls through `api.js`.
3) Promote Division portals (EchoVerse) into AVCC navigation and rebuild once.
