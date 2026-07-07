const MANIFEST_PATH = "./data/modules.json";
const CANON_MAP_PATH = "../../.CODEX/bytecast_canon_map_2026-02-08.md";
const JOURNEY_PATH = "../../data/journey_steps.json";
const PRIMARY_JOURNEY_ID = "";
const WORKFLOW_KEY = "bytecast.workflow.v1";
const APP_MODE = document.body.dataset.appMode || "training";
const Loop = window.ByteCastLoop || null;
const LoopUI = window.ByteCastLoopUI || null;

const state = {
  modules: [],
  series: [],
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
  openGlossaryWindow: document.getElementById("open-glossary-window"),
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
    state.series = Array.isArray(manifest.series) ? manifest.series : [];
    state.canonEntries = parseCanonEntries(canonMarkdown);
    state.journeyConfig = Array.isArray(journeyConfig?.journeys) ? journeyConfig : null;
    const journeys = Array.isArray(state.journeyConfig?.journeys) ? state.journeyConfig.journeys : [];
    const activeId = Loop?.getActiveJourneyId?.() || journeys.find((j) => j && j.isDefault)?.id || journeys[0]?.id || "";
    state.primaryJourney = Loop && state.journeyConfig ? Loop.getJourneyById(state.journeyConfig, activeId) : null;

    hydrateCategoryFilter(state.modules);
    render();
    renderWorkflow();
    refs.loadStatus.textContent = `Loaded ${state.modules.length} learning modules across ${state.series.length || 1} registered series.`;
  } catch (error) {
    console.error(error);
    refs.loadStatus.textContent = `Could not load the learning module list. ${error.message}`;
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
  refs.openGlossaryWindow?.addEventListener("click", onOpenGlossaryWindow);
  window.addEventListener("storage", renderWorkflow);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      renderWorkflow();
    }
  });
}

function onOpenGlossaryWindow() {
  const url = "./glossary/index.html";
  const popup = window.open(
    url,
    "bytecastGlossary",
    "popup=yes,width=620,height=760,resizable=yes,scrollbars=yes"
  );
  if (popup && typeof popup.focus === "function") {
    popup.focus();
    return;
  }
  window.location.href = url;
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

function toLearningStepLabel(label) {
  return String(label || "Next step")
    .replace(/\bGates\b/g, "Progress Check")
    .replace(/\bSeed Export\b/g, "Practice Artifact")
    .replace(/\bPublish Link\b/g, "Published Link")
    .replace(/\bBadge\b/g, "Badge Review")
    .replace(/\s+/g, " ")
    .trim();
}

function toLearningCta(cta, fallbackLabel = "Next step") {
  const cleaned = String(cta || "")
    .replace(/^Legendary:\s*/i, "")
    .trim();
  return cleaned || `Open ${toLearningStepLabel(fallbackLabel)}`;
}

function toProgressState(done, readyNow) {
  if (done) return "Done";
  return readyNow ? "Next" : "Later";
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
      `${journey.label}. ${doneCount}/${Math.max(1, steps.length)} steps complete. ` +
      `${next ? `Next step: ${toLearningStepLabel(next.label)}.` : "You have finished this learning lane."}`;

    const laneStep = (lane) => steps.find((s) => s && s.lane === lane) || null;
    const bc = laneStep("bytecast");
    const sd = laneStep("seed");

    const bcDone = bc ? Loop.isStepComplete(journey, bc, wf2) : Loop.isStepDone(wf2, "ep001_gates");
    const trStep = (journey.steps || []).find((s) => s && (s.id === "tr001a_day1_foundations" || s.id === "tr001_golden_path"));
    const trDone = trStep
      ? Loop.isStepComplete(journey, trStep, wf2)
      : Loop.isStepDone(wf2, "tr001a_day1_foundations") || Loop.isStepDone(wf2, "tr001_golden_path");
    const sdDone = sd ? Loop.isStepComplete(journey, sd, wf2) : Loop.isStepDone(wf2, "seed_export_v1");

    refs.wfBytecast?.classList.toggle("done", bcDone);
    refs.wfTraining?.classList.toggle("done", trDone);
    refs.wfSeed?.classList.toggle("done", sdDone);
    if (refs.wfBytecast) refs.wfBytecast.textContent = `ByteCast lessons ${toProgressState(bcDone, true)}`;
    if (refs.wfTraining) refs.wfTraining.textContent = `Training mission ${toProgressState(trDone, bcDone)}`;
    if (refs.wfSeed) refs.wfSeed.textContent = `Practice builder ${toProgressState(sdDone, trDone)}`;

    if (refs.markLoopStep) {
      const disabled = !nextHref;
      refs.markLoopStep.disabled = disabled;
      refs.markLoopStep.classList.toggle("is-disabled", disabled);
      refs.markLoopStep.textContent = next ? `Open ${toLearningStepLabel(next.label)}` : "Next step unavailable";
    }

    if (refs.nextAppLink) {
      refs.nextAppLink.href = nextHref || "../seed_bytecast.html";
      refs.nextAppLink.textContent = next ? toLearningCta(next.cta, next.label) : "Open Playlist";
      refs.nextAppLink.classList.toggle("is-disabled", !nextHref);
      refs.nextAppLink.setAttribute("aria-disabled", nextHref ? "false" : "true");
    }

    setWorkflowNote(`Last updated: ${updatedAt}. Finish the current step, then open the next one.`);

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
    `ByteCast lessons complete: ${bytecastCompletedCount}/3. ` +
    `${seedUnlocked ? "Practice Builder is ready." : "Finish Listen, Slides, Engage, and the training mission to open Practice Builder."}`;

  refs.wfBytecast?.classList.toggle("done", bytecastComplete);
  refs.wfTraining?.classList.toggle("done", Boolean(workflowState.trainingDone));
  refs.wfSeed?.classList.toggle("done", seedUnlocked);
  if (refs.wfBytecast) {
    refs.wfBytecast.textContent = bytecastComplete
      ? "ByteCast lessons Done"
      : `ByteCast lessons ${bytecastCompletedCount}/3`;
  }
  if (refs.wfTraining) {
    refs.wfTraining.textContent = workflowState.trainingDone
      ? "Training mission Done"
      : (trainingUnlocked ? "Training mission Next" : "Training mission Later");
  }
  if (refs.wfSeed) {
    refs.wfSeed.textContent = seedUnlocked ? "Practice builder Next" : "Practice builder Later";
  }

  if (refs.markLoopStep) {
    refs.markLoopStep.disabled = !trainingUnlocked || Boolean(workflowState.trainingDone);
    refs.markLoopStep.classList.toggle("is-disabled", refs.markLoopStep.disabled);
    refs.markLoopStep.textContent = workflowState.trainingDone
      ? "Training Mission Complete"
      : "Mark Training Mission Complete";
  }

  if (refs.nextAppLink) {
    refs.nextAppLink.classList.toggle("is-disabled", !seedUnlocked);
    refs.nextAppLink.setAttribute("aria-disabled", seedUnlocked ? "false" : "true");
  }

  setWorkflowNote(
    `Last updated: ${updatedAt}. Recommended order: Listen, Slides, Engage, training mission, then Practice Builder.`
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
      setWorkflowNote("Finish Listen, Slides, and Engage before marking the training mission complete.");
      return;
    }

    if (workflowState.trainingDone) {
      setWorkflowNote("This training mission is already marked complete.");
      return;
    }

    workflowState.trainingDone = true;
    workflowState.updatedAt = new Date().toISOString();
    saveWorkflowState(workflowState);
    renderWorkflow();
    setWorkflowNote("Training mission completed. Practice Builder is now ready.");
    return;
  }

  if (!isSeedUnlocked(workflowState)) {
    setWorkflowNote("Practice Builder opens after ByteCast lessons and the training mission are complete.");
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
  setWorkflowNote("Practice work recorded. Start the next learning cycle at the ByteCast Listen step.");
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
      refs.loadStatus.textContent = "Copy failed. You can still open the learning module from its link.";
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

function getSeriesMeta(seriesId) {
  const lookup = String(seriesId || "").trim();
  if (!lookup) {
    return null;
  }

  return state.series.find((series) => String(series?.id || "").trim() === lookup) || null;
}

function getSeriesOrder(module) {
  const meta = getSeriesMeta(module.series_id);
  const numeric = Number(meta?.sort_order);
  return Number.isFinite(numeric) ? numeric : 999;
}

function getModuleSequence(module) {
  const numeric = Number(module.sequence);
  return Number.isFinite(numeric) ? numeric : 999;
}

function getSeriesName(module) {
  return module.series_name || getSeriesMeta(module.series_id)?.name || "Ungrouped";
}

function getSeriesDescription(module) {
  return getSeriesMeta(module.series_id)?.description || "";
}

function groupModulesBySeries(modules) {
  const grouped = new Map();

  for (const module of modules) {
    const key = String(module.series_id || "ungrouped");
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        name: getSeriesName(module),
        description: getSeriesDescription(module),
        sortOrder: getSeriesOrder(module),
        modules: [],
      });
    }

    grouped.get(key).modules.push(module);
  }

  return [...grouped.values()].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }
    return left.name.localeCompare(right.name);
  });
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
        module.part_label,
        getSeriesName(module),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    })
    .sort((left, right) => {
      const seriesDiff = getSeriesOrder(left) - getSeriesOrder(right);
      if (seriesDiff !== 0) {
        return seriesDiff;
      }

      const sequenceDiff = getModuleSequence(left) - getModuleSequence(right);
      if (sequenceDiff !== 0) {
        return sequenceDiff;
      }

      return left.name.localeCompare(right.name);
    });

  refs.modulesGrid.replaceChildren();
  for (const group of groupModulesBySeries(visibleModules)) {
    refs.modulesGrid.append(renderSeriesGroup(group));
  }

  refs.emptyState.hidden = visibleModules.length !== 0;
  updateMetrics(enrichedModules, visibleModules.length);
}

function renderSeriesGroup(group) {
  const section = document.createElement("section");
  section.className = "series-group";

  const head = document.createElement("div");
  head.className = "series-group__head";
  section.append(head);

  const copy = document.createElement("div");
  copy.className = "series-group__copy";
  head.append(copy);

  const title = document.createElement("h3");
  title.className = "series-group__title";
  title.textContent = group.name;
  copy.append(title);

  if (group.description) {
    const description = document.createElement("p");
    description.className = "series-group__desc";
    description.textContent = group.description;
    copy.append(description);
  }

  const count = document.createElement("span");
  count.className = "series-group__count";
  count.textContent = `${group.modules.length} module${group.modules.length === 1 ? "" : "s"}`;
  head.append(count);

  const modules = document.createElement("div");
  modules.className = "series-group__modules";
  section.append(modules);

  for (const module of group.modules) {
    modules.append(renderModuleCard(module));
  }

  return section;
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
  const partBits = [];
  if (module.part_label) {
    partBits.push(module.part_label);
  }
  if (Number.isFinite(Number(module.step_count)) && Number(module.step_count) > 0) {
    partBits.push(`${module.step_count} step${Number(module.step_count) === 1 ? "" : "s"}`);
  }
  const metaLines = [
    `Series: <strong>${escapeHtml(getSeriesName(module))}</strong>${partBits.length ? ` - ${escapeHtml(partBits.join(" - "))}` : ""}`,
    `Owner: <strong>${escapeHtml(module.owner || "Unassigned")}</strong>`,
    `Category: <strong>${escapeHtml(module.category || "general")}</strong>`,
    module.manual_path ? `Manual: <code>${escapeHtml(module.manual_path)}</code>` : "",
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
  launch.textContent = module.launch_label || "Launch";
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
