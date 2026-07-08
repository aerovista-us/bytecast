## ByteCast catalog (single source of truth)

**Updated:** 2026-07-08  
**Source file:** `data/catalog.json`  
**Sync script:** `scripts/sync-catalog.mjs`

### What this replaces

`data/catalog.json` is now the **single source of truth** for:

- Runtime episode registry: `data/episode_registry.json`
- Builder mirror: `.CODEX/episode_registry.json`
- Employee home / module catalog: `episodes/training_hub/data/modules.json` + mirror `episodes/training_hub/modules.json`
- Pulse feed: `data/pulse.json`

### Commands

From repo root:

```bash
# One-time (initial creation from existing files)
npm run bootstrap:catalog

# Canonical: regenerate all mirrors from the catalog
npm run sync:catalog

# Validate mirrors match catalog
node scripts/check-episodes.mjs
```

### Rules

- Edit **only** `data/catalog.json` for registry/module/pulse changes.
- Run `npm run sync:catalog` before commit so mirrors stay aligned.
- `scripts/check-episodes.mjs` will fail if mirrors drift.

