import type { ReactNode } from "react";
import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";

export default function LegalPage({ eyebrow, title, summary, children }: { eyebrow: string; title: string; summary: string; children: ReactNode }) {
  return <main className="min-h-screen bg-slate-950 text-white">
    <SiteHeader />
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.16),transparent_32%)]">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">{eyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1><p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">{summary}</p></div>
    </section>
    <article className="legal-content mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">{children}</article>
    <SiteFooter />
  </main>;
}
