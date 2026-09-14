import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const command = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(command, ["audit", "--omit=dev", "--json"], {
  cwd: process.cwd(), encoding: "utf8", shell: process.platform === "win32",
  env: { ...process.env, npm_config_cache: path.join(process.cwd(), ".npm-cache") },
});
let report;
try { report = JSON.parse(result.stdout); }
catch { console.error(`BLOCK npm audit did not return readable JSON${result.error ? `: ${result.error.message}` : ""}`); process.exit(1); }

if (result.error || report.error || !report.vulnerabilities || !report.metadata || ![0, 1].includes(result.status)) {
  console.error("BLOCK npm audit failed to produce a complete vulnerability report");
  process.exit(1);
}
const now = new Date();
const blockers = [];
for (const [name, vulnerability] of Object.entries(report.vulnerabilities ?? {})) {
  if (!["high", "critical"].includes(vulnerability.severity)) continue;
  const details = (vulnerability.via ?? []).filter((item) => typeof item === "object");
  const urls = details.map((item) => item.url ?? "");
  blockers.push(`${name}: ${vulnerability.severity}${urls.length ? ` (${urls.join(", ")})` : ""}`);
}
const lines = ["# PlugV production dependency audit", "", `Run at: ${now.toISOString()}`, "", ...blockers.map((item) => `- BLOCK: ${item}`), "", `Result: ${blockers.length ? "FAILED" : "READY"}`];
console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(blockers.length ? 1 : 0);
