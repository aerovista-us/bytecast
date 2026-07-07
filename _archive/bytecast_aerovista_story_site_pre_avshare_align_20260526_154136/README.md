# ByteCast AeroVista Story Build

This project now builds the local markdown library into themed HTML pages.

## What changed

* Every root-level `.md` file is converted into its own `.html` page.
* The generated pages use animated SVG hero visuals chosen from the content theme.
* Narration quality is improved with a premium TTS build path plus a browser fallback.
* Generated pages now include a top reading-progress indicator and a floating back-to-top control for long-form readability.
* `index.html` becomes a generated library landing page instead of a hand-maintained page.
* Starter-site UI patterns are supported alongside the generated layout so older pages can keep working (navigation/button/audio markup compatibility).
* The generated site theme now defaults to the starter-set cinematic palette + typography, while keeping the existing SVG motion system and chapter layout.
* Document-page nav now includes direct links back to the act hub (`act-N.html`) and the global site map.

## Build

Run:

```powershell
node scripts/build-site.mjs
```

Optional link check (especially useful while refining Acts 1-3):

```powershell
node -e "const fs=require('fs'),p=require('path');const root=process.cwd();const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));const set=new Set(files);const scope=files.filter(f=>/^act-(1|2|3)\.html$/.test(f)||/^act-(i|ii|iii)-/.test(f)||/^bytecast-act-[123]-/.test(f));let bad=[];for(const f of scope){const txt=fs.readFileSync(p.join(root,f),'utf8');for(const m of txt.matchAll(/(?:href|src)=\"([^\"]+)\"/g)){const u=m[1];if(/^(https?:|mailto:|#|data:)/i.test(u))continue;const base=u.split('#')[0].split('?')[0];if(!base)continue;if(!set.has(base))bad.push(`${f} -> ${u}`);}}if(bad.length){console.log('Broken refs:\\n'+bad.join('\\n'));process.exitCode=1;}else{console.log('No broken local refs in Acts 1-3 scope.');}"
```

This writes:

* `index.html` — regenerated each run; nav includes **Map** → `site-map.html`
* `site-map.html` — full route index (landing, hubs, Markdown outputs, stray HTML files on disk); regenerated each run
* one `.html` page per root `.md` file (output name = that file’s slug)
* optional generated audio under `audio/`

`act-1.html` … `act-8.html` are hand-maintained act overviews and are **not** emitted by the build (they appear on the site map under **Act overview hubs**).

## TTS

If `OPENAI\_API\_KEY` is available, the build script generates narration audio with:

* model: `tts-1-hd`
* voice: `onyx`
* slower pacing for a calmer documentary tone

Optional overrides:

* `BYTECAST\_TTS\_MODEL`
* `BYTECAST\_TTS\_VOICE`
* `BYTECAST\_TTS\_SPEED`
* `BYTECAST\_TTS\_FORMAT`
* `BYTECAST\_TTS\_INSTRUCTIONS`

If no API key is available, the site falls back to browser speech synthesis.

## Structured episode scripts (Markdown → HTML)

**Canonical template (copy for new episodes):** `docs/episode-format-template.md` — includes required ACT/title/subtitle lines plus the full `[STYLE]` → `[INTRO]` → sections → `[CLOSING]` pattern.

Voice-script Markdown can use **segment markers** so pages render as stacked cards instead of one wall of text. When the body contains markers such as `[INTRO]`, `[SECTION: Title]`, `[CLOSING]`, `[STYLE]`, or `[CORE REALIZATION]`, the build uses the structured parser:

* **`---`** → subtle divider inside the segment  
* **`[pause]`**, **`[long pause]`**, **`[slow]`**, **`[whisper]`**, **`[emphasis]`** → **not shown on the page**; **not spoken** by narration (timing hints for recording / Suno only; stripped from generated narration text if they appear inline)  
* **Three or more short consecutive lines** (≤3 words each, no terminal punctuation) → **rhythm list** styling  
* **`[STYLE]`** blocks → kept in the `.md` file for Suno/production notes; **omitted from narration** output and hidden in generated HTML pages

Legacy voice scripts **without** those markers keep the previous panel + paragraph layout.

## Act overview alignment

Manual `act-1.html` … `act-8.html` pages (plus `index.html` act cards and `getActInfo()` in `scripts/build-site.mjs`) follow **Updated Master Blueprint v2** (`Updated Master Blueprint v2.md`) for titles, themes, purposes, and episode lists. Episode pages themselves are unchanged until content passes editorial; mismatches between a filename and blueprint episode title are called out when shipping those episodes.

## Notes

* Generated audio is labeled in-page as AI-generated.
* The build script caches audio per page using a content signature in `audio/<slug>/meta.json`.
* Narration triggers supported:

  * `data-play-narration` (generated pages)
  * `data-read` / `data-read-target` (legacy starter pages)
