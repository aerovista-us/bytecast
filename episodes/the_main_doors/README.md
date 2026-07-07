# EP-003 — The Main Doors

Day 1 Golden Path episode: maps the five public doors (Workspace Entry, ByteCast Playlist, Training Hub, Seed Builder Studio, Docs Portal), reinforces learner vs internal surfaces, and gates on listen + final slide + engage quiz.

## Files

- `index.html` — Player, slideshow (with `ByteCastSlideArt.ep003`), door cheat sheet, quest, quiz, slide progress, lesson-flow card, link to VO script.
- `bytecast_ep_profile.json` — Episode metadata, slide copy, `engagement.quest` / `engagement.quiz`.
- Voiceover: `../../docs/day1/EP-003_VOICEOVER.md`

## Audio

1. **Preferred:** `assets/ep003_voiceover.mp3` — generate from `docs/day1/EP-003_VOICEOVER.md` via `scripts/vo_md_to_mp3.py` (Edge TTS) or `scripts/vo_openai_tts.py` (OpenAI HD). See `docs/day1/README_VO_AUDIO.md`.
2. **Fallback:** `../welcome_to_bytecast/assets/welcome_to_bytecast.mp3` if the generated file is absent (profile lists both sources).

## Proof

Journey steps: `ep003_listen`, `ep003_slide`, `ep003_engage` (quiz pass writes `engageQuizPassed` + `engageQuizScore`).

Local checklist storage: `bytecast_ep003_quest`; quiz state: `bytecast_ep003_quiz`.
