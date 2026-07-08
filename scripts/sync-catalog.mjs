import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const catalogPath = path.join(repoRoot, "data", "catalog.json");

const outputs = [
  {
    label: "runtime episode registry",
    outPath: path.join(repoRoot, "data", "episode_registry.json"),
    pick: (catalog) => catalog?.episode_registry,
  },
  {
    label: "builder episode registry mirror",
    outPath: path.join(repoRoot, ".CODEX", "episode_registry.json"),
    pick: (catalog) => catalog?.episode_registry,
  },
  {
    label: "training hub module manifest",
    outPath: path.join(repoRoot, "episodes", "training_hub", "data", "modules.json"),
    pick: (catalog) => catalog?.training_hub_manifest,
  },
  {
    label: "training hub module manifest mirror",
    outPath: path.join(repoRoot, "episodes", "training_hub", "modules.json"),
    pick: (catalog) => catalog?.training_hub_manifest,
  },
  {
    label: "pulse feed",
    outPath: path.join(repoRoot, "data", "pulse.json"),
    pick: (catalog) => catalog?.pulse_feed,
  },
];

main();

function main() {
  const catalog = readJson(catalogPath, "catalog");
  assertSchema(catalog);

  for (const out of outputs) {
    const payload = out.pick(catalog);
    if (!payload || typeof payload !== "object") {
      throw new Error(`Catalog missing ${out.label} payload`);
    }
    ensureDir(path.dirname(out.outPath));
    writeJson(out.outPath, payload);
  }

  console.log(`Synced ${outputs.length} outputs from data/catalog.json`);
}

function assertSchema(catalog) {
  const schema = String(catalog?.schema || "").trim();
  if (schema !== "bytecast-catalog-v1") {
    throw new Error(`Unsupported catalog schema: ${schema || "(missing)"}`);
  }

  const required = ["episode_registry", "training_hub_manifest", "pulse_feed"];
  for (const key of required) {
    if (!catalog?.[key]) {
      throw new Error(`Catalog missing required key: ${key}`);
    }
  }
}

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read ${label}: ${relative(filePath)} (${error.message})`);
  }
}

function writeJson(filePath, value) {
  const text = JSON.stringify(value, null, 2) + "\n";
  writeFileSync(filePath, text, "utf8");
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll("\\", "/");
}

