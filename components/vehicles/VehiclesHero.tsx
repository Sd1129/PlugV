import Link from "next/link";
import { Gauge, Sparkles, Zap } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";

function parseNumeric(value?: string) {
  const values = value?.replace(/,/g, "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return values.length ? Math.max(...values) : 0;
}

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

function HeroStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10 backdrop-blur">
      <div className="flex items-center gap-2 text-sky-200/80">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

export default function VehiclesHero() {
  const launchedVehicles = vehicles.filter((vehicle) => vehicle.launched);

  const spotlightVehicle =
    [...launchedVehicles].sort(
      (a, b) => parseNumeric(b.range) - parseNumeric(a.range)
    )[0] ?? null;
  const spotlightProfile = spotlightVehicle ? getVehicleTripProfile(spotlightVehicle.slug) : undefined;
  const spotlightVariant = spotlightProfile?.variants.find((variant) => variant.name === spotlightProfile.defaultVariant);

  const brandsCount = new Set(launchedVehicles.map((vehicle) => vehicle.brand)).size;

  const rangeValues = launchedVehicles
    .map((vehicle) => parseNumeric(vehicle.range))
    .filter((value) => value > 0);

  const averageRange =
    rangeValues.length > 0
      ? Math.round(
          rangeValues.reduce((sum, value) => sum + value, 0) / rangeValues.length
        )
      : 0;

  const averageRangeUnit = launchedVehicles.find((vehicle) => vehicle.range)?.range
    ?.toLowerCase()
    .includes("mi")
    ? "mi"
    : "km";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
            Explore EVs
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.2rem]">
            Discover the EV that fits your life.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Search launched EVs across India, compare the key details first, and move from browsing to confidence with a premium discovery experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Compare on PlugV
            </Link>
            <Link
              href="/upcoming"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse upcoming EVs
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Premium discovery", "Sharper comparison", "Better EV decisions"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-slate-300"
                >
                  {item}
                </span>
              )
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <HeroStat
              label="Launched EVs"
              value={`${launchedVehicles.length}+`}
              icon={<Zap className="h-4 w-4" />}
            />
            <HeroStat
              label="Brands"
              value={`${brandsCount}+`}
              icon={<Sparkles className="h-4 w-4" />}
            />
            <HeroStat
              label="Average range"
              value={`${averageRange}${averageRangeUnit ? ` ${averageRangeUnit}` : ""}`}
              icon={<Gauge className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />

          <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
            <div
              className={`relative h-[340px] overflow-hidden bg-gradient-to-br ${
                spotlightVehicle
                  ? accentFor(`${spotlightVehicle.brand}-${spotlightVehicle.name}`)
                  : "from-sky-400/25 via-cyan-400/10 to-transparent"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

              <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                Featured today
              </div>

              <div className="absolute inset-x-0 bottom-6 px-6">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                    Spotlight vehicle
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    {spotlightVehicle?.name ?? "Featured EV"}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                    {spotlightVehicle
                      ? `${spotlightVehicle.brand} • ${spotlightVehicle.type} • ${spotlightVehicle.status}`
                      : "A premium EV discovery surface for India."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Range
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {spotlightVehicle?.range ?? "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {spotlightVariant ? "Battery · DC charging" : "Trip specification"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {spotlightVariant ? `${spotlightVariant.batteryCapacityKWh} kWh · ${spotlightVariant.maxDcChargeKW} kW` : "Awaiting verification"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Price
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {spotlightVehicle?.price ?? "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Why this matters
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Explore EVs with more confidence, less friction.
                    </h3>
                  </div>
                  <div className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
                    PlugV
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    "Compare EVs side by side",
                    "Discover charging stations",
                    "Track upcoming launches",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
