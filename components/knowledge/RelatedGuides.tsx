import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { knowledgeArticles, type KnowledgeArticle } from "@/data/knowledge-articles";

export default function RelatedGuides({ article }: { article: KnowledgeArticle }) {
  const related = knowledgeArticles
    .filter((candidate) => candidate.slug !== article.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === article.category) + Number(Boolean(a.vehicleList) === Boolean(article.vehicleList));
      const bScore = Number(b.category === article.category) + Number(Boolean(b.vehicleList) === Boolean(article.vehicleList));
      return bScore - aScore;
    })
    .slice(0, 3);

  return (
    <section aria-labelledby="related-guides-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Continue researching</p>
      <h2 id="related-guides-heading" className="mt-2 text-3xl font-semibold">Related EV guides</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {related.map((guide) => (
          <Link
            key={guide.slug}
            href={`/knowledge/${guide.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-sky-300/25 hover:bg-white/[0.06]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{guide.category}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{guide.shortTitle}</h3>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
              Read guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
