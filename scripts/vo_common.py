"""Shared helpers for VO markdown → MP3 pipelines."""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

BYTECAST_ROOT = Path(__file__).resolve().parents[1]
DOCS_DAY1 = BYTECAST_ROOT / "docs" / "day1"
OUT_EP003 = BYTECAST_ROOT / "episodes" / "the_main_doors" / "assets" / "ep003_voiceover.mp3"
OUT_EP004 = BYTECAST_ROOT / "episodes" / "current_truth_basics" / "assets" / "ep004_voiceover.mp3"


def markdown_vo_to_plain(md: str) -> str:
    lines = md.splitlines()
    paras: list[str] = []
    buf: list[str] = []

    def flush() -> None:
        nonlocal buf
        if not buf:
            return
        p = " ".join(x.strip() for x in buf if x.strip())
        buf = []
        if not p:
            return
        if p.startswith("Recording tip:") or p.startswith("**Recording tip:**"):
            return
        if p == "**End.**" or p == "End.":
            return
        paras.append(p)

    for line in lines:
        s = line.strip()
        if not s:
            flush()
            continue
        if s.startswith("#"):
            continue
        if s == "---":
            flush()
            continue
        if s.startswith("**Recording tip:**") or s.startswith("Recording tip:"):
            continue
        if s == "PAUSE." or s == "PAUSE":
            flush()
            paras.append("__PAUSE__")
            continue
        s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
        s = re.sub(r"\*([^*]+)\*", r"\1", s)
        s = s.replace("`", "")
        buf.append(s)

    flush()

    parts: list[str] = []
    for p in paras:
        if p == "__PAUSE__":
            parts.append("...")
        else:
            parts.append(p)

    text = ". ".join(parts)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\.\s*\.", ".", text)
    return text.strip()


def chunk_text(text: str, max_chars: int = 2600) -> list[str]:
    if len(text) <= max_chars:
        return [text]
    chunks: list[str] = []
    start = 0
    n = len(text)
    while start < n:
        end = min(start + max_chars, n)
        if end < n:
            cut = text.rfind(". ", start + 1200, end)
            if cut == -1:
                cut = text.rfind(" ", start + 1200, end)
            if cut > start:
                end = cut + 1
        piece = text[start:end].strip()
        if piece:
            chunks.append(piece)
        start = end
    return chunks


def concat_mp3_ffmpeg(parts: list[Path], out: Path) -> None:
    if not parts:
        raise ValueError("no audio parts")
    out.parent.mkdir(parents=True, exist_ok=True)
    if len(parts) == 1:
        shutil.copy2(parts[0], out)
        return
    n = len(parts)
    args = ["ffmpeg", "-y"]
    for p in parts:
        args.extend(["-i", str(p)])
    filt = "".join(f"[{i}:a]" for i in range(n)) + f"concat=n={n}:v=0:a=1[aout]"
    args.extend(
        [
            "-filter_complex",
            filt,
            "-map",
            "[aout]",
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(out),
        ]
    )
    subprocess.run(args, check=True, capture_output=True, text=True)
