from __future__ import annotations

import json
from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]
DATE = "2026-03-29"
JOURNEY_ID = "lumina_revenue_v1"


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def write_json(path: Path, payload: object) -> None:
    write_text(path, json.dumps(payload, indent=2, ensure_ascii=False))


def build_sot_manifest(
    *,
    name: str,
    slug: str,
    deploy_path: str,
    business_role: str,
    division: str = "Lumina",
    canon_files: list[dict] | None = None,
) -> dict:
    files = [
        {
            "id": "sot_self",
            "path": "SOT.json",
            "type": "json",
            "role": "source of truth manifest",
            "required": True,
            "owner": "project-owner",
            "status": "active",
        }
    ]
    if canon_files:
        files.extend(canon_files)

    return {
        "sot_version": "2.0-aerovista",
        "project": {
            "name": name,
            "slug": slug,
            "brand": "AeroVista",
            "division": division,
            "owner": "AeroVista LLC",
            "status": "active",
            "lifecycle": "production",
            "type": "app",
            "category": "internal-tool",
            "root": "./",
            "primary_language": "html",
            "repo_visibility": "private",
            "created": "2026-03-27",
            "updated": DATE,
            "timezone": "America/Los_Angeles",
        },
        "purpose": {
            "summary": "Defines the canonical files, folders, systems, and validation rules for this AeroVista project.",
            "source_of_truth_policy": "Only files listed here and stored in approved canon locations are treated as master files.",
            "business_role": business_role,
        },
        "technical_profile": {
            "stack": {
                "frontend": ["HTML", "CSS", "JavaScript"],
                "backend": [],
                "database": [],
                "infra": [],
                "analytics": [],
                "ai": [],
            },
            "runtime": {
                "local_ports": [18080],
                "service_urls": [],
                "health_endpoint": "/health",
                "entry_command": "",
                "build_command": "",
                "start_command": "",
            },
            "deployment": {
                "primary_host": "NXCore",
                "deploy_path": deploy_path,
                "public_url": "",
                "internal_url": "",
                "containerized": False,
                "compose_file": "docker-compose.yml",
                "reverse_proxy": "Traefik",
                "networking_notes": "",
            },
            "data_model": {
                "core_db_dependency": False,
                "domain_db": "",
                "canonical_event_ledger": "",
                "shared_storage": [],
            },
        },
        "canon": {
            "canon_root": "./",
            "allowed_master_locations": [
                "./docs",
                "./config",
                "./data",
                "./schemas",
                "./prompts",
            ],
            "forbidden_master_locations": [
                "./archive",
                "./intake",
                "./tmp",
                "./build",
                "./dist",
                "./coverage",
                "./node_modules",
            ],
        },
        "entrypoints": [
            {
                "id": "ep_0_index-html",
                "label": "index.html",
                "path": "index.html",
                "required": True,
                "notes": "Primary learner entrypoint.",
            }
        ],
        "canon_files": files,
        "canon_folders": [],
        "systems": {
            "linked_projects": [],
            "depends_on": [],
            "feeds": [],
            "consumes": [],
            "shares_with": [],
            "related_domains": [],
            "tailscale_hosts": [],
            "cloudflare_tunnels": [],
        },
        "ops": {
            "service_name": slug,
            "health_check_paths": ["/health"],
            "backup_targets": [],
            "log_locations": [],
            "secrets_locations": [],
            "monitoring": {
                "enabled": False,
                "providers": [],
            },
        },
        "governance": {
            "review_cycle": "when major changes ship",
            "update_rule": "Update this file whenever a canonical file moves, is replaced, changes purpose, or deploy behavior changes.",
            "promotion_rule": "Files are promoted into canon only after review.",
            "archive_rule": "Old versions move to archive and are never treated as master files.",
            "owner_roles": [
                "project-owner",
                "ops-owner",
                "tech-owner",
            ],
        },
        "duplicates": [],
        "checks": {
            "required_paths_exist": ["SOT.json", "index.html"],
            "marker": {
                "enabled": True,
                "marker_key": "SOT:",
                "accepted_ext": [
                    ".md",
                    ".html",
                    ".json",
                    ".txt",
                    ".yml",
                    ".yaml",
                    ".ts",
                    ".tsx",
                    ".js",
                    ".jsx",
                ],
            },
            "hash_canon_files": True,
            "warn_on_duplicate_ids": True,
            "warn_on_missing_required": True,
            "warn_on_master_outside_allowed_locations": True,
        },
        "notes": [
            "Generated by scripts/build_lumina_lane.py.",
            "Update project metadata first.",
            "List true master docs, configs, and schemas in canon_files.",
        ],
    }


EPISODE_CSS = dedent(
    """
    :root {
      --bg0:#050607; --bg1:#0b0f14; --stroke:rgba(255,255,255,0.12);
      --ink:rgba(255,255,255,0.93); --muted:rgba(255,255,255,0.66); --faint:rgba(255,255,255,0.42);
      --neon:#22a7ff; --ghost:#a66bff; --gold:#ffc45a;
      --max:1180px; --pad:clamp(16px,2.2vw,26px); --radius:22px;
      --glow-neon:0 0 18px rgba(34,167,255,0.30), 0 0 42px rgba(34,167,255,0.16);
      --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      --sans:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;
    }
    *{box-sizing:border-box;} body{margin:0;font-family:var(--sans);color:var(--ink);background:radial-gradient(800px 400px at 80% 0%,rgba(166,107,255,0.1),transparent),radial-gradient(600px 360px at 15% 70%,rgba(34,167,255,0.06),transparent),linear-gradient(180deg,var(--bg0),var(--bg1));overflow-x:hidden;}
    a{color:inherit;} .skip{position:absolute;left:-999px;top:8px;background:#000;color:#fff;padding:10px 12px;border-radius:10px;z-index:9999;} .skip:focus{left:12px;}
    .topbar{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:linear-gradient(180deg,rgba(5,6,7,0.82),rgba(5,6,7,0.56));border-bottom:1px solid var(--stroke);}
    .topbar__inner{max-width:var(--max);margin:0 auto;padding:14px var(--pad);display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;}
    .badge{display:inline-flex;align-items:center;gap:10px;padding:8px 12px;border-radius:999px;border:1px solid var(--stroke);background:rgba(255,255,255,0.03);} .dot{width:10px;height:10px;border-radius:999px;background:var(--neon);box-shadow:var(--glow-neon);}
    .controls,.pills,.startCard__actions,.startCard__steps,.refRow,.gateRow{display:flex;flex-wrap:wrap;gap:10px;}
    .controls{justify-content:flex-end;} .btn{border:1px solid var(--stroke);background:rgba(255,255,255,0.03);color:var(--ink);border-radius:999px;padding:10px 12px;font-size:13px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}
    .btn:hover{transform:translateY(-1px);border-color:rgba(100,180,255,0.25);box-shadow:var(--glow-neon);} .btn--primary{border-color:rgba(34,167,255,0.35);box-shadow:var(--glow-neon);} .btn--quiet{background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.10);box-shadow:none;}
    .topbar .btn{padding:8px 11px;font-size:12px;background:rgba(255,255,255,0.02);box-shadow:none;border-color:rgba(255,255,255,0.10);} .btn[hidden]{display:none!important;}
    .wrap{max-width:var(--max);margin:0 auto;padding:18px var(--pad) 90px;} .hero{border-radius:var(--radius);border:1px solid var(--stroke);padding:clamp(18px,2.8vw,34px);background:linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02)),radial-gradient(700px 260px at 90% 0%,rgba(166,107,255,0.14),transparent 55%);box-shadow:0 18px 80px rgba(0,0,0,0.45);}
    .hero__grid{display:grid;grid-template-columns:1.2fr 0.85fr;gap:18px;} @media(max-width:900px){.hero__grid,.grid2,.slideGrid{grid-template-columns:1fr;}}
    .h-title{margin:0 0 10px;font-size:clamp(32px,4vw,52px);letter-spacing:-0.02em;} .h-sub,.muted{color:var(--muted);line-height:1.55;} .h-sub{margin:0 0 14px;max-width:65ch;}
    .pill{display:inline-flex;align-items:center;gap:10px;padding:8px 12px;border-radius:999px;border:1px solid var(--stroke);font-size:12px;} .pill strong,.startCard__eyebrow,.callout .k,.deckHint,.slideId,footer{font-family:var(--mono);} .spark{width:8px;height:8px;border-radius:99px;background:var(--ghost);}
    .startCard{margin-top:16px;padding:16px 18px;border-radius:18px;border:1px solid rgba(34,167,255,0.18);background:linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02));box-shadow:0 12px 40px rgba(0,0,0,0.20);}
    .startCard__eyebrow{font-size:11px;letter-spacing:0.12em;color:var(--faint);text-transform:uppercase;} .startCard__title{margin:8px 0 6px;font-size:clamp(18px,2.1vw,22px);letter-spacing:-0.02em;} .startCard__copy{margin:0;max-width:62ch;}
    .startCard__steps{gap:8px;margin-top:12px;} .startCard__step{display:inline-flex;align-items:center;gap:8px;padding:7px 11px;border-radius:999px;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.03);font-size:12px;color:rgba(255,255,255,0.74);}
    .startCard__step strong{font-family:var(--mono);font-size:11px;color:rgba(255,255,255,0.96);} .startCard__step.is-active{border-color:rgba(34,167,255,0.28);background:rgba(34,167,255,0.08);color:rgba(255,255,255,0.92);} .startCard__step.is-done{border-color:rgba(120,255,180,0.22);background:rgba(120,255,180,0.08);color:rgba(255,255,255,0.88);} .startCard__note{margin:12px 0 0;max-width:68ch;}
    .panel,.card,.callout{border-radius:14px;border:1px solid var(--stroke);background:rgba(0,0,0,0.20);} .panel{margin-top:14px;border-radius:var(--radius);background:rgba(255,255,255,0.04);overflow:hidden;} .panel__top{padding:16px var(--pad);border-bottom:1px solid rgba(255,255,255,0.10);background:rgba(0,0,0,0.18);} .panel__body{padding:14px var(--pad) 18px;}
    .sectionGuide{margin-top:14px;} .sectionGuide__top{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap;} .sectionGuide__eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:0.12em;color:var(--faint);text-transform:uppercase;} .sectionGuide__title{margin:6px 0 6px;font-size:20px;letter-spacing:-0.02em;} .sectionGuide__copy{margin:0;max-width:66ch;}
    .sectionGuide__actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;} .sectionGuide__progress{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;} .sectionGuide__step{display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border-radius:999px;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.03);font-size:12px;color:rgba(255,255,255,0.74);} .sectionGuide__step strong{font-family:var(--mono);font-size:11px;} .sectionGuide__step.is-current{border-color:rgba(34,167,255,0.32);background:rgba(34,167,255,0.10);color:rgba(255,255,255,0.94);} .sectionGuide__step.is-done{border-color:rgba(120,255,180,0.24);background:rgba(120,255,180,0.08);color:rgba(255,255,255,0.9);}
    .sectionHint{margin-top:14px;padding:14px 16px;border-radius:16px;border:1px dashed rgba(255,255,255,0.14);background:rgba(255,255,255,0.03);display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;} .sectionHint.is-ready{border-style:solid;border-color:rgba(34,167,255,0.28);background:rgba(34,167,255,0.08);box-shadow:var(--glow-neon);} .sectionHint strong{display:block;margin-bottom:4px;} .sectionHint__copy{max-width:70ch;}
    .chip{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;border:1px solid var(--stroke);background:rgba(0,0,0,0.22);font-size:12px;} .tagdot{width:7px;height:7px;border-radius:99px;background:var(--neon);box-shadow:var(--glow-neon);}
    .tabsHost{margin-top:14px;} .tabs__bar{display:flex;flex-wrap:wrap;gap:8px;padding:14px var(--pad);border-bottom:1px solid rgba(255,255,255,0.10);background:rgba(0,0,0,0.22);} .tabs__btn{border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:var(--ink);border-radius:999px;padding:10px 16px;font-size:13px;cursor:pointer;font-weight:800;letter-spacing:-0.01em;} .tabs__btn.is-active{border-color:rgba(34,167,255,0.4);box-shadow:var(--glow-neon);} .tabs__panel[hidden]{display:none!important;}
    .deck__bar{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px var(--pad);border-bottom:1px solid rgba(255,255,255,0.10);background:rgba(0,0,0,0.20);flex-wrap:wrap;} .deckTitleRow{display:flex;align-items:center;gap:12px;flex-wrap:wrap;flex:1;min-width:0;}
    .slideProg{font-family:var(--mono);font-size:12px;color:var(--faint);} .dots{display:flex;gap:8px;flex-wrap:wrap;} .dotBtn{width:10px;height:10px;border-radius:99px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.06);cursor:pointer;} .dotBtn[aria-current="true"]{background:var(--neon);border-color:rgba(34,167,255,0.45);box-shadow:var(--glow-neon);}
    .slides{min-height:320px;} .slide{display:none;padding:18px var(--pad) 20px;} .slide.is-active{display:block;} .slideGrid{display:grid;grid-template-columns:1.15fr 0.85fr;gap:16px;align-items:start;}
    .card,.callout{padding:16px;} .card ul{margin:10px 0 0;padding-left:18px;color:rgba(255,255,255,0.82);} .callout{border-color:rgba(34,167,255,0.24);box-shadow:var(--glow-neon);} .callout .k{font-size:12px;color:var(--gold);letter-spacing:0.08em;text-transform:uppercase;}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;} .quizChoice{display:flex;gap:8px;align-items:flex-start;margin:6px 0;} .quizChoice--correct label{color:rgba(120,255,180,0.95);} .quizChoice--wrong label{color:rgba(255,160,160,0.95);}
    .quizExplain{margin-top:10px;padding:10px 12px;border-radius:10px;font-size:12px;line-height:1.45;color:rgba(255,255,255,0.72);background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);}
    .gateRow{align-items:center;margin-bottom:14px;} .gatePill{font-family:var(--mono);font-size:11px;padding:6px 11px;border-radius:999px;border:1px solid rgba(255,255,255,0.12);} .gatePill--on{border-color:rgba(34,167,255,0.45);color:rgba(255,255,255,0.92);box-shadow:var(--glow-neon);} .gatePill--off{opacity:0.42;}
    footer{margin-top:18px;color:var(--faint);font-size:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;} :focus-visible{outline:2px solid rgba(34,167,255,0.55);outline-offset:3px;border-radius:12px;}
    """
)


EPISODE_HTML = dedent(
    """
    <!doctype html>
    <html lang="en" data-theme="venta-neon">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>ByteCast - Lumina Revenue Lane</title>
      <meta name="description" content="Lumina revenue lane episode pack for ByteCast." />
      <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
      <link rel="stylesheet" href="../../assets/shared/lumina_episode.css" />
      <link rel="stylesheet" href="../../assets/shared/listen_mode.css" />
    </head>
    <body>
      <a class="skip" href="#main">Skip to content</a>
      <div class="topbar"><div class="topbar__inner">
        <div class="badge"><span class="dot"></span><div><div id="topEp" style="font-weight:800;">ByteCast - Loading</div><small class="muted" id="topTitle">Lumina Revenue Lane</small></div></div>
        <div class="controls">
          <a class="btn" id="prevEpisodeBtn" href="#" hidden>Previous</a>
          <a class="btn" href="../../seed_bytecast.html">Playlist</a>
          <a class="btn" href="../training_hub/index.html">Training Hub</a>
          <button class="btn" id="btnPrev" type="button" hidden>Prev Slide</button>
          <button class="btn" id="btnNext" type="button" hidden>Next Slide</button>
        </div>
      </div></div>
      <main class="wrap" id="main">
        <section class="hero" aria-labelledby="heroTitle">
          <div class="hero__grid">
            <div>
              <h1 class="h-title" id="heroTitle">Lumina Revenue Lane</h1>
              <p class="h-sub" id="heroSub">Loading episode profile...</p>
              <div class="pills" id="metaPills"></div>
              <section class="startCard" aria-label="Start here">
                <div class="startCard__eyebrow">Start Here</div>
                <h2 class="startCard__title">Listen first, then move across the tabs in order.</h2>
                <p class="startCard__copy" id="startCopy">One clean pass through Listen will make the slides and exercise feel easier to route.</p>
                <div class="startCard__actions">
                  <button class="btn btn--primary" type="button" id="jumpListen">1 Listen</button>
                  <button class="btn btn--quiet" type="button" id="jumpSlides">2 Slides</button>
                  <button class="btn btn--quiet" type="button" id="jumpRef">3 Reference</button>
                  <button class="btn btn--quiet" type="button" id="jumpEngage">4 Engage</button>
                </div>
                <div class="startCard__steps"><span class="startCard__step is-active"><strong>1</strong> Listen</span><span class="startCard__step"><strong>2</strong> Slides</span><span class="startCard__step"><strong>3</strong> Reference</span><span class="startCard__step"><strong>4</strong> Engage</span></div>
                <div id="heroListenAttach" class="bytecast-listen-dim-exempt"></div>
                <p class="muted startCard__note" id="heroNote"></p>
              </section>
            </div>
            <aside class="card"><div class="callout" style="padding:16px;border-radius:18px;"><div class="k" id="heroKicker">Lumina Revenue Lane</div><p id="keyLine" style="margin:10px 0 0;line-height:1.55;">Commercial clarity before delivery promises.</p><div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;"><span class="chip"><span class="tagdot"></span> <b id="heroNextTag" style="font-family:var(--mono);">THEN</b> <span id="heroNextLabel">Keep going</span></span></div></div></aside>
          </div>
        </section>
        <section class="panel sectionGuide" aria-label="Episode navigation guide">
          <div class="panel__body">
            <div class="sectionGuide__top">
              <div>
                <div class="sectionGuide__eyebrow">Episode Guide</div>
                <h2 class="sectionGuide__title" id="guideTitle">Start with Listen</h2>
                <p class="muted sectionGuide__copy" id="guideCopy">Use one clean pass through the lesson from left to right. The next click is always called out here.</p>
              </div>
              <div class="sectionGuide__actions">
                <button class="btn btn--primary" type="button" id="guideBtn" data-guide-action="listen">1 Listen</button>
                <span class="chip" id="guideStatus">Next click: 1 Listen</span>
              </div>
            </div>
            <div class="sectionGuide__progress" id="guideProgress"></div>
          </div>
        </section>
        <section class="panel tabsHost" id="lessonTabs" aria-label="Episode lesson">
          <div class="tabs__bar" role="tablist" aria-label="Lesson sections">
            <button type="button" class="tabs__btn is-active" role="tab" id="tab-listen" aria-selected="true" aria-controls="listen-panel">1 Listen</button>
            <button type="button" class="tabs__btn" role="tab" id="tab-lesson-slides" aria-selected="false" aria-controls="lesson-slides">2 Slides</button>
            <button type="button" class="tabs__btn" role="tab" id="tab-refstrip" aria-selected="false" aria-controls="refstrip">3 Reference</button>
            <button type="button" class="tabs__btn" role="tab" id="tab-engage" aria-selected="false" aria-controls="engage">4 Engage</button>
          </div>
          <div id="listen-panel" class="tabs__panel" role="tabpanel" aria-labelledby="tab-listen">
            <div class="panel__top"><div class="panel__meta"><h2>Listen</h2><p id="audioLine">Read the episode overview or play optional narration. Completing a listen pass clears the listen gate.</p></div><div class="chip"><span class="tagdot"></span> <b id="listenGateLabel" style="font-family:var(--mono);">GATE</b></div></div>
            <div class="panel__body"><div id="listenModeMount" class="bytecast-listen-dim-exempt"></div><div class="sectionHint" id="listenHint" aria-live="polite"></div><audio id="audio" preload="metadata" aria-hidden="true" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;"></audio></div>
          </div>
          <div id="lesson-slides" class="tabs__panel" role="tabpanel" aria-labelledby="tab-lesson-slides" hidden>
            <div class="deck__bar"><div class="deckTitleRow"><h3 id="deckTitle">Slides</h3><span class="slideProg" id="slideProg" aria-live="polite">-</span></div><span class="deckHint" aria-hidden="true">Use buttons or left/right keys</span><div class="dots" id="dots"></div></div>
            <div class="slides" id="slides"></div>
            <div class="panel__body"><div class="sectionHint" id="slidesHint" aria-live="polite"></div></div>
          </div>
          <div id="refstrip" class="tabs__panel" role="tabpanel" aria-labelledby="tab-refstrip" hidden>
            <div class="panel__top"><div class="panel__meta"><h2>Reference</h2><p id="refBlurb">Use the lane plan and governed docs to reinforce the lesson before you submit the quiz.</p></div></div>
            <div class="panel__body"><div class="refRow" id="refLinks"></div><div class="sectionHint" id="refHint" aria-live="polite"></div></div>
          </div>
          <div id="engage" class="tabs__panel" role="tabpanel" aria-labelledby="tab-engage" hidden>
            <div class="deck__bar"><h3>Engage</h3><span class="chip"><span class="tagdot"></span> Quiz >= 80%</span></div>
            <div class="panel__body">
              <div class="grid2"><div class="card"><h4 id="questTitle">Quest</h4><p class="muted" id="questBlurb">Use the checklist to reinforce the behavior, not just the wording.</p><div id="questList"></div></div><div class="card"><h4>Quiz</h4><p class="muted" id="quizBlurb">Pass the knowledge check to clear the engage gate.</p><div id="quiz"></div></div></div>
              <div class="sectionHint" id="engageHint" aria-live="polite"></div>
            </div>
          </div>
        </section>
        <section class="panel"><div class="panel__top"><div class="panel__meta"><h2>Next</h2><p id="nextDesc">Complete the episode gates, then continue to the next step in the lane.</p></div></div><div class="panel__body"><div class="gateRow" id="gateRow"></div><a class="btn" id="nextEp" href="../../seed_bytecast.html">Continue</a><span class="chip" id="gateNote" style="margin-left:10px;">Gates loading...</span></div></section>
        <footer><span id="footerLeft">ByteCast - Lumina Revenue Lane</span><span>Tabs: Listen / Slides / Reference / Engage</span></footer>
      </main>
      <script src="../../assets/shared/bytecast_loop.js"></script>
      <script src="../../assets/shared/listen_mode.js"></script>
      <script src="../../assets/shared/lumina_episode_runtime.js"></script>
    </body>
    </html>
    """
)


EPISODE_JS = dedent(
    """
    (() => {
      const PROFILE_URL = "./bytecast_ep_profile.json";
      const Loop = window.ByteCastLoop || null;
      let CFG = { slug: "lumina_rev_101", code: "EP-LUM-101", journeyId: "lumina_revenue_v1", listenStep: "lum101_listen", slideStep: "lum101_slide", engageStep: "lum101_engage", storagePrefix: "lumina_rev_101" };
      const viewState = {
        activePanelId: "listen-panel",
        slideIndex: 0,
        slideTotal: 0,
        listenDone: false,
        slideDone: false,
        engageDone: false,
        visitedPanels: new Set(["listen-panel"])
      };
      const TAB_FLOW = [
        { id: "listen-panel", tab: "#tab-listen", jump: "#jumpListen", title: "Listen", step: "1" },
        { id: "lesson-slides", tab: "#tab-lesson-slides", jump: "#jumpSlides", title: "Slides", step: "2" },
        { id: "refstrip", tab: "#tab-refstrip", jump: "#jumpRef", title: "Reference", step: "3" },
        { id: "engage", tab: "#tab-engage", jump: "#jumpEngage", title: "Engage", step: "4" }
      ];
      const $ = (s, r = document) => r.querySelector(s);
      const escapeHtml = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
      const pill = (label, value) => `<span class="pill"><span class="spark"></span><strong>${escapeHtml(label)}</strong> ${escapeHtml(value)}</span>`;
      const loadJson = async (url) => { const response = await fetch(url); if (!response.ok) throw new Error(`Fetch failed ${response.status}`); return response.json(); };
      const currentTab = () => TAB_FLOW.find((item) => item.id === viewState.activePanelId) || TAB_FLOW[0];

      function getGateState() {
        let listenDone = viewState.listenDone;
        let slideDone = viewState.slideDone;
        let engageDone = viewState.engageDone;
        if (Loop) {
          try {
            const wf2 = Loop.ensureWorkflowV2(CFG.journeyId || Loop.getActiveJourneyId?.() || "lumina_revenue_v1");
            listenDone = listenDone || Loop.isStepDone(wf2, CFG.listenStep);
            slideDone = slideDone || Loop.isStepDone(wf2, CFG.slideStep);
            engageDone = engageDone || Loop.isStepDone(wf2, CFG.engageStep);
          } catch (_) {}
        }
        return {
          listenDone,
          slideDone,
          engageDone,
          referenceDone: viewState.visitedPanels.has("refstrip"),
          ready: listenDone && slideDone && engageDone
        };
      }

      function isSectionDone(panelId, gates) {
        if (panelId === "listen-panel") return gates.listenDone;
        if (panelId === "lesson-slides") return gates.slideDone;
        if (panelId === "refstrip") return gates.referenceDone;
        if (panelId === "engage") return gates.engageDone;
        return false;
      }

      function getRecommendedAction(gates) {
        if (!gates.listenDone) return { panelId: "listen-panel", label: "1 Listen", action: "listen", status: "Start here" };
        if (!gates.slideDone) {
          if (viewState.activePanelId === "lesson-slides" && viewState.slideTotal > 0 && viewState.slideIndex < viewState.slideTotal - 1) {
            return { panelId: "lesson-slides", label: "Next Slide", action: "slide-next", status: `Slide ${viewState.slideIndex + 1} of ${viewState.slideTotal}` };
          }
          return { panelId: "lesson-slides", label: "2 Slides", action: "slides", status: "Next up" };
        }
        if (!gates.referenceDone) return { panelId: "refstrip", label: "3 Reference", action: "reference", status: "Quick scan" };
        if (!gates.engageDone) return { panelId: "engage", label: "4 Engage", action: "engage", status: "Final section" };
        return { panelId: "next", label: ($("#nextEp")?.textContent || "Continue").trim(), action: "continue", status: "Unlocked" };
      }

      function getGuideCopy(gates) {
        if (viewState.activePanelId === "listen-panel") {
          return gates.listenDone
            ? "Listen is complete. The next useful click is 2 Slides so the overview becomes concrete examples."
            : "Start here. One clean listen pass gives the overview and clears the first gate.";
        }
        if (viewState.activePanelId === "lesson-slides") {
          if (gates.slideDone) return "You reached the end of the deck. Use 3 Reference as the quick reinforcement pass before the quiz.";
          return `Work through the deck in order. When you reach the last slide, the next click becomes 3 Reference.`;
        }
        if (viewState.activePanelId === "refstrip") {
          return "Reference is the light reinforcement stop. Skim the governed links here, then move into 4 Engage.";
        }
        if (gates.engageDone) {
          return "The episode gates are clear. Continue is now the right next click.";
        }
        return "Use Quest to rehearse the behavior, then pass the quiz to clear the final gate.";
      }

      function renderHint(node, detail) {
        if (!node) return;
        node.classList.toggle("is-ready", Boolean(detail.ready));
        const button = detail.label
          ? `<button class="btn ${detail.primary ? "btn--primary" : ""}" type="button" data-guide-action="${escapeHtml(detail.action || "")}">${escapeHtml(detail.label)}</button>`
          : "";
        node.innerHTML = `<div class="sectionHint__copy"><strong>${escapeHtml(detail.title)}</strong><div class="muted">${escapeHtml(detail.copy)}</div></div>${button}`;
      }

      function renderSectionHints() {
        const gates = getGateState();
        renderHint($("#listenHint"), gates.listenDone
          ? { title: "Listen complete", copy: "This section is done. Next click: 2 Slides.", label: "2 Slides", action: "slides", ready: true, primary: true }
          : { title: "Start with the overview", copy: "Run one full listen pass here. When it finishes, move to 2 Slides.", label: "1 Listen", action: "listen", ready: viewState.activePanelId === "listen-panel", primary: viewState.activePanelId === "listen-panel" });
        const slideReady = gates.slideDone || (viewState.activePanelId === "lesson-slides" && viewState.slideTotal > 0 && viewState.slideIndex === viewState.slideTotal - 1);
        const slideCopy = !viewState.slideTotal
          ? "Slides are loading. Once the deck is ready, move through it in order."
          : slideReady
            ? "You are at the end of the slide deck. Next click: 3 Reference."
            : `You are on slide ${viewState.slideIndex + 1} of ${viewState.slideTotal}. Reach the last slide, then click 3 Reference.`;
        renderHint($("#slidesHint"), slideReady
          ? { title: "Slides complete", copy: slideCopy, label: "3 Reference", action: "reference", ready: true, primary: true }
          : { title: "Move through the deck", copy: slideCopy, label: viewState.slideTotal > 1 ? "Next Slide" : "2 Slides", action: viewState.slideTotal > 1 ? "slide-next" : "slides", ready: viewState.activePanelId === "lesson-slides", primary: viewState.activePanelId === "lesson-slides" });
        renderHint($("#refHint"), gates.referenceDone
          ? { title: "Reference checked", copy: "You have seen the supporting links. Next click: 4 Engage.", label: "4 Engage", action: "engage", ready: true, primary: true }
          : { title: "Use this as a fast reinforcement pass", copy: "This section explains where to look when you need the governed version later. After this, click 4 Engage.", label: "4 Engage", action: "engage", ready: viewState.activePanelId === "refstrip", primary: viewState.activePanelId === "refstrip" });
        renderHint($("#engageHint"), gates.engageDone
          ? { title: "Engage complete", copy: "The final gate is clear. Next click: Continue.", label: ($("#nextEp")?.textContent || "Continue").trim(), action: "continue", ready: true, primary: true }
          : { title: "Finish here", copy: "Pass the quiz to clear the final gate. Once it passes, Continue becomes the next click.", label: "Stay in Engage", action: "engage", ready: viewState.activePanelId === "engage", primary: viewState.activePanelId === "engage" });
      }

      function renderSectionGuide() {
        const gates = getGateState();
        const current = currentTab();
        const recommendation = getRecommendedAction(gates);
        $("#guideTitle").textContent = `${current.step}. ${current.title}`;
        $("#guideCopy").textContent = getGuideCopy(gates);
        $("#guideBtn").textContent = recommendation.label;
        $("#guideBtn").dataset.guideAction = recommendation.action;
        $("#guideStatus").textContent = `Next click: ${recommendation.label}`;
        $("#guideProgress").innerHTML = TAB_FLOW.map((item) => {
          const classes = ["sectionGuide__step"];
          if (item.id === viewState.activePanelId) classes.push("is-current");
          if (isSectionDone(item.id, gates)) classes.push("is-done");
          return `<span class="${classes.join(" ")}"><strong>${escapeHtml(item.step)}</strong> ${escapeHtml(item.title)}</span>`;
        }).join("");
        TAB_FLOW.forEach((item) => {
          const jump = $(item.jump);
          const stepEls = Array.from(document.querySelectorAll(".startCard__step"));
          const stepEl = stepEls[Number(item.step) - 1];
          if (jump) {
            const isRecommended = recommendation.panelId === item.id;
            jump.classList.toggle("btn--primary", isRecommended);
            jump.classList.toggle("btn--quiet", !isRecommended);
          }
          if (stepEl) {
            stepEl.classList.toggle("is-active", item.id === viewState.activePanelId);
            stepEl.classList.toggle("is-done", isSectionDone(item.id, gates));
          }
        });
      }

      function syncTopControls() {
        const onSlides = viewState.activePanelId === "lesson-slides";
        $("#btnPrev").hidden = !onSlides;
        $("#btnNext").hidden = !onSlides;
      }

      function showTab(panelId) {
        viewState.activePanelId = panelId;
        viewState.visitedPanels.add(panelId);
        TAB_FLOW.forEach(({ id, tab }) => {
          const panel = document.getElementById(id);
          const button = document.querySelector(tab);
          const on = id === panelId;
          button?.classList.toggle("is-active", on);
          button?.setAttribute("aria-selected", String(on));
          if (panel) on ? panel.removeAttribute("hidden") : panel.setAttribute("hidden", "");
        });
        syncTopControls();
        renderSectionGuide();
        renderSectionHints();
      }

      function scrollLesson() {
        $("#lessonTabs")?.scrollIntoView({ behavior: "smooth" });
      }

      function handleGuideAction(action) {
        if (action === "listen") { showTab("listen-panel"); scrollLesson(); return; }
        if (action === "slides") { showTab("lesson-slides"); scrollLesson(); return; }
        if (action === "reference") { showTab("refstrip"); scrollLesson(); return; }
        if (action === "engage") { showTab("engage"); scrollLesson(); return; }
        if (action === "slide-next") {
          if (viewState.activePanelId !== "lesson-slides") { showTab("lesson-slides"); scrollLesson(); }
          $("#btnNext")?.click();
          return;
        }
        if (action === "slide-prev") {
          if (viewState.activePanelId !== "lesson-slides") { showTab("lesson-slides"); scrollLesson(); }
          $("#btnPrev")?.click();
          return;
        }
        if (action === "continue") {
          const nextEl = $("#nextEp");
          if (!nextEl) return;
          nextEl.click();
        }
      }

      function renderReferences(profile) {
        const ref = profile.references || {};
        const links = Array.isArray(ref.links) ? ref.links : [];
        $("#refBlurb").textContent = ref.blurb || $("#refBlurb").textContent;
        $("#refLinks").innerHTML = links.length
          ? links.map((item) => `<a class="btn${item.primary ? " btn--primary" : ""}" href="${escapeHtml(item.href || "#")}">${escapeHtml(item.label || item.href || "Reference")}</a>`).join("")
          : `<span class="muted">No references listed for this pack yet.</span>`;
      }

      function renderSlides(profile) {
        const slidesEl = $("#slides");
        const dotsEl = $("#dots");
        const slides = Array.isArray(profile.slides) ? profile.slides : [];
        slidesEl.innerHTML = "";
        dotsEl.innerHTML = "";
        viewState.slideIndex = 0;
        viewState.slideTotal = slides.length;
        if (!slides.length) {
          slidesEl.innerHTML = `<div class="slide is-active"><div class="card"><h4>No slides</h4><p class="muted">This pack is missing slide data.</p></div></div>`;
          renderSectionGuide();
          renderSectionHints();
          return;
        }
        slides.forEach((slide, index) => {
          const node = document.createElement("article");
          const bullets = Array.isArray(slide.bullets) ? slide.bullets : [];
          const takeaway = slide.takeaway || bullets[0] || slide.goal || "";
          node.className = "slide" + (index === 0 ? " is-active" : "");
          node.dataset.title = slide.title || `Slide ${index + 1}`;
          node.dataset.slideId = slide.id || `s${index + 1}`;
          node.innerHTML = `<div class="slideGrid"><div class="card"><div class="slideId">${escapeHtml(CFG.code)} | ${escapeHtml(node.dataset.slideId)}</div><h4>${escapeHtml(slide.title || `Slide ${index + 1}`)}</h4><p class="muted" style="margin:8px 0 0;"><span style="font-family:var(--mono);">Goal:</span> ${escapeHtml(slide.goal || "Review the commercial judgment here.")}</p><ul>${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul></div><div class="callout"><div class="k">Takeaway</div><p style="margin:10px 0 0;line-height:1.6;"><strong>${escapeHtml(takeaway)}</strong></p></div></div>`;
          slidesEl.appendChild(node);
          const dot = document.createElement("button");
          dot.className = "dotBtn";
          dot.type = "button";
          dot.title = node.dataset.title;
          dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
          dot.addEventListener("click", () => goTo(index));
          dotsEl.appendChild(dot);
        });
        const slideEls = Array.from(document.querySelectorAll("#slides .slide"));
        let idx = 0;
        function syncDots() {
          viewState.slideIndex = idx;
          viewState.slideTotal = slideEls.length;
          Array.from(document.querySelectorAll("#dots .dotBtn")).forEach((button, buttonIndex) => button.setAttribute("aria-current", String(buttonIndex === idx)));
          $("#deckTitle").textContent = slideEls[idx]?.dataset?.title || "Slides";
          $("#slideProg").textContent = `${idx + 1} / ${slideEls.length}`;
          renderSectionGuide();
          renderSectionHints();
        }
        function goTo(nextIndex) {
          idx = (nextIndex + slideEls.length) % slideEls.length;
          slideEls.forEach((slideEl, slideIndex) => slideEl.classList.toggle("is-active", slideIndex === idx));
          syncDots();
          if (idx === slideEls.length - 1) {
            viewState.slideDone = true;
            try { Loop?.markStepDone?.(CFG.slideStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, gate: "slide" }); } catch (_) {}
            renderGates();
          }
        }
        $("#btnPrev").onclick = () => goTo(idx - 1);
        $("#btnNext").onclick = () => goTo(idx + 1);
        window.addEventListener("keydown", (event) => {
          const tag = event.target?.tagName?.toLowerCase?.();
          if (tag === "input" || tag === "textarea" || event.target?.isContentEditable) return;
          if (viewState.activePanelId !== "lesson-slides") return;
          if (event.key === "ArrowLeft") goTo(idx - 1);
          if (event.key === "ArrowRight") goTo(idx + 1);
        });
        syncDots();
      }

      function renderQuest(profile) {
        const quest = profile?.engagement?.quest;
        const questList = $("#questList");
        const key = `${CFG.storagePrefix}_quest`;
        if (!quest || !Array.isArray(quest.items)) { questList.innerHTML = `<p class="muted">No quest in profile.</p>`; return; }
        $("#questTitle").textContent = quest.title || "Quest";
        $("#questBlurb").textContent = quest.prompt || $("#questBlurb").textContent;
        const saved = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
        questList.innerHTML = quest.items.map((item) => {
          const checked = saved.has(item.id) ? "checked" : "";
          return `<label style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><input type="checkbox" data-qid="${escapeHtml(item.id)}" ${checked} style="accent-color:var(--neon);" /> <span>${escapeHtml(item.text || "")}</span></label>`;
        }).join("");
        questList.onchange = (event) => {
          const box = event.target;
          if (!box.matches("[data-qid]")) return;
          const id = box.getAttribute("data-qid");
          if (box.checked) saved.add(id); else saved.delete(id);
          localStorage.setItem(key, JSON.stringify([...saved]));
        };
      }

      function renderQuiz(profile) {
        const quiz = profile?.engagement?.quiz;
        const quizEl = $("#quiz");
        const key = `${CFG.storagePrefix}_quiz`;
        if (!quiz || !quiz.enabled || !Array.isArray(quiz.questions)) { quizEl.innerHTML = `<p class="muted">No quiz enabled.</p>`; return; }
        $("#quizBlurb").textContent = quiz.prompt || $("#quizBlurb").textContent;
        const questions = quiz.questions;
        const passThreshold = Number(quiz.pass_threshold || 0.8);
        let state = JSON.parse(localStorage.getItem(key) || "{}");
        function render() {
          const answers = state.answers || {};
          const score = typeof state.score === "number" ? state.score : null;
          const passed = Boolean(state.passed);
          const graded = Boolean(state.graded);
          quizEl.innerHTML = `<div style="display:grid;gap:12px;">${questions.map((question) => { const selected = answers[question.id]; const wrong = graded && selected !== undefined && selected !== question.answer_index; return `<div class="card"><b>${escapeHtml(question.q || "")}</b><div style="margin-top:8px;display:grid;gap:6px;">${(question.choices || []).map((choice, index) => `<div class="quizChoice ${graded && index === question.answer_index ? "quizChoice--correct" : ""} ${wrong && index === selected ? "quizChoice--wrong" : ""}"><label><input type="radio" name="${escapeHtml(question.id)}" value="${index}" ${selected === index ? "checked" : ""} style="accent-color:var(--neon);" /> ${escapeHtml(choice)}</label></div>`).join("")}</div>${graded ? `<div class="quizExplain">${escapeHtml(question.explain || "")}</div>` : ""}</div>`; }).join("")}<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;"><button class="btn btn--primary" type="button" id="gradeQuiz">Grade</button><button class="btn" type="button" id="resetQuiz">Reset</button><span class="chip">Score: ${score === null ? "-" : Math.round(score * 100) + "%"}</span><span class="chip">${passed ? "PASS" : "-"}</span></div></div>`;
          quizEl.querySelectorAll('input[type="radio"]').forEach((input) => input.addEventListener("change", () => { state.answers = state.answers || {}; state.answers[input.name] = Number(input.value); localStorage.setItem(key, JSON.stringify(state)); }));
          $("#gradeQuiz").onclick = () => {
            let correct = 0;
            questions.forEach((question) => { if (state.answers?.[question.id] === question.answer_index) correct += 1; });
            state.score = correct / questions.length;
            state.passed = state.score >= passThreshold;
            state.graded = true;
            localStorage.setItem(key, JSON.stringify(state));
            if (state.passed) viewState.engageDone = true;
            if (state.passed && Loop) { try { Loop.markStepDone(CFG.engageStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, engageQuizPassed: true, engageQuizScore: state.score }); } catch (_) {} }
            render(); renderGates();
          };
          $("#resetQuiz").onclick = () => { state = {}; viewState.engageDone = false; localStorage.removeItem(key); render(); renderGates(); };
        }
        render();
      }

      function renderGates() {
        const gates = getGateState();
        const note = $("#gateNote");
        $("#gateRow").innerHTML = [
          `<span class="gatePill ${gates.listenDone ? "gatePill--on" : "gatePill--off"}">Listen</span>`,
          `<span class="gatePill ${gates.slideDone ? "gatePill--on" : "gatePill--off"}">Slides</span>`,
          `<span class="gatePill ${gates.engageDone ? "gatePill--on" : "gatePill--off"}">Engage</span>`
        ].join("");
        note.textContent = gates.ready
          ? `${CFG.code} gates complete. Next step is unlocked.`
          : `Next focus: ${getRecommendedAction(gates).label}${Loop ? "" : " | Open from Playlist to save gate progress."}`;
        $("#nextEp").classList.toggle("btn--primary", gates.ready);
        renderSectionGuide();
        renderSectionHints();
      }

      async function main() {
        let profile;
        try { profile = await loadJson(PROFILE_URL); } catch (error) { console.error(error); $("#heroSub").textContent = "Could not load bytecast_ep_profile.json. Use a local web server."; return; }
        const episode = profile.episode || {};
        const routing = profile.routing || {};
        CFG = { ...CFG, slug: routing.slug || CFG.slug, code: episode.code || CFG.code, journeyId: routing.journey_id || CFG.journeyId, listenStep: routing.listen_step || CFG.listenStep, slideStep: routing.slide_step || CFG.slideStep, engageStep: routing.engage_step || CFG.engageStep, storagePrefix: routing.storage_prefix || CFG.storagePrefix };
        try { Loop?.setActiveJourneyId?.(CFG.journeyId); } catch (_) {}
        document.title = `ByteCast ${CFG.code} | ${episode.title || "Lumina Revenue Lane"}`;
        $("#topEp").textContent = `ByteCast | ${CFG.code}`; $("#topTitle").textContent = episode.title || ""; $("#heroTitle").textContent = CFG.code; $("#heroSub").textContent = episode.title || "";
        $("#heroNote").textContent = profile.content?.summary_short || ""; $("#startCopy").textContent = profile.content?.start_here || $("#startCopy").textContent; $("#heroKicker").textContent = profile.content?.hero_kicker || "Lumina Revenue Lane"; $("#keyLine").textContent = profile.content?.key_line || profile.content?.summary_short || $("#keyLine").textContent;
        $("#heroNextTag").textContent = profile.advance?.tag || "THEN"; $("#heroNextLabel").textContent = profile.advance?.label || "Keep going"; $("#listenGateLabel").textContent = CFG.listenStep; $("#nextDesc").textContent = profile.advance?.description || $("#nextDesc").textContent; $("#footerLeft").textContent = `${CFG.code} | ${episode.title || "Lumina Revenue Lane"}`;
        const tags = Array.isArray(profile.content?.tags) ? profile.content.tags : []; const runtime = Number(episode.runtime_target_minutes);
        $("#metaPills").innerHTML = [pill(CFG.code, episode.type || "episode"), episode.date ? pill("date", episode.date) : "", Number.isFinite(runtime) && runtime > 0 ? pill("target", `~${runtime} min`) : "", tags.length ? pill("tags", tags.slice(0, 4).join(" | ")) : ""].filter(Boolean).join("");
        if (profile.navigation?.previous_href) { const prevBtn = $("#prevEpisodeBtn"); prevBtn.href = profile.navigation.previous_href; prevBtn.textContent = profile.navigation.previous_label || "Previous"; prevBtn.hidden = false; }
        if (profile.advance?.href) $("#nextEp").href = profile.advance.href; $("#nextEp").textContent = profile.advance?.cta || profile.advance?.label || "Continue";
        renderReferences(profile); renderSlides(profile); renderQuest(profile); renderQuiz(profile);
        const audioEl = $("#audio"); const files = Array.isArray(profile.media?.audio_files) ? profile.media.audio_files : []; audioEl.replaceChildren();
        files.forEach((file) => { if (!file?.path) return; const source = document.createElement("source"); source.src = file.path; source.type = "audio/mpeg"; audioEl.appendChild(source); });
        if (files.length) { audioEl.load(); $("#audioLine").textContent = files[0].label || $("#audioLine").textContent; } else { $("#audioLine").textContent = "Read episode overview uses browser TTS. No packaged MP3 is bundled yet."; }
        try { localStorage.setItem("bytecast.last_episode.href.v1", `episodes/${CFG.slug}/index.html`); localStorage.setItem("bytecast.last_episode.time.v1", String(Date.now())); } catch (_) {}
        TAB_FLOW.forEach(({ id, tab }) => document.querySelector(tab)?.addEventListener("click", () => showTab(id)));
        $("#jumpListen").onclick = () => { showTab("listen-panel"); scrollLesson(); };
        $("#jumpSlides").onclick = () => { showTab("lesson-slides"); scrollLesson(); };
        $("#jumpRef").onclick = () => { showTab("refstrip"); scrollLesson(); };
        $("#jumpEngage").onclick = () => { showTab("engage"); scrollLesson(); };
        document.addEventListener("click", (event) => {
          const trigger = event.target.closest("[data-guide-action]");
          if (!trigger) return;
          handleGuideAction(trigger.dataset.guideAction || "");
        });
        const markListenGate = () => {
          viewState.listenDone = true;
          try { Loop?.markStepDone?.(CFG.listenStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, gate: "listen" }); } catch (_) {}
          renderGates();
        };
        const Listen = window.ByteCastListenMode;
        if (Listen && $("#listenModeMount")) {
          Listen.init({ mount: $("#listenModeMount"), jsonUrl: "assets/voiceover_sections.json", onListenGate: markListenGate, hiddenAudio: files.length ? audioEl : null, audioListenSeconds: 25, showListenTab: () => { showTab("listen-panel"); scrollLesson(); }, onReady(api, data) { const heroAttach = $("#heroListenAttach"); if (heroAttach && data.heroSectionId) Listen.attachSectionButton(heroAttach, api, data.heroSectionId); const slideMap = data.slideSectionMap || {}; Array.from(document.querySelectorAll("#slides .slide")).forEach((slide) => { const sectionId = slideMap[slide.dataset.slideId]; const card = slide.querySelector(".slideGrid .card"); if (sectionId && card) Listen.attachSectionButton(card, api, sectionId); }); } });
        }
        try {
          const quizState = JSON.parse(localStorage.getItem(`${CFG.storagePrefix}_quiz`) || "{}");
          if (quizState.passed) viewState.engageDone = true;
          if (quizState.passed && Loop) Loop.markStepDone(CFG.engageStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, engageQuizPassed: true, engageQuizScore: quizState.score });
        } catch (_) {}
        showTab("listen-panel");
        renderGates();
      }
      main();
    })();
    """
)


MISSION_HTML = dedent(
    """
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>TR-LUM-001 - Revenue Routing Mission</title>
      <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
      <style>
        :root{--bg0:#050607;--bg1:#0b0f14;--line:rgba(255,255,255,0.14);--ink:rgba(255,255,255,0.93);--muted:rgba(255,255,255,0.66);--gold:#ffc45a;--neon:#22a7ff;--max:980px;}
        *{box-sizing:border-box;} body{margin:0;padding:18px;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;color:var(--ink);background:radial-gradient(1000px 500px at 10% 0%,rgba(34,167,255,0.12),transparent),linear-gradient(180deg,var(--bg0),var(--bg1));}
        .shell{max-width:var(--max);margin:0 auto;} .card{border-radius:18px;border:1px solid var(--line);padding:16px;background:rgba(255,255,255,0.04);margin-bottom:14px;} h1,h2{margin:0 0 10px;} p,label,.muted{line-height:1.55;color:var(--muted);} .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,0.05);color:var(--ink);text-decoration:none;cursor:pointer;} .btn.primary{border-color:rgba(34,167,255,0.45);background:rgba(34,167,255,0.12);} .grid{display:grid;gap:12px;} .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;} @media(max-width:720px){.grid2{grid-template-columns:1fr;}} input,select,textarea{width:100%;border-radius:12px;border:1px solid var(--line);background:rgba(0,0,0,0.28);color:var(--ink);padding:12px;font:inherit;} textarea{min-height:98px;} .chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;} .chip{padding:6px 10px;border-radius:999px;border:1px solid var(--line);font-size:12px;} .status{margin-top:12px;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,196,90,0.35);background:rgba(255,196,90,0.10);}
      </style>
    </head>
    <body>
      <main class="shell">
        <section class="card"><h1>TR-LUM-001 - Revenue Routing Mission</h1><p>Use one realistic lead scenario and show that you can qualify the need, recommend the right division or bundle, explain Lumina's role, and leave delivery with a clean next step.</p><div class="chips"><span class="chip">Pass target: 9 / 12</span><span class="chip">Requires reviewer sign-off</span><span class="chip">Next: SEED-LUM-001</span><span class="chip">Includes worked example</span></div><div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;"><a class="btn" href="../../seed_bytecast.html">Playlist</a><a class="btn" href="../../episodes/lumina_rev_106/index.html">Back to EP-LUM-106</a></div></section>
        <section class="card"><h2>Worked Example</h2><p class="muted">Use this as a quality bar, not as something to copy blindly. It shows the level of clarity the mission is looking for.</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 14px;"><button class="btn" id="loadExample" type="button">Load Worked Example</button></div><details><summary style="cursor:pointer;">View strong sample answer</summary><div class="grid2" style="margin-top:12px;"><div><p><strong>Scenario:</strong> small business needs rebrand, website refresh, and lead flow automation.</p><p><strong>Prospect summary:</strong> Family-owned field service company with strong referrals, weak online clarity, and no dependable intake workflow.</p><p><strong>Primary path:</strong> Lumina + Nexus.</p><p><strong>Why:</strong> the real issue is not only appearance. It is unclear offer packaging plus manual follow-up and intake loss.</p></div><div><p><strong>Good next step:</strong> scoped working session to clarify offer language, lead capture flow, and owner handoff.</p><p><strong>Strong handoff note:</strong> message angle should emphasize trust and response speed; do not promise full site rebuild before intake workflow is mapped.</p><p><strong>Why it passes:</strong> it names the real pain, picks a plausible path, keeps Lumina's role honest, and gives delivery usable context.</p></div></div></details></section>
        <section class="card grid">
          <div><label for="scenario">Scenario</label><select id="scenario"><option value="small_business_rebrand">Small business needs rebrand, website refresh, and lead flow automation</option><option value="artist_release_rollout">Artist project needs release rollout, visuals, and audience growth plan</option><option value="training_org_platform">Training org needs course platform, learner journey, and stronger market positioning</option><option value="field_service_campaign">Field-service client needs drone visuals plus campaign packaging</option></select></div>
          <div class="grid2">
            <div><label for="prospectSummary">Prospect summary</label><textarea id="prospectSummary" placeholder="Who they are, what stage they are in, and why they are talking to Lumina."></textarea></div>
            <div><label for="painPoint">Key pain point</label><textarea id="painPoint" placeholder="What is actually hurting or blocked right now?"></textarea></div>
          </div>
          <div class="grid2">
            <div><label for="desiredOutcome">Desired outcome</label><textarea id="desiredOutcome" placeholder="What changes after success?"></textarea></div>
            <div><label for="primaryDivision">Likely primary division</label><input id="primaryDivision" placeholder="Examples: Lumina + Nexus, EchoVerse, Horizon..." /></div>
          </div>
          <div class="grid2">
            <div><label for="supportDivisions">Support divisions</label><input id="supportDivisions" placeholder="Optional support lanes or bundle notes." /></div>
            <div><label for="luminaRole">Lumina's role</label><textarea id="luminaRole" placeholder="How does Lumina lead commercial clarity without pretending to own delivery?"></textarea></div>
          </div>
          <div><label for="recommendationSummary">Recommendation summary</label><textarea id="recommendationSummary" placeholder="Problem -> recommended lane(s) -> reason -> next step."></textarea></div>
          <div class="grid2">
            <div><label for="nextStep">Next step</label><textarea id="nextStep" placeholder="What should happen next, and who should own it?"></textarea></div>
            <div><label for="handoffNote">Delivery handoff note</label><textarea id="handoffNote" placeholder="What does delivery need to know to start cleanly?"></textarea></div>
          </div>
          <div class="grid2">
            <div><label for="score">Reviewer score (0-12)</label><input id="score" type="number" min="0" max="12" step="1" value="9" /></div>
            <div><label for="reviewerName">Reviewer name</label><input id="reviewerName" placeholder="Required for sign-off" /></div>
          </div>
          <label><input id="reviewerApproved" type="checkbox" style="width:auto;margin-right:8px;" /> Reviewer approves this mission as pass-ready.</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap;"><button class="btn primary" id="submitMission" type="button">Save Mission Result</button><a class="btn" href="../../episodes/seed_builder_studio/lumina_sales_brief/index.html">Open SEED-LUM-001</a></div>
          <div class="status" id="status">Mission not saved yet.</div>
        </section>
      </main>
      <script src="../../assets/shared/bytecast_loop.js"></script>
      <script>
        const Loop = window.ByteCastLoop || null;
        const STORE = "bytecast.tr_lum_001.v1";
        const EXAMPLE_STATE = {
          scenario: "small_business_rebrand",
          prospectSummary: "Family-owned field service company with strong referrals, uneven digital clarity, and no dependable inbound intake flow.",
          painPoint: "Leads arrive from multiple places, follow-up is manual, and the offer is not explained clearly enough for buyers who do not already know the company.",
          desiredOutcome: "Clarify the offer, improve trust online, and create a clean intake path that speeds response time without forcing a full rebuild on day one.",
          primaryDivision: "Lumina + Nexus",
          supportDivisions: "Optional Horizon later if field-proof visuals strengthen the trust story.",
          luminaRole: "Lumina leads commercial clarity: offer framing, message cleanup, and recommendation logic. Nexus owns the intake workflow and systems layer that supports response speed.",
          recommendationSummary: "The problem is weak offer clarity plus manual intake loss. Recommend Lumina + Nexus so the message becomes clear and the response path becomes dependable. Next step is a scoped working session to map the offer, intake points, and owner handoff.",
          nextStep: "Run a scoped working session this week to define offer language, lead capture points, and the first intake-flow improvement.",
          handoffNote: "Do not promise a full website rebuild yet. Delivery should start by mapping the current lead path, message gaps, and fastest high-trust workflow fix.",
          score: "9",
          reviewerName: "",
          reviewerApproved: false
        };
        const ids = ["scenario","prospectSummary","painPoint","desiredOutcome","primaryDivision","supportDivisions","luminaRole","recommendationSummary","nextStep","handoffNote","score","reviewerName","reviewerApproved"];
        function loadState(){ try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; } }
        function saveState(state){ localStorage.setItem(STORE, JSON.stringify(state)); }
        function hydrate(){ const state = loadState(); ids.forEach((id) => { const el = document.getElementById(id); if (!el) return; if (el.type === "checkbox") el.checked = Boolean(state[id]); else if (state[id] != null) el.value = state[id]; }); }
        function collect(){ const state = {}; ids.forEach((id) => { const el = document.getElementById(id); if (!el) return; state[id] = el.type === "checkbox" ? Boolean(el.checked) : String(el.value || "").trim(); }); saveState(state); return state; }
        ids.forEach((id) => document.getElementById(id).addEventListener("input", collect));
        hydrate();
        document.getElementById("loadExample").addEventListener("click", () => {
          saveState({ ...loadState(), ...EXAMPLE_STATE });
          hydrate();
          document.getElementById("status").textContent = "Worked example loaded. Use it as a model, then adapt it to your own scenario.";
        });
        document.getElementById("submitMission").addEventListener("click", () => {
          const state = collect();
          const score = Number(state.score || 0);
          const textOk = ["prospectSummary","painPoint","desiredOutcome","primaryDivision","luminaRole","recommendationSummary","nextStep","handoffNote","reviewerName"].every((key) => String(state[key] || "").length >= 8);
          if (!textOk || score < 9 || !state.reviewerApproved) { document.getElementById("status").textContent = "Need complete notes, score >= 9, and reviewer approval before this mission can be saved."; return; }
          try { Loop?.setActiveJourneyId?.("lumina_revenue_v1"); } catch {}
          try {
            Loop?.markStepDone?.("tr_lum_001_revenue_routing", {
              journeyId: "lumina_revenue_v1",
              mission: "tr_lum_001_revenue_routing",
              moduleId: "tr_lum_001_revenue_routing",
              understandingCheckPassed: true,
              lumMissionScore: score,
              lumScenarioId: state.scenario,
              lumProspectSummary: state.prospectSummary,
              lumDesiredOutcome: state.desiredOutcome,
              lumPrimaryDivision: state.primaryDivision,
              lumSupportDivisions: state.supportDivisions,
              lumRecommendationSummary: state.recommendationSummary,
              lumNextStep: state.nextStep,
              lumHandoffNote: state.handoffNote,
              lumReviewerApproved: true,
              lumReviewerName: state.reviewerName,
              lumMissionCompletedAt: new Date().toISOString(),
              version: "2026-03-26-lum-v1"
            });
            document.getElementById("status").textContent = "TR-LUM-001 saved. SEED-LUM-001 is ready.";
          } catch (error) {
            document.getElementById("status").textContent = "Could not save your mission result: " + error;
          }
        });
      </script>
    </body>
    </html>
    """
)


SEED_HTML = dedent(
    """
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>SEED-LUM-001 - Lumina Sales Brief</title>
      <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
      <style>
        :root{--bg0:#050607;--bg1:#0b0f14;--line:rgba(255,255,255,0.14);--ink:rgba(255,255,255,0.93);--muted:rgba(255,255,255,0.66);--neon:#22a7ff;--max:980px;}
        *{box-sizing:border-box;} body{margin:0;padding:18px;font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;color:var(--ink);background:radial-gradient(1000px 500px at 10% 0%,rgba(34,167,255,0.12),transparent),linear-gradient(180deg,var(--bg0),var(--bg1));}
        .shell{max-width:var(--max);margin:0 auto;} .card{border-radius:18px;border:1px solid var(--line);padding:16px;background:rgba(255,255,255,0.04);margin-bottom:14px;} h1{margin:0 0 10px;} label,.muted{display:block;color:var(--muted);line-height:1.55;} .grid{display:grid;gap:12px;} .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;} @media(max-width:720px){.grid2{grid-template-columns:1fr;}} input,textarea{width:100%;border-radius:12px;border:1px solid var(--line);background:rgba(0,0,0,0.28);color:var(--ink);padding:12px;font:inherit;} textarea{min-height:92px;} .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,0.05);color:var(--ink);text-decoration:none;cursor:pointer;} .btn.primary{border-color:rgba(34,167,255,0.45);background:rgba(34,167,255,0.12);} .status{margin-top:12px;padding:12px 14px;border-radius:12px;border:1px solid rgba(34,167,255,0.35);background:rgba(34,167,255,0.10);}
      </style>
    </head>
    <body>
      <main class="shell">
        <section class="card"><h1>SEED-LUM-001 - Lumina Sales Brief</h1><p class="muted">Turn the mission into a reusable sales brief. This page prepares a download-ready brief and saves completion for the Lumina lane.</p><div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;"><a class="btn" href="../../episodes/training_missions/tr_lum_001_revenue_routing/index.html">Back to TR-LUM-001</a><a class="btn" href="../../seed_bytecast.html">Playlist</a></div></section>
        <section class="card"><h2>Gold-Standard Example</h2><p class="muted">This sample brief is intentionally strong, specific, and handoff-ready. Load it if you want a model for tone and detail level.</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 14px;"><button class="btn" id="loadSampleBrief" type="button">Load Gold-Standard Sample</button></div><details><summary style="cursor:pointer;">View sample brief notes</summary><div class="grid2" style="margin-top:12px;"><div><p><strong>Lead:</strong> Harbor Ridge Roofing</p><p><strong>Primary problem:</strong> strong local reputation, weak digital clarity, and slow lead follow-up.</p><p><strong>Primary division:</strong> Lumina + Nexus.</p><p><strong>Bundle signal:</strong> field-proof visuals may help later, but they are not the first fix.</p></div><div><p><strong>Message angle:</strong> trust, speed, and clarity for homeowners who need fast confidence.</p><p><strong>Good next step:</strong> scoped working session to map the current funnel, offer language, and intake process.</p><p><strong>Why it is strong:</strong> it names the real problem, keeps scope honest, and gives delivery a useful start point.</p></div></div></details></section>
        <section class="card grid">
          <div class="grid2"><div><label for="lead_name">Lead name</label><input id="lead_name" /></div><div><label for="company_or_project">Company or project</label><input id="company_or_project" /></div></div>
          <div class="grid2"><div><label for="buyer_type">Buyer type</label><input id="buyer_type" /></div><div><label for="timeline">Timeline</label><input id="timeline" /></div></div>
          <div><label for="primary_problem">Primary problem</label><textarea id="primary_problem"></textarea></div>
          <div><label for="desired_outcome">Desired outcome</label><textarea id="desired_outcome"></textarea></div>
          <div class="grid2"><div><label for="likely_primary_division">Likely primary division</label><input id="likely_primary_division" /></div><div><label for="likely_support_divisions">Likely support divisions</label><input id="likely_support_divisions" /></div></div>
          <div class="grid2"><div><label for="bundle_signal">Bundle signal</label><textarea id="bundle_signal"></textarea></div><div><label for="lumina_role">Lumina role</label><textarea id="lumina_role"></textarea></div></div>
          <div><label for="message_angle">Message angle</label><textarea id="message_angle"></textarea></div>
          <div><label for="recommendation_summary">Recommendation summary</label><textarea id="recommendation_summary"></textarea></div>
          <div class="grid2"><div><label for="next_step">Next step</label><textarea id="next_step"></textarea></div><div><label for="follow_up_copy">Follow-up copy</label><textarea id="follow_up_copy"></textarea></div></div>
          <div><label for="internal_handoff_notes">Delivery handoff notes</label><textarea id="internal_handoff_notes"></textarea></div>
          <div><label for="risks_or_open_questions">Risks or open questions</label><textarea id="risks_or_open_questions"></textarea></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;"><button class="btn primary" id="exportBrief" type="button">Generate Brief + Save Completion</button><a class="btn" id="downloadBrief" href="#" download hidden>Download JSON</a></div>
          <div class="status" id="status">Brief not generated yet.</div>
        </section>
      </main>
      <script src="../../assets/shared/bytecast_loop.js"></script>
      <script>
        const Loop = window.ByteCastLoop || null;
        const STORE = "bytecast.seed_lum_001.v1";
        const SAMPLE_BRIEF = {
          lead_name: "Harbor Ridge Roofing",
          company_or_project: "Harbor Ridge Roofing growth sprint",
          buyer_type: "Owner-operator service business",
          primary_problem: "Referral business is strong, but the digital offer is unclear and inbound leads are handled inconsistently across phone, forms, and text.",
          desired_outcome: "Clarify the offer, increase trust with new buyers, and create a simple intake path that speeds response without forcing a full rebuild immediately.",
          timeline: "Need first improvements this month before peak season.",
          likely_primary_division: "Lumina + Nexus",
          likely_support_divisions: "Potential Horizon later for proof visuals if needed.",
          bundle_signal: "The lead needs both message clarity and intake workflow structure, which points beyond a design-only fix.",
          lumina_role: "Lumina owns the commercial framing, offer positioning, and follow-up logic that helps the buyer understand the path.",
          message_angle: "Fast trust for homeowners: clear offer, dependable response, no confusing handoff.",
          recommendation_summary: "Recommend Lumina + Nexus. Lumina sharpens the market-facing message and offer. Nexus designs the intake workflow that makes response speed more dependable.",
          next_step: "Run a scoped working session to map the current lead journey, tighten offer language, and define the first intake workflow fix.",
          follow_up_copy: "Based on the gaps we saw in offer clarity and intake handling, we recommend a Lumina + Nexus first step. Lumina will tighten the message and buyer path, while Nexus maps the intake workflow behind it. If that direction fits, the next move is a scoped working session this week.",
          internal_handoff_notes: "Lead values trust and response speed. Do not promise a full rebuild yet. Start by mapping current lead sources, current response delay, and the fastest workflow improvement with the biggest trust lift.",
          risks_or_open_questions: "Need to confirm who currently owns inbound response, what systems already exist, and whether field visuals are an immediate need or a later support asset."
        };
        const fields = ["lead_name","company_or_project","buyer_type","primary_problem","desired_outcome","timeline","likely_primary_division","likely_support_divisions","bundle_signal","lumina_role","message_angle","recommendation_summary","next_step","follow_up_copy","internal_handoff_notes","risks_or_open_questions"];
        function loadState(){ try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; } }
        function saveState(state){ localStorage.setItem(STORE, JSON.stringify(state)); }
        function hydrate(){ const state = loadState(); fields.forEach((id) => { if (state[id] != null) document.getElementById(id).value = state[id]; }); }
        function collect(){ const state = {}; fields.forEach((id) => { state[id] = String(document.getElementById(id).value || "").trim(); }); saveState(state); return state; }
        fields.forEach((id) => document.getElementById(id).addEventListener("input", collect));
        hydrate();
        document.getElementById("loadSampleBrief").addEventListener("click", () => {
          saveState({ ...loadState(), ...SAMPLE_BRIEF });
          hydrate();
          document.getElementById("status").textContent = "Gold-standard sample loaded. Review the structure, then adapt it into your own brief.";
        });
        async function sha256(text){ const data = new TextEncoder().encode(text); const digest = await crypto.subtle.digest("SHA-256", data); return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join(""); }
        document.getElementById("exportBrief").addEventListener("click", async () => {
          const state = collect();
          const required = ["lead_name","company_or_project","primary_problem","desired_outcome","likely_primary_division","recommendation_summary","next_step","internal_handoff_notes"];
          if (!required.every((key) => String(state[key] || "").length >= 6)) { document.getElementById("status").textContent = "Complete the core sales brief fields before generating the artifact."; return; }
          const payload = { schema: "seed-lum-001-sales-brief-v1", exportedAt: new Date().toISOString(), ...state };
          const artifactText = JSON.stringify(payload, null, 2);
          const artifactHash = await sha256(artifactText);
          const artifactName = `seed_lum_001_sales_brief_${new Date().toISOString().slice(0,19).replaceAll(":","-")}.json`;
          const blob = new Blob([artifactText], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.getElementById("downloadBrief");
          link.href = url; link.download = artifactName; link.hidden = false;
          try { Loop?.setActiveJourneyId?.("lumina_revenue_v1"); } catch {}
          try {
            Loop?.markStepDone?.("seed_lum_001_sales_brief", {
              journeyId: "lumina_revenue_v1",
              artifactName,
              artifactHash,
              artifactType: "lumina_sales_brief",
              lumSalesBriefPrimaryDivision: state.likely_primary_division,
              lumSalesBriefSupportDivisions: state.likely_support_divisions,
              lumSalesBriefRecommendationSummary: state.recommendation_summary,
              lumSalesBriefNextStep: state.next_step,
              lumSalesBriefExportedAt: payload.exportedAt
            });
            document.getElementById("status").textContent = "SEED-LUM-001 saved. Your brief download is ready.";
          } catch (error) {
            document.getElementById("status").textContent = "Could not save your completion: " + error;
          }
        });
      </script>
    </body>
    </html>
    """
)


COMMON_REF_LINKS = [
    {"label": "Lane Overview", "href": "../../building blocks/LUM_BUILD_PACKS/LUM-REV-001/00_lane_overview.md", "primary": True},
    {"label": "Training Standard", "href": "../../docs/BYTECAST_TRAINING_STANDARD.md"},
    {"label": "Proof Schema", "href": "../../docs/BYTECAST_PROOF_SCHEMA.md"},
    {"label": "Playlist", "href": "../../seed_bytecast.html"},
]


EPISODES = [
    {
        "slug": "lumina_rev_101",
        "code": "EP-LUM-101",
        "title": "Lumina Owns Revenue Messaging",
        "runtime": 10,
        "tags": ["lumina", "revenue", "messaging", "routing"],
        "summary_short": "Reset the mental model: Lumina is the commercial growth lane for the whole AeroVista board, not just the branding corner.",
        "summary_long": "This episode reframes Lumina as the lane that helps AeroVista present, position, and move work forward commercially. It separates sales and messaging ownership from delivery ownership so learners stop promising execution that belongs to other divisions.",
        "start_here": "Use Listen once, then check the slides for the clean rule: Lumina owns commercial clarity while the right division owns delivery truth.",
        "hero_kicker": "Lumina Revenue Foundations",
        "key_line": "Commercial clarity is a real lane. It is not a cosmetic afterthought.",
        "voiceover_intro": "Welcome to EP-LUM-101. This is the reset episode for the whole lane. If someone thinks Lumina is only the branding team, the rest of the pack will feel blurry. Lumina is the commercial growth lane. It helps AeroVista present the right offer, qualify the need, and move the right work toward the right delivery owner.",
        "slides": [
            {"id": "reset", "title": "More than branding", "goal": "Break the old assumption fast.", "bullets": ["Lumina is not just the team that makes things look polished.", "Lumina owns positioning, messaging, market-facing clarity, and commercial movement across the AeroVista ecosystem.", "That means Lumina must understand offers well enough to sell and route them without pretending to deliver all of them."]},
            {"id": "core_job", "title": "Lumina's core job", "goal": "Name the lane in plain language.", "bullets": ["Lumina helps prospects understand what AeroVista can do and which lane actually fits the need.", "It shapes messaging, campaign framing, sales conversations, and bundle logic so the commercial story stays coherent.", "The best shorthand is simple: Lumina helps move good-fit work forward."], "takeaway": "Lumina owns commercial clarity."},
            {"id": "not_job", "title": "What Lumina does not own", "goal": "Protect trust by drawing the line clearly.", "bullets": ["Lumina does not automatically own engineering, audio production, drone operations, publishing execution, or learning platform delivery.", "Those lanes can absolutely partner with Lumina, but delivery truth stays with the division doing the work.", "That distinction matters because overpromising early creates confusion later."]},
            {"id": "board", "title": "Why Lumina needs the whole board", "goal": "Show why cross-division awareness is a sales requirement.", "bullets": ["Lumina cannot route cleanly if it only understands one division.", "Prospects often describe a surface request that actually spans multiple lanes.", "Strong commercial judgment starts with enough board awareness to see the real fit."]},
            {"id": "examples", "title": "What Lumina-led can look like", "goal": "Make collaboration concrete.", "bullets": ["Lumina + Nexus: messaging and offer framing lead into a system or automation build.", "Lumina + EchoVerse: campaign positioning supports a sound, music, or release experience.", "Lumina + Horizon: a field proof asset becomes part of a larger market-facing story."]},
            {"id": "rule", "title": "The clean rule", "goal": "Give learners a sentence they can reuse.", "bullets": ["Lumina owns how the opportunity is framed, positioned, and moved forward commercially.", "Delivery lanes own the execution details, constraints, timelines, and records of actual delivery.", "When in doubt, protect delivery truth instead of smoothing it over."]},
            {"id": "your_role", "title": "Your role in revenue", "goal": "Set the expectation for the learner.", "bullets": ["Your job is to qualify, position, recommend, and hand off cleanly.", "You do not need fake expert knowledge in every delivery lane to be useful.", "You do need enough understanding to keep the prospect pointed in the right direction."]},
        ],
        "quest_prompt": "Use the checklist to reinforce the ownership line between commercial clarity and delivery truth.",
        "quest_items": [
            "Say the clean rule aloud once: Lumina owns commercial clarity; delivery lanes own delivery truth.",
            "Name one example of Lumina leading messaging while another division delivers.",
            "Open the lane overview and confirm that this pack sits after the Golden Path.",
            "Explain why confusing sales ownership with delivery ownership breaks trust.",
        ],
        "quiz_prompt": "Clear the reset before moving into the rest of the revenue lane.",
        "quiz_questions": [
            {"id": "lum101_q1", "q": "What is Lumina's best primary description?", "choices": ["A cosmetic design-only team", "A commercial growth and messaging lane", "The company-wide delivery owner"], "answer_index": 1, "explain": "Lumina owns commercial positioning and movement, not every delivery function."},
            {"id": "lum101_q2", "q": "If a lead needs a custom system plus better positioning, what is the cleanest model?", "choices": ["Lumina leads messaging while Nexus owns technical delivery", "Lumina should pretend to deliver the build too", "The lead does not fit AeroVista"], "answer_index": 0, "explain": "Commercial leadership and delivery ownership can be separate and still coordinated."},
            {"id": "lum101_q3", "q": "Why does Lumina need awareness of all seven divisions?", "choices": ["To replace them", "To qualify and route correctly", "To avoid talking with prospects"], "answer_index": 1, "explain": "Board awareness supports routing quality."},
            {"id": "lum101_q4", "q": "Which statement protects trust best?", "choices": ["Lumina owns commercial clarity; delivery lanes own delivery truth", "Lumina should promise whatever closes fastest", "Every lane sounds the same anyway"], "answer_index": 0, "explain": "That rule keeps scope honest and handoffs clean."},
            {"id": "lum101_q5", "q": "Which task is most clearly Lumina-owned?", "choices": ["Campaign framing and message positioning", "Drone flight execution", "Audio mastering"], "answer_index": 0, "explain": "Lumina leads the commercial story, not specialized execution."},
        ],
    },
    {
        "slug": "lumina_rev_102",
        "code": "EP-LUM-102",
        "title": "Know the Board",
        "runtime": 12,
        "tags": ["divisions", "routing", "board", "bundles"],
        "summary_short": "Build a usable map of all seven AeroVista divisions so leads get routed by need instead of buzzword.",
        "summary_long": "This episode gives the learner a sales-level explanation of each division, the kind of problem it fits, and the early signs that a single request is actually a bundled opportunity.",
        "start_here": "Listen once, then use the slides to practice one-sentence division shorthands and bundle thinking.",
        "hero_kicker": "Board Awareness",
        "key_line": "AeroVista is a board of lanes, not one giant bucket.",
        "voiceover_intro": "Welcome to EP-LUM-102. Lumina cannot route well without knowing the board. This episode is not about becoming a deep specialist in every lane. It is about building clean sales language for each division so you can hear a need and place it intelligently.",
        "slides": [
            {"id": "board_model", "title": "AeroVista is a board, not a bucket", "goal": "Anchor the peer-division model.", "bullets": ["Each division has its own delivery strengths, trust style, and offer logic.", "Lumina sits across the board commercially, but it still routes into specific lanes.", "That means the board matters more than memorizing slogans."]},
            {"id": "nexus", "title": "Nexus = build, systems, AI", "goal": "Give Nexus a clean sales shorthand.", "bullets": ["Think custom software, automation, integration, and AI-enabled systems.", "The buyer usually has an operational or technical problem that needs structure.", "Words like workflow, system, portal, automation, and integration are strong clues."]},
            {"id": "echo_sky", "title": "EchoVerse and SkyForge", "goal": "Separate sonic work from interactive experiences.", "bullets": ["EchoVerse fits music, sound, audio identity, release support, and expressive sonic experiences.", "SkyForge fits immersive, playful, interactive, or game-like work.", "A lead may mention content generally, but the format tells you which lane is primary."]},
            {"id": "summit_vespera", "title": "Summit and Vespera", "goal": "Distinguish learning systems from authored content.", "bullets": ["Summit is the learning and training systems lane: courses, learner journeys, education experiences.", "Vespera is the publishing and authored-content lane: books, editorial packages, narrative content systems.", "Both can package information, but they do not do it the same way."]},
            {"id": "lumina_horizon", "title": "Lumina and Horizon", "goal": "Place the market-facing and field-proof lanes together.", "bullets": ["Lumina owns the commercial story, positioning, and growth motion.", "Horizon brings field-ready aerial or visual proof when that proof is part of the opportunity.", "Aerial capture alone is not the same as campaign strategy, and campaign strategy alone is not field proof."]},
            {"id": "one_line", "title": "The board in one line each", "goal": "Make the map reusable in conversation.", "bullets": ["Nexus builds systems. EchoVerse shapes sound. SkyForge creates interactive experiences.", "Summit builds learning journeys. Vespera packages authored content. Horizon captures field proof. Lumina leads commercial clarity.", "If you can say that cleanly, you can start qualifying faster."]},
            {"id": "bundle", "title": "Single lane or bundle", "goal": "Introduce bundle thinking.", "bullets": ["Some leads are clearly single-lane. Others point to one primary lane plus support.", "A rebrand plus automation may be Lumina + Nexus. A release rollout may be Lumina + EchoVerse.", "The job is not to over-bundle everything. The job is to hear when more than one lane is real."]},
            {"id": "route_need", "title": "Route by need, not by buzzword", "goal": "Protect the learner from shallow routing.", "bullets": ["People say website when they actually need positioning, automation, proof assets, or a course flow.", "Surface wording helps, but problem shape matters more.", "Good routing listens for the underlying need first."]},
        ],
        "quest_prompt": "Match the plain-language division map before you move deeper into brand and qualification.",
        "quest_items": [
            "Name all seven divisions without opening another tab.",
            "Pick one example lead and say whether it is single-lane or bundle.",
            "Use the board shorthand slide to explain Lumina, Nexus, and Horizon in one sentence each.",
            "Say why buzzwords alone are a weak routing method.",
        ],
        "quiz_prompt": "Pass the board check before moving into division brand fit.",
        "quiz_questions": [
            {"id": "lum102_q1", "q": "Which division is the engineering and systems lane?", "choices": ["Nexus", "EchoVerse", "Vespera"], "answer_index": 0, "explain": "Nexus is the build, systems, and AI lane."},
            {"id": "lum102_q2", "q": "Which pairing best fits music or sound-centered work?", "choices": ["EchoVerse", "Horizon", "Summit"], "answer_index": 0, "explain": "EchoVerse is the sound and audio lane."},
            {"id": "lum102_q3", "q": "Course delivery and learner journey work best fits:", "choices": ["Summit", "SkyForge", "Vespera"], "answer_index": 0, "explain": "Summit is the training and learning systems lane."},
            {"id": "lum102_q4", "q": "Drone visuals plus campaign packaging is most likely:", "choices": ["Horizon only", "Lumina + Horizon", "SkyForge + Vespera"], "answer_index": 1, "explain": "Field proof plus market packaging suggests a bundle."},
            {"id": "lum102_q5", "q": "Best routing rule?", "choices": ["Route by buzzword only", "Route by underlying need", "Route by whichever lane is easiest to explain"], "answer_index": 1, "explain": "Need shape beats surface wording."},
        ],
    },
    {
        "slug": "lumina_rev_103",
        "code": "EP-LUM-103",
        "title": "Brand by Division",
        "runtime": 12,
        "tags": ["brand", "tone", "positioning", "trust-style"],
        "summary_short": "Learn how each division should feel and sound so sales messaging does not flatten the whole board into one generic pitch.",
        "summary_long": "This episode teaches division-specific tone, promise, and trust style so recommendations feel commercially credible and aligned to the actual lane.",
        "start_here": "Use Listen, then practice the feel of each division before you write recommendations in later episodes.",
        "hero_kicker": "Brand Fit",
        "key_line": "One ecosystem can still have distinct voices by division.",
        "voiceover_intro": "Welcome to EP-LUM-103. Brand is not just a look layer. In sales it shapes trust. If every division sounds the same, buyers lose confidence because the message stops fitting the real work. This episode teaches the brand feel of each lane so your language supports routing instead of weakening it.",
        "slides": [
            {"id": "brand_more", "title": "Brand is more than a logo", "goal": "Broaden the learner's definition.", "bullets": ["Brand includes language, confidence level, promise shape, trust style, and presentation energy.", "Sales messaging should match the lane it is pointing toward.", "A technically serious lane and an expressive creative lane should not sound identical."]},
            {"id": "why_diff", "title": "Why brand differences matter", "goal": "Tie tone to commercial trust.", "bullets": ["Flattened language makes offers blur together.", "Division-specific tone helps the buyer feel that AeroVista understands the category of work being discussed.", "That is not fragmentation. That is precision."]},
            {"id": "nexus_summit", "title": "Nexus and Summit", "goal": "Set technical and educational tones clearly.", "bullets": ["Nexus should feel capable, technical, reliable, and systems-minded.", "A Nexus-flavored line sounds like: We help operations teams replace manual workflow with dependable systems and automation.", "Summit should feel clear, educational, structured, and growth-focused, like: We help teams turn expertise into guided learner journeys people can actually complete."]},
            {"id": "echo_sky", "title": "EchoVerse and SkyForge", "goal": "Separate expressive from immersive.", "bullets": ["EchoVerse should feel emotional, sonic, expressive, and artist-aware.", "A strong EchoVerse line might say: We help artists shape a release experience people can hear, feel, and remember.", "SkyForge should feel imaginative, interactive, exploratory, and experience-driven, more like: We build interactive worlds people can step into, not just watch."]},
            {"id": "lumina_vespera", "title": "Lumina and Vespera", "goal": "Place market-facing persuasion beside authored clarity.", "bullets": ["Lumina should feel polished, strategic, persuasive, and market-facing.", "A Lumina-flavored line sounds like: We help you clarify the offer, sharpen the message, and move the right buyers forward.", "Vespera should feel thoughtful, authored, editorial, and narrative-driven, like: We turn your expertise into a crafted, readable body of published work."]},
            {"id": "horizon_umbrella", "title": "Horizon and the umbrella brand", "goal": "Keep field proof distinct while preserving ecosystem cohesion.", "bullets": ["Horizon should feel field-ready, visual, precise, and proof-driven.", "A Horizon line should sound grounded, like: We capture clean aerial proof that helps the audience trust what is actually there.", "The AeroVista umbrella should still feel cohesive, credible, and cross-division capable without forcing every division into the same voice."]},
            {"id": "wrong_sound", "title": "What sounds wrong", "goal": "Train mismatch detection.", "bullets": ["Overly poetic language can weaken a technical lane.", "Cold feature-heavy language can weaken a narrative or expressive lane.", "Wrong tone is a routing clue as much as a copy problem."]},
            {"id": "rewrite_examples", "title": "Worked rewrite examples", "goal": "Show what better fit actually sounds like.", "bullets": ["Weak generic line: We build bold digital experiences for any organization. Why it fails: it hides the lane and sounds interchangeable.", "Better Nexus line: We help teams replace spreadsheet chaos with dependable systems, automation, and reporting clarity.", "Better Vespera line: We help authors and brands turn rough expertise into clear, publishable content people can follow and trust."], "takeaway": "The right lane should sound recognizable before it is even named."},
            {"id": "brand_route", "title": "Use brand fit to improve routing", "goal": "Connect tone back to sales judgment.", "bullets": ["If the message sounds off, the path may also be off.", "Brand fit helps you catch weak proposals before they go out.", "Good sales language reinforces the right lane instead of hiding it."]},
        ],
        "quest_prompt": "Use the quest to sharpen division voice before you move into discovery.",
        "quest_items": [
            "Pick three divisions and describe how each one should feel in a sales conversation.",
            "Say one phrase that would sound wrong for Nexus and why.",
            "Say one phrase that would sound wrong for Vespera and why.",
            "Rewrite one generic line so it sounds clearly like the correct division.",
        ],
        "quiz_prompt": "Pass the brand-fit check before moving into discovery and qualification.",
        "quiz_questions": [
            {"id": "lum103_q1", "q": "Which lane should feel most systems-minded and technically reliable?", "choices": ["Nexus", "EchoVerse", "Horizon"], "answer_index": 0, "explain": "That tone belongs to Nexus."},
            {"id": "lum103_q2", "q": "Which lane should sound most editorial and authored?", "choices": ["Vespera", "Lumina", "SkyForge"], "answer_index": 0, "explain": "Vespera carries the authored-content trust style."},
            {"id": "lum103_q3", "q": "Which pair best matches expressive sonic work and interactive experience work?", "choices": ["EchoVerse then SkyForge", "Summit then Horizon", "Lumina then Nexus"], "answer_index": 0, "explain": "EchoVerse is sonic; SkyForge is interactive."},
            {"id": "lum103_q4", "q": "Why are brand differences useful in sales?", "choices": ["They make every lane sound the same", "They help the buyer trust the right kind of work", "They remove the need for discovery"], "answer_index": 1, "explain": "Tone helps the offer feel credible for the actual lane."},
            {"id": "lum103_q5", "q": "Which rewrite sounds most like Nexus?", "choices": ["We create unforgettable story worlds that audiences can step into", "We replace manual workflow with dependable systems and automation", "We craft editorial experiences that read like a polished imprint"], "answer_index": 1, "explain": "That line fits the technical, systems-minded Nexus voice."},
        ],
    },
    {
        "slug": "lumina_rev_104",
        "code": "EP-LUM-104",
        "title": "Find the Real Need",
        "runtime": 12,
        "tags": ["discovery", "qualification", "needs", "readiness"],
        "summary_short": "Learn discovery questions that reveal the actual need instead of chasing the first surface request.",
        "summary_long": "This episode teaches commercial discovery: problem, outcome, timeline, readiness, and the difference between the surface request and the deeper need that should guide routing.",
        "start_here": "Use the listen pass to hear the discovery mindset, then use the slides to practice wants-versus-needs thinking.",
        "hero_kicker": "Discovery Judgment",
        "key_line": "Do not pitch too early. Find the problem shape first.",
        "voiceover_intro": "Welcome to EP-LUM-104. Strong sales judgment usually looks quieter at the beginning. Instead of pitching fast, it asks better questions. This episode trains the learner to find the real need, not just the first request that lands in the conversation.",
        "slides": [
            {"id": "pitch_early", "title": "Do not pitch too early", "goal": "Slow the learner down at the right moment.", "bullets": ["Early pitching often solves the wrong problem.", "A surface request may be inaccurate, incomplete, or too narrow.", "Discovery protects both routing quality and trust."]},
            {"id": "rule", "title": "The discovery rule", "goal": "Give a repeatable starting frame.", "bullets": ["Start with the problem, desired outcome, and timeline.", "Those three anchors tell you much more than a feature request alone.", "Until those are clearer, recommendations stay provisional."]},
            {"id": "wants_needs", "title": "Wants versus needs", "goal": "Teach the difference directly.", "bullets": ["A lead may ask for a website when the deeper need is lead flow or trust repair.", "A lead may ask for content when the deeper need is a learning path or sales clarity.", "Surface wants matter, but they are not always the primary route signal."], "takeaway": "The first request is often a clue, not the full answer."},
            {"id": "questions", "title": "Questions that find truth", "goal": "Train useful discovery prompts.", "bullets": ["What problem are you trying to solve?", "What changes after success, and what timeline matters?", "What have you already tried, and who is affected if nothing changes?"], "takeaway": "Ask for the problem, the outcome, and the cost of inaction."},
            {"id": "readiness", "title": "Readiness signals", "goal": "Separate ready leads from blurry ones.", "bullets": ["Some leads are ready now. Others need more clarity. Some are not ready at all.", "Readiness changes the next step you recommend.", "Pushing a not-ready lead into a fake solution is still a sales failure."]},
            {"id": "primary_support", "title": "Primary lane versus support lane", "goal": "Teach bundle discipline.", "bullets": ["A lead can have one primary need and still benefit from support lanes.", "The primary lane should address the core problem, not just the nicest add-on.", "Support lanes are real, but they should not hide the core route."]},
            {"id": "worked_example", "title": "Worked discovery example", "goal": "Turn the framework into a real scenario.", "bullets": ["Surface request: We need a website refresh. Real issue after discovery: the owner has weak follow-up, no clear offer, and no lead intake automation.", "Better qualification summary: primary need is commercial clarity plus lead-flow structure, so Lumina + Nexus is more plausible than a design-only refresh.", "Good discovery changed the route because it exposed the real business problem, not just the front-end symptom."], "takeaway": "Discovery should rewrite the problem statement before you recommend the lane."},
            {"id": "summary", "title": "Write the qualification summary", "goal": "Turn conversation into usable routing notes.", "bullets": ["Capture the real problem, desired outcome, likely primary division, readiness, and bundle signals.", "That summary becomes the bridge into recommendation and handoff.", "If the summary is muddy, the next step will be muddy too."]},
        ],
        "quest_prompt": "Use the checklist to train discovery discipline before you recommend a path.",
        "quest_items": [
            "Ask the discovery rule aloud: problem, outcome, timeline.",
            "Turn one surface request into a deeper need statement.",
            "Name one signal that a lead may not be sales-ready yet.",
            "Write one sentence describing the primary lane and one possible support lane for a sample lead.",
        ],
        "quiz_prompt": "Pass the discovery check before you move into recommendation logic.",
        "quiz_questions": [
            {"id": "lum104_q1", "q": "Best first move in discovery?", "choices": ["Pitch the strongest offer immediately", "Ask about problem, outcome, and timeline", "Skip straight to pricing"], "answer_index": 1, "explain": "That frame reveals the real need."},
            {"id": "lum104_q2", "q": "A lead asks for a website, but the real issue is lead flow automation. The website request is:", "choices": ["The deeper need", "A surface request", "Proof that Nexus is wrong"], "answer_index": 1, "explain": "The first request is not always the core need."},
            {"id": "lum104_q3", "q": "Why do readiness signals matter?", "choices": ["They change the next step and recommendation quality", "They remove the need for notes", "They make every lead urgent"], "answer_index": 0, "explain": "Readiness affects how you move the opportunity forward."},
            {"id": "lum104_q4", "q": "How should support lanes be used?", "choices": ["To hide the main problem", "To support the primary route without replacing it", "To make every opportunity bigger"], "answer_index": 1, "explain": "Support lanes help, but the primary need still leads."},
            {"id": "lum104_q5", "q": "In the worked website-refresh example, what changed after discovery?", "choices": ["The lead no longer needed help", "The issue became clearer as commercial clarity plus lead-flow structure", "The safest route became Horizon only"], "answer_index": 1, "explain": "Discovery exposed the deeper commercial and systems need behind the website request."},
        ],
    },
    {
        "slug": "lumina_rev_105",
        "code": "EP-LUM-105",
        "title": "Recommend the Right Path",
        "runtime": 12,
        "tags": ["recommendation", "bundles", "scope", "overpromising"],
        "summary_short": "Turn discovery into a clean recommendation without overpromising, collapsing scope, or hiding who actually delivers.",
        "summary_long": "This episode teaches how to recommend a single lane or bundle, explain why, and keep scope honest so the next step stays commercially useful and operationally safe.",
        "start_here": "Listen first, then use the slides to practice single-lane versus bundle recommendations.",
        "hero_kicker": "Recommendation Logic",
        "key_line": "Discovery should end in direction, not in vagueness.",
        "voiceover_intro": "Welcome to EP-LUM-105. Discovery is only useful if it turns into direction. This episode teaches the learner how to recommend the right path, explain why, and avoid promising more than the real fit supports.",
        "slides": [
            {"id": "direction", "title": "Discovery must turn into direction", "goal": "Show why recommendation is the next skill.", "bullets": ["Good sales process ends in a clear next-step recommendation.", "If discovery ends in fog, the prospect still feels lost.", "Clear direction is part of commercial value."]},
            {"id": "single_bundle", "title": "Single division versus bundle", "goal": "Make the recommendation fork explicit.", "bullets": ["Some opportunities have one obvious primary lane.", "Others need a primary lane plus support lanes to actually solve the problem.", "The recommendation should match the real shape of the need."]},
            {"id": "lumina_led", "title": "Lumina-led is not Lumina-delivered", "goal": "Protect the ownership line during recommendations.", "bullets": ["Lumina can lead the commercial framing and still point delivery elsewhere.", "That is a strength, not a weakness.", "A clean recommendation makes the delivery owner explicit."]},
            {"id": "patterns", "title": "Common bundle patterns", "goal": "Give learners reusable examples.", "bullets": ["Lumina + Nexus for positioning plus systems.", "Lumina + EchoVerse for rollout plus sound or release experience.", "Lumina + Horizon for campaign packaging plus visual proof."]},
            {"id": "hold_back", "title": "Hold back when needed", "goal": "Teach scope discipline.", "bullets": ["Sometimes the strongest recommendation is narrower than the lead expects.", "If the real need is simple, do not inflate it into a vague mega-bundle.", "Honest scope improves trust and close quality."]},
            {"id": "why", "title": "Explain the why", "goal": "Keep recommendations defensible.", "bullets": ["The recommendation language should tie directly to the problem and outcome.", "If you cannot explain why the lane fits, the recommendation is not ready.", "A clear why keeps internal handoff stronger too."]},
            {"id": "worked_path", "title": "Worked recommendation example", "goal": "Make the recommendation formula concrete.", "bullets": ["Lead: a regional service company asks for a new site, but discovery reveals weak offer clarity, poor lead follow-up, and manual intake.", "Clean recommendation: Lumina + Nexus. Why: Lumina clarifies the commercial offer and message; Nexus handles the intake flow and automation layer.", "What to avoid promising: a full rebuild of everything at once before the scope and operations constraints are understood."], "takeaway": "The best recommendation names the lane, the reason, and the guardrail."},
            {"id": "formula", "title": "Recommendation formula", "goal": "Give the learner a repeatable structure.", "bullets": ["Problem -> recommended lane or bundle -> reason -> next step.", "This formula keeps the recommendation short, useful, and hard to fake.", "Use it before you send anything externally."]},
        ],
        "quest_prompt": "Use the checklist to turn discovery notes into a clean recommendation.",
        "quest_items": [
            "Say the recommendation formula once from memory.",
            "Choose one sample lead and decide whether it is single-lane or bundle.",
            "State one thing the sales team should not promise too early.",
            "Explain why Lumina-led does not mean Lumina-delivered.",
        ],
        "quiz_prompt": "Pass the recommendation check before you move into growth motion and follow-up.",
        "quiz_questions": [
            {"id": "lum105_q1", "q": "What should discovery produce next?", "choices": ["A clear recommendation", "A random list of features", "No direction until delivery starts"], "answer_index": 0, "explain": "Discovery should resolve into direction."},
            {"id": "lum105_q2", "q": "What is the safest reading of Lumina-led?", "choices": ["Lumina always delivers the work", "Lumina may lead commercially while another division delivers", "Lumina should hide the delivery owner"], "answer_index": 1, "explain": "Commercial leadership and delivery ownership are distinct."},
            {"id": "lum105_q3", "q": "When is a bundle appropriate?", "choices": ["When the real need spans more than one lane", "On every lead", "Never"], "answer_index": 0, "explain": "Bundles should follow need shape, not habit."},
            {"id": "lum105_q4", "q": "What does strong scope discipline look like?", "choices": ["Inflate every opportunity", "Narrow the recommendation when that is the honest fit", "Promise everything and sort it out later"], "answer_index": 1, "explain": "Holding back can strengthen trust."},
            {"id": "lum105_q5", "q": "In the worked service-company example, why is Lumina + Nexus plausible?", "choices": ["Because the lead only needs aerial footage", "Because the need includes message clarity plus intake-flow structure", "Because every lead should become a two-lane bundle"], "answer_index": 1, "explain": "The recommendation follows the discovered combination of commercial and systems problems."},
        ],
    },
    {
        "slug": "lumina_rev_106",
        "code": "EP-LUM-106",
        "title": "Turn Qualified Interest into Growth",
        "runtime": 12,
        "tags": ["follow-up", "growth", "handoff", "pipeline"],
        "summary_short": "Move a qualified opportunity forward with a clear follow-up, concrete next step, and clean internal handoff.",
        "summary_long": "This episode teaches the motion after qualification and recommendation: follow-up messaging, next-step clarity, pipeline support, and what delivery needs in the handoff.",
        "start_here": "Listen first, then use the slides to compare weak follow-up with strong follow-up.",
        "hero_kicker": "Growth Motion",
        "key_line": "Interest still dies if the next step is weak.",
        "voiceover_intro": "Welcome to EP-LUM-106. A qualified lead can still stall if the follow-up is vague or the handoff is messy. This episode teaches the last operational move in the lane: how to carry momentum forward without losing clarity.",
        "slides": [
            {"id": "dies_without_motion", "title": "Interest dies without motion", "goal": "Show why follow-up matters.", "bullets": ["Qualification alone does not create growth.", "Leads stall when the next step is fuzzy, generic, or delayed.", "Momentum needs a message and an action."]},
            {"id": "formula", "title": "The follow-up formula", "goal": "Give the learner a repeatable message shape.", "bullets": ["Recap the problem.", "State the recommendation and the next step clearly.", "Use a simple CTA that makes response easy."], "takeaway": "Recap -> recommendation -> next step -> CTA."},
            {"id": "marketing_pipeline", "title": "Marketing supports pipeline", "goal": "Connect messaging to revenue motion.", "bullets": ["Good follow-up is part of growth, not just polish.", "Campaign framing and message consistency keep the lead moving with less friction.", "Weak messaging can reopen confusion that discovery already solved."]},
            {"id": "consistency", "title": "Message consistency across divisions", "goal": "Keep the ecosystem coherent.", "bullets": ["Different division voices can still feel like one credible ecosystem.", "The follow-up should match the recommended lane while staying recognizably AeroVista.", "Consistency reduces handoff confusion internally too."]},
            {"id": "proposal_tone", "title": "Proposal tone and next step", "goal": "Train specific and realistic CTAs.", "bullets": ["Keep next steps concrete and easy to act on.", "Avoid vague lines like let us know your thoughts if the path needs a real owner.", "A stronger CTA sounds like: If this direction fits, we can outline the Lumina + Nexus scope and assign the intake workflow owner in the next working session."], "takeaway": "Specific CTAs carry momentum better than polite vagueness."},
            {"id": "handoff_notes", "title": "Delivery handoff notes", "goal": "Prepare delivery for a clean start.", "bullets": ["Delivery needs the problem, desired outcome, recommended path, and open questions.", "A clean handoff note saves rework and protects buyer trust.", "Useful note example: Lead wants faster response to inbound requests; message angle is trust plus speed; likely first build is intake flow before full site redesign."]},
            {"id": "before_after", "title": "Weak follow-up versus strong follow-up", "goal": "Make quality visible.", "bullets": ["Weak follow-up: Thanks for chatting. We do a lot in this space and would love to help however makes sense. Why it fails: no recap, no route, no owner, no next step.", "Strong follow-up: Based on the gaps in offer clarity and intake flow, we recommend Lumina + Nexus. Lumina sharpens the message and sales path; Nexus maps the intake workflow. If that fits, next step is a scoped working session this week.", "This is the bridge into TR-LUM-001 and the sales brief seed artifact."], "takeaway": "Strong follow-up sounds like direction, not polite drift."},
        ],
        "quest_prompt": "Use the checklist to turn a recommendation into forward motion.",
        "quest_items": [
            "Write one recap sentence for a qualified lead.",
            "Write one next-step CTA that is specific enough to act on.",
            "Name one handoff detail delivery should always receive.",
            "Explain why weak follow-up can waste a good discovery call.",
        ],
        "quiz_prompt": "Pass the growth-motion check before you open the capstone mission.",
        "quiz_questions": [
            {"id": "lum106_q1", "q": "What is the best first line in a follow-up?", "choices": ["A recap of the real problem or goal", "A random feature list", "An apology for asking questions"], "answer_index": 0, "explain": "Strong follow-up reconnects to the need immediately."},
            {"id": "lum106_q2", "q": "Why do next steps need to be specific?", "choices": ["Specific steps keep momentum easier to act on", "Specificity is unprofessional", "Because every lead needs the same CTA"], "answer_index": 0, "explain": "Specific CTAs reduce drift."},
            {"id": "lum106_q3", "q": "What helps delivery start cleanly?", "choices": ["A handoff note with context and open questions", "No notes at all", "Only the prospect's first message"], "answer_index": 0, "explain": "Handoff quality protects time and trust."},
            {"id": "lum106_q4", "q": "What should message consistency do?", "choices": ["Erase division identity", "Keep the ecosystem credible while matching the lane", "Make all follow-up sound identical"], "answer_index": 1, "explain": "Consistency and division fit can coexist."},
            {"id": "lum106_q5", "q": "Which follow-up line is strongest?", "choices": ["We would love to help however makes sense", "If this direction fits, we can scope the Lumina + Nexus next step this week", "Let us know your thoughts sometime"], "answer_index": 1, "explain": "The strongest line names the direction and gives an actionable next step."},
        ],
    },
]


def episode_route_parts(index: int) -> tuple[str, str, str]:
    code = 101 + index
    return (f"lum{code}_listen", f"lum{code}_slide", f"lum{code}_engage")


def build_episode_profile(index: int, episode: dict) -> dict:
    listen_step, slide_step, engage_step = episode_route_parts(index)
    previous_href = "../current_truth_basics/index.html" if index == 0 else f"../{EPISODES[index - 1]['slug']}/index.html"
    previous_label = "Back: EP-004" if index == 0 else f"Back: {EPISODES[index - 1]['code']}"
    if index < len(EPISODES) - 1:
        next_href = f"../{EPISODES[index + 1]['slug']}/index.html"
        next_label = EPISODES[index + 1]["code"]
        next_cta = f"Open {EPISODES[index + 1]['code']}"
        next_desc = f"Complete {episode['code']} gates, then continue into {EPISODES[index + 1]['title']}."
    else:
        next_href = "../../episodes/training_missions/tr_lum_001_revenue_routing/index.html"
        next_label = "TR-LUM-001"
        next_cta = "Open TR-LUM-001"
        next_desc = "Complete the lane episodes, then prove the full workflow in the Revenue Routing Mission."
    references = list(COMMON_REF_LINKS) + [{"label": f"{episode['code']} plan", "href": f"../../building blocks/LUM_BUILD_PACKS/LUM-REV-001/episodes/{episode['code']}.md"}]
    return {
        "schema": "bytecast-ep-profile-v1",
        "episode": {
            "code": episode["code"],
            "title": episode["title"],
            "type": "episode pack",
            "date": DATE,
            "runtime_target_minutes": episode["runtime"],
            "status": "active",
        },
        "content": {
            "tags": episode["tags"],
            "summary_short": episode["summary_short"],
            "summary_long": episode["summary_long"],
            "start_here": episode["start_here"],
            "hero_kicker": episode["hero_kicker"],
            "key_line": episode["key_line"],
        },
        "media": {"audio_files": []},
        "slides": episode["slides"],
        "references": {"blurb": "Use the original lane docs plus ByteCast standards to reinforce this episode.", "links": references},
        "navigation": {"previous_href": previous_href, "previous_label": previous_label},
        "advance": {"href": next_href, "label": next_label, "cta": next_cta, "tag": "THEN", "description": next_desc},
        "routing": {
            "slug": episode["slug"],
            "journey_id": JOURNEY_ID,
            "listen_step": listen_step,
            "slide_step": slide_step,
            "engage_step": engage_step,
            "storage_prefix": episode["slug"],
        },
        "engagement": {
            "quest": {"title": f"{episode['code']} practice checklist", "prompt": episode["quest_prompt"], "items": [{"id": f"q{i+1}", "text": text} for i, text in enumerate(episode["quest_items"])]},
            "quiz": {"enabled": True, "pass_threshold": 0.8, "prompt": episode["quiz_prompt"], "questions": episode["quiz_questions"]},
        },
    }


def build_voiceover(episode: dict) -> dict:
    sections = [
        {
            "id": "cold-open",
            "title": "Cold open",
            "displayText": episode["voiceover_intro"],
            "speakText": episode["voiceover_intro"],
        }
    ]
    overview_order = ["cold-open"]
    slide_map = {}
    for slide in episode["slides"]:
        text = " ".join([slide["title"] + ".", slide["goal"]] + slide["bullets"])
        section_id = f"slide-{slide['id']}"
        sections.append({"id": section_id, "title": slide["title"], "displayText": text, "speakText": text})
        overview_order.append(section_id)
        slide_map[slide["id"]] = section_id
    sections.append({"id": "end", "title": "End", "displayText": "End.", "speakText": "End."})
    return {
        "schema": "bytecast-voiceover-sections-v1",
        "slug": episode["slug"],
        "code": episode["code"],
        "sections": sections,
        "overviewOrder": overview_order,
        "heroSectionId": "cold-open",
        "slideSectionMap": slide_map,
    }


def build_journey() -> dict:
    steps = []
    requires = []
    min_proof = {}
    for index, episode in enumerate(EPISODES):
        code_number = 101 + index
        listen_step, slide_step, engage_step = episode_route_parts(index)
        gate_id = f"lum{code_number}_gates"
        step = {
            "id": gate_id,
            "label": f"{episode['code']} Progress Check",
            "lane": "bytecast",
            "group": "Lumina Lane",
            "order": 10 + index * 2,
            "estimatedMinutes": episode["runtime"],
            "href": f"episodes/{episode['slug']}/index.html",
            "cta": f"Finish {episode['code']}",
            "complete_when": {"type": "steps_all", "ids": [listen_step, slide_step, engage_step]},
        }
        steps.append(step)
        requires.append(gate_id)
        min_proof[engage_step] = ["engageQuizPassed", "engageQuizScore"]
    steps.append({
        "id": "tr_lum_001_revenue_routing",
        "label": "TR-LUM-001 Revenue Routing Mission",
        "lane": "training",
        "group": "Training",
        "order": 30,
        "estimatedMinutes": 18,
        "href": "episodes/training_missions/tr_lum_001_revenue_routing/index.html",
        "cta": "Run TR-LUM-001",
    })
    steps.append({
        "id": "seed_lum_001_sales_brief",
        "label": "SEED-LUM-001 Sales Brief",
        "lane": "seed",
        "group": "Seeding",
        "order": 40,
        "estimatedMinutes": 12,
        "href": "episodes/seed_builder_studio/lumina_sales_brief/index.html",
        "cta": "Build SEED-LUM-001",
    })
    steps.append({
        "id": "badge_lum_rev_001_ready",
        "label": "Lumina Badge",
        "lane": "badge",
        "group": "Badge",
        "order": 50,
        "estimatedMinutes": 1,
        "href": "seed_bytecast.html",
        "cta": "View Badge",
        "complete_when": {"type": "badge_has", "badge_id": "lum_rev_001_ready"},
    })
    requires.extend(["tr_lum_001_revenue_routing", "seed_lum_001_sales_brief"])
    min_proof["tr_lum_001_revenue_routing"] = ["mission", "understandingCheckPassed", "lumMissionScore", "lumScenarioId", "lumPrimaryDivision", "lumRecommendationSummary", "lumReviewerApproved", "lumReviewerName", "lumMissionCompletedAt"]
    min_proof["seed_lum_001_sales_brief"] = ["artifactName", "artifactHash", "lumSalesBriefPrimaryDivision", "lumSalesBriefRecommendationSummary", "lumSalesBriefNextStep"]
    return {
        "id": JOURNEY_ID,
        "label": "Lumina Revenue Lane",
        "description": "Learning lane: EP-LUM-101 to EP-LUM-106, then TR-LUM-001, SEED-LUM-001, and Badge. Golden Path is helpful, not required.",
        "steps": steps,
        "badges": [{"id": "lum_rev_001_ready", "label": "Lumina Revenue Ready", "requires": requires, "minProof": min_proof}],
    }


def wire_journey_config() -> None:
    path = ROOT / "data" / "journey_steps.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    payload["updated_on"] = f"{DATE}T12:00:00Z"
    journeys = [journey for journey in payload.get("journeys", []) if journey.get("id") != JOURNEY_ID]
    journeys.append(build_journey())
    payload["journeys"] = journeys
    write_json(path, payload)


def wire_modules() -> None:
    path = ROOT / "episodes" / "training_hub" / "data" / "modules.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    payload["updated_on"] = DATE
    modules = [module for module in payload.get("modules", []) if module.get("id") not in {"tr_lum_001_revenue_routing", "seed_lum_001_sales_brief"}]
    modules.extend([
        {
            "id": "tr_lum_001_revenue_routing",
            "name": "TR-LUM-001 - Revenue Routing Mission",
            "description": "Lumina capstone mission: qualify the lead, recommend the right lane, and save a reviewer-approved result.",
            "owner": "Training and Community",
            "category": "mission",
            "path": "../../episodes/training_missions/tr_lum_001_revenue_routing/index.html",
            "canon_path": "episodes/training_missions/tr_lum_001_revenue_routing",
        },
        {
            "id": "seed_lum_001_sales_brief",
            "name": "SEED-LUM-001 - Lumina Sales Brief",
            "description": "Seed page for packaging the Lumina sales brief and saving completion for the lane.",
            "owner": "Training and Community",
            "category": "seed",
            "path": "../../episodes/seed_builder_studio/lumina_sales_brief/index.html",
            "canon_path": "episodes/seed_builder_studio/lumina_sales_brief",
        },
    ])
    payload["modules"] = modules
    write_json(path, payload)


def wire_playlist() -> None:
    path = ROOT / "seed_bytecast.html"
    html = path.read_text(encoding="utf-8")
    lumina_block = dedent(
        """
                  <div id="luminaJourneyLaunch" style="display:grid; gap:10px;">
                    <button id="luminaJourneyBtn" type="button" class="btn btn--primary">Lumina Revenue Lane</button>
                    <a class="btn" id="luminaStartBtn" href="./episodes/lumina_rev_101/index.html">Start EP-LUM-101</a>
                    <div id="luminaJourneyNote" class="tiny" style="padding:10px 12px; border-radius:14px; border:1px solid rgba(255,196,90,0.24); background:rgba(255,196,90,0.08); color:rgba(255,240,210,0.92);">
                      Lumina Revenue is open now on the Playlist. Golden Path is still recommended, but it is no longer a blocker.
                    </div>
                  </div>
        """
    ).strip()
    if 'id="luminaJourneyLaunch"' not in html and 'id="luminaJourneyBtn"' in html:
        html = html.replace(
            '<button id="luminaJourneyBtn" type="button" class="btn">Lumina Revenue Lane</button>',
            lumina_block,
        )
    if 'id="luminaJourneyBtn"' not in html:
        html = html.replace(
            '<button id="apparelJourneyBtn" type="button" class="btn">Apparel Ops Onboarding</button>',
            '<button id="apparelJourneyBtn" type="button" class="btn">Apparel Ops Onboarding</button>\n          ' + lumina_block,
        )
    if 'const luminaBtn = document.getElementById("luminaJourneyBtn");' not in html:
        marker = 'const apparelBtn = document.getElementById("apparelJourneyBtn");'
        block = dedent(
            """
            const luminaBtn = document.getElementById("luminaJourneyBtn");
            if (luminaBtn && Loop) {
              luminaBtn.addEventListener("click", () => {
                try { Loop.setActiveJourneyId?.("lumina_revenue_v1"); } catch {}
                void renderGoldenPath();
                const map = document.getElementById("journeyMap");
                if (map && typeof map.scrollIntoView === "function") {
                  map.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              });
            }

            """
        ).strip()
        html = html.replace(marker, block + "\n\n    " + marker)
    write_text(path, html)


def build_lane() -> None:
    write_text(ROOT / "assets" / "shared" / "lumina_episode.css", EPISODE_CSS)
    write_text(ROOT / "assets" / "shared" / "lumina_episode_runtime.js", EPISODE_JS)
    for index, episode in enumerate(EPISODES):
        episode_dir = ROOT / "episodes" / episode["slug"]
        write_text(episode_dir / "index.html", EPISODE_HTML)
        write_json(episode_dir / "bytecast_ep_profile.json", build_episode_profile(index, episode))
        write_json(episode_dir / "assets" / "voiceover_sections.json", build_voiceover(episode))
        write_json(
            episode_dir / "SOT.json",
            build_sot_manifest(
                name=episode["slug"],
                slug=episode["slug"].replace("_", "-"),
                deploy_path=f"/srv/Collab/mini.shops/bytecast/episodes/{episode['slug']}",
                business_role=f"Lumina Revenue lane episode for {episode['code']} within ByteCast.",
                canon_files=[
                    {
                        "id": "episode_index",
                        "path": "index.html",
                        "type": "html",
                        "role": "primary learner entrypoint",
                        "required": True,
                        "owner": "project-owner",
                        "status": "active",
                    },
                    {
                        "id": "episode_profile",
                        "path": "bytecast_ep_profile.json",
                        "type": "json",
                        "role": "episode training content profile",
                        "required": True,
                        "owner": "project-owner",
                        "status": "active",
                    },
                    {
                        "id": "episode_voiceover_sections",
                        "path": "assets/voiceover_sections.json",
                        "type": "json",
                        "role": "generated voiceover section bundle",
                        "required": True,
                        "owner": "project-owner",
                        "status": "active",
                    },
                ],
            ),
        )
    write_text(ROOT / "training_missions" / "tr_lum_001_revenue_routing" / "index.html", MISSION_HTML)
    write_json(
        ROOT / "training_missions" / "tr_lum_001_revenue_routing" / "SOT.json",
        build_sot_manifest(
            name="tr_lum_001_revenue_routing",
            slug="tr-lum-001-revenue-routing",
            deploy_path="/srv/Collab/mini.shops/bytecast/episodes/training_missions/tr_lum_001_revenue_routing",
            business_role="Lumina Revenue lane capstone mission inside ByteCast.",
            canon_files=[
                {
                    "id": "mission_index",
                    "path": "index.html",
                    "type": "html",
                    "role": "primary learner entrypoint",
                    "required": True,
                    "owner": "project-owner",
                    "status": "active",
                }
            ],
        ),
    )
    write_text(ROOT / "seed_builder_studio" / "lumina_sales_brief" / "index.html", SEED_HTML)
    write_json(
        ROOT / "seed_builder_studio" / "lumina_sales_brief" / "SOT.json",
        build_sot_manifest(
            name="lumina_sales_brief",
            slug="lumina-sales-brief",
            deploy_path="/srv/Collab/mini.shops/bytecast/episodes/seed_builder_studio/lumina_sales_brief",
            business_role="Lumina Revenue lane seed artifact page for the sales brief handoff inside ByteCast.",
            canon_files=[
                {
                    "id": "seed_index",
                    "path": "index.html",
                    "type": "html",
                    "role": "primary learner entrypoint",
                    "required": True,
                    "owner": "project-owner",
                    "status": "active",
                }
            ],
        ),
    )
    wire_journey_config()
    wire_modules()
    wire_playlist()


if __name__ == "__main__":
    build_lane()


