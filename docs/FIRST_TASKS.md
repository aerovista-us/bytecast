# First Tasks

Safe, high-impact starter tasks with clear completion criteria.

## Level 0 - Testing and Bug Reports

1. Offer Pack app smoke test
   - Path: `aerovista_offer_pack/app/index.html`
   - Do:
     - test Home, Divisions, Sales, Delivery, Intake, Pricing, Bundles, One-pager
     - test Search (`Ctrl+K`), theme toggle, print button
     - test on mobile + desktop widths
   - Done when:
     - you submit one issue with reproducible steps and screenshots/video

2. Edge-case input test
   - Path: `aerovista_offer_pack/app/app.js`
   - Do:
     - try very long filter/search input
     - test empty states and no-results behavior
   - Done when:
     - issue includes expected vs actual behavior and browser/device details

## Level 1 - No-Code Tasks

1. Improve app onboarding copy
   - Path: `aerovista_offer_pack/app/README.md`
   - Do:
     - tighten quick-start wording for non-coders
     - add a "common mistakes" section
   - Done when:
     - README has a clear 60-second start path

2. Add FAQ for contributors
   - Path: `docs/README.md`
   - Do:
     - add a short FAQ section:
       - "Where do I start?"
       - "How do I report a bug?"
       - "How do I edit content without coding?"
   - Done when:
     - FAQ answers each in 2-4 lines

3. Improve content quality in offer data
   - Path: `aerovista_offer_pack/app/data/offer-pack-data.json`
   - Do:
     - pick 2-3 offers and improve clarity:
       - outcomes
       - includes
       - client-provided items
   - Done when:
     - text is clearer and avoids jargon

## Level 2 - UI-Only Tasks

1. Improve small-screen readability
   - Path: `aerovista_offer_pack/app/styles.css`
   - Do:
     - adjust spacing/font sizes for <= 420px
   - Done when:
     - no clipped buttons or text overlap

2. Accessibility pass on focus styles
   - Path: `aerovista_offer_pack/app/styles.css`
   - Do:
     - verify all interactive controls have visible `:focus-visible`
   - Done when:
     - keyboard traversal is clear across all sections

## Level 3 - Small Code Fixes

1. Search relevance tuning
   - Path: `aerovista_offer_pack/app/app.js`
   - Do:
     - rank exact matches above partial matches
   - Done when:
     - first result is usually the most likely target

2. Persistent "last view" restore
   - Path: `aerovista_offer_pack/app/app.js`
   - Do:
     - save last visited non-offer view in localStorage
     - restore it on next load
   - Done when:
     - app opens on previous section after refresh

## Level 4 - Feature Work

1. Contributor playground area
   - New path suggestion: `contrib_playground/`
   - Do:
     - add tiny tasks with expected output examples
   - Done when:
     - newcomers can complete one task in <20 minutes

2. Guided issue intake wizard
   - Path: `aerovista_offer_pack/app/`
   - Do:
     - create a lightweight "report a bug" guided flow
   - Done when:
     - reports include consistent context fields
