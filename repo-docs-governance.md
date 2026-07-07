## Repo Documentation Governance (copy to other repos)

Purpose: keep **code**, **config**, and **documentation** aligned over time. This file is meant to be copied into every repo and followed as a shared operating standard.

### Source of truth policy (non-negotiable)

- **Code/config is runtime truth**: what actually runs in prod/local.
- **Docs are intent + ops truth**: why it exists, what we’re trying to achieve, how to operate it safely and repeatably.
- **When they disagree**:
  - If docs describe behavior that doesn’t exist: **fix docs** (or implement the code change intentionally).
  - If code changed but docs didn’t: **fix docs in the same change window** (same PR/commit if using git).

### Minimum required docs set (per repo)

Keep these in `/docs/` unless the repo is extremely small:

- **`docs/docs_index.md`**
  - Canon entrypoints (“what ships”)
  - Local run instructions (and ports)
  - Deploy procedure (and environment/config knobs)
  - Links to the other docs
- **`docs/codebase-map.md`** (or equivalent)
  - Canonical “edit here” list
  - Known duplicates + which file wins
  - “Legacy / do-not-edit” areas
- **Runbook / operator notes**
  - e.g. Docker/Traefik notes, hosting notes, health checks, log locations
- **QA checklist(s) for money paths / critical flows**
  - Booking, payment, forms, auth, etc.

If a repo cannot support this structure, the README must cover the same content explicitly.

### SOT (Source of Truth manifest) rules

If you use a `SOT.json` (or similar manifest), treat it as the repo’s **canonical audit map**:

- **Keep one canonical SOT per repo** at repo root (preferred): `SOT.json`.
- **List canon files/folders explicitly** (entrypoints, configs, deploy scripts, schemas, primary docs).
- **Record runtime/deploy facts**:
  - ports, URLs, entry commands, compose files, reverse proxy notes
- **When files move or deployment behavior changes**:
  - update `SOT.json` in the same change window
- **Duplicate SOT files are not canon** unless explicitly adopted:
  - call them out in `docs/codebase-map.md` and/or delete/archive when safe.

### Canon vs duplicates (how to prevent drift)

- **Canonical files**: the single file you expect a dev/operator to edit for a given concern.
- **Duplicates**: copies/fallbacks/legacy.
- **Rules**:
  - Every duplicated concept must have an explicit winner documented (example: “pricing JSON winner is X”).
  - If duplicates are required for deployment (mirrors/fallbacks):
    - document the sync mechanism (generator/script) and the outputs it writes
    - add a warning that editing only one output creates drift
  - If duplicates are NOT required: deprecate them and/or move them to `archive/` with a note.

### Configuration management rules

- Prefer **one edit surface** + **generated outputs** when multiple deploy bundles need the same config.
- If you support both “generator” and “manual” workflows:
  - document both
  - mark one as preferred
  - include the “never edit only one output” rule when mirrored configs exist
- Never place secrets directly in HTML/committed config unless explicitly approved for public repos.

### Change control rules (what must be updated when things change)

When any of the following change, docs and SOT must be updated in the same change window:

- **Entrypoints** (new homepage file, new app route, new service)
- **Ports / URLs / hostnames**
- **Deploy procedure** (compose files, reverse proxy, hosting)
- **Config schema** (env keys, config objects)
- **Critical flows** (booking/payment/forms/auth)

### Lightweight audit checklist (run periodically)

- **Entrypoints sanity**
  - `docs/docs_index.md` matches actual entrypoints in code.
- **Config sanity**
  - documented config keys exist in config files and are actually used.
  - generator scripts still write all documented outputs.
- **Ports and run commands**
  - docs match compose files / start commands.
- **Duplicates**
  - all known duplicates have a documented winner and sync/deprecation plan.
- **Operator readiness**
  - a new operator can run locally and understand deploy steps from docs alone.

### Standard of done (for future work)

A change is not “done” until:

- The runtime behavior exists in code/config **and**
- Docs describe the intent + operation accurately **and**
- `SOT.json` (if used) reflects the new canon paths and runtime/deploy truth.

