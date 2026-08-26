import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(root, "data", "official-manufacturer-monitor.json"), "utf8"));
const evidenceFiles = [
  "data/official-launched-ev-evidence.json",
  "data/vehicles-launched.ts",
  "data/vehicles-upcoming.ts",
  "data/vehicle-trip-profiles.ts",
  "data/vehicle-charging-facts.ts",
];
const knownUrls = new Set();
const knownModelTokens = new Set();
for (const file of evidenceFiles) {
  const body = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of body.matchAll(/https:\/\/[^"'\s)]+/g)) knownUrls.add(normalize(match[0]));
  for (const match of body.matchAll(/slug:\s*["']([^"']+)["']/g)) {
    const parts = match[1].split("-");
    knownModelTokens.add(parts.slice(1).join("").replace(/[^a-z0-9]/g, ""));
  }
}
for (const item of JSON.parse(fs.readFileSync(path.join(root, "data", "official-launched-ev-evidence.json"), "utf8"))) {
  knownModelTokens.add(item.model.toLowerCase().replace(/[^a-z0-9]/g, ""));
}

const evTerms = /(?:^|[-_/])(electric|ev|bev|e-tron|etron|ioniq|eqs|eqa|eqb|eqe|ix\d?|i\d|taycan|macan-electric|spectre|elettre|emeya|aceman)(?:[-_/]|$)/i;
const ignored = /(?:privacy|terms|cookie|dealer|service|accessor|finance|contact|career|manual|charging|charger|sitemap|login|test-drive|book-now|brochure|request|callback|call-back|enquiry|t-c|route-planner|mega-charger|dark|configurator|ev-edge|\.css$|\.js$|\.png$|\.jpg$|\.svg$|\.webp$)/i;
const findings = [];
const warnings = [];
const passes = [];

function normalize(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch { return value.toLowerCase().replace(/\/$/, ""); }
}

async function inspect(entry) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(entry.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "PlugV-Official-EV-Discovery/1.0 (+https://plugv.in)" },
    });
    if (!response.ok && ![401, 403, 429].includes(response.status)) {
      warnings.push(`${entry.brand}: official catalogue returned HTTP ${response.status}`);
      return;
    }
    if (!response.ok) {
      warnings.push(`${entry.brand}: official catalogue is protected (HTTP ${response.status})`);
      return;
    }
    const html = await response.text();
    const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
    let candidates = 0;
    for (const href of links) {
      let url;
      try { url = new URL(href, response.url); } catch { continue; }
      const host = url.hostname.replace(/^www\./, "");
      if (!entry.domains.some((domain) => host === domain || host.endsWith(`.${domain}`))) continue;
      const normalized = normalize(url.toString());
      if (normalized === normalize(entry.url)) continue;
      const flatPath = url.pathname.toLowerCase().replace(/[^a-z0-9]/g, "");
      const knownModel = [...knownModelTokens].some((token) => token.length >= 4 && flatPath.includes(token));
      if (!evTerms.test(url.pathname) || ignored.test(url.pathname) || knownUrls.has(normalized) || knownModel) continue;
      if (!findings.some((item) => item.url === normalized)) {
        findings.push({ brand: entry.brand, url: normalized });
        candidates += 1;
      }
    }
    passes.push(`${entry.brand}: checked${candidates ? `; ${candidates} unregistered EV link(s)` : ""}`);
  } catch (error) {
    warnings.push(`${entry.brand}: catalogue could not be inspected (${error instanceof Error ? error.message : String(error)})`);
  } finally { clearTimeout(timer); }
}

for (let index = 0; index < registry.length; index += 5) {
  await Promise.all(registry.slice(index, index + 5).map(inspect));
}

const lines = [
  "# PlugV official EV discovery monitor", "", `Run at: ${new Date().toISOString()}`,
  `Official manufacturer catalogues: ${registry.length}`,
  `Potential unregistered EV links: ${findings.length}`, "",
  ...findings.map((item) => `- REVIEW: ${item.brand} — ${item.url}`),
  ...warnings.map((item) => `- SOURCE WARNING: ${item}`), "",
  findings.length
    ? "Result: REVIEW REQUIRED — verify launch status and specifications before publishing"
    : "Result: NO NEW OFFICIAL EV LINKS DETECTED",
];
console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
if (process.env.DISCOVERY_STRICT === "1" && findings.length) process.exit(2);
