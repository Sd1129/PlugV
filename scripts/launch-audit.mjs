import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const passes = [];

const launched = [...read("data/vehicles-launched.ts").matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const profiles = [...read("data/vehicle-trip-profiles.ts").matchAll(/^  "([^"]+)":/gm)].map((match) => match[1]);
const factsText = read("data/vehicle-charging-facts.ts");
const facts = [...factsText.matchAll(/^  "([^"]+)":/gm)].map((match) => match[1]);
const covered = new Set([...profiles, ...facts]);
const missing = launched.filter((slug) => !covered.has(slug));

if (missing.length) failures.push(`Charging provenance missing for: ${missing.join(", ")}`);
else passes.push(`Charging provenance covers all ${launched.length} launched vehicles`);

const partialCount = (factsText.match(/confidence:\s*"partial"/g) ?? []).length;
if (partialCount) failures.push(`${partialCount} charging records are still marked partial`);
else passes.push("No partial charging records");

const sourceFiles = ["data/vehicle-trip-profiles.ts", "data/vehicle-charging-facts.ts", "data/vehicles-upcoming.ts"];
for (const file of sourceFiles) {
  const body = read(file);
  if (/sourceUrl:\s*"http:\/\//.test(body)) failures.push(`${file} contains a non-HTTPS source URL`);
}
passes.push("Structured source URLs use HTTPS");

const assetRegister = read("docs/Asset-Rights-Register.md");
if (!/Quarantined assets — prohibited from publication/i.test(assetRegister)) failures.push("Asset quarantine policy is missing");
const publicSurfaceFiles = [
  "app/charging/page.tsx", "app/compare/page.tsx", "app/travel/page.tsx",
  "components/charging/ChargingHero.tsx", "components/home/Hero.tsx",
  "components/home/HeroBackground.tsx", "components/home/HeroVisual.tsx",
];
const publicSurfaceText = publicSurfaceFiles.map(read).join("\n");
if (/\/images\/(?:hero|cities|travel)\//.test(publicSurfaceText)) failures.push("A public page still references a quarantined asset path");
else passes.push("Public imagery is documented and quarantined paths are not referenced");

for (const legalFile of ["app/privacy/page.tsx", "app/terms/page.tsx", "app/disclaimer/page.tsx"]) {
  if (!/Effective(?: date)?|Last updated/i.test(read(legalFile))) failures.push(`${legalFile} lacks an effective or last-updated date`);
}

if (!fs.existsSync(path.join(root, "proxy.ts"))) failures.push("Admin protection proxy.ts is missing");
else passes.push("Admin route proxy is present");

const claimFiles = ["app/layout.tsx", "app/manifest.ts", "components/home/FinalCTASection.tsx"];
for (const file of claimFiles) {
  if (/official EV platform|government-approved|guaranteed accurate/i.test(read(file))) {
    failures.push(`${file} contains a prohibited endorsement or guarantee claim`);
  }
}
passes.push("No prohibited official/guarantee claims found in core marketing surfaces");

console.log("\nPlugV India Launch Audit");
for (const item of passes) console.log(`PASS  ${item}`);
for (const item of failures) console.error(`BLOCK ${item}`);
console.log(`\nResult: ${failures.length ? "NOT READY" : "READY"} (${failures.length} blocker${failures.length === 1 ? "" : "s"})`);
process.exit(failures.length ? 1 : 0);
