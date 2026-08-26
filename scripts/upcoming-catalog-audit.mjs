import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "vehicles-upcoming.ts");
const body = fs.readFileSync(file, "utf8");
const launchedBody = fs.readFileSync(path.join(process.cwd(), "data", "vehicles-launched.ts"), "utf8");
const currentYear = new Date().getUTCFullYear();
const nextYear = currentYear + 1;
const blocks = body.split(/\n\s*\{\s*\n/).slice(1);
const blockers = [];
const warnings = [];
const passes = [];
const slugs = new Set();
const launchedSlugs = new Set([...launchedBody.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]));
const transitioned = [];
const officialHosts = [
  "hyundai.com", "kia.com", "mgmotor.co.in", "volvocars.com", "vinfastauto.in",
  "hondacarindia.com", "tatamotors.com", "mahindra.com", "mahindraelectricsuv.com",
  "toyota.com", "global.toyota", "toyotabharat.com", "marutisuzuki.com",
];

for (const block of blocks) {
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
  if (!slug) continue;
  const source = block.match(/sourceUrl:\s*"([^"]+)"/)?.[1];
  const status = block.match(/status:\s*"([^"]+)"/)?.[1];
  const yearText = block.match(/launchYear:\s*(\d{4}|"Timing not announced")/)?.[1];
  const year = /^\d{4}$/.test(yearText ?? "") ? Number(yearText) : yearText === '"Timing not announced"' ? "Timing not announced" : null;

  if (slugs.has(slug)) blockers.push(`${slug}: duplicate slug`);
  slugs.add(slug);
  if (launchedSlugs.has(slug)) transitioned.push(slug);
  if (!source) blockers.push(`${slug}: missing official source URL`);
  else {
    const host = new URL(source).hostname.replace(/^www\./, "");
    if (!officialHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) blockers.push(`${slug}: source is not on the approved manufacturer domain list (${host})`);
  }
  if (!["Official announcement", "Manufacturer target", "Official concept"].includes(status ?? "")) blockers.push(`${slug}: invalid evidence status`);
  if (typeof year === "number" && year !== currentYear && year !== nextYear) blockers.push(`${slug}: launch year ${year} is outside the active ${currentYear}–${nextYear} window`);
  if (year === null) blockers.push(`${slug}: missing launchYear`);
}

if (!slugs.size) blockers.push("Upcoming catalogue is empty");
else passes.push(`${slugs.size} upcoming entries have structured launch evidence`);
passes.push(`Active launch window is calculated automatically as ${currentYear}–${nextYear}`);
if (transitioned.length) passes.push(`${transitioned.length} launched model(s) are automatically excluded from Upcoming: ${transitioned.join(", ")}`);
else passes.push("No vehicle is simultaneously visible in Explore EVs and Upcoming");

const lines = [
  "# PlugV upcoming-EV catalogue audit", "", `Run at: ${new Date().toISOString()}`,
  `Active years: ${currentYear} and ${nextYear}`, "",
  ...passes.map((item) => `- PASS: ${item}`),
  ...warnings.map((item) => `- REVIEW: ${item}`),
  ...blockers.map((item) => `- BLOCK: ${item}`), "",
  `Result: ${blockers.length ? "NOT READY" : warnings.length ? "READY WITH REVIEWS" : "READY"}`,
];

console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(blockers.length ? 1 : 0);
