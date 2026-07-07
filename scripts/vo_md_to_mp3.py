#!/usr/bin/env python3
"""
Generate episode narration MP3 from docs/day1/*_VOICEOVER.md using Microsoft Edge
neural TTS (edge-tts). No API key required.

  pip install -r scripts/requirements-vo.txt
  python scripts/vo_md_to_mp3.py

Requires ffmpeg on PATH to stitch chunk MP3s.
"""

from __future__ import annotations

import argparse
import asyncio
import shutil
import sys
import tempfile
from pathlib import Path

_scripts = Path(__file__).resolve().parent
if str(_scripts) not in sys.path:
    sys.path.insert(0, str(_scripts))

from vo_common import DOCS_DAY1, OUT_EP003, OUT_EP004, chunk_text, concat_mp3_ffmpeg, markdown_vo_to_plain


async def synth_chunk(text: str, path: Path, voice: str, rate: str) -> None:
    import edge_tts

    comm = edge_tts.Communicate(text, voice, rate=rate)
    await comm.save(str(path))


async def build_episode(md_path: Path, out_mp3: Path, voice: str, rate: str) -> None:
    plain = markdown_vo_to_plain(md_path.read_text(encoding="utf-8"))
    if not plain:
        raise SystemExit(f"No speakable text from {md_path}")

    chunks = chunk_text(plain)
    with tempfile.TemporaryDirectory() as td:
        tdir = Path(td)
        part_paths: list[Path] = []
        for i, ch in enumerate(chunks):
            p = tdir / f"part_{i:03d}.mp3"
            await synth_chunk(ch, p, voice, rate)
            part_paths.append(p)
        concat_mp3_ffmpeg(part_paths, out_mp3)


async def main_async(args: argparse.Namespace) -> None:
    await build_episode(DOCS_DAY1 / "EP-003_VOICEOVER.md", OUT_EP003, args.voice, args.rate)
    print(f"Wrote {OUT_EP003} ({OUT_EP003.stat().st_size // 1024} KB)")

    await build_episode(DOCS_DAY1 / "EP-004_VOICEOVER.md", OUT_EP004, args.voice, args.rate)
    print(f"Wrote {OUT_EP004} ({OUT_EP004.stat().st_size // 1024} KB)")


def main() -> None:
    p = argparse.ArgumentParser(description="ByteCast VO markdown → MP3 (Edge TTS)")
    p.add_argument("--voice", default="en-US-AriaNeural", help="edge-tts voice")
    p.add_argument("--rate", default="-3%", help="e.g. +0%%, -3%%, -5%%")
    args = p.parse_args()

    try:
        import edge_tts  # noqa: F401
    except ImportError:
        print("Install: pip install -r scripts/requirements-vo.txt", file=sys.stderr)
        raise SystemExit(1)

    if shutil.which("ffmpeg") is None:
        print("ffmpeg not found on PATH (needed to join chunks).", file=sys.stderr)
        raise SystemExit(1)

    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
