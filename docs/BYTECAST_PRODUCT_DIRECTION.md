# ByteCast product direction (canonical)

**Updated:** 2026-07-07  
**Status:** Approved direction — implementation phased (see [Roadmap](#implementation-roadmap))  
**Audience:** Product owners, authors, engineers, and anyone deciding what ships through ByteCast

## North star

> **ByteCast is where employees and collaborators land to see what's new, continue what they started, and get routed to the next skill or tool — from first day to last.**

All new information, skills, company communications, and ecosystem guidance should **flow through ByteCast first**. Deeper work may continue in other trainings, apps, or methods — but ByteCast remains the **spine** that connects those conversations.

ByteCast is the **first signal** (pulse) on what is happening, how to do the next new thing, and how to use the AeroVista ecosystem.

---

## Primary audience

| Who | Relationship to ByteCast |
|-----|--------------------------|
| **Employees / collaborators** | Primary — day 1 through last day |
| **Authors / builders** | Secondary — Seed Builder and docs are contributor tools, not the employee front door |
| **Shareholders / external stakeholders** | May consume Pulse-style briefings; employee home is still the canonical shell |

---

## Mental model: Pulse → Path → Depth

Every artifact fits one of three layers. Authors pick the layer **before** picking folders, journey ids, or teaching modes.

| Layer | What it is | Employee question | Proof / journey |
|-------|------------|-------------------|-----------------|
| **Pulse** | New signal — what changed, what to know now | "What's happening?" | Optional completion; not a Golden Path gate |
| **Path** | Structured skill or onboarding sequence | "How do I do this?" | Journey steps, checks, and proof as required |
| **Depth** | Deeper work in another surface | "I need to go further" | Handoff out of ByteCast; return link back |

```text
                    ┌─────────────────────────────────────┐
                    │     Employee Home (one URL)           │
                    ├─────────────────────────────────────┤
  Pulse ──────────► │  What's new                         │
  Continue ───────► │  Resume active step                 │
  Path ───────────► │  Getting started · Skills · Ecosystem│
  Depth ──────────► │  Handoff cards → other apps         │
                    └─────────────────────────────────────┘
```

**Rule:** ByteCast is always the first stop. Other apps are organs; ByteCast is the spine.

---

## Employee home (target UX)

Today the workspace exposes multiple doors (workspace entry, Training Hub, Playlist, Seed Builder, Docs). The direction is **one employee URL**:

| Target | Path (current → planned label) |
|--------|--------------------------------|
| **Employee home** | `episodes/training_hub/index.html` → rebrand as **ByteCast** (not "Training Hub") |
| **Workspace root** | `index.html` → redirect or thin launcher into employee home |
| **Continue** | Absorb `seed_bytecast.html` Playlist as "Continue" / resume — not a separate product mental model |
| **Build** | `episodes/seed_builder_studio/` — collapsed under "For builders" |
| **Reference** | `docs/` — glossary, standards, reviewer tools |

Top-of-home order (employee view):

1. **Continue** — where you left off (active journey step)
2. **Pulse** — what's new (company briefings, rollouts, updates)
3. **Getting started** — Day 1 spine (foundations before role skills)
4. **Skills** — role-relevant lanes (sales, creative, ops, etc.)
5. **Ecosystem** — how to use tools in AeroVista (short intro → handoff)
6. **Reference** — glossary, docs (always available, never primary)

---

## Lifecycle sections (not tech folder names)

Organize what employees see by **where they are**, not by repo structure.

### 1. Getting started (Day 1 → ~30 days)

- Welcome, navigation, current truth, Day 1 mission (`p1_golden_path`)
- One obvious "Start here" — minimal choices until foundations complete
- Maps to: `EP-001` … `EP-004`, `TR-001A`

### 2. Pulse (ongoing)

- Company briefings, stakeholder updates, process changes, new-tool announcements
- **Surfaced at top when new** — this is the heartbeat of the platform
- Maps to today: Shareholder Season 1 (`shareholder_season1`, `BriefingSync`); future: `data/pulse.json` feed

### 3. Skills for your role

- Sales, creative, ops, contributor lanes — shown when relevant, not all at once
- Maps to: Lumina revenue, Art Localized, AV Apparel, contributor onboarding, training missions

### 4. Ecosystem & tools

- "How to use X in AeroVista" — short ByteCast intro, then handoff to the real app
- Every handoff includes a return path to employee home

### 5. Reference

- Glossary, Offer Pack, story/context, docs index
- Never competes with Pulse or Continue on the home screen

**Reframe of current "side lanes":** Shareholder Briefings are **Pulse**, not a parallel product. Day 1 is **Getting started**. Lumina and sales labs are **Skills**.

---

## Content types (authoring)

When shipping something new through ByteCast, declare a **content type**. Types map to existing [teaching modes](./BYTECAST_TRAINING_STANDARD.md#teaching-modes-content-first-delivery) and proof expectations.

| Content type | Teaching mode | Layer | Proof | Typical length |
|--------------|---------------|-------|-------|----------------|
| **Signal** | BriefingSync | Pulse | Optional | 5–15 min |
| **Lesson** | GuidedAudioSlides | Path | Quiz on journey steps | 15–30 min |
| **How-to** | VisualHotspot, ReadAloudScript | Path or Ecosystem | Light check | 10–20 min |
| **Practice** | MissionLab | Path (Skills) | Full proof bundle | Hands-on |
| **Handoff** | (link card) | Depth | None in ByteCast | ~2 min + external app |

### Authoring rules

| If the content is… | Then… |
|--------------------|--------|
| Company news or "here's what changed" | **Signal** → Pulse, top of home when new, no Golden Path gate |
| "You must be able to do X" | **Lesson** or **Practice** → Path with proof |
| "Use this tool in the ecosystem" | **How-to** or **Handoff** → Ecosystem section |
| Deeper work in another app | **Handoff** card with context + return link |

Human-facing titles in UI; machine codes (`EP-001`, `S1-EP-01`) stay in registry and journey JSON only.

Example UI labels:

- `EP-001` → **Day 1 · Welcome to ByteCast**
- `S1-EP-01` → **Pulse · Briefing 1: Welcome**

---

## Cross-training threads

Deeper conversations span trainings and other apps via explicit **threads**, not accidental navigation.

1. **Related next** — end of every pack: one primary next step, up to two optional
2. **Thread tags** — e.g. `revenue`, `ecosystem`, `onboarding` — link Pulse items and Paths
3. **Handoff cards** — "Continue in DispatchFlow Lab" with context from the prior lesson
4. **Return links** — external apps use `?from=bytecast&step=...` (or equivalent) so employees return to **Continue**

Declare in pack metadata (`bytecast_ep_profile.json`):

- `thread_tags[]`
- `related_next[]` (episode id or external URL + label)
- `handoff` (optional: app name, URL, return label)

---

## Technical simplification (aligned with this direction)

| Keep (core) | Demote (author/internal) | Reframe |
|-------------|--------------------------|---------|
| Employee home shell | Seed Builder as top nav | "Build" for contributors |
| `data/episode_registry.json` | Duplicate `.CODEX` mirror | Single catalog + sync script (planned) |
| `data/journey_steps.json` | Many journeys visible at once on home | Lifecycle sections + active path only |
| Pulse feed (planned: `data/pulse.json`) | "Featured Sales Mission" on home default | Under Skills → Sales |
| One URL per episode | Redirect chains (e.g. pack → legacy HTML) | Inline players; redirects for bookmarks only |

### Planned catalog unification

**Today:** new content often touches `episode_registry.json`, `journey_steps.json`, `episodes/training_hub/data/modules.json`, and `.CODEX/episode_registry.json`.

**Target:** one `data/catalog.json` (or registry extension) drives episodes, Pulse entries, hub cards, and journey refs — validated in CI.

**Pulse feed:** add `data/pulse.json` with title, type, date, episode link, optional expiry — new briefings ship with one row when appropriate.

---

## What we are not doing (yet)

- Merging Playlist and Training Hub into one SPA (low learner gain if home UX is fixed)
- Forcing all series onto one journey with badge gates (Pulse stays lightweight)
- Deleting legacy missions or docs without redirects and traffic check
- Replacing external apps — ByteCast routes to them

---

## Implementation roadmap

Phases are ordered by employee-visible impact. Track status in [`PLATFORM_STATUS.md`](./PLATFORM_STATUS.md).

| Phase | Scope | Employee-visible outcome |
|-------|--------|---------------------------|
| **A — Home reframe** | Rebrand Training Hub → ByteCast; reorder sections (Continue → Pulse → Getting started → Skills → Reference); collapse full catalog; root `index.html` → home | One clear front door |
| **B — Pulse feed** | `data/pulse.json`; Shareholder Season 1 as first Pulse series; home "What's new" block | New comms ship without editing four config files |
| **C — Catalog unification** | `data/catalog.json` + sync script; CI validation | Authors edit one source |
| **D — Handoffs** | Standard footer on packs; thread tags + `related_next` in profiles | Connected conversations across apps |
| **E — URL cleanup** | Inline Season 1 players; audio under `assets/`; retire redirect chains | Stable links |

---

## Governance

| Decision | Guiding question |
|----------|------------------|
| Should this ship in ByteCast? | Is it employee-facing information, skill, or ecosystem guidance? |
| Pulse or Path? | Is understanding optional (signal) or required (skill/proof)? |
| Home placement | Is it new (Pulse), foundational (Getting started), or role-specific (Skills)? |
| External app? | Is ByteCast the right **first** stop with a handoff, or is the app self-explanatory? |

When this direction changes, update **Updated** on this file and note the change in [`PLATFORM_STATUS.md`](./PLATFORM_STATUS.md).

---

## Related docs

| Doc | Relationship |
|-----|--------------|
| [`BYTECAST_TRAINING_STANDARD.md`](./BYTECAST_TRAINING_STANDARD.md) | Lesson shape + teaching modes (implementation of content types) |
| [`CONTENT_PATTERN_MATRIX.md`](./CONTENT_PATTERN_MATRIX.md) | Live series patterns mapped to modes |
| [`LOOP_STANDARD.md`](./LOOP_STANDARD.md) | Journey / proof engine (Path layer) |
| [`APP_SHELLS.md`](./APP_SHELLS.md) | Shell ownership today; home reframe in Phase A |
| [`PLATFORM_STATUS.md`](./PLATFORM_STATUS.md) | Current deploy snapshot + roadmap status |
| [`SITE_MAP.md`](./SITE_MAP.md) | Runnable URLs (update when home path changes) |
| [`BYTECAST_EP_WORKFLOW.md`](./BYTECAST_EP_WORKFLOW.md) | New episode pack workflow |
