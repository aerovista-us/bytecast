(() => {
  const form = document.getElementById("seedForm");
  const fruitGrid = document.getElementById("fruitGrid");
  const cardTemplate = document.getElementById("fruitCardTemplate");
  const harvestMeta = document.getElementById("harvestMeta");
  const growthSteps = Array.from(document.querySelectorAll("#growthTrack li"));
  const intensityInput = document.getElementById("intensity");
  const intensityLabel = document.getElementById("intensityLabel");

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
  });

  intensityInput.addEventListener("input", setIntensityLabel);
  setIntensityLabel();
})();
