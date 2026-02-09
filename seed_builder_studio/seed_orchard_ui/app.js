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

  const WORKFLOW_KEY = "bytecast.workflow.v1";
  const BADGES_KEY = "bytecast.badges.v1";

  let lastArtifact = null;

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
    try {
      const raw = localStorage.getItem(BADGES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveBadges(badges) {
    try { localStorage.setItem(BADGES_KEY, JSON.stringify(badges)); } catch {}
  }

  function mintBadge(id, label, meta = {}) {
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

  function refreshExportUI() {
    if (!harvestActions) return;
    const wf = loadWorkflow();
    const bcOk = bytecastComplete(wf);
    const trainingOk = Boolean(wf.trainingDone);

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

    refreshExportUI();
  });

  exportJsonBtn?.addEventListener("click", () => {
    if (!lastArtifact) return;
    const safeName = String(lastArtifact.seed?.name || "seed")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 48) || "seed";

    downloadJson(`${safeName}_artifact.json`, lastArtifact);

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

    refreshExportUI();
  });

  intensityInput.addEventListener("input", setIntensityLabel);
  setIntensityLabel();
  refreshExportUI();
})();
