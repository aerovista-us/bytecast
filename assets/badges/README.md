# ByteCast Badges (SVG)

These are high-definition SVG badges meant to represent skills taught through the ByteCast loop.

## Generate

```bash
node scripts/generate_badges.js
```

Outputs:
- `assets/badges/bc_badge_*.svg`
- `assets/badges/badges.json`

## Use

- As images: `<img src="assets/badges/bc_badge_listen.svg" alt="Listen badge">`
- As inline SVG: copy/paste the file content. If you inline the same badge multiple times on one page, prefer `<img>` to avoid duplicate SVG `id` collisions.
