#!/usr/bin/env node
/**
 * Upgrade Agent Days 2–10 with interactive journey stepper + practice labs.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INTERACTIVE_LABS_BY_DAY, renderAgentDayShell } from "./lib/agent-day-interactive-shell.mjs";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const EARLY_DAYS = [
  {
    day: 2,
    slug: "finding_source_of_truth",
    code: "AGENT-D2",
    prefix: "sot",
    gateField: "day2_gate",
    shortTitle: "Finding the Source of Truth",
    summary_short:
      "Authority ladder, truth labels, source checks, conflicts, evidence packets, and Source-of-Truth Drill.",
    law: "Before you act, know what you are trusting.",
    docDir: "agent_day2",
    theme: { neon: "#2dd4bf", accent: "#5eead4", name: "source-of-truth" }
  },
  {
    day: 3,
    slug: "from_signal_to_action",
    code: "AGENT-D3",
    prefix: "avcc",
    gateField: "day3_gate",
    shortTitle: "From Signal to Action",
    summary_short: "AVCC judgment chain, COS brief, P1/P2/P3 priority, and Signal-to-Action Brief.",
    law: "Judgment, not noise — protect operator focus.",
    docDir: "agent_day3",
    theme: { neon: "#f59e0b", accent: "#a78bfa", name: "signal-to-action" }
  },
  {
    day: 4,
    slug: "the_handoff_is_the_work",
    code: "AGENT-D4",
    prefix: "handoff",
    gateField: "day4_gate",
    shortTitle: "The Handoff Is the Work",
    summary_short: "Trail System, Handoff Packet, EOD Capsule discipline, and Agent Handoff Packet drill.",
    law: "If the next agent cannot continue, the work is not finished.",
    docDir: "agent_day4",
    theme: { neon: "#84cc16", accent: "#d4a574", name: "handoff-is-the-work" }
  }
];

const DAY_LINKS = [
  { day: 1, slug: "the_first_door" },
  { day: 2, slug: "finding_source_of_truth" },
  { day: 3, slug: "from_signal_to_action" },
  { day: 4, slug: "the_handoff_is_the_work" },
  { day: 5, slug: "working_the_queue" },
  { day: 6, slug: "safe_access_boundaries" },
  { day: 7, slug: "builder_client_experience" },
  { day: 8, slug: "writing_like_aerovista" },
  { day: 9, slug: "from_draft_to_deliverable" },
  { day: 10, slug: "trusted_agent_capstone" }
];

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function writeJson(p, data) {
  writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function prevDays(day) {
  return DAY_LINKS.filter((d) => d.day < day).map((d) => ({
    day: d.day,
    href: `../${d.slug}/index.html`
  }));
}

function referencePanels(profile, day) {
  if (day === 2) {
    return [
      {
        type: "cards",
        title: "Authority Ladder",
        items: (profile.authority_ladder || []).map((r) => ({
          label: `Rung ${r.rung}`,
          title: r.name,
          body: r.note
        }))
      },
      {
        type: "cards",
        title: "Truth Labels",
        items: (profile.truth_labels || []).map((t) => ({
          label: t.label,
          title: t.label,
          body: t.meaning
        }))
      },
      {
        type: "steps",
        title: "Source Check Method",
        items: profile.source_check_steps || []
      }
    ];
  }
  if (day === 3) {
    return [
      {
        type: "steps",
        title: "AVCC Judgment Chain",
        items: profile.judgment_chain || []
      },
      {
        type: "cards",
        title: "COS Brief Sections",
        items: (profile.cos_brief_sections || []).map((s, i) => ({
          label: String(i + 1),
          title: s,
          body: ""
        }))
      },
      {
        type: "cards",
        title: "Priority Filter",
        items: (profile.priority_levels || []).map((p) => ({
          label: p.level,
          title: p.level,
          body: p.when
        }))
      }
    ];
  }
  if (day === 4) {
    return [
      {
        type: "cards",
        title: "Trail System",
        items: (profile.trail_system || []).map((t) => ({
          label: t.surface,
          title: t.surface,
          body: t.when
        }))
      },
      {
        type: "steps",
        title: "Handoff Packet",
        items: profile.handoff_packet_sections || []
      },
      {
        type: "steps",
        title: "EOD Capsule",
        items: profile.eod_capsule_formula || [
          "Today I learned",
          "Today I verified",
          "Still unknown",
          "Recommended next move"
        ]
      }
    ];
  }
}

function patchRuntime(profile, spec) {
  const slug = spec.slug;
  const prefix = spec.prefix;
  profile.teaching_mode = "InteractiveScript";
  profile.episode_gate = profile.episode_gate || profile[spec.gateField];
  profile.reference_panels = referencePanels(profile, spec.day);
  profile.interactives = {
    day: spec.day,
    journey_mode: "stepper",
    segment_visuals: true,
    labs_required: true,
    labs: INTERACTIVE_LABS_BY_DAY[spec.day] || []
  };
  profile.episode_runtime = {
    day: spec.day,
    prefix,
    law: spec.law || profile.content?.key_line,
    prev_days: prevDays(spec.day),
    storage: {
      segments: `bc.${slug}.segments.v1`,
      gate: `bc.${slug}.gate.v1`,
      quiz: `bc.${slug}.quiz.v1`,
      prove: `bc.${slug}.prove.v1`,
      stepper: `bc.${slug}.stepper.v1`,
      labs: `bc.${slug}.labs.v1`
    },
    workflow: {
      gate: `${prefix}_gate`,
      segments: `${prefix}_segments`,
      engage: `${prefix}_engage`,
      prove: `${prefix}_prove`,
      complete: `${prefix}_gates`
    },
    prove_complete_message: `Day ${spec.day} complete.`,
    prove_saved_message: "Drill submitted.",
    prove_meta: { drillType: slug }
  };
  return profile;
}

function upgradeEarlyDay(spec) {
  const epDir = path.join(repoRoot, "episodes", spec.slug);
  const profilePath = path.join(epDir, "bytecast_ep_profile.json");
  if (!existsSync(profilePath)) {
    console.warn(`skip (no profile): ${spec.slug}`);
    return;
  }
  const profile = patchRuntime(readJson(profilePath), spec);
  writeJson(profilePath, profile);
  writeFileSync(path.join(epDir, "index.html"), renderAgentDayShell(spec), "utf8");
  console.log(`upgraded: Day ${spec.day} ${spec.slug}`);
}

function upgradeDay510(slug, day) {
  const epDir = path.join(repoRoot, "episodes", slug);
  const profilePath = path.join(epDir, "bytecast_ep_profile.json");
  if (!existsSync(profilePath)) return;
  const profile = readJson(profilePath);
  const rt = profile.episode_runtime || {};
  profile.teaching_mode = "InteractiveScript";
  profile.interactives = {
    day,
    journey_mode: "stepper",
    segment_visuals: true,
    labs_required: true,
    labs: INTERACTIVE_LABS_BY_DAY[day] || []
  };
  if (rt.storage) {
    rt.storage.stepper = rt.storage.stepper || `bc.${slug}.stepper.v1`;
    rt.storage.labs = rt.storage.labs || `bc.${slug}.labs.v1`;
  }
  profile.episode_runtime = rt;
  writeJson(profilePath, profile);

  const spec = {
    day,
    slug,
    code: profile.episode?.code || `AGENT-D${day}`,
    shortTitle: (profile.episode?.title || "").replace(/\s*[—–-]\s*Agent Day.*$/i, "").trim(),
    summary_short: profile.content?.summary_short || "",
    docDir: `agent_day${day}`,
    theme: themeForDay(day)
  };
  writeFileSync(path.join(epDir, "index.html"), renderAgentDayShell(spec), "utf8");
  console.log(`upgraded: Day ${day} ${slug}`);
}

function themeForDay(day) {
  const themes = {
    5: { neon: "#f59e0b", accent: "#fbbf24", name: "working-the-queue" },
    6: { neon: "#f472b6", accent: "#fb7185", name: "safe-access-boundaries" },
    7: { neon: "#60a5fa", accent: "#38bdf8", name: "builder-client-experience" },
    8: { neon: "#a78bfa", accent: "#c4b5fd", name: "writing-like-aerovista" },
    9: { neon: "#34d399", accent: "#6ee7b7", name: "from-draft-to-deliverable" },
    10: { neon: "#22a7ff", accent: "#a66bff", name: "trusted-agent-capstone" }
  };
  return themes[day] || { neon: "#22a7ff", accent: "#a66bff", name: `agent-day-${day}` };
}

for (const spec of EARLY_DAYS) upgradeEarlyDay(spec);
for (const { day, slug } of DAY_LINKS.filter((d) => d.day >= 5)) upgradeDay510(slug, day);

console.log("Agent Days 2–10 interactive upgrade complete.");
