# Generating narration MP3 (EP-003 / EP-004)

Voiceover source markdown:

- [`EP-003_VOICEOVER.md`](./EP-003_VOICEOVER.md)
- [`EP-004_VOICEOVER.md`](./EP-004_VOICEOVER.md)

Outputs (after you run a generator):

- `episodes/the_main_doors/assets/ep003_voiceover.mp3`
- `episodes/current_truth_basics/assets/ep004_voiceover.mp3`

Episode `bytecast_ep_profile.json` lists **generated MP3 first**, then **EP-001 placeholder** as fallback if the file is missing (browser picks the first loadable source).

## Option A â€” Microsoft Edge TTS (free, neural, no API key)

1. Install [ffmpeg](https://ffmpeg.org/) and ensure `ffmpeg` is on your `PATH`.
2. From the `mini.shops/bytecast` folder:

```bash
pip install -r scripts/requirements-vo.txt
python scripts/vo_md_to_mp3.py
```

Optional: `--voice en-US-GuyNeural` or `en-US-AriaNeural` (default), `--rate -3%` for a slightly calmer read.

## Option B â€” OpenAI Speech HD (paid API, very natural)

1. `ffmpeg` on `PATH`.
2. Set `OPENAI_API_KEY`.
3. From `mini.shops/bytecast`:

```bash
pip install -r scripts/requirements-vo.txt
python scripts/vo_openai_tts.py --voice onyx --model tts-1-hd
```

Voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`.

## Windows quick run

```powershell
cd mini.shops\bytecast
pip install -r scripts\requirements-vo.txt
python scripts\vo_md_to_mp3.py
```

## Editing the script before generation

- Adjust pauses: lines containing only `PAUSE` become a short spoken ellipsis (`...`) in the cleaned text.
- Re-run the generator after editing the markdown.

## TR-001A (Day 1 Foundations Check)

Facilitator / VO script (not wired to `vo_md_to_mp3.py` by default): [`TR-001A_SCRIPT.md`](./TR-001A_SCRIPT.md). The live UI is `episodes/training_missions/tr_001a_day1_foundations/index.html`.

**Updated:** 2026-03-22


