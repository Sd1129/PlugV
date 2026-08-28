import type { Metadata } from "next";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "EV Knowledge Hub India — Guides, Calculators & Facts",
  description: "Understand electric cars in India with practical buying guides, charging advice, cost calculators, policy explainers and category comparisons from PlugV.",
  alternates: { canonical: "/knowledge" },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "PlugV EV Knowledge Hub", url: absoluteUrl("/knowledge"), description: "Practical electric-car guides, calculators and ownership explainers for India." };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />{children}</>;
}
