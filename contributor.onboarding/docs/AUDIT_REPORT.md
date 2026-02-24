# AeroVista Contributor Onboarding — Audit & Review

Date: 2026-02-04

## Executive summary
This project is a clean, self-contained onboarding microsite with a strong “single-file app” approach (each page contains its own CSS/JS). The UX is already polished and coherent; the biggest opportunity was tightening information architecture and copy so the flow feels like **mutual fit → crew check → follow-up request**, rather than “you’re in / gatekeeping”.

## Current intended flow (recommended)
1) **About** (`index.html`) — what AeroVista is + expectations + links
2) **Fit Check** (`fit.html`) — self-filter + how to succeed + CTA to quiz
3) **Crew Check** (`quiz.html`) — scenario quiz, pass threshold ≥ 80%
4) **Badge + Follow-up** (`badge.html`) — generate badge + copy a ready-to-paste follow-up packet
5) **Founder Welcome** (`founder_welcome.html`) — optional reading + “acknowledge ground rules”

## Changes applied in this audit
- Added a consistent SVG favicon across pages (`favicon.svg`) and wired it into all HTML files.
- Fixed broken internal navigation on `fit.html` (it previously linked to `about/index.html`, which doesn’t exist in this repo).
- Reframed language away from “gate / you’re in / knowledge gate”:
  - “Knowledge Gate” → “Crew Check”
  - “I’m in (Accept Rules)” → “Acknowledge ground rules”
  - Quiz hint changed from “you haven’t accepted rules” to **recommended reading** (not a blocker).
- Updated **About** (`index.html`) navigation and CTAs so **Fit Check** is the primary action.
- Updated **Badge** (`badge.html`) so passing doesn’t imply membership:
  - Badge copy now says “Not an auto-invite”
  - Added a **Request follow-up** section with a copyable packet generated from local progress.
- Updated hiring contact email on About page config to `AeroVista.us@outlook.com`.

## Notable strengths
- Good visual hierarchy and consistent “card” UI language.
- Clear constraints model (lanes, preview-first, honest helper).
- LocalStorage-based state keeps the experience fast and static-host friendly.
- Built-in “templates & files” + generator tools are high leverage for contributor throughput.

## Risks / watchouts (static-host / GitHub Pages)
- **Asset assumptions:** `bytecast.mp3` and poster assets must exist next to the HTML files for the optional media sections to work.
- **Duplication drift:** each page embeds its own CSS; future styling changes may require repeated edits.
- **State versioning:** localStorage key is stable; consider a “Reset state” link on public pages if the flow changes again.

## Next improvements (optional)
- Add a direct link target for the follow-up packet (e.g., a specific GitHub Discussion category or Issue Form URL).
- Add a tiny “Back to Fit Check” link on `quiz.html` for users who realize they should self-filter first.
- Consolidate shared CSS into a single file if you expect frequent iterations (not necessary if you’re shipping now).

