# EP-004 audio

Expected file after running the VO generator:

- **`ep004_voiceover.mp3`** — narration from `docs/day1/EP-004_VOICEOVER.md`

Generate from repo `bytecast` root:

```bash
pip install -r scripts/requirements-vo.txt
python scripts/vo_md_to_mp3.py
```

See `docs/day1/README_VO_AUDIO.md` for OpenAI HD option and ffmpeg requirements.
