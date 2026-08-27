import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BatteryCharging, Calculator, Clock3, ExternalLink, ShieldCheck } from "lucide-react";
import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";

export const metadata: Metadata = {
  title: "Data Methodology and Verification",
  description: "Learn how PlugV sources, labels, verifies and updates electric vehicle, charging and trip-planning information for India.",
  alternates: { canonical: "/methodology" },
};

const standards = [
  { icon: BadgeCheck, title: "Company sources first", copy: "Vehicle specifications, prices and launch statements should come from manufacturer websites, brochures, press releases or regulatory disclosures." },
  { icon: BatteryCharging, title: "Claimed is not real-world", copy: "Certified or manufacturer-claimed range is labelled clearly. Practical range and trip calculations are estimates affected by speed, weather, load and driving style." },
  { icon: Clock3, title: "Freshness is visible", copy: "Where available, PlugV displays the source and last verification date. Older information is reviewed before it is treated as current." },
  { icon: Calculator, title: "Estimates explain assumptions", copy: "Ownership costs, charging stops and journey times are planning aids—not quotations, guarantees or substitutes for operator and manufacturer checks." },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.16),transparent_32%),radial-gradient(circle_at_80%_60%,rgba(56,189,248,0.13),transparent_30%)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"><ShieldCheck className="h-4 w-4" />PlugV Trust Standard</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">Clear sources. Honest labels. Better EV decisions.</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">PlugV separates official facts from calculations and unknowns. Our goal is to help Indian EV buyers plan confidently without disguising estimates as certainty.</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {standards.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Icon className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{copy}</p></article>)}
        </div>

        <div className="mt-12 rounded-[2rem] border border-sky-300/15 bg-sky-400/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Source hierarchy</h2>
          <ol className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
            <li><strong className="text-white">1. Primary:</strong> manufacturer, government, regulator or charging-network operator.</li>
            <li><strong className="text-white">2. Calculated:</strong> PlugV planning estimates derived from clearly stated inputs.</li>
            <li><strong className="text-white">3. Unknown:</strong> unavailable information is shown as unknown or not verified—not guessed.</li>
          </ol>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 p-6"><h2 className="text-xl font-semibold">Charging availability</h2><p className="mt-3 text-sm leading-7 text-slate-400">A station being listed does not guarantee that it is operating or free. “Live” availability should appear only when supplied by an operator feed. Always confirm in the operator app before travelling.</p></div>
          <div className="rounded-[2rem] border border-white/10 p-6"><h2 className="text-xl font-semibold">Prices and launches</h2><p className="mt-3 text-sm leading-7 text-slate-400">Prices are generally ex-showroom and can vary by city, variant and offer. Launch targets can change; concepts are never presented as confirmed production vehicles.</p></div>
        </div>

        <div className="mt-12 flex flex-col gap-5 rounded-[2rem] border border-amber-300/15 bg-amber-400/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><h2 className="text-xl font-semibold">Found something that needs correction?</h2><p className="mt-2 text-sm leading-6 text-slate-400">Include the page URL, the incorrect detail and an official supporting source.</p></div><a href="mailto:support@plugv.in?subject=PlugV%20data%20correction" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950">Report a data issue <ExternalLink className="h-4 w-4" /></a></div>
        <div className="mt-8 text-center"><Link href="/vehicles" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300">Explore verified EV information <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
      <SiteFooter />
    </main>
  );
}
