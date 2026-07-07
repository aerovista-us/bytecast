# ByteCast proof schema & lesson state

**Version:** `bytecast-proof-bundle-v1` / `bytecast-lesson-state-v1` (conceptual)  
**Related:** [`LOOP_STANDARD.md`](./LOOP_STANDARD.md), [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md)

## Lesson state model (four layers)

Stored primarily under `workflow.v2.<journeyId>.steps[stepId]`:

| Layer | Meaning | Typical storage |
|-------|---------|-----------------|
| Completion | Surface / gate done | `done`, `doneAt` |
| Understanding | Check passed | `meta.understandingCheckPassed`, `meta.*QuizScore`, etc. |
| Proof | Auditable artifact | `meta` fields referenced by `minProof` and `unlock_requires` |
| Advancement | Unlocked next step | Computed: `depends_on` + `isStepComplete` + `unlock_requires` satisfied |

## Journey JSON extensions

### `unlock_requires` (optional, per step)

Array of objects:

```json
"unlock_requires": [
  {
    "stepId": "tr001a_day1_foundations",
    "meta_fields": [
      "mission",
      "understandingCheckPassed",
      "tr001aQuizPassed",
      "tr001aQuizScore",
      "tr001aWritten1",
      "tr001aWritten2",
      "tr001aScenarioRouting",
      "tr001aCompletedAt"
    ]
  }
]
```

Before a step is **unlocked**, the engine requires each listed `stepId` to have **non-missing** values for every `meta_field` (see validation rules below).

### `minProof` (on badges, unchanged shape)

Map of `stepId` → array of required `meta` keys. Extended to include sub-steps such as `ep001_engage` when those fields are part of badge issuance.

## Field validation rules (engine)

For each required field `f` on `meta`:

- **Missing** if `meta[f] == null` or `undefined`
- **String:** missing if trim length is 0
- **Boolean:** missing if not strictly `true` (when used for pass flags)
- **Number:** missing if not finite

Typed rules (e.g. URL pattern, minimum quiz score) may be added in future engine versions; packs should still store explicit pass flags.

## Proof types (taxonomy)

| Type | Description | Example meta keys |
|------|-------------|-------------------|
| `quiz_episode` | Episode quiz pass | `engageQuizPassed`, `engageQuizScore` |
| `quiz_training` | Training quiz pass | `understandingCheckPassed`, `trQuizScore` |
| `short_text` | Learner explanation | `proofExplain`, `tr001aWritten1`, `tr001aWritten2` |
| `day1_foundations` | TR-001A composite | `tr001aQuizPassed`, `tr001aQuizScore`, `tr001aScenarioRouting`, `tr001aCompletedAt`, plus `mission`, `understandingCheckPassed` |
| `json_export` / `zip_export` | Seed artifact | `artifactName`, `artifactHash` |
| `publish_url` | Live URL | `publishedUrl` |
| `screenshot_ref` | External evidence pointer | `screenshotUrl` (future) |
| `badge_eligibility` | Composite | Derived from `minProof` satisfaction |

## Proof export bundle

JSON object:

- `schema`: `"bytecast-proof-bundle-v1"`
- `exportedAt`: ISO timestamp
- `journeyId`: string
- `workflow`: full v2 workflow object for that journey
- `badges`: array from `bytecast.badges.v1`
- `projects` (optional): dated workstreams — onboarding tracks, collaboration windows, maintenance — see below

Machine-readable JSON Schema: [`proof_bundle_v1.schema.json`](./proof_bundle_v1.schema.json)

### `projects` (optional)

Use when the bundle should carry **planning or audit context** next to proof: what initiative the learner or team is in, and key dates. Not required for badge validation; engines may ignore it.

| Field | Required | Meaning |
|-------|----------|---------|
| `id` | yes | Stable slug |
| `title` | yes | Human label |
| `kind` | no | e.g. `onboarding`, `collaboration`, `maintenance` |
| `summary` | no | One-line scope |
| `startDate` | no | ISO date `YYYY-MM-DD` |
| `targetDate` | no | ISO date target or wrap-up |
| `milestones` | no | `{ label, due?, done? }[]` |

**Example — Bytecast onboarding + collab on known issues:**

```json
"projects": [
  {
    "id": "bytecast-onboarding-v1",
    "title": "Bytecast onboarding",
    "kind": "onboarding",
    "summary": "TR-001A foundations through proof bundle export and day-1 spine",
    "startDate": "2026-03-20",
    "targetDate": "2026-04-15",
    "milestones": [
      { "label": "Day 1 foundations step complete", "due": "2026-03-25", "done": false },
      { "label": "First proof bundle export reviewed", "due": "2026-03-28", "done": false },
      { "label": "Golden path day 2 track started", "due": "2026-04-05", "done": false }
    ]
  },
  {
    "id": "collab-known-issues-q1",
    "title": "Collaborating on fixing known issues",
    "kind": "collaboration",
    "summary": "Shared triage + patches for audit findings (e.g. glitch_bitch, proof schema)",
    "startDate": "2026-03-24",
    "targetDate": "2026-04-30",
    "milestones": [
      { "label": "Issue list agreed and prioritized", "due": "2026-03-26", "done": false },
      { "label": "Import/export fixtures documented", "due": "2026-03-27", "done": true },
      { "label": "Hardening pass scheduled", "due": "2026-04-10", "done": false }
    ]
  }
]
```

## API

`ByteCastLoop.buildProofBundle(journeyId?)` returns the bundle object.  
`ByteCastLoop.proofMetaOk(wf2, stepId, fields)` returns `{ ok, missing }`.

## TR-001A — Day 1 Foundations (`tr001a_day1_foundations`)

Typical `meta` after a successful submit:

```json
{
  "mission": "tr_001a_day1_foundations",
  "understandingCheckPassed": true,
  "tr001aQuizPassed": true,
  "tr001aQuizScore": 0.875,
  "tr001aMcCount": 8,
  "tr001aWritten1": "ACOS is the visibility cockpit...",
  "tr001aWritten2": "SOT protects against ambiguity and assuming the newest file is official...",
  "tr001aScenarioRouting": "playlist_then_docs",
  "tr001aCompletedAt": "2026-03-22T12:00:00.000Z",
  "tr001aRecommendedNext": "seed_orchard — Seed export & publish (Golden Path Day 2 track)",
  "tr001aPassOutcome": "pass",
  "version": "2026-03-22-tr001a-v2"
}
```

- **MC:** eight items; UI pass threshold is **≥80%** (7 of 8 correct).
- `tr001aScenarioRouting` must equal `playlist_then_docs` when the learner picked the correct ordering (Playlist → Docs Portal).
- Optional fields (`tr001aMcCount`, `tr001aRecommendedNext`, `tr001aPassOutcome`, `version`) are not required by `proofMetaOk` defaults but are useful for teacher review and audits.

**Updated:** 2026-03-24 (`projects` on proof bundle documented + schema)
