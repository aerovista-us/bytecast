# EP-001 — On-screen copy & graphics (Annex A)

Art direction and literal on-screen text from the locked **Annex A** script. The **slide deck** in `bytecast_ep_profile.json` uses the same scenes as **teaching bullets** (titles + goals + bullets); motion graphics are implementation work in the player UI.

| Annex scene | On-screen (verbatim / spec) | Where it lives in the pack |
|-------------|----------------------------|----------------------------|
| **Opening** | Dark shell. Neon accents. Soft motion. Title: **BYTECAST — EP-001 — Welcome to ByteCast** | Hero: `welcome_to_bytecast/index.html` — **BYTECAST** + line **EP-001 — Welcome to ByteCast** + subcopy; episode pills show EP-001 |
| **Scene 1** | Simple animated diagram: small modules linking into one loop. Text: **Standalone packs + thin shells** | Slide `s1` “What ByteCast is” — bullets align with VO; diagram is a production asset |
| **Scene 2** | Animated chips: **1. Listen — 2. Slide — 3. Engage — 4. Training — 5. Seed — 6. Badge** | Slide `s2` “The journey loop” — same six steps in bullets |
| **Scene 3** | A path lights up left to right | Slide `s3` “Path, not a pile” |
| **Scene 4** | Five cards, one at a time: **Workspace Entry — ByteCast Playlist — Training Hub — Seed Builder Studio — Docs Portal** | Slide `s4` “The five main doors” — one bullet per door |
| **Scene 5** | Split screen — Left: **“Learner-facing”** / Right: **“Internal / Maintainer”** | Slide `s5` “Learner-facing vs internal” |
| **Scene 6** | Featured cards: **EP-001 Welcome — EP-002 AeroVista Overview** | Slide `s6` “Canonical starts” |
| **Scene 7** | Progress bar animates: **Listen → Slide → Engage → Training locked → Seed locked** | Slide `s7` “What progress means” |
| **Scene 8** | Checklist — **I know what ByteCast is — I know the loop — I know the five main doors — I know where to resume — I know what to ignore for now** | Slide `s8` “Success in EP-001” — checklist ideas in bullets |
| **Scene 9** | Soft text: **“You do not need everything today.”** | Slide `s9` “Beginner promise” |
| **Scene 10** | Recap cards flip by | Slide `s10` “Recap” |
| **Scene 11** | Prompt card: **“Before you move on, answer these.”** | Engage section above quiz; self-check questions are VO-only in `EP-001_VOICEOVER.md` |
| **Engage quiz** | Four MC items (stems + distractors) — see profile `engagement.quiz` | Same wording as Annex optional micro-check |
| **Closing** | Button glow: **Continue to EP-002** | CTA link in `index.html` to `aerovista_7_division_overview/index.html` |

**Voiceover:** [`EP-001_VOICEOVER.md`](./EP-001_VOICEOVER.md)  
**Slides + quiz payload:** `episodes/welcome_to_bytecast/bytecast_ep_profile.json`
