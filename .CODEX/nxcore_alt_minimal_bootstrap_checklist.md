# NXCore-Alt — Minimal Bootstrap Checklist
_Last updated: 2026-02-02 (America/Los_Angeles)_

This is the **one-page, opinionated default** for standing up NXCore-Alt as a clean-slate “gold baseline” that moves fast **without** getting messy.

> Prime directive: **Use → Finish**. NXCore-Alt exists to make shipping and adoption easy.

---

## 0) Goals & Guardrails

### Goals
- Become the **clean baseline**: conventions first, then apps.
- Support **parallel operation** with NXCore: easy link-flip migration later.
- Make AV Command Center the **default entry point** across environments.

### Guardrails (minimal but real)
- No root drive scans (discovery via curated index).
- No giant “refactors” during bootstrap; only establish standards.
- Config and secrets are kept **out of repos** by default.

### Canon vs Reference (rule)
- **CANON = current operating truth**. If reality changes, CANON must be updated.
- **REFERENCE = historical / aspirational / context only**. Allowed to age; never treated as authoritative.

### No-root-scan doctrine (1 sentence)
If we need to discover what exists, we **update a curated index (paths + 1-liners)** instead of scanning drive roots.

---

## 1) Identity & Access

### Host identity
- [ ] Hostname: `nxcore-alt` (or similar; must be distinct from NXCore)
- [ ] Create primary admin user (match your norm): `glyph`
- [ ] SSH key auth enabled; password auth off (or at least not used)

### Remote access
- [ ] Tailscale installed and authenticated
- [ ] MagicDNS name resolves (recommended) so you don’t hard-code IPs

---

## 2) Storage Layout (Canonical Paths)

**Key idea:** keep paths stable so migration is painless.

### Mount points (recommended)
- [ ] Primary data mount at **`/srv/NXDrive`** (match NXCore for compatibility)
- [ ] Secondary/shared mount at **`/srv/AeroDrive`** (optional but keeps parity)

> If you want strict separation, you can mount the physical disks differently internally, but still bind/alias to these canonical mount points.

### Folder taxonomy (create day 0)
Create these roots under `/srv/NXDrive`:
- [ ] `_CANON/` (only current truth lives here)
- [ ] `_REFERENCE/` (historical docs; allowed to be stale)
- [ ] `Spine/` (core shared systems)
- [ ] `Modules/` (app-specific systems)
- [ ] `Releases/` (built artifacts)
- [ ] `Artifacts/` (exports, media masters, generated outputs)
- [ ] `Inbox/` `Outbox/` (explicit intake/outflow)
- [ ] `Runs/` (quarantined; ignored by indexing tools)
- [ ] `_index/` (curated indexes; no scans)

### SOT markers (make “truth” explicit)
- [ ] Add a tiny `SOT.json` in `_CANON/` describing:
  - canonical paths
  - which docs are canon
  - the active port registry file

### Canon doc set (start with 7)
These are the “small list” that must stay accurate:
- [ ] `_CANON/SOT.json` (source-of-truth map)
- [ ] `_CANON/PORT_REGISTRY.json` (what exists + URLs + health + data paths)
- [ ] `_CANON/STACKS.md` (stack list + compose paths + owners)
- [ ] `_CANON/STORAGE.md` (mounts, shares, Windows mapping, permissions)
- [ ] `_CANON/SECRETS.md` (where secrets live + how they’re mounted)
- [ ] `_CANON/RUNBOOKS.md` (golden commands + “how to restart X safely”)
- [ ] `_CANON/INDEX_PATHS.md` (curated discovery index; replaces scanning)

---

## 3) Windows Share Compatibility (Samba)

### Shares (match names to keep muscle memory)
- [ ] Samba share `NXDrive` → `/srv/NXDrive`
- [ ] Samba share `AeroDrive` → `/srv/AeroDrive`
- [ ] Restrict to user `glyph`

### Parallel operation tip (avoid drive-letter collisions)
When both servers exist:
- Map NXCore-Alt to **different drive letters** (example):
  - `Y:` → `\\nxcore-alt\NXDrive` (or `\\<tailscale-ip>\NXDrive`)
  - `W:` → `\\nxcore-alt\AeroDrive`

---

## 4) Docker & Compose Conventions (Non-negotiable)

### Canonical stack layout
- [ ] All stacks live in: **`/opt/stacks/<stack-name>/`**
  - `docker-compose.yml`
  - `.env` (not in git)
  - `README.md` (runbook-lite)

### Persistent data layout
- [ ] Persist volumes under: **`/srv/NXDrive/volumes/<stack>/<service>/`**
- [ ] Never let volumes default to anonymous docker volumes for important services

### Compose naming
- [ ] Stack name prefix standard (example): `nxalt_<stack>`
- [ ] Container names predictable (avoid random suffix reliance)

### Environment files
- [ ] `.env` is the only required per-stack secret/config surface
- [ ] `.env.example` may exist in repo, but **never real secrets**

---

## 5) Reverse Proxy Standard (Traefik)

### One proxy to rule them all
- [ ] Traefik stack is first-class: `/opt/stacks/traefik/`
- [ ] All HTTP services publish via Traefik labels

### Routing conventions
- [ ] Host rules use MagicDNS names (preferred): `app.nxcore-alt` or `nxcore-alt:port`
- [ ] Maintain a single dynamic config folder (if used):
  - `/opt/stacks/traefik/dynamic/`

---

## 6) Port Registry (Required Day 0)

### File location
- [ ] Create: **`/srv/NXDrive/_CANON/PORT_REGISTRY.json`** (or `.md` if you prefer)

### Required fields per service
Each entry must include:
- [ ] service name
- [ ] stack name
- [ ] internal port
- [ ] external port
- [ ] URL(s)
- [ ] health endpoint
- [ ] data path(s)
- [ ] compose path
- [ ] quick commands (logs, restart)

> Rule: **If it’s not in the registry, it doesn’t exist.**

---

## 7) Secrets Handling (Minimal, Fast, Safe)

### Simple pattern (start here)
- [ ] Secrets root: `/srv/NXDrive/_secrets/`
- [ ] One folder per stack: `/srv/NXDrive/_secrets/<stack>/`
- [ ] `.env` files stored here, then symlinked into `/opt/stacks/<stack>/.env`
- [ ] Permissions: `chmod 700` on `_secrets`, `chmod 600` on env files

### Later upgrade (optional)
- sops/age or vault—only when you feel the pain.

---

## 8) “Ship Lane” (So Things Actually Finish)

### Canonical dev vs release separation
- [ ] Dev repos/worktrees live under: `/srv/NXDrive/Projects/`
- [ ] Built artifacts live under: `/srv/NXDrive/Releases/`
- [ ] A single “ready to clone/install” shelf:
  - `/srv/NXDrive/Apps/` (mirrors your existing habit)

### Release rule
- [ ] Every release bundle includes:
  - `README_RUN.md` (how to run)
  - `compose/` (if it’s a stack)
  - `PORTS.md` (ports & URLs)
  - `DATA.md` (volumes/paths)

---

## 9) Scan Safety (Do Not Freeze the Box)

### Doctrine
- **Never** scan drive roots for discovery.

### Preferred discovery model
- [ ] Maintain a curated index file:
  - `/srv/NXDrive/_index/INDEX_PATHS.md`
  - entries are: path + 1-line description + owner + last touched date

### Ignore zones (default)
- [ ] `Runs/`
- [ ] `json_inbox/`
- [ ] `node_modules/`, `.git/`, large caches

---

## 10) Minimal Resilience (No Heavy Overhaul)

This is the “smart forward” minimum—fast to set, avoids disasters.

### Minimal config backup
- [ ] Nightly tar (7-day rotation) of:
  - `/opt/stacks`
  - `/srv/NXDrive/_CANON`
  - `/srv/NXDrive/_secrets`
  - (optional) `/srv/NXDrive/_index`

Store to:
- `/srv/AeroDrive/backups/nxcore-alt/`

### Minimal health check
- [ ] A single script that outputs:
  - `docker ps` summary
  - disk usage (`df -h`)
  - failed containers (restart loops)

No alerting systems until AVCC is wired to display it.

---

## 11) AVCC-First Integration (Make It the Doorway)

### AVCC becomes default entry point
- [ ] AVCC shows **NXCore** and **NXCore-Alt** as top-level environments
- [ ] Each app card supports two targets (current vs alt)
- [ ] Migration becomes “flip links,” not “rebuild habits”

### Required AVCC pages for adoption
- [ ] Home (“Start Here”)
- [ ] Apps (authoritative directory, status + latency)
- [ ] Board (Now/Next/Parked/Shipped; NOW max 2)
- [ ] Search (apps + canon docs + indexes)

---

## 12) Bootstrap Order (Do These In Sequence)

1) **Identity & access** (hostname, glyph, SSH keys, Tailscale)
2) **Mounts + folder taxonomy** (`/srv/NXDrive` structure + SOT.json)
3) **Samba shares** (NXDrive/AeroDrive, glyph-only)
4) **Docker base + compose conventions** (`/opt/stacks`, volumes path)
5) **Traefik stack** (routing standard)
6) **Port registry** (create + enforce)
7) **Secrets root + symlink pattern**
8) **Ship lane folders** (Projects/Releases/Apps)
9) **Minimal backups** (nightly tar rotation)
10) **AVCC wiring** (make it the doorway, then add apps)

---

## 13) Definition of “NXCore-Alt Ready”
NXCore-Alt is “ready” when:
- [ ] You can map a Windows drive to it without confusion
- [ ] Traefik routes at least one test app
- [ ] Port registry is real and being used
- [ ] A nightly config+secrets backup exists
- [ ] AVCC can list at least 5 apps with correct links

---

### Notes
- Keep this checklist in `_CANON/` once you bless it.
- Anything that violates conventions gets parked, not merged.
