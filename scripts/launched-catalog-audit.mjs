import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogue = fs.readFileSync(path.join(root, "data", "vehicles-launched.ts"), "utf8");
const evidence = JSON.parse(fs.readFileSync(path.join(root, "data", "official-launched-ev-evidence.json"), "utf8"));
const slugs = [...catalogue.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const blockers = [];
const warnings = [];
const priceReviews = JSON.parse(fs.readFileSync(path.join(root, "data", "vehicle-price-variant-reviews.json"), "utf8"));
const reviewStates = new Set(["supported", "partial", "conflicting", "unavailable"]);
for (const slug of slugs) {
  const records = priceReviews.filter((item) => item.slug === slug);
  if (records.length !== 1) { blockers.push(`${slug}: expected one price/variant review`); continue; }
  const review = records[0];
  if (!reviewStates.has(review.priceStatus) || !reviewStates.has(review.variantStatus) || !review.note || !/^https:\/\//.test(review.sourceUrl)) blockers.push(`${slug}: incomplete price/variant review`);
  const age = (Date.now() - Date.parse(review.reviewedAt)) / 86_400_000;
  if (!Number.isFinite(age) || age < -1) blockers.push(`${slug}: invalid price review date`);
  else if (age > 30) warnings.push(`${slug}: price/variant review older than 30 days`);
}
const unresolved = priceReviews.filter((item) => item.priceStatus !== "supported" || item.variantStatus !== "supported");
if (unresolved.length) warnings.push(`${unresolved.length} price/variant reviews have unresolved evidence; review completion is not factual verification`);

for (const slug of new Set(slugs)) {
  if (slugs.filter((candidate) => candidate === slug).length > 1) blockers.push(`${slug}: duplicate launched slug`);
}

const evidenceSlugs = new Set(evidence.map((vehicle) => vehicle.slug));
for (const slug of new Set(slugs)) {
  if (!evidenceSlugs.has(slug)) blockers.push(`${slug}: missing official launch evidence record`);
}

for (const vehicle of evidence) {
  if (!slugs.includes(vehicle.slug)) blockers.push(`${vehicle.slug}: officially verified launched EV is missing from Explore EVs`);
  if (!/^https:\/\//.test(vehicle.sourceUrl)) blockers.push(`${vehicle.slug}: official source must use HTTPS`);
  const ageDays = Math.floor((Date.now() - Date.parse(`${vehicle.verifiedOn}T00:00:00Z`)) / 86_400_000);
  if (!Number.isFinite(ageDays) || ageDays < -1) blockers.push(`${vehicle.slug}: invalid or future verification date`);
  if (ageDays > 45) warnings.push(`${vehicle.slug}: official evidence is ${ageDays} days old and needs re-verification`);
}

const lines = [
  "# PlugV launched-EV catalogue audit", "", `Run at: ${new Date().toISOString()}`,
  `Explore EVs catalogue: ${slugs.length} vehicles`,
  `Official launch evidence register: ${evidence.length} recently audited vehicles`, "",
  blockers.length ? "- BLOCK: catalogue integrity checks failed" : "- PASS: every registered official launch is present in Explore EVs",
  ...warnings.map((item) => `- REVIEW: ${item}`),
  ...blockers.map((item) => `- BLOCK: ${item}`), "",
  `Result: ${blockers.length ? "NOT READY" : warnings.length ? "READY WITH REVIEWS" : "STRUCTURAL CHECKS PASSED â€” factual source review still required"}`,
];

console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(blockers.length ? 1 : 0);
