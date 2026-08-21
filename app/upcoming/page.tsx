"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowUpRight, BadgeCheck, CalendarDays, Filter, Search, ShieldCheck, Sparkles } from "lucide-react";

import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import { upcomingVehicles, type UpcomingVehicle } from "@/data/vehicles-upcoming";

const statuses = ["All statuses", "Manufacturer target", "Official concept"] as const;

function accentFor(seed: string) {
  const accents = [
    "from-sky-400/25 via-cyan-400/10 to-transparent",
    "from-fuchsia-400/25 via-rose-400/10 to-transparent",
    "from-emerald-400/25 via-teal-400/10 to-transparent",
  ];
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  return accents[hash % accents.length];
}

function StatusBadge({ status }: { status: UpcomingVehicle["status"] }) {
  const style = status === "Manufacturer target" ? "border-emerald-300/25 bg-emerald-400/15 text-emerald-100" : "border-violet-300/25 bg-violet-400/15 text-violet-100";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${style}`}><BadgeCheck className="h-3.5 w-3.5" />{status}</span>;
}

export default function UpcomingEVsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All statuses");

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return upcomingVehicles.filter((vehicle) => {
      const matchesQuery = [vehicle.brand, vehicle.name, vehicle.segment, vehicle.launch, vehicle.note, ...vehicle.features].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "All statuses" || vehicle.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const manufacturerTargets = upcomingVehicles.filter((vehicle) => vehicle.status === "Manufacturer target").length;
  const officialConcepts = upcomingVehicles.filter((vehicle) => vehicle.status === "Official concept").length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_82%_70%,rgba(139,92,246,0.15),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-100"><Sparkles className="h-3.5 w-3.5" />PlugV launch tracker</div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">Upcoming electric cars in India.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Track upcoming EV cars expected for India in 2026–2027, using manufacturer targets and official concepts—without presenting speculation as a confirmed launch.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/vehicles" className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">Explore EVs available now</Link>
              <Link href="/compare" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10">Compare launched EVs</Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 backdrop-blur sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">How to read this page</p>
            <div className="mt-6 space-y-4">
              <TrustRow title="Manufacturer target" copy="The manufacturer has stated a market timing target. It can still change." tone="emerald" />
              <TrustRow title="Official concept" copy="The vehicle has been revealed, but production or an India launch is not confirmed." tone="violet" />
              <TrustRow title="No unsupported rumours" copy="Unverified launch dates and invented prices are intentionally excluded." tone="slate" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              <HeroMetric label="Tracked" value={`${upcomingVehicles.length}`} />
              <HeroMetric label="Targets" value={`${manufacturerTargets}`} />
              <HeroMetric label="Concepts" value={`${officialConcepts}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.02] py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/20 sm:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_0.45fr_auto]">
              <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4"><Search className="h-4 w-4 text-sky-300" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search model, brand, segment, or feature" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" /></label>
              <label className="relative"><Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><select value={status} onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])} className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 pl-10 pr-4 text-sm font-semibold outline-none">{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
              <button type="button" onClick={() => { setQuery(""); setStatus("All statuses"); }} className="min-h-12 rounded-full border border-white/10 px-5 text-sm font-semibold text-slate-300 hover:bg-white/5">Reset</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Verified future watch</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Upcoming EVs, without the guesswork.</h2></div><p className="text-sm text-slate-400">{filteredVehicles.length} verified result{filteredVehicles.length === 1 ? "" : "s"}</p></div>

          {filteredVehicles.length ? <div className="mt-8 grid gap-6 lg:grid-cols-3">{filteredVehicles.map((vehicle) => <UpcomingCard key={vehicle.slug} vehicle={vehicle} />)}</div> : <div className="mt-8 rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-10 text-center"><p className="text-xl font-semibold">No verified future EV matches those filters.</p><p className="mt-2 text-sm text-slate-400">Reset the filters to view the complete verified watchlist.</p></div>}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02] py-14"><div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">PlugV verification standard</p><h2 className="mt-2 text-2xl font-semibold">Every launch claim needs a source and a date.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">When a concept becomes production-ready—or a vehicle launches in India—it should move to the correct section instead of remaining here.</p></div><ShieldCheck className="h-10 w-10 text-emerald-300" /></div></section>
      <SiteFooter />
    </main>
  );
}

function UpcomingCard({ vehicle }: { vehicle: UpcomingVehicle }) {
  return <article id={vehicle.slug} className="group scroll-mt-24 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.8)] transition hover:-translate-y-1 hover:border-sky-300/25">
    <div className={`relative h-64 overflow-hidden bg-gradient-to-br ${accentFor(`${vehicle.brand}-${vehicle.name}`)}`}><Image src="/images/vehicles/plugv-generic-ev-visual.webp" alt="Brand-neutral electric vehicle illustration" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-slate-950/25" /><div className="absolute left-5 top-5"><StatusBadge status={vehicle.status} /></div><div className="absolute right-5 top-5 rounded-full border border-amber-300/20 bg-slate-950/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-amber-100 backdrop-blur">Illustrative visual</div><div className="absolute inset-x-5 bottom-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{vehicle.brand}</p><h3 className="mt-2 text-3xl font-semibold">{vehicle.name}</h3><p className="mt-1 text-sm text-slate-300">{vehicle.segment}</p></div></div>
    <div className="p-6"><div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"><CalendarDays className="h-3.5 w-3.5" />Launch clarity</p><p className="mt-2 text-sm font-semibold text-white">{vehicle.launch}</p></div><p className="mt-5 text-sm leading-7 text-slate-300">{vehicle.note}</p>{vehicle.range ? <p className="mt-4 text-xs font-semibold text-sky-200">Manufacturer claim: {vehicle.range}</p> : null}<div className="mt-5 flex flex-wrap gap-2">{vehicle.features.map((feature) => <span key={feature} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">{feature}</span>)}</div><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5"><div><p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Verified</p><p className="mt-1 text-xs text-slate-300">{vehicle.verifiedAt}</p></div><a href={vehicle.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200">{vehicle.sourceName}<ArrowUpRight className="h-4 w-4" /></a></div></div>
  </article>;
}

function TrustRow({ title, copy, tone }: { title: string; copy: string; tone: "emerald" | "violet" | "slate" }) {
  const dot = tone === "emerald" ? "bg-emerald-400" : tone === "violet" ? "bg-violet-400" : "bg-slate-400";
  return <div className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} /><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p></div></div>;
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>;
}
