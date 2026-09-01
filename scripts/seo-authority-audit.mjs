import fs from "node:fs";
import path from "node:path";

const articlePath = path.join(process.cwd(), "data", "knowledge-articles.ts");
const registryPath = path.join(process.cwd(), "data", "content-refresh-registry.json");
const articleBody = fs.readFileSync(articlePath, "utf8");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const errors = [];

const slugs = [...articleBody.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const keywords = [...articleBody.matchAll(/targetKeyword:\s*"([^"]+)"/g)].map((match) => match[1].trim().toLowerCase());
const updatedDates = [...articleBody.matchAll(/updatedAt:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((match) => match[1]);
const urls = [...articleBody.matchAll(/url:\s*"(https:\/\/[^\"]+)"/g)].map((match) => match[1]);
const registeredPaths = new Set(registry.map((item) => item.path));

if (new Set(slugs).size !== slugs.length) errors.push("Knowledge article slugs must be unique.");
if (new Set(keywords).size !== keywords.length) errors.push("Target keywords must be unique.");
if (keywords.length !== slugs.length) errors.push(`Every knowledge article needs one targetKeyword (${keywords.length}/${slugs.length}).`);

for (const slug of slugs) {
  if (!registeredPaths.has(`/knowledge/${slug}`)) errors.push(`/knowledge/${slug} is missing from the freshness registry.`);
}

const today = new Date();
for (const date of updatedDates) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) errors.push(`Invalid review date: ${date}`);
  if (parsed > today) errors.push(`Review date cannot be in the future: ${date}`);
}

for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") errors.push(`Source must use HTTPS: ${url}`);
}

const requiredPageSignals = ["dateModified", "FAQPage", "BreadcrumbList", "RelatedGuides", "/methodology"];
const pagePath = path.join(process.cwd(), "app", "knowledge", "[slug]", "page.tsx");
const pageBody = fs.readFileSync(pagePath, "utf8");
for (const signal of requiredPageSignals) {
  if (!pageBody.includes(signal)) errors.push(`Knowledge article template is missing ${signal}.`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR  ${error}`));
  console.error(`\nSEO authority audit failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else {
  console.log(`SEO authority READY: ${slugs.length} unique query pages, ${keywords.length} target keywords, ${urls.length} HTTPS evidence links.`);
}
