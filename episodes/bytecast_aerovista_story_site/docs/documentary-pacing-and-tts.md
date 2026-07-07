# Documentary pacing & TTS (ByteCast story site)

The **build script** (`scripts/build-site.mjs`) aligns narration tone with EchoVerse Narrator:

1. **`applyDocumentaryPacingProse()`** — inserts extra newlines after commas, sentence punctuation, and ellipsis so **OpenAI `audio/speech`** and **browser read-aloud** breathe more naturally.
2. **Defaults:** `BYTECAST_TTS_SPEED` **`0.88`**, instructions emphasize cinematic documentary delivery.

Disable prose pacing with **`BYTECAST_DOC_PACING=0`**.

Favicon: **`assets/favicon.svg`**. Run **`python scripts/patch-favicon-all.py`** once if legacy `.html` files predate the favicon link.
