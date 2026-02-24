// seed_templates_loader.js
// Lightweight helper for Seed Orchard UI: role presets, templates, constraints, export naming.

const SEEDS_URL = "../data/seeds/apparel.json";
let SEEDS = null;

function $(sel) {
  return document.querySelector(sel);
}

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function loadSeeds() {
  if (SEEDS) return SEEDS;
  const res = await fetch(SEEDS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load seeds: ${res.status}`);
  SEEDS = await res.json();
  return SEEDS;
}

function populateRolePresets(roleSelect) {
  if (!roleSelect || !SEEDS || !Array.isArray(SEEDS.roles)) return;
  roleSelect.innerHTML =
    `<option value="">All roles</option>` +
    SEEDS.roles
      .map((r) => `<option value="${r.id}">${r.label}</option>`)
      .join("");
}

function populateTemplates(templateSelect, roleId = "") {
  if (!templateSelect || !SEEDS || !Array.isArray(SEEDS.templates)) return;
  const templates = SEEDS.templates.filter((t) => !roleId || t.roleId === roleId);
  templateSelect.innerHTML =
    `<option value="">Choose a template…</option>` +
    templates
      .map((t) => `<option value="${t.id}">${t.seedName}</option>`)
      .join("");
}

function applyTemplate(templateId, fields) {
  if (!SEEDS || !Array.isArray(SEEDS.templates)) return;
  const t = SEEDS.templates.find((x) => x.id === templateId);
  if (!t) return;

  if (fields.seedName) fields.seedName.value = t.seedName;
  if (fields.coreGoal) fields.coreGoal.value = t.coreGoal;
  if (fields.audience) fields.audience.value = t.audience;
  if (fields.harvestSize) fields.harvestSize.value = String(t.suggestedHarvestSize);
  if (fields.intensity) fields.intensity.value = String(t.suggestedIntensity || 3);

  if (fields.constraints && !fields.constraints.value) {
    fields.constraints.value = t.defaultConstraints || "";
  }

  if (fields.outputsHint) {
    const outputs = Array.isArray(t.recommendedOutputs) ? t.recommendedOutputs : [];
    const standard = Array.isArray(SEEDS.harvestOutputsStandard) ? SEEDS.harvestOutputsStandard : [];
    const labels = outputs
      .map((id) => standard.find((o) => o.id === id)?.label || id)
      .filter(Boolean);
    fields.outputsHint.textContent = labels.join(" • ");
  }
}

function buildExportBaseName(seedName, harvestSize) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const slug = slugify(seedName);
  const size = String(harvestSize || "").trim() || "0";
  return `seed_${slug || "seed"}__${yyyy}-${mm}-${dd}__${size}fruits`;
}

async function initSeedTemplates() {
  try {
    await loadSeeds();
  } catch (err) {
    // Non-fatal: Seed Orchard can still operate without templates.
    console.warn("[SeedTemplates] Failed to load apparel seeds:", err);
    return;
  }

  const roleSelect = $("#rolePreset");
  const templateSelect = $("#templatePicker");

  const fields = {
    seedName: $("#seedName"),
    coreGoal: $("#goal"),
    audience: $("#audience"),
    harvestSize: $("#harvestSize"),
    intensity: $("#intensity"),
    constraints: $("#constraints"),
    outputsHint: $("#outputsHint"),
  };

  populateRolePresets(roleSelect);
  populateTemplates(templateSelect, "");

  roleSelect?.addEventListener("change", (e) => {
    populateTemplates(templateSelect, e.target.value);
    templateSelect.value = "";
  });

  templateSelect?.addEventListener("change", (e) => {
    applyTemplate(e.target.value, fields);
  });

  // Export naming convention hook (used by Seed Orchard export).
  window.__bytecastSeedExportName = () =>
    buildExportBaseName(fields.seedName?.value || "", fields.harvestSize?.value || "");

  // Attach constraints into the seed artifact at "Plant" time.
  window.__bytecastSeedConstraints = () => (fields.constraints?.value || "").trim();
}

// Expose initializer globally for Seed Orchard UI.
window.initSeedTemplates = initSeedTemplates;