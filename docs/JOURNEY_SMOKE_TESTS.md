# Journey Smoke Tests

**Context:** Feb 2026 audit notes and verification logs were moved to [`archived/`](./archived/README.md). This file stays **active** for ongoing manual QA.

Run in **incognito** (or clear localStorage) to simulate a first-time visitor.

**Path tested:** Root → Playlist → EP-001 → Training → Orchard (and Publish step if present).

**Shareholder Season 1 (side lane):** Playlist shows `Shareholder Season 1` distinct from Core Day 1 → Training Hub card opens `bytecast-season1.html` → S1-EP-01 loads with lane banner → no Golden Path badge regression.

## Scoring convention

- `PASS`: no console errors, nav works, and progress persists after refresh.
- `WARN`: works, but console warnings or minor UX issues.
- `FAIL`: broken nav, missing data, or runtime error.

---

## 2026-07-07 (EOD pause)

Session complete through Shareholder Season 1 pack wiring. **Handoff:** [`HANDOFF_2026-07-07.md`](./HANDOFF_2026-07-07.md).

| Step | URL/Page | Expected | Result | Notes |
|------|----------|----------|--------|-------|
| 1 | seed_bytecast.html | Shareholder Season 1 group; Open → `episodes/shareholder_s1_ep01/index.html` | _pending_ | Fixed 2026-07-07 |
| 2 | episodes/training_hub/index.html | Portal + 6 S1 episode cards | _pending_ | |
| 3 | bytecast-season1.html | All 6 players load in iframe | _pending_ | |
| 4 | Season 1 audio | All 6 briefings play audio | _blocked_ | AAC/MP3 not in repo |
| 5 | bytecast-ep01.html | Lane banner: not Day 1 onboarding | _pending_ | |
| 6 | p1_golden_path smoke | Golden Path unchanged | WARN | Playwright 2026-07-06: 4 passed, 1 failed — EP-001 `#audio` visibility timeout (pre-existing) |

---

## 2026-02-10 (Follow-up)

| Step | URL/Page | Expected | Result | Notes |
|------|----------|----------|--------|-------|
| 1 | index.html | Loads, primary doors visible | _pending_ | |
| 2 | seed_bytecast.html | Registry loads, episode list renders | _pending_ | |
| 3 | EP-001 (episodes/welcome_to_bytecast) | Player + map render, progress key updates | _pending_ | localStorage key: _document if used_ |
| 4 | episodes/training_hub/index.html | Journey map visible, links correct | _pending_ | |
| 5 | Orchard (seed_builder_studio/seed_orchard_ui) | Map renders, return paths work | _pending_ | |
| 6 | Publish step (if present) | URL capture / badge flow | _pending_ | |

**Browser + mode:** _e.g. Chrome incognito, Safari iOS_  
**Console errors:** _note any_

---

## How to run

1. Open an incognito/private window.
2. Navigate to workspace root (local server or GitHub Pages base URL).
3. Follow the path above; at each step verify the “Expected” column.
4. Update this table with PASS/FAIL and any notes; add console errors at the bottom of the run.

---

## Automated Testing (Playwright)

Automated tests are now available! See `tests/README.md` for setup and usage.

**Quick start:**
```bash
npm install
npx playwright install
npm test
```

**Test suites:**
- `npm run test:navigation` - Basic navigation smoke tests
- `npm run test:golden-path` - Full Golden Path journey
- `npm run test:seeding` - Seeding Track journey
- `npm run test:division` - Division Track journey

The Playwright tests cover the same paths as manual testing but automate verification of:
- Page loads and navigation
- localStorage persistence
- Step completion tracking
- Badge minting
- Console error detection


