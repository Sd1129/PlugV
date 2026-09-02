import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const upcomingBody = fs.readFileSync(path.join(root, "data", "vehicles-upcoming.ts"), "utf8");
const launchedBody = fs.readFileSync(path.join(root, "data", "vehicles-launched.ts"), "utf8");
const evidence = JSON.parse(
  fs.readFileSync(path.join(root, "data", "official-launched-ev-evidence.json"), "utf8"),
);
const candidates = JSON.parse(
  fs.readFileSync(path.join(root, "data", "catalogue-candidates.json"), "utf8"),
);

const today = new Date();
const currentYear = today.getUTCFullYear();
const launchedSlugs = new Set(
  [...launchedBody.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]),
);
const evidenceSlugs = new Set(evidence.map((item) => item.slug));
const blocks = upcomingBody.split(/\n\s*\{\s*\n/).slice(1);
const blockers = [];
const reviews = [];
const passes = [];

for (const block of blocks) {
  const slug = block.match(/slug:\s*["']([^"']+)["']/)?.[1];
  if (!slug) continue;
  const name = block.match(/name:\s*["']([^"']+)["']/)?.[1] ?? slug;
  const launch = block.match(/launch:\s*["']([^"']+)["']/)?.[1] ?? "";
  const yearText = block.match(/launchYear:\s*(\d{4}|["']Timing not announced["'])/)?.[1];
  const launchYear = /^\d{4}$/.test(yearText ?? "") ? Number(yearText) : null;

  if (launchedSlugs.has(slug)) {
    blockers.push(`${slug}: exists in both launched and upcoming source catalogues`);
  }
  if (evidenceSlugs.has(slug) && !launchedSlugs.has(slug)) {
    blockers.push(`${slug}: has official launch evidence but is missing from Explore EVs`);
  }
  if (launchYear !== null && launchYear < currentYear) {
    reviews.push(`${name}: target year ${launchYear} has passed; verify launch, delay, cancellation or replacement`);
  } else if (launchYear === currentYear) {
    reviews.push(`${name}: ${launch || `targeted for ${currentYear}`}; re-check the official source during every daily review`);
  }
}

const pending = candidates.filter((item) => item.status === "REVIEW_REQUIRED");
if (pending.length) {
  reviews.push(`${pending.length} official-site discovery candidate(s) are waiting for human verification`);
} else {
  passes.push("No official-site discovery candidates are waiting for review");
}
if (!blockers.length) passes.push("No model has crossed the verified launch gate without appearing in Explore EVs");

const lines = [
  "# PlugV catalogue transition audit",
  "",
  `Run at: ${today.toISOString()}`,
  `Current launch-monitoring year: ${currentYear}`,
  "",
  ...passes.map((item) => `- PASS: ${item}`),
  ...reviews.map((item) => `- REVIEW: ${item}`),
  ...blockers.map((item) => `- BLOCK: ${item}`),
  "",
  `Result: ${blockers.length ? "NOT READY" : reviews.length ? "READY WITH REVIEWS" : "READY"}`,
];

console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
}
if (blockers.length) process.exit(1);
