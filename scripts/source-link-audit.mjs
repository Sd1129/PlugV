import fs from "node:fs";
import path from "node:path";

const files = [
  "data/vehicle-trip-profiles.ts",
  "data/vehicle-charging-facts.ts",
  "data/vehicles-upcoming.ts",
  "data/official-launched-ev-evidence.json",
];
const urls = new Set();
for (const file of files) for (const match of fs.readFileSync(path.join(process.cwd(), file), "utf8").matchAll(/["']?sourceUrl["']?\s*:\s*["'](https:\/\/[^"']+)["']/g)) urls.add(match[1]);
const failures = [], warnings = [], passes = [], queue = [...urls];

async function check(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "PlugV-Source-Monitor/1.0" } });
    if ([404, 410].includes(response.status)) failures.push(`${response.status} ${url}`);
    else if (response.ok || [401, 403, 429].includes(response.status)) passes.push(`${response.status} ${url}`);
    else warnings.push(`${response.status} ${url}`);
  } catch (error) { warnings.push(`unreachable ${url} (${error instanceof Error ? error.message : String(error)})`); }
  finally { clearTimeout(timeout); }
}
async function worker() { while (queue.length) await check(queue.shift()); }
await Promise.all(Array.from({ length: Math.min(8, queue.length || 1) }, worker));
const lines = ["# PlugV official-source link audit", "", `Checked: ${urls.size} unique official source URL(s)`, `Healthy/protected: ${passes.length}`, `Review: ${warnings.length}`, `Broken: ${failures.length}`, "", ...warnings.map((item) => `- REVIEW: ${item}`), ...failures.map((item) => `- BLOCK: ${item}`), "", `Result: ${failures.length ? "FAILED" : warnings.length ? "HEALTHY WITH REVIEWS" : "HEALTHY"}`];
console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(failures.length ? 1 : 0);
