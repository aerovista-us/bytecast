import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const episodesRoot = path.join(repoRoot, "episodes");
const registryPath = path.join(repoRoot, "data", "episode_registry.json");
const codexRegistryPath = path.join(repoRoot, ".CODEX", "episode_registry.json");
const modulesPath = path.join(episodesRoot, "training_hub", "modules.json");
const modulesMirrorPath = path.join(episodesRoot, "training_hub", "data", "modules.json");
const catalogPath = path.join(repoRoot, "data", "catalog.json");

const issues = [];
const warnings = [];

main();

function main() {
  assertExists(episodesRoot, "episodes directory");

  const registry = readJson(registryPath, "runtime episode registry");
  const codexRegistry = readJson(codexRegistryPath, "builder episode registry mirror");
  const modules = readJson(modulesPath, "training hub module manifest");
  const modulesMirror = readJson(modulesMirrorPath, "training hub module manifest mirror");

  compareJson(registry, codexRegistry, "data/episode_registry.json", ".CODEX/episode_registry.json");
  compareJson(modules, modulesMirror, "episodes/training_hub/modules.json", "episodes/training_hub/data/modules.json");

  if (existsSync(catalogPath)) {
    const catalog = readJson(catalogPath, "catalog");
    if (catalog) {
      compareJson(catalog.episode_registry, registry, "data/catalog.json (episode_registry)", "data/episode_registry.json");
      compareJson(catalog.training_hub_manifest, modulesMirror, "data/catalog.json (training_hub_manifest)", "episodes/training_hub/data/modules.json");
      compareJson(catalog.pulse_feed, readJson(path.join(repoRoot, "data", "pulse.json"), "pulse feed"), "data/catalog.json (pulse_feed)", "data/pulse.json");
    }
  }

  const topDirs = listTopEpisodeDirs();
  checkRegistry(registry, modules, topDirs);
  checkModules(modules);
  checkMetadata(topDirs, registry, modules);
  checkHtmlLinks();

  console.log(`Episode preflight checked ${topDirs.length} top-level episode directories.`);
  console.log(`Issues: ${issues.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (issues.length) {
    console.log("\nIssues:");
    for (const issue of issues) console.log(` - ${issue}`);
  }

  if (warnings.length) {
    console.log("\nWarnings:");
    for (const warning of warnings) console.log(` - ${warning}`);
  }

  if (issues.length) {
    process.exitCode = 1;
  }
}

function assertExists(target, label) {
  if (!existsSync(target)) {
    issues.push(`Missing ${label}: ${relative(target)}`);
  }
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    issues.push(`Unable to read ${label}: ${relative(filePath)} (${error.message})`);
    return null;
  }
}

function compareJson(left, right, leftLabel, rightLabel) {
  if (!left || !right) return;
  const leftText = stableJson(left);
  const rightText = stableJson(right);
  if (leftText !== rightText) {
    issues.push(`${leftLabel} differs from ${rightLabel}`);
  }
}

function stableJson(value) {
  return JSON.stringify(value, Object.keys(flattenKeys(value)).sort(), 2);
}

function flattenKeys(value, out = {}) {
  if (Array.isArray(value)) {
    for (const item of value) flattenKeys(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      out[key] = true;
      flattenKeys(child, out);
    }
  }
  return out;
}

function listTopEpisodeDirs() {
  return readdirSync(episodesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function checkRegistry(registry, modules, topDirs) {
  if (!registry) return;
  const dirs = new Set(topDirs);
  const activeEpisodes = (registry.episodes || []).filter((entry) => entry.status !== "retired");
  const primaryPaths = new Set();
  const knownDirs = new Set();

  for (const entry of activeEpisodes) {
    if (!entry.slug) issues.push(`Registry entry missing slug: ${entry.title || "(untitled)"}`);
    if (!entry.primary_path) {
      issues.push(`Active registry entry missing primary_path: ${entry.slug || entry.title || "(untitled)"}`);
      continue;
    }

    const normalized = stripEpisodesPrefix(entry.primary_path);
    primaryPaths.add(normalized);
    const top = normalized.split("/")[0];
    knownDirs.add(top);
    if (!dirs.has(top)) {
      issues.push(`Registry primary_path does not exist: ${entry.primary_path}`);
    }

    if (!entry.series_id) warnings.push(`Registry entry missing series_id: ${entry.slug}`);
    if (entry.sequence === undefined) warnings.push(`Registry entry missing sequence: ${entry.slug}`);
  }

  for (const entry of registry.episodes || []) {
    for (const legacyPath of entry.legacy_paths || []) {
      knownDirs.add(stripEpisodesPrefix(legacyPath).split("/")[0]);
    }
  }

  for (const module of (modules && modules.modules) || []) {
    if (!module.canon_path || !module.canon_path.startsWith("episodes/")) continue;
    knownDirs.add(stripEpisodesPrefix(module.canon_path).split("/")[0]);
  }

  for (const dir of topDirs) {
    if (!knownDirs.has(dir) && isLikelyTrainingEntry(dir)) {
      warnings.push(`Top-level episode directory is not in episode registry or module manifest: episodes/${dir}`);
    }
  }
}

function checkModules(modules) {
  if (!modules) return;
  const ids = new Set();
  for (const module of modules.modules || []) {
    if (!module.id) issues.push(`Module manifest entry missing id: ${module.name || "(unnamed)"}`);
    if (module.id && ids.has(module.id)) issues.push(`Duplicate module id: ${module.id}`);
    if (module.id) ids.add(module.id);
    if (!module.path) issues.push(`Module ${module.id || module.name} missing path`);
    if (!module.canon_path) warnings.push(`Module ${module.id || module.name} missing canon_path`);
    if (module.path) checkPathFrom(path.join(episodesRoot, "training_hub"), module.path, `Module path for ${module.id || module.name}`);
  }
}

function checkMetadata(topDirs, registry, modules) {
  const registered = new Set(
    ((registry && registry.episodes) || [])
      .filter((entry) => entry.primary_path)
      .map((entry) => stripEpisodesPrefix(entry.primary_path).split("/")[0]),
  );
  const moduleCanon = new Set(
    ((modules && modules.modules) || [])
      .filter((entry) => entry.canon_path && entry.canon_path.startsWith("episodes/"))
      .map((entry) => stripEpisodesPrefix(entry.canon_path).split("/")[0]),
  );

  for (const dir of topDirs) {
    const full = path.join(episodesRoot, dir);
    const hasIndex = existsSync(path.join(full, "index.html"));
    const hasSot = existsSync(path.join(full, "SOT.json"));
    const hasProfile = existsSync(path.join(full, "bytecast_ep_profile.json"));
    const inDiscovery = registered.has(dir) || moduleCanon.has(dir);

    if (inDiscovery && !hasIndex) warnings.push(`Discoverable directory has no index.html: episodes/${dir}`);
    if (inDiscovery && !hasSot && !hasProfile) warnings.push(`Discoverable directory has no SOT.json or bytecast_ep_profile.json: episodes/${dir}`);
  }
}

function checkHtmlLinks() {
  const htmlFiles = [];
  walk(episodesRoot, (file) => {
    if (file.toLowerCase().endsWith(".html")) htmlFiles.push(file);
  });

  const attrRegex = /(?:href|src)=["']([^"']+)["']/g;
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(attrRegex)) {
      const ref = match[1] || "";
      if (skipRef(ref)) continue;
      const local = ref.split("#")[0].split("?")[0];
      if (!local) continue;
      checkPathFrom(path.dirname(file), local, `${relative(file)} -> ${ref}`);
    }
  }
}

function checkPathFrom(baseDir, ref, label) {
  const resolved = path.resolve(baseDir, ref);
  if (!existsSync(resolved)) {
    issues.push(`Broken local ref: ${label}`);
  }
}

function skipRef(ref) {
  return (
    !ref ||
    ref.includes("${") ||
    /^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(ref)
  );
}

function walk(dir, onFile) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, onFile);
    } else if (entry.isFile()) {
      onFile(full);
    }
  }
}

function stripEpisodesPrefix(value) {
  return String(value || "").replace(/^episodes\//, "");
}

function isLikelyTrainingEntry(dir) {
  return ![
    "Art.Localized",
    "Developing in Agentic AI Systems",
    "Division_Quickstarts",
    "SOT-system",
    "av_apparel",
    "infografic",
    "training_hub",
  ].includes(dir);
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}
