#!/usr/bin/env python3
"""
Parse docs/day1 *VOICEOVER*.md and TR-001A_SCRIPT.md into voiceover_sections.json
plus voiceover_sections.load.js (file:// shim; sets window.ByteCastVoiceoverSections).
Run from repo root:  python scripts/voiceover_md_to_json.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs" / "day1"


def slugify(title: str) -> str:
    s = title.strip().lower().replace("—", "-").replace("`", "")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def clean_speak(text: str) -> str:
    t = text.replace("PAUSE.", " ")
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
    t = re.sub(r"\*([^*]+)\*", r"\1", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def clean_display(text: str) -> str:
    t = text.replace("PAUSE.", "")
    t = re.sub(r"\s+", " ", t).strip()
    return t


def parse_markdown_sections(md: str) -> list[dict]:
    """Split on ## headings; return [{id, title, displayText, speakText}]."""
    chunks = re.split(r"\n## ", md)
    out: list[dict] = []
    for i, chunk in enumerate(chunks):
        if i == 0:
            continue  # preamble before first ##
        lines = chunk.split("\n")
        title = lines[0].strip()
        body = "\n".join(lines[1:]).strip()
        body = re.sub(r"^---\s*", "", body)
        body = re.sub(r"\s*---\s*$", "", body)
        sid = slugify(title)
        speak = clean_speak(body)
        disp = clean_display(body)
        if not speak:
            continue
        out.append(
            {
                "id": sid,
                "title": title,
                "displayText": disp,
                "speakText": speak,
            }
        )
    return out


def tr_script_sections(md: str) -> list[dict]:
    """TR-001A_SCRIPT.md: split on ##, pull VOICEOVER block when present."""
    chunks = re.split(r"\n## ", md)
    out: list[dict] = []
    for i, chunk in enumerate(chunks):
        if i == 0:
            continue
        lines = chunk.split("\n")
        title = lines[0].strip()
        body = "\n".join(lines[1:]).strip()
        vo = re.search(
            r"\*\*VOICEOVER\*\*\s*([\s\S]+?)(?=\n---|\n\*\*[A-Z]|\n## |\Z)",
            body,
            re.I,
        )
        if vo:
            raw = vo.group(1).strip()
        else:
            raw = re.sub(r"\*\*ON SCREEN\*\*[\s\S]*?(?=\n\n|\Z)", "", body, flags=re.I)
            raw = re.sub(r"\*\*[^\n]+\*\*", "", raw)
        raw = raw.strip()
        if not raw or raw.startswith("See `**"):
            continue
        sid = slugify(title)
        speak = clean_speak(raw)
        disp = clean_display(raw)
        if len(speak) < 8:
            continue
        out.append({"id": sid, "title": title, "displayText": disp, "speakText": speak})
    return out


def build_ep001(data: list[dict]) -> dict:
    by_id = {s["id"]: s for s in data}
    overview_exclude = {
        "scene-11-handoff-to-engage-check",
        "closing",
    }
    overview_order = [s["id"] for s in data if s["id"] not in overview_exclude]
    slide_map = {
        "s1": "scene-1-what-bytecast-is",
        "s2": "scene-2-the-journey-loop",
        "s4": "scene-4-the-five-main-doors",
        "s8": "scene-8-what-success-looks-like-in-ep-001",
        "s10": "scene-10-quick-recap",
    }
    assert all(by_id.get(v) for v in slide_map.values()), "EP-001 section ids missing"
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": "welcome_to_bytecast",
        "code": "EP-001",
        "sections": data,
        "overviewOrder": overview_order,
        "heroSectionId": "opening",
        "slideSectionMap": slide_map,
    }


def build_ep002(data: list[dict]) -> dict:
    by_id = {s["id"]: s for s in data}
    overview_exclude = {"scene-16-handoff-prompt", "closing"}
    overview_order = [s["id"] for s in data if s["id"] not in overview_exclude and s["id"] in by_id]
    slide_map = {
        "s1": "scene-1-what-aerovista-is",
        "s2": "scene-2-mission-vision-and-philosophy",
        "s3": "scene-3-the-seven-divisions",
        "s11": "scene-11-why-hq-matters",
        "s12": "scene-12-cross-division-collaboration",
        "s15": "scene-15-quick-recap",
    }
    for v in slide_map.values():
        assert v in by_id, f"EP-002 missing {v}"
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": "aerovista_7_division_overview",
        "code": "EP-002",
        "sections": data,
        "overviewOrder": overview_order,
        "heroSectionId": "opening",
        "slideSectionMap": slide_map,
    }


def build_ep003(data: list[dict]) -> dict:
    by_id = {s["id"]: s for s in data}
    slide_map = {
        "s_open": "slide-s-open-scope",
        "s1": "slide-s1-workspace-entry",
        "s2": "slide-s2-bytecast-playlist",
        "s3": "slide-s3-training-hub",
        "s4": "slide-s4-seed-builder-studio",
        "s5": "slide-s5-docs-portal",
        "s6": "slide-s6-learner-vs-internal",
        "s7": "slide-s7-before-you-continue",
    }
    for v in slide_map.values():
        assert v in by_id, f"EP-003 missing {v}: have {list(by_id)[:8]}..."
    overview_order = [s["id"] for s in data if s["id"] != "end"]
    overview_order = [x for x in overview_order if x in by_id and not x.startswith("end")]
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": "the_main_doors",
        "code": "EP-003",
        "sections": data,
        "overviewOrder": overview_order,
        "heroSectionId": "cold-open",
        "slideSectionMap": slide_map,
    }


def build_ep004(data: list[dict]) -> dict:
    by_id = {s["id"]: s for s in data}
    slide_map = {
        "s_open": "slide-s-open-promise",
        "s1": "slide-s1-why-it-matters",
        "s2": "slide-s2-acos",
        "s3": "slide-s3-domain-systems",
        "s4": "slide-s4-sot",
        "s5": "slide-s5-mental-sort",
        "s6": "slide-s6-misuse",
        "s7": "slide-s7-before-tr-001a",
    }
    for v in slide_map.values():
        assert v in by_id, f"EP-004 missing {v}"
    overview_order = [s["id"] for s in data if s["id"] not in ("end",)]
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": "current_truth_basics",
        "code": "EP-004",
        "sections": data,
        "overviewOrder": overview_order,
        "heroSectionId": "cold-open",
        "slideSectionMap": slide_map,
    }


def build_tr001a_manual() -> dict:
    """Combined sections for TR-001A per plan (opening+sc1+2, parts, eval, closing)."""
    raw = (DOCS / "TR-001A_SCRIPT.md").read_text(encoding="utf-8")

    def grab(section_title: str) -> str:
        m = re.search(
            rf"## {re.escape(section_title)}\s*([\s\S]+?)(?=\n## |\Z)",
            raw,
        )
        if not m:
            return ""
        body = m.group(1)
        vo = re.search(
            r"\*\*VOICEOVER\*\*\s*\n+([\s\S]+?)(?=\n---|\n\*\*[A-Z][A-Za-z ]+\*\*|\n## |\Z)",
            body,
            re.I,
        )
        vo_inline = re.search(r"\*\*VOICEOVER:\*\*\s*([^\n]+)", body, re.I)
        if vo:
            text = vo.group(1).strip()
        elif vo_inline:
            text = vo_inline.group(1).strip()
        else:
            text = re.sub(r"\*\*ON SCREEN\*\*[\s\S]*?(?=\n\n|\Z)", "", body, flags=re.I)
            text = re.sub(r"`[^`]+`", "", text)
            text = text.strip()
        text = re.sub(r"\*\*[^\n]+\*\*", "", text)
        text = re.sub(r"---+", " ", text)
        return clean_speak(text)

    opening = "\n".join(
        filter(
            None,
            [
                grab("Opening frame"),
                grab("Scene 1 — What this check measures"),
                grab("Scene 2 — Instructions"),
            ],
        )
    )
    part1 = "\n".join(
        filter(
            None,
            [
                grab("Scene 3 — Part 1 begins"),
                "Eight multiple choice questions are on screen. Use Grade Part 1 when you are ready. You need at least seven of eight correct to continue.",
            ],
        )
    )
    part2 = grab("Scene 4 — Part 2 (short answer)") or grab("Scene 4 — Part 2")
    part3 = (
        "You return and need two things: resume your learning path, and find organized standards or governance. "
        "Which two learner-facing doors do you use, in order? "
        "The correct answer is ByteCast Playlist first, then Docs Portal."
    )
    eval_text = (
        "To pass: you need at least eighty percent on Part 1 — eight questions, so at least seven correct. "
        "Both short answers need at least twenty characters each. The scenario must be correct. "
        "If you are not ready, review EP-001 for the loop and doors, EP-002 for the ecosystem, "
        "EP-003 for the doors, and EP-004 for current truth, ACOS, and SOT. The goal is learning, not punishment."
    )
    closing = "\n".join(
        filter(
            None,
            [
                grab("Scene 9 — Recap chips"),
                grab("Closing"),
            ],
        )
    )

    def sec(sid: str, title: str, speak: str) -> dict:
        return {
            "id": sid,
            "title": title,
            "displayText": clean_display(speak),
            "speakText": speak,
        }

    sections = [
        sec("tr-opening", "Opening and orientation", opening),
        sec("tr-part1", "Part 1 — Quick check", part1),
        sec("tr-part2", "Part 2 — Short answers", part2),
        sec("tr-part3", "Part 3 — Scenario", part3),
        sec("tr-eval", "How you are evaluated", eval_text),
        sec("tr-closing", "Completion", closing),
    ]
    overview_order = [s["id"] for s in sections]
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": "tr_001a_day1_foundations",
        "code": "TR-001A",
        "sections": sections,
        "overviewOrder": overview_order,
        "heroSectionId": "tr-opening",
        "slideSectionMap": {},
        "domSectionMap": {
            "read-tr001a-opening": "tr-opening",
            "part1": "tr-part1",
            "part2": "tr-part2",
            "part3": "tr-part3",
            "eval": "tr-eval",
            "closing": "tr-closing",
        },
    }


def write_voiceover_assets(out: Path, payload: dict) -> None:
    """Write pretty JSON plus a .load.js shim for file:// pages (fetch + CORS block local JSON)."""
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    load_path = out.with_name(f"{out.stem}.load.js")
    dumped = json.dumps(payload, ensure_ascii=False)
    load_path.write_text(
        "/** Auto-generated for file:// support (null origin blocks fetch on .json). "
        "Regenerate: python scripts/voiceover_md_to_json.py */\n"
        "window.ByteCastVoiceoverSections = "
        + dumped
        + ";\n",
        encoding="utf-8",
    )
    print("Wrote", out.relative_to(ROOT), "and", load_path.relative_to(ROOT))


def main() -> None:
    jobs = [
        (DOCS / "EP-001_VOICEOVER.md", build_ep001, ROOT / "episodes" / "welcome_to_bytecast" / "assets" / "voiceover_sections.json"),
        (DOCS / "EP-002_VOICEOVER.md", build_ep002, ROOT / "episodes" / "aerovista_7_division_overview" / "assets" / "voiceover_sections.json"),
        (DOCS / "EP-003_VOICEOVER.md", build_ep003, ROOT / "episodes" / "the_main_doors" / "assets" / "voiceover_sections.json"),
        (DOCS / "EP-004_VOICEOVER.md", build_ep004, ROOT / "episodes" / "current_truth_basics" / "assets" / "voiceover_sections.json"),
    ]
    for src, builder, out in jobs:
        text = src.read_text(encoding="utf-8")
        sections = parse_markdown_sections(text)
        payload = builder(sections)
        write_voiceover_assets(out, payload)

    tr = build_tr001a_manual()
    tr_out = ROOT / "training_missions" / "tr_001a_day1_foundations" / "assets" / "voiceover_sections.json"
    write_voiceover_assets(tr_out, tr)


if __name__ == "__main__":
    main()
