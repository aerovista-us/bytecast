#!/usr/bin/env node
/**
 * Forge Agent Day narration via NXCore EchoVerse TTS.
 *
 * Usage:
 *   node scripts/narration-forge-agent-day.mjs 5
 *   node scripts/narration-forge-agent-day.mjs 5 6 7 8 9 10
 *   AGENT_DAY=8 node scripts/narration-forge-agent-day.mjs
 *
 * Prereq: python scripts/agent_day_voiceover_build.py <day>
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { synthesizeNxcoreTts, resolveGenerateUrlForConfig } from "../tools/narration/forge-lib.mjs";

const repoRoot = process.cwd();
const force = process.env.NARRATION_FORCE === "1";

const days = parseDays();
if (!days.length) {
  console.error("Usage: node scripts/narration-forge-agent-day.mjs <day> [day...]");
  console.error("       AGENT_DAY=5 node scripts/narration-forge-agent-day.mjs");
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  console.error("\nTry: npm run probe:tts");
  console.error('  set NXCORE_TTS_URL=http://127.0.0.1:5315/api/generate');
  process.exit(1);
});

function parseDays() {
  const env = process.env.AGENT_DAY?.trim();
  const fromArgv = process.argv.slice(2).map((n) => Number(n)).filter((n) => n >= 1 && n <= 10);
  if (fromArgv.length) return [...new Set(fromArgv)];
  if (env) return [Number(env)];
  return [];
}

async function main() {
  for (const day of days) {
    await forgeDay(day);
  }
}

async function forgeDay(day) {
  const forgeDir = path.join(repoRoot, "tools", "narration", `agent_day${day}`);
  const configPath = path.join(forgeDir, "forge.config.json");
  if (!existsSync(configPath)) {
    throw new Error(`Missing ${configPath} — run: python scripts/agent_day_voiceover_build.py ${day}`);
  }
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const linesPath = path.join(repoRoot, config.linesMaster);
  const recipesPath = path.join(repoRoot, config.voiceRecipes);
  const sequencesPath = path.join(repoRoot, config.sequences);
  const outDir = path.join(repoRoot, config.outputDir);
  const manifestPath = path.join(repoRoot, config.runtimeManifest);
  const generateUrl = resolveGenerateUrlForConfig(config);

  console.log(`\n=== Agent Day ${day} (${config.episodeCode}) ===`);
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
      console.warn(`  skip missing line: ${lineId}`);
      continue;
    }
    const recipe = recipes[line.voiceRecipe] || recipes["byte-narrator"] || {};
    const hash = createHash("sha256").update(line.text + JSON.stringify(recipe)).digest("hex").slice(0, 16);
    const ext = (recipe.format || process.env.NXCORE_TTS_FORMAT || "wav").replace(/^\./, "");
    const fileName = `${lineId}-${hash}.${ext}`;
    const filePath = path.join(outDir, fileName);
    const relSrc = `assets/narration/${fileName}`;

    if (!force && existsSync(filePath) && statSync(filePath).size > 500) {
      console.log(`  [skip] ${lineId} → ${fileName}`);
    } else {
      console.log(`  [forge] ${lineId}…`);
      const buf = await synthesizeNxcoreTts({ text: line.text, recipe, forgeConfig: config });
      writeFileSync(filePath, buf);
      console.log(`    wrote ${fileName} (${buf.length} bytes)`);
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
  console.log(`  Manifest: ${path.relative(repoRoot, manifestPath)} (${tracks.length} tracks)`);
}
