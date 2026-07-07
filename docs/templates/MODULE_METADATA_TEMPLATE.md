# Module metadata template â€” `training_hub/data/modules.json`

Add one object to the `modules` array (shape must match existing file â€” adjust keys if the manifest schema evolves).

```json
{
  "id": "[stable_module_id]",
  "title": "[Learner-facing title]",
  "summary": "[One line â€” what this module does]",
  "category": "[e.g. orientation | system_model | application | internal]",
  "status": "[draft | ready | legacy]",
  "href": "[root-relative path, e.g. episodes/training_missions/tr_001_golden_path/index.html]",
  "journey_step_id": "[optional â€” id from journey_steps.json]",
  "proof": {
    "understanding_check": "[quiz | checklist | none]",
    "meta_fields_required": ["list keys stored via markStepDone"],
    "teacher_review": true
  },
  "notes_maintainer": "[internal â€” not shown to learners if your hub filters by audience]"
}
```

**Rules**

- `id` must stay stable once learners have bookmarks.
- `proof.meta_fields_required` must match journey `minProof` / `unlock_requires` for that step.
- Mark `status: "legacy"` until converted to the training standard.


