import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, CheckCircle2 } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { knowledgeArticles, type KnowledgeArticle } from "@/data/knowledge-articles";

const categoryOrder: KnowledgeArticle["category"][] = ["Buying", "Costs", "Charging", "Ownership", "Policy", "Rankings"];

const categoryDescriptions: Record<KnowledgeArticle["category"], string> = {
  Buying: "Choose the right vehicle, variant and ownership model for your actual needs.",
  Costs: "Use transparent assumptions to understand charging, running and ownership costs.",
  Charging: "Plan safe home and public charging without treating directory data as guaranteed live status.",
  Ownership: "Understand practical range, maintenance and everyday EV ownership.",
  Policy: "Check time-sensitive schemes and incentives against the governing official source.",
  Rankings: "Discover launched EVs through live catalogue filters—not paid placements.",
};

function formatDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

export default function KnowledgeHubPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.2),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(16,185,129,0.12),transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              <BookOpen className="h-4 w-4" />PlugV Knowledge Hub
            </div>
            <h1 className="mt-7 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
              Understand EVs.<span className="block text-sky-300">Make a better decision.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              India-focused guides and transparent tools, organised by decision—not by city. Every guide shows when it was reviewed, and time-sensitive claims link to an official source.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Source-labelled</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Daily freshness audit</span>
              <span className="inline-flex items-center gap-2"><Calculator className="h-4 w-4 text-sky-300" />Interactive tools</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {categoryOrder.map((category) => {
          const articles = knowledgeArticles.filter((article) => article.category === category);
          if (!articles.length) return null;

          return (
            <section key={category} aria-labelledby={`knowledge-${category.toLowerCase()}`}>
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">{category}</p>
                <h2 id={`knowledge-${category.toLowerCase()}`} className="mt-2 text-3xl font-semibold tracking-tight text-white">{category} guides</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{categoryDescriptions[category]}</p>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                  <Link key={article.slug} href={`/knowledge/${article.slug}`} className="group flex flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-sky-300/25 hover:bg-white/[0.06]">
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>{article.readTime}</span>
                      <time dateTime={article.updatedAt}>Reviewed {formatDate(article.updatedAt)}</time>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">{article.shortTitle}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">{article.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                      Read guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <SiteFooter />
    </main>
  );
}
