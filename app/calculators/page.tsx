import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import DecisionCalculators from "@/components/calculators/DecisionCalculators";

export const metadata: Metadata = {
  title: "EV Calculators India — EMI, Running Cost, Range & Battery Capacity",
  description: "Transparent EV planning calculators using your own values, with visible formulas and no predicted subsidies, battery diagnosis or resale promises.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsPage() {
  return <main className="min-h-screen bg-slate-950 text-white">
    <SiteHeader />
    <header className="border-b border-white/10 bg-[#061322]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200"><ShieldCheck className="h-4 w-4" />Transparent calculations</div>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">EV decisions using values you can verify.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">PlugV calculates from the figures you enter. It does not invent subsidies, diagnose a battery, or promise a future resale price.</p>
        <Link href="/knowledge/ev-subsidies-incentives-by-state-india" className="mt-7 inline-flex min-h-12 items-center rounded-full border border-white/15 px-5 text-sm font-semibold hover:bg-white/5">Verify state incentives at official sources</Link>
      </div>
    </header>
    <DecisionCalculators />
    <SiteFooter />
  </main>;
}
