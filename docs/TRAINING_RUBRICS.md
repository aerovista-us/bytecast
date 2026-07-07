# Training rubrics — teacher acceptance & learner proof

Companion: [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md).

## A. Teacher acceptance rubric (module / lesson QA)

Use before marking a module `ready`.

| Criterion | Pass |
|-----------|------|
| Objective | Single sentence; measurable; matches content. |
| Check | Pass threshold documented; aligns with `meta` fields. |
| Proof | Required artifacts listed; match `minProof` in `journey_steps.json`. |
| Advance | Next step and unlock rules are accurate in UI copy. |
| Accessibility | Legible contrast; keyboard path for primary actions; no sole reliance on color for pass/fail. |
| Honesty | No “complete” without check when a check exists. |

**Reviewer:** _______________ **Date:** _______________ **Module id:** _______________

## B. Learner proof rubric (per submission)

Teachers use exported proof bundles ([`proof_review.html`](./proof_review.html)) or pasted JSON.

| Field type | Pass | Rework |
|------------|------|--------|
| Quiz / understanding | Meets journey threshold | Below threshold or missing |
| Short text (`proofExplain`) | ≥20 chars; answers prompt; on-topic | Empty, generic, or off-topic |
| URL (`publishedUrl`) | Valid `http(s)://` pattern; reachable spot-check | Missing or obviously invalid |
| Export (`artifactName` / `artifactHash`) | Both present; hash non-trivial length | Either missing |
| Checkpoints / missions | Counts match declared totals | Inconsistent or missing |

**Overall:** ☐ Pass ☐ Rework ☐ Needs human follow-up

**Teacher sign-off:** _______________ **Date:** _______________

## C. Sign-off as a visible step

Record sign-off in your program tracker ([`mini.shops/AV_Onboarding_and_Training`](../AV_Onboarding_and_Training/)) — training is **not** trusted until evidence + sign-off exist.
