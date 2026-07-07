import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const htmlFiles = (await listHtmlFiles(rootDir))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

// Matches build-site's generator: data-audio-sources="audio/slug/01.mp3|audio/slug/02.mp3..."
const playButtonRegex = /<button[^>]*data-play-narration[^>]*>/i;
const audioSourcesRegex = /data-audio-sources="([^"]*)"/i;

const pages = [];
for (const file of htmlFiles) {
  const fullPath = path.join(rootDir, file);
  const html = await fs.readFile(fullPath, "utf8");
  if (!playButtonRegex.test(html)) continue;

  const audioSourcesMatch = html.match(audioSourcesRegex);
  const audioSourcesValue = audioSourcesMatch?.[1] ?? "";
  const sources = audioSourcesValue
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  if (sources.length === 0) {
    pages.push({ file, status: "empty_audio_sources" });
    continue;
  }

  const missing = [];
  for (const src of sources) {
    const localPath = path.resolve(rootDir, path.dirname(file), src);
    try {
      await fs.access(localPath);
    } catch {
      missing.push(src);
    }
  }

  pages.push({ file, status: missing.length ? "missing_audio_files" : "audio_ok", missing });
}

const empty = pages.filter((p) => p.status === "empty_audio_sources").map((p) => p.file);
const missing = pages.filter((p) => p.status === "missing_audio_files");

if (empty.length) {
  console.log("Pages with Play narration but EMPTY data-audio-sources (fallback only):");
  for (const f of empty) console.log(" - " + f);
}

if (missing.length) {
  console.log("\nPages with Play narration but missing referenced audio files:");
  for (const p of missing) {
    console.log(" - " + p.file);
    for (const m of p.missing) console.log("    * missing: " + m);
  }
}

if (!empty.length && !missing.length) {
  console.log("All Play narration pages have generated audio sources present on disk.");
}

async function listHtmlFiles(dir, base = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "archive" || entry.name === "bytecast_aerovista_story_site") continue;
    const relative = base ? `${base}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(fullPath, relative)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      files.push(relative);
    }
  }
  return files;
}
