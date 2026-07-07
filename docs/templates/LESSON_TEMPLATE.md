# Lesson template — ByteCast pack

Replace bracketed fields. Remove comments before publish if desired.

---

## Metadata

| Field | Value |
|-------|--------|
| Lesson id | `[e.g. ep001_welcome / tr_001_golden_path]` |
| Journey step id(s) | `[e.g. ep001_engage, tr001_golden_path]` |
| Owner | `[name]` |
| Last updated | `[ISO date]` |

## 1. Objective

After this lesson, the learner can: **[one measurable capability].**

## 2. Why it matters

**[2–4 sentences: consequence of not knowing; link to loop / quality / mission.]**

## 3. Teach

**Primary modality:** [audio / slides / reading / interactive]

- **[Point 1]**
- **[Point 2]**
- **[Point 3]**

## 4. Check (understanding)

**Type:** [quiz | scenario checklist | rubric]

**Pass rule:** [e.g. ≥80% correct / all must-check items checked / reviewer approves]

**Maps to `meta` fields:** [e.g. `understandingCheckPassed`, `quizScore`]

## 5. Apply

**Task:** [single concrete action]

**Success signal:** [what the learner sees when done]

## 6. Prove (artifact)

**Proof type:** [short_text | url | json_export | screenshot_ref | combined]

**Required `meta` keys:** `[list — must match journey minProof / unlock_requires]`

## 7. Advance

**Unlocks when:** [completion + understanding + proof fields as specified]

**Next step id / link:** `[from journey_steps.json]`

## Pack integration checklist

- [ ] Calls `ByteCastLoop.markStepDone` only when rules above are satisfied.
- [ ] `meta` includes all keys required by badge `minProof` for this step.
- [ ] Copy matches Training Standard section order for learner-facing UI where applicable.
