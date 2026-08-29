import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, ShieldCheck } from "lucide-react";
import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import { vehicles } from "@/data/vehicles";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best EV Cars Under ₹25 Lakh in India (2026)",
  description:
    "Compare the best electric cars under ₹25 lakh in India by price, claimed range, charging information and body type. Updated PlugV buyer shortlist.",
  keywords: [
    "best EV cars under 25 lakhs",
    "electric cars under 25 lakh India",
    "best electric SUV under 25 lakh",
    "EV cars price India",
  ],
  alternates: { canonical: "/best-ev-cars-under-25-lakh" },
  openGraph: {
    title: "Best EV Cars Under ₹25 Lakh in India",
    description: "A clear, comparison-ready PlugV shortlist for Indian EV buyers.",
    url: "/best-ev-cars-under-25-lakh",
    images: ["/images/hero/plugv-compare-hero.webp"],
  },
};

function startingPriceLakh(price?: string) {
  if (!price) return Number.POSITIVE_INFINITY;
  const amount = Number(price.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0]);
  if (!Number.isFinite(amount)) return Number.POSITIVE_INFINITY;
  return /\bCr\b/i.test(price) ? amount * 100 : amount;
}

function maximumRange(range?: string) {
  const values = range?.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return values.length ? Math.max(...values) : 0;
}

const shortlist = vehicles
  .filter((vehicle) => startingPriceLakh(vehicle.price) <= 25)
  .sort((a, b) => maximumRange(b.range) - maximumRange(a.range));

const faqs = [
  {
    question: "Which EV cars are available under ₹25 lakh in India?",
    answer:
      "PlugV tracks models whose listed starting ex-showroom price is ₹25 lakh or less. Final on-road prices vary by city, variant, insurance and current offers.",
  },
  {
    question: "Should I choose an EV only by claimed range?",
    answer:
      "No. Compare practical range, charging speed, connector compatibility, service access, cabin needs and your regular routes before deciding.",
  },
  {
    question: "Are EV prices the same across India?",
    answer:
      "No. Ex-showroom and on-road prices can vary with the selected variant, state taxes, registration, insurance, subsidies and dealer offers.",
  },
];

export default function BestEvsUnder25LakhPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best EV cars under ₹25 lakh in India",
    numberOfItems: shortlist.length,
    itemListElement: shortlist.map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/vehicles/${vehicle.slug}`),
      name: `${vehicle.brand} ${vehicle.name}`,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <SiteHeader />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_40%)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-semibold text-sky-200">
            <BadgeIndianRupee className="h-4 w-4" /> India EV buying guide
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Last updated 29 August 2026 · Monthly catalogue review</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Best EV cars under ₹25 lakh in India
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Compare {shortlist.length} electric cars with a listed starting price at or below ₹25 lakh. Review price, claimed range, charging context and body type before creating your shortlist.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/compare" className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold text-slate-950">
              Compare two EVs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/charging" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white">
              Check charging stations
            </Link>
          </div>
          <div className="mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-sm leading-6 text-amber-50/80">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
            Prices are indicative ex-showroom listings. Confirm the variant, on-road price, eligibility and current offer with the manufacturer or an authorised dealer.
          </div>
        </div>
      </section>

      <VehicleGrid vehicles={shortlist} />

      <section className="border-t border-white/10 bg-white/[0.02] py-16">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <summary className="cursor-pointer text-base font-semibold text-white">{faq.question}</summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
