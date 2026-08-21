import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import { upcomingVehicles } from "@/data/vehicles-upcoming";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

type PageProps = { params: { slug: string } | Promise<{ slug: string }> };

export function generateStaticParams() {
  return upcomingVehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = upcomingVehicles.find((item) => item.slug === slug);
  if (!vehicle) return {};
  const title = `${vehicle.brand} ${vehicle.name} India Launch: Official Updates`;
  const description = `Check the verified India launch status, expected timing, range and official manufacturer information for the upcoming ${vehicle.brand} ${vehicle.name} EV.`;
  return {
    title,
    description,
    alternates: { canonical: `/upcoming/${vehicle.slug}` },
    openGraph: {
      type: "article",
      url: `/upcoming/${vehicle.slug}`,
      title: `${title} | PlugV.in`,
      description,
      images: [{ url: "/images/vehicles/plugv-generic-ev-visual.webp", width: 1536, height: 1024 }],
    },
  };
}

export default async function UpcomingVehiclePage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = upcomingVehicles.find((item) => item.slug === slug);
  if (!vehicle) notFound();
  const related = upcomingVehicles.filter((item) => item.slug !== vehicle.slug).slice(0, 3);
  const checkedDate = new Date(`${vehicle.verifiedAt}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const pageUrl = absoluteUrl(`/upcoming/${vehicle.slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Car",
        "@id": `${pageUrl}#vehicle`,
        name: `${vehicle.brand} ${vehicle.name}`,
        brand: { "@type": "Brand", name: vehicle.brand },
        vehicleConfiguration: vehicle.segment,
        description: vehicle.note,
        url: pageUrl,
        image: absoluteUrl("/images/vehicles/plugv-generic-ev-visual.webp"),
        additionalProperty: [
          { "@type": "PropertyValue", name: "India launch status", value: vehicle.status },
          { "@type": "PropertyValue", name: "Launch information", value: vehicle.launch },
          { "@type": "PropertyValue", name: "Range", value: vehicle.range ?? "Not officially announced" },
          { "@type": "PropertyValue", name: "Expected price", value: vehicle.expectedPrice ?? "Not officially announced" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Upcoming EVs", item: absoluteUrl("/upcoming") },
          { "@type": "ListItem", position: 3, name: `${vehicle.brand} ${vehicle.name}`, item: pageUrl },
        ],
      },
    ],
  };

  return <main className="min-h-screen bg-slate-950 text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }} />
    <SiteHeader />
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_82%_72%,rgba(139,92,246,0.14),transparent_30%)]" />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <Link href="/upcoming" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"><ArrowLeft className="h-4 w-4" />All upcoming EVs</Link>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">{vehicle.brand} · India EV launch tracker</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{vehicle.brand} {vehicle.name}: India launch updates</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">{vehicle.note}</p>
          <div className="mt-8 flex flex-wrap gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-100"><BadgeCheck className="h-4 w-4" />{vehicle.status}</span><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"><ShieldCheck className="h-4 w-4 text-sky-300" />Checked {checkedDate}</span></div>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30"><Image src="/images/vehicles/plugv-generic-ev-visual.webp" alt={`Illustrative electric vehicle visual for ${vehicle.brand} ${vehicle.name}`} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" /><span className="absolute right-5 top-5 rounded-full border border-amber-300/20 bg-slate-950/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-100">Illustrative visual</span></div>
      </div>
    </section>

    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="India launch information" value={vehicle.launch} />
        <Fact label="Vehicle category" value={vehicle.segment} />
        <Fact label="Expected price" value={vehicle.expectedPrice ?? "Not officially announced"} />
        <Fact label="Range information" value={vehicle.range ?? "Not officially announced"} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.55fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">What is officially known</p>
          <h2 className="mt-3 text-3xl font-semibold">{vehicle.brand} {vehicle.name} launch status in India</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">{vehicle.note}</p>
          <h2 className="mt-10 text-2xl font-semibold">Key details to watch</h2>
          <div className="mt-5 flex flex-wrap gap-3">{vehicle.features.map((feature) => <span key={feature} className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-300">{feature}</span>)}</div>
          <div className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-5"><p className="font-semibold text-amber-100">What has not been confirmed</p><p className="mt-2 text-sm leading-7 text-slate-300">Final India pricing, variants, booking dates and dealership availability should be treated as unconfirmed unless the manufacturer publishes them. PlugV does not convert rumours into launch facts.</p></div>
        </article>
        <aside className="h-fit rounded-[2rem] border border-emerald-300/15 bg-emerald-400/[0.06] p-6">
          <Sparkles className="h-5 w-5 text-emerald-300" /><h2 className="mt-4 text-xl font-semibold">Official manufacturer source</h2><p className="mt-3 text-sm leading-7 text-slate-300">PlugV last checked this record on {checkedDate}. Read the manufacturer material before making a booking or purchase decision.</p><a href={vehicle.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-200">{vehicle.sourceName}<ExternalLink className="h-4 w-4" /></a>
        </aside>
      </div>

      <section className="mt-16"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Continue researching</p><h2 className="mt-3 text-3xl font-semibold">Other upcoming EVs in India</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.slug} href={`/upcoming/${item.slug}`} className="group rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 hover:border-sky-300/25 hover:bg-white/[0.06]"><p className="text-xs font-semibold uppercase tracking-wider text-sky-300">{item.brand}</p><h3 className="mt-2 text-xl font-semibold">{item.name}</h3><p className="mt-2 text-sm text-slate-400">{item.launch}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">View verified profile<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div></section>
    </section>
    <SiteFooter />
  </main>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"><CalendarDays className="h-3.5 w-3.5 text-sky-300" />{label}</p><p className="mt-3 text-base font-semibold leading-6 text-white">{value}</p></div>;
}
