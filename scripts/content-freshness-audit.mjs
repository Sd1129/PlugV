import fs from "node:fs";
import path from "node:path";

const registryPath = path.join(process.cwd(), "data", "content-refresh-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const knowledgePath = path.join(process.cwd(), "data", "knowledge-articles.ts");
const knowledgeBody = fs.readFileSync(knowledgePath, "utf8");
const now = new Date();
const stale = [];
const errors = [];

const knowledgeEntries = [...knowledgeBody.matchAll(/slug:\s*"([^"]+)"[\s\S]*?updatedAt:\s*"(\d{4}-\d{2}-\d{2})"/g)]
  .map((match) => ({ slug: match[1], updatedAt: match[2] }));
const knowledgeRegistry = new Map(
  registry
    .filter((item) => item.path.startsWith("/knowledge/"))
    .map((item) => [item.path.slice("/knowledge/".length), item]),
);

for (const article of knowledgeEntries) {
  const tracked = knowledgeRegistry.get(article.slug);
  if (!tracked) errors.push(`/knowledge/${article.slug} is not registered for freshness review`);
  else if (tracked.lastReviewed !== article.updatedAt) {
    errors.push(`/knowledge/${article.slug} displays ${article.updatedAt} but registry review is ${tracked.lastReviewed}`);
  }
}

for (const slug of knowledgeRegistry.keys()) {
  if (!knowledgeEntries.some((article) => article.slug === slug)) {
    errors.push(`/knowledge/${slug} is registered but no longer exists`);
  }
}

for (const item of registry) {
  const reviewed = new Date(`${item.lastReviewed}T00:00:00Z`);
  const ageDays = Math.floor((now.getTime() - reviewed.getTime()) / 86_400_000);
  const status = ageDays > item.cadenceDays ? "STALE" : ageDays + 7 > item.cadenceDays ? "DUE SOON" : "OK";
  console.log(`${status.padEnd(8)} ${item.path} — ${ageDays}/${item.cadenceDays} days — ${item.keyword}`);
  if (status === "STALE") stale.push(item.path);
}

if (stale.length || errors.length) {
  for (const error of errors) console.error(`ERROR    ${error}`);
  console.error(`\nContent freshness failed: ${stale.length} stale page(s), ${errors.length} registry error(s).`);
  process.exitCode = 1;
} else {
  console.log(`\nContent freshness READY: ${registry.length} tracked search pages; ${knowledgeEntries.length} Knowledge Hub articles covered.`);
}
