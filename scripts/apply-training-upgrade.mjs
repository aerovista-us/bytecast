#!/usr/bin/env node
/**
 * Apply training_upgrade_overlays.json to bytecast_ep_profile.json files.
 * - Adds teaching_mode, lesson shape, thread_tags, related_next, handoff
 * - Creates missing profiles (Apparel, Contributor hub)
 * - Syncs inline PROFILE blocks in select HTML packs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const catalogPath = path.join(repoRoot, "data", "catalog.json");
const overlaysPath = path.join(repoRoot, "data", "training_upgrade_overlays.json");

main();

function main() {
  const catalog = readJson(catalogPath, "catalog");
  const overlays = readJson(overlaysPath, "training upgrade overlays");
  const episodes = catalog?.episode_registry?.episodes || [];
  const seriesDefaults = overlays.series_defaults || {};
  const profileOverrides = overlays.profile_path_overrides || {};
  const inlineHtml = overlays.inline_profile_html || {};
  const episodeOverlays = overlays.episodes || {};

  const bySeries = groupBySeries(episodes);
  let updated = 0;
  let created = 0;

  for (const ep of episodes) {
    const slug = ep.slug;
    const overlay = episodeOverlays[slug] || {};
    const seriesId = ep.series_id;
    const defaults = seriesDefaults[seriesId] || {};

    const profileRel =
      profileOverrides[slug] || path.join(ep.primary_path, "bytecast_ep_profile.json");
    const profilePath = path.join(repoRoot, profileRel);

    let profile = null;
    if (existsSync(profilePath)) {
      profile = readJson(profilePath, profileRel);
    } else if (overlay.create_if_missing) {
      profile = buildSkeleton(ep, defaults, overlay);
      ensureDir(path.dirname(profilePath));
      created++;
    } else {
      console.warn(`skip (no profile): ${slug} -> ${profileRel}`);
      continue;
    }

    applyDefaults(profile, defaults);
    applyOverlay(profile, overlay, ep);
    applySeriesNavigation(profile, ep, bySeries[seriesId] || [], profileOverrides);

    if (overlay.activate && profile.episode?.status === "draft") {
      profile.episode.status = "active";
    }

    mergeQuizExtras(profile, overlay.quiz_extra);

    writeJson(profilePath, profile);
    updated++;

    if (inlineHtml[slug]) {
      syncInlineProfile(path.join(repoRoot, inlineHtml[slug]), profile);
    }

    console.log(`upgraded: ${slug}`);
  }

  console.log(`Training upgrade applied (${updated} profile(s), ${created} created).`);
}

function groupBySeries(episodes) {
  const map = {};
  for (const ep of episodes) {
    if (!map[ep.series_id]) map[ep.series_id] = [];
    map[ep.series_id].push(ep);
  }
  for (const list of Object.values(map)) {
    list.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }
  return map;
}

function buildSkeleton(ep, defaults, overlay) {
  const profile = {
    schema: "bytecast-ep-profile-v1",
    teaching_mode: defaults.teaching_mode || "GuidedAudioSlides",
    episode: {
      code: ep.episode_code,
      title: ep.title,
      type: "training",
      date: new Date().toISOString().slice(0, 10),
      runtime_target_minutes: 12,
      status: ep.status || "active",
    },
    content: {
      tags: [...(defaults.thread_tags || [])],
      summary_short: ep.title,
    },
    media: { audio_files: [] },
    engagement: {
      quiz: {
        enabled: true,
        pass_threshold: 0.8,
        questions: [],
      },
    },
  };

  if (overlay.media) {
    profile.media = deepMerge(profile.media, overlay.media);
  }
  if (overlay.content) {
    profile.content = { ...profile.content, ...overlay.content };
  }

  if (ep.slug.startsWith("av_apparel_")) {
    profile.slides = apparelSlides(ep.slug);
    profile.engagement.quiz.questions = apparelQuiz(ep.slug);
  }

  if (ep.slug === "contributing_non_coders") {
    profile.episode.type = "hub";
    profile.engagement.quiz.enabled = false;
  }

  return profile;
}

function apparelSlides(slug) {
  const common = {
    av_apparel_ep1_welcome: [
      {
        id: "welcome",
        title: "Welcome to AV Apparel",
        goal: "Set culture and expectations before catalog work.",
        bullets: [
          "Apparel is customer-facing — copy and inventory truth matter.",
          "Start in Lane A/B until you have two clean PRs.",
          "Your first win is a small, reviewable catalog improvement.",
        ],
      },
      {
        id: "lanes",
        title: "Contributor lanes",
        goal: "Know what you can touch on day one.",
        bullets: [
          "Lane A: markdown, copy, images, catalog entries.",
          "Lane B: static UI and accessibility fixes.",
          "Lane C: backend/infra — elevated access only.",
        ],
      },
    ],
    av_apparel_ep2_catalog: [
      {
        id: "loop",
        title: "Catalog maintainer loop",
        goal: "Run intake → edit → QA → publish.",
        bullets: [
          "Verify SKU, price, and collection membership before publish.",
          "Use SOT.json in this pack as the canon checklist.",
          "Log proof: screenshot or PR link in your work order.",
        ],
      },
    ],
    av_apparel_ep3_ops_standards: [
      {
        id: "standards",
        title: "Ops standards",
        goal: "Naming, copy, collections, QA, access.",
        bullets: [
          "Naming follows division + product + variant conventions.",
          "Copy must be customer-safe and legally cautious.",
          "QA includes links, images, and mobile preview.",
        ],
      },
    ],
  };
  return common[slug] || [];
}

function apparelQuiz(slug) {
  const quizzes = {
    av_apparel_ep1_welcome: [
      {
        id: "app1_q1",
        q: "A new contributor should start in:",
        choices: ["Lane C immediately", "Lane A or B with small PRs", "Any lane they prefer"],
        answer_index: 1,
      },
      {
        id: "app1_q2",
        q: "First win means:",
        choices: ["A large refactor", "One reviewable catalog improvement", "Skipping QA"],
        answer_index: 1,
      },
    ],
    av_apparel_ep2_catalog: [
      {
        id: "app2_q1",
        q: "Before publish you should verify:",
        choices: ["Only the title", "SKU, price, collection, and links", "Nothing if it looks fine"],
        answer_index: 1,
      },
    ],
    av_apparel_ep3_ops_standards: [
      {
        id: "app3_q1",
        q: "Customer-facing copy should be:",
        choices: ["Whatever ships fastest", "Safe, accurate, and reviewable", "Copied from random sources"],
        answer_index: 1,
      },
    ],
  };
  return quizzes[slug] || [];
}

function applyDefaults(profile, defaults) {
  if (!defaults.teaching_mode) return;
  if (!profile.teaching_mode) {
    profile.teaching_mode = defaults.teaching_mode;
  }
}

function applyOverlay(profile, overlay, ep) {
  if (overlay.lesson) {
    profile.lesson = { ...(profile.lesson || {}), ...overlay.lesson };
  }

  if (overlay.thread_tags?.length) {
    profile.thread_tags = unique([...(profile.thread_tags || []), ...overlay.thread_tags]);
  }

  if (overlay.related_next?.length) {
    profile.related_next = overlay.related_next;
  }

  if (overlay.handoff) {
    profile.handoff = overlay.handoff;
  }

  if (overlay.content) {
    profile.content = { ...(profile.content || {}), ...overlay.content };
  }

  if (overlay.media) {
    profile.media = deepMerge(profile.media || { audio_files: [] }, overlay.media);
  }

  if (ep.teaching_mode && !profile.teaching_mode) {
    profile.teaching_mode = ep.teaching_mode;
  }
}

function applySeriesNavigation(profile, ep, seriesList, profileOverrides) {
  if (profile.related_next?.length) return;

  const idx = seriesList.findIndex((item) => item.slug === ep.slug);
  if (idx < 0 || idx >= seriesList.length - 1) return;

  const next = seriesList[idx + 1];
  if (!next?.primary_path) return;

  const href = relativeHref(ep.primary_path, next.primary_path);
  profile.related_next = [
    {
      label: `Next: ${next.episode_code} — ${next.title}`,
      href,
    },
  ];
}

function relativeHref(fromPrimary, toPrimary) {
  const fromParts = fromPrimary.split("/");
  const toParts = toPrimary.split("/");
  const up = fromParts.length - 1;
  const prefix = "../".repeat(up);
  const target = toParts.slice(1).join("/");
  return `${prefix}${target}/index.html`;
}

function mergeQuizExtras(profile, extras) {
  if (!extras?.length) return;

  const engagement = profile.engagement || (profile.engagement = {});
  const quiz = engagement.quiz || (engagement.quiz = { enabled: true, questions: [] });
  if (!quiz.questions) quiz.questions = [];

  const existingIds = new Set(quiz.questions.map((q) => q.id));
  for (const q of extras) {
    if (!existingIds.has(q.id)) {
      quiz.questions.push(q);
      existingIds.add(q.id);
    }
  }
  quiz.enabled = true;
  if (!quiz.pass_threshold) quiz.pass_threshold = 0.8;
}

function syncInlineProfile(htmlPath, profile) {
  if (!existsSync(htmlPath)) {
    console.warn(`inline sync missing: ${htmlPath}`);
    return;
  }

  let html = readFileSync(htmlPath, "utf8");
  const marker = "const PROFILE =";
  const start = html.indexOf(marker);
  if (start < 0) {
    console.warn(`no inline PROFILE in ${htmlPath}`);
    return;
  }

  const jsonStart = html.indexOf("{", start);
  if (jsonStart < 0) return;

  let depth = 0;
  let end = -1;
  for (let i = jsonStart; i < html.length; i++) {
    const ch = html[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end < 0) return;

  const serialized = JSON.stringify(profile, null, 2).replace(/\//g, "\\/");
  const next = html.slice(0, jsonStart) + serialized + html.slice(end);
  writeFileSync(htmlPath, next, "utf8");
  console.log(`  synced inline PROFILE: ${path.relative(repoRoot, htmlPath)}`);
}

function deepMerge(base, patch) {
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = deepMerge(base?.[key] || {}, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function unique(list) {
  return [...new Set(list)];
}

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, label) {
  try {
    const raw = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to read ${label}: ${filePath} (${error.message})`);
  }
}

function writeJson(filePath, value) {
  writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}
