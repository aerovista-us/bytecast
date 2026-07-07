#!/usr/bin/env python3
"""One-shot: add favicon link after <meta name="viewport" ...> for all *.html in site root."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NEEDLE = re.compile(r'(<meta\s+name="viewport"[^>]*>)', re.IGNORECASE)
INJECT = r'\1<link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />'


def main() -> None:
    n = 0
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if "favicon.svg" in text:
            continue
        updated, count = NEEDLE.subn(INJECT, text, count=1)
        if count and updated != text:
            path.write_text(updated, encoding="utf-8")
            print("patched", path.name)
            n += 1
    print(f"Done. Patched {n} file(s).")


if __name__ == "__main__":
    main()
