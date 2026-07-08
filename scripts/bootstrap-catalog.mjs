import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const sources = {
  episodeRegistry: path.join(repoRoot, "data", "episode_registry.json"),
  trainingHubManifest: path.join(repoRoot, "episodes", "training_hub", "data", "modules.json"),
  pulseFeed: path.join(repoRoot, "data", "pulse.json"),
};

const outPath = path.join(repoRoot, "data", "catalog.json");

main();

function main() {
  const episodeRegistry = readJson(sources.episodeRegistry, "episode_registry.json");
  const trainingHubManifest = readJson(sources.trainingHubManifest, "training hub modules.json");
  const pulseFeed = readJson(sources.pulseFeed, "pulse.json");

  const catalog = {
    schema: "bytecast-catalog-v1",
    updated_on: new Date().toISOString(),
    episode_registry: episodeRegistry,
    training_hub_manifest: trainingHubManifest,
    pulse_feed: pulseFeed,
  };

  writeFileSync(outPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  console.log("Wrote data/catalog.json from current registries.");
  console.log("Next: run `node scripts/sync-catalog.mjs` to regenerate mirrors from the catalog.");
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read ${label}: ${relative(filePath)} (${error.message})`);
  }
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll("\\", "/");
}

