#!/usr/bin/env node
/**
 * Probe NXCore TTS before running forge:agent-day1
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { probeNxcoreTts, resolveGenerateUrlForConfig } from "../tools/narration/forge-lib.mjs";

const repoRoot = process.cwd();
const config = JSON.parse(
  readFileSync(path.join(repoRoot, "tools/narration/agent_day1/forge.config.json"), "utf8")
);

const url = resolveGenerateUrlForConfig(config);
console.log("NXCORE_TTS_URL resolved to:", url);
console.log("(bash) export NXCORE_TTS_URL=\"" + url + "\"");

probeNxcoreTts(config)
  .then((r) => {
    console.log("Probe:", r.ok ? "OK" : "FAILED");
    if (r.voices) console.log("Voices endpoint:", JSON.stringify(r.voices).slice(0, 300));
    if (r.probeBytes) console.log("Generate probe bytes:", r.probeBytes);
    if (!r.ok) process.exit(1);
  })
  .catch((err) => {
    console.error("Probe failed:", err.message || err);
    console.error("\nOn NXCore (bash):");
    console.error('  export NXCORE_TTS_URL="http://127.0.0.1:5315/api/generate"');
    console.error("  npm run probe:tts");
    process.exit(1);
  });
