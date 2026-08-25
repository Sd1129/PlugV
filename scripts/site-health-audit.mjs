import fs from "node:fs";

const baseUrl = (process.env.PLUGV_BASE_URL || "https://plugv.in").replace(/\/$/, "");
const routes = ["/", "/vehicles", "/compare", "/charging", "/travel", "/upcoming", "/my-ev", "/assistant", "/about", "/founder", "/privacy", "/terms", "/disclaimer", "/methodology", "/robots.txt", "/sitemap.xml"];
const failures = [], warnings = [], passes = [];
const responses = new Map();

async function request(route) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "PlugV-Maintenance-Monitor/1.0" } });
    const body = await response.text();
    responses.set(route, { response, body });
    if (!response.ok) failures.push(`${route} returned HTTP ${response.status}`);
    else passes.push(`${route} returned HTTP ${response.status}`);
  } catch (error) { failures.push(`${route} could not be reached: ${error instanceof Error ? error.message : String(error)}`); }
  finally { clearTimeout(timeout); }
}

await Promise.all(routes.map(request));
const home = responses.get("/");
if (home?.response.ok) {
  const visibleText = home.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  if (!/Everything EV\.\s*One trusted place\./i.test(visibleText)) failures.push("Homepage brand promise is missing");
  if (!/<title[^>]*>[^<]*PlugV/i.test(home.body)) failures.push("Homepage title does not identify PlugV");
  for (const header of ["x-content-type-options", "x-frame-options", "referrer-policy"]) if (!home.response.headers.get(header)) warnings.push(`Homepage is missing the ${header} security header`);
  if (!home.response.headers.get("strict-transport-security")) warnings.push("Homepage is missing HSTS; verify production host configuration");
}
const founder = responses.get("/founder");
if (founder?.response.ok) {
  if (!/support@plugv\.in/i.test(founder.body)) failures.push("Founder page does not expose support@plugv.in");
  if (/founder@plugv\.in/i.test(founder.body)) failures.push("Founder page still exposes founder@plugv.in");
}
const robots = responses.get("/robots.txt");
if (robots?.response.ok && !/sitemap:\s*https:\/\/plugv\.in\/sitemap\.xml/i.test(robots.body)) failures.push("robots.txt does not reference the canonical PlugV sitemap");
const sitemap = responses.get("/sitemap.xml");
if (sitemap?.response.ok) for (const route of ["/vehicles", "/compare", "/charging", "/travel", "/upcoming"]) if (!sitemap.body.includes(`${baseUrl}${route}`)) failures.push(`sitemap.xml is missing ${route}`);

const lines = ["# PlugV live-site audit", "", `Target: ${baseUrl}`, `Run at: ${new Date().toISOString()}`, "", ...passes.map((item) => `- PASS: ${item}`), ...warnings.map((item) => `- REVIEW: ${item}`), ...failures.map((item) => `- BLOCK: ${item}`), "", `Result: ${failures.length ? "FAILED" : warnings.length ? "HEALTHY WITH REVIEWS" : "HEALTHY"}`];
console.log(`\n${lines.join("\n")}`);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
process.exit(failures.length ? 1 : 0);
