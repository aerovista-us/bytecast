# ByteCast EP Profile — Portrait Slideshow + Multi-Audio

A static, phone-first ByteCast episode template:
- Portrait “slide show” pages (snap / swipe)
- Multiple audio files (playlist / per-slide audio)
- Works on `file://` and on static hosting (GitHub Pages)
- No build step, no dependencies

## Quick start
1) Put your audio files in `assets/audio/` (mp3/ogg/wav).
2) Put slide images in `assets/slides/` (optional).
3) Edit `episode.json` (title, description, slides, audio).
4) Open `index.html` OR run: `python -m http.server 8080` then open http://localhost:8080

## Autoplay note
Mobile browsers block autoplay until the user taps something. This template uses:
- “Tap to enable audio” (user gesture)
- then play/pause + next/prev + “play slide audio”
