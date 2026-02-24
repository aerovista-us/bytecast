# AeroVista Contributor Kit (Handbook-aligned)

> **Why this exists:** AeroVista is a multi-division ecosystem (apps, music, branding, infra). This guide makes expectations explicit so work stays safe, reviewable, and easy to ship.

## Core values (how we behave)
- **Security First** — enterprise-grade security in everything we build.
- **Quality Excellence** — zero tolerance for production issues.
- **Collaboration** — cross-functional teamwork and knowledge sharing.
- **Transparency** — clear communication and documentation.

## The Honest Helper Standard (required)
We expect contributors to be willing **and** transparent.

**Use this format when taking work:**
- **Capability:** “I can take this on.”
- **Unknowns:** “I’m not fully familiar with ___ yet.”
- **Need:** “Point me to the source-of-truth repo/file + an example + what ‘done’ looks like.”

**Blocked message format:**
- **Blocked on:**  
- **Tried:**  
- **Got:** (error/log/result)  
- **Next guess:**  
- **Need from you:** (file pointer / decision / access / example)

## Working agreements (minimum rules that prevent chaos)
1) **Small is professional**
- One task = one PR / one change set / one deliverable.
- No “while I’m here I refactored 12 things.”

2) **We don’t build on vibes**
Every task must have:
- Goal
- Scope
- Out of scope
- Acceptance criteria
- Definition of Done (DoD)

If any one is missing, the task is **discussion**, not work.

3) **Decisions have owners**
- Founder owns product direction + final calls.
- Contributors own implementation details **within** scope.
- Scope changes require a proposal (see “Change Management”).

4) **Document as you go**
No long essays—just:
- What changed
- Why
- How to run/test
- Any gotchas

## Contribution lanes (don’t collide)
### Lane A — Safe + fast (default)
- UI tweaks, copy/marketing pages
- SVG packs / art assets
- JSON pack data
- Docs
- Non-prod scripts

✅ Can merge with lightweight review.

### Lane B — Medium risk (review required)
- App logic changes
- Build tooling
- Feature flags
- Analytics integration (e.g., Umami)
- Performance refactors

✅ Must have PR + review + test notes.

### Lane C — High risk (founder-only execution)
- Infra / reverse proxy / firewall / networking
- Auth, secrets, service accounts, API keys
- Deployment pipelines
- Data migrations / canonical DB writes

✅ Contributors advise, prototype, write plans; founder executes final.

## Roles (match work to output)
- **Builder:** ships features inside defined scope
- **Fixer:** resolves bugs from prioritized list
- **Caretaker:** docs, cleanup, packaging, audits, consistency
- **Artist:** covers, stickers, pack visuals, motion assets
- **Operator:** deploy/uptime/monitoring (Lane C rules)

## Environments (so “it works” means something)
1) **Local Dev**: runs on contributor machine; uses mocks if possible; has a clean-start command.
2) **Preview**: GitHub Pages / preview deploy; used for review + QA; no secrets.
3) **Production**: controlled release; requires changelog + rollback note.

**Baseline:** “Works in preview” is the minimum bar before “done”.

## Definition of Done (DoD)
A task is **Done** when:
- ✅ Matches acceptance criteria
- ✅ Doesn’t break build
- ✅ Has basic test notes (manual is ok)
- ✅ Doesn’t introduce security regressions
- ✅ Includes docs/update notes (short is fine)
- ✅ Uses correct file locations + naming

Nice-to-have:
- ✅ Screenshot/clip for UI work
- ✅ Before/after metrics for perf work

## Change management (no surprise scope)
Non-trivial changes follow:
**Request → Review → Approval → Implementation → Validation → Documentation**

Emergency changes are allowed when needed, but must still be documented after.

## Boundaries that protect the project
- No direct edits to production servers.
- No secrets in repos, ever.
- No “quick fixes” in generated build artifacts.
- No dependency additions without approval (unless on the pre-approved list).
- No architecture changes without a short proposal.

## Communication norms
Keep to three channels:
1) Work Orders / Tasks
2) PR / Review
3) Decisions Log

**Response expectations:**
- Contributors respond within their availability.
- Founder commits to review windows (daily / every other day).
- Nobody is “on call” unless explicitly assigned.

## Quick start (how to contribute)
1) Pick a work order.
2) Confirm lane + start location + “done”.
3) Create a branch.
4) Make the smallest change that meets the goal.
5) Add test notes + docs note.
6) Open PR using the template.

---

## Welcome message (copy/paste)
Welcome to AeroVista. Here’s how we work:
- Pick a task from the board or request one.
- Stay within the scope defined on the task.
- One task = one PR.
- Use Preview to validate changes.
- “Done” means: criteria met, build passes, notes included.
- Infra/auth/secrets are restricted—ask before touching.
- If blocked, post what you tried + logs + next guess.
