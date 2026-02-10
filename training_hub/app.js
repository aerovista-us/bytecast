const MANIFEST_PATH = "./data/modules.json";
const CANON_MAP_PATH = "../.CODEX/bytecast_canon_map_2026-02-08.md";
const JOURNEY_PATH = "../data/journey_steps.json";
const PRIMARY_JOURNEY_ID = "";
const WORKFLOW_KEY = "bytecast.workflow.v1";
const APP_MODE = document.body.dataset.appMode || "training";
const Loop = window.ByteCastLoop || null;
const LoopUI = window.ByteCastLoopUI || null;

const state = {
  modules: [],
  canonEntries: [],
  journeyConfig: null,
  primaryJourney: null,
  nextJourneyHref: "",
};

const refs = {
  searchInput: document.getElementById("search-input"),
  statusFilter: document.getElementById("status-filter"),
  categoryFilter: document.getElementById("category-filter"),
  loadStatus: document.getElementById("load-status"),
  modulesGrid: document.getElementById("modules-grid"),
  emptyState: document.getElementById("empty-state"),
  metricTotal: document.getElementById("metric-total"),
  metricPrimary: document.getElementById("metric-primary"),
  metricRisk: document.getElementById("metric-risk"),
  metricVisible: document.getElementById("metric-visible"),
  workflowSummary: document.getElementById("workflow-summary"),
  workflowNote: document.getElementById("workflow-note"),
  wfBytecast: document.getElementById("wf-bytecast"),
  wfTraining: document.getElementById("wf-training"),
  wfSeed: document.getElementById("wf-seed"),
  markLoopStep: document.getElementById("mark-loop-step"),
  nextAppLink: document.getElementById("next-app-link"),
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  wireEvents();
  renderWorkflow();
  try {
    const [manifestResponse, canonResponse, journeyResponse] = await Promise.all([
      fetch(MANIFEST_PATH),
      fetch(CANON_MAP_PATH),
      fetch(JOURNEY_PATH),
    ]);

    if (!manifestResponse.ok) {
      throw new Error(`Module manifest failed: ${manifestResponse.status}`);
    }

    if (!canonResponse.ok) {
      throw new Error(`CANON map failed: ${canonResponse.status}`);
    }

    const manifest = await manifestResponse.json();
    const canonMarkdown = await canonResponse.text();
    let journeyConfig = null;
    try {
      journeyConfig = journeyResponse.ok ? await journeyResponse.json() : null;
    } catch {
      journeyConfig = null;
    }

    state.modules = Array.isArray(manifest.modules) ? manifest.modules : [];
    state.canonEntries = parseCanonEntries(canonMarkdown);
    state.journeyConfig = journeyConfig || {
      journeys: [
        {
          id: "p1_golden_path",
          label: "P1: Golden Path",
          description: "Playlist -> EP-001 -> Training -> Seed -> Badge",
          steps: [
            { id: "ep001_gates", label: "EP-001 Gates", lane: "bytecast", href: "episodes/welcome_to_bytecast/index.html" },
            { id: "tr001_golden_path", label: "Training (TR-001)", lane: "training", href: "training_missions/tr_001_golden_path/index.html", depends_on: ["ep001_gates"] },
            { id: "seed_export_v1", label: "Seed Export", lane: "seed", href: "seed_builder_studio/seed_orchard_ui/index.html", depends_on: ["tr001_golden_path"] },
            { id: "badge_p1_golden_path_v1", label: "Badge", lane: "badge", href: "seed_bytecast.html", depends_on: ["seed_export_v1"], complete_when: { type: "badge_has", badge_id: "p1_golden_path_v1" } }
          ],
          badges: [{ id: "p1_golden_path_v1", label: "P1: Golden Path", requires: ["ep001_gates", "tr001_golden_path", "seed_export_v1"] }]
        }
      ]
    };
    const activeId = Loop?.getActiveJourneyId?.() || state.journeyConfig.journeys.find((j) => j && j.isDefault)?.id || state.journeyConfig.journeys[0]?.id || "";
    state.primaryJourney = Loop ? Loop.getJourneyById(state.journeyConfig, activeId) : null;

    hydrateCategoryFilter(state.modules);
    render();
    renderWorkflow();
    refs.loadStatus.textContent = `Loaded ${state.modules.length} modules from ${MANIFEST_PATH}.`;
  } catch (error) {
    console.error(error);
    refs.loadStatus.textContent = `Unable to load shell data: ${error.message}`;
    refs.emptyState.hidden = false;
    refs.emptyState.textContent = "Could not load module data. Confirm local server and file paths.";
  }
}

function wireEvents() {
  refs.searchInput.addEventListener("input", render);
  refs.statusFilter.addEventListener("change", render);
  refs.categoryFilter.addEventListener("change", render);
  refs.modulesGrid.addEventListener("click", onModuleGridClick);
  refs.markLoopStep?.addEventListener("click", onMarkLoopStep);
  window.addEventListener("storage", renderWorkflow);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      renderWorkflow();
    }
  });
}

function getDefaultWorkflowState() {
  return {
    cycle: 1,
    abilityLevel: 0,
    bytecast: {
      listen: false,
      slide: false,
      interact: false,
    },
    trainingDone: false,
    seedDone: false,
    updatedAt: "",
  };
}

function normalizeBytecastState(rawState, legacyDone = false) {
  const source = rawState && typeof rawState === "object" ? rawState : {};
  return {
    listen: legacyDone || Boolean(source.listen),
    slide: legacyDone || Boolean(source.slide),
    interact: legacyDone || Boolean(source.interact),
  };
}

function loadWorkflowState() {
  const fallback = getDefaultWorkflowState();
  try {
    const raw = localStorage.getItem(WORKFLOW_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    const legacyDone = Boolean(parsed.bytecastDone);
    return {
      ...fallback,
      ...parsed,
      cycle: Number.isFinite(Number(parsed.cycle)) ? Math.max(1, Number(parsed.cycle)) : 1,
      abilityLevel: Number.isFinite(Number(parsed.abilityLevel))
        ? Math.max(0, Number(parsed.abilityLevel))
        : 0,
      bytecast: normalizeBytecastState(parsed.bytecast, legacyDone),
      trainingDone: Boolean(parsed.trainingDone),
      seedDone: Boolean(parsed.seedDone),
    };
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

function saveWorkflowState(workflowState) {
  localStorage.setItem(WORKFLOW_KEY, JSON.stringify(workflowState));
}

function getBytecastState(workflowState) {
  return normalizeBytecastState(workflowState.bytecast, Boolean(workflowState.bytecastDone));
}

function getBytecastCompletedCount(workflowState) {
  const bytecast = getBytecastState(workflowState);
  return Number(bytecast.listen) + Number(bytecast.slide) + Number(bytecast.interact);
}

function isBytecastComplete(workflowState) {
  return getBytecastCompletedCount(workflowState) === 3;
}

function isTrainingUnlocked(workflowState) {
  return isBytecastComplete(workflowState);
}

function isSeedUnlocked(workflowState) {
  return Boolean(isBytecastComplete(workflowState) && workflowState.trainingDone);
}

function setWorkflowNote(message) {
  if (refs.workflowNote) {
    refs.workflowNote.textContent = message;
  }
}

function formatWorkflowTime(isoText) {
  if (!isoText) {
    return "never";
  }

  const parsed = new Date(isoText);
  if (Number.isNaN(parsed.getTime())) {
    return "unknown";
  }

  return parsed.toLocaleString();
}

function renderWorkflow() {
  if (!refs.workflowSummary) {
    return;
  }

  if (Loop && state.journeyConfig) {
    const activeId = Loop.getActiveJourneyId?.() || state.journeyConfig.journeys.find((j) => j && j.isDefault)?.id || state.journeyConfig.journeys[0]?.id || "";
    state.primaryJourney = Loop.getJourneyById(state.journeyConfig, activeId);
  }

  if (Loop && state.primaryJourney) {
    const wf2 = Loop.ensureWorkflowV2();
    const journey = state.primaryJourney;

    const badgeResult = Loop.ensureJourneyBadges(journey, wf2);
    if (badgeResult?.minted || badgeResult?.marked) {
      Loop.saveWorkflowV2?.(wf2, journey?.id || "");
    }

    const steps = Array.isArray(journey.steps) ? journey.steps : [];
    const doneCount = steps.filter((s) => Loop.isStepComplete(journey, s, wf2)).length;
    const next = Loop.getNextStep(journey, wf2);
    const nextHref = next?.href ? Loop.resolveFromRoot(next.href) : "";
    state.nextJourneyHref = nextHref;

    const updatedAt = formatWorkflowTime(wf2.updatedAt);
    refs.workflowSummary.textContent =
      `${journey.label}. Cycle ${wf2.cycle}. Ability Level ${wf2.abilityLevel}. ` +
      `Steps ${doneCount}/${Math.max(1, steps.length)}. ` +
      `${next ? `Next: ${next.label}.` : "No next step found."}`;

    const laneStep = (lane) => steps.find((s) => s && s.lane === lane) || null;
    const bc = laneStep("bytecast");
    const tr = laneStep("training");
    const sd = laneStep("seed");

    const bcDone = bc ? Loop.isStepComplete(journey, bc, wf2) : Loop.isStepDone(wf2, "ep001_gates");
    const trDone = tr ? Loop.isStepComplete(journey, tr, wf2) : Loop.isStepDone(wf2, "tr001_golden_path");
    const sdDone = sd ? Loop.isStepComplete(journey, sd, wf2) : Loop.isStepDone(wf2, "seed_export_v1");

    refs.wfBytecast?.classList.toggle("done", bcDone);
    refs.wfTraining?.classList.toggle("done", trDone);
    refs.wfSeed?.classList.toggle("done", sdDone);
    if (refs.wfBytecast) refs.wfBytecast.textContent = bcDone ? "ByteCast OK" : "ByteCast TODO";
    if (refs.wfTraining) refs.wfTraining.textContent = trDone ? "Training OK" : (bcDone ? "Training TODO" : "Training LOCKED");
    if (refs.wfSeed) refs.wfSeed.textContent = sdDone ? "Seed OK" : (trDone ? "Seed TODO" : "Seed LOCKED");

    if (refs.markLoopStep) {
      const disabled = !nextHref;
      refs.markLoopStep.disabled = disabled;
      refs.markLoopStep.classList.toggle("is-disabled", disabled);
      refs.markLoopStep.textContent = next?.cta || (next ? `Open: ${next.label}` : "Next step unavailable");
    }

    if (refs.nextAppLink) {
      refs.nextAppLink.href = nextHref || "../seed_bytecast.html";
      refs.nextAppLink.textContent = next ? `Open: ${next.label}` : "Open Playlist";
      refs.nextAppLink.classList.toggle("is-disabled", !nextHref);
      refs.nextAppLink.setAttribute("aria-disabled", nextHref ? "false" : "true");
    }

    setWorkflowNote(`Last updated: ${updatedAt}. This loop is config-driven via ${JOURNEY_PATH}.`);

    if (LoopUI) {
      void LoopUI.renderJourneyMap({
        container: document.getElementById("journey-map"),
        configUrl: JOURNEY_PATH,
        surface: "training_hub",
      });
    }
    return;
  }

  // Fallback: legacy v1 loop UI.
  const workflowState = loadWorkflowState();
  const bytecastComplete = isBytecastComplete(workflowState);
  const bytecastCompletedCount = getBytecastCompletedCount(workflowState);
  const trainingUnlocked = isTrainingUnlocked(workflowState);
  const seedUnlocked = isSeedUnlocked(workflowState);
  const updatedAt = formatWorkflowTime(workflowState.updatedAt);

  refs.workflowSummary.textContent =
    `Cycle ${workflowState.cycle}. ByteCast cycle ${bytecastCompletedCount}/3 ` +
    `(listen -> slide -> interact). Seed Builder Ability Level ${workflowState.abilityLevel}. ` +
    `${seedUnlocked ? "Seed Builder is unlocked for this cycle." : "Complete ByteCast cycle, then Training, to unlock Seed Builder real work."}`;

  refs.wfBytecast?.classList.toggle("done", bytecastComplete);
  refs.wfTraining?.classList.toggle("done", Boolean(workflowState.trainingDone));
  refs.wfSeed?.classList.toggle("done", seedUnlocked);
  if (refs.wfBytecast) {
    refs.wfBytecast.textContent = bytecastComplete
      ? "ByteCast Cycle Complete"
      : `ByteCast ${bytecastCompletedCount}/3`;
  }
  if (refs.wfSeed) {
    refs.wfSeed.textContent = seedUnlocked ? "Seed Builder Ready" : "Seed Builder Locked";
  }

  if (refs.markLoopStep) {
    refs.markLoopStep.disabled = !trainingUnlocked || Boolean(workflowState.trainingDone);
    refs.markLoopStep.classList.toggle("is-disabled", refs.markLoopStep.disabled);
    refs.markLoopStep.textContent = workflowState.trainingDone
      ? "Training Cycle Completed"
      : "Complete Training Cycle";
  }

  if (refs.nextAppLink) {
    refs.nextAppLink.classList.toggle("is-disabled", !seedUnlocked);
    refs.nextAppLink.setAttribute("aria-disabled", seedUnlocked ? "false" : "true");
  }

  setWorkflowNote(
    `Last updated: ${updatedAt}. Required order: listen -> slide -> interact, then training, then seed real work.`
  );

  if (LoopUI) {
    void LoopUI.renderJourneyMap({
      container: document.getElementById("journey-map"),
      configUrl: JOURNEY_PATH,
      surface: "training_hub",
    });
  }
}

function onMarkLoopStep() {
  if (Loop && state.nextJourneyHref) {
    window.location.href = state.nextJourneyHref;
    return;
  }

  const workflowState = loadWorkflowState();

  if (APP_MODE === "training") {
    if (!isBytecastComplete(workflowState)) {
      setWorkflowNote("Finish ByteCast cycle first: listen -> slide -> interact.");
      return;
    }

    if (workflowState.trainingDone) {
      setWorkflowNote("Training step already completed for this cycle.");
      return;
    }

    workflowState.trainingDone = true;
    workflowState.updatedAt = new Date().toISOString();
    saveWorkflowState(workflowState);
    renderWorkflow();
    setWorkflowNote("Training cycle completed. Seed Builder real work is now unlocked for this cycle.");
    return;
  }

  if (!isSeedUnlocked(workflowState)) {
    setWorkflowNote("Seed Builder is locked. Complete ByteCast cycle and Training cycle first.");
    return;
  }

  workflowState.seedDone = true;
  workflowState.abilityLevel += 1;
  workflowState.cycle += 1;
  workflowState.bytecast = {
    listen: false,
    slide: false,
    interact: false,
  };
  workflowState.trainingDone = false;
  workflowState.seedDone = false;
  workflowState.updatedAt = new Date().toISOString();
  saveWorkflowState(workflowState);
  renderWorkflow();
  setWorkflowNote(
    `Seed real work completed. Ability Level ${workflowState.abilityLevel} unlocked. Start next cycle at ByteCast listen step.`
  );
}

function onModuleGridClick(event) {
  const button = event.target.closest("button[data-copy-path]");
  if (!button) {
    return;
  }

  const path = button.getAttribute("data-copy-path");
  if (!path) {
    return;
  }

  copyText(path)
    .then(() => {
      const prior = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = prior;
      }, 1200);
    })
    .catch((error) => {
      console.error(error);
      refs.loadStatus.textContent = "Copy failed. You can still copy from the path text.";
    });
}

function hydrateCategoryFilter(modules) {
  const categories = [...new Set(modules.map((module) => module.category || "general"))].sort();

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    refs.categoryFilter.append(option);
  }
}

function parseCanonEntries(markdown) {
  const lines = markdown.split(/\r?\n/);
  const entries = [];
  const rowRegex = /^\|\s*`([^`]+)`\s*\|\s*(Primary|Legacy|Duplicate|Archive)\s*\|/i;

  for (const line of lines) {
    const match = line.match(rowRegex);
    if (!match) {
      continue;
    }

    entries.push({
      path: normalizePath(match[1]),
      canonClass: match[2].toLowerCase(),
    });
  }

  entries.sort((left, right) => right.path.length - left.path.length);
  return entries;
}

function normalizePath(rawPath) {
  return (rawPath || "")
    .replace(/\\/g, "/")
    .replace(/^(\.\/|\.\.\/)+/, "")
    .replace(/^\/+/, "")
    .toLowerCase()
    .trim();
}

function getCanonClass(module) {
  const lookupPath = normalizePath(module.canon_path || module.path || "");
  if (!lookupPath) {
    return "unknown";
  }

  for (const entry of state.canonEntries) {
    if (
      lookupPath === entry.path ||
      lookupPath.startsWith(`${entry.path}/`) ||
      entry.path.startsWith(`${lookupPath}/`)
    ) {
      return entry.canonClass;
    }
  }

  return "unknown";
}

function render() {
  const term = refs.searchInput.value.trim().toLowerCase();
  const statusFilter = refs.statusFilter.value;
  const categoryFilter = refs.categoryFilter.value;

  const enrichedModules = state.modules.map((module) => ({
    ...module,
    canonClass: getCanonClass(module),
  }));

  const visibleModules = enrichedModules
    .filter((module) => {
      if (statusFilter !== "all" && module.canonClass !== statusFilter) {
        return false;
      }

      if (categoryFilter !== "all" && (module.category || "general") !== categoryFilter) {
        return false;
      }

      if (!term) {
        return true;
      }

      const searchable = [
        module.name,
        module.description,
        module.owner,
        module.path,
        module.manual_path,
        module.canon_path,
        module.category,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  refs.modulesGrid.replaceChildren();
  for (const module of visibleModules) {
    refs.modulesGrid.append(renderModuleCard(module));
  }

  refs.emptyState.hidden = visibleModules.length !== 0;
  updateMetrics(enrichedModules, visibleModules.length);
}

function renderModuleCard(module) {
  const article = document.createElement("article");
  article.className = "module-card";

  const head = document.createElement("div");
  head.className = "module-head";
  article.append(head);

  const name = document.createElement("h3");
  name.className = "module-name";
  name.textContent = module.name;
  head.append(name);

  const badge = document.createElement("span");
  badge.className = `badge ${module.canonClass}`;
  badge.textContent = module.canonClass;
  head.append(badge);

  const description = document.createElement("p");
  description.className = "module-desc";
  description.textContent = module.description || "No description.";
  article.append(description);

  const meta = document.createElement("div");
  meta.className = "module-meta";
  const metaLines = [
    `Owner: <strong>${escapeHtml(module.owner || "Unassigned")}</strong>`,
    `Category: <strong>${escapeHtml(module.category || "general")}</strong>`,
    `Path: <code>${escapeHtml(module.path || "")}</code>`,
    module.manual_path ? `Manual: <code>${escapeHtml(module.manual_path)}</code>` : "",
    `CANON key: <code>${escapeHtml(module.canon_path || "n/a")}</code>`,
  ].filter(Boolean);
  meta.innerHTML = metaLines.join("<br>");
  article.append(meta);

  const actions = document.createElement("div");
  actions.className = "module-actions";
  article.append(actions);

  const launch = document.createElement("a");
  launch.className = "launch-link";
  launch.href = module.path;
  launch.target = "_blank";
  launch.rel = "noopener noreferrer";
  launch.textContent = "Launch";
  actions.append(launch);

  if (module.manual_path) {
    const manual = document.createElement("a");
    manual.className = "manual-link";
    manual.href = module.manual_path;
    manual.target = "_blank";
    manual.rel = "noopener noreferrer";
    manual.textContent = "Manual";
    actions.append(manual);
  }

  const copy = document.createElement("button");
  copy.type = "button";
  copy.setAttribute("data-copy-path", module.path || "");
  copy.textContent = "Copy path";
  actions.append(copy);

  return article;
}

function updateMetrics(allModules, visibleCount) {
  const primary = allModules.filter((module) => module.canonClass === "primary").length;
  const risk = allModules.filter((module) =>
    module.canonClass === "legacy" || module.canonClass === "duplicate"
  ).length;

  refs.metricTotal.textContent = String(allModules.length);
  refs.metricPrimary.textContent = String(primary);
  refs.metricRisk.textContent = String(risk);
  refs.metricVisible.textContent = String(visibleCount);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function copyText(value) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temp = document.createElement("textarea");
  temp.value = value;
  temp.setAttribute("readonly", "true");
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.append(temp);
  temp.select();
  document.execCommand("copy");
  temp.remove();
}
