# DEPLOY_GITHUB_PAGES — Quick Recipe

Date: 2026-02-07

This is the standard deployment path for seed bundles.

## Option A — Repo root (recommended for single-seed repo)

1. Create a new GitHub repo (public or private)
2. Upload the seed files to the repo **root**
3. In GitHub:
   - Settings → Pages
   - Build and deployment:
     - Source: Deploy from a branch
     - Branch: `main` / `(root)`
4. Your site will appear at:
   - `https://<org>.github.io/<repo>/`

## Option B — `/docs` folder (if repo contains other stuff)

1. Put seed files under `docs/`
2. Settings → Pages:
   - Branch: `main` / `/docs`

## Notes

- Keep all asset paths relative, like `assets/hero.jpg`
- Test both:
  - double click `index.html`
  - serve locally: `python -m http.server 8080`

## Custom domain (optional)

If using a custom domain, add:
- `CNAME` file with the domain name
- DNS A/AAAA/CNAME as required by GitHub Pages
