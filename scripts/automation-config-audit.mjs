import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const passes = [];
const requiredFiles = [
  "app/api/cron/daily-operations/route.ts",
  "app/api/cron/email-reminders/route.ts",
  "data/catalogue-candidates.json",
  "data/official-manufacturer-monitor.json",
  "scripts/official-ev-discovery-monitor.mjs",
  ".github/workflows/plugv-daily-health.yml",
];

for (const file of requiredFiles) {
  if (fs.existsSync(path.join(root, file))) passes.push(`${file} is present`);
  else failures.push(`${file} is missing`);
}

const vercel = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const crons = Array.isArray(vercel.crons) ? vercel.crons : [];
if (crons.length <= 2) passes.push(`Vercel Hobby cron limit respected (${crons.length}/2)`);
else failures.push(`Vercel cron count is ${crons.length}; Hobby permits at most 2`);

for (const expected of ["/api/cron/daily-operations", "/api/cron/email-reminders"]) {
  if (crons.some((cron) => cron.path === expected)) passes.push(`${expected} is scheduled`);
  else failures.push(`${expected} is not scheduled`);
}

const operationsRoute = fs.readFileSync(path.join(root, "app/api/cron/daily-operations/route.ts"), "utf8");
for (const control of ["CRON_SECRET", "runDailyOperations", "OPERATIONS_ALERT_EMAILS", "sendMail"]) {
  if (operationsRoute.includes(control)) passes.push(`Daily operations includes ${control}`);
  else failures.push(`Daily operations is missing ${control}`);
}

const workflow = fs.readFileSync(path.join(root, ".github/workflows/plugv-daily-health.yml"), "utf8");
for (const control of ["DISCOVERY_OUTPUT", "catalogue-candidates.json", "pull-requests: write"]) {
  if (workflow.includes(control)) passes.push(`Official discovery workflow includes ${control}`);
  else failures.push(`Official discovery workflow is missing ${control}`);
}

console.log("\n# PlugV automation configuration audit\n");
for (const item of passes) console.log(`PASS  ${item}`);
for (const item of failures) console.error(`FAIL  ${item}`);
console.log(`\nResult: ${failures.length ? "FAIL" : "READY"} (${failures.length} failure(s))`);
if (failures.length) process.exit(1);
