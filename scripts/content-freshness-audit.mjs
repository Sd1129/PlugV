import fs from "node:fs";
import path from "node:path";

const registryPath = path.join(process.cwd(), "data", "content-refresh-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const now = new Date();
const stale = [];

for (const item of registry) {
  const reviewed = new Date(`${item.lastReviewed}T00:00:00Z`);
  const ageDays = Math.floor((now.getTime() - reviewed.getTime()) / 86_400_000);
  const status = ageDays > item.cadenceDays ? "STALE" : ageDays + 7 > item.cadenceDays ? "DUE SOON" : "OK";
  console.log(`${status.padEnd(8)} ${item.path} — ${ageDays}/${item.cadenceDays} days — ${item.keyword}`);
  if (status === "STALE") stale.push(item.path);
}

if (stale.length) {
  console.error(`\n${stale.length} content page(s) exceeded their review cadence.`);
  process.exitCode = 1;
} else {
  console.log(`\nContent freshness READY: ${registry.length} tracked search pages.`);
}
