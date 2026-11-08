/**
 * Smoke helper for Agent Days Golden Path (p1_golden_path).
 * Completes Gate→Journey→Check→Prove meta for Days 1–10, then TR-001A.
 */
(function (global) {
  "use strict";

  const DAYS = [
    { day: 1, slug: "the_first_door", code: "AGENT-D1", steps: { gate: "first_door_trust", segments: "first_door_segments", engage: "first_door_engage", prove: "first_door_prove", proveMeta: { readinessNoteSubmitted: true } } },
    { day: 2, slug: "finding_source_of_truth", code: "AGENT-D2", steps: { gate: "sot_gate", segments: "sot_segments", engage: "sot_engage", prove: "sot_prove", proveMeta: { drillSubmitted: true, sotDrillSubmitted: true } } },
    { day: 3, slug: "from_signal_to_action", code: "AGENT-D3", steps: { gate: "avcc_gate", segments: "avcc_segments", engage: "avcc_engage", prove: "avcc_prove", proveMeta: { drillSubmitted: true, avccDrillSubmitted: true } } },
    { day: 4, slug: "the_handoff_is_the_work", code: "AGENT-D4", steps: { gate: "handoff_gate", segments: "handoff_segments", engage: "handoff_engage", prove: "handoff_prove", proveMeta: { drillSubmitted: true, handoffDrillSubmitted: true } } },
    { day: 5, slug: "working_the_queue", code: "AGENT-D5", steps: { gate: "queue_gate", segments: "queue_segments", engage: "queue_engage", prove: "queue_prove", proveMeta: { drillSubmitted: true } } },
    { day: 6, slug: "safe_access_boundaries", code: "AGENT-D6", steps: { gate: "access_gate", segments: "access_segments", engage: "access_engage", prove: "access_prove", proveMeta: { drillSubmitted: true } } },
    { day: 7, slug: "builder_client_experience", code: "AGENT-D7", steps: { gate: "serve_gate", segments: "serve_segments", engage: "serve_engage", prove: "serve_prove", proveMeta: { drillSubmitted: true } } },
    { day: 8, slug: "writing_like_aerovista", code: "AGENT-D8", steps: { gate: "writing_gate", segments: "writing_segments", engage: "writing_engage", prove: "writing_prove", proveMeta: { drillSubmitted: true } } },
    { day: 9, slug: "from_draft_to_deliverable", code: "AGENT-D9", steps: { gate: "deliver_gate", segments: "deliver_segments", engage: "deliver_engage", prove: "deliver_prove", proveMeta: { drillSubmitted: true } } },
    { day: 10, slug: "trusted_agent_capstone", code: "AGENT-D10", steps: { gate: "capstone_gate", segments: "capstone_segments", engage: "capstone_engage", prove: "capstone_prove", proveMeta: { drillSubmitted: true } } }
  ];

  function completeAgentDay(L, daySpec) {
    const eq = {
      engageQuizPassed: true,
      engageQuizScore: 1,
      episodeSlug: daySpec.slug,
      episodeCode: daySpec.code
    };
    const s = daySpec.steps;
    L.markStepDone(s.gate, { episodeSlug: daySpec.slug, gateAcknowledged: true });
    L.markStepDone(s.segments, { episodeSlug: daySpec.slug, journeyComplete: true, labsComplete: true });
    L.markStepDone(s.engage, eq);
    L.markStepDone(s.prove, { episodeSlug: daySpec.slug, drillSubmitted: true, ...s.proveMeta });
  }

  function completeTr001a(L) {
    L.markStepDone("tr001a_day1_foundations", {
      mission: "tr_001a_day1_foundations",
      understandingCheckPassed: true,
      tr001aQuizPassed: true,
      tr001aQuizScore: 1,
      tr001aWritten1: "Trusted agents verify against current truth before acting.",
      tr001aWritten2: "I leave a trail: source, decision, next owner, and open risks.",
      tr001aScenarioRouting: "playlist_then_docs",
      tr001aCompletedAt: new Date().toISOString()
    });
  }

  function smokeAgentGoldenPath(opts) {
    const L = global.ByteCastLoop;
    if (!L) return { ok: false, completed: [], error: "ByteCastLoop missing" };
    const throughDay = opts?.throughDay ?? 10;
    const includeTr001a = opts?.includeTr001a !== false;
    const completed = [];
    try {
      for (const d of DAYS) {
        if (d.day > throughDay) break;
        completeAgentDay(L, d);
        completed.push(d.slug);
      }
      if (includeTr001a && throughDay >= 10) {
        completeTr001a(L);
        completed.push("tr001a_day1_foundations");
      }
      return { ok: true, completed };
    } catch (err) {
      return { ok: false, completed, error: String(err?.message || err) };
    }
  }

  global.__smokeAgentGoldenPath = smokeAgentGoldenPath;
  global.ByteCastAgentGoldenPathSmoke = { DAYS, completeAgentDay, completeTr001a, smokeAgentGoldenPath };
})(typeof window !== "undefined" ? window : globalThis);
