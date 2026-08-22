import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BatteryCharging, BadgeCheck } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { getVehicleVisual } from "@/data/vehicle-images";

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
}: {
  vehicle: (typeof vehicles)[number];
  index: number;
}) {
  const accent = accentFor(`${vehicle.brand}-${vehicle.name}`);
  const tripProfile = getVehicleTripProfile(vehicle.slug);
  const tripVariant = tripProfile?.variants.find((variant) => variant.name === tripProfile.defaultVariant);
  const vehicleVisual = getVehicleVisual(vehicle.slug);

  return (
    <article className="group overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.72)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/20 hover:shadow-[0_30px_100px_-24px_rgba(56,189,248,0.22)]">
      <div className={`relative h-[320px] overflow-hidden bg-gradient-to-br ${accent}`}>
        <Image
            src={vehicleVisual.src}
            alt={`PlugV concept visual representing the ${vehicle.type} category; actual ${vehicle.brand} ${vehicle.name} may differ`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.08)_45%,rgba(2,6,23,0.82))]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

        <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
          #{index + 1} pick
        </div>

        {vehicleVisual.plugvConcept ? <div className="absolute right-6 top-6 rounded-full border border-sky-300/20 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-100 backdrop-blur">PlugV concept · Actual may differ</div> : null}

        {tripProfile && vehicleVisual.modelSpecific ? <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100 backdrop-blur"><BadgeCheck className="h-3.5 w-3.5" />Official specs</div> : null}

        <div className="absolute inset-x-0 bottom-6 px-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
              Spotlight
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {vehicle.name}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
              {vehicle.brand} • {vehicle.type} • {vehicle.status}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-7">
        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Range" value={vehicle.range ?? "—"} />
          <MiniStat label={tripVariant ? "Battery" : "Trip data"} value={tripVariant ? `${tripVariant.batteryCapacityKWh} kWh` : "Estimate"} />
          <MiniStat label="Price" value={vehicle.price ?? "—"} />
        </div>

        {tripVariant ? <div className="flex items-center justify-between rounded-2xl border border-emerald-300/15 bg-emerald-400/[0.06] px-4 py-3 text-xs"><span className="inline-flex items-center gap-2 font-semibold text-emerald-100"><BatteryCharging className="h-4 w-4" />Up to {tripVariant.maxDcChargeKW} kW DC</span><span className="text-slate-400">{tripVariant.connector}</span></div> : null}

        <p className="text-sm leading-7 text-slate-300">
          A premium EV profile designed for shoppers who want the most relevant details first.
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <Link
            href={`/vehicles/${vehicle.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View details
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
    </article>
  );
}

type VehicleGridProps = {
  vehicles: (typeof vehicles)[number][];
};

export default function VehicleGrid({ vehicles: visibleVehicles }: VehicleGridProps) {
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
    <section className="py-20 sm:py-24">
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
            <VehicleCard key={vehicle.slug} vehicle={vehicle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
