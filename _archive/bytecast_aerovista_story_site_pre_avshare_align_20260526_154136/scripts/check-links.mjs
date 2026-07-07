import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const htmlFiles = (await fs.readdir(rootDir))
  .filter((name) => name.toLowerCase().endsWith(".html"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

const scope = htmlFiles.filter(
  (name) =>
    /^act-(1|2|3)\.html$/i.test(name) ||
    /^act-(i|ii|iii)-/i.test(name) ||
    /^bytecast-act-[123]-/i.test(name),
);

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
    const resolved = path.resolve(rootDir, local);
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
  console.log(`No broken local refs in Acts 1-3 scope (${scope.length} pages checked).`);
}
