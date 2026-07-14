#!/usr/bin/env python3
"""
Build voiceover_sections.json (+ .load.js) for Agent Day 3 — From Signal to Action.
Source: docs/agent_day3/FROM_SIGNAL_TO_ACTION_SCRIPT.md

Also refreshes tools/narration/agent_day3/lines.master.json for NXCore narration forge.

Run from repo root:
  python scripts/signal_to_action_voiceover_build.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_MD = ROOT / "docs" / "agent_day3" / "FROM_SIGNAL_TO_ACTION_SCRIPT.md"
OUT_JSON = ROOT / "episodes" / "from_signal_to_action" / "assets" / "voiceover_sections.json"
FORGE_LINES = ROOT / "tools" / "narration" / "agent_day3" / "lines.master.json"

SEGMENT_IDS = {
    1: "dashboard_cos",
    2: "judgment_chain",
    3: "cos_brief",
    4: "priority_p123",
    5: "signal_examples",
    6: "agent_mistakes",
    7: "avcc_template",
    8: "exec_confidential",
}


def clean_speak(text: str) -> str:
    t = re.sub(r"\*\*BYTE:\*\*\s*", "", text, flags=re.I)
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def clean_display(text: str) -> str:
    t = re.sub(r"\*\*BYTE:\*\*\s*", "", text, flags=re.I)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def segment_id_from_heading(heading: str) -> str:
    h = heading.lower()
    if "cold open" in h:
        return "cold_open"
    if "closing" in h and "segment" not in h:
        return "closing"
    m = re.search(r"segment\s*(\d+)", h)
    if m:
        return SEGMENT_IDS.get(int(m.group(1)), f"segment_{m.group(1)}")
    return re.sub(r"[^a-z0-9]+", "_", h.strip("[]")).strip("_")


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


def parse_script(md: str) -> list[dict]:
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


def build_payload(sections: list[dict]) -> dict:
    order = [s["id"] for s in sections]
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": "from_signal_to_action",
        "code": "AGENT-D3",
        "narrator": "Byte",
        "sections": sections,
        "overviewOrder": order,
        "heroSectionId": order[0] if order else "cold_open",
        "segmentOrder": order,
    }


def write_voiceover_assets(out: Path, payload: dict) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    load_path = out.with_name(f"{out.stem}.load.js")
    dumped = json.dumps(payload, ensure_ascii=False)
    load_path.write_text(
        "/** Auto-generated. Regenerate: python scripts/signal_to_action_voiceover_build.py */\n"
        f"window.ByteCastVoiceoverSections = {dumped};\n",
        encoding="utf-8",
    )
    print("Wrote", out.relative_to(ROOT), "and", load_path.relative_to(ROOT))


def write_forge_lines(sections: list[dict]) -> None:
    FORGE_LINES.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        {
            "id": sec["id"],
            "label": sec["title"],
            "text": sec["speakText"],
            "voiceRecipe": "byte-narrator",
        }
        for sec in sections
    ]
    payload = {
        "schema": "narration-lines-master-v1",
        "packId": "agent_day3_signal_to_action",
        "episodeCode": "AGENT-D3",
        "lines": lines,
    }
    FORGE_LINES.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", FORGE_LINES.relative_to(ROOT))


def main() -> None:
    text = SCRIPT_MD.read_text(encoding="utf-8")
    sections = parse_script(text)
    if not sections:
        raise SystemExit(f"No sections parsed from {SCRIPT_MD}")
    write_voiceover_assets(OUT_JSON, build_payload(sections))
    write_forge_lines(sections)


if __name__ == "__main__":
    main()
