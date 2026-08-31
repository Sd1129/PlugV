import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Mail, ShieldCheck, Sparkles } from "lucide-react";
import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import { absoluteUrl, safeJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Founder — Syed Manjoor Ahmed",
  description: "Meet Syed Manjoor Ahmed, Founder of PlugV, and learn why he is building a trusted EV discovery and ownership platform for India.",
  alternates: { canonical: "/founder" },
};

const principles = [
  { icon: ShieldCheck, title: "Accuracy before attention", copy: "PlugV should earn trust through clear sources, honest labels and useful information—not unsupported claims." },
  { icon: Compass, title: "Built around real journeys", copy: "From choosing a vehicle to charging and travelling, every feature should solve an everyday EV problem." },
  { icon: Sparkles, title: "Premium without confusion", copy: "The experience should feel modern and refined while remaining comfortable for customers across India." },
];

export default function FounderPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/founder#person`,
    name: "Syed Manjoor Ahmed",
    jobTitle: "Founder",
    url: absoluteUrl("/founder"),
    email: "mailto:support@plugv.in",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    sameAs: [
      "https://www.instagram.com/plugvplatform/",
      "https://www.youtube.com/channel/UC0YJUyVpgbX5eClR-UBp_oQ",
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }} />
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.19),transparent_31%),radial-gradient(circle_at_82%_70%,rgba(16,185,129,0.13),transparent_30%)]" />
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200"><Sparkles className="h-4 w-4" />A note from the founder</div>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Syed Manjoor Ahmed · Founder — PlugV</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Building a clearer EV journey for India.</h1>
            <div className="mt-7 space-y-5 text-base leading-8 text-slate-300">
              <p>PlugV began with a simple observation: choosing and owning an electric vehicle in India still involves searching across too many disconnected sources.</p>
              <p>I created PlugV to bring EV discovery, comparison, charging, travel planning and ownership support together in one clear and trustworthy platform. My goal is to reduce confusion and range anxiety while helping every Indian customer make a more confident EV decision.</p>
              <p>PlugV is being built around accuracy, transparency and practical everyday value—not paid rankings or unsupported claims. As India&apos;s electric mobility ecosystem grows, PlugV will continue evolving with the needs of buyers and owners.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:support@plugv.in?subject=Message%20for%20the%20PlugV%20Founder" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 hover:border-sky-300/25 hover:text-white"><Mail className="h-4 w-4 text-sky-300" /><span>support@plugv.in</span></a>
              <a href="https://www.instagram.com/plugvplatform/" target="_blank" rel="noopener noreferrer" aria-label="Follow PlugV on Instagram at @plugvplatform" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 hover:border-pink-300/30 hover:text-white"><svg viewBox="0 0 24 24" className="h-4 w-4 text-pink-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span>@plugvplatform</span></a>
              <a href="https://www.youtube.com/channel/UC0YJUyVpgbX5eClR-UBp_oQ" target="_blank" rel="noopener noreferrer" aria-label="Watch PlugV on YouTube" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 hover:border-red-300/30 hover:text-white"><svg viewBox="0 0 24 24" className="h-4 w-4 text-red-400" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg><span>YouTube</span></a>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950">About PlugV <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Founder-related messages are received through the official PlugV support mailbox.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Founder principles</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">How PlugV earns confidence.</h2></div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{principles.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{copy}</p></article>)}</div>
      </section>
      <SiteFooter />
    </main>
  );
}
