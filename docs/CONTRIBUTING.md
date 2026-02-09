# Contributing

This repo is built so non-coders and coders can both ship useful work.

## Quick Start

1. Pick a lane:
   - Testing and bug reports
   - Docs and onboarding
   - Content and copy
   - UI polish
   - Code fixes and features
2. Open `FIRST_TASKS.md` and choose one task.
3. Make one small change.
4. Share what changed and how you tested it.

## Contributor Ladder

### Level 0 - Tester / Doc helper
- Find bugs, UX confusion, and edge cases.
- Improve guides, FAQs, and walkthrough clarity.

### Level 1 - No-code changes
- Update Markdown, JSON content, and copy.
- Add examples, clean headings, and improve structure.

### Level 2 - UI-only edits
- Improve spacing, typography, responsive behavior, and accessibility.
- No logic changes required.

### Level 3 - Small code fixes
- Fix bugs in app behavior.
- Add small features with clear acceptance criteria.

### Level 4 - Features and refactors
- Own end-to-end features.
- Improve architecture, tests, and developer workflows.

## Guild Model (Optional)

- Scout Guild: testing, bug reports, reproduction steps.
- Scribe Guild: docs, tutorials, onboarding, FAQs.
- UX Guild: layout, accessibility, interaction quality.
- Lore Guild: story/content for ByteCast and experiences.
- Ops Guild: triage, labels, backlog hygiene, release notes.

## High-Impact Non-Coder Work

1. Testing and bug reports
   - Include page, exact steps, expected vs actual, device/browser, media.
2. Docs improvements
   - Getting started guides, common mistakes, and quick fixes.
3. Content and copy
   - UI text, onboarding copy, release notes, changelog updates.
4. UX feedback
   - Confusing flows, missing states, contrast/font-size issues.
5. Data and structure
   - Curate JSON content, examples, and category/tag cleanup.

## Bug Report Template (Use This)

- What page/feature?
- What did you click/type?
- What happened?
- What should have happened?
- Device/browser
- Screenshot/video

## Local Preview

### Offer Pack App
From `aerovista_offer_pack/app/`:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

### Seed Orchard UI
Open `seed_orchard_ui/index.html` directly, or serve from repo root:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/seed_orchard_ui/`.

## Labels to Use

- `good-first-issue`
- `no-code`
- `docs`
- `testing`
- `json-only`
- `ui-only`
- `help-wanted`

## Pull Request Checklist

- Change is scoped and clear.
- Paths changed are listed in the PR.
- Steps to test are included.
- Screenshots or short video are included for UI changes.
- Docs are updated when behavior changes.
