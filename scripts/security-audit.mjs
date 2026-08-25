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

const exception = {
  advisory: "GHSA-ggr8-5vv4-36mx",
  packages: new Set(["deepmerge-ts", "@prisma/config", "prisma", "@prisma/client"]),
  expires: new Date("2026-09-15T00:00:00Z"),
  reason: "Upstream Prisma configuration chain; no non-breaking fix is available and recursive config objects are not accepted from users.",
};
const now = new Date();
const blockers = [], accepted = [];
for (const [name, vulnerability] of Object.entries(report.vulnerabilities ?? {})) {
  if (!["high", "critical"].includes(vulnerability.severity)) continue;
  const details = (vulnerability.via ?? []).filter((item) => typeof item === "object");
  const urls = details.map((item) => item.url ?? "");
  const known = exception.packages.has(name) && (name !== "deepmerge-ts" || urls.some((url) => url.includes(exception.advisory)));
  if (known && now < exception.expires) accepted.push(`${name}: accepted until ${exception.expires.toISOString().slice(0, 10)}`);
  else blockers.push(`${name}: ${vulnerability.severity}${urls.length ? ` (${urls.join(", ")})` : ""}`);
}
const lines = ["# PlugV production dependency audit", "", `Run at: ${now.toISOString()}`, "", ...accepted.map((item) => `- TIME-LIMITED REVIEW: ${item}`), ...blockers.map((item) => `- BLOCK: ${item}`), "", accepted.length ? `Exception rationale: ${exception.reason}` : "", "", `Result: ${blockers.length ? "FAILED" : accepted.length ? "READY WITH TIME-LIMITED REVIEW" : "READY"}`];
console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(blockers.length ? 1 : 0);
