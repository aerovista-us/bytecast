# AVCC Audit — Time Axis (NXCal) + DB Connections
_Date: 2026-02-03_
_Status update: 2026-02-04 (code-verified, runtime not verified)_

## CANON decision (2026-02-04)
**Single truth:** The fixes listed below are **present in code** but **not yet runtime-verified** in this audit.
Until a live test is recorded, treat them as **Applied in code, Pending runtime verification**.

## Findings (from your symptoms)

### A) Time Axis (NXCal): “Failed to fetch agenda: Internal Server Error”
- The browser error string you pasted matches an **older dashboard bundle** path (`Failed to fetch agenda: ${response.statusText}`), which suggests you were running a cached version (PWA/service worker or old hashed assets).
- Current server-side checks (now) show:
  - `GET http://100.115.9.61:3001/api/calendar/agenda` → 200 OK
  - `GET http://100.115.9.61:5208/api/events/agenda` → 200 OK

**What likely happened:** AVCC container-to-container routing was flaky earlier (or the frontend was cached); after standardizing Docker networking and gateway routing, agenda is stable now.

### B) DB: `SQLITE_ERROR: no such table: entity_relationships`
- Root cause: `backend/schema.sql` did **not** create `entity_relationships`, but the UI (SmartRelationshipView) calls relationship endpoints that query it.
- The table existed only in a one-off script (`backend/scripts/deploy-relationships.js`) and wasn’t guaranteed to run in production.

---

## “Audit all DB connections” (what AVCC currently uses)

### AVCC SQLite (primary)
- DB file: `/data/sql/aerovista.db` (Docker volume from `/srv/ACOS/aerovista-command-center/_data/sql`).
- Used by: projects/tasks/clients/team/invoices/events/messages + relationships.

### NXCal (separate service DB)
- AVCC does **not** share its SQLite DB with NXCal.
- AVCC talks to NXCal over HTTP via `/api/calendar/*` gateway.

---

## Fix status (code-verified, runtime pending)

### 1) Backend logging: no more `{}` errors
**Verified in code:** logger now renders `Error` objects with `name/message/stack/cause`.  
Path: `Y:\aerovista-command-center\backend\src\utils\logger.js`
**Runtime verification:** not captured here.

### 2) Explicit fetch timeouts + stable container routing
**Verified in code:**  
- NXCal timeouts implemented in `Y:\aerovista-command-center\backend\src\services\nxcalService.js`  
- Registry proxy timeouts in `Y:\aerovista-command-center\backend\src\routes\aerocoreos.js`  
**Runtime verification:** not captured here.  
**Compose / env confirmation:** **not verified** in this audit; must be checked in runtime or compose files.

### 3) Relationship schema is now guaranteed
**Status:** **Not verified in code or runtime in this audit.**  
If present, it should be visible in:  
- `backend/schema.sql` or  
- a startup migration hook (server boot), or  
- a deploy/migration script.

**Action required:** confirm in code and/or run a live check.

---

## If you still see the old NXCal “Internal Server Error” in the UI
That is almost certainly **cached frontend**.

Fast fix:
- Hard refresh (`Ctrl+F5`) and/or open in a private window.
- If you installed the PWA: uninstall it or unregister the service worker, then reload.
