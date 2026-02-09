#!/usr/bin/env python3
"""AV SeedGen — generate standardized static seed bundles.

Usage:
  python seedgen.py --name my_drop --title "My Drop" --tagline "A vibe." [--pwa] [--zip]

Notes:
- Outputs to ./out/<name> by default.
- All templates are in ./templates and rendered with simple {PLACEHOLDER} replacement.
"""

from __future__ import annotations
import argparse, os, re, json, zipfile
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).parent
TEMPLATES = HERE / "templates"

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
    # Plain {KEY} replacement — intentionally simple & robust.
    out = template
    for k, v in ctx.items():
        out = out.replace("{" + k + "}", v)
    return out

def make_default_ctx(args) -> dict[str, str]:
    # Defaults geared toward the “celestine” style, but safe for anything.
    date = datetime.now().strftime("%Y-%m-%d %H:%M")
    seed = slugify(args.name)

    brand = args.brand or args.title.split("•")[0].strip() if "•" in args.title else args.title.split("|")[0].strip()

    ctx = {
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

        # Theme tokens
        "BG0": args.bg0,
        "BG1": args.bg1,
        "INK": args.ink,
        "MUTED": args.muted,
        "ACCENT": args.accent,
        "ACCENT2": args.accent2,
        "PAPER": args.paper,
        "PAPER2": args.paper2,
        "THEME_COLOR": args.theme_color,

        # Prompts
        "HERO_PROMPT": args.hero_prompt,
        "SECTION_BG_PROMPT": args.section_bg_prompt,
        "CARD_TEX_PROMPT": args.card_tex_prompt,
        "FOOTER_BG_PROMPT": args.footer_bg_prompt,
        "ICON_IDEAS": args.icon_ideas,

        "DATE": date,
        "CACHE_NAME": f"{seed}-v1",
    }
    return ctx

def write_assets_placeholders(outdir: Path) -> None:
    # Create simple placeholder jpg/png without dependencies by writing tiny valid files:
    # We'll ship "empty" placeholder text files as a safe default, user replaces with real images.
    # If you want auto-generated images, we can add PIL later (optional).
    assets = outdir / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    # Required placeholders
    (assets / "hero.jpg").write_bytes(b"")      # user replaces
    (assets / "paper.jpg").write_bytes(b"")     # user replaces
    # Optional icons
    (assets / "icon-192.png").write_bytes(b"")
    (assets / "icon-512.png").write_bytes(b"")

def build(args) -> Path:
    seed = slugify(args.name)
    outroot = Path(args.out).resolve()
    outdir = outroot / seed
    if outdir.exists() and not args.force:
        raise SystemExit(f"Output folder exists: {outdir} (use --force to overwrite)")

    if outdir.exists():
        # wipe
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

    ctx = make_default_ctx(args)

    # index.html — conditionally include PWA links/buttons
    if args.pwa:
        ctx["PWA_LINKS"] = '<link rel="manifest" href="manifest.webmanifest" />'
        ctx["INSTALL_BUTTON"] = '<button class="btn btn--ghost" id="installBtn" type="button" hidden>Install</button>'
    else:
        ctx["PWA_LINKS"] = ""
        ctx["INSTALL_BUTTON"] = ""

    # Render main files
    write_text(outdir / "index.html", render(read_text(TEMPLATES / "index.html"), ctx))
    write_text(outdir / "styles.css", render(read_text(TEMPLATES / "styles.css"), ctx))
    write_text(outdir / "app.js", render(read_text(TEMPLATES / "app.js"), ctx))

    write_text(outdir / "PROMPTS.md", render(read_text(TEMPLATES / "PROMPTS.md"), ctx))
    write_text(outdir / "deploy_github_pages.md", read_text(TEMPLATES / "deploy_github_pages.md"))
    write_text(outdir / "README.md", render(read_text(TEMPLATES / "README.md"), ctx))

    # Assets folder
    copy_file(TEMPLATES / "assets" / "README_assets.md", outdir / "assets" / "README_assets.md")
    copy_file(TEMPLATES / "assets" / "favicon.svg", outdir / "assets" / "favicon.svg")
    write_assets_placeholders(outdir)

    # Optional PWA
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
    ap = argparse.ArgumentParser(description="Generate a standardized static Seed Bundle.")
    ap.add_argument("--name", required=True, help="Seed folder name (slugged).")
    ap.add_argument("--title", required=True, help="Page title / H1 theme.")
    ap.add_argument("--tagline", required=True, help="Hero headline.")
    ap.add_argument("--out", default="out", help="Output directory (default: ./out)")
    ap.add_argument("--zip", action="store_true", help="Also create a zip archive.")
    ap.add_argument("--pwa", action="store_true", help="Include PWA files (manifest + sw) and Install button.")
    ap.add_argument("--force", action="store_true", help="Overwrite output folder if it exists.")

    # Branding + copy
    ap.add_argument("--brand", default="", help="Brand text in navbar (default derives from title).")
    ap.add_argument("--kicker", default="Rain • Ruins • Manuscript • Synchronicity", help="Small hero kicker line.")
    ap.add_argument("--subhead", default="A quiet field-manual experience — the world teaches through patterns: signals that keep appearing until you finally see them.",
                    help="Hero subhead paragraph.")
    ap.add_argument("--description", default="A static-first experience bundle.", help="Meta description + README top line.")
    ap.add_argument("--primary-cta", dest="primary_cta", default="Open the first page", help="Primary CTA text.")

    # Sections
    ap.add_argument("--section1-title", dest="section1_title", default="Three starter insights")
    ap.add_argument("--section1-desc", dest="section1_desc", default="Tap a card to reveal the hidden note. Each one is a page turn.")
    ap.add_argument("--section2-title", dest="section2_title", default="The path")
    ap.add_argument("--section2-desc", dest="section2_desc", default="Complete steps to unlock the next node. Extend this into quests.")

    # Insights
    ap.add_argument("--insight1-head", dest="insight1_head", default="What you focus on grows.")
    ap.add_argument("--insight1-body", dest="insight1_body", default="Your attention is a lantern. Shine it on the signal — not the noise — and your next step becomes obvious.")
    ap.add_argument("--insight2-head", dest="insight2_head", default="Patterns are invitations.")
    ap.add_argument("--insight2-body", dest="insight2_body", default="Coincidences repeat when you're meant to move. Treat them like trail markers — gentle, persistent, specific.")
    ap.add_argument("--insight3-head", dest="insight3_head", default="Everything carries a current.")
    ap.add_argument("--insight3-body", dest="insight3_body", default="When you calm your body, you can sense the room. The threads feel like warmth, breath, and momentum — not fireworks.")

    # Steps
    ap.add_argument("--step1-title", dest="step1_title", default="Enter the canopy")
    ap.add_argument("--step1-desc", dest="step1_desc", default="Take 10 seconds. Breathe slow. Look for what repeats.")
    ap.add_argument("--step2-title", dest="step2_title", default="Find the marker")
    ap.add_argument("--step2-desc", dest="step2_desc", default="Write down the last coincidence you ignored. What did it point at?")
    ap.add_argument("--step3-title", dest="step3_title", default="Follow the thread")
    ap.add_argument("--step3-desc", dest="step3_desc", default="Choose one small action that honors the signal. Make it real.")

    # CTA + footer
    ap.add_argument("--cta-title", dest="cta_title", default="Turn this into your full experience")
    ap.add_argument("--cta-desc", dest="cta_desc", default="Swap in your hero art, add music, expand the path into quests. Keep it light: mystery + warmth + momentum.")
    ap.add_argument("--footer-title", dest="footer_title", default="Seed Bundle")
    ap.add_argument("--footer-desc", dest="footer_desc", default="Built as a static bundle. Replace assets. Extend the quests. Ship it.")

    # Theme tokens
    ap.add_argument("--bg0", default="#070a0c")
    ap.add_argument("--bg1", default="#0b0f12")
    ap.add_argument("--ink", default="#e9efe7")
    ap.add_argument("--muted", default="#a9b6a8")
    ap.add_argument("--accent", default="#f2d48f")
    ap.add_argument("--accent2", default="#ffd88a")
    ap.add_argument("--paper", default="#e9dcc2")
    ap.add_argument("--paper2", default="#d4c5a7")
    ap.add_argument("--theme-color", dest="theme_color", default="#0b0c10")

    # Prompts
    ap.add_argument("--hero-prompt", dest="hero_prompt",
                    default="Cinematic rainforest ruins, ancient stone doorway covered in vines and moss, misty atmosphere, volumetric sunbeams, subtle golden energy threads floating in the air like visible intuition, magical realism, high detail, soft film grain, no modern objects, wide composition for website hero, serene and mysterious")
    ap.add_argument("--section-bg-prompt", dest="section_bg_prompt",
                    default="Misty rainforest canopy with soft sunbeams, faint paper grain overlay, extremely subtle carved glyph pattern watermark, minimal detail, calm atmosphere, wide web background, no focal subject")
    ap.add_argument("--card-tex-prompt", dest="card_tex_prompt",
                    default="Aged parchment texture with faint hand-drawn map lines, subtle moss stain at edges, soft vignette, warm sepia tone, clean center space for text, high resolution")
    ap.add_argument("--footer-bg-prompt", dest="footer_bg_prompt",
                    default="Twilight jungle silhouettes with distant ruin shapes barely visible, fog layers, tiny golden energy threads drifting, dark emerald palette, cinematic minimal detail, wide background")
    ap.add_argument("--icon-ideas", dest="icon_ideas",
                    default="compass, torn page, leaf sprig, rune stone, sunbeam rays, footpath marker, candle flame, insight eye")

    args = ap.parse_args()

    outdir = build(args)
    print(f"✅ Generated: {outdir}")

    if args.zip:
        z = zip_folder(outdir)
        print(f"📦 Zipped: {z}")

if __name__ == "__main__":
    main()
