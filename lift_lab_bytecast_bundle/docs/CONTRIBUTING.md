# Contributing to AeroVista Lift Lab (Template)

Welcome! If you're new, you can contribute without coding.

## Fast Start
1. Pick a task in `FIRST_TASKS.md`
2. If it's docs: edit a `.md` file
3. If it's JSON-only: edit a `.json` file in `content/`
4. Open a PR with a short description and screenshots if UI

## Local Dev (for the ByteCast page)
```bash
# From lift_lab_bytecast_bundle/
python -m http.server 8090
```

Open `http://localhost:8090/site/index.html`.

GitHub Pages:
- `https://aerovista-us.github.io/bytecast/lift_lab_bytecast_bundle/site/index.html`

## PR Checklist
- [ ] I kept the change small and focused
- [ ] I tested it locally (or described how I tested)
- [ ] I added screenshots/video for UI changes
- [ ] I updated docs if behavior changed

## Code Style (If You Touch UI)
- Prefer small components
- Keep it readable
- Avoid cleverness unless it reduces complexity

## Need Help?
Open a GitHub Discussion and include:
- What you tried
- What you expected
- What happened
- Screenshot/error text
