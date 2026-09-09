"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, BatteryCharging, BadgeCheck, Check, ChevronDown, GitCompareArrows } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { getVehicleVisual } from "@/data/vehicle-images";
import { getBuyingSpecs } from "@/data/vehicle-buying-specs";

function accentFor(seed: string) {
  const accents = [
    "from-sky-400/25 via-cyan-400/10 to-transparent",
    "from-fuchsia-400/25 via-rose-400/10 to-transparent",
    "from-emerald-400/25 via-teal-400/10 to-transparent",
    "from-amber-300/25 via-orange-400/10 to-transparent",
    "from-violet-400/25 via-indigo-400/10 to-transparent",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return accents[hash % accents.length];
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function VehicleCard({
  vehicle,
  index,
  compareSelected,
  onToggleCompare,
}: {
  vehicle: (typeof vehicles)[number];
  index: number;
  compareSelected: boolean;
  onToggleCompare: () => void;
}) {
  const accent = accentFor(`${vehicle.brand}-${vehicle.name}`);
  const tripProfile = getVehicleTripProfile(vehicle.slug);
  const tripVariant = tripProfile?.variants.find((variant) => variant.name === tripProfile.defaultVariant);
  const vehicleVisual = getVehicleVisual(vehicle.slug);
  const buyingSpecs = getBuyingSpecs(vehicle.slug);
  const keyFeatures = Array.from(
    new Set(buyingSpecs.variantDetails.flatMap((variant) => variant.features ?? []))
  );

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.72)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:shadow-[0_24px_80px_-24px_rgba(56,189,248,0.18)]">
      <div className={`relative h-[230px] overflow-hidden bg-gradient-to-br ${accent}`}>
        <Image
            src={vehicleVisual.src}
            alt={`PlugV concept visual representing the ${vehicle.type} category; actual ${vehicle.brand} ${vehicle.name} may differ`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.08)_45%,rgba(2,6,23,0.82))]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur">
          #{index + 1} pick
        </div>

        {vehicleVisual.plugvConcept ? <div className="absolute right-4 top-4 rounded-full border border-sky-300/20 bg-slate-950/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-sky-100 backdrop-blur">PlugV concept</div> : null}

        {tripProfile && vehicleVisual.modelSpecific ? <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-100 backdrop-blur"><BadgeCheck className="h-3.5 w-3.5" />Official specs</div> : null}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {vehicle.name}
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              {vehicle.brand} • {vehicle.type}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <MiniStat label="ARAI / certified range" value={vehicle.range ?? "Not listed"} />
          <MiniStat label="Estimated real-world" value={tripVariant ? `~${tripVariant.practicalRangeKm} km` : "Not estimated"} />
          <MiniStat label="Battery" value={tripVariant ? `${tripVariant.batteryCapacityKWh} kWh` : "Awaiting data"} />
          <MiniStat label="Price" value={vehicle.price ?? "—"} />
        </div>
        <p className="mt-2 text-[10px] leading-4 text-slate-500">Practical range is a planning estimate for the displayed default variant—not a guarantee. Speed, weather, traffic, AC, elevation and load matter.</p>

        <button type="button" onClick={onToggleCompare} className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${compareSelected ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100" : "border-sky-300/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15"}`}>
          {compareSelected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}{compareSelected ? "Added to compare" : "Add to compare"}
        </button>

        <details className="mt-4 border-t border-white/10 pt-3 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 [&_.expand-icon]:open:rotate-180">
            Know more
            <ChevronDown className="expand-icon h-4 w-4 transition-transform" />
          </summary>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-2">
              <MiniStat label="Seating" value={`${buyingSpecs.seats} seats`} />
              <MiniStat label="DC charging" value={buyingSpecs.dcTime} />
              <MiniStat label="AC charging" value={buyingSpecs.acTime} />
            </div>

            {tripVariant ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.06] px-4 py-3 text-xs">
                <span className="inline-flex items-center gap-2 font-semibold text-emerald-100">
                  <BatteryCharging className="h-4 w-4" />
                  Up to {tripVariant.maxDcChargeKW} kW DC
                </span>
                <span className="text-slate-400">{tripVariant.connector}</span>
              </div>
            ) : null}

            {buyingSpecs.variants.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Available variants</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {buyingSpecs.variants.map((variant) => (
                    <span key={variant} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {keyFeatures.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Key features</p>
                <ul className="mt-2 grid gap-2 text-xs leading-5 text-slate-300 sm:grid-cols-2">
                  {keyFeatures.map((feature) => (
                    <li key={feature} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/vehicles/${vehicle.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Complete specifications
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/compare?vehicle=${encodeURIComponent(vehicle.slug)}`}
                className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
              >
                Compare
              </Link>
            </div>
          </div>
        </details>
      </div>
    </article>
  );
}

type VehicleGridProps = {
  vehicles: (typeof vehicles)[number][];
};

export default function VehicleGrid({ vehicles: visibleVehicles }: VehicleGridProps) {
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  function toggleCompare(slug: string) {
    setCompareSlugs((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current.slice(-1), slug]);
  }

  if (visibleVehicles.length === 0) {
    return (
      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center shadow-2xl shadow-black/20">
            <p className="text-2xl font-semibold text-white">
              No EVs match your search.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-400">
              Try another brand, type, or keyword and keep exploring the PlugV lineup.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="vehicle-results" className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
              Launched EVs
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Curated vehicles for serious buyers.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-400">
              Showing {visibleVehicles.length} result
              {visibleVehicles.length === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Compare-ready
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Search-first
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Premium discovery
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {visibleVehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} index={index} compareSelected={compareSlugs.includes(vehicle.slug)} onToggleCompare={() => toggleCompare(vehicle.slug)} />
          ))}
        </div>
      </div>
      {compareSlugs.length ? <div className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/95 p-3 shadow-2xl backdrop-blur sm:bottom-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-white">{compareSlugs.length}/2 vehicles selected</p><p className="truncate text-[10px] text-slate-400">{compareSlugs.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug)?.name).filter(Boolean).join(" + ") || "Choose vehicles"}</p></div>{compareSlugs.length === 2 ? <Link href={`/compare?vehicle=${encodeURIComponent(compareSlugs[0])}&with=${encodeURIComponent(compareSlugs[1])}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-400 px-4 text-xs font-bold text-slate-950">Compare now</Link> : <span className="px-2 text-xs text-slate-400">Add one more</span>}<button type="button" onClick={() => setCompareSlugs([])} className="min-h-11 rounded-xl border border-white/10 px-3 text-xs font-semibold text-white">Clear</button></div> : null}
    </section>
  );
}
