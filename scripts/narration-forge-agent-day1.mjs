#!/usr/bin/env node
/**
 * Forge Agent Day 1 narration via NXCore EchoVerse TTS.
 *
 * Prereq: python scripts/first_door_voiceover_build.py
 *
 * Env (bash on NXCore):
 *   export NXCORE_TTS_URL="http://127.0.0.1:5315/api/generate"
 *   export NXCORE_TTS_ENGINE=piper   # optional (default)
 *   export NXCORE_TTS_FORMAT=wav     # required for starter MVP
 *   export NARRATION_FORCE=1          # optional regen all
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { synthesizeNxcoreTts, resolveGenerateUrlForConfig } from "../tools/narration/forge-lib.mjs";

const repoRoot = process.cwd();
const forgeDir = path.join(repoRoot, "tools", "narration", "agent_day1");
const config = JSON.parse(readFileSync(path.join(forgeDir, "forge.config.json"), "utf8"));
const linesPath = path.join(repoRoot, config.linesMaster);
const recipesPath = path.join(repoRoot, config.voiceRecipes);
const sequencesPath = path.join(repoRoot, config.sequences);
const outDir = path.join(repoRoot, config.outputDir);
const manifestPath = path.join(repoRoot, config.runtimeManifest);

const generateUrl = resolveGenerateUrlForConfig(config);
const force = process.env.NARRATION_FORCE === "1";

main().catch((err) => {
  console.error(err.message || err);
  console.error("\nTry: npm run probe:tts");
  console.error('  export NXCORE_TTS_URL="http://127.0.0.1:5315/api/generate"');
  process.exit(1);
});

async function main() {
  console.log("TTS endpoint:", generateUrl);

  const linesDoc = JSON.parse(readFileSync(linesPath, "utf8"));
  const recipes = JSON.parse(readFileSync(recipesPath, "utf8")).recipes || {};
  const sequences = JSON.parse(readFileSync(sequencesPath, "utf8"));
  const seqId = sequences.defaultSequence || "full_journey";
  const seq = sequences.sequences?.[seqId];
  if (!seq) throw new Error(`Missing sequence: ${seqId}`);

  const byId = Object.fromEntries((linesDoc.lines || []).map((l) => [l.id, l]));
  mkdirSync(outDir, { recursive: true });

  const tracks = [];
  for (const lineId of seq.lineIds) {
    const line = byId[lineId];
    if (!line) {
      console.warn(`skip missing line: ${lineId}`);
      continue;
    }
    const recipe = recipes[line.voiceRecipe] || recipes["byte-narrator"] || {};
    const hash = createHash("sha256").update(line.text + JSON.stringify(recipe)).digest("hex").slice(0, 16);
    const ext = (recipe.format || process.env.NXCORE_TTS_FORMAT || "wav").replace(/^\./, "");
    const fileName = `${lineId}-${hash}.${ext}`;
    const filePath = path.join(outDir, fileName);
    const relSrc = `assets/narration/${fileName}`;

    if (!force && existsSync(filePath) && statSync(filePath).size > 500) {
      console.log(`[skip] ${lineId} → ${fileName}`);
    } else {
      console.log(`[forge] ${lineId}…`);
      const buf = await synthesizeNxcoreTts({
        text: line.text,
        recipe,
        forgeConfig: config,
      });
      writeFileSync(filePath, buf);
      console.log(`  wrote ${fileName} (${buf.length} bytes)`);
    }

    tracks.push({ id: lineId, label: line.label || lineId, src: relSrc });
  }

  const manifest = {
    schema: "narration-manifest-v1",
    packId: config.packId,
    episodeCode: config.episodeCode,
    sequenceId: seqId,
    forgedAt: new Date().toISOString(),
    ttsGenerateUrl: generateUrl,
    tracks,
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Manifest: ${path.relative(repoRoot, manifestPath)} (${tracks.length} tracks)`);
}
