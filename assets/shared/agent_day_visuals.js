/**
 * Animated SVG visuals for Agent Day journey segments.
 * Pattern matches contributor_onboarding_slide_art.js — inline SVG, SMIL animations.
 */
(function (global) {
  "use strict";

  const vb = 'viewBox="0 0 400 240" width="100%" height="auto" role="img"';

  const day1 = {
    cold_open: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="The first door">
      <defs><linearGradient id="d1glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22a7ff"/><stop offset="100%" stop-color="#a66bff"/></linearGradient></defs>
      <rect x="148" y="48" width="104" height="144" rx="8" fill="rgba(34,167,255,0.08)" stroke="url(#d1glow)" stroke-width="2.5"/>
      <path d="M200 48 L200 192" stroke="rgba(255,255,255,0.35)" stroke-width="3"/>
      <circle cx="200" cy="118" r="10" fill="#22a7ff"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/></circle>
      <path d="M120 118 Q160 88 200 118 Q240 148 280 118" fill="none" stroke="#a66bff" stroke-width="2" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" from="0" to="22" dur="2.2s" repeatCount="indefinite"/></path>
      <text x="200" y="28" text-anchor="middle" fill="#22a7ff" font-size="11" font-weight="700" letter-spacing="0.12em">FIRST DOOR</text>
    </svg>`,

    world: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="AeroVista ecosystem">
      <circle cx="200" cy="120" r="36" fill="rgba(34,167,255,0.14)" stroke="#22a7ff" stroke-width="2"/>
      <text x="200" y="125" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">HQ</text>
      ${[
        ["Nexus", 72, 64, "#60a5fa"],
        ["Echo", 328, 64, "#a78bfa"],
        ["SkyForge", 56, 168, "#34d399"],
        ["Lumina", 344, 168, "#fbbf24"],
        ["Vespera", 120, 200, "#f472b6"],
        ["Horizon", 280, 200, "#22d3ee"],
        ["Summit", 200, 52, "#a3e635"]
      ]
        .map(
          ([t, x, y, c], i) =>
            `<g><line x1="200" y1="120" x2="${x}" y2="${y}" stroke="${c}" stroke-opacity="0.35" stroke-dasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="18" dur="${2 + i * 0.15}s" repeatCount="indefinite"/></line><circle cx="${x}" cy="${y}" r="22" fill="rgba(255,255,255,0.04)" stroke="${c}"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff" font-size="7" font-weight="700">${t}</text></g>`
        )
        .join("")}
    </svg>`,

    culture: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Culture code pillars">
      ${[
        ["Align", 64, 100],
        ["Reuse", 148, 72],
        ["Transparent", 252, 72],
        ["Excellence", 336, 100],
        ["Evidence", 200, 168]
      ]
        .map(
          ([t, x, y], i) =>
            `<g transform="translate(${x - 36},${y - 28})"><rect width="72" height="56" rx="12" fill="rgba(34,167,255,${0.06 + i * 0.02})" stroke="#22a7ff" stroke-opacity="${0.35 + i * 0.1}"/><text x="36" y="32" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">${t}</text><animateTransform attributeName="transform" type="translate" values="${x - 36},${y - 28};${x - 36},${y - 32};${x - 36},${y - 28}" dur="${2.2 + i * 0.2}s" repeatCount="indefinite"/></g>`
        )
        .join("")}
      <circle cx="200" cy="120" r="52" fill="none" stroke="rgba(166,107,255,0.25)" stroke-width="1.5" stroke-dasharray="6 5"><animateTransform attributeName="transform" type="rotate" from="0 200 120" to="360 200 120" dur="18s" repeatCount="indefinite"/></circle>
    </svg>`,

    doors: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Seven main doors">
      <circle cx="200" cy="120" r="78" fill="none" stroke="rgba(34,167,255,0.2)" stroke-width="1.5"/>
      ${[
        ["AVCC", 200, 42],
        ["NXCore", 318, 88],
        ["Memory", 318, 152],
        ["Drives", 200, 198],
        ["ByteCast", 82, 152],
        ["Art", 82, 88],
        ["Registry", 200, 120]
      ]
        .map(
          ([t, x, y], i) =>
            `<g><rect x="${x - 28}" y="${y - 14}" width="56" height="28" rx="999" fill="rgba(166,107,255,0.12)" stroke="#a66bff"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff" font-size="${t === "Registry" ? 7 : 8}" font-weight="700">${t}</text><animate attributeName="opacity" values="0.7;1;0.7" dur="${2 + i * 0.18}s" repeatCount="indefinite"/></g>`
        )
        .join("")}
    </svg>`,

    operating_law: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Operating law spine">
      <path d="M72 48 V192" stroke="rgba(34,167,255,0.35)" stroke-width="3"/>
      ${[
        "SOT",
        "Ask",
        "Rails",
        "Slice",
        "Escalate",
        "Evidence"
      ]
        .map(
          (t, i) =>
            `<g transform="translate(88,${52 + i * 28})"><circle cx="0" cy="10" r="8" fill="#22a7ff"><animate attributeName="r" values="6;9;6" dur="${2 + i * 0.2}s" repeatCount="indefinite"/></circle><rect x="16" y="0" width="220" height="22" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(34,167,255,0.35)"/><text x="28" y="15" fill="#fff" font-size="9" font-weight="700">${t}</text></g>`
        )
        .join("")}
    </svg>`,

    lost_protocol: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Lost agent protocol">
      ${["STOP", "NAME", "DOOR", "ASK", "NOTE"]
        .map(
          (t, i) =>
            `<g transform="translate(${48 + i * 64},${88 + (i % 2) * 24})"><rect width="52" height="40" rx="10" fill="rgba(255,176,32,0.1)" stroke="#ffb020"/><text x="26" y="25" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">${t}</text></g>`
        )
        .join("")}
      <path d="M74 108 H326" stroke="#ffb020" stroke-width="2" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite"/></path>
      <text x="200" y="200" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">Surface uncertainty — do not expand fog</text>
    </svg>`,

    legal: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Trust boundary">
      <path d="M200 44 L268 78 V132 Q268 188 200 208 Q132 188 132 132 V78 Z" fill="rgba(34,167,255,0.1)" stroke="#22a7ff" stroke-width="2.5"/>
      <path d="M176 118 L192 134 L228 98" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <rect x="56" y="72" width="72" height="96" rx="10" fill="rgba(244,114,182,0.08)" stroke="#f472b6" stroke-dasharray="4 4"/>
      <rect x="272" y="72" width="72" height="96" rx="10" fill="rgba(244,114,182,0.08)" stroke="#f472b6" stroke-dasharray="4 4"/>
      <text x="92" y="128" text-anchor="middle" fill="#f472b6" font-size="8">PRIVATE</text>
      <text x="308" y="128" text-anchor="middle" fill="#f472b6" font-size="8">PUBLIC</text>
    </svg>`,

    checklist: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Day 1 checklist">
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `<g transform="translate(88,${56 + i * 36})"><circle cx="10" cy="10" r="9" fill="none" stroke="#34d399" stroke-width="2"><animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="${1.8 + i * 0.25}s" repeatCount="indefinite"/></circle><path d="M5 10 L8 13 L15 6" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"/><rect x="28" y="0" width="220" height="22" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)"/></g>`
        )
        .join("")}
      <rect x="120" y="188" width="160" height="32" rx="10" fill="rgba(34,167,255,0.12)" stroke="#22a7ff"/><text x="200" y="208" text-anchor="middle" fill="#fff" font-size="9" font-weight="700">EOD CAPSULE</text>
    </svg>`,

    closing: `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Welcome aboard">
      <circle cx="200" cy="110" r="64" fill="none" stroke="rgba(34,167,255,0.25)" stroke-width="2" stroke-dasharray="8 6"><animateTransform attributeName="transform" type="rotate" from="0 200 110" to="360 200 110" dur="16s" repeatCount="indefinite"/></circle>
      <path d="M140 130 Q200 60 260 130" fill="none" stroke="#a66bff" stroke-width="2.5"><animate attributeName="d" values="M140 130 Q200 60 260 130;M140 130 Q200 80 260 130;M140 130 Q200 60 260 130" dur="3s" repeatCount="indefinite"/></path>
      <text x="200" y="200" text-anchor="middle" fill="#22a7ff" font-size="11" font-weight="700">Where vision takes flight</text>
    </svg>`
  };

  const highlights = {
    cold_open: "You are entering a working ecosystem — learn terrain before memorizing buttons.",
    world: "One business, many specialized lanes — each division strengthens the platform.",
    culture: "Reduce confusion: alignment, transparency, and evidence over impressive guessing.",
    doors: "Seven operational doors — route to the right layer before you thrash.",
    operating_law: "Source of truth first, name the state, finish slices, leave a trail.",
    lost_protocol: "When lost: stop expanding, name the unknown, route to the right door.",
    legal: "Trust is infrastructure — protect access, cite sources, escalate exposure.",
    checklist: "Identify lane, SOT, state, one next action, and your first EOD Capsule.",
    closing: "Help the system think, remember, decide, build — leave evidence behind."
  };

  const microChecks = {
    culture: {
      q: "Which value is part of the AeroVista culture code?",
      choices: ["Speed over alignment", "Evidence over vibe", "Politics over transparency"],
      answer: 1,
      explain: "Evidence over vibe — strong opinions welcome, guesses pretending to be fact are not."
    },
    doors: {
      q: "Live deployment truth (tunnels, uptime) routes through which door?",
      choices: ["Art Localized", "NXCore", "ByteCast"],
      answer: 1,
      explain: "NXCore is the operational reality layer."
    },
    operating_law: {
      q: "What should an agent do first before acting?",
      choices: ["Open five tabs", "Find the source of truth", "Rewrite architecture"],
      answer: 1,
      explain: "Source of truth first — registries, live state, authority paths."
    },
    lost_protocol: {
      q: "Step one when you are lost:",
      choices: ["Stop expanding", "Create five new docs", "Guess and ship"],
      answer: 0,
      explain: "Pause before you make fog worse."
    }
  };

  global.ByteCastAgentDayVisuals = {
    svg(day, sectionId) {
      const d = Number(day);
      const pack = d === 1 ? day1 : null;
      if (pack?.[sectionId]) return pack[sectionId];
      const label = String(sectionId || "segment").replace(/_/g, " ");
      return `<svg class="bc-agent-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="${label}">
        <rect x="48" y="48" width="304" height="144" rx="18" fill="rgba(34,167,255,0.06)" stroke="rgba(34,167,255,0.28)"/>
        <text x="200" y="100" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${label.toUpperCase().slice(0, 28)}</text>
        <circle cx="200" cy="140" r="6" fill="#22a7ff"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/></circle>
      </svg>`;
    },
    highlight(day, sectionId, profile) {
      const d = Number(day);
      if (d === 1 && highlights[sectionId]) return highlights[sectionId];
      const sec = profile?.script?.sections?.find((s) => s.id === sectionId);
      if (sec?.paragraphs?.[0]) {
        const p = sec.paragraphs[0];
        return p.length > 200 ? p.slice(0, 197) + "…" : p;
      }
      return "";
    },
    microCheck(day, sectionId) {
      if (Number(day) === 1) return microChecks[sectionId] || null;
      return null;
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
