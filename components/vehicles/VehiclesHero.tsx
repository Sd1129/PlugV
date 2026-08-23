import Link from "next/link";
import { Gauge, Sparkles, Zap } from "lucide-react";
import { vehicles } from "@/data/vehicles";

function parseNumeric(value?: string) {
  const values = value?.replace(/,/g, "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return values.length ? Math.max(...values) : 0;
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

export default function VehiclesHero({ children }: { children: React.ReactNode }) {
  const launchedVehicles = vehicles.filter((vehicle) => vehicle.launched);

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

        <div className="relative lg:self-stretch">
          <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />
          {children}
        </div>
      </div>
    </section>
  );
}

