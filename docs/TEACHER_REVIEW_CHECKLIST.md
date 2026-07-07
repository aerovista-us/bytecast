# Teacher review checklist — Golden Path (Day 1 spine)

Start at [`teacher_review.html`](./teacher_review.html) for navigation. Use [`proof_review.html`](./proof_review.html) to paste bundles and [`TRAINING_RUBRICS.md`](./TRAINING_RUBRICS.md) for rubrics.

## Before review

- [ ] Learner sent a **proof bundle** (`bytecast-proof-bundle-v1`) or you have workstation access to export it.
- [ ] **Export (learner browser):** DevTools console on any ByteCast page with `bytecast_loop.js`:  
  `copy(JSON.stringify(ByteCastLoop.buildProofBundle("p1_golden_path"), null, 2))` then paste into a file or email.
- [ ] Active journey id is **`p1_golden_path`** (or note deviation).

## Evidence rows

| Check | Pass criteria |
|-------|----------------|
| EP-001 engage | `engageQuizPassed === true`, `engageQuizScore` finite |
| EP-002 engage | same quiz meta shape on `ep002_engage` |
| EP-003 engage | same on `ep003_engage` |
| EP-004 engage | same on `ep004_engage` |
| TR-001A | `mission`, `understandingCheckPassed`, `tr001aQuizPassed`, `tr001aQuizScore` (≥0.8 on **8** MC items → 7+/8), `tr001aWritten1` / `tr001aWritten2` substantive (≥20 chars UI), `tr001aScenarioRouting === "playlist_then_docs"`, `tr001aCompletedAt` ISO string · optional: `tr001aMcCount`, `tr001aRecommendedNext`, `tr001aPassOutcome` |
| Seed export | `artifactName` + `artifactHash` non-empty |
| Publish | `publishedUrl` valid https? http? pattern |
| Badge | `p1_golden_path_v1` present only after engine `minProof` satisfied |

**Legacy:** `tr001_golden_path` may still appear in old bundles; Golden Path issuance now expects **TR-001A** proof fields.

## Decision

- [ ] **Pass** — meets rubric; sign below.
- [ ] **Rework** — specify which step + what to fix.
- [ ] **Escalate** — suspected gaming or ambiguous proof.

**Teacher:** __________________ **Date:** __________________

**Learner id / name:** __________________
