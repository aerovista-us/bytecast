/* eslint-disable no-console */
// Generates SVG badges into assets/badges/.
// Run: node scripts/generate_badges.js

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "assets", "badges");

function escAttr(s) {
  return String(s ?? "").replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function badgeSvg({ slug, label, subtitle, accent1, accent2, iconSvg }) {
  const id = `bc_${slug}`;
  const title = `${label}`;
  const desc = subtitle || "";

  // 512x512 "HD" badge; designed for dark UIs (neon + gold accents).
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512" role="img" aria-labelledby="${id}_t ${id}_d">
  <title id="${id}_t">${escAttr(title)}</title>
  <desc id="${id}_d">${escAttr(desc)}</desc>
  <defs>
    <radialGradient id="${id}_bg" cx="30%" cy="18%" r="90%">
      <stop offset="0" stop-color="#0f1623"/>
      <stop offset="0.55" stop-color="#070a10"/>
      <stop offset="1" stop-color="#050607"/>
    </radialGradient>
    <linearGradient id="${id}_rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent1}"/>
      <stop offset="0.55" stop-color="${accent2}"/>
      <stop offset="1" stop-color="#ffc45a"/>
    </linearGradient>
    <linearGradient id="${id}_plate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
    <pattern id="${id}_grid" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
      <path d="M 0 0 L 0 22" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      <path d="M 0 0 L 22 0" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
      <path d="M 11 0 L 11 22" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
    </pattern>
    <filter id="${id}_shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity="0.65"/>
    </filter>
    <filter id="${id}_glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feColorMatrix in="b" type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 0.55 0" result="g"/>
      <feMerge>
        <feMergeNode in="g"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <clipPath id="${id}_clip">
      <polygon points="256,26 424,120 424,312 256,486 88,312 88,120" />
    </clipPath>
  </defs>

  <rect x="0" y="0" width="512" height="512" fill="url(#${id}_bg)"/>

  <!-- Outer rim -->
  <g filter="url(#${id}_shadow)">
    <polygon points="256,26 424,120 424,312 256,486 88,312 88,120"
      fill="rgba(0,0,0,0.25)" stroke="url(#${id}_rim)" stroke-width="10" stroke-linejoin="round"/>
  </g>

  <!-- Inner plate -->
  <g clip-path="url(#${id}_clip)">
    <polygon points="256,50 404,130 404,304 256,454 108,304 108,130"
      fill="url(#${id}_plate)" stroke="rgba(255,255,255,0.14)" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="256,50 404,130 404,304 256,454 108,304 108,130" fill="url(#${id}_grid)" opacity="0.65"/>
    <circle cx="118" cy="118" r="160" fill="${accent1}" opacity="0.05"/>
    <circle cx="420" cy="170" r="210" fill="${accent2}" opacity="0.045"/>
    <circle cx="256" cy="420" r="180" fill="#ffc45a" opacity="0.03"/>
  </g>

  <!-- Top gem -->
  <g filter="url(#${id}_glow)">
    <circle cx="256" cy="78" r="7.5" fill="#ffc45a" opacity="0.95"/>
    <circle cx="256" cy="78" r="3" fill="rgba(0,0,0,0.35)"/>
  </g>

  <!-- Emblem -->
  <g transform="translate(256 246)" filter="url(#${id}_glow)">
    ${iconSvg}
  </g>

  <!-- Ribbon -->
  <g>
    <path d="M132 344 C 170 336, 204 332, 256 332 C 308 332, 342 336, 380 344 L 402 392 C 360 382, 320 376, 256 376 C 192 376, 152 382, 110 392 Z"
      fill="rgba(0,0,0,0.34)" stroke="rgba(255,255,255,0.14)" stroke-width="2" />
    <path d="M138 350 C 174 342, 206 338, 256 338 C 306 338, 338 342, 374 350"
      fill="none" stroke="url(#${id}_rim)" stroke-width="3" opacity="0.9" stroke-linecap="round"/>
    <text x="256" y="372" text-anchor="middle"
      style="font: 900 15px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; letter-spacing: .10em; fill: rgba(255,255,255,0.92);">
      ${escAttr(String(label).toUpperCase())}
    </text>
  </g>

  <!-- Micro detail corners -->
  <g opacity="0.85">
    <path d="M110 146 L96 138" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-linecap="round"/>
    <path d="M402 146 L416 138" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-linecap="round"/>
    <path d="M110 292 L96 300" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-linecap="round"/>
    <path d="M402 292 L416 300" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>
`;
}

const BADGES = [
  {
    slug: "initiate",
    label: "Initiate",
    subtitle: "Complete the Golden Path",
    accent1: "#22a7ff",
    accent2: "#ffc45a",
    iconSvg: `
      <g>
        <path d="M-58 6 L-42 -34 L-16 -10 L0 -44 L16 -10 L42 -34 L58 6 L38 8 L34 40 L-34 40 L-38 8 Z"
          fill="rgba(255,255,255,0.06)" stroke="url(#bc_initiate_rim)" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-34 40 L-28 64 L0 74 L28 64 L34 40"
          fill="rgba(255,196,90,0.10)" stroke="rgba(255,196,90,0.55)" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="0" cy="-6" r="10" fill="#ffc45a" opacity="0.95"/>
        <path d="M-44 20 L-26 6 L-10 18 L0 6 L10 18 L26 6 L44 20"
          fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "listen",
    label: "Listen",
    subtitle: "Audio fundamentals + completion proof",
    accent1: "#22a7ff",
    accent2: "#0be1ff",
    iconSvg: `
      <g>
        <path d="M-58 10 C-58 -28, -30 -56, 0 -56 C 30 -56, 58 -28, 58 10"
          fill="none" stroke="url(#bc_listen_rim)" stroke-width="6" stroke-linecap="round"/>
        <rect x="-62" y="10" width="26" height="48" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(34,167,255,0.55)" stroke-width="3"/>
        <rect x="36" y="10" width="26" height="48" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(11,225,255,0.55)" stroke-width="3"/>
        <path d="M-28 60 C-10 74, 10 74, 28 60" fill="none" stroke="rgba(255,196,90,0.55)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-6 2 L-6 30 M6 2 L6 30" stroke="rgba(255,255,255,0.22)" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "slides",
    label: "Slides",
    subtitle: "Additive learning navigation + clarity",
    accent1: "#a66bff",
    accent2: "#22a7ff",
    iconSvg: `
      <g>
        <rect x="-60" y="-44" width="120" height="84" rx="14" fill="rgba(255,255,255,0.04)" stroke="url(#bc_slides_rim)" stroke-width="4"/>
        <rect x="-48" y="-34" width="96" height="10" rx="5" fill="rgba(255,255,255,0.14)"/>
        <rect x="-48" y="-16" width="70" height="8" rx="4" fill="rgba(255,255,255,0.10)"/>
        <path d="M-60 42 L-42 58 L60 58 L60 42" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
        <path d="M-12 58 L0 72 L12 58" fill="none" stroke="rgba(255,196,90,0.65)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`,
  },
  {
    slug: "engage",
    label: "Engage",
    subtitle: "Quests + quizzes + confirmations",
    accent1: "#ff6a2a",
    accent2: "#ffc45a",
    iconSvg: `
      <g>
        <path d="M-6 -62 L 10 -20 L 54 -20 L 16 6 L 32 48 L -6 22 L -44 48 L -28 6 L -66 -20 L -22 -20 Z"
          fill="rgba(255,255,255,0.05)" stroke="url(#bc_engage_rim)" stroke-width="4" stroke-linejoin="round"/>
        <rect x="-58" y="26" width="58" height="48" rx="12" fill="rgba(0,0,0,0.20)" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
        <path d="M-44 50 L-34 60 L-18 42" fill="none" stroke="rgba(255,196,90,0.85)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 38 H56" stroke="rgba(255,255,255,0.16)" stroke-width="3" stroke-linecap="round"/>
        <path d="M10 52 H46" stroke="rgba(255,255,255,0.16)" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "missions",
    label: "Missions",
    subtitle: "Training checkpoints and skill unlocks",
    accent1: "#22a7ff",
    accent2: "#a66bff",
    iconSvg: `
      <g>
        <circle cx="0" cy="-4" r="44" fill="rgba(0,0,0,0.22)" stroke="url(#bc_missions_rim)" stroke-width="4"/>
        <circle cx="0" cy="-4" r="26" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
        <path d="M0 -30 L6 -10 L26 -10 L10 2 L16 22 L0 10 L-16 22 L-10 2 L-26 -10 L-6 -10 Z"
          fill="rgba(255,196,90,0.12)" stroke="rgba(255,196,90,0.75)" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-8 44 V76" stroke="rgba(255,255,255,0.18)" stroke-width="4" stroke-linecap="round"/>
        <path d="M-8 44 H44 L34 58 H-8 Z" fill="rgba(0,0,0,0.22)" stroke="rgba(34,167,255,0.45)" stroke-width="2" stroke-linejoin="round"/>
      </g>`,
  },
  {
    slug: "seed_export",
    label: "Seed Export",
    subtitle: "Ship a runnable artifact with proof",
    accent1: "#00e5a8",
    accent2: "#22a7ff",
    iconSvg: `
      <g>
        <path d="M0 -58 C 28 -58, 46 -36, 46 -12 C 46 22, 22 46, 0 64 C -22 46, -46 22, -46 -12 C -46 -36, -28 -58, 0 -58 Z"
          fill="rgba(255,255,255,0.05)" stroke="url(#bc_seed_export_rim)" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-10 -8 C-26 -22, -22 -44, -4 -44 C 10 -44, 14 -32, 8 -22"
          fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-6 0 C-22 4, -30 16, -30 30 C-30 50, -12 64, 0 70"
          fill="none" stroke="rgba(0,229,168,0.75)" stroke-width="4" stroke-linecap="round"/>
        <path d="M6 6 C 26 10, 34 22, 34 34 C34 52, 18 64, 0 72"
          fill="none" stroke="rgba(34,167,255,0.75)" stroke-width="4" stroke-linecap="round"/>
        <rect x="-34" y="14" width="68" height="44" rx="12" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
        <path d="M-10 32 H10" stroke="rgba(255,196,90,0.85)" stroke-width="4" stroke-linecap="round"/>
        <path d="M0 22 V42" stroke="rgba(255,196,90,0.85)" stroke-width="4" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "publish",
    label: "Publish",
    subtitle: "Share a URL and complete the loop",
    accent1: "#ffc45a",
    accent2: "#ff6a2a",
    iconSvg: `
      <g>
        <path d="M-54 52 L 6 -8 L 22 8 L -38 68 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
        <path d="M 6 -8 L 54 -56 L 68 -42 L 22 8 Z" fill="rgba(255,196,90,0.16)" stroke="url(#bc_publish_rim)" stroke-width="4" stroke-linejoin="round"/>
        <path d="M54 -56 L64 -78 L78 -64 L68 -42" fill="rgba(255,106,42,0.22)" stroke="rgba(255,106,42,0.75)" stroke-width="3" stroke-linejoin="round"/>
        <path d="M-22 -14 C -8 -30, 10 -30, 24 -14" fill="none" stroke="rgba(34,167,255,0.65)" stroke-width="4" stroke-linecap="round"/>
        <path d="M-22 -14 C -8 2, 10 2, 24 -14" fill="none" stroke="rgba(166,107,255,0.40)" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "registry",
    label: "Registry",
    subtitle: "Add episodes safely and keep canon clean",
    accent1: "#a66bff",
    accent2: "#ffc45a",
    iconSvg: `
      <g>
        <path d="M-54 -52 H38 C52 -52, 62 -42, 62 -28 V52 C62 66, 52 76, 38 76 H-54 Z"
          fill="rgba(0,0,0,0.22)" stroke="url(#bc_registry_rim)" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-40 -36 H26" stroke="rgba(255,255,255,0.18)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-40 -18 H10" stroke="rgba(255,255,255,0.16)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-40 0 H20" stroke="rgba(255,255,255,0.14)" stroke-width="3" stroke-linecap="round"/>
        <path d="M46 -52 V76" stroke="rgba(255,196,90,0.35)" stroke-width="5"/>
        <circle cx="46" cy="18" r="8" fill="rgba(255,196,90,0.85)"/>
        <path d="M44 18 L46 20 L50 14" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`,
  },
  {
    slug: "modules",
    label: "Modules",
    subtitle: "Build router modules without breaking links",
    accent1: "#22a7ff",
    accent2: "#00e5a8",
    iconSvg: `
      <g>
        <path d="M-60 -14 h26 l10 -18 h48 l10 18 h26 v44 h-26 l-10 18 h-48 l-10 -18 h-26 z"
          fill="rgba(255,255,255,0.05)" stroke="url(#bc_modules_rim)" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-30 12 h60" stroke="rgba(255,255,255,0.14)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="-26" cy="12" r="5" fill="rgba(255,196,90,0.9)"/>
        <circle cx="0" cy="12" r="5" fill="rgba(34,167,255,0.9)"/>
        <circle cx="26" cy="12" r="5" fill="rgba(0,229,168,0.9)"/>
        <path d="M-8 -62 V-32" stroke="rgba(255,255,255,0.22)" stroke-width="4" stroke-linecap="round"/>
        <path d="M-8 -62 L-22 -46" stroke="rgba(255,255,255,0.18)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-8 -62 L6 -46" stroke="rgba(255,255,255,0.18)" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "docs",
    label: "Docs",
    subtitle: "Write docs that reduce drift",
    accent1: "#ffc45a",
    accent2: "#22a7ff",
    iconSvg: `
      <g>
        <path d="M-58 -56 H32 C48 -56, 60 -44, 60 -28 V58 C60 74, 48 86, 32 86 H-58 Z"
          fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" stroke-width="2" />
        <path d="M-40 -36 H22" stroke="rgba(255,255,255,0.16)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-40 -18 H10" stroke="rgba(255,255,255,0.14)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-40 0 H18" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-10 26 L38 -22" stroke="url(#bc_docs_rim)" stroke-width="6" stroke-linecap="round"/>
        <path d="M32 -28 L46 -14 L40 -8 L26 -22 Z" fill="rgba(255,196,90,0.22)" stroke="rgba(255,196,90,0.65)" stroke-width="2"/>
        <path d="M-18 34 L-2 50" stroke="rgba(0,229,168,0.55)" stroke-width="4" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "analytics",
    label: "Analytics",
    subtitle: "Instrument the funnel with clean events",
    accent1: "#00e5a8",
    accent2: "#a66bff",
    iconSvg: `
      <g>
        <path d="M-62 62 V-44" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-62 62 H62" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-52 40 L-22 10 L0 24 L34 -10 L54 0" fill="none" stroke="url(#bc_analytics_rim)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="-52" cy="40" r="7" fill="rgba(255,196,90,0.9)"/>
        <circle cx="-22" cy="10" r="7" fill="rgba(34,167,255,0.9)"/>
        <circle cx="0" cy="24" r="7" fill="rgba(0,229,168,0.9)"/>
        <circle cx="34" cy="-10" r="7" fill="rgba(166,107,255,0.9)"/>
        <circle cx="54" cy="0" r="7" fill="rgba(255,106,42,0.9)"/>
        <path d="M-30 -44 H26" stroke="rgba(255,255,255,0.10)" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "qa",
    label: "QA",
    subtitle: "Validate, gate, and prevent regressions",
    accent1: "#22a7ff",
    accent2: "#ff6a2a",
    iconSvg: `
      <g>
        <path d="M0 -72 L58 -46 V2 C58 40 30 68 0 86 C-30 68 -58 40 -58 2 V-46 Z"
          fill="rgba(0,0,0,0.22)" stroke="url(#bc_qa_rim)" stroke-width="4" stroke-linejoin="round"/>
        <path d="M-26 6 L-6 26 L30 -10" fill="none" stroke="rgba(255,196,90,0.95)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M-28 -30 H28" stroke="rgba(255,255,255,0.16)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-34 -16 H12" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "a11y",
    label: "A11Y",
    subtitle: "Accessibility, contrast, keyboard nav",
    accent1: "#a66bff",
    accent2: "#00e5a8",
    iconSvg: `
      <g>
        <circle cx="0" cy="-42" r="14" fill="rgba(255,196,90,0.85)"/>
        <path d="M-60 -16 H60" stroke="url(#bc_a11y_rim)" stroke-width="6" stroke-linecap="round"/>
        <path d="M0 -26 V58" stroke="rgba(255,255,255,0.22)" stroke-width="6" stroke-linecap="round"/>
        <path d="M0 8 L-36 36" stroke="rgba(255,255,255,0.18)" stroke-width="6" stroke-linecap="round"/>
        <path d="M0 8 L36 36" stroke="rgba(255,255,255,0.18)" stroke-width="6" stroke-linecap="round"/>
        <path d="M0 58 L-18 86" stroke="rgba(255,255,255,0.14)" stroke-width="6" stroke-linecap="round"/>
        <path d="M0 58 L18 86" stroke="rgba(255,255,255,0.14)" stroke-width="6" stroke-linecap="round"/>
      </g>`,
  },
  {
    slug: "audio",
    label: "Audio",
    subtitle: "Mixing, editing, and track readiness",
    accent1: "#0be1ff",
    accent2: "#a66bff",
    iconSvg: `
      <g>
        <path d="M-58 34 C-42 10, -32 0, -16 0 C-2 0, 2 18, 14 18 C 28 18, 32 -18, 44 -18 C 52 -18, 58 -2, 58 6"
          fill="none" stroke="url(#bc_audio_rim)" stroke-width="6" stroke-linecap="round"/>
        <rect x="-56" y="-52" width="112" height="68" rx="16" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
        <path d="M-34 -18 H34" stroke="rgba(255,255,255,0.14)" stroke-width="3" stroke-linecap="round"/>
        <path d="M-34 -6 H22" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="-38" cy="-34" r="6" fill="rgba(255,196,90,0.9)"/>
        <circle cx="-20" cy="-34" r="6" fill="rgba(34,167,255,0.9)"/>
        <circle cx="-2" cy="-34" r="6" fill="rgba(166,107,255,0.9)"/>
      </g>`,
  },
  {
    slug: "automation",
    label: "Automation",
    subtitle: "Repeatable tooling and generators",
    accent1: "#00e5a8",
    accent2: "#ffc45a",
    iconSvg: `
      <g>
        <path d="M0 -70 L14 -52 L36 -56 L42 -34 L62 -22 L52 -4 L62 14 L42 26 L36 48 L14 44 L0 62 L-14 44 L-36 48 L-42 26 L-62 14 L-52 -4 L-62 -22 L-42 -34 L-36 -56 L-14 -52 Z"
          fill="rgba(255,255,255,0.04)" stroke="url(#bc_automation_rim)" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="0" cy="-4" r="18" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
        <path d="M-10 -6 L-2 2 L12 -12" fill="none" stroke="rgba(34,167,255,0.85)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M-46 70 H46" stroke="rgba(255,255,255,0.10)" stroke-width="3" stroke-linecap="round"/>
      </g>`,
  },
];

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = [];

  for (const b of BADGES) {
    const slug = slugify(b.slug);
    const file = `bc_badge_${slug}.svg`;
    const svg = badgeSvg({
      slug,
      label: b.label,
      subtitle: b.subtitle,
      accent1: b.accent1,
      accent2: b.accent2,
      iconSvg: b.iconSvg,
    });
    fs.writeFileSync(path.join(OUT_DIR, file), svg, "utf8");
    manifest.push({
      id: slug,
      label: b.label,
      subtitle: b.subtitle,
      file,
      accents: { a1: b.accent1, a2: b.accent2 },
    });
  }

  fs.writeFileSync(path.join(OUT_DIR, "badges.json"), JSON.stringify({ schema: "bytecast-badges-v1", badges: manifest }, null, 2) + "\n", "utf8");
  console.log(`Generated ${manifest.length} badges in ${OUT_DIR}`);
}

main();

