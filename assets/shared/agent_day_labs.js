/**
 * Practice lab definitions for Agent Days 1–10.
 */
(function (global) {
  "use strict";

  const slug = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

  global.ByteCastAgentDayLabs = {
    REGISTRY: {
      door_router: {
        id: "door_router",
        title: "Route the Door",
        description: "Five scenarios — pick the main door before you act.",
        passScore: 4,
        choicesFrom: "doors",
        scenarios: [
          { text: "Tunnel is down; you need deployment truth for a live service.", answer: "nxcore" },
          { text: "Executive asks what changed, why it matters, and what happens next.", answer: "avcc" },
          { text: "Is this service registered, verified, and healthy?", answer: "registry" },
          { text: "A useful doc may be reference — you need the authority path.", answer: "memory" },
          { text: "Training handoff and Pulse briefing belong on the learning spine.", answer: "bytecast" }
        ]
      },
      state_sorter: {
        id: "state_sorter",
        title: "Name the State",
        description: "Match situations to state labels — never blur planned and live.",
        passScore: 5,
        choicesFrom: "state_labels",
        scenarios: [
          { text: "Roadmap lists Q3 delivery but nothing is built yet.", answer: "planned" },
          { text: "Code merged to staging; not in production.", answer: "built" },
          { text: "Endpoint responds in the target environment.", answer: "live" },
          { text: "Uptime checks and health probes are green.", answer: "healthy" },
          { text: "Approved for customer or operator use.", answer: "released" },
          { text: "Team uses it daily in their workflow.", answer: "adopted" }
        ]
      },
      lost_agent: {
        id: "lost_agent",
        type: "protocol",
        title: "Lost Agent Protocol",
        description: "Walk the five steps on a foggy scenario — in order.",
        steps: ["STOP", "NAME", "DOOR", "ASK", "NOTE"],
        scenario:
          "You opened five tabs. README says live, registry says planned. A stakeholder wants a recommendation now."
      },
      authority_pick: {
        id: "authority_pick",
        title: "Climb the Authority Ladder",
        description: "Pick the highest relevant authority for each decision.",
        passScore: 4,
        choicesFrom: "authority_ladder",
        scenarios: [
          { text: "Is the production endpoint actually responding right now?", answer: "rung_2" },
          { text: "Your operator just said stop all deploys until review.", answer: "rung_1" },
          { text: "Is this release registered in the registry?", answer: "rung_3" },
          { text: "What did yesterday's EOD Capsule say about this object?", answer: "rung_4" },
          { text: "A detailed README from last month describes the feature.", answer: "rung_5" }
        ]
      },
      truth_label: {
        id: "truth_label",
        title: "Label the Truth",
        description: "Assign Verified, Reported, Inferred, Unknown, or Conflicting.",
        passScore: 4,
        choicesFrom: "truth_labels",
        scenarios: [
          { text: "You checked the live health endpoint yourself.", answer: "verified" },
          { text: "A handoff says E2E passed — you have not checked logs.", answer: "reported" },
          { text: "Registry and live check disagree on status.", answer: "conflicting" },
          { text: "You reasoned from three docs but did not verify live.", answer: "inferred" },
          { text: "Nobody has checked this object yet.", answer: "unknown" }
        ]
      },
      conflict_protocol: {
        id: "conflict_protocol",
        type: "protocol",
        title: "Conflict Protocol",
        description: "Surface disagreement without averaging sources away.",
        steps: ["NAME", "RANK", "RISK", "INTERIM", "NOTE"],
        scenario: "Doc A says live. Registry says planned. A client is waiting for an answer."
      },
      priority_triage: {
        id: "priority_triage",
        title: "Priority Triage",
        description: "Assign P1, P2, or P3 — no priority inflation.",
        passScore: 4,
        choices: [
          { id: "p1", label: "P1 — Critical" },
          { id: "p2", label: "P2 — Important" },
          { id: "p3", label: "P3 — Normal" }
        ],
        scenarios: [
          { text: "Public login page returns 500 for all users.", answer: "p1" },
          { text: "Training copy has a typo; service is healthy.", answer: "p3" },
          { text: "Client deliverable due tomorrow; blocker is access grant.", answer: "p2" },
          { text: "Suspected credential exposure on internal tool.", answer: "p1" },
          { text: "Nice-to-have dashboard polish request.", answer: "p3" }
        ]
      },
      cos_brief: {
        id: "cos_brief",
        title: "COS Brief Builder",
        description: "Pick the missing piece of a Chief-of-Staff brief.",
        passScore: 4,
        choices: [
          { id: "signal", label: "What changed" },
          { id: "why", label: "Why it matters" },
          { id: "action", label: "Recommended action" },
          { id: "evidence", label: "Evidence list" }
        ],
        scenarios: [
          { text: "Brief lists outage and rollback but not operational consequence.", answer: "why" },
          { text: "Brief explains impact but never states what changed.", answer: "signal" },
          { text: "Brief summarizes vibes with no cited sources.", answer: "evidence" },
          { text: "Brief describes the problem but not the next verb.", answer: "action" },
          { text: "Brief has signal and impact but no clear owner action.", answer: "action" }
        ]
      },
      judgment_chain: {
        id: "judgment_chain",
        type: "protocol",
        title: "Judgment Chain",
        description: "Walk signal → context → judgment → action → memory.",
        steps: ["SIGNAL", "CONTEXT", "JUDGMENT", "ACTION", "MEMORY"],
        scenario: "Alert: queue depth doubled. You need an AVCC-style brief, not a data dump."
      },
      trail_system: {
        id: "trail_system",
        title: "Trail System",
        description: "Match work artifacts to the right trail surface.",
        passScore: 4,
        choices: [
          { id: "handoff", label: "Handoff Packet" },
          { id: "eod", label: "EOD Capsule" },
          { id: "registry", label: "Registry update" },
          { id: "commit", label: "Commit / PR" }
        ],
        scenarios: [
          { text: "Next agent needs touched/changed/verified/unknowns.", answer: "handoff" },
          { text: "End of day learnings and what is still unknown.", answer: "eod" },
          { text: "Release state changed from built to live.", answer: "registry" },
          { text: "Code change with tests for a vertical slice.", answer: "commit" },
          { text: "Operator handoff before you sign off.", answer: "handoff" }
        ]
      },
      handoff_packet: {
        id: "handoff_packet",
        title: "Handoff Quality",
        description: "Pick what makes a handoff usable for the next agent.",
        passScore: 4,
        choices: [
          { id: "touched", label: "What I touched" },
          { id: "vague", label: "Vague status update" },
          { id: "next", label: "One next action" },
          { id: "hidden", label: "Hidden conflicts" }
        ],
        scenarios: [
          { text: "Required field so the next agent knows scope.", answer: "touched" },
          { text: "Bad habit: 'made progress' with no evidence.", answer: "vague" },
          { text: "Good handoff ends with a single owned next move.", answer: "next" },
          { text: "Never bury registry vs live disagreements.", answer: "hidden" },
          { text: "Handoff without next action forces re-discovery.", answer: "next" }
        ]
      },
      eod_capsule: {
        id: "eod_capsule",
        type: "protocol",
        title: "EOD Capsule",
        description: "Build end-of-day continuity in order.",
        steps: ["LEARNED", "VERIFIED", "UNKNOWN", "NEXT"],
        scenario: "You finished a slice but the next shift needs continuity without a meeting."
      },
      queue_triage: {
        id: "queue_triage",
        title: "Queue Triage",
        description: "Priority + honesty — no ghost tasks.",
        passScore: 4,
        choices: [
          { id: "p1", label: "P1" },
          { id: "p2", label: "P2" },
          { id: "p3", label: "P3" }
        ],
        scenarios: [
          { text: "Live checkout broken for all users.", answer: "p1" },
          { text: "Blocked waiting on access grant; due this week.", answer: "p2" },
          { text: "Internal doc formatting request.", answer: "p3" },
          { text: "Security scan flagged exposed key.", answer: "p1" },
          { text: "Parked: waiting on client content.", answer: "p2" }
        ]
      },
      queue_state: {
        id: "queue_state",
        title: "Queue State",
        description: "Label active, blocked, or parked correctly.",
        passScore: 3,
        choices: [
          { id: "active", label: "Active" },
          { id: "blocked", label: "Blocked" },
          { id: "parked", label: "Parked" }
        ],
        scenarios: [
          { text: "You are actively working this item now.", answer: "active" },
          { text: "Cannot proceed until legal reviews the contract.", answer: "blocked" },
          { text: "Deprioritized until next sprint planning.", answer: "parked" },
          { text: "Waiting on external vendor with no ETA.", answer: "blocked" }
        ]
      },
      one_action: {
        id: "one_action",
        type: "protocol",
        title: "One-Action Rule",
        description: "Define done → do one action → update queue.",
        steps: ["DEFINE", "ONE ACTION", "UPDATE", "HANDOFF"],
        scenario: "Queue has twelve items. You are tempted to start three at once."
      },
      access_boundary: {
        id: "access_boundary",
        title: "Access Boundary",
        description: "Public vs private vs operator-only.",
        passScore: 4,
        choices: [
          { id: "public", label: "Public surface" },
          { id: "private", label: "Private / internal" },
          { id: "escalate", label: "Escalate to human" }
        ],
        scenarios: [
          { text: "Client-facing marketing page copy.", answer: "public" },
          { text: "Infrastructure tunnel credentials.", answer: "private" },
          { text: "Unclear if role grant is allowed for this agent.", answer: "escalate" },
          { text: "Internal AVCC brief with confidential client name.", answer: "private" },
          { text: "Art Localized builder onboarding page.", answer: "public" }
        ]
      },
      role_vs_grant: {
        id: "role_vs_grant",
        title: "Role vs Grant",
        description: "Badge is signal — not automatic access.",
        passScore: 3,
        choices: [
          { id: "request", label: "Request through proper channel" },
          { id: "self", label: "Self-grant role" },
          { id: "assume", label: "Assume badge = access" }
        ],
        scenarios: [
          { text: "You need NXDrive write on a new folder.", answer: "request" },
          { text: "Tempted to add yourself to admin for speed.", answer: "self" },
          { text: "Contributor badge appears — you try prod deploy.", answer: "assume" },
          { text: "Access model unclear for a client workspace.", answer: "request" }
        ]
      },
      public_private: {
        id: "public_private",
        type: "protocol",
        title: "Public / Private Check",
        description: "Before publish: surface, audience, evidence.",
        steps: ["SURFACE", "AUDIENCE", "REDACT", "VERIFY"],
        scenario: "Draft looks ready but includes internal hostnames and strategy notes."
      },
      builder_scope: {
        id: "builder_scope",
        title: "Builder Scope",
        description: "What builders need vs operator internals.",
        passScore: 3,
        choices: [
          { id: "builder", label: "Builder-safe answer" },
          { id: "internal", label: "Keep internal" },
          { id: "escalate", label: "Escalate" }
        ],
        scenarios: [
          { text: "How to submit art for review.", answer: "builder" },
          { text: "Raw NXCore tunnel map.", answer: "internal" },
          { text: "Legal terms for a new grant program.", answer: "escalate" },
          { text: "Public FAQ about contribution lanes.", answer: "builder" }
        ]
      },
      client_tone: {
        id: "client_tone",
        title: "Client Tone",
        description: "Professional, clear, no internal jargon leakage.",
        passScore: 3,
        choices: [
          { id: "good", label: "Client-ready" },
          { id: "bad", label: "Needs rewrite" }
        ],
        scenarios: [
          { text: "'We synced the registry and NXCore mounts look fine.'", answer: "bad" },
          { text: "'Your preview is live; we verified the publish check.'", answer: "good" },
          { text: "'AVCC says P1 on the COS brief lol.'", answer: "bad" },
          { text: "'Next step: your review of the draft by Friday.'", answer: "good" }
        ]
      },
      experience_check: {
        id: "experience_check",
        type: "protocol",
        title: "Client Experience",
        description: "Clarity → trust → momentum for builders and clients.",
        steps: ["CLARITY", "BOUNDARY", "NEXT STEP", "EVIDENCE"],
        scenario: "Builder asks if their work is live; status is actually still in review."
      },
      writing_tone: {
        id: "writing_tone",
        title: "AeroVista Tone",
        description: "Grounded, clear, evidence-backed — not hype soup.",
        passScore: 3,
        choices: [
          { id: "good", label: "On-brand" },
          { id: "bad", label: "Off-brand" }
        ],
        scenarios: [
          { text: "'Planned for Q3; not live until registry and health verify.'", answer: "good" },
          { text: "'Revolutionary AI magic disrupts everything instantly.'", answer: "bad" },
          { text: "'We checked the source; conflict noted in handoff.'", answer: "good" },
          { text: "'Probably fine — ship it.'", answer: "bad" }
        ]
      },
      aerovista_voice: {
        id: "aerovista_voice",
        title: "Voice Check",
        description: "Alignment, transparency, excellence over perfection.",
        passScore: 3,
        choices: [
          { id: "align", label: "Alignment over speed" },
          { id: "hide", label: "Hide blockers" },
          { id: "evidence", label: "Evidence over vibe" }
        ],
        scenarios: [
          { text: "Say what is blocked and why.", answer: "align" },
          { text: "Pretend planned work is live to look fast.", answer: "hide" },
          { text: "Cite registry path for release state.", answer: "evidence" },
          { text: "Skip conflict note to avoid awkwardness.", answer: "hide" }
        ]
      },
      clarity_edit: {
        id: "clarity_edit",
        type: "protocol",
        title: "Clarity Pass",
        description: "Short sentences, plain state labels, one next action.",
        steps: ["TRIM", "LABEL", "ACTION", "READ ALOUD"],
        scenario: "Draft has strong ideas buried in five long paragraphs."
      },
      deliverable_parts: {
        id: "deliverable_parts",
        title: "Deliverable Parts",
        description: "Script, drill, handoff, registry — what belongs?",
        passScore: 3,
        choices: [
          { id: "script", label: "Script segments" },
          { id: "drill", label: "Completion drill" },
          { id: "vibes", label: "Vibes only" }
        ],
        scenarios: [
          { text: "Agent Day pack needs titled segments + runtime.", answer: "script" },
          { text: "Prove tab captures demonstrated skill.", answer: "drill" },
          { text: "'Listen and leave' with no artifact.", answer: "vibes" },
          { text: "Handoff packet for the next agent.", answer: "drill" }
        ]
      },
      readiness_gate: {
        id: "readiness_gate",
        title: "Readiness Gate",
        description: "Complete means the deliverable can do its job.",
        passScore: 3,
        choices: [
          { id: "ready", label: "Ready" },
          { id: "not", label: "Not ready" }
        ],
        scenarios: [
          { text: "HTML loads, profile parses, quiz + prove wired.", answer: "ready" },
          { text: "Broken JSON in profile.", answer: "not" },
          { text: "Script exists but no journey step in catalog.", answer: "not" },
          { text: "Forge-ready voiceover + journey steps registered.", answer: "ready" }
        ]
      },
      definition_of_done: {
        id: "definition_of_done",
        type: "protocol",
        title: "Definition of Done",
        description: "Test, document, hand off, update SOT.",
        steps: ["TEST", "DOC", "HANDOFF", "SOT"],
        scenario: "Feature works locally but nobody else can tell what changed."
      },
      capstone_judgment: {
        id: "capstone_judgment",
        title: "Capstone Judgment",
        description: "Integrate Days 1–9 under pressure.",
        passScore: 4,
        choices: [
          { id: "sot", label: "Verify source first" },
          { id: "thrash", label: "Open five fronts" },
          { id: "handoff", label: "Leave handoff" }
        ],
        scenarios: [
          { text: "Conflicting docs before a client update.", answer: "sot" },
          { text: "Lost on access — rewrite architecture from memory.", answer: "thrash" },
          { text: "End of shift with partial slice.", answer: "handoff" },
          { text: "P1 signal — need AVCC brief not raw logs.", answer: "sot" },
          { text: "Queue chaos — define one action.", answer: "handoff" }
        ]
      },
      trusted_habits: {
        id: "trusted_habits",
        title: "Trusted Agent Habits",
        description: "Reduce chaos; produce clarity.",
        passScore: 3,
        choices: [
          { id: "good", label: "Trusted habit" },
          { id: "bad", label: "Dangerous habit" }
        ],
        scenarios: [
          { text: "Name unknowns and escalate exposure.", answer: "good" },
          { text: "Self-grant prod access to unblock yourself.", answer: "bad" },
          { text: "Finish usable slice with evidence trail.", answer: "good" },
          { text: "Paste confidential context into public draft.", answer: "bad" }
        ]
      },
      readiness_path: {
        id: "readiness_path",
        type: "protocol",
        title: "Readiness Path",
        description: "Supervised practice ladder to trusted lanes.",
        steps: ["DRILLS", "SCOPED TASKS", "REVIEWED HANDOFFS", "TRUSTED LANES"],
        scenario: "Capstone complete — what happens before unsupervised live work?"
      }
    },

    resolveChoices(profile, lab) {
      if (lab.choices?.length) return lab.choices;
      if (lab.choicesFrom === "doors") {
        return (profile.doors || []).map((d) => ({ id: d.id, label: d.name }));
      }
      if (lab.choicesFrom === "state_labels") {
        return (profile.state_labels || []).map((s) => ({ id: s.label, label: s.label }));
      }
      if (lab.choicesFrom === "truth_labels") {
        return (profile.truth_labels || []).map((s) => ({
          id: slug(s.label),
          label: s.label
        }));
      }
      if (lab.choicesFrom === "authority_ladder") {
        return (profile.authority_ladder || []).map((r) => ({
          id: `rung_${r.rung}`,
          label: `Rung ${r.rung}: ${r.name}`
        }));
      }
      return [];
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
