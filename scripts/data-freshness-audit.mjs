import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const now = new Date();
const blockers = [];
const warnings = [];
const passes = [];
const policies = [
  { file: "data/vehicle-trip-profiles.ts", field: "verifiedAt", warnDays: 60, blockDays: 120 },
  { file: "data/vehicle-charging-facts.ts", field: "verifiedAt", warnDays: 60, blockDays: 120 },
  { file: "data/vehicles-upcoming.ts", field: "verifiedAt", warnDays: 30, blockDays: 60 },
  { file: "data/official-launched-ev-evidence.json", field: "verifiedOn", warnDays: 30, blockDays: 60 },
  { file: "data/charging/bee-official.ts", field: "lastChecked", warnDays: 90, blockDays: null },
  { file: "data/charging/bee-official.ts", field: "lastCheckedAt", warnDays: 90, blockDays: null },
];
const daysOld = (date) => Math.floor((now.getTime() - date.getTime()) / 86_400_000);

for (const policy of policies) {
  const filePath = path.join(root, policy.file);
  if (!fs.existsSync(filePath)) { blockers.push(`${policy.file} is missing`); continue; }
  const body = fs.readFileSync(filePath, "utf8");
  const expression = new RegExp(`[\"']?${policy.field}[\"']?:\\s*[\"'](\\d{4}-\\d{2}-\\d{2})[\"']`, "g");
  const values = [...body.matchAll(expression)].map((match) => match[1]);
  if (!values.length) { blockers.push(`${policy.file} has no ${policy.field} dates`); continue; }
  const ages = values.map((value) => daysOld(new Date(`${value}T00:00:00Z`))).filter(Number.isFinite);
  if (ages.some((age) => age < -1)) blockers.push(`${policy.file} contains future-dated ${policy.field} values`);
  const oldest = Math.max(...ages);
  if (policy.blockDays !== null && oldest > policy.blockDays) {
    blockers.push(`${policy.file} is overdue: oldest ${policy.field} is ${oldest} days old (limit ${policy.blockDays})`);
  } else if (oldest > policy.warnDays) warnings.push(`${policy.file}: oldest ${policy.field} is ${oldest} days old; review is due`);
  else passes.push(`${policy.file}: ${values.length} date(s), oldest ${oldest} days`);
}

const lines = ["# PlugV data freshness audit", "", `Run at: ${now.toISOString()}`, "",
  ...passes.map((item) => `- PASS: ${item}`), ...warnings.map((item) => `- REVIEW: ${item}`),
  ...blockers.map((item) => `- BLOCK: ${item}`), "",
  `Result: ${blockers.length ? "NOT READY" : warnings.length ? "READY WITH REVIEWS" : "READY"}`];
console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(blockers.length ? 1 : 0);
