(() => {
  const WORKFLOW_V1_KEY = "bytecast.workflow.v1";
  const WORKFLOW_V2_BASE_KEY = "bytecast.workflow.v2";
  const BADGES_KEY = "bytecast.badges.v1";
  const ANALYTICS_ONCE_PREFIX = "bc.loop.analytics.once.";
  const ACTIVE_JOURNEY_KEY = "bytecast.journey.active";
  const LEGACY_ACTIVE_JOURNEY_KEY = "bytecast.journey.active.v1";
  const MIGRATED_GLOBAL_V2_KEY = "bytecast.workflow.v2.migrated_to_per_journey.v1";

  function safeJsonParse(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function defaultV1() {
    return {
      cycle: 1,
      abilityLevel: 0,
      bytecast: { listen: false, slide: false, interact: false },
      trainingDone: false,
      seedDone: false,
      updatedAt: "",
    };
  }

  function defaultV2() {
    return {
      schema: "bytecast-workflow-v2",
      cycle: 1,
      abilityLevel: 0,
      steps: {},
      updatedAt: "",
      migratedFrom: "",
    };
  }

  function normalizeV1(parsed) {
    const fallback = defaultV1();
    const p = parsed && typeof parsed === "object" ? parsed : {};
    const bytecast = p.bytecast && typeof p.bytecast === "object" ? p.bytecast : {};
    const legacyDone = Boolean(p.bytecastDone);
    return {
      ...fallback,
      ...p,
      cycle: Number.isFinite(Number(p.cycle)) ? Math.max(1, Number(p.cycle)) : 1,
      abilityLevel: Number.isFinite(Number(p.abilityLevel)) ? Math.max(0, Number(p.abilityLevel)) : 0,
      bytecast: {
        listen: legacyDone || Boolean(bytecast.listen),
        slide: legacyDone || Boolean(bytecast.slide),
        interact: legacyDone || Boolean(bytecast.interact),
      },
      trainingDone: Boolean(p.trainingDone),
      seedDone: Boolean(p.seedDone),
      updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : "",
    };
  }

  function normalizeV2(parsed) {
    const fallback = defaultV2();
    const p = parsed && typeof parsed === "object" ? parsed : {};
    const steps = p.steps && typeof p.steps === "object" ? p.steps : {};
    return {
      ...fallback,
      ...p,
      cycle: Number.isFinite(Number(p.cycle)) ? Math.max(1, Number(p.cycle)) : 1,
      abilityLevel: Number.isFinite(Number(p.abilityLevel)) ? Math.max(0, Number(p.abilityLevel)) : 0,
      steps,
      updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : "",
      migratedFrom: typeof p.migratedFrom === "string" ? p.migratedFrom : "",
    };
  }

  function loadBadges() {
    try {
      const raw = localStorage.getItem(BADGES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function analyticsEnabled() {
    try {
      if (location.protocol === "file:") return false;
    } catch {
      // ignore
    }
    const um = window.umami;
    return Boolean(um && (typeof um === "function" || typeof um.track === "function"));
  }

  function track(eventName, data) {
    if (!analyticsEnabled()) return;
    const um = window.umami;
    try {
      if (um && typeof um.track === "function") {
        um.track(eventName, data);
        return;
      }
      if (typeof um === "function") {
        um(eventName, data);
      }
    } catch {
      // ignore
    }
  }

  function trackOnce(key, eventName, data) {
    if (!analyticsEnabled()) return;
    try {
      const k = `${ANALYTICS_ONCE_PREFIX}${key}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch {
      // ignore
    }
    track(eventName, data);
  }

  function saveBadges(badges) {
    try {
      localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
    } catch {
      // ignore
    }
  }

  function mintBadge(id, label, meta = {}) {
    const badges = loadBadges();
    if (badges.some((b) => b && b.id === id)) return false;
    badges.unshift({ id, label, issuedAt: new Date().toISOString(), meta });
    saveBadges(badges.slice(0, 50));
    track("badge_minted", { journeyId: String(meta?.journeyId || getActiveJourneyId() || "p1_golden_path"), badgeId: id, label, meta });
    return true;
  }

  function badgeHas(id) {
    return loadBadges().some((b) => b && b.id === id);
  }

  function setStepDoneV2(wf2, stepId, meta = {}) {
    const steps = wf2.steps && typeof wf2.steps === "object" ? wf2.steps : {};
    const now = new Date().toISOString();
    const prev = steps[stepId] && typeof steps[stepId] === "object" ? steps[stepId] : {};
    steps[stepId] = {
      ...prev,
      done: true,
      doneAt: prev.doneAt || now,
      updatedAt: now,
      meta: { ...(prev.meta || {}), ...(meta || {}) },
    };
    wf2.steps = steps;
    wf2.updatedAt = now;
    return wf2;
  }

  function isStepDone(wf2, stepId) {
    const steps = wf2?.steps;
    const s = steps && typeof steps === "object" ? steps[stepId] : null;
    return Boolean(s && typeof s === "object" && s.done);
  }

  function migrateV1ToV2(v1) {
    const wf2 = defaultV2();
    wf2.cycle = v1.cycle;
    wf2.abilityLevel = v1.abilityLevel;
    wf2.migratedFrom = "v1";
    wf2.updatedAt = v1.updatedAt || new Date().toISOString();

    const bc = v1.bytecast || {};
    if (bc.listen) setStepDoneV2(wf2, "ep001_listen");
    if (bc.slide) setStepDoneV2(wf2, "ep001_slide");
    if (bc.interact) setStepDoneV2(wf2, "ep001_engage");
    if (bc.listen && bc.slide && bc.interact) setStepDoneV2(wf2, "ep001_gates");
    if (v1.trainingDone) setStepDoneV2(wf2, "tr001_golden_path");
    if (v1.seedDone) setStepDoneV2(wf2, "seed_export_v1");
    if (badgeHas("p1_golden_path_v1")) setStepDoneV2(wf2, "badge_p1_golden_path_v1");

    return wf2;
  }

  function loadWorkflowV1() {
    const fallback = defaultV1();
    try {
      const raw = localStorage.getItem(WORKFLOW_V1_KEY);
      if (!raw) return fallback;
      return normalizeV1(JSON.parse(raw));
    } catch {
      return fallback;
    }
  }

  function saveWorkflowV1(v1) {
    try {
      localStorage.setItem(WORKFLOW_V1_KEY, JSON.stringify(v1));
    } catch {
      // ignore
    }
  }

  function workflowV2KeyForJourney(journeyId) {
    const id = String(journeyId || "").trim();
    if (!id) return WORKFLOW_V2_BASE_KEY;
    return `${WORKFLOW_V2_BASE_KEY}.${id}`;
  }

  function getActiveJourneyId() {
    try {
      const id = localStorage.getItem(ACTIVE_JOURNEY_KEY);
      if (id) return id;
      const legacy = localStorage.getItem(LEGACY_ACTIVE_JOURNEY_KEY);
      if (legacy) {
        localStorage.setItem(ACTIVE_JOURNEY_KEY, legacy);
        return legacy;
      }
    } catch {
      // ignore
    }
    return "";
  }

  function setActiveJourneyId(journeyId) {
    const id = String(journeyId || "").trim();
    if (!id) return;
    try { localStorage.setItem(ACTIVE_JOURNEY_KEY, id); } catch {}
  }

  function loadWorkflowV2(journeyId = "") {
    const fallback = defaultV2();
    try {
      const key = workflowV2KeyForJourney(journeyId);
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return normalizeV2(JSON.parse(raw));
    } catch {
      return fallback;
    }
  }

  function saveWorkflowV2(v2, journeyId = "") {
    try {
      const key = workflowV2KeyForJourney(journeyId);
      localStorage.setItem(key, JSON.stringify(v2));
    } catch {
      // ignore
    }
  }

  function ensureWorkflowV2(journeyId = "") {
    const id = String(journeyId || "").trim() || getActiveJourneyId() || "p1_golden_path";
    if (id) setActiveJourneyId(id);

    const targetKey = workflowV2KeyForJourney(id);
    const v2Raw = (() => {
      try {
        return localStorage.getItem(targetKey);
      } catch {
        return "";
      }
    })();

    if (v2Raw) {
      const wf2 = loadWorkflowV2(id);
      const v1 = loadWorkflowV1();
      let changed = false;
      // Only reconcile legacy v1 fields into the canonical onboarding journey.
      if (id === "p1_golden_path") {
        const bc = v1.bytecast || {};
        if (bc.listen && !isStepDone(wf2, "ep001_listen")) { setStepDoneV2(wf2, "ep001_listen"); changed = true; }
        if (bc.slide && !isStepDone(wf2, "ep001_slide")) { setStepDoneV2(wf2, "ep001_slide"); changed = true; }
        if (bc.interact && !isStepDone(wf2, "ep001_engage")) { setStepDoneV2(wf2, "ep001_engage"); changed = true; }
        if (bc.listen && bc.slide && bc.interact && !isStepDone(wf2, "ep001_gates")) { setStepDoneV2(wf2, "ep001_gates"); changed = true; }
        if (v1.trainingDone && !isStepDone(wf2, "tr001_golden_path")) { setStepDoneV2(wf2, "tr001_golden_path"); changed = true; }
        if (v1.seedDone && !isStepDone(wf2, "seed_export_v1")) { setStepDoneV2(wf2, "seed_export_v1"); changed = true; }
        if (badgeHas("p1_golden_path_v1") && !isStepDone(wf2, "badge_p1_golden_path_v1")) { setStepDoneV2(wf2, "badge_p1_golden_path_v1"); changed = true; }
      }
      if (changed) {
        wf2.migratedFrom = wf2.migratedFrom || "v1-reconcile";
        saveWorkflowV2(wf2, id);
      }
      return wf2;
    }

    // Migration: if legacy global workflow exists, copy into the default onboarding journey once.
    const shouldMigrateGlobal = (() => {
      try { return !localStorage.getItem(MIGRATED_GLOBAL_V2_KEY); } catch { return true; }
    })();
    if (shouldMigrateGlobal && id === "p1_golden_path") {
      const legacyGlobalRaw = (() => {
        try { return localStorage.getItem(WORKFLOW_V2_BASE_KEY); } catch { return ""; }
      })();
      if (legacyGlobalRaw) {
        try {
          const migrated = normalizeV2(JSON.parse(legacyGlobalRaw));
          migrated.migratedFrom = migrated.migratedFrom || "v2-global";
          saveWorkflowV2(migrated, id);
          try { localStorage.setItem(MIGRATED_GLOBAL_V2_KEY, new Date().toISOString()); } catch {}
          return migrated;
        } catch {
          // ignore
        }
      }
    }

    const v1 = loadWorkflowV1();
    const migrated = migrateV1ToV2(v1);
    migrated.migratedFrom = migrated.migratedFrom || "v1";
    saveWorkflowV2(migrated, id);
    return migrated;
  }

  function setLegacyFromStepId(stepId, v1, meta = {}) {
    const now = new Date().toISOString();
    const out = { ...defaultV1(), ...v1 };
    out.bytecast = out.bytecast && typeof out.bytecast === "object" ? out.bytecast : { listen: false, slide: false, interact: false };

    if (stepId === "ep001_listen") out.bytecast.listen = true;
    if (stepId === "ep001_slide") out.bytecast.slide = true;
    if (stepId === "ep001_engage") out.bytecast.interact = true;
    if (stepId === "ep001_gates") out.bytecast = { listen: true, slide: true, interact: true };
    if (stepId === "tr001_golden_path") out.trainingDone = true;
    if (stepId === "seed_export_v1") out.seedDone = true;
    if (stepId === "badge_p1_golden_path_v1") {
      // no v1 field for badge; keep in badges store
      void meta;
    }

    out.updatedAt = now;
    return out;
  }

  function markStepDone(stepId, meta = {}) {
    const journeyId = String(meta?.journeyId || "").trim() || getActiveJourneyId() || "p1_golden_path";
    const wf2 = ensureWorkflowV2(journeyId);
    setStepDoneV2(wf2, stepId, meta);

    // Aggregate helpers (keep journey config simple).
    if (stepId === "ep001_listen" || stepId === "ep001_slide" || stepId === "ep001_engage") {
      const ok = isStepDone(wf2, "ep001_listen") && isStepDone(wf2, "ep001_slide") && isStepDone(wf2, "ep001_engage");
      if (ok) setStepDoneV2(wf2, "ep001_gates");
    }
    saveWorkflowV2(wf2, journeyId);

    // Keep v1 compatible for existing packs.
    const v1 = loadWorkflowV1();
    const nextV1 = setLegacyFromStepId(stepId, v1, meta);
    saveWorkflowV1(nextV1);

    track("step_done", { journeyId, stepId, meta, doneAt: wf2.steps?.[stepId]?.doneAt || "" });
    return { wf1: nextV1, wf2 };
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  }

  function findRootUrl() {
    try {
      const href = String(location.href || "");
      const path = String(location.pathname || "");
      const marker = "/bytecast/";
      const idx = path.toLowerCase().lastIndexOf(marker);
      if (idx >= 0) {
        const rootPath = path.slice(0, idx + marker.length);
        return new URL(rootPath, href).toString();
      }
      // Fallback: directory of current page.
      return new URL("./", href).toString();
    } catch {
      return "./";
    }
  }

  function resolveFromRoot(relPath) {
    const root = findRootUrl();
    const clean = String(relPath || "").replace(/^\/+/, "");
    try {
      return new URL(clean, root).toString();
    } catch {
      return clean;
    }
  }

  function getJourneyById(config, journeyId) {
    const journeys = Array.isArray(config?.journeys) ? config.journeys : [];
    return journeys.find((j) => j && j.id === journeyId) || null;
  }

  function getStepById(journey, stepId) {
    const steps = Array.isArray(journey?.steps) ? journey.steps : [];
    return steps.find((s) => s && s.id === stepId) || null;
  }

  function completionFromRule(rule, wf2) {
    const r = rule && typeof rule === "object" ? rule : null;
    if (!r || !r.type) return null;
    if (r.type === "step_done") return Boolean(isStepDone(wf2, r.id));
    if (r.type === "steps_all") return Array.isArray(r.ids) && r.ids.every((id) => isStepDone(wf2, id));
    if (r.type === "steps_any") return Array.isArray(r.ids) && r.ids.some((id) => isStepDone(wf2, id));
    if (r.type === "badge_has") return Boolean(r.badge_id) && badgeHas(r.badge_id);
    return null;
  }

  function isStepComplete(journey, step, wf2) {
    if (!step) return false;
    const direct = completionFromRule(step.complete_when, wf2);
    if (typeof direct === "boolean") return direct;
    return isStepDone(wf2, step.id);
  }

  function isStepUnlocked(journey, step, wf2) {
    const deps = Array.isArray(step?.depends_on) ? step.depends_on : [];
    if (!deps.length) return true;
    return deps.every((depId) => {
      const dep = getStepById(journey, depId);
      return dep ? isStepComplete(journey, dep, wf2) : isStepDone(wf2, depId);
    });
  }

  function sortSteps(steps) {
    const list = Array.isArray(steps) ? steps : [];
    const keyed = list.map((step, index) => ({ step, index }));
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 1e9;
    };
    keyed.sort((a, b) => {
      const ao = toNum(a.step?.order);
      const bo = toNum(b.step?.order);
      return (ao - bo) || (a.index - b.index);
    });
    return keyed.map((x) => x.step);
  }

  function getNextStep(journey, wf2) {
    const steps = Array.isArray(journey?.steps) ? journey.steps : [];
    const sorted = sortSteps(steps);
    for (const step of sorted) {
      if (!step) continue;
      if (!isStepUnlocked(journey, step, wf2)) continue;
      if (!isStepComplete(journey, step, wf2)) return step;
    }
    // If everything is complete, return last step if present.
    return sorted.length ? sorted[sorted.length - 1] : null;
  }

  function ensureJourneyBadges(journey, wf2) {
    const badges = Array.isArray(journey?.badges) ? journey.badges : [];
    const steps = Array.isArray(journey?.steps) ? journey.steps : [];
    let minted = 0;
    let marked = 0;

    function markStep(stepId) {
      if (!stepId) return;
      if (!isStepDone(wf2, stepId)) {
        setStepDoneV2(wf2, stepId);
        marked += 1;
      }
    }

    function stepMeta(stepId) {
      const s = wf2?.steps && typeof wf2.steps === "object" ? wf2.steps[stepId] : null;
      const meta = s && typeof s === "object" ? s.meta : null;
      return meta && typeof meta === "object" ? meta : {};
    }

    function proofOk(stepId, requiredFields) {
      const fields = Array.isArray(requiredFields) ? requiredFields : [];
      if (!fields.length) return { ok: true, missing: [] };
      const meta = stepMeta(stepId);
      const missing = fields.filter((f) => {
        const v = meta?.[f];
        if (typeof v === "string") return v.trim().length === 0;
        return v == null;
      });
      return { ok: missing.length === 0, missing };
    }

    for (const b of badges) {
      if (!b || !b.id) continue;
      const already = badgeHas(b.id);
      const req = Array.isArray(b.requires) ? b.requires : [];
      const okSteps = req.length ? req.every((stepId) => {
        const step = steps.find((s) => s && s.id === stepId) || null;
        return step ? isStepComplete(journey, step, wf2) : isStepDone(wf2, stepId);
      }) : false;

      const minProof = b.minProof && typeof b.minProof === "object" ? b.minProof : {};
      const proofFailures = [];
      if (okSteps && minProof) {
        for (const [stepId, fields] of Object.entries(minProof)) {
          const pr = proofOk(stepId, fields);
          if (!pr.ok) proofFailures.push({ stepId, missing: pr.missing });
        }
      }
      const ok = okSteps && proofFailures.length === 0;

      if (!already && ok) {
        if (mintBadge(b.id, b.label || b.id, { journeyId: journey?.id || "", proof: { requires: req } })) minted += 1;
      }

      // If badge exists (pre-existing or just minted), mark any "badge_has" steps that reference it.
      if (badgeHas(b.id)) {
        steps.forEach((s) => {
          if (s?.complete_when?.type === "badge_has" && s.complete_when.badge_id === b.id && s.id) {
            markStep(s.id);
          }
        });
      }
    }

    return { minted, marked };
  }

  async function loadJourneyConfig(url, fallback) {
    if (!url) return fallback || { journeys: [] };
    try {
      const config = await loadJson(url);
      validateJourneyConfig(config);
      return config;
    } catch {
      return fallback || { journeys: [] };
    }
  }

  function validateJourneyConfig(config) {
    const journeys = Array.isArray(config?.journeys) ? config.journeys : [];
    for (const j of journeys) {
      if (!j || typeof j !== "object") continue;
      const steps = Array.isArray(j.steps) ? j.steps : [];
      const ids = steps.map((s) => String(s?.id || "")).filter(Boolean);
      const seen = new Set();
      const dupes = new Set();
      for (const id of ids) {
        if (seen.has(id)) dupes.add(id);
        seen.add(id);
      }
      if (dupes.size) {
        console.warn(`[ByteCastLoop] Journey "${j.id || "unknown"}" has duplicate step ids: ${[...dupes].join(", ")}.`);
      }

      const stepIdSet = new Set(ids);
      const badges = Array.isArray(j.badges) ? j.badges : [];
      for (const b of badges) {
        if (!b || typeof b !== "object") continue;
        const requires = Array.isArray(b.requires) ? b.requires : [];
        const missingReq = requires.filter((rid) => rid && !stepIdSet.has(rid));
        if (missingReq.length) {
          console.warn(`[ByteCastLoop] Badge "${b.id || "unknown"}" in journey "${j.id || "unknown"}" requires missing step ids: ${missingReq.join(", ")}.`);
        }

        const minProof = b.minProof && typeof b.minProof === "object" ? b.minProof : null;
        if (minProof) {
          const missingProofStep = Object.keys(minProof).filter((sid) => sid && !stepIdSet.has(sid));
          if (missingProofStep.length) {
            console.warn(
              `[ByteCastLoop] Badge "${b.id || "unknown"}" in journey "${j.id || "unknown"}" has minProof for step ids not in this journey: ${missingProofStep.join(", ")}. ` +
              `This is allowed for hidden sub-steps, but double-check your ids.`
            );
          }
        }
      }
    }
  }

  window.ByteCastLoop = {
    keys: { WORKFLOW_V1_KEY, WORKFLOW_V2_BASE_KEY, BADGES_KEY, ACTIVE_JOURNEY_KEY },
    defaultV1,
    defaultV2,
    loadWorkflowV1,
    saveWorkflowV1,
    loadWorkflowV2,
    saveWorkflowV2,
    ensureWorkflowV2,
    migrateV1ToV2,
    markStepDone,
    isStepDone,
    loadBadges,
    mintBadge,
    badgeHas,
    resolveFromRoot,
    loadJourneyConfig,
    getJourneyById,
    getNextStep,
    isStepComplete,
    isStepUnlocked,
    ensureJourneyBadges,
    resolveRootUrl: findRootUrl,
    analytics: { track, trackOnce },
    getActiveJourneyId,
    setActiveJourneyId,
    workflowV2KeyForJourney,
    sortSteps,
  };
})();
