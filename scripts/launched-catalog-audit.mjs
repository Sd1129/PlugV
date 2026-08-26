import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogue = fs.readFileSync(path.join(root, "data", "vehicles-launched.ts"), "utf8");
const evidence = JSON.parse(fs.readFileSync(path.join(root, "data", "official-launched-ev-evidence.json"), "utf8"));
const slugs = [...catalogue.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const blockers = [];
const warnings = [];

for (const slug of new Set(slugs)) {
  if (slugs.filter((candidate) => candidate === slug).length > 1) blockers.push(`${slug}: duplicate launched slug`);
}

for (const vehicle of evidence) {
  if (!slugs.includes(vehicle.slug)) blockers.push(`${vehicle.slug}: officially verified launched EV is missing from Explore EVs`);
  if (!/^https:\/\//.test(vehicle.sourceUrl)) blockers.push(`${vehicle.slug}: official source must use HTTPS`);
  const ageDays = Math.floor((Date.now() - Date.parse(`${vehicle.verifiedOn}T00:00:00Z`)) / 86_400_000);
  if (ageDays > 45) warnings.push(`${vehicle.slug}: official evidence is ${ageDays} days old and needs re-verification`);
}

const lines = [
  "# PlugV launched-EV catalogue audit", "", `Run at: ${new Date().toISOString()}`,
  `Explore EVs catalogue: ${slugs.length} vehicles`,
  `Official launch evidence register: ${evidence.length} recently audited vehicles`, "",
  blockers.length ? "- BLOCK: catalogue integrity checks failed" : "- PASS: every registered official launch is present in Explore EVs",
  ...warnings.map((item) => `- REVIEW: ${item}`),
  ...blockers.map((item) => `- BLOCK: ${item}`), "",
  `Result: ${blockers.length ? "NOT READY" : warnings.length ? "READY WITH REVIEWS" : "READY"}`,
];

console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(blockers.length ? 1 : 0);
