import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const htmlFiles = await listHtmlFiles(rootDir);

const scope = htmlFiles
  .filter(
    (name) =>
      /^act-\d+\.html$/i.test(name) ||
      /^episodes\//i.test(name) ||
      name === "index.html" ||
      name === "site-map.html",
  )
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const attrRegex = /(?:href|src)="([^"]+)"/g;
const broken = [];

for (const name of scope) {
  const content = await fs.readFile(path.join(rootDir, name), "utf8");
  const matches = [...content.matchAll(attrRegex)];
  for (const match of matches) {
    const ref = match[1] || "";
    if (!ref || /^(https?:|mailto:|#|data:)/i.test(ref)) continue;
    const local = ref.split("#")[0].split("?")[0];
    if (!local) continue;
    const resolved = path.resolve(rootDir, path.dirname(name), local);
    try {
      await fs.access(resolved);
    } catch {
      broken.push(`${name} -> ${ref}`);
    }
  }
}

if (broken.length) {
  console.log("Broken refs:");
  for (const line of broken) console.log(line);
  process.exitCode = 1;
} else {
  console.log(`No broken local refs in site scope (${scope.length} pages checked).`);
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
