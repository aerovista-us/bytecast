#!/usr/bin/env python3
"""
Generate episode narration MP3 using OpenAI Speech (tts-1-hd).

  pip install -r scripts/requirements-vo.txt
  set OPENAI_API_KEY=sk-...
  python scripts/vo_openai_tts.py --voice onyx
"""

from __future__ import annotations

import argparse
import os
import shutil
import sys
import tempfile
from pathlib import Path

_scripts = Path(__file__).resolve().parent
if str(_scripts) not in sys.path:
    sys.path.insert(0, str(_scripts))

from vo_common import DOCS_DAY1, OUT_EP003, OUT_EP004, chunk_text, concat_mp3_ffmpeg, markdown_vo_to_plain


def synth_openai_chunk(text: str, path: Path, voice: str, model: str) -> None:
    from openai import OpenAI

    if not os.environ.get("OPENAI_API_KEY"):
        raise SystemExit("Set OPENAI_API_KEY")

    client = OpenAI()
    resp = client.audio.speech.create(model=model, voice=voice, input=text, response_format="mp3")
    resp.stream_to_file(str(path))


def build_episode_openai(md_path: Path, out_mp3: Path, voice: str, model: str) -> None:
    plain = markdown_vo_to_plain(md_path.read_text(encoding="utf-8"))
    if not plain:
        raise SystemExit(f"No speakable text from {md_path}")

    chunks = chunk_text(plain, max_chars=3800)
    with tempfile.TemporaryDirectory() as td:
        tdir = Path(td)
        part_paths: list[Path] = []
        for i, ch in enumerate(chunks):
            p = tdir / f"part_{i:03d}.mp3"
            synth_openai_chunk(ch, p, voice, model)
            part_paths.append(p)
        concat_mp3_ffmpeg(part_paths, out_mp3)


def main() -> None:
    p = argparse.ArgumentParser(description="ByteCast VO markdown → MP3 (OpenAI)")
    p.add_argument("--voice", default="onyx", help="alloy, echo, fable, onyx, nova, shimmer")
    p.add_argument("--model", default="tts-1-hd", help="tts-1 or tts-1-hd")
    args = p.parse_args()

    if shutil.which("ffmpeg") is None:
        print("ffmpeg not on PATH", file=sys.stderr)
        raise SystemExit(1)

    build_episode_openai(DOCS_DAY1 / "EP-003_VOICEOVER.md", OUT_EP003, args.voice, args.model)
    print(f"Wrote {OUT_EP003} ({OUT_EP003.stat().st_size // 1024} KB)")

    build_episode_openai(DOCS_DAY1 / "EP-004_VOICEOVER.md", OUT_EP004, args.voice, args.model)
    print(f"Wrote {OUT_EP004} ({OUT_EP004.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
