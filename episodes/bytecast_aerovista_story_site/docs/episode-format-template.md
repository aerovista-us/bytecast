# ByteCast episode script format (canonical)

Use this shape for **every** voice-script episode going forward. The build (`scripts/build-site.mjs`) turns these markers into **segment cards**, **pacing chips**, **rhythm lists**, and keeps **`[STYLE]`** in the `.md` file but **hidden from HTML** and **out of generated narration audio**.

## Required top lines (metadata for the generator)

The first **two** non-empty lines must be the season/episode line and the episode title. An optional **third** line is the on-page subtitle / pull quote. **Wrap that third line in matching straight `"`…`"` or `'`…`'` or curly `""`…`""` quotes** so the build skips it as metadata (otherwise it would be treated as part of the script body).

Example (Act I, Episode 1):

```text
ACT I — EPISODE 1
Learning How Businesses Break
"Most people heard phone calls. I heard operational failure."
```

For other acts/episodes, keep the same pattern, e.g. `ACT II — EPISODE 3`, then title, then optional quoted subtitle.

After that, use the body template below (starting with `[STYLE]`).

---

## Body template (copy from `[STYLE]` down)

```text
[STYLE]
Spoken word documentary storytelling, warm ambient synths, soft piano accents, subtle electronic pulse, emotional but restrained, reflective entrepreneurial tone, futuristic undertones, intimate narration-friendly mix, modern documentary atmosphere

---

[INTRO]

Before software...

before infrastructure...

before AI...

before AeroVista...

there was a headset.

[pause]

I did not start in Silicon Valley.

I started in Idaho call centers.

And later...

Colorado.

[pause]

Most people looked at it as just a job.

I accidentally treated it like business school.

---

[SECTION: THE ROOM WHERE SYSTEMS BREAK]

Call centers are strange places.

[pause]

They look simple from the outside.

People answering phones.

People following scripts.

Managers watching numbers.

[pause]

But inside that environment...

everything is compressed.

Customer emotion

business policy

sales pressure

leadership quality

software weakness

training gaps

[pause]

Everything shows up quickly.

---

[SECTION: WHAT PRESSURE TEACHES]

At first...

I was learning the obvious things.

How to sell.

How to communicate.

How to handle objections.

How to read people quickly.

How to stay calm when someone else was emotional.

How to build trust with almost no time.

[pause]

You learn very quickly what confidence sounds like.

[pause]

You also learn what fake confidence sounds like.

---

[CORE REALIZATION]

The people doing the actual work...

often understood the problems better than the people making the decisions.

[pause]

That bothered me.

[long pause]

Companies were spending millions...

to solve problems employees had already identified for free.

---

[SECTION: THE HUMAN COST]

Then came the human side.

The part dashboards do not show cleanly.

[pause]

Layoffs.

Site closures.

Outsourcing.

Teams disappearing.

[pause]

People building routines around jobs...

that could vanish because someone...

somewhere...

changed numbers on a spreadsheet.

[long pause]

Entire buildings full of people could disappear...

because someone changed numbers on a spreadsheet.

---

[SECTION: FRAUD CHANGED EVERYTHING]

Later...

fraud prevention and compliance sharpened the picture.

[pause]

Fraud teaches you something very quickly.

Weak systems always get exploited.

[pause]

Not sometimes.

Always.

[pause]

If the process has a gap...

someone will find it.

If the control is performative...

someone will bypass it.

If the data is disconnected...

someone will use the confusion.

---

[CLOSING]

During the day...

I learned how companies break.

[pause]

At night...

I started figuring out how to build something better.

[long pause]

That is where Episode One begins.

Not with a company.

Not with a launch.

Not with a pitch deck.

[pause]

With a headset.

With pressure.

With broken systems.

And with the first uncomfortable realization...

that maybe the tools everyone depended on...

were not as permanent...

intelligent...

or reliable...

as they pretended to be.
```

## Markers reference

| Marker | Purpose |
| -------- | --------- |
| `[STYLE]` … | Suno / mix direction; **not** shown in HTML and **not** read aloud by built-in narration assembly |
| `[INTRO]` | Opening hook |
| `[SECTION: TITLE]` | Named beat; becomes its own card |
| `[CORE REALIZATION]` | Highlight beat (same card family as sections) |
| `[CLOSING]` | Landing the episode |
| `[pause]`, `[long pause]`, `[slow]`, `[whisper]`, `[emphasis]` | Pacing hints — **omitted from HTML** and **not read aloud** (author / Suno / studio timing only) |
| `---` | Section divider (inside the scroll of a segment where needed) |

Filename convention for voice scripts: include `voice` in the name (e.g. `bytecast_act_1_episode_1_voice_script.md`) so the build classifies the page as a **voice-script** with waveform hero visuals.
