(() => {
  const form = document.getElementById("seedForm");
  const fruitGrid = document.getElementById("fruitGrid");
  const cardTemplate = document.getElementById("fruitCardTemplate");
  const harvestMeta = document.getElementById("harvestMeta");
  const growthSteps = Array.from(document.querySelectorAll("#growthTrack li"));
  const intensityInput = document.getElementById("intensity");
  const intensityLabel = document.getElementById("intensityLabel");
  const harvestActions = document.getElementById("harvestActions");
  const exportJsonBtn = document.getElementById("exportJson");
  const claimBadgeLink = document.getElementById("claimBadge");
  const exportNote = document.getElementById("exportNote");

  const Loop = window.ByteCastLoop || null;
  const LoopUI = window.ByteCastLoopUI || null;

  const WORKFLOW_KEY = "bytecast.workflow.v1";
  const BADGES_KEY = "bytecast.badges.v1";
  const JOURNEY_URL = "../../data/journey_steps.json";
  const PRIMARY_JOURNEY_ID = "";

  let lastArtifact = null;
  let cachedJourney = null;

  const intensityMap = {
    1: "Gentle growth",
    2: "Steady growth",
    3: "Balanced growth",
    4: "Fast growth",
    5: "Aggressive growth",
  };

  const fruitTypes = [
    "Product Fruit",
    "Audience Fruit",
    "System Fruit",
    "Story Fruit",
    "Revenue Fruit",
    "Retention Fruit",
  ];

  const titlePatterns = [
    "30-Day {goal} Sprint",
    "{seed} Conversion Map",
    "{audience} Starter Loop",
    "{goal} Signal Dashboard",
    "{seed} Micro-Challenge Series",
    "Proof-of-Work Launch Sequence",
    "{audience} Onboarding Orchard",
  ];

  const whyPatterns = [
    "Turns attention into momentum by giving {audience} one clear next step every session.",
    "Makes {goal} measurable instead of vague, so you can decide with signal instead of guesswork.",
    "Builds a repeatable path that keeps your seed useful after launch day.",
    "Compresses complexity into a simple workflow your team can run without friction.",
    "Creates visible wins fast, which strengthens trust and invites contribution.",
  ];

  const actionPatterns = [
    "First action: ship a draft with 3 steps, then test with 5 real {audience}.",
    "First action: publish one public checkpoint tied to {goal} by Friday.",
    "First action: define success in 1 metric, then build only what moves it.",
    "First action: run a 20-minute pilot and record what blocked progress.",
    "First action: turn your best existing asset into a guided entry point.",
  ];

  function hashString(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
  }

  function makeRng(seedNumber) {
    let state = seedNumber || 1;
    return () => {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 4294967296;
    };
  }

  function pick(rng, list) {
    return list[Math.floor(rng() * list.length)];
  }

  function renderPattern(pattern, data) {
    return pattern
      .replaceAll("{seed}", data.seedName)
      .replaceAll("{goal}", data.goal)
      .replaceAll("{audience}", data.audience);
  }

  function buildFruit(rng, data, index) {
    const title = renderPattern(pick(rng, titlePatterns), data);
    const why = renderPattern(pick(rng, whyPatterns), data);
    const action = renderPattern(pick(rng, actionPatterns), data);
    const effortScale = ["Light", "Medium", "Focused", "Heavy", "Sprint"];
    const signalBase = Math.max(58, Math.min(96, 56 + (data.intensity * 7) + Math.round(rng() * 10)));

    return {
      type: fruitTypes[index % fruitTypes.length],
      title,
      why,
      action,
      effort: effortScale[Math.max(0, data.intensity - 1)],
      signal: `${signalBase}% signal confidence`,
    };
  }

  function animateGrowth() {
    growthSteps.forEach((step) => step.classList.remove("is-active"));
    growthSteps.forEach((step, idx) => {
      setTimeout(() => step.classList.add("is-active"), idx * 240);
    });
  }

  function setIntensityLabel() {
    const value = Number(intensityInput.value);
    intensityLabel.textContent = intensityMap[value] || "Balanced growth";
  }

  function renderFruits(fruits) {
    fruitGrid.innerHTML = "";
    fruits.forEach((fruit, idx) => {
      const node = cardTemplate.content.firstElementChild.cloneNode(true);
      node.style.animationDelay = `${idx * 90}ms`;
      node.querySelector(".fruit-type").textContent = fruit.type;
      node.querySelector(".fruit-title").textContent = fruit.title;
      node.querySelector(".fruit-why").textContent = fruit.why;
      node.querySelector(".fruit-action").textContent = fruit.action;
      node.querySelector(".tag.effort").textContent = `${fruit.effort} effort`;
      node.querySelector(".tag.signal").textContent = fruit.signal;
      fruitGrid.appendChild(node);
    });
  }

  function loadWorkflow() {
    const fallback = {
      cycle: 1,
      abilityLevel: 0,
      bytecast: { listen: false, slide: false, interact: false },
      trainingDone: false,
      seedDone: false,
      updatedAt: "",
    };
    try {
      const raw = localStorage.getItem(WORKFLOW_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const bytecast = parsed.bytecast && typeof parsed.bytecast === "object" ? parsed.bytecast : {};
      return {
        ...fallback,
        ...parsed,
        cycle: Number.isFinite(Number(parsed.cycle)) ? Math.max(1, Number(parsed.cycle)) : 1,
        abilityLevel: Number.isFinite(Number(parsed.abilityLevel)) ? Math.max(0, Number(parsed.abilityLevel)) : 0,
        bytecast: { listen: Boolean(bytecast.listen), slide: Boolean(bytecast.slide), interact: Boolean(bytecast.interact) },
        trainingDone: Boolean(parsed.trainingDone),
        seedDone: Boolean(parsed.seedDone),
      };
    } catch {
      return fallback;
    }
  }

  function saveWorkflow(wf) {
    try { localStorage.setItem(WORKFLOW_KEY, JSON.stringify(wf)); } catch {}
  }

  function loadBadges() {
    if (Loop) return Loop.loadBadges();
    try {
      const raw = localStorage.getItem(BADGES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveBadges(badges) {
    if (Loop) {
      // Loop saves internally; keep this for legacy fallback.
      return;
    }
    try { localStorage.setItem(BADGES_KEY, JSON.stringify(badges)); } catch {}
  }

  function mintBadge(id, label, meta = {}) {
    if (Loop) return Loop.mintBadge(id, label, meta);
    const badges = loadBadges();
    if (badges.some((b) => b && b.id === id)) return false;
    badges.unshift({
      id,
      label,
      issuedAt: new Date().toISOString(),
      meta,
    });
    saveBadges(badges.slice(0, 50));
    return true;
  }

  function bytecastComplete(wf) {
    const bc = wf.bytecast || {};
    return Boolean(bc.listen && bc.slide && bc.interact);
  }

  function downloadJson(filename, obj) {
    const json = JSON.stringify(obj, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2500);
  }

  async function loadJourney() {
    if (!Loop) return null;
    const fallbackId = PRIMARY_JOURNEY_ID || "";
    const activeId = Loop.getActiveJourneyId?.() || fallbackId;
    if (cachedJourney && cachedJourney.id === activeId) return cachedJourney;
    const fallback = {
      journeys: [
        {
          id: "p1_golden_path",
          label: "P1: Golden Path",
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
    const config = await Loop.loadJourneyConfig(JOURNEY_URL, fallback);
    const journeys = Array.isArray(config?.journeys) ? config.journeys : [];
    const defaultId = journeys.find((j) => j && j.isDefault)?.id || journeys[0]?.id || "";
    const desired = activeId || defaultId || "p1_golden_path";
    cachedJourney = Loop.getJourneyById(config, desired) || Loop.getJourneyById(fallback, desired);
    return cachedJourney;
  }

  async function refreshExportUI() {
    if (!harvestActions) return;
    const wf = loadWorkflow();
    const bcOkLegacy = bytecastComplete(wf);
    const trainingOkLegacy = Boolean(wf.trainingDone);
    const wf2 = Loop ? Loop.ensureWorkflowV2() : null;
    const journey = Loop ? await loadJourney() : null;
    const bcOk = (Loop && journey && wf2)
      ? (Loop.isStepDone(wf2, "ep001_gates") || (journey.steps || []).some((s) => s?.id === "ep001_gates" && Loop.isStepComplete(journey, s, wf2)))
      : bcOkLegacy;
    const trainingOk = (Loop && journey && wf2)
      ? (Loop.isStepDone(wf2, "tr001_golden_path") || (journey.steps || []).some((s) => s?.id === "tr001_golden_path" && Loop.isStepComplete(journey, s, wf2)))
      : trainingOkLegacy;

    exportJsonBtn?.classList.toggle("is-disabled", !lastArtifact);
    exportJsonBtn && (exportJsonBtn.disabled = !lastArtifact);

    if (!lastArtifact) {
      harvestActions.hidden = true;
      return;
    }

    harvestActions.hidden = false;

    if (!bcOk) {
      exportNote.textContent = "Golden Path locked: complete EP-001 gates first (Listen + Slide + Engage). You can still export, but badge minting will wait.";
    } else if (!trainingOk) {
      exportNote.textContent = "Next step: complete Training (TR-001), then export to mint the badge.";
    } else {
      exportNote.textContent = "Ready: export your Seed artifact. This marks Seed complete and mints the Golden Path badge.";
    }

    if (trainingOk) {
      claimBadgeLink.textContent = "Back to Playlist (Badge)";
    } else {
      claimBadgeLink.textContent = "Back to Playlist";
    }

    if (Loop && journey) {
      // Keep claim link aligned with the config-defined badge step.
      const badgeStep = (journey.steps || []).find((s) => s?.lane === "badge") || (journey.steps || []).find((s) => s?.id?.startsWith("badge_"));
      if (badgeStep?.href) claimBadgeLink.href = Loop.resolveFromRoot(badgeStep.href);
    }

    if (LoopUI) {
      await LoopUI.renderJourneyMap({
        container: document.getElementById("journey-map"),
        configUrl: JOURNEY_URL,
        surface: "seed_orchard",
      });
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
      seedName: form.seedName.value.trim(),
      goal: form.goal.value.trim(),
      audience: form.audience.value.trim(),
      harvestSize: Number(form.harvestSize.value),
      intensity: Number(form.intensity.value),
    };

    if (!data.seedName || !data.goal || !data.audience) {
      harvestMeta.textContent = "Add seed name, goal, and audience first.";
      return;
    }

    const seedKey = `${data.seedName}|${data.goal}|${data.audience}|${data.intensity}`;
    const rng = makeRng(hashString(seedKey));
    const fruits = [];
    for (let i = 0; i < data.harvestSize; i += 1) {
      fruits.push(buildFruit(rng, data, i));
    }

    animateGrowth();
    renderFruits(fruits);
    harvestMeta.textContent = `${data.seedName}: harvested ${data.harvestSize} fruits for ${data.audience}.`;

    lastArtifact = {
      schema: "bytecast-seed-artifact-v1",
      tool: "seed_builder_studio/seed_orchard_ui",
      createdAt: new Date().toISOString(),
      seed: {
        name: data.seedName,
        goal: data.goal,
        audience: data.audience,
        harvestSize: data.harvestSize,
        intensity: data.intensity,
      },
      fruits,
    };

    void refreshExportUI();
  });

  exportJsonBtn?.addEventListener("click", () => {
    if (!lastArtifact) return;
    const safeName = String(lastArtifact.seed?.name || "seed")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 48) || "seed";

    const filename = `${safeName}_artifact.json`;
    downloadJson(filename, lastArtifact);

    if (Loop) {
      // Proof payload: artifact name + simple hash (sha256 when available).
      const json = JSON.stringify(lastArtifact, null, 2);
      const metaBase = {
        seed: lastArtifact.seed?.name || "",
        artifactName: filename,
        filesCount: 1,
        schema: lastArtifact.schema || "",
      };

      const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      const hashFallback = (text) => {
        let hash = 2166136261;
        for (let i = 0; i < text.length; i += 1) {
          hash ^= text.charCodeAt(i);
          hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return `fnv1a32:${(hash >>> 0).toString(16)}`;
      };

      (async () => {
        let artifactHash = "";
        try {
          if (window.crypto?.subtle) {
            const data = new TextEncoder().encode(json);
            const digest = await window.crypto.subtle.digest("SHA-256", data);
            artifactHash = `sha256:${toHex(digest)}`;
          } else {
            artifactHash = hashFallback(json);
          }
        } catch {
          artifactHash = hashFallback(json);
        }

        Loop.markStepDone("seed_export_v1", { ...metaBase, artifactHash });
        loadJourney().then((journey) => {
          if (!journey) return;
          const wf2 = Loop.ensureWorkflowV2();
          const badgeResult = Loop.ensureJourneyBadges(journey, wf2);
          if (badgeResult?.minted || badgeResult?.marked) Loop.saveWorkflowV2?.(wf2, journey?.id || "");
        });
        void refreshExportUI();
      })();
    } else {
      const wf = loadWorkflow();
      wf.seedDone = true;
      wf.updatedAt = new Date().toISOString();
      saveWorkflow(wf);
      if (bytecastComplete(wf) && wf.trainingDone) {
        mintBadge("p1_golden_path_v1", "P1: Golden Path", {
          cycle: wf.cycle,
          seed: lastArtifact.seed?.name || "",
        });
        exportNote.textContent = "Exported. Seed step complete. Badge minted. Open Playlist to see it.";
        claimBadgeLink.textContent = "Claim Badge + Back to Playlist";
      } else {
        exportNote.textContent = "Exported. Seed step complete. Finish EP-001 gates and Training to mint the badge.";
      }
    }

    if (!Loop) void refreshExportUI();
  });

  intensityInput.addEventListener("input", setIntensityLabel);
  setIntensityLabel();
  void refreshExportUI();
})();
