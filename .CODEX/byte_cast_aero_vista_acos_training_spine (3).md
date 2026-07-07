# ByteCast · AeroVista / AeroCoreOS Training Spine

## Core framing

This training teaches AeroVista as an operating model, not just a set of apps.

The learner should leave understanding:
- what AeroCoreOS.web is
- what it is not
- how it relates to AVCC
- how WO Processing fits in
- how the AeroVista Report System fits in
- why boundaries matter
- how to think like an operator inside the ecosystem

## Master promise

By the end of this path, a learner can explain the AeroVista stack in plain language, navigate the shell confidently, understand where truth lives, and avoid the most common architectural mistakes.

## Learning path structure

### Track 1 — Orientation
Purpose:
- build mental model before tooling detail

Modules:
1. What AeroVista is becoming
2. What AeroCoreOS.web is
3. Shell vs app vs service vs report
4. Why source-of-truth boundaries matter

### Track 2 — Shell fluency
Purpose:
- make the learner comfortable inside AeroCoreOS.web

Modules:
1. Start menu, lanes, windows, layout
2. Embedded apps and shell-native behavior
3. Diagnostics and dependency health
4. Prototype vs production shell

### Track 3 — Operational truth
Purpose:
- teach where structured execution data lives

Modules:
1. WO Processing basics
2. Inbox → normalize → alerts → report
3. What belongs in WO vs what does not
4. Read-only truth surfaces

### Track 4 — Reporting and memory
Purpose:
- teach where narrative context and durable memory live

Modules:
1. AeroVista Report System basics
2. Intake → extract → master index → publish
3. Tasks, decisions, ideas as operational memory
4. EOD/EOW as interpretation layer

### Track 5 — Cross-system thinking
Purpose:
- teach the relationship between shell, ledger, and reporting

Modules:
1. Execution truth vs reporting meaning
2. Shared IDs and metadata
3. Avoiding duplicate truth
4. Executive surfaces and leadership context

### Track 6 — Operator mindset
Purpose:
- train good judgment

Modules:
1. How to tell what is broken
2. How to identify shell issue vs upstream issue
3. How to think about policy, embed rules, and dependency ownership
4. How to work safely in an in-place project

## Suggested ByteCast episode sequence

### EP-001 — Welcome to the AeroVista Stack
Outcome:
- learner can describe the whole ecosystem in one minute

Key idea:
- AeroVista captures, structures, remembers, and publishes

### EP-002 — Meet the Shell
Outcome:
- learner can explain AeroCoreOS.web as the browser shell for the ecosystem

Key idea:
- the shell orchestrates; it does not own all business logic

### EP-003 — Shell vs Prototype
Outcome:
- learner can explain public/ vs src/ vs dist/

Key idea:
- prototype content is not the same thing as the production shell

### EP-004 — AVCC and Upstream Dependencies
Outcome:
- learner can explain why the shell depends on AVCC and services behind it

Key idea:
- a shell is only as useful as the systems behind it

### EP-005 — Work Orders as Operational Ledger
Outcome:
- learner understands WO Processing as structured execution truth

Key idea:
- inbox in, normalized truth out, alerts and reports published

### EP-006 — Reporting as Memory and Meaning
Outcome:
- learner understands the Report System as the narrative and memory layer

Key idea:
- reporting explains what happened, why it mattered, and what should happen next

### EP-007 — The Boundary That Protects Everything
Outcome:
- learner can explain why duplicate truth is dangerous

Key idea:
- execution state lives in ledgers; meaning lives in reports

### EP-008 — How to Read Failure
Outcome:
- learner can distinguish blocked iframe, app down, auth issue, route issue, and shell issue

Key idea:
- operators need readable failure states, not mystery breakage

### EP-009 — Registry, Policy, and Governance
Outcome:
- learner understands registry as control plane

Key idea:
- the catalog is governed infrastructure, not casual config

### EP-010 — Operator Flight Check
Outcome:
- learner can perform a practical shell health review

Key idea:
- trust comes from verifying runtime, dependency health, and deploy target clarity

## Training ladder by learner type

### New hire / non-technical operator
Focus:
- concepts
- navigation
- common mistakes
- how to tell who owns what

### Builder / maintainer
Focus:
- source-of-truth boundaries
- deploy path
- policy model
- tests and smoke checks

### Leadership / oversight
Focus:
- operational truth vs narrative reporting
- executive surfaces
- ownership clarity
- maturity roadmap

## Core concepts to drill repeatedly

- shell is orchestration, not everything
- AVCC remains a major dependency
- public is prototype, dist is production
- WO owns structured work-order state
- reporting owns EOD/EOW synthesis and memory
- master index is durable operational memory
- registry is governed infrastructure
- failure states should be readable
- one system should not silently become the owner of another system’s truth

## Suggested interaction blocks per episode

Each episode should include:
1. plain-language concept
2. system map
3. what good looks like
4. what drift looks like
5. one practical check or mini exercise
6. one badge/proof artifact

## Proof artifacts

Examples:
- explain the shell in one paragraph
- identify whether a scenario belongs to shell, AVCC, WO, or reporting
- sort example folders into source, runtime, artifact, or output
- review a fake incident and label the actual failure domain
- link a work-order item to a reporting summary without duplicating state

## Badge ideas

- Shell Scout
- Boundary Keeper
- Ops Cartographer
- Ledger Reader
- Report Weaver
- Dependency Detective
- Registry Ranger
- Core Shell Operator

## First build recommendation

Start with a 5-episode mini-path:
1. Welcome to the AeroVista Stack
2. Meet the Shell
3. Shell vs Prototype
4. Work Orders vs Reporting
5. Boundary Keeper

That sequence teaches the spine before going deep.

## Tone direction

The tone should feel:
- grounded
- practical
- confident
- not over-academic
- clear enough for operators
- sharp enough for builders

## ByteCast-specific framing

The experience should feel like being let into the map room.
The learner is not memorizing random tools.
The learner is learning where truth lives, how the shell fits around it, and how to move through AeroVista without creating confusion.

## Build-next recommendations

After the mini-path:
- create one role-based path for operators
- create one maintainer path for builders
- create one oversight path for leadership
- add lightweight scenario cards
- add one architecture map visual
- add one boundary quiz that uses real AeroVista examples

## Companion training path — AeroVista Business Suite Theme Direction

This companion path teaches learners how AeroVista product surfaces should feel when they are not acting as the OS shell.

Purpose:
- help learners distinguish shell aesthetics from business-suite aesthetics
- teach why theme direction is part of product architecture
- reinforce clarity, relationship awareness, and trust in cross-module UI

### Why this matters

AeroVista Business Suite should feel like a business nerve center, not another shell clone.
The theme direction emphasizes a dark executive workspace, relationship-aware cards, universal search, recent activity, modular context, and restrained premium styling.

### Key concepts to teach

- shell surface vs business-suite surface
- relationship-aware cards as intelligence objects
- universal search as center of gravity
- activity-first homepage patterns
- restrained premium styling over decorative futurism
- module accents within one shared AeroVista language
- why clarity beats ornament in extraction and cross-module tools

### Recommended ByteCast mini-path

#### EP-BS1 — Why This Is Not the Shell
Outcome:
- learner can explain why Business Suite should not visually behave like AeroCoreOS.web

Key idea:
- this product proves shared entities and cross-module business visibility, so the UI must prioritize clarity over shell theatrics

#### EP-BS2 — Theme as Operational Trust
Outcome:
- learner can identify how dark graphite, restrained glow, and modular accents support confidence and scanning

Key idea:
- theme is not decoration; it signals control, trust, and readability

#### EP-BS3 — Relationship-Aware Cards
Outcome:
- learner can explain why cards should surface linked entities, recent activity, and status in one compact unit

Key idea:
- cards are relationship surfaces, not just tiles

#### EP-BS4 — Search-Led Experience
Outcome:
- learner can explain why universal search should feel like the center of gravity

Key idea:
- search is the fastest path through cross-module complexity

#### EP-BS5 — Activity-First Homepage
Outcome:
- learner can distinguish a live operational stream from a fake dashboard

Key idea:
- recent changes, due soon, unpaid, blocked, and active work should outrank decorative charts

#### EP-BS6 — One Brand, Multiple Modules
Outcome:
- learner can explain shared AeroVista language plus module-level accents

Key idea:
- consistency builds trust while accents help users scan context fast

### Exercises for this companion path

- sort example UI elements into shell-only vs business-suite-appropriate
- rewrite a flashy UI description into a controlled executive workspace description
- identify whether a homepage is search-led or decoration-led
- design a relationship-aware card from a set of linked entities
- assign module accents without breaking the parent system

### Proof artifacts

Examples:
- one-paragraph explanation of the Business Suite tone
- annotated mock card showing linked entities and status signals
- homepage block priority ranking
- shell-vs-suite comparison explanation

### Badge ideas

- Theme Keeper
- Card Cartographer
- Search Pilot
- Activity Reader
- Suite Stylist

### Integration with the main architecture path

This companion path fits best after:
- Meet the Shell
- Shell vs Prototype

It works especially well before deeper builder modules because it teaches the learner not to confuse product identity with platform identity.

