#!/usr/bin/env python3
"""
Build voiceover_sections.json (+ .load.js) for Agent Day 1 — The First Door.
Source: docs/agent_day1/THE_FIRST_DOOR_SCRIPT.md

Also refreshes tools/narration/agent_day1/lines.master.json for NXCore narration forge.

Run from repo root:
  python scripts/first_door_voiceover_build.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_MD = ROOT / "docs" / "agent_day1" / "THE_FIRST_DOOR_SCRIPT.md"
OUT_JSON = ROOT / "episodes" / "the_first_door" / "assets" / "voiceover_sections.json"
FORGE_LINES = ROOT / "tools" / "narration" / "agent_day1" / "lines.master.json"


def slugify(title: str) -> str:
    s = title.strip().lower().replace("—", "-").replace("`", "")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def clean_speak(text: str) -> str:
    t = re.sub(r"\*\*BYTE:\*\*\s*", "", text, flags=re.I)
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def clean_display(text: str) -> str:
    t = re.sub(r"\*\*BYTE:\*\*\s*", "", text, flags=re.I)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def parse_first_door_script(md: str) -> list[dict]:
    chunks = re.split(r"\n## ", md)
    sections: list[dict] = []
    for i, chunk in enumerate(chunks):
        if i == 0:
            continue
        lines = chunk.split("\n")
        heading = lines[0].strip()
        if heading.lower().startswith("completion"):
            continue
        body = "\n".join(lines[1:]).strip()
        body = re.sub(r"^---\s*", "", body)
        body = re.sub(r"\s*---\s*$", "", body)

        sid = segment_id_from_heading(heading)
        title = segment_title_from_heading(heading)
        speak = clean_speak(body)
        if not speak:
            continue
        sections.append(
            {
                "id": sid,
                "title": title,
                "displayText": clean_display(body),
                "speakText": speak,
            }
        )
    return sections


def segment_id_from_heading(heading: str) -> str:
    h = heading.lower()
    if "cold open" in h:
        return "cold_open"
    if "closing" in h and "segment" not in h:
        return "closing"
    m = re.search(r"segment\s*(\d+)", h)
    if m:
        n = int(m.group(1))
        return {
            1: "world",
            2: "culture",
            3: "doors",
            4: "operating_law",
            5: "lost_protocol",
            6: "legal",
            7: "checklist",
        }.get(n, f"segment_{n}")
    return slugify(heading.replace("[", "").replace("]", ""))


def segment_title_from_heading(heading: str) -> str:
    inner = heading.strip()
    if inner.startswith("[") and "]" in inner:
        inner = inner[1 : inner.index("]")]
    parts = [p.strip() for p in inner.split("|")]
    if len(parts) >= 2 and parts[0].lower().startswith("segment"):
        return parts[1]
    if parts[0].lower().startswith("cold open"):
        return "Cold Open"
    if parts[0].lower().startswith("closing"):
        return "Closing"
    return parts[0]


def build_payload(sections: list[dict]) -> dict:
    order = [s["id"] for s in sections]
    slide_map = {
        "law": "operating_law",
        "culture": "culture",
        "doors": "doors",
        "lost": "lost_protocol",
        "states": "operating_law",
    }
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": "the_first_door",
        "code": "AGENT-D1",
        "narrator": "Byte",
        "sections": sections,
        "overviewOrder": order,
        "heroSectionId": order[0] if order else "cold_open",
        "slideSectionMap": slide_map,
        "segmentOrder": order,
    }


def write_voiceover_assets(out: Path, payload: dict) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    load_path = out.with_name(f"{out.stem}.load.js")
    dumped = json.dumps(payload, ensure_ascii=False)
    load_path.write_text(
        "/** Auto-generated. Regenerate: python scripts/first_door_voiceover_build.py */\n"
        f"window.ByteCastVoiceoverSections = {dumped};\n",
        encoding="utf-8",
    )
    print("Wrote", out.relative_to(ROOT), "and", load_path.relative_to(ROOT))


def write_forge_lines(sections: list[dict]) -> None:
    FORGE_LINES.parent.mkdir(parents=True, exist_ok=True)
    lines = []
    for sec in sections:
        lines.append(
            {
                "id": sec["id"],
                "label": sec["title"],
                "text": sec["speakText"],
                "voiceRecipe": "byte-narrator",
            }
        )
    payload = {
        "schema": "narration-lines-master-v1",
        "packId": "agent_day1_first_door",
        "episodeCode": "AGENT-D1",
        "lines": lines,
    }
    FORGE_LINES.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", FORGE_LINES.relative_to(ROOT))


def main() -> None:
    text = SCRIPT_MD.read_text(encoding="utf-8")
    sections = parse_first_door_script(text)
    if not sections:
        raise SystemExit(f"No sections parsed from {SCRIPT_MD}")
    payload = build_payload(sections)
    write_voiceover_assets(OUT_JSON, payload)
    write_forge_lines(sections)


if __name__ == "__main__":
    main()
