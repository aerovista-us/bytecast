#!/usr/bin/env node
/**
 * Build Agent Day 5–10 episode packs from episodes/gold.path reference scripts.
 * Generates profiles, HTML shells, docs copies, and patches catalog/journey/modules.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { INTERACTIVE_LABS_BY_DAY, renderAgentDayShell } from "./lib/agent-day-interactive-shell.mjs";

const repoRoot = process.cwd();
const goldPath = path.join(repoRoot, "episodes", "gold.path");

const DAY_SPECS = [
  {
    day: 5,
    slug: "working_the_queue",
    code: "AGENT-D5",
    title: "Working the Queue",
    shortTitle: "Working the Queue",
    theme: { neon: "#f59e0b", accent: "#fbbf24", name: "working-the-queue" },
    scriptFile: "day_05_working_the_queue_script.md",
    drillFile: "day_05_completion_drill_queue_triage_card.md",
    docDir: "agent_day5",
    docScript: "WORKING_THE_QUEUE_SCRIPT.md",
    prefix: "queue",
    runtime_minutes: 25,
    key_line: "Work the queue. Leave it clearer than you found it.",
    summary_short:
      "Learn queue triage without open-front chaos — P1/P2/P3, active/blocked/parked states, intake filter, One-Action Rule, and Queue Triage Card.",
    law: "Work the queue.",
    gate_items: [
      "I completed Agent Days 1–4 (doors, source-of-truth, AVCC judgment, handoff discipline).",
      "I understand a queue is a decision surface — not a junk drawer or panic board.",
      "I will set priority and state honestly — no priority inflation or ghost tasks.",
      "I will use the One-Action Rule and define done before starting work.",
      "I will protect confidential details in queue labels and update surfaces."
    ],
    reference_panels: [
      {
        type: "cards",
        title: "Priority lanes",
        items: [
          { label: "P1", title: "Critical", body: "Trust, security, live service, client delivery, access, or data integrity at risk." },
          { label: "P2", title: "High", body: "Active milestones, client commitments, release follow-up, cross-division deliverables." },
          { label: "P3", title: "Standard", body: "Useful cleanup and polish — must not steal oxygen from P1/P2." }
        ]
      },
      {
        type: "list",
        title: "Queue states",
        items: ["Active — owned work in motion", "Blocked — named obstacle", "Parked — intentional pause", "Waiting — next move is someone else's", "Done — output + trail updated"]
      },
      {
        type: "steps",
        title: "Intake filter",
        items: [
          "Capture the request in plain language",
          "Identify the lane owner",
          "Name the output",
          "Set priority (P1/P2/P3)",
          "Define done — no output, no task"
        ]
      }
    ],
    quiz: [
      { id: "d5_q1", q: "A queue inside AeroVista is best described as:", choices: ["A junk drawer for ideas", "A decision surface with priority and state", "A list sorted by newest file"], answer_index: 1 },
      { id: "d5_q2", q: "Priority inflation means:", choices: ["Everything labeled P1 so nothing is truly critical", "Using P3 for security incidents", "Closing tasks too fast"], answer_index: 0 },
      { id: "d5_q3", q: "A task with no owner is:", choices: ["Active", "Floating — not truly active", "Automatically P1"], answer_index: 1 },
      { id: "d5_q4", q: "The One-Action Rule means:", choices: ["Open five fronts at once", "Choose one next action that moves the item forward", "Wait for perfect information"], answer_index: 1 },
      { id: "d5_q5", q: "\"Blocked\" requires:", choices: ["A named, specific obstacle", "That the work feels hard", "Founder approval for all tasks"], answer_index: 0 },
      { id: "d5_q6", q: "Done without trail is:", choices: ["Acceptable for P3", "Not done", "Fine if the code compiled"], answer_index: 1 }
    ],
    prove_title: "Queue Triage Card + One-Action Commitment",
    prove_desc: "Triage a real or simulated queue item — demonstrate state clarity, not vague busyness."
  },
  {
    day: 6,
    slug: "safe_access_boundaries",
    code: "AGENT-D6",
    title: "Safe Access, Roles, and Public/Private Boundaries",
    shortTitle: "Safe Access & Boundaries",
    theme: { neon: "#ef4444", accent: "#f87171", name: "safe-access" },
    scriptFile: "day_06_safe_access_roles_public_private_boundaries_script.md",
    drillFile: "day_06_completion_drill_access_boundary_review.md",
    docDir: "agent_day6",
    docScript: "SAFE_ACCESS_BOUNDARIES_SCRIPT.md",
    prefix: "access",
    runtime_minutes: 28,
    key_line: "Known identity, correct role, narrow scope, right environment, minimum data, recorded action.",
    summary_short:
      "Protect trust while working with roles, identity, authorization, scope, environments, public/private surfaces, and access incidents.",
    law: "Protect the boundary.",
    gate_items: [
      "I completed Agent Days 1–5.",
      "I will not self-grant access, guess roles, or confuse authentication with authorization.",
      "I understand public, authenticated, role-restricted, internal, restricted, and secret data classes.",
      "I will fail closed when access is unclear and escalate exposure risks as P1.",
      "I will record access changes with an audit trail."
    ],
    reference_panels: [
      {
        type: "cards",
        title: "Access layers",
        items: [
          { label: "Identity", title: "Who is the actor?", body: "Founder, operator, builder, client, public visitor, agent, or service." },
          { label: "AuthN", title: "Authentication", body: "Proved identity — not permission." },
          { label: "AuthZ", title: "Authorization", body: "What they may do, where, and for how long." }
        ]
      },
      {
        type: "list",
        title: "Data sensitivity classes",
        items: ["Public — intentionally safe for anyone", "Authenticated — known user, role may still apply", "Role-restricted — operator/builder lanes", "Internal — AeroVista-only surfaces", "Restricted — legal, client contracts, incident notes", "Secret — credentials and keys — escalate immediately"]
      },
      {
        type: "steps",
        title: "Safe Access Checklist",
        items: ["Actor", "Role", "Scope", "Action", "Environment", "Time", "Data visible", "Evidence", "Approval", "Audit trail"]
      }
    ],
    quiz: [
      { id: "d6_q1", q: "Authentication proves:", choices: ["What the actor may do", "Who the actor is", "That data is public"], answer_index: 1 },
      { id: "d6_q2", q: "AeroVista agents should:", choices: ["Self-grant when helpful", "Never self-grant access", "Share credentials in handoffs"], answer_index: 1 },
      { id: "d6_q3", q: "A builder seeing another builder's private draft is:", choices: ["Normal", "An access failure", "A P3 cleanup item"], answer_index: 1 },
      { id: "d6_q4", q: "When you see a secret in a log or file:", choices: ["Paste it into the handoff", "Treat as security event and escalate", "Ignore it"], answer_index: 1 },
      { id: "d6_q5", q: "Fail closed means:", choices: ["Grant more access to test", "Restrict or hide until verified", "Publish and fix later"], answer_index: 1 },
      { id: "d6_q6", q: "Public visitor access should be:", choices: ["Intentionally public content only", "Any page that loads in a browser", "All authenticated dashboards"], answer_index: 0 }
    ],
    prove_title: "Access Boundary Review + Role-Scope Checklist",
    prove_desc: "Review a real or simulated access scenario — classify layers, severity, and safe interim action."
  },
  {
    day: 7,
    slug: "builder_client_experience",
    code: "AGENT-D7",
    title: "Builder and Client Experience: Serving Without Exposing the System",
    shortTitle: "Builder & Client Experience",
    theme: { neon: "#38bdf8", accent: "#7dd3fc", name: "builder-client" },
    scriptFile: "day_07_builder_client_experience_script.md",
    drillFile: "day_07_completion_drill_builder_client_experience_card.md",
    docDir: "agent_day7",
    docScript: "BUILDER_CLIENT_EXPERIENCE_SCRIPT.md",
    prefix: "serve",
    runtime_minutes: 28,
    key_line: "Serve the person. Protect the system. Translate the complexity.",
    summary_short:
      "Help builders, clients, and prospects with the smallest complete answer — expose, summarize, or withhold internal detail appropriately.",
    law: "Serve without exposing the system.",
    gate_items: [
      "I completed Agent Days 1–6.",
      "I will give outside people the door, not the whole engine room.",
      "I understand builder, client, and prospect experiences need different answers.",
      "I will not overpromise live features, pricing, timelines, or legal terms without verification.",
      "I will escalate authority I do not have instead of improvising commitments."
    ],
    reference_panels: [
      {
        type: "cards",
        title: "Three outside experiences",
        items: [
          { label: "Builder", title: "Creator lane", body: "Welcome, clear limits, ownership clarity, next step — not internal controls." },
          { label: "Client", title: "Engagement lane", body: "Scope, deliverables, rhythm, boundaries — guided, not dragged through internal chaos." },
          { label: "Prospect", title: "Decision lane", body: "Clarity and safe next step — no dumping every system name at once." }
        ]
      },
      {
        type: "list",
        title: "Expose · Summarize · Withhold",
        items: ["Expose — public URLs, approved steps, milestones, contact paths", "Summarize — investigation status without backend jargon", "Withhold — secrets, logs, other users' data, unreleased strategy"]
      },
      {
        type: "steps",
        title: "Outside-facing response formula",
        items: ["Acknowledge", "Clarify the goal", "Give the safe answer", "State one next step", "Set boundary if needed", "Close cleanly"]
      }
    ],
    quiz: [
      { id: "d7_q1", q: "Experience translation means:", choices: ["Hiding all truth from outsiders", "Making truth useful without exposing machinery", "Sharing internal registry details"], answer_index: 1 },
      { id: "d7_q2", q: "A prospect needs:", choices: ["Every division map", "Clarity and a believable path", "Internal queue state"], answer_index: 1 },
      { id: "d7_q3", q: "Before promising a feature is live:", choices: ["Assume it shipped", "Verify release/registry state", "Trust the oldest doc"], answer_index: 1 },
      { id: "d7_q4", q: "When legal or pricing authority is missing:", choices: ["Improvise to keep momentum", "Escalate to the correct approval lane", "Ignore the question"], answer_index: 1 },
      { id: "d7_q5", q: "Builders should feel:", choices: ["Interrogated", "Welcomed with clear next steps", "Given founder dashboards"], answer_index: 1 },
      { id: "d7_q6", q: "Internal phrase \"registry mismatch\" becomes externally:", choices: ["\"Backend /me returned null\"", "\"Your account isn't connected yet — we're fixing the path\"", "\"Check the internal ledger\""], answer_index: 1 }
    ],
    prove_title: "Builder/Client Response Card + Translation Drill",
    prove_desc: "Practice outside-facing language on a builder, client, or prospect scenario."
  },
  {
    day: 8,
    slug: "writing_like_aerovista",
    code: "AGENT-D8",
    title: "Writing Like AeroVista: Clear, Useful, and Evidence-Based",
    shortTitle: "Writing Like AeroVista",
    theme: { neon: "#a78bfa", accent: "#c4b5fd", name: "writing-aerovista" },
    scriptFile: "day_08_writing_like_aerovista_script.md",
    drillFile: "day_08_completion_drill_aerovista_writing_pass.md",
    docDir: "agent_day8",
    docScript: "WRITING_LIKE_AEROVISTA_SCRIPT.md",
    prefix: "writing",
    runtime_minutes: 28,
    key_line: "Clear. Useful. Evidence-based. Help the next person move.",
    summary_short:
      "Produce docs, briefs, scripts, and messages that guide action — audience-aware, bounded, and grounded in evidence.",
    law: "Write to move work.",
    gate_items: [
      "I completed Agent Days 1–7.",
      "I treat writing as infrastructure — not decoration or performance.",
      "I will match audience, surface, and sensitivity before drafting.",
      "I will separate verified, reported, inferred, and unknown in operational writing.",
      "I will revise for clarity and usefulness before polish or style."
    ],
    reference_panels: [
      {
        type: "list",
        title: "AeroVista writing standard",
        items: ["Clear — one main point per block", "Useful — names next action and owner", "Evidence-based — labels what was verified", "Audience-aware — internal vs client vs public", "Bounded — no overpromise or exposure"]
      },
      {
        type: "steps",
        title: "Writing pass order",
        items: ["Purpose and audience", "Core claim or decision", "Evidence and labels", "Next action", "Boundary or risk", "Trim fog and jargon", "Final readability check"]
      }
    ],
    quiz: [
      { id: "d8_q1", q: "AeroVista writing should first:", choices: ["Sound impressive", "Help the next person move", "Use maximum jargon"], answer_index: 1 },
      { id: "d8_q2", q: "A vague handoff can:", choices: ["Reopen solved work", "Always save time", "Replace the registry"], answer_index: 0 },
      { id: "d8_q3", q: "Evidence-based writing:", choices: ["Labels verification status", "Hides all uncertainty", "Uses vibes when faster"], answer_index: 0 },
      { id: "d8_q4", q: "Public writing requires:", choices: ["Extra boundary checks", "Pasting internal URLs for proof", "Full architecture dumps"], answer_index: 0 },
      { id: "d8_q5", q: "Polish should come:", choices: ["Before clarity", "After clarity and usefulness", "Instead of structure"], answer_index: 1 },
      { id: "d8_q6", q: "Cyberpunk fog in ops docs:", choices: ["Signals expertise", "Hides the decision — cut it", "Is required for ByteCast tone"], answer_index: 1 }
    ],
    prove_title: "AeroVista Writing Pass + Evidence-Based Rewrite",
    prove_desc: "Rewrite a fuzzy operational paragraph into clear, useful, evidence-labeled prose."
  },
  {
    day: 9,
    slug: "from_draft_to_deliverable",
    code: "AGENT-D9",
    title: "From Draft to Deliverable: Finishing the Slice",
    shortTitle: "From Draft to Deliverable",
    theme: { neon: "#fb7185", accent: "#fda4af", name: "draft-deliverable" },
    scriptFile: "day_09_from_draft_to_deliverable_script.md",
    drillFile: "day_09_completion_drill_deliverable_readiness_card.md",
    docDir: "agent_day9",
    docScript: "FROM_DRAFT_TO_DELIVERABLE_SCRIPT.md",
    prefix: "deliver",
    runtime_minutes: 28,
    key_line: "Define done. Finish the slice. Ship usable proof.",
    summary_short:
      "Define done, prevent scope creep, verify acceptance criteria, polish in order, and package work as a usable deliverable.",
    law: "Finish the slice.",
    gate_items: [
      "I completed Agent Days 1–8.",
      "I will define done before expanding scope.",
      "I understand drafted ≠ published ≠ adopted.",
      "I will verify acceptance criteria against evidence — not intention.",
      "I will package deliverables with handoff and update surfaces."
    ],
    reference_panels: [
      {
        type: "list",
        title: "Done vs almost done",
        items: ["Output exists in the right place", "Acceptance criteria met with evidence", "State labels are honest", "Handoff written if another agent continues", "Queue/backlog updated", "No silent scope creep"]
      },
      {
        type: "steps",
        title: "Deliverable polish order",
        items: ["Correctness and scope", "Evidence and labels", "Usability for the recipient", "Navigation and links", "Style and tone last"]
      }
    ],
    quiz: [
      { id: "d9_q1", q: "Scope creep often starts when:", choices: ["Done was never defined", "The quiz was too hard", "Audio was missing"], answer_index: 0 },
      { id: "d9_q2", q: "Drafted training scripts are:", choices: ["Shipped deliverables", "Not yet published deliverables", "Always adopted"], answer_index: 1 },
      { id: "d9_q3", q: "Acceptance criteria should be checked with:", choices: ["Evidence", "Confidence alone", "Newest chat message"], answer_index: 0 },
      { id: "d9_q4", q: "Polish order means:", choices: ["Style before correctness", "Correctness before cosmetic polish", "Skip verification"], answer_index: 1 },
      { id: "d9_q5", q: "A usable slice:", choices: ["Can be picked up by the next operator", "Must include every future idea", "Never needs a handoff"], answer_index: 0 },
      { id: "d9_q6", q: "Almost done without trail is:", choices: ["Good enough for P2", "Still not done", "Fine for internal only"], answer_index: 1 }
    ],
    prove_title: "Deliverable Readiness Card",
    prove_desc: "Define done and prove readiness for a real or simulated slice you are finishing."
  },
  {
    day: 10,
    slug: "trusted_agent_capstone",
    code: "AGENT-D10",
    title: "Operating as a Trusted Agent: Judgment, Boundaries, and Momentum",
    shortTitle: "Trusted Agent Capstone",
    theme: { neon: "#eab308", accent: "#fde047", name: "trusted-capstone" },
    scriptFile: "day_10_trusted_agent_capstone_script.md",
    drillFile: "day_10_completion_drill_trusted_agent_readiness_brief.md",
    docDir: "agent_day10",
    docScript: "TRUSTED_AGENT_CAPSTONE_SCRIPT.md",
    prefix: "capstone",
    runtime_minutes: 32,
    key_line: "Judgment. Boundaries. Momentum. Reduce chaos — produce clarity.",
    summary_short:
      "Capstone readiness gate: integrate Days 1–9 into judgment, boundaries, momentum, and a Trusted Agent Readiness Brief before supervised live work.",
    law: "Earn trust through operation.",
    gate_items: [
      "I completed Agent Days 1–9 (or received equivalent supervised briefing).",
      "I understand trusted ≠ merely helpful — trusted reduces chaos and produces clarity.",
      "I commit to the three-part standard: judgment, boundaries, momentum.",
      "I will escalate when uncertain rather than expand scope or exposure.",
      "I am submitting this capstone as my readiness checkpoint — not a formality."
    ],
    reference_panels: [
      {
        type: "cards",
        title: "Three-part trusted standard",
        items: [
          { label: "Judgment", title: "What matters", body: "Signal → context → priority → next action — not dashboard noise." },
          { label: "Boundaries", title: "What not to touch", body: "Access, legal, client data, secrets, overpromise — fail closed." },
          { label: "Momentum", title: "Finish slices", body: "One action, defined done, trail left — no infinite expansion." }
        ]
      },
      {
        type: "list",
        title: "Days 1–9 laws (spine)",
        items: [
          "Day 1 — Find the door",
          "Day 2 — Find the source",
          "Day 3 — Turn signal into action",
          "Day 4 — Leave the trail",
          "Day 5 — Work the queue",
          "Day 6 — Protect the boundary",
          "Day 7 — Serve without exposing",
          "Day 8 — Write clearly with evidence",
          "Day 9 — Finish the slice"
        ]
      }
    ],
    quiz: [
      { id: "d10_q1", q: "A trusted agent primarily:", choices: ["Produces more content", "Reduces chaos and produces clarity", "Memorizes every file"], answer_index: 1 },
      { id: "d10_q2", q: "Helpful but dangerous includes:", choices: ["Overpromising and exposing private data", "Leaving handoffs", "Using truth labels"], answer_index: 0 },
      { id: "d10_q3", q: "Momentum in the capstone means:", choices: ["Starting many fronts", "Finishing usable slices with trails", "Waiting for perfect plans"], answer_index: 1 },
      { id: "d10_q4", q: "Before supervised live work you should:", choices: ["Skip the capstone drill", "Complete readiness brief honestly", "Self-grant operator access"], answer_index: 1 },
      { id: "d10_q5", q: "Uncertainty should be:", choices: ["Hidden to sound confident", "Named and escalated when needed", "Converted to guesses"], answer_index: 1 },
      { id: "d10_q6", q: "The capstone integrates:", choices: ["Only Day 1 doors", "Days 1–9 operating laws", "Only writing skills"], answer_index: 1 }
    ],
    prove_title: "Trusted Agent Readiness Brief + Live Work Approval Checklist",
    prove_desc: "Honest capstone checkpoint — demonstrate integrated judgment, boundaries, and momentum."
  }
];

main();

function main() {
  for (const spec of DAY_SPECS) {
    buildEpisode(spec);
  }
  patchRegistries();
  writeUnifiedGoldManifest();
  console.log(`Built ${DAY_SPECS.length} Agent Day episodes (5–10).`);
}

function buildEpisode(spec) {
  const epDir = path.join(repoRoot, "episodes", spec.slug);
  const assetsDir = path.join(epDir, "assets");
  mkdirSync(assetsDir, { recursive: true });

  const scriptMd = readText(path.join(goldPath, spec.scriptFile));
  const drillMd = readText(path.join(goldPath, spec.drillFile));
  const sections = parseScriptSections(scriptMd);
  const proveFields = parseDrillFields(drillMd);

  const docDir = path.join(repoRoot, "docs", spec.docDir);
  mkdirSync(docDir, { recursive: true });
  writeFileSync(path.join(docDir, spec.docScript), scriptMd, "utf8");

  const prevDays = DAY_SPECS.filter((d) => d.day < spec.day).map((d) => ({
    day: d.day,
    href: `../${d.slug}/index.html`
  }));
  if (spec.day > 5) {
    prevDays.unshift({ day: 4, href: "../the_handoff_is_the_work/index.html" });
  } else {
    prevDays.unshift({ day: 4, href: "../the_handoff_is_the_work/index.html" });
  }

  const nextSpec = DAY_SPECS.find((d) => d.day === spec.day + 1);
  const related_next = nextSpec
    ? [{ label: `Next: Day ${nextSpec.day} — ${nextSpec.shortTitle}`, href: `../${nextSpec.slug}/index.html` }]
  : [
      {
        label: "Next: TR-001A — Day 1 Foundations Check",
        href: "../training_missions/tr_001a_day1_foundations/index.html"
      }
    ];

  const profile = {
    schema: "bytecast-ep-profile-v1",
    teaching_mode: "InteractiveScript",
    episode: {
      code: spec.code,
      title: `${spec.title} — Agent Day ${spec.day}`,
      type: "required",
      date: "2026-07-10",
      runtime_target_minutes: spec.runtime_minutes,
      status: "active"
    },
    content: {
      tags: [`agent-day${spec.day}`, "required", "onboarding", "golden-path", "getting-started"],
      hero_kicker: `Required · Agent Day ${spec.day}`,
      summary_short: spec.summary_short,
      summary_long: spec.summary_short,
      key_line: spec.key_line,
      start_here: `Complete the Day ${spec.day} gate, read or listen through all segments, pass the check, then submit your completion drill.`,
      narrator: "Byte",
      tone: "Operational, clear, grounded"
    },
    episode_gate: {
      title: `Day ${spec.day} Gate — ${spec.shortTitle}`,
      required: true,
      items: spec.gate_items
    },
    reference_panels: spec.reference_panels,
    script: { sections },
    prove: {
      title: spec.prove_title,
      description: spec.prove_desc,
      fields: proveFields
    },
    engagement: {
      quiz: {
        enabled: true,
        pass_threshold: 0.8,
        title: `${spec.shortTitle} Check`,
        questions: spec.quiz
      }
    },
    lesson: {
      objective: spec.summary_short,
      why_it_matters: `Day ${spec.day} extends the Agent onboarding spine — ${spec.law}`,
      apply: `Complete gate, segments, quiz, and ${spec.prove_title}.`,
      advance: nextSpec
        ? `Unlock Day ${nextSpec.day} — ${nextSpec.shortTitle} when ${spec.prefix}_prove is complete.`
        : "Unlock TR-001A and supervised live work checkpoints when capstone prove is complete."
    },
    thread_tags: [`day${spec.day}`, "required", "agent-orientation", "golden-path"],
    interactives: {
      day: spec.day,
      journey_mode: "stepper",
      segment_visuals: true,
      labs_required: true,
      labs: INTERACTIVE_LABS_BY_DAY[spec.day] || []
    },
    related_next,
    handoff: {
      label: "Open ByteCast home",
      href: "../training_hub/index.html",
      return_label: `Back to Day ${spec.day}`,
      return_href: "./index.html"
    },
    media: {
      audio_files: [],
      script_doc: `../../docs/${spec.docDir}/${spec.docScript}`,
      voiceover_sections: "assets/voiceover_sections.json",
      narration_manifest: "assets/narration.manifest.json"
    },
    episode_runtime: {
      day: spec.day,
      prefix: spec.prefix,
      law: spec.law,
      prev_days: [
        { day: 1, href: "../the_first_door/index.html" },
        { day: 2, href: "../finding_source_of_truth/index.html" },
        { day: 3, href: "../from_signal_to_action/index.html" },
        { day: 4, href: "../the_handoff_is_the_work/index.html" },
        ...DAY_SPECS.filter((d) => d.day < spec.day).map((d) => ({ day: d.day, href: `../${d.slug}/index.html` }))
      ],
      storage: {
        segments: `bc.${spec.slug}.segments.v1`,
        gate: `bc.${spec.slug}.gate.v1`,
        quiz: `bc.${spec.slug}.quiz.v1`,
        prove: `bc.${spec.slug}.prove.v1`,
        stepper: `bc.${spec.slug}.stepper.v1`,
        labs: `bc.${spec.slug}.labs.v1`
      },
      workflow: {
        gate: `${spec.prefix}_gate`,
        segments: `${spec.prefix}_segments`,
        engage: `${spec.prefix}_engage`,
        prove: `${spec.prefix}_prove`,
        complete: `${spec.prefix}_gates`
      },
      prove_complete_message: nextSpec
        ? `Day ${spec.day} complete. Continue to Day ${nextSpec.day} — ${nextSpec.shortTitle}.`
        : "Capstone complete. Continue to TR-001A when unlocked on the Golden Path.",
      prove_saved_message: `${spec.prove_title} submitted.`,
      prove_meta: { drillType: spec.slug }
    }
  };

  writeJson(path.join(epDir, "bytecast_ep_profile.json"), profile);
  writeFileSync(path.join(epDir, "index.html"), renderAgentDayShell(spec), "utf8");
  buildVoiceoverAndForge(spec, sections, profile);
}

function cleanSpeak(text) {
  return String(text || "")
    .replace(/\[SFX:[^\]]+\]/gi, "")
    .replace(/\*\*BYTE:\*\*\s*/gi, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function buildVoiceoverAndForge(spec, sections, profile) {
  const epDir = path.join(repoRoot, "episodes", spec.slug);
  const assetsDir = path.join(epDir, "assets");
  const voSections = sections.map((s) => {
    const displayText = (s.paragraphs || []).join("\n\n");
    const speakText = cleanSpeak(displayText.replace(/\n\n/g, " "));
    return {
      id: s.id,
      title: s.title,
      displayText,
      speakText
    };
  });
  const order = voSections.map((s) => s.id);
  const voPayload = {
    schema: "bytecast-voiceover-sections-v1",
    slug: spec.slug,
    code: spec.code,
    narrator: "Byte",
    sections: voSections,
    overviewOrder: order,
    heroSectionId: order[0] || "cold_open",
    segmentOrder: order
  };
  writeJson(path.join(assetsDir, "voiceover_sections.json"), voPayload);
  writeFileSync(
    path.join(assetsDir, "voiceover_sections.load.js"),
    `/** Auto-generated by build-agent-days-5-10.mjs */\nwindow.ByteCastVoiceoverSections = ${JSON.stringify(voPayload)};\n`,
    "utf8"
  );

  const day = spec.day;
  const packId = `agent_day${day}_${spec.prefix}`;
  const forgeDir = path.join(repoRoot, "tools", "narration", `agent_day${day}`);
  mkdirSync(forgeDir, { recursive: true });
  const lineIds = voSections.map((s) => s.id);
  const lines = voSections.map((s) => ({
    id: s.id,
    label: s.title,
    text: s.speakText,
    voiceRecipe: "byte-narrator"
  }));

  writeJson(path.join(forgeDir, "lines.master.json"), {
    schema: "narration-lines-master-v1",
    packId,
    episodeCode: spec.code,
    lines
  });
  writeJson(path.join(forgeDir, "sequences.json"), {
    schema: "narration-sequences-v1",
    packId,
    sequences: {
      full_journey: { label: `${spec.shortTitle} — full journey`, lineIds }
    },
    defaultSequence: "full_journey"
  });
  if (!existsSync(path.join(forgeDir, "voiceRecipes.json"))) {
    writeJson(path.join(forgeDir, "voiceRecipes.json"), {
      schema: "narration-voice-recipes-v1",
      recipes: {
        "byte-narrator": {
          label: `Byte — Agent Day ${day}`,
          engine: "piper",
          voice: "en_US-amy-medium",
          speed: day >= 8 ? 1.05 : 1.06,
          format: "wav"
        }
      }
    });
  }
  writeJson(path.join(forgeDir, "forge.config.json"), {
    schema: "narration-forge-config-v1",
    packId,
    episodeCode: spec.code,
    authoringRoot: `docs/${spec.docDir}`,
    linesMaster: `tools/narration/agent_day${day}/lines.master.json`,
    sequences: `tools/narration/agent_day${day}/sequences.json`,
    voiceRecipes: `tools/narration/agent_day${day}/voiceRecipes.json`,
    bindings: `tools/narration/agent_day${day}/bindings.json`,
    outputDir: `episodes/${spec.slug}/assets/narration`,
    runtimeManifest: `episodes/${spec.slug}/assets/narration.manifest.json`,
    shipFormat: "wav",
    tts: {
      provider: "nxcore-echoverse",
      endpoint: "/api/generate",
      envUrl: "NXCORE_TTS_URL",
      defaultUrl: "http://127.0.0.1:5315"
    }
  });
  writeJson(path.join(forgeDir, "bindings.json"), {
    schema: "narration-bindings-v1",
    packId,
    runtime: {
      player: "../../assets/shared/nxcore_narration_player.js",
      manifest: `episodes/${spec.slug}/assets/narration.manifest.json`,
      fallback: "assets/shared/listen_mode.js"
    },
    episode: { slug: spec.slug, listenGateStep: `${spec.prefix}_segments` }
  });

  profile.media = {
    ...(profile.media || {}),
    voiceover_sections: "assets/voiceover_sections.json",
    narration_manifest: "assets/narration.manifest.json",
    forge_pack: `tools/narration/agent_day${day}`
  };
  writeJson(path.join(epDir, "bytecast_ep_profile.json"), profile);
}

function parseScriptSections(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  let current = null;

  function flush() {
    if (!current) return;
    current.paragraphs = current.paragraphs.filter(Boolean);
    if (current.paragraphs.length) sections.push(current);
    current = null;
  }

  function looksLikeTime(s) {
    return /^\d{1,2}:\d{2}/.test(String(s || "").trim());
  }

  function startSection(rawTitle, rawTime = "") {
    flush();
    let title = String(rawTitle || "").trim();
    let time = String(rawTime || "").trim();
    if (!time && looksLikeTime(title)) {
      time = title;
      title = "Cold Open";
    }
    const id = slugify(title);
    current = { id, title, time, paragraphs: [] };
  }

  for (const line of lines) {
    if (line.startsWith("# ByteCast:")) continue;
    if (/^\*\*[A-Za-z]+:/.test(line)) continue;
    if (line === "---") continue;

    const bracket = line.match(/^##\s+\[([^\]]+)\]\s*$/);
    if (bracket) {
      const parts = bracket[1].split("|").map((p) => p.trim());
      if (parts.length >= 3) {
        startSection(parts[1], parts[2]);
      } else if (parts.length === 2) {
        startSection(parts[0], parts[1]);
      } else {
        startSection(parts[0]);
      }
      continue;
    }

    const h2seg = line.match(/^##\s+Segment\s+(\d+)\s+[—-]\s+(.+)$/);
    const h2close = line.match(/^##\s+Closing\s*$/);
    const h2plain = line.match(/^##\s+(.+?)(?:\s*[—-]\s*(.+))?$/);

    if (h2seg) {
      startSection(h2seg[2].trim());
      continue;
    }
    if (h2close) {
      startSection("Closing");
      continue;
    }
    if (h2plain && !line.includes("[")) {
      const title = h2plain[1].trim();
      const time = (h2plain[2] || "").trim();
      if (/^cold open/i.test(title)) {
        startSection("Cold Open", time);
      } else {
        startSection(title, time);
      }
      continue;
    }

    if (/^###\s+/.test(line)) {
      if (current) current.paragraphs.push(line.replace(/^###\s+/, "").trim());
      continue;
    }

    if (/^\[SFX:/.test(line) || /^\*\*BYTE:\*\*\s*$/.test(line)) continue;
    const cleaned = line
      .replace(/^\*\*BYTE:\*\*\s*/, "")
      .replace(/^\d+\.\s+\*\*(.+?)\*\*\s*/, "$1 — ")
      .trim();

    if (!current) continue;
    if (!cleaned) continue;
    if (cleaned.startsWith("## ")) continue;
    if (cleaned.startsWith("- ")) {
      current.paragraphs.push(cleaned.slice(2));
    } else {
      current.paragraphs.push(cleaned);
    }
  }
  flush();
  return sections;
}

function parseDrillFields(md) {
  const fields = [];
  const re = /^##\s+(\d+[a-z]?)\.\s+(.+)$/gm;
  let m;
  while ((m = re.exec(md))) {
    const label = `${m[1]}. ${m[2].trim()}`;
    const id = `field_${m[1].replace(/\./g, "_")}`;
    const multi =
      /write|explain|describe|list|rewrite|format|check all/i.test(m[2]) ||
      /card|note|response|brief|commitment|review|translation/i.test(m[2]);
    fields.push({ id, label, required: true, rows: multi ? 3 : 1 });
  }
  if (!fields.length) {
    fields.push({ id: "completion_notes", label: "Completion notes", required: true, rows: 4 });
  }
  return fields;
}

function renderHtml(spec) {
  const t = spec.theme;
  return `<!doctype html>
<html lang="en" data-theme="${t.name}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ByteCast — ${spec.shortTitle} · Agent Day ${spec.day}</title>
  <meta name="description" content="Required Agent Day ${spec.day}: ${spec.summary_short}" />
  <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="../../assets/shared/listen_mode.css" />
  <link rel="stylesheet" href="../../assets/shared/agent_day_theme.css" />
  <style>
    :root {
      --bg0:#040508; --bg1:#0a0e14; --panel:rgba(12,16,22,0.92);
      --ink:rgba(255,255,255,0.94); --muted:rgba(255,255,255,0.68); --faint:rgba(255,255,255,0.42);
      --neon:${t.neon}; --accent:${t.accent}; --mint:#34d399; --amber:#ffb020;
      --line:rgba(255,255,255,0.12); --max:1040px; --pad:clamp(16px,2.4vw,26px);
      --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      --sans:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;
    }
    *{box-sizing:border-box}
    body{margin:0;font-family:var(--sans);color:var(--ink);
      background:radial-gradient(900px 500px at 10% 0%,color-mix(in srgb, var(--neon) 14%, transparent),transparent 55%),
        radial-gradient(800px 480px at 100% 10%,color-mix(in srgb, var(--accent) 10%, transparent),transparent 50%),
        linear-gradient(180deg,var(--bg0),var(--bg1));min-height:100vh}
    a{color:inherit}
    .topbar{position:sticky;top:0;z-index:30;backdrop-filter:blur(14px);
      background:rgba(4,5,8,0.86);border-bottom:1px solid var(--line)}
    .topbar__inner,.wrap{max-width:var(--max);margin:0 auto}
    .topbar__inner{padding:12px var(--pad);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
    .wrap{padding:20px var(--pad) 80px}
    .k{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
    .btn{appearance:none;border:1px solid var(--line);background:rgba(255,255,255,0.04);color:var(--ink);
      border-radius:999px;padding:10px 14px;font:inherit;font-size:13px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
    .btn:hover{border-color:color-mix(in srgb, var(--neon) 35%, var(--line))}
    .btn--primary{border-color:color-mix(in srgb, var(--neon) 45%, var(--line));box-shadow:0 0 20px color-mix(in srgb, var(--neon) 14%, transparent)}
    .btn:disabled{opacity:.45;cursor:not-allowed}
    .btn--ghost{background:transparent;border-color:rgba(255,255,255,0.1)}
    .hero{padding:24px;border-radius:24px;border:1px solid var(--line);
      background:linear-gradient(135deg,color-mix(in srgb, var(--neon) 10%, transparent),color-mix(in srgb, var(--accent) 6%, transparent)),var(--panel);margin-bottom:16px}
    h1{margin:8px 0 10px;font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.02em}
    .sub{margin:0;color:var(--muted);line-height:1.6;max-width:72ch}
    .spine{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .spine span{font-family:var(--mono);font-size:11px;padding:6px 10px;border-radius:999px;border:1px solid color-mix(in srgb, var(--neon) 28%, var(--line));background:color-mix(in srgb, var(--neon) 8%, transparent)}
    .tabs{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
    .tab{border:1px solid var(--line);background:rgba(255,255,255,0.03);border-radius:999px;padding:8px 12px;font-size:12px;cursor:pointer}
    .tab[aria-selected="true"]{border-color:color-mix(in srgb, var(--neon) 45%, var(--line));background:color-mix(in srgb, var(--neon) 12%, transparent)}
    .tab.is-locked{opacity:.5}
    .panel{display:none;border:1px solid var(--line);border-radius:20px;background:var(--panel);padding:18px;margin-bottom:14px}
    .panel.is-active{display:block}
    .panel h2{margin:0 0 8px;font-size:1.05rem}
    .check{display:flex;gap:10px;align-items:flex-start;margin:10px 0;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06)}
    .check input{margin-top:3px}
    .seg{border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:14px;margin:10px 0;background:rgba(0,0,0,0.22)}
    .seg.is-done{border-color:color-mix(in srgb, var(--neon) 35%, transparent)}
    .seg h3{margin:0 0 6px;font-size:1rem}
    .seg .time{font-family:var(--mono);font-size:11px;color:var(--faint)}
    .seg p{margin:8px 0 0;line-height:1.6;color:var(--muted)}
    .ref-grid{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-top:12px}
    .ref-card{padding:12px;border-radius:14px;border:1px solid color-mix(in srgb, var(--neon) 22%, var(--line));background:color-mix(in srgb, var(--neon) 6%, transparent)}
    .ref-card--alt{border-color:color-mix(in srgb, var(--accent) 28%, var(--line));background:color-mix(in srgb, var(--accent) 6%, transparent)}
    .ref-card strong{display:block;margin-bottom:4px}
    .ref-card small{color:var(--faint);font-family:var(--mono);font-size:10px}
    .choice{display:block;margin:10px 0;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);cursor:pointer}
    .field{margin:12px 0}
    .field label{display:block;font-size:12px;color:var(--muted);margin-bottom:6px}
    .field input,.field textarea{width:100%;border:1px solid var(--line);border-radius:12px;background:rgba(0,0,0,0.35);color:var(--ink);padding:10px 12px;font:inherit}
    .field textarea{min-height:72px;resize:vertical}
    .status{margin-top:10px;font-size:13px;color:var(--mint)}
    .warn{color:var(--amber)}
    .progress{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
    .chip{font-family:var(--mono);font-size:11px;padding:5px 9px;border-radius:999px;border:1px solid var(--line)}
    .chip.done{border-color:rgba(52,211,153,0.4);color:var(--mint)}
    ol.steps{margin:8px 0 0;padding-left:1.2rem;color:var(--muted);line-height:1.7}
  </style>
</head>
<body data-bc-slug="${spec.slug}" data-bc-ep="${spec.code}" data-bc-agent-day-shell="1">
  <header class="topbar">
    <div class="topbar__inner">
      <span class="k">Required · Agent Day ${spec.day}</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap" id="prevDayNav"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="btn" href="../../seed_bytecast.html">Playlist</a>
        <a class="btn" href="../training_hub/index.html">Home</a>
      </div>
    </div>
  </header>
  <main class="wrap">
    <section class="hero">
      <p class="k" id="heroKicker">Loading…</p>
      <h1 id="heroTitle">${spec.shortTitle}</h1>
      <p class="sub" id="heroSub"></p>
      <nav class="day-spine" id="daySpine" aria-label="Agent Days 1–10"></nav>
      <div class="law-row" id="lawRow"></div>
      <div class="spine" id="spineChips"></div>
      <div class="progress" id="progressChips" aria-live="polite"></div>
    </section>
    <nav class="tabs" id="tabs" aria-label="Episode sections">
      <button type="button" class="tab" data-panel="gate" aria-selected="true">1 · Gate</button>
      <button type="button" class="tab is-locked" data-panel="journey">2 · Journey</button>
      <button type="button" class="tab is-locked" data-panel="ref">3 · Reference</button>
      <button type="button" class="tab is-locked" data-panel="engage">4 · Check</button>
      <button type="button" class="tab is-locked" data-panel="prove">5 · Prove</button>
    </nav>
    <section class="panel is-active" id="panel-gate">
      <h2 id="gateTitle">Day ${spec.day} Gate</h2>
      <p class="sub" id="gateIntro">Complete before continuing.</p>
      <div id="gateItems"></div>
      <button type="button" class="btn btn--primary" id="btnGate" disabled>Commit and continue</button>
      <p class="status" id="gateStatus"></p>
    </section>
    <section class="panel" id="panel-journey">
      <h2>The Journey — listen or read</h2>
      <p class="panel-tip">Use <strong>Play full journey</strong> for forged NXCore audio, the Listen panel for browser read-aloud, or <strong>Listen to section</strong> per segment below.</p>
      <p class="sub" id="listenHint">Script source: <code>docs/${spec.docDir}/</code> · Forge: <code>npm run forge:agent-day${spec.day}</code></p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">
        <button type="button" class="btn btn--primary" id="btnPlayForged">Play full journey (NXCore)</button>
        <button type="button" class="btn" id="btnStopForged">Stop audio</button>
      </div>
      <p class="status" id="forgedStatus" aria-live="polite"></p>
      <div id="listenModeMount" class="bytecast-listen-dim-exempt" style="margin:12px 0"></div>
      <div id="segments"></div>
      <button type="button" class="btn btn--primary" id="btnJourneyDone" disabled>Mark journey complete</button>
      <p class="status" id="journeyStatus"></p>
    </section>
    <section class="panel" id="panel-ref">
      <h2>Reference</h2>
      <div id="refMount"></div>
    </section>
    <section class="panel" id="panel-engage">
      <h2 id="quizTitle">Knowledge Check</h2>
      <p class="sub">Six questions — 80% to pass.</p>
      <div id="quiz"></div>
      <button type="button" class="btn btn--primary" id="btnGrade">Submit check</button>
      <p class="status" id="quizStatus"></p>
    </section>
    <section class="panel" id="panel-prove">
      <h2 id="proveTitle">Completion Drill</h2>
      <p class="sub" id="proveDesc"></p>
      <form id="proveForm"></form>
      <button type="submit" class="btn btn--primary" form="proveForm">Submit drill</button>
      <p class="status" id="proveStatus"></p>
    </section>
    <section id="bc-handoff-footer" style="margin-top:8px"></section>
  </main>
  <script src="../../assets/shared/bytecast_loop.js"></script>
  <script src="../../assets/shared/nxcore_narration_player.js"></script>
  <script src="../../assets/shared/listen_mode.js"></script>
  <script src="../../assets/shared/bytecast_handoff_footer.js"></script>
  <script src="../../assets/shared/agent_day_episode.js"></script>
</body>
</html>`;
}

function patchRegistries() {
  patchJson(path.join(repoRoot, "data", "catalog.json"), (catalog) => {
    patchEpisodeRegistry(catalog.episode_registry);
    patchTrainingManifest(catalog.training_hub_manifest);
    patchJourney(catalog);
    patchPlaylist(catalog);
  });

  patchJson(path.join(repoRoot, "data", "episode_registry.json"), patchEpisodeRegistry);
  patchJson(path.join(repoRoot, "episodes", "training_hub", "modules.json"), patchTrainingManifest);
  patchJson(path.join(repoRoot, "episodes", "training_hub", "data", "modules.json"), patchTrainingManifest);
  patchJson(path.join(repoRoot, "data", "journey_steps.json"), (journey) => {
    patchJourneySteps(journey);
  });
  patchJson(path.join(repoRoot, "data", "training_upgrade_overlays.json"), patchOverlays);

  // Day 4 related_next → Day 5
  patchJson(path.join(repoRoot, "episodes", "the_handoff_is_the_work", "bytecast_ep_profile.json"), (p) => {
    p.related_next = [
      { label: "Next: Day 5 — Working the Queue", href: "../working_the_queue/index.html" },
      { label: "TR-001A — Foundations Check (after Day 10)", href: "../training_missions/tr_001a_day1_foundations/index.html" }
    ];
    p.lesson.advance = "Unlock Working the Queue (Day 5) when handoff_prove is complete.";
  });
}

function patchEpisodeRegistry(reg) {
  if (!reg) return;
  reg.series = reg.series || [];
  for (const spec of DAY_SPECS) {
    const seriesId = `core_day${spec.day}`;
    if (!reg.series.some((s) => s.id === seriesId)) {
      reg.series.push({
        id: seriesId,
        name: `Agent Day ${spec.day} — ${spec.shortTitle}`,
        description: spec.summary_short,
        journey_id: "p1_golden_path",
        start_path: `episodes/${spec.slug}`,
        sort_order: 10 + spec.day
      });
    }
  }
  reg.series.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  if (!reg.episodes) return;
  for (const spec of DAY_SPECS) {
    if (reg.episodes.some((e) => e.slug === spec.slug)) continue;
    reg.episodes.push({
      slug: spec.slug,
      episode_code: spec.code,
      title: `${spec.title} — Agent Day ${spec.day}`,
      primary_path: `episodes/${spec.slug}`,
      legacy_paths: [],
      series_id: `core_day${spec.day}`,
      series_name: `Agent Day ${spec.day} — ${spec.shortTitle}`,
      sequence: 1,
      status: "active",
      publishable: true,
      teaching_mode: "ReadAloudScript",
      required: true
    });
  }
}

function patchTrainingManifest(manifest) {
  if (!manifest) return;
  const series = manifest.series?.find((s) => s.id === "golden_path_day1");
  if (series) {
    series.description =
      "Agent Days 1–10 (required spine), TR-001A mission gate, and optional legacy EP-001–004 reference.";
  }

  for (const spec of DAY_SPECS) {
    if (manifest.modules?.some((m) => m.id === spec.slug)) continue;
    manifest.modules = manifest.modules || [];
    manifest.modules.push({
      id: spec.slug,
      name: `${spec.shortTitle} — Agent Day ${spec.day}`,
      description: spec.summary_short,
      owner: "Training and Community",
      category: "episode",
      series_id: "golden_path_day1",
      sequence: spec.day,
      part_label: "Required",
      path: `../${spec.slug}/index.html`,
      canon_path: `episodes/${spec.slug}`,
      launch_label: `Start Day ${spec.day}`,
      home_featured: spec.day <= 6,
      required: true
    });
  }

  // Bump legacy + TR-001A sequences
  const bump = (id, seq) => {
    const m = manifest.modules?.find((x) => x.id === id);
    if (m) m.sequence = seq;
  };
  bump("golden_path_start", 11);
  bump("tr_001a_day1_foundations", 12);
  bump("tr_001_golden_path", 13);

  manifest.modules?.sort((a, b) => {
    if (a.series_id === "golden_path_day1" && b.series_id === "golden_path_day1") {
      return (a.sequence ?? 0) - (b.sequence ?? 0);
    }
    return 0;
  });
}

function patchJourney(catalog) {
  const journeys = catalog?.journeys || catalog?.journey_steps?.journeys;
  // catalog may embed journey differently — primary patch in journey_steps.json
}

function patchJourneySteps(journey) {
  const gp = journey.journeys?.find((j) => j.id === "p1_golden_path");
  if (!gp) return;

  gp.description =
    "Agent Days 1–10 (required), then TR-001A, Practice Builder, Publish, and Badge";

  const handoffIdx = gp.steps.findIndex((s) => s.id === "handoff_gates");
  const trIdx = gp.steps.findIndex((s) => s.id === "tr001a_day1_foundations");
  if (handoffIdx < 0) return;

  const newSteps = DAY_SPECS.map((spec, i) => ({
    id: `${spec.prefix}_gates`,
    label: `${spec.shortTitle} — Agent Day ${spec.day}`,
    lane: "bytecast",
    group: "ByteCast",
    order: 20 + i,
    estimatedMinutes: spec.runtime_minutes,
    href: `episodes/${spec.slug}/index.html`,
    cta: `Complete Day ${spec.day}`,
    depends_on: i === 0 ? ["handoff_gates"] : [`${DAY_SPECS[i - 1].prefix}_gates`],
    unlock_requires:
      i === 0
        ? [{ stepId: "handoff_prove", meta_fields: ["handoffPacketSubmitted", "nextAction", "ownerLane"] }]
        : [
            {
              stepId: `${DAY_SPECS[i - 1].prefix}_prove`,
              meta_fields: ["drillSubmitted"]
            }
          ],
    complete_when: {
      type: "steps_all",
      ids: [`${spec.prefix}_gate`, `${spec.prefix}_segments`, `${spec.prefix}_engage`, `${spec.prefix}_prove`]
    }
  }));

  const before = gp.steps.slice(0, handoffIdx + 1);
  const after = trIdx >= 0 ? gp.steps.slice(trIdx) : gp.steps.slice(handoffIdx + 1);
  gp.steps = [...before, ...newSteps, ...after];

  // Update tr001a depends_on to capstone
  const tr = gp.steps.find((s) => s.id === "tr001a_day1_foundations");
  if (tr) {
    tr.depends_on = ["capstone_gates"];
    tr.order = 30;
  }
}

function patchPlaylist(catalog) {
  const playlist = catalog.playlist || catalog.seed_playlist;
  const items = catalog?.playlist_items || catalog?.seed?.playlist;
  // Add to catalog journey entries if present
  const journeys = catalog.journeys;
  if (Array.isArray(journeys)) {
    for (const spec of DAY_SPECS) {
      if (journeys.some((j) => j.start_path === `episodes/${spec.slug}`)) continue;
      journeys.push({
        journey_id: "p1_golden_path",
        start_path: `episodes/${spec.slug}`,
        sort_order: 10 + spec.day
      });
    }
  }
}

function patchOverlays(overlays) {
  overlays.updated_on = "2026-07-10";
  overlays.episodes = overlays.episodes || {};
  for (const spec of DAY_SPECS) {
    overlays.episodes[spec.slug] = {
      lesson: {
        objective: spec.summary_short,
        why_it_matters: `Day ${spec.day} — ${spec.law}`,
        apply: `Complete gate, segments, quiz, and ${spec.prove_title}.`,
        advance:
          spec.day < 10
            ? `Unlock Day ${spec.day + 1} when ${spec.prefix}_prove is complete.`
            : "Unlock TR-001A when capstone prove is complete."
      },
      thread_tags: [`day${spec.day}`, "required", "agent-orientation", "golden-path"]
    };
  }
  overlays.episodes.the_handoff_is_the_work = {
    ...overlays.episodes.the_handoff_is_the_work,
    related_next: [{ label: "Next: Day 5 — Working the Queue", href: "../working_the_queue/index.html" }]
  };
}

function writeUnifiedGoldManifest() {
  writeJson(path.join(goldPath, "manifest.json"), {
    package: "aerovista_agent_bytecast_days_1_10",
    updated_at_utc: new Date().toISOString(),
    status: "reference_docs_with_live_episodes_5_10",
    notes: [
      "Days 1–4: live at episodes/the_first_door … the_handoff_is_the_work",
      "Days 5–10: built from this pack via scripts/build-agent-days-5-10.mjs",
      "Duplicate manifest (2).json / (4).json files are superseded by manifest.json"
    ],
    days: [
      { day: 1, live_slug: "the_first_door", reference: "Day_01_The_First_Door_Script.md" },
      { day: 2, live_slug: "finding_source_of_truth", reference: "Day_02_Finding_Source_of_Truth_Script.md" },
      { day: 3, live_slug: "from_signal_to_action", reference: "Day_03_From_Signal_to_Action_Script.md" },
      { day: 4, live_slug: "the_handoff_is_the_work", reference: "Day_04_The_Handoff_Is_The_Work_Script.md" },
      ...DAY_SPECS.map((s) => ({
        day: s.day,
        live_slug: s.slug,
        script: s.scriptFile,
        completion_drill: s.drillFile
      }))
    ]
  });
}

function patchJson(filePath, mutator) {
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  mutator(data);
  writeJson(filePath, data);
}

function writeJson(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function readText(filePath) {
  return readFileSync(filePath, "utf8");
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 48);
}
