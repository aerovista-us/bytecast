# Seed Generator Manual (Python)
Date: 2026-07-06

## Goal
Generate consistent AeroVista seeds from templates with:
- Standard structure
- Options (Umami, themes, offline/dual mode)
- Predictable README + docs inclusion

## Pipeline (recommended)
1) Select template type (site seed, bytecast, etc.)
2) Apply options (e.g., Umami injection)
3) Generate README + `/docs` set
4) Validate output:
   - HTML closed (`</html>`)
   - required ids exist (template-specific)
   - referenced assets exist
5) Package zip

## Worked example (intake reference)

Full contributor pipeline seed with Learn→Do→Prove scaffolding:

- `_intake/aerovista_contributor_pipeline_seed/examples/tool_example/`

Use alongside canonical schemas in `docs/schemas/` and shared bridge files in `assets/shared/`.

## Minimum validation rules
- Template must contain closing `</html>`
- ByteCast templates must contain `#audio` + `#slides`
- JSON-driven templates must have a file fallback or run instructions for http mode
