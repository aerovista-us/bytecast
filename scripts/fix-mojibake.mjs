#!/usr/bin/env node
/**
 * Repair common UTF-8 mojibake (Latin-1 misread) in ByteCast HTML/JSON text files.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const TARGETS = [
  "episodes/aerovista_7_division_overview/index.html",
  "episodes/current_truth_basics/index.html",
  "episodes/training_missions/tr_001a_day1_foundations/index.html",
  "episodes/training_missions/tr_001_golden_path/index.html",
  "episodes/aerovista_offer_pack/app/index.html",
];

/** @type {[string, string][]} */
const REPLACEMENTS = [
  ["\u00e2\u20ac\u201d", "\u2014"], // â€" -> em dash
  ["\u00e2\u20ac\u00a2", "\u2022"], // â€¢ -> bullet
  ["\u00e2\u2020\u2019", "\u2192"], // â†' -> arrow
  ["\u00e2\u2020\u0090", "\u2190"], // â† -> left arrow
  ["\u00e2\u2030\u00a5", "\u2265"], // â‰¥ -> >=
  ["\u00e2\u20ac\u00a6", "\u2026"], // â€¦ -> ellipsis
  ["\u00e2\u20ac\u0153", "\""], // â€œ
  ["\u00e2\u20ac\u009d", "\""], // â€
  ["\u00e2\u20ac\u2122", "'"], // â€™
  ["\u00e2\u20ac\u02dc", "'"], // â€˜
  ["\u00c2\u00b7", "\u00b7"], // Â·
];

let changed = 0;

for (const rel of TARGETS) {
  const filePath = path.join(repoRoot, rel);
  let text;
  try {
    text = readFileSync(filePath, "utf8");
  } catch (error) {
    console.warn(`skip ${rel}: ${error.message}`);
    continue;
  }

  let next = text;
  for (const [bad, good] of REPLACEMENTS) {
    next = next.split(bad).join(good);
  }

  if (next !== text) {
    writeFileSync(filePath, next, "utf8");
    changed++;
    console.log(`fixed: ${rel}`);
  } else {
    console.log(`ok: ${rel}`);
  }
}

console.log(`Mojibake pass complete (${changed} file(s) updated).`);
