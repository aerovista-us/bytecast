# Troubleshooting
Date: 2026-02-07

## “It looks unfinished / not loading right”
Common causes:
1) Opened a minimal fallback page that only prints JSON
2) Template HTML is truncated (missing closing tags)
3) `file://` blocked `fetch()` or audio behavior

Fix:
```bash
python -m http.server 8080
```
Open: `http://localhost:8080`

## Audio not loading
- Confirm the file exists at the exact relative path
- Confirm `<source>` matches JSON `media.audio_files[0].path`
- Use http mode for best reliability
