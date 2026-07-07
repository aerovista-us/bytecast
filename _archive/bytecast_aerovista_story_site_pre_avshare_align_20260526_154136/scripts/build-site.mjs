import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const audioRoot = path.join(rootDir, "audio");

const sectionHeadings = new Set([
  "Key Lessons",
  "Why This Mattered Later",
  "Closing Hook",
  "Ending Hook",
  "Act Purpose",
  "Act Theme",
  "Episode Structure",
  "Landing Page Voice Script",
  "Act I Page Voice Script",
  "Act I Opening Voice Script",
  "Act II Opening Voice Script",
  "Act III Opening Voice Script",
  "Act IV Opening Voice Script",
]);

const themes = {
  breakdown: {
    key: "breakdown",
    name: "Signal Under Pressure",
    palette: {
      bg: "#061118",
      bgSoft: "#0d1d29",
      panel: "rgba(7, 20, 30, 0.76)",
      panelSoft: "rgba(11, 31, 46, 0.72)",
      text: "#f6fbff",
      muted: "#b7c9d6",
      accent: "#6fe3ff",
      accentAlt: "#ff8d6f",
      line: "rgba(111, 227, 255, 0.28)",
      glow: "rgba(111, 227, 255, 0.28)",
    },
    summary:
      "Tension, risk, and system failure translated into a clean visual language.",
  },
  ascent: {
    key: "ascent",
    name: "Clarity Through Pressure",
    palette: {
      bg: "#140d10",
      bgSoft: "#24161b",
      panel: "rgba(31, 17, 22, 0.78)",
      panelSoft: "rgba(49, 23, 31, 0.72)",
      text: "#fff9f5",
      muted: "#d8c5bc",
      accent: "#ffaf72",
      accentAlt: "#ffd75e",
      line: "rgba(255, 175, 114, 0.25)",
      glow: "rgba(255, 175, 114, 0.24)",
    },
    summary:
      "Momentum and leverage framed like a climb instead of a generic startup page.",
  },
  chaos: {
    key: "chaos",
    name: "Hidden Architecture",
    palette: {
      bg: "#120b19",
      bgSoft: "#1c1127",
      panel: "rgba(22, 12, 33, 0.78)",
      panelSoft: "rgba(34, 17, 53, 0.72)",
      text: "#f8f5ff",
      muted: "#c9c0df",
      accent: "#c99cff",
      accentAlt: "#7af4f0",
      line: "rgba(201, 156, 255, 0.28)",
      glow: "rgba(201, 156, 255, 0.24)",
    },
    summary:
      "Layered motion that feels ambitious and a little unstable in the best way.",
  },
  infrastructure: {
    key: "infrastructure",
    name: "Systems Becoming Form",
    palette: {
      bg: "#081513",
      bgSoft: "#122321",
      panel: "rgba(8, 24, 22, 0.78)",
      panelSoft: "rgba(16, 37, 34, 0.72)",
      text: "#f4fffb",
      muted: "#bfd6ce",
      accent: "#78ffcf",
      accentAlt: "#7ed7ff",
      line: "rgba(120, 255, 207, 0.28)",
      glow: "rgba(120, 255, 207, 0.24)",
    },
    summary:
      "A circuit-like theme for architecture, ownership, and operational design.",
  },
  resonance: {
    key: "resonance",
    name: "Creative Signal",
    palette: {
      bg: "#180f12",
      bgSoft: "#26151c",
      panel: "rgba(31, 16, 22, 0.8)",
      panelSoft: "rgba(45, 20, 31, 0.72)",
      text: "#fff7fb",
      muted: "#dcc0cd",
      accent: "#ff7fb2",
      accentAlt: "#ffd36c",
      line: "rgba(255, 127, 178, 0.28)",
      glow: "rgba(255, 127, 178, 0.24)",
    },
    summary:
      "Broadcast energy for music, media, and emotionally charged moments.",
  },
  horizon: {
    key: "horizon",
    name: "Long View",
    palette: {
      bg: "#0a1020",
      bgSoft: "#121a33",
      panel: "rgba(9, 17, 35, 0.78)",
      panelSoft: "rgba(15, 26, 51, 0.72)",
      text: "#f5f8ff",
      muted: "#c1cae2",
      accent: "#86a7ff",
      accentAlt: "#86f0ff",
      line: "rgba(134, 167, 255, 0.28)",
      glow: "rgba(134, 167, 255, 0.24)",
    },
    summary:
      "A calmer future-facing mode for outlines, strategy, and longer-form docs.",
  },
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const fileNames = (await fs.readdir(rootDir))
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .sort((left, right) =>
      left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }),
    );

  const docs = [];
  for (const fileName of fileNames) {
    const filePath = path.join(rootDir, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    docs.push(parseDocument(fileName, raw));
  }

  const ordered = docs.sort(compareDocs);
  decorateNavigation(ordered);

  const ttsConfig = getTtsConfig();
  if (ttsConfig.enabled) {
    await fs.mkdir(audioRoot, { recursive: true });
  }

  for (const doc of ordered) {
    doc.audio = await ensureAudio(doc, ttsConfig);
    const outputPath = path.join(rootDir, `${doc.slug}.html`);
    await fs.writeFile(outputPath, renderDocumentPage(doc), "utf8");
  }

  await fs.writeFile(path.join(rootDir, "index.html"), renderIndexPage(ordered), "utf8");

  const generatedSlugsHtml = new Set(ordered.map((doc) => `${doc.slug}.html`));
  const diskHtmlFiles = (await fs.readdir(rootDir))
    .filter((name) => name.toLowerCase().endsWith(".html"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  const actHubNames = new Set(Array.from({ length: 8 }, (_, index) => `act-${index + 1}.html`));

  const supplementaryHtmlFiles = diskHtmlFiles.filter((name) => {
    if (name === "index.html" || name === "site-map.html") return false;
    if (generatedSlugsHtml.has(name)) return false;
    if (actHubNames.has(name)) return false;
    return true;
  });

  await fs.writeFile(
    path.join(rootDir, "site-map.html"),
    renderSiteMapPage(ordered, supplementaryHtmlFiles),
    "utf8",
  );

  console.log(
    `Built ${ordered.length} HTML pages + index.html + site-map.html${ttsConfig.enabled ? " (TTS enabled)" : ""}.`,
  );
}

function parseDocument(fileName, rawText) {
  const normalized = normalizeText(rawText);
  const baseMeta = inferBaseMeta(fileName, normalized);
  const bodyText = dropLeadingNonEmptyLines(normalized, baseMeta.skipLines);
  const markdown = normalizePseudoHeadings(stripStyleBlocks(bodyText));
  const blocks = parseBlocks(markdown, baseMeta);
  const sections = groupSections(blocks, baseMeta);
  const structuredScript =
    baseMeta.type === "voice-script" && blocks.some((b) => b.type === "script_head");
  const preview = buildPreview(baseMeta, sections);
  const theme = pickTheme(baseMeta, normalized);
  const narrationText = buildNarrationText({ ...baseMeta, structuredScript }, sections);
  const wordCount = countWords(narrationText);
  const minutes = Math.max(1, Math.round(wordCount / 150));
  const typeLabel = typeToLabel(baseMeta.type);

  return {
    ...baseMeta,
    fileName,
    outputName: `${baseMeta.slug}.html`,
    preview,
    sections,
    theme,
    narrationText,
    wordCount,
    minutes,
    typeLabel,
    summary: preview || theme.summary,
    tags: buildTags(baseMeta, theme),
    structuredScript,
  };
}

function inferBaseMeta(fileName, rawText) {
  const lines = rawText
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(stripMarkdownDecoration);

  const primary = lines[0] || humanizeName(fileName);
  const secondary = lines[1] || "";
  const fileBase = fileName.replace(/\.md$/i, "");

  let type = "story";
  if (/outline/i.test(fileName) || /outline/i.test(primary)) {
    type = "outline";
  } else if (/voice/i.test(fileName) || /voice/i.test(primary)) {
    type = "voice-script";
  } else if (/blueprint/i.test(fileName) || /blueprint/i.test(primary)) {
    type = "blueprint";
  } else if (/readme/i.test(fileName)) {
    type = "reference";
  }

  let eyebrow = "";
  let title = humanizeName(fileName);
  let skipLines = 1;

  if (isContainerTitle(primary) && secondary) {
    eyebrow = primary;
    title = secondary;
    skipLines = 2;
  } else if (isActEpisodeHeader(primary) && secondary) {
    eyebrow = normalizeActEpisodeLabel(primary);
    title = secondary;
    skipLines = isPullQuoteMetadataLine(lines[2]) ? 3 : 2;
  } else if (/^act\s+/i.test(primary) && secondary && /episode|master|outline|project|trap|version|collapse|future|story/i.test(secondary)) {
    eyebrow = primary;
    title = secondary;
    skipLines = 2;
  } else {
    title = primary;
    eyebrow = buildEyebrowFromFile(fileBase, type);
  }

  const act = inferAct(primary, secondary, fileName);
  const episode = inferEpisode(primary, secondary, fileName);
  const slug = slugify(fileBase);

  return {
    slug,
    title,
    eyebrow,
    type,
    act,
    episode,
    skipLines,
  };
}

function isActEpisodeHeader(text) {
  const value = String(text || "").trim();
  if (!value) return false;
  // Covers formats like:
  // "ACT I — EPISODE 1", "Act I - Episode 1", "ACT 1 - EPISODE 1"
  return /\bact\s+([ivx]+|\d+)\b/i.test(value) && /\bepisode\s+\d+\b/i.test(value);
}

/** Third metadata line after ACT … / Episode title (subtitle in hero), not script body */
function isPullQuoteMetadataLine(line) {
  const t = String(line || "").trim();
  if (t.length < 3) return false;
  const first = t[0];
  const last = t[t.length - 1];
  return (
    (first === '"' && last === '"') ||
    (first === "'" && last === "'") ||
    (first === "\u201c" && last === "\u201d")
  );
}

function normalizeActEpisodeLabel(text) {
  const value = String(text || "").trim();
  const actMatch = value.match(/\bact\s+([ivx]+|\d+)\b/i);
  const epMatch = value.match(/\bepisode\s+(\d+)\b/i);
  if (actMatch && epMatch) {
    return `Act ${normalizeRoman(actMatch[1])} - Episode ${Number(epMatch[1])}`;
  }
  return value;
}

function inferAct(...values) {
  for (const value of values) {
    const match = String(value).match(/\bact\s+([ivx]+|\d+)\b/i);
    if (match) {
      return normalizeRoman(match[1]);
    }
  }
  return "";
}

function inferEpisode(...values) {
  for (const value of values) {
    const match = String(value).match(/\bepisode\s+(\d+)\b/i);
    if (match) {
      return Number(match[1]);
    }
  }
  return 0;
}

function buildEyebrowFromFile(fileBase, type) {
  if (type === "outline") return "Story architecture";
  if (type === "voice-script") return "Narration source";
  if (type === "blueprint") return "Project blueprint";
  if (type === "reference") return "Project notes";
  return humanizeName(fileBase);
}

function normalizePseudoHeadings(text) {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return line;
      if (sectionHeadings.has(trimmed)) return `## ${trimmed}`;
      if (/^(Theme|Topics|Ending Hook|Closing Hook):$/i.test(trimmed)) {
        return `### ${trimmed.slice(0, -1)}`;
      }
      return line;
    })
    .join("\n");
}

function markdownHasStructuredScriptMarkers(markdown) {
  return /^\s*\[(INTRO|CLOSING|STYLE|CORE\s+REALIZATION|SECTION:)/im.test(markdown);
}

function parseStructuredVoiceBlocks(lines) {
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({
      type: "paragraph",
      text: paragraph.join(" ").replace(/\s+/g, " ").trim(),
    });
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: "list", items: list.slice() });
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "divider" });
      continue;
    }

    const headIntro = /^\[INTRO\]\s*$/i.exec(trimmed);
    if (headIntro) {
      flushParagraph();
      flushList();
      blocks.push({ type: "script_head", role: "intro", sectionTitle: null });
      continue;
    }
    const headClose = /^\[CLOSING\]\s*$/i.exec(trimmed);
    if (headClose) {
      flushParagraph();
      flushList();
      blocks.push({ type: "script_head", role: "closing", sectionTitle: null });
      continue;
    }
    const headStyle = /^\[STYLE\]\s*$/i.exec(trimmed);
    if (headStyle) {
      flushParagraph();
      flushList();
      blocks.push({ type: "script_head", role: "style", sectionTitle: null });
      continue;
    }
    const headCore = /^\[CORE REALIZATION\]\s*$/i.exec(trimmed);
    if (headCore) {
      flushParagraph();
      flushList();
      blocks.push({ type: "script_head", role: "core", sectionTitle: null });
      continue;
    }
    const headSection = /^\[SECTION:\s*([^\]]*)\]\s*$/i.exec(trimmed);
    if (headSection) {
      flushParagraph();
      flushList();
      const st = (headSection[1] || "").trim() || "Section";
      blocks.push({ type: "script_head", role: "section", sectionTitle: st });
      continue;
    }

    const pace = /^\[(pause|long pause|slow|whisper|emphasis)\]\s*$/i.exec(trimmed);
    if (pace) {
      flushParagraph();
      flushList();
      blocks.push({ type: "pacing", tag: pace[1].toLowerCase().replace(/\s+/g, " ") });
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      list.push(stripMarkdownDecoration(listMatch[1]));
      continue;
    }

    paragraph.push(stripMarkdownDecoration(trimmed));
  }

  flushParagraph();
  flushList();
  return coalesceRhythmParagraphs(blocks);
}

function coalesceRhythmParagraphs(blocks) {
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type !== "paragraph") {
      out.push(b);
      i += 1;
      continue;
    }
    let j = i;
    const run = [];
    while (j < blocks.length && blocks[j].type === "paragraph" && isRhythmCandidateLine(blocks[j].text)) {
      run.push(blocks[j].text);
      j += 1;
    }
    if (run.length >= 3) {
      out.push({ type: "rhythm_lines", items: run });
      i = j;
      continue;
    }
    out.push(b);
    i += 1;
  }
  return out;
}

function isRhythmCandidateLine(text) {
  const s = String(text || "").trim();
  if (!s || s.length > 48) return false;
  if (/:$/.test(s)) return false;
  if (/[.!?…]$/.test(s)) return false;
  if (/\.{2,}\s*$/.test(s)) return false;
  if (/[.!?]\s/.test(s)) return false;
  if (/^[•\-–]/.test(s)) return false;
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length > 3) return false;
  return true;
}

function parseBlocks(markdown, meta = {}) {
  if (meta.type === "voice-script" && markdownHasStructuredScriptMarkers(markdown)) {
    return parseStructuredVoiceBlocks(markdown.split("\n"));
  }

  const lines = markdown.split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];
  let activeSectionTitle = "";
  let expectCompactList = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    if (/why this mattered later/i.test(activeSectionTitle) && /:$/.test(paragraph[paragraph.length - 1])) {
      expectCompactList = true;
    }
    blocks.push({
      type: "paragraph",
      text: paragraph.join(" ").replace(/\s+/g, " ").trim(),
    });
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: "list", items: list.slice() });
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "divider" });
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      expectCompactList = false;
      if (headingMatch[1].length <= 2) {
        activeSectionTitle = stripMarkdownDecoration(headingMatch[2]);
      }
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: stripMarkdownDecoration(headingMatch[2]),
      });
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      expectCompactList = false;
      list.push(stripMarkdownDecoration(listMatch[1]));
      continue;
    }

    if (/key lessons|topics/i.test(activeSectionTitle)) {
      flushParagraph();
      list.push(stripMarkdownDecoration(trimmed));
      continue;
    }

    if (/why this mattered later/i.test(activeSectionTitle)) {
      const lastParagraphLine = paragraph[paragraph.length - 1] || "";
      if (list.length || expectCompactList || /:$/.test(lastParagraphLine)) {
        if (paragraph.length) {
          flushParagraph();
        }
        list.push(stripMarkdownDecoration(trimmed));
        continue;
      }
    }

    expectCompactList = false;
    paragraph.push(stripMarkdownDecoration(trimmed));
  }

  flushParagraph();
  flushList();
  return blocks;
}

function groupSections(blocks, meta = {}) {
  const hasScriptHead = blocks.some((b) => b.type === "script_head");
  if (meta.type === "voice-script" && hasScriptHead) {
    return groupScriptSections(blocks);
  }

  const sections = [];
  let current = { title: "Opening Narrative", blocks: [] };

  for (const block of blocks) {
    if (block.type === "heading" && block.level <= 2) {
      if (current.blocks.length) sections.push(current);
      current = { title: block.text, blocks: [] };
      continue;
    }
    current.blocks.push(block);
  }

  if (current.blocks.length) sections.push(current);
  return sections;
}

function scriptSectionDisplayTitle(block) {
  switch (block.role) {
    case "intro":
      return "Intro";
    case "closing":
      return "Closing";
    case "style":
      return "Style";
    case "core":
      return "Core realization";
    case "section":
      return block.sectionTitle || "Section";
    default:
      return "Section";
  }
}

function groupScriptSections(blocks) {
  const sections = [];
  let pending = [];

  const flushPending = () => {
    if (!pending.length) return;
    sections.push({
      title: "Opening Narrative",
      blocks: pending,
      scriptRole: null,
      scriptSectionTitle: null,
    });
    pending = [];
  };

  for (const block of blocks) {
    if (block.type === "script_head") {
      flushPending();
      sections.push({
        title: scriptSectionDisplayTitle(block),
        blocks: [],
        scriptRole: block.role,
        scriptSectionTitle: block.sectionTitle || null,
      });
      continue;
    }
    if (!sections.length) {
      pending.push(block);
      continue;
    }
    sections[sections.length - 1].blocks.push(block);
  }

  flushPending();

  return sections.length ? sections : [{ title: "Opening Narrative", blocks: [], scriptRole: null, scriptSectionTitle: null }];
}

function pickTheme(meta, fullText) {
  const haystack = `${meta.title} ${meta.eyebrow} ${fullText}`.toLowerCase();
  const scores = {
    breakdown: scoreTheme(haystack, [
      "break",
      "collapse",
      "fraud",
      "compliance",
      "pressure",
      "failure",
      "risk",
      "control",
      "layoff",
    ]),
    ascent: scoreTheme(haystack, [
      "skill",
      "sales",
      "leadership",
      "leverage",
      "perform",
      "climb",
      "pressure creates",
    ]),
    chaos: scoreTheme(haystack, [
      "chaos",
      "many lives",
      "double life",
      "fragment",
      "experimental",
      "insane",
      "multiple futures",
    ]),
    infrastructure: scoreTheme(haystack, [
      "architecture",
      "system",
      "infrastructure",
      "ownership",
      "automation",
      "backend",
      "version",
      "registry",
      "operating",
    ]),
    resonance: scoreTheme(haystack, [
      "music",
      "media",
      "creative",
      "story",
      "echoverse",
      "brand",
      "publishing",
      "narrative",
    ]),
    horizon: scoreTheme(haystack, [
      "future",
      "vision",
      "outline",
      "blueprint",
      "roadmap",
      "ecosystem",
    ]),
  };

  const [bestKey] = Object.entries(scores).sort((left, right) => right[1] - left[1])[0];
  return themes[bestKey || "horizon"];
}

function buildPreview(meta, sections) {
  for (const section of sections) {
    if (section.scriptRole === "style") continue;
    for (const block of section.blocks) {
      if (block.type !== "paragraph") continue;
      const text = String(block.text || "").trim();
      if (!text || text.length <= 40) continue;
      if (shouldSkipNarrationLine(meta, text)) continue;

      if (meta.type === "voice-script") {
        return clipText(cleanVoiceSubtitle(text), 140);
      }

      return clipText(text, 180);
    }
  }
  return "";
}

function cleanVoiceSubtitle(text) {
  return String(text || "")
    .replace(/\bopening\s+scene\b/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildNarrationText(meta, sections) {
  const parts = [meta.title];
  if (meta.eyebrow && !meta.eyebrow.toLowerCase().includes(meta.title.toLowerCase())) {
    parts.unshift(meta.eyebrow);
  }

  for (const section of sections) {
    if (section.scriptRole === "style") {
      continue;
    }

    if (meta.structuredScript && section.scriptRole) {
    } else if (section.title && section.title !== "Opening Narrative") {
      parts.push(section.title);
    }
    for (const block of section.blocks) {
      if (block.type === "heading") {
        if (!shouldSkipNarrationLine(meta, block.text)) parts.push(block.text);
      } else if (block.type === "paragraph") {
        if (!shouldSkipNarrationLine(meta, block.text)) parts.push(block.text);
      } else if (block.type === "list") {
        for (const item of block.items) {
          if (!shouldSkipNarrationLine(meta, item)) parts.push(item);
        }
      } else if (block.type === "pacing") {
        parts.push(pacingToNarrationGap(block.tag));
      } else if (block.type === "rhythm_lines") {
        for (const item of block.items) {
          if (!shouldSkipNarrationLine(meta, item)) parts.push(item);
        }
      }
    }
  }

  return parts
    .map((part) => cleanNarrationPart(part))
    .filter(Boolean)
    .join("\n\n");
}

/** Pacing markers are layout/timing hints only — never spoken (no “pause”, no ellipsis token). */
function pacingToNarrationGap() {
  return "";
}

function shouldSkipNarrationLine(meta, text) {
  const value = String(text || "").trim();
  if (!value) return true;

  // Voice scripts often include stage directions. Skip them for audio playback.
  if (meta.type === "voice-script") {
    if (/^(visual|on screen|onscreen|camera|cut to|scene|shot|b-roll|music|sfx|sound|note)\s*:/i.test(value)) {
      return true;
    }

    // Skip segment headers so they aren't spoken before the next sentence.
    if (/^\[(intro|closing)\]\s*$/i.test(value)) return true;
    if (/^\[core\s+realization\]\s*$/i.test(value)) return true;
    if (/^\[section:\s*[^\]]+\]\s*$/i.test(value)) return true;
    if (/^\[style\]\s*$/i.test(value)) return true;
  }

  return false;
}

function stripStyleBlocks(text) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let skipping = false;

  for (const line of lines) {
    const trimmed = String(line || "").trim();

    if (!skipping) {
      if (/^\[STYLE\]\s*$/i.test(trimmed)) {
        skipping = true;
        continue;
      }
      out.push(line);
      continue;
    }

    // Skip everything after [STYLE] until the closing `---` divider.
    if (/^-{3,}$/.test(trimmed)) {
      skipping = false;
    }
  }

  return out.join("\n").trim();
}

function buildTags(meta, theme) {
  const tags = [theme.name, meta.type.replace(/-/g, " ")];
  if (meta.act) tags.push(`Act ${meta.act}`);
  if (meta.episode) tags.push(`Episode ${meta.episode}`);
  return tags;
}

function decorateNavigation(docs) {
  const relatedByAct = new Map();
  for (const doc of docs) {
    const key = doc.act || doc.type;
    if (!relatedByAct.has(key)) relatedByAct.set(key, []);
    relatedByAct.get(key).push(doc);
  }

  for (let index = 0; index < docs.length; index += 1) {
    const doc = docs[index];
    doc.previous = docs[index - 1] || null;
    doc.next = docs[index + 1] || null;
    doc.related = (relatedByAct.get(doc.act || doc.type) || [])
      .filter((item) => item.slug !== doc.slug)
      .slice(0, 4);
  }
}

function compareDocs(left, right) {
  const actCompare = compareAct(left.act, right.act);
  if (actCompare !== 0) return actCompare;
  if (left.episode !== right.episode) return left.episode - right.episode;
  const typeCompare = typeWeight(left.type) - typeWeight(right.type);
  if (typeCompare !== 0) return typeCompare;
  return left.title.localeCompare(right.title);
}

function compareAct(left, right) {
  if (!left && !right) return 0;
  if (!left) return 1;
  if (!right) return -1;
  return romanToNumber(left) - romanToNumber(right);
}

function typeWeight(type) {
  switch (type) {
    case "outline":
      return 1;
    case "voice-script":
      return 2;
    case "story":
      return 3;
    case "blueprint":
      return 4;
    default:
      return 5;
  }
}

function getTtsConfig() {
  return {
    enabled: Boolean(process.env.OPENAI_API_KEY),
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.BYTECAST_TTS_MODEL || "tts-1-hd",
    voice: process.env.BYTECAST_TTS_VOICE || "onyx",
    format: process.env.BYTECAST_TTS_FORMAT || "mp3",
    speed: Number(process.env.BYTECAST_TTS_SPEED || "0.96"),
    instructions:
      process.env.BYTECAST_TTS_INSTRUCTIONS ||
      "Warm, grounded documentary narration. Calm pacing. Natural pauses. Pleasant adult male delivery.",
  };
}

async function ensureAudio(doc, config) {
  const existing = await readAudioMeta(doc.slug);
  if (!config.enabled) {
    return existing || { mode: "browser", sources: [] };
  }

  const signature = JSON.stringify({
    text: doc.narrationText,
    model: config.model,
    voice: config.voice,
    format: config.format,
    speed: config.speed,
    instructions: config.instructions,
  });

  if (existing && existing.signature === signature) {
    return existing;
  }

  const segmentTexts = splitNarrationForAudio(doc.narrationText, 2400);
  const folder = path.join(audioRoot, doc.slug);
  await fs.mkdir(folder, { recursive: true });
  await clearDirectory(folder);

  const sources = [];
  for (let index = 0; index < segmentTexts.length; index += 1) {
    const fileName = `${String(index + 1).padStart(2, "0")}.${config.format}`;
    const filePath = path.join(folder, fileName);
    const bytes = await requestSpeech(segmentTexts[index], config);
    await fs.writeFile(filePath, bytes);
    sources.push(`audio/${doc.slug}/${fileName}`);
  }

  const meta = {
    mode: "openai",
    sources,
    signature,
    disclosure: "AI-generated voice preview",
  };

  await fs.writeFile(
    path.join(folder, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf8",
  );

  return meta;
}

async function requestSpeech(input, config) {
  const payload = {
    model: config.model,
    voice: config.voice,
    input,
    format: config.format,
    speed: config.speed,
  };

  if (/^gpt-/i.test(config.model)) {
    payload.instructions = config.instructions;
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`TTS request failed (${response.status}): ${message}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function readAudioMeta(slug) {
  try {
    const metaPath = path.join(audioRoot, slug, "meta.json");
    const raw = await fs.readFile(metaPath, "utf8");
    const meta = JSON.parse(raw);
    return meta;
  } catch {
    return null;
  }
}

async function clearDirectory(folder) {
  try {
    const entries = await fs.readdir(folder);
    await Promise.all(entries.map((entry) => fs.rm(path.join(folder, entry), { force: true })));
  } catch {
    return;
  }
}

function renderDocumentPage(doc) {
  const curated = buildCuratedView(doc);
  const themeVars = themeStyle(doc.theme);
  const audioSources = doc.audio.sources.join("|");
  const useAudio = doc.audio.sources.length > 0;
  const narrationId = `narration-${doc.slug}`;
  const description = escapeHtml(doc.summary);
  const content = doc.sections.map((section, index) => renderStarterSection(doc, section, index)).join("\n");
  const navPrev = doc.previous ? `<a href="${doc.previous.outputName}">Prev</a>` : "";
  const navNext = doc.next ? `<a href="${doc.next.outputName}">Next</a>` : "";

  const heroVisual = pickHeroVisual(doc);

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(doc.title)} | ByteCast</title><meta name="description" content="${description}"><link rel="stylesheet" href="assets/styles.css"></head><body class="grid-bg" style="${themeVars}"><div class="orb one"></div><div class="orb two"></div><div class="orb three"></div><div class="scroll-progress" aria-hidden="true"><span data-scroll-progress></span></div>
<nav class="nav"><div class="nav-inner"><a class="brand" href="index.html"><span class="apex">Λ</span><span>ByteCast · AeroVista</span></a><div class="nav-links"><a href="index.html">Home</a>${doc.act ? `<a href="act-${romanToNumber(doc.act)}.html">Act ${escapeHtml(doc.act)}</a>` : ""}<a href="site-map.html">Map</a>${navPrev}${navNext}</div></div></nav>
<main>
<section class="hero wrap hero-cinematic" id="top">${heroVisual ? `<div class="hero-visual ${heroVisual.className}" aria-hidden="true">${heroVisual.svg}</div>` : ""}<div><div class="eyebrow">${escapeHtml(curated.chapterLabel)}</div><h1 class="title">${escapeHtml(doc.title)}</h1><p class="subtitle">${escapeHtml(doc.summary)}</p><div class="quote" id="hero-read">${escapeHtml(curated.pullQuote)}</div><div class="actions"><button class="btn primary" data-play-narration data-title="${escapeHtmlAttribute(doc.title)}" data-audio-sources="${escapeHtmlAttribute(audioSources)}" data-narration-source="#${narrationId}">${useAudio ? "▶ Play narrated cut" : "▶ Play narration"}</button><a class="btn ghost" href="#story">Jump to content</a></div></div></section>
<section class="wrap section${doc.structuredScript ? " script-episode" : ""}" id="story">${content}</section>
</main>
<template id="${narrationId}">${escapeHtml(doc.narrationText)}</template>
<div class="audio-bar" data-audio-bar hidden><button class="btn" data-stop>Stop</button><div class="audio-title" data-audio-title>ByteCast narration</div><div class="progress"><span data-progress-fill></span></div></div>
<footer class="footer">${escapeHtml(curated.footerLine)}</footer><button class="to-top" type="button" data-to-top aria-label="Back to top">Top</button><script src="assets/app.js"></script></body></html>`;
}

function pickHeroVisual(doc) {
  // Story pages should feel cinematic, not diagrammatic.
  if (doc.type === "story") return null;

  // Voice scripts benefit from an audio-related visual language.
  if (doc.type === "voice-script") {
    return { className: "hero-visual-wave", svg: renderWaveformVisual(doc) };
  }

  // Outlines / blueprints / reference pages can keep subtle diagram motion.
  if (doc.type === "outline" || doc.type === "blueprint" || doc.type === "reference") {
    return { className: "hero-visual-soft", svg: renderHeroVisual(doc) };
  }

  return null;
}

function renderWaveformVisual(doc) {
  const id = doc.slug;
  return `<svg viewBox="0 0 520 420" class="hero-svg hero-svg-wave" aria-hidden="true">
    <defs>
      <linearGradient id="wave-${id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="var(--blue)" />
        <stop offset="50%" stop-color="var(--pink)" />
        <stop offset="100%" stop-color="var(--green)" />
      </linearGradient>
    </defs>
    <path class="wave-track" d="M60 240 H460" />
    <path class="wave-line" stroke="url(#wave-${id})" d="M60 240 C100 180 140 300 180 240 S260 180 300 240 S380 300 420 240 S460 210 460 240" />
    <path class="wave-line wave-line-alt" stroke="url(#wave-${id})" d="M60 240 C120 200 140 280 200 240 S300 200 360 240 S420 280 460 240" />
  </svg>`;
}

function renderSection(doc, section, index) {
  const variant = sectionVariant(section.title);
  const heading = section.title === "Opening Narrative" ? "Opening Sequence" : section.title;

  if (variant === "lessons") {
    const lessonItems = blocksToLessonItems(section.blocks);
    return `<section class="story-section story-section-lessons documentary-block">
      <div class="section-heading">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <h2>${escapeHtml(heading)}</h2>
      </div>
      <div class="lesson-grid takeaway-grid">
        ${lessonItems
          .map(
            (item, itemIndex) => `<article class="lesson-card">
              <span>${String(itemIndex + 1).padStart(2, "0")}</span>
              <p>${escapeHtml(item)}</p>
            </article>`,
          )
          .join("")}
      </div>
    </section>`;
  }

  if (variant === "hook") {
    return `<section class="story-section story-section-hook documentary-block">
      <div class="section-heading">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <h2>${escapeHtml(heading)}</h2>
      </div>
      <div class="hook-card quote-banner">${renderBlocks(section.blocks)}</div>
    </section>`;
  }

  return `<section class="story-section story-section-${variant} documentary-block">
    <div class="section-heading">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h2>${escapeHtml(heading)}</h2>
    </div>
    <div class="story-card narrative-card">${renderBlocks(section.blocks)}</div>
  </section>`;
}

function renderStarterSection(doc, section, index) {
  if (doc.structuredScript) {
    if (section.scriptRole) {
      if (section.scriptRole === "style") return "";
      const label = section.scriptSectionTitle || section.title;
      const role = section.scriptRole;
      const roleClass =
        role === "section" ? "section" : role === "core" ? "core" : role === "style" ? "style" : role;
      const inner = renderVoiceScriptBlocks(section.blocks);
      return `<div class="voice-segment voice-segment-${roleClass}" data-script-role="${escapeHtmlAttribute(role)}">
      <h3 class="voice-segment-heading">${escapeHtml(label)}</h3>
      <div class="voice-segment-body">${inner}</div>
    </div>`;
    }
    if (section.blocks.length) {
      const inner = renderVoiceScriptBlocks(section.blocks);
      return `<div class="voice-segment voice-segment-preamble"><div class="voice-segment-body">${inner}</div></div>`;
    }
    return "";
  }

  const variant = sectionVariant(section.title);
  const heading = section.title === "Opening Narrative" ? "Opening Sequence" : section.title;
  const rendered = renderBlocks(section.blocks);

  if (variant === "lessons") {
    const items = blocksToLessonItems(section.blocks);
    const cards = items
      .slice(0, 6)
      .map(
        (item, itemIndex) =>
          `<div class="card episode-card"><span class="tag">Lesson ${String(itemIndex + 1)}</span><p>${escapeHtml(item)}</p></div>`,
      )
      .join("");
    return `<div class="panel" style="margin-top:18px"><h2>${escapeHtml(heading)}</h2><div class="cards">${cards}</div></div>`;
  }

  if (variant === "hook") {
    return `<div class="panel" style="margin-top:18px"><h2>${escapeHtml(heading)}</h2><div class="quote" style="margin:18px 0 0">${rendered}</div></div>`;
  }

  return `<div class="panel" style="margin-top:18px"><h2>${escapeHtml(heading)}</h2><div class="scene">${rendered}</div></div>`;
}

function renderVoiceScriptBlocks(blocks) {
  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        return `<p>${escapeHtml(block.text)}</p>`;
      }
      if (block.type === "list") {
        return `<ul class="script-list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      }
      if (block.type === "heading") {
        return `<h4 class="script-inline-heading">${escapeHtml(block.text)}</h4>`;
      }
      if (block.type === "divider") {
        return `<hr class="script-divider" />`;
      }
      if (block.type === "pacing") {
        return "";
      }
      if (block.type === "rhythm_lines") {
        return `<ul class="script-rhythm">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function renderBlocks(blocks) {
  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        return `<p>${escapeHtml(block.text)}</p>`;
      }
      if (block.type === "list") {
        return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      }
      if (block.type === "heading") {
        return `<h3>${escapeHtml(block.text)}</h3>`;
      }
      return `<hr class="script-divider">`;
    })
    .join("\n");
}

function renderHeroVisual(doc) {
  const id = doc.slug;
  if (doc.theme.key === "breakdown") {
    return `<svg viewBox="0 0 520 420" class="hero-svg" aria-hidden="true">
      <defs>
        <linearGradient id="grid-${id}" x1="0%" x2="100%">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--accent-alt)" />
        </linearGradient>
      </defs>
      <g class="motion-grid">
        <path d="M40 70 H480 M40 140 H480 M40 210 H480 M40 280 H480 M40 350 H480" />
        <path d="M100 30 V390 M180 30 V390 M260 30 V390 M340 30 V390 M420 30 V390" />
      </g>
      <path class="motion-rift" d="M120 55 L205 130 L160 210 L280 280 L235 370" />
      <circle class="motion-node" cx="205" cy="130" r="9" />
      <circle class="motion-node" cx="280" cy="280" r="11" />
    </svg>`;
  }

  if (doc.theme.key === "ascent") {
    return `<svg viewBox="0 0 520 420" class="hero-svg" aria-hidden="true">
      <path class="motion-axis" d="M70 340 L460 340" />
      <path class="motion-axis" d="M90 360 L90 70" />
      <path class="motion-wave" d="M90 320 C150 300 190 260 230 260 S320 180 380 160 S430 90 450 90" />
      <circle class="motion-node" cx="230" cy="260" r="10" />
      <circle class="motion-node" cx="380" cy="160" r="12" />
      <circle class="motion-node motion-node-alt" cx="450" cy="90" r="14" />
    </svg>`;
  }

  if (doc.theme.key === "chaos") {
    return `<svg viewBox="0 0 520 420" class="hero-svg" aria-hidden="true">
      <path class="motion-ribbon" d="M40 180 C120 60 220 60 300 180 S430 300 500 170" />
      <path class="motion-ribbon motion-ribbon-alt" d="M20 250 C100 140 190 140 270 250 S410 360 500 250" />
      <circle class="motion-node" cx="155" cy="132" r="10" />
      <circle class="motion-node motion-node-alt" cx="355" cy="245" r="12" />
    </svg>`;
  }

  if (doc.theme.key === "infrastructure") {
    return `<svg viewBox="0 0 520 420" class="hero-svg" aria-hidden="true">
      <rect class="motion-frame" x="90" y="80" width="340" height="240" rx="28" />
      <path class="motion-circuit" d="M120 130 H220 V180 H310 V245 H395" />
      <path class="motion-circuit motion-circuit-alt" d="M150 280 H250 V230 H330 V150 H400" />
      <circle class="motion-node" cx="220" cy="180" r="10" />
      <circle class="motion-node motion-node-alt" cx="330" cy="150" r="10" />
    </svg>`;
  }

  if (doc.theme.key === "resonance") {
    return `<svg viewBox="0 0 520 420" class="hero-svg" aria-hidden="true">
      <circle class="motion-ring" cx="250" cy="210" r="64" />
      <circle class="motion-ring motion-ring-alt" cx="250" cy="210" r="118" />
      <path class="motion-wave" d="M90 210 C130 170 170 250 210 210 S290 170 330 210 S410 250 450 210" />
      <circle class="motion-node" cx="250" cy="210" r="14" />
    </svg>`;
  }

  return `<svg viewBox="0 0 520 420" class="hero-svg" aria-hidden="true">
    <path class="motion-wave" d="M50 280 C120 220 180 220 250 280 S380 340 470 180" />
    <path class="motion-wave motion-wave-alt" d="M80 330 C150 260 220 260 300 320 S390 360 450 120" />
    <circle class="motion-node" cx="250" cy="280" r="12" />
    <circle class="motion-node motion-node-alt" cx="450" cy="120" r="14" />
  </svg>`;
}

function renderIndexPage(docs) {
  const blueprint = getBlueprintNarrative();
  const actCards = renderStarterActCards();

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The AeroVista Story | ByteCast</title><meta name="description" content="Interactive documentary-style site for the AeroVista founder story and ecosystem."><link rel="stylesheet" href="assets/styles.css"></head><body class="grid-bg" style="${themeStyle(themes.horizon)}"><div class="orb one"></div><div class="orb two"></div><div class="orb three"></div><div class="scroll-progress" aria-hidden="true"><span data-scroll-progress></span></div>
<nav class="nav"><div class="nav-inner"><a class="brand" href="index.html"><span class="apex">Λ</span><span>ByteCast · AeroVista</span></a><div class="nav-links"><a href="act-1.html">Act I</a><a href="#acts">Acts</a><a href="#listen">Listen</a><a href="site-map.html">Map</a></div></div></nav>
<main>
<section class="hero wrap" id="top"><div class="hero-visual" aria-hidden="true">${renderHeroVisual({ slug: "index", theme: themes.horizon })}</div><div><div class="eyebrow">Founder documentary mini-site</div><h1 class="title">The AeroVista Story</h1><p class="subtitle">How chaos became infrastructure.</p><div class="quote" id="hero-read">${escapeHtml(blueprint.openingQuote)}</div><div class="actions"><a class="btn primary" href="${blueprint.startHref}">Start Act I</a><button class="btn read" data-play-narration data-title="Landing page opening" data-audio-sources="" data-narration-source="#narration-index">▶ Listen to opening</button><a class="btn ghost" href="#acts">Explore acts</a></div></div></section>
<section class="wrap section" id="listen"><div class="split"><div><h2>Built like a story first.</h2><p class="section-kicker">${escapeHtml(blueprint.listenKicker)}</p></div><div class="panel"><strong>ByteCast Mode</strong><p class="section-kicker">${escapeHtml(blueprint.listenPanel)}</p><div class="pill-row"><span class="pill">Story first</span><span class="pill">Non-technical friendly</span><span class="pill">Investor-ready</span><span class="pill">Expandable</span></div></div></div></section>
<section class="wrap section" id="acts"><div><div class="eyebrow">Season overview</div><h2>The Acts</h2><p class="section-kicker">Each act works like a chapter in the AeroVista origin story. Start broad, then go deeper only where the viewer cares.</p></div><div class="cards">${actCards}</div></section>
</main>
<template id="narration-index">${escapeHtml(blueprint.openingNarration)}</template>
<div class="audio-bar" data-audio-bar hidden><button class="btn" data-stop>Stop</button><div class="audio-title" data-audio-title>ByteCast narration</div><div class="progress"><span data-progress-fill></span></div></div>
<footer class="footer">Built in Idaho. Designed for resilience. · <a href="site-map.html">Site map</a> · ByteCast / AeroVista Story</footer><button class="to-top" type="button" data-to-top aria-label="Back to top">Top</button><script src="assets/app.js"></script></body></html>`;
}

function renderSiteMapPage(docs, supplementaryHtmlFiles) {
  const totalListed = 2 + 8 + docs.length + supplementaryHtmlFiles.length;
  const actRomans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const actHubLinks = actRomans
    .map((act, idx) => {
      const info = getActInfo(act);
      const href = `act-${idx + 1}.html`;
      return `<li class="site-map-row"><a href="${href}">Act ${escapeHtml(act)} — ${escapeHtml(info.title)}</a><span class="site-map-meta">${escapeHtml(info.summary)}</span></li>`;
    })
    .join("");

  const generatedLinks = docs
    .map((doc) => {
      const badge = doc.act
        ? `Act ${doc.act}${doc.episode ? ` · Ep ${doc.episode}` : ""}`
        : doc.typeLabel || doc.type || "Page";
      return `<li class="site-map-row"><a href="${escapeHtml(`${doc.slug}.html`)}">${escapeHtml(doc.title)}</a><span class="site-map-meta">${escapeHtml(
        badge,
      )} · ${escapeHtml(doc.fileName)}</span></li>`;
    })
    .join("");

  const extraSection =
    supplementaryHtmlFiles.length > 0
      ? `<section class="wrap section site-map-page" id="standalone"><div><div class="eyebrow">Additional routes</div><h2>Standalone HTML files</h2></div><div class="panel"><ul class="site-map-ul">${supplementaryHtmlFiles
          .map(
            (name) =>
              `<li class="site-map-row"><a href="${escapeHtml(name)}">${escapeHtml(name)}</a><span class="site-map-meta">Curated or legacy HTML — omitted from Markdown rebuild outputs above.</span></li>`,
          )
          .join("")}</ul></div></section>`
      : "";

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Site map | ByteCast</title><meta name="description" content="Index of AeroVista story pages in this folder."><link rel="stylesheet" href="assets/styles.css"></head><body class="grid-bg" style="${themeStyle(themes.horizon)}"><div class="orb one"></div><div class="orb two"></div><div class="orb three"></div><div class="scroll-progress" aria-hidden="true"><span data-scroll-progress></span></div>
<nav class="nav"><div class="nav-inner"><a class="brand" href="index.html"><span class="apex">Λ</span><span>ByteCast · AeroVista</span></a><div class="nav-links"><a href="index.html">Home</a><a href="site-map.html">Map</a></div></div></nav>
<main>
<section class="hero wrap"><div><div class="eyebrow">Navigation</div><h1 class="title">Site map</h1><p class="subtitle">${totalListed} indexed routes: home, site map, eight act hubs, every page rebuilt from Markdown${supplementaryHtmlFiles.length ? ", and additional HTML curated outside that build pipeline." : "."}</p><div class="actions"><a class="btn ghost" href="index.html">Back to home</a></div></div></section>
<section class="wrap section site-map-page" id="core"><div><div class="eyebrow">Entry</div><h2>Landing</h2></div><div class="panel"><ul class="site-map-ul"><li class="site-map-row"><a href="index.html">index.html — Home</a><span class="site-map-meta">Landing · regenerated each build</span></li><li class="site-map-row"><a href="site-map.html">site-map.html</a><span class="site-map-meta">You are viewing it · regenerated each build</span></li></ul></div></section>
<section class="wrap section site-map-page" id="acts"><div><div class="eyebrow">Acts</div><h2>Act overview hubs</h2></div><div class="panel"><ul class="site-map-ul">${actHubLinks}</ul></div></section>
<section class="wrap section site-map-page" id="generated"><div><div class="eyebrow">Chapter library</div><h2>Pages rebuilt from source</h2></div><div class="panel"><ul class="site-map-ul">${generatedLinks}</ul></div></section>
${extraSection}
</main>
<div class="audio-bar" data-audio-bar hidden><button class="btn" data-stop>Stop</button><div class="audio-title" data-audio-title>ByteCast</div><div class="progress"><span data-progress-fill></span></div></div>
<footer class="footer"><a href="index.html">Home</a> · Site map synced with Markdown rebuild · ByteCast / AeroVista Story</footer><button class="to-top" type="button" data-to-top aria-label="Back to top">Top</button><script src="assets/app.js"></script></body></html>`;
}

function renderStarterActCards() {
  const plannedActs = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  return plannedActs
    .map((act) => {
      const info = getActInfo(act);
      const href = `act-${romanToNumber(act)}.html`;
      return `<a class="card" href="${href}"><span class="tag">Act ${escapeHtml(act)}</span><h3>${escapeHtml(info.title)}</h3><p>${escapeHtml(info.summary)}</p></a>`;
    })
    .join("");
}

function renderIndexCard(doc) {
  return `<article class="index-card">
    <div class="index-card-top">
      <span class="card-theme">${escapeHtml(doc.typeLabel)}</span>
      <span class="card-time">${doc.minutes} min</span>
    </div>
    <h3><a href="${doc.outputName}">${escapeHtml(doc.title)}</a></h3>
    <p>${escapeHtml(doc.summary)}</p>
    <div class="chip-row">
      ${doc.tags
        .slice(0, 3)
        .map((tag) => `<span class="chip chip-static">${escapeHtml(tag)}</span>`)
        .join("")}
    </div>
  </article>`;
}

function groupForIndex(docs) {
  const map = new Map();
  for (const doc of docs) {
    const key = doc.act ? `act-${doc.act}` : "reference";
    if (!map.has(key)) {
      map.set(key, {
        key,
        kind: doc.act ? "act" : "reference",
        act: doc.act || "",
        label: doc.act ? `Act ${doc.act}` : "Reference Files",
        docs: [],
      });
    }
    map.get(key).docs.push(doc);
  }

  return [...map.values()].sort((left, right) => {
    if (left.kind === right.kind && left.act && right.act) {
      return romanToNumber(left.act) - romanToNumber(right.act);
    }
    if (left.kind === "act" && right.kind !== "act") return -1;
    if (left.kind !== "act" && right.kind === "act") return 1;
    return left.label.localeCompare(right.label);
  });
}

function sectionVariant(title) {
  const lower = title.toLowerCase();
  if (lower.includes("lesson")) return "lessons";
  if (lower.includes("hook")) return "hook";
  if (lower.includes("why this mattered")) return "context";
  return "standard";
}

function blocksToLessonItems(blocks) {
  const items = [];
  for (const block of blocks) {
    if (block.type === "paragraph") items.push(block.text);
    if (block.type === "list") items.push(...block.items);
  }
  return items;
}

function buildCuratedView(doc) {
  const takeaways =
    extractItemsFromSection(doc.sections, /(key lessons|topics)/i).slice(0, 4) ||
    [];
  const contextItems =
    extractItemsFromSection(doc.sections, /(why this mattered later|act purpose)/i).slice(0, 4) ||
    [];
  const fallbackPoints = [doc.summary, doc.theme.summary, `${doc.minutes} minute chapter`].filter(Boolean);
  return {
    chapterLabel: buildChapterLabel(doc),
    storyRole: doc.episode ? `Episode ${doc.episode} chapter` : doc.theme.name,
    pullQuote: findPullQuote(doc),
    dossierTitle: doc.episode ? `What this episode unlocks` : `How to read this page`,
    dossierText: contextItems[0] || doc.theme.summary,
    takeaways: takeaways.length ? takeaways : fallbackPoints,
    contextItems: contextItems.length ? contextItems : [doc.theme.summary, `Source: ${doc.fileName}`],
    footerLine: doc.act
      ? `Act ${doc.act}${doc.episode ? ` - Episode ${doc.episode}` : ""} - Source: ${doc.fileName}`
      : `Source: ${doc.fileName}`,
  };
}

function extractItemsFromSection(sections, pattern) {
  const section = sections.find((entry) => pattern.test(entry.title));
  if (!section) return [];
  return blocksToLessonItems(section.blocks).filter(Boolean);
}

function buildChapterLabel(doc) {
  if (doc.act && doc.episode) return `Act ${doc.act} - Episode ${doc.episode}`;
  if (doc.act) return `Act ${doc.act} - ${doc.typeLabel}`;
  return doc.eyebrow || doc.typeLabel;
}

function findPullQuote(doc) {
  const excerpt = buildHeroExcerpt(doc, 260);
  return excerpt || doc.summary;
}

function buildHeroExcerpt(doc, maxLength) {
  const collected = [];
  const subtitleNorm = normalizeCompareText(doc.summary || "");

  for (const section of doc.sections) {
    if (doc.structuredScript && section.scriptRole === "style") continue;
    for (const block of section.blocks) {
      if (block.type !== "paragraph") continue;
      let text = String(block.text || "").trim();
      if (!text || text.length < 18) continue;
      if (shouldSkipNarrationLine(doc, text)) continue;

      if (doc.type === "voice-script") {
        text = cleanVoiceSubtitle(text);
      }

      if (!text) continue;
      if (subtitleNorm && normalizeCompareText(text) === subtitleNorm) {
        // Don't repeat the subtitle. Keep scanning for the next usable text.
        continue;
      }

      collected.push(text);
      if (collected.join(" ").length >= maxLength * 1.2) break;
    }
    if (collected.join(" ").length >= maxLength * 1.2) break;
  }

  const combined = collected.join(" ").trim();
  if (!combined) return "";

  // Ensure a tight, cinematic excerpt (2–4 sentences).
  const sentences = splitIntoSentences(combined)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const picked = sentences.slice(0, 4);

  // If we only got 1 sentence but there are more, pick 2.
  const ensureMin = picked.length === 1 && sentences.length > 1 ? sentences.slice(0, 2) : picked;
  return clipText(ensureMin.join(" "), maxLength);
}

function normalizeCompareText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function splitIntoSentences(text) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (!value) return [];
  // Simple sentence split optimized for narration excerpts.
  const matches = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches || [value];
}

function renderActCards(groups) {
  return groups
    .filter((group) => group.kind === "act")
    .map((group) => {
      const info = getActInfo(group.act);
      const featured = group.docs.slice(0, 3);
      return `<article class="act-card">
        <div class="act-card-top">
          <span class="eyebrow">Act ${escapeHtml(group.act)}</span>
          <span class="card-time">${group.docs.length} pages</span>
        </div>
        <h3>${escapeHtml(info.title)}</h3>
        <p>${escapeHtml(info.summary)}</p>
        <div class="chip-row">
          ${featured.map((doc) => `<a class="chip" href="${doc.outputName}">${escapeHtml(doc.title)}</a>`).join("")}
        </div>
      </article>`;
    })
    .join("");
}

function renderModeCard(title, text) {
  return `<article class="mode-card">
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(text)}</p>
  </article>`;
}

function getBlueprintNarrative() {
  return {
    openingQuote:
      "For years, this looked like scattered ambition. To most people, it looked like someone who couldn't pick a lane. They were seeing fragments. They weren't seeing the architecture.",
    openingNarration:
      "For years, this looked like scattered ambition.\n\nMusic. Software. AI. Apparel. Drones. Automation. Education. Real estate. Storytelling.\n\nTo most people, it looked like someone who couldn't pick a lane.\n\nThey were seeing fragments.\n\nThey weren't seeing the architecture.",
    listenKicker:
      "This is not a corporate deck. It is the story of how a call-center operator, fraud/compliance thinker, builder, musician, and founder started turning scattered experiments into an operating ecosystem.",
    listenPanel:
      "Every page includes narration-ready copy and browser read-aloud controls. If generated audio exists, it plays. If not, the browser voice takes over.",
    startHref: "act-1.html",
  };
}

function getActInfo(act) {
  const map = {
    I: {
      title: "This Was Never Supposed To Happen",
      summary:
        "The origin story: pressure, broken systems, and the first reasons AeroVista had to exist.",
    },
    II: {
      title: "The Chaos Years",
      summary:
        "The phase where everything looked fragmented from the outside, but future infrastructure was quietly forming underneath.",
    },
    III: {
      title: "The Collapse Pattern",
      summary:
        "The internal bottlenecks: prerequisite spiraling, overengineering, and the hidden cost of preparing forever.",
    },
    IV: {
      title: "Building For Collapse",
      summary:
        "Resilience through ownership — NXCore-class thinking before the marketing claims catch up.",
    },
    V: {
      title: "The Soul Layer",
      summary:
        "Why media becomes strategic infrastructure — EchoVerse Audio framed as defensive soul, not garnish.",
    },
    VI: {
      title: "The Week Everything Connected",
      summary:
        "Major systems converge — Registry, AVCC expansion, MemoryMapping maturity, NXCore proof, monetization clarity.",
    },
    VII: {
      title: "What AeroVista Actually Is",
      summary:
        "Holding-company clarity: divisions named the way outsiders need to hear them.",
    },
    VIII: {
      title: "The Future",
      summary:
        "AI leverage, disciplined monetization, resilient infrastructure expansion, intentional legacy systems.",
    },
  };
  return map[act] || { title: `Act ${act}`, summary: "Part of the larger AeroVista documentary arc." };
}

function splitNarrationForAudio(text, maxChars) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }

    if ((current + "\n\n" + paragraph).length <= maxChars) {
      current += `\n\n${paragraph}`;
      continue;
    }

    if (current.length > maxChars) {
      chunks.push(...splitLongParagraph(current, maxChars));
      current = paragraph;
      continue;
    }

    chunks.push(current);
    current = paragraph;
  }

  if (current) {
    if (current.length > maxChars) {
      chunks.push(...splitLongParagraph(current, maxChars));
    } else {
      chunks.push(current);
    }
  }

  return chunks;
}

function splitLongParagraph(text, maxChars) {
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence.trim()}` : sentence.trim();
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      current = sentence.trim();
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function normalizeText(text) {
  const fixes = new Map([
    ["Ã¢â‚¬â€", "-"],
    ["Ã¢â‚¬â€œ", "-"],
    ["Ã¢â‚¬â„¢", "'"],
    ["Ã¢â‚¬Å“", '"'],
    ["Ã¢â‚¬Â", '"'],
    ["Ã¢â‚¬Â¦", "..."],
    ["Ã‚-", "-"],
    ["Ã‚", ""],
    ["â€™", "'"],
    ["â€œ", '"'],
    ["â€", '"'],
    ["â€¦", "..."],
    ["â€”", "-"],
    ["â€“", "-"],
  ]);

  let normalized = text;
  for (const [broken, fixed] of fixes.entries()) {
    normalized = normalized.split(broken).join(fixed);
  }

  return normalized.replace(/\u00a0/g, " ").trim();
}

function cleanNarrationPart(text) {
  return text
    .replace(/\[(pause|long pause|slow|whisper|emphasis)\]/gi, "")
    .replace(/\s+/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/(\.\.\.)+/g, "...")
    .replace(/\s*-\s*/g, ". ")
    .replace(/\s*:\s*/g, ": ")
    .replace(/\.{3,}/g, "... ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function stripMarkdownDecoration(text) {
  return text
    .replace(/^#+\s*/, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

function dropLeadingNonEmptyLines(text, count) {
  if (!count) return text;
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let remaining = count;
  const kept = [];
  for (const line of lines) {
    if (remaining > 0 && line.trim()) {
      remaining -= 1;
      continue;
    }
    kept.push(line);
  }
  return kept.join("\n").trim();
}

function isContainerTitle(text) {
  return /voice|master outline|project blueprint|readme/i.test(text);
}

function humanizeName(fileName) {
  return fileName
    .replace(/\.md$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRoman(value) {
  return String(value).toUpperCase();
}

function romanToNumber(value) {
  const normalized = String(value).toUpperCase();
  const map = { I: 1, V: 5, X: 10 };
  let total = 0;
  let previous = 0;
  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const current = map[normalized[index]] || Number(normalized[index]) || 0;
    if (current < previous) total -= current;
    else total += current;
    previous = current;
  }
  return total || Number(value) || 0;
}

function scoreTheme(haystack, keywords) {
  return keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0);
}

function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function typeToLabel(type) {
  switch (type) {
    case "outline":
      return "Master outline";
    case "voice-script":
      return "Voice script";
    case "blueprint":
      return "Project blueprint";
    case "reference":
      return "Reference";
    default:
      return "Story page";
  }
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function clipText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function themeStyle(theme) {
  const palette = theme.palette;
  return [
    `--bg:${palette.bg}`,
    `--bg-soft:${palette.bgSoft}`,
    `--panel:${palette.panel}`,
    `--panel-soft:${palette.panelSoft}`,
    `--text:${palette.text}`,
    `--muted:${palette.muted}`,
    `--accent:${palette.accent}`,
    `--accent-alt:${palette.accentAlt}`,
    `--line:${palette.line}`,
    `--glow:${palette.glow}`,
  ].join(";");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

