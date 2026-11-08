#!/usr/bin/env python3
"""
Build voiceover_sections.json (+ .load.js) and narration forge inputs for Agent Days 5–10.

Reads episode profile script sections (IDs stay aligned with HTML journey).

  python scripts/agent_day_voiceover_build.py 5 6 7 8 9 10
  python scripts/agent_day_voiceover_build.py --all
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

DAY_META: dict[int, dict] = {
    5: {
        "slug": "working_the_queue",
        "code": "AGENT-D5",
        "pack_id": "agent_day5_working_the_queue",
        "title": "Working the Queue",
        "workflow_segments": "queue_segments",
    },
    6: {
        "slug": "safe_access_boundaries",
        "code": "AGENT-D6",
        "pack_id": "agent_day6_safe_access",
        "title": "Safe Access & Boundaries",
        "workflow_segments": "access_segments",
    },
    7: {
        "slug": "builder_client_experience",
        "code": "AGENT-D7",
        "pack_id": "agent_day7_builder_client",
        "title": "Builder & Client Experience",
        "workflow_segments": "serve_segments",
    },
    8: {
        "slug": "writing_like_aerovista",
        "code": "AGENT-D8",
        "pack_id": "agent_day8_writing",
        "title": "Writing Like AeroVista",
        "workflow_segments": "writing_segments",
    },
    9: {
        "slug": "from_draft_to_deliverable",
        "code": "AGENT-D9",
        "pack_id": "agent_day9_deliverable",
        "title": "From Draft to Deliverable",
        "workflow_segments": "deliver_segments",
    },
    10: {
        "slug": "trusted_agent_capstone",
        "code": "AGENT-D10",
        "pack_id": "agent_day10_capstone",
        "title": "Trusted Agent Capstone",
        "workflow_segments": "capstone_segments",
    },
}


def clean_speak(text: str) -> str:
    t = re.sub(r"\[SFX:[^\]]+\]", "", text, flags=re.I)
    t = re.sub(r"\*\*BYTE:\*\*\s*", "", t, flags=re.I)
    t = re.sub(r"\*\*([^*]+)\*\*", r"\1", t)
    t = re.sub(r"`([^`]+)`", r"\1", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def clean_display(text: str) -> str:
    t = re.sub(r"\[SFX:[^\]]+\]", "", text, flags=re.I)
    t = re.sub(r"\*\*BYTE:\*\*\s*", "", t, flags=re.I)
    return t.strip()


def paragraphs_to_text(paragraphs: list[str]) -> str:
    parts = []
    for p in paragraphs or []:
        p = p.strip()
        if not p:
            continue
        if p.startswith("- "):
            parts.append(p[2:].strip())
        else:
            parts.append(p)
    return "\n\n".join(parts)


def sections_from_profile(profile: dict) -> list[dict]:
    out: list[dict] = []
    for sec in profile.get("script", {}).get("sections", []):
        display = paragraphs_to_text(sec.get("paragraphs", []))
        speak = clean_speak(display.replace("\n\n", " "))
        if not speak:
            continue
        out.append(
            {
                "id": sec["id"],
                "title": sec.get("title", sec["id"]),
                "displayText": clean_display(display),
                "speakText": speak,
            }
        )
    return out


def write_voiceover_assets(ep_dir: Path, meta: dict, sections: list[dict]) -> None:
    assets = ep_dir / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    order = [s["id"] for s in sections]
    payload = {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": meta["slug"],
        "code": meta["code"],
        "narrator": "Byte",
        "sections": sections,
        "overviewOrder": order,
        "heroSectionId": order[0] if order else "cold_open",
        "segmentOrder": order,
    }
    out_json = assets / "voiceover_sections.json"
    out_json.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    dumped = json.dumps(payload, ensure_ascii=False)
    load_js = assets / "voiceover_sections.load.js"
    load_js.write_text(
        f"/** Auto-generated. Regenerate: python scripts/agent_day_voiceover_build.py {meta['day']} */\n"
        f"window.ByteCastVoiceoverSections = {dumped};\n",
        encoding="utf-8",
    )
    print(f"  wrote {out_json.relative_to(ROOT)} (+ load.js)")


def write_forge_pack(meta: dict, sections: list[dict]) -> None:
    day = meta["day"]
    forge_dir = ROOT / "tools" / "narration" / f"agent_day{day}"
    forge_dir.mkdir(parents=True, exist_ok=True)
    line_ids = [s["id"] for s in sections]

    lines = [
        {
            "id": sec["id"],
            "label": sec["title"],
            "text": sec["speakText"],
            "voiceRecipe": "byte-narrator",
        }
        for sec in sections
    ]
    lines_path = forge_dir / "lines.master.json"
    lines_path.write_text(
        json.dumps(
            {
                "schema": "narration-lines-master-v1",
                "packId": meta["pack_id"],
                "episodeCode": meta["code"],
                "lines": lines,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    sequences_path = forge_dir / "sequences.json"
    sequences_path.write_text(
        json.dumps(
            {
                "schema": "narration-sequences-v1",
                "packId": meta["pack_id"],
                "sequences": {
                    "full_journey": {
                        "label": f"{meta['title']} — full journey",
                        "lineIds": line_ids,
                    }
                },
                "defaultSequence": "full_journey",
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    voice_recipes = forge_dir / "voiceRecipes.json"
    if not voice_recipes.exists():
        voice_recipes.write_text(
            json.dumps(
                {
                    "schema": "narration-voice-recipes-v1",
                    "recipes": {
                        "byte-narrator": {
                            "label": f"Byte — Agent Day {day} narrator",
                            "engine": "piper",
                            "voice": "en_US-amy-medium",
                            "speed": 1.05 if day >= 8 else 1.06,
                            "format": "wav",
                        }
                    },
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

    slug = meta["slug"]
    forge_config = forge_dir / "forge.config.json"
    forge_config.write_text(
        json.dumps(
            {
                "schema": "narration-forge-config-v1",
                "packId": meta["pack_id"],
                "episodeCode": meta["code"],
                "authoringRoot": f"docs/agent_day{day}",
                "linesMaster": f"tools/narration/agent_day{day}/lines.master.json",
                "sequences": f"tools/narration/agent_day{day}/sequences.json",
                "voiceRecipes": f"tools/narration/agent_day{day}/voiceRecipes.json",
                "bindings": f"tools/narration/agent_day{day}/bindings.json",
                "outputDir": f"episodes/{slug}/assets/narration",
                "runtimeManifest": f"episodes/{slug}/assets/narration.manifest.json",
                "shipFormat": "wav",
                "tts": {
                    "provider": "nxcore-echoverse",
                    "endpoint": "/api/generate",
                    "envUrl": "NXCORE_TTS_URL",
                    "defaultUrl": "http://127.0.0.1:5315",
                },
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    bindings = forge_dir / "bindings.json"
    bindings.write_text(
        json.dumps(
            {
                "schema": "narration-bindings-v1",
                "packId": meta["pack_id"],
                "runtime": {
                    "player": "../../assets/shared/nxcore_narration_player.js",
                    "manifest": f"episodes/{slug}/assets/narration.manifest.json",
                    "fallback": "assets/shared/listen_mode.js",
                },
                "episode": {
                    "slug": slug,
                    "listenGateStep": meta["workflow_segments"],
                },
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    # touch profile media.forge_pack
    profile_path = ROOT / "episodes" / slug / "bytecast_ep_profile.json"
    if profile_path.exists():
        profile = json.loads(profile_path.read_text(encoding="utf-8"))
        profile.setdefault("media", {})
        profile["media"]["voiceover_sections"] = "assets/voiceover_sections.json"
        profile["media"]["narration_manifest"] = "assets/narration.manifest.json"
        profile["media"]["forge_pack"] = f"tools/narration/agent_day{day}"
        profile_path.write_text(json.dumps(profile, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"  forge pack tools/narration/agent_day{day}/ ({len(line_ids)} lines)")


def build_day(day: int) -> None:
    if day not in DAY_META:
        raise SystemExit(f"Unknown day: {day} (supported: {sorted(DAY_META)})")
    meta = {**DAY_META[day], "day": day}
    slug = meta["slug"]
    profile_path = ROOT / "episodes" / slug / "bytecast_ep_profile.json"
    if not profile_path.exists():
        raise SystemExit(f"Missing profile: {profile_path} — run npm run build:agent-days-5-10 first")
    profile = json.loads(profile_path.read_text(encoding="utf-8"))
    sections = sections_from_profile(profile)
    if not sections:
        raise SystemExit(f"No script sections in {profile_path}")
    print(f"Day {day} — {meta['title']} ({len(sections)} segments)")
    write_voiceover_assets(ROOT / "episodes" / slug, meta, sections)
    write_forge_pack(meta, sections)


def main() -> None:
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        raise SystemExit(0)
    days: list[int]
    if args[0] == "--all":
        days = sorted(DAY_META)
    else:
        days = [int(a) for a in args]
    for day in days:
        build_day(day)
    print(f"Done — {len(days)} day(s). Next: npm run forge:agent-days-5-10")


if __name__ == "__main__":
    main()
