# EP-003 audio

Expected file after running the VO generator:

- **`ep003_voiceover.mp3`** — narration from `docs/day1/EP-003_VOICEOVER.md`

Generate from repo `bytecast` root:

```bash
pip install -r scripts/requirements-vo.txt
python scripts/vo_md_to_mp3.py
```

See `docs/day1/README_VO_AUDIO.md` for OpenAI HD option and ffmpeg requirements.
