# ByteCast Pulse feed

**Updated:** 2026-07-07  
**Runtime file:** [`data/pulse.json`](../data/pulse.json)  
**Rendered on:** Employee home → **What's new** (`episodes/training_hub/index.html`)

## Purpose

Ship company signals and briefings by editing **one file** — no changes to `episode_registry.json`, `journey_steps.json`, or `modules.json` required for each new pulse item.

Pulse content is **optional signal** (BriefingSync). It does not gate Golden Path or Day 1 proof.

## When to use Pulse

| Ship via Pulse when… | Ship via Path/modules when… |
|----------------------|-----------------------------|
| Company news or strategic briefing | Employee must learn a skill |
| Optional listen / signal | Quiz or proof required |
| New comms, rollout, stakeholder update | Onboarding or mission lane |

**Guardrail:** Shareholder briefings are a Pulse **series**, not the product identity. See [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md).

## File shape

```json
{
  "schema": "bytecast-pulse-feed-v1",
  "updated_on": "2026-07-07",
  "series": [
    {
      "id": "shareholder_season1",
      "title": "Company Briefings — Season 1",
      "description": "Short series description.",
      "portal_href": "bytecast-season1.html",
      "sort_order": 10
    }
  ],
  "items": [
    {
      "id": "pulse-s1-01",
      "series_id": "shareholder_season1",
      "title": "Briefing 1: Title for humans",
      "summary": "One-line summary.",
      "href": "episodes/shareholder_s1_ep01/index.html",
      "published_on": "2026-02-01",
      "sort_order": 1,
      "type": "signal",
      "teaching_mode": "BriefingSync"
    }
  ]
}
```

### Fields

| Field | Required | Notes |
|-------|----------|-------|
| `items[].id` | Yes | Unique stable id (`pulse-...`) |
| `items[].series_id` | Yes | Must match a `series[].id` |
| `items[].title` | Yes | Human-facing label (not `S1-EP-01` in UI) |
| `items[].summary` | Recommended | Card blurb on home |
| `items[].href` | Yes | Repo-root-relative path to episode pack |
| `items[].published_on` | Recommended | ISO date string for display |
| `items[].sort_order` | Recommended | Lower = earlier in feed |
| `series[].portal_href` | Optional | Link to season portal or index |

Paths in `href` and `portal_href` are **repo-root-relative** (e.g. `episodes/shareholder_s1_ep01/index.html`). The home shell resolves them with `../../`.

## Add a new briefing (checklist)

1. Episode pack exists under `episodes/<slug>/` (or legacy player with redirect).
2. Add one row to `data/pulse.json` → `items[]`.
3. Optionally add or update `series[]` if starting a new Pulse series.
4. Bump `updated_on`.
5. Deploy — home **What's new** updates automatically.

You do **not** need to edit Training Hub `modules.json` for Pulse-only visibility. Keep shareholder episode modules in the catalog for **All training** search only.

## Related docs

- [`BYTECAST_PRODUCT_DIRECTION.md`](./BYTECAST_PRODUCT_DIRECTION.md) — Pulse → Path → Depth
- [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md) — BriefingSync teaching mode
- [`PLATFORM_STATUS.md`](./PLATFORM_STATUS.md) — deploy snapshot
