
#!/usr/bin/env python3
"""AV SeedGen — Profiles Edition.

Generate standardized static seed bundles using named profiles.

Examples:
  python seedgen.py --list-profiles
  python seedgen.py --profile celestine --name celestine_jungle --title "Celestine • Jungle Manuscript Awakening" --tagline "Notice the threads." --pwa --zip
  python seedgen.py --profile onboarding --name founder_welcome --title "Founder Welcome" --tagline "Earn your badge." --zip
"""

from __future__ import annotations
import argparse, json, re, zipfile
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).parent
TEMPLATES = HERE / "templates"
PROFILES_DIR = HERE / "profiles"

QUIZ_SECTION_TEMPLATE = "<section id=\"quiz\" class=\"section\">\n  <div class=\"section__head\">\n    <h2>{QUIZ_TITLE}</h2>\n    <p>{QUIZ_DESC}</p>\n  </div>\n\n  <div class=\"quiz\" data-passpct=\"{QUIZ_PASS_PCT}\">\n    <div class=\"quiz__row\">\n      <input class=\"input\" id=\"quizInput\" type=\"text\" placeholder=\"{QUIZ_PLACEHOLDER}\" aria-label=\"Quiz input\" />\n      <button class=\"btn btn--primary\" id=\"quizBtn\" type=\"button\">{QUIZ_BUTTON}</button>\n    </div>\n    <p class=\"muted\" id=\"quizStatus\">{QUIZ_STATUS_DEFAULT}</p>\n  </div>\n</section>"

def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "seed"

def read_text(p: Path) -> str:
    return p.read_text(encoding="utf-8")

def write_text(p: Path, content: str) -> None:
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

def copy_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(src.read_bytes())

def render(template: str, ctx: dict[str, str]) -> str:
    out = template
    for k, v in ctx.items():
        out = out.replace("{" + k + "}", v)
    return out

def list_profiles() -> list[str]:
    if not PROFILES_DIR.exists():
        return []
    return sorted([p.stem for p in PROFILES_DIR.glob("*.json")])

def load_profile(name: str) -> dict:
    p = PROFILES_DIR / f"{name}.json"
    if not p.exists():
        raise SystemExit(f"Profile not found: {name}. Available: {', '.join(list_profiles())}")
    return json.loads(p.read_text(encoding="utf-8"))

def merge_profile_into_args(profile: dict, args, defaults: dict) -> None:
    theme = profile.get("theme", {})
    prompts = profile.get("prompts", {})
    insights = profile.get("insights", {})
    steps = profile.get("steps", {})
    quiz = profile.get("quiz", {})

    def set_if_default(attr, value):
        if getattr(args, attr) == defaults.get(attr):
            setattr(args, attr, value)

    set_if_default("kicker", profile.get("kicker", args.kicker))
    set_if_default("subhead", profile.get("subhead", args.subhead))
    set_if_default("description", profile.get("description", args.description))

    for k, attr in [
        ("bg0","bg0"),("bg1","bg1"),("ink","ink"),("muted","muted"),
        ("accent","accent"),("accent2","accent2"),("paper","paper"),("paper2","paper2"),
        ("theme_color","theme_color"),
    ]:
        if k in theme:
            set_if_default(attr, str(theme[k]))

    for k, attr in [
        ("hero_prompt","hero_prompt"),
        ("section_bg_prompt","section_bg_prompt"),
        ("card_tex_prompt","card_tex_prompt"),
        ("footer_bg_prompt","footer_bg_prompt"),
        ("icon_ideas","icon_ideas"),
    ]:
        if k in prompts:
            set_if_default(attr, str(prompts[k]))

    tags = insights.get("tags", [])
    heads = insights.get("heads", [])
    bodies = insights.get("bodies", [])
    if len(tags) >= 3:
        set_if_default("insight1_tag", tags[0])
        set_if_default("insight2_tag", tags[1])
        set_if_default("insight3_tag", tags[2])
    if len(heads) >= 3:
        set_if_default("insight1_head", heads[0])
        set_if_default("insight2_head", heads[1])
        set_if_default("insight3_head", heads[2])
    if len(bodies) >= 3:
        set_if_default("insight1_body", bodies[0])
        set_if_default("insight2_body", bodies[1])
        set_if_default("insight3_body", bodies[2])

    st = steps.get("titles", [])
    sd = steps.get("descs", [])
    if len(st) >= 3:
        set_if_default("step1_title", st[0])
        set_if_default("step2_title", st[1])
        set_if_default("step3_title", st[2])
    if len(sd) >= 3:
        set_if_default("step1_desc", sd[0])
        set_if_default("step2_desc", sd[1])
        set_if_default("step3_desc", sd[2])

    if quiz.get("enabled", False):
        set_if_default("quiz_enabled", True)
        set_if_default("quiz_title", quiz.get("title", "Quick gate (prototype)"))
        set_if_default("quiz_desc", quiz.get("desc", "Prototype quiz gate."))
        set_if_default("quiz_pass_pct", int(quiz.get("pass_pct", 80)))
        set_if_default("quiz_placeholder", quiz.get("placeholder", "Enter comma-separated specifics"))
        set_if_default("quiz_button", quiz.get("button", "Check"))
        set_if_default("quiz_status_default", quiz.get("status_default", "Tip: be specific."))

def make_ctx(args) -> dict[str, str]:
    date = datetime.now().strftime("%Y-%m-%d %H:%M")
    seed = slugify(args.name)
    brand = args.brand or (args.title.split("•")[0].strip() if "•" in args.title else args.title.split("|")[0].strip())

    ctx = {
        "PROFILE": args.profile or "custom",
        "SEED_NAME": seed,
        "TITLE": args.title,
        "BRAND": brand,
        "TAGLINE": args.tagline,
        "KICKER": args.kicker,
        "SUBHEAD": args.subhead,
        "DESCRIPTION": args.description,
        "PRIMARY_CTA": args.primary_cta,

        "SECTION1_TITLE": args.section1_title,
        "SECTION1_DESC": args.section1_desc,
        "SECTION2_TITLE": args.section2_title,
        "SECTION2_DESC": args.section2_desc,

        "INSIGHT1_TAG": args.insight1_tag,
        "INSIGHT2_TAG": args.insight2_tag,
        "INSIGHT3_TAG": args.insight3_tag,

        "INSIGHT1_HEAD": args.insight1_head,
        "INSIGHT1_BODY": args.insight1_body,
        "INSIGHT2_HEAD": args.insight2_head,
        "INSIGHT2_BODY": args.insight2_body,
        "INSIGHT3_HEAD": args.insight3_head,
        "INSIGHT3_BODY": args.insight3_body,

        "STEP1_TITLE": args.step1_title,
        "STEP1_DESC": args.step1_desc,
        "STEP2_TITLE": args.step2_title,
        "STEP2_DESC": args.step2_desc,
        "STEP3_TITLE": args.step3_title,
        "STEP3_DESC": args.step3_desc,

        "CTA_TITLE": args.cta_title,
        "CTA_DESC": args.cta_desc,
        "FOOTER_TITLE": args.footer_title,
        "FOOTER_DESC": args.footer_desc,

        "BG0": args.bg0,
        "BG1": args.bg1,
        "INK": args.ink,
        "MUTED": args.muted,
        "ACCENT": args.accent,
        "ACCENT2": args.accent2,
        "PAPER": args.paper,
        "PAPER2": args.paper2,
        "THEME_COLOR": args.theme_color,

        "HERO_PROMPT": args.hero_prompt,
        "SECTION_BG_PROMPT": args.section_bg_prompt,
        "CARD_TEX_PROMPT": args.card_tex_prompt,
        "FOOTER_BG_PROMPT": args.footer_bg_prompt,
        "ICON_IDEAS": args.icon_ideas,

        "DATE": date,
        "CACHE_NAME": f"{seed}-v1",
    }

    if args.pwa:
        ctx["PWA_LINKS"] = '<link rel="manifest" href="manifest.webmanifest" />'
        ctx["INSTALL_BUTTON"] = '<button class="btn btn--ghost" id="installBtn" type="button" hidden>Install</button>'
    else:
        ctx["PWA_LINKS"] = ""
        ctx["INSTALL_BUTTON"] = ""

    if args.quiz_enabled:
        quiz_ctx = {
            "QUIZ_TITLE": args.quiz_title,
            "QUIZ_DESC": args.quiz_desc,
            "QUIZ_PASS_PCT": str(args.quiz_pass_pct),
            "QUIZ_PLACEHOLDER": args.quiz_placeholder,
            "QUIZ_BUTTON": args.quiz_button,
            "QUIZ_STATUS_DEFAULT": args.quiz_status_default,
        }
        ctx["OPTIONAL_QUIZ_SECTION"] = render(QUIZ_SECTION_TEMPLATE, quiz_ctx)
    else:
        ctx["OPTIONAL_QUIZ_SECTION"] = ""

    return ctx

def write_assets_placeholders(outdir: Path) -> None:
    assets = outdir / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    for fn in ["hero.jpg", "paper.jpg", "icon-192.png", "icon-512.png"]:
        (assets / fn).write_bytes(b"")

def build(args) -> Path:
    seed = slugify(args.name)
    outroot = Path(args.out).resolve()
    outdir = outroot / seed

    if outdir.exists() and not args.force:
        raise SystemExit(f"Output folder exists: {outdir} (use --force to overwrite)")

    if outdir.exists():
        for p in sorted(outdir.rglob("*"), reverse=True):
            if p.is_file():
                p.unlink()
            elif p.is_dir():
                try:
                    p.rmdir()
                except OSError:
                    pass
        try:
            outdir.rmdir()
        except OSError:
            pass

    outdir.mkdir(parents=True, exist_ok=True)

    ctx = make_ctx(args)

    write_text(outdir / "index.html", render(read_text(TEMPLATES / "index.html"), ctx))
    write_text(outdir / "styles.css", render(read_text(TEMPLATES / "styles.css"), ctx))
    write_text(outdir / "app.js", render(read_text(TEMPLATES / "app.js"), ctx))
    write_text(outdir / "PROMPTS.md", render(read_text(TEMPLATES / "PROMPTS.md"), ctx))
    write_text(outdir / "deploy_github_pages.md", read_text(TEMPLATES / "deploy_github_pages.md"))
    write_text(outdir / "README.md", render(read_text(TEMPLATES / "README.md"), ctx))

    copy_file(TEMPLATES / "assets" / "README_assets.md", outdir / "assets" / "README_assets.md")
    copy_file(TEMPLATES / "assets" / "favicon.svg", outdir / "assets" / "favicon.svg")
    write_assets_placeholders(outdir)

    if args.pwa:
        write_text(outdir / "manifest.webmanifest", render(read_text(TEMPLATES / "manifest.webmanifest"), ctx))
        write_text(outdir / "sw.js", render(read_text(TEMPLATES / "sw.js"), ctx))

    return outdir

def zip_folder(folder: Path) -> Path:
    zip_path = folder.with_suffix(".zip")
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for p in folder.rglob("*"):
            if p.is_file():
                z.write(p, p.relative_to(folder))
    return zip_path

def main():
    ap = argparse.ArgumentParser(description="Generate standardized static Seed Bundles using profiles.")
    ap.add_argument("--list-profiles", action="store_true", help="List available profiles and exit.")
    ap.add_argument("--profile", default="", help="Profile name (from ./profiles).")

    ap.add_argument("--name", default="", help="Seed folder name (slugged). Required unless --list-profiles.")
    ap.add_argument("--title", default="Seed Bundle", help="Page title / theme.")
    ap.add_argument("--tagline", default="Start here.", help="Hero headline.")
    ap.add_argument("--out", default="out", help="Output directory (default: ./out)")
    ap.add_argument("--zip", action="store_true", help="Also create a zip archive.")
    ap.add_argument("--pwa", action="store_true", help="Include PWA files (manifest + sw) and Install button.")
    ap.add_argument("--force", action="store_true", help="Overwrite output folder if it exists.")

    ap.add_argument("--brand", default="", help="Brand text in navbar (default derives from title).")
    ap.add_argument("--kicker", default="A seed bundle • static-first", help="Small hero kicker line.")
    ap.add_argument("--subhead", default="A one-page experience scaffold you can reskin and ship.", help="Hero subhead paragraph.")
    ap.add_argument("--description", default="A static-first experience bundle.", help="Meta description + README top line.")
    ap.add_argument("--primary-cta", dest="primary_cta", default="Open", help="Primary CTA text.")

    ap.add_argument("--section1-title", dest="section1_title", default="Three starter insights")
    ap.add_argument("--section1-desc", dest="section1_desc", default="Tap a card to reveal the hidden note.")
    ap.add_argument("--section2-title", dest="section2_title", default="The path")
    ap.add_argument("--section2-desc", dest="section2_desc", default="Complete steps to unlock the next node.")

    ap.add_argument("--insight1-tag", dest="insight1_tag", default="Awareness")
    ap.add_argument("--insight2-tag", dest="insight2_tag", default="Synch")
    ap.add_argument("--insight3-tag", dest="insight3_tag", default="Energy")

    ap.add_argument("--insight1-head", dest="insight1_head", default="Focus creates momentum.")
    ap.add_argument("--insight1-body", dest="insight1_body", default="Write your first margin note here.")
    ap.add_argument("--insight2-head", dest="insight2_head", default="Patterns repeat for a reason.")
    ap.add_argument("--insight2-body", dest="insight2_body", default="Write your second margin note here.")
    ap.add_argument("--insight3-head", dest="insight3_head", default="Energy is information.")
    ap.add_argument("--insight3-body", dest="insight3_body", default="Write your third margin note here.")

    ap.add_argument("--step1-title", dest="step1_title", default="Step one")
    ap.add_argument("--step1-desc", dest="step1_desc", default="Describe step one.")
    ap.add_argument("--step2-title", dest="step2_title", default="Step two")
    ap.add_argument("--step2-desc", dest="step2_desc", default="Describe step two.")
    ap.add_argument("--step3-title", dest="step3_title", default="Step three")
    ap.add_argument("--step3-desc", dest="step3_desc", default="Describe step three.")

    ap.add_argument("--cta-title", dest="cta_title", default="Make it yours")
    ap.add_argument("--cta-desc", dest="cta_desc", default="Swap in art, update copy, add your content, and deploy.")
    ap.add_argument("--footer-title", dest="footer_title", default="Seed Bundle")
    ap.add_argument("--footer-desc", dest="footer_desc", default="Static-first. Reskin fast. Ship clean.")

    ap.add_argument("--quiz", dest="quiz_enabled", action="store_true", help="Enable quiz section.")
    ap.add_argument("--quiz-title", dest="quiz_title", default="Quick gate (prototype)")
    ap.add_argument("--quiz-desc", dest="quiz_desc", default="Enter comma-separated specifics you learned. Badge stored locally.")
    ap.add_argument("--quiz-pass-pct", dest="quiz_pass_pct", type=int, default=80)
    ap.add_argument("--quiz-placeholder", dest="quiz_placeholder", default="Example: tokens-first CSS, no frameworks, GitHub Pages deploy, reveal cards, progress path")
    ap.add_argument("--quiz-button", dest="quiz_button", default="Check + Earn Badge")
    ap.add_argument("--quiz-status-default", dest="quiz_status_default", default="Tip: be specific. Commas separate your answers.")

    ap.add_argument("--bg0", default="#070a0c"); ap.add_argument("--bg1", default="#0b0f12")
    ap.add_argument("--ink", default="#e9efe7"); ap.add_argument("--muted", default="#a9b6a8")
    ap.add_argument("--accent", default="#f2d48f"); ap.add_argument("--accent2", default="#ffd88a")
    ap.add_argument("--paper", default="#e9dcc2"); ap.add_argument("--paper2", default="#d4c5a7")
    ap.add_argument("--theme-color", dest="theme_color", default="#0b0c10")

    ap.add_argument("--hero-prompt", dest="hero_prompt", default="Cinematic scene, wide hero composition, no text")
    ap.add_argument("--section-bg-prompt", dest="section_bg_prompt", default="Wide background, minimal detail")
    ap.add_argument("--card-tex-prompt", dest="card_tex_prompt", default="Subtle texture, clean center")
    ap.add_argument("--footer-bg-prompt", dest="footer_bg_prompt", default="Wide footer background, minimal detail")
    ap.add_argument("--icon-ideas", dest="icon_ideas", default="compass, badge, spark")

    defaults = {a.dest: a.default for a in ap._actions if a.dest != "help"}
    args = ap.parse_args()

    if args.list_profiles:
        names = list_profiles()
        print("\n".join(names) if names else "(no profiles found)")
        return

    if not args.name:
        raise SystemExit("--name is required (unless --list-profiles)")

    if args.profile:
        prof = load_profile(args.profile)
        merge_profile_into_args(prof, args, defaults)

    outdir = build(args)
    print(f"✅ Generated: {outdir}")

    if args.zip:
        z = zip_folder(outdir)
        print(f"📦 Zipped: {z}")

if __name__ == "__main__":
    main()
