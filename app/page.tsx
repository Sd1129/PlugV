"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Filter, Search } from "lucide-react";
import UniversalSearch from "@/components/ui/UniversalSearch";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { vehicles } from "@/data/vehicles";

type Vehicle = (typeof vehicles)[number];

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "range-desc", label: "Range (high to low)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "name-asc", label: "Name (A–Z)" },
] as const;

const ACCENTS = [
  "from-sky-400/25 via-cyan-400/10 to-transparent",
  "from-fuchsia-400/25 via-rose-400/10 to-transparent",
  "from-emerald-400/25 via-teal-400/10 to-transparent",
  "from-amber-300/25 via-orange-400/10 to-transparent",
  "from-violet-400/25 via-indigo-400/10 to-transparent",
];

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function accentFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ACCENTS[hash % ACCENTS.length];
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10 backdrop-blur">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
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

function Pill({
  children,
  active = false,
  onClick,
}: {
  children: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const classes = [
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition",
    active
      ? "border-sky-400/25 bg-sky-400 text-slate-950"
      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
  ].join(" ");

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}

export default function VehiclesPage() {
  const launchedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.launched),
    []
  );

  const brands = useMemo(
    () => ["All brands", ...Array.from(new Set(launchedVehicles.map((v) => v.brand))).sort()],
    [launchedVehicles]
  );

  const types = useMemo(
    () => ["All types", ...Array.from(new Set(launchedVehicles.map((v) => v.type))).sort()],
    [launchedVehicles]
  );

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All types");
  const [selectedBrand, setSelectedBrand] = useState("All brands");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>(
    "recommended"
  );

  const filteredVehicles = useMemo(() => {
    const q = query.toLowerCase().trim();

    const matches = launchedVehicles.filter((vehicle) => {
      const matchesQuery =
        vehicle.name.toLowerCase().includes(q) ||
        vehicle.brand.toLowerCase().includes(q) ||
        vehicle.type.toLowerCase().includes(q) ||
        vehicle.status.toLowerCase().includes(q) ||
        (vehicle.price ?? "").toLowerCase().includes(q) ||
        (vehicle.range ?? "").toLowerCase().includes(q) ||
        (vehicle.charging ?? "").toLowerCase().includes(q);

      const matchesType =
        selectedType === "All types" || vehicle.type === selectedType;
      const matchesBrand =
        selectedBrand === "All brands" || vehicle.brand === selectedBrand;

      return matchesQuery && matchesType && matchesBrand;
    });

    const sorted = [...matches];

    switch (sortBy) {
      case "range-desc":
        sorted.sort((a, b) => parseNumeric(b.range) - parseNumeric(a.range));
        break;
      case "price-asc":
        sorted.sort((a, b) => parseNumeric(a.price) - parseNumeric(b.price));
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [launchedVehicles, query, selectedType, selectedBrand, sortBy]);

  const spotlightVehicle = useMemo(() => {
    const source = filteredVehicles.length > 0 ? filteredVehicles : launchedVehicles;
    if (source.length === 0) return null;

    return [...source].sort((a, b) => parseNumeric(b.range) - parseNumeric(a.range))[0];
  }, [filteredVehicles, launchedVehicles]);

  const averageRange = useMemo(() => {
    const values = launchedVehicles
      .map((vehicle) => parseNumeric(vehicle.range))
      .filter((value) => value > 0);

    if (!values.length) return "—";

    const avg = Math.round(
      values.reduce((sum, value) => sum + value, 0) / values.length
    );
    return `${avg}`;
  }, [launchedVehicles]);

  const averageRangeUnit = useMemo(() => {
    const sample = launchedVehicles.find((vehicle) => vehicle.range)?.range ?? "";
    if (sample.toLowerCase().includes("mi")) return "mi";
    if (sample.toLowerCase().includes("km")) return "km";
    return "";
  }, [launchedVehicles]);

  const featuredTypes = types.slice(1, 5);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

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
              Search launched EVs across India, compare the key details first,
              and move from browsing to confidence with a premium discovery
              experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/#compare"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Compare on PlugV
              </Link>
              <Link
                href="/#upcoming"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse upcoming EVs
              </Link>
            </div>

            <div className="mt-8 max-w-3xl">
              <UniversalSearch />
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

            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              <StatCard
                value={`${launchedVehicles.length}+`}
                label="Launched EVs"
              />
              <StatCard value={`${brands.length - 1}+`} label="Brands" />
              <StatCard
                value={`${averageRange}${averageRangeUnit ? ` ${averageRangeUnit}` : ""}`}
                label="Average range"
              />
              <StatCard value={`${types.length - 1}+`} label="Body styles" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />

            <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
              <div
                className={`relative h-[340px] overflow-hidden bg-gradient-to-br ${
                  spotlightVehicle
                    ? accentFor(`${spotlightVehicle.brand}-${spotlightVehicle.name}`)
                    : ACCENTS[0]
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
                  <MiniStat label="Range" value={spotlightVehicle?.range ?? "—"} />
                  <MiniStat
                    label="Charging"
                    value={spotlightVehicle?.charging ?? "—"}
                  />
                  <MiniStat label="Price" value={spotlightVehicle?.price ?? "—"} />
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

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
                Search and filter
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Find the right EV, faster.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Search by brand, type, charging, price, or range. Then narrow
                the lineup with premium filters and sort by what matters most.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredTypes.map((type) => (
                <Pill
                  key={type}
                  active={selectedType === type}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Pill>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur lg:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-sm">
                <Search className="h-4 w-4 text-sky-300" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search vehicles, brands, types, range, price..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  aria-label="Search vehicles"
                />
              </label>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as (typeof sortOptions)[number]["value"])
                }
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

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
                Showing {filteredVehicles.length} result
                {filteredVehicles.length === 1 ? "" : "s"}.
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

          {filteredVehicles.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {filteredVehicles.map((vehicle, index) => {
                const accent = accentFor(`${vehicle.brand}-${vehicle.name}`);
                return (
                  <article
                    key={vehicle.slug}
                    className="group overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.72)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/20 hover:shadow-[0_30px_100px_-24px_rgba(56,189,248,0.22)]"
                  >
                    <div
                      className={`relative h-[320px] overflow-hidden bg-gradient-to-br ${accent}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

                      <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                        #{index + 1} pick
                      </div>

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
                        <MiniStat label="Charging" value={vehicle.charging ?? "—"} />
                        <MiniStat label="Price" value={vehicle.price ?? "—"} />
                      </div>

                      <p className="text-sm leading-7 text-slate-300">
                        A premium EV profile designed for shoppers who want the
                        most relevant details first.
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
                          href="/#compare"
                          className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                        >
                          Compare
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center shadow-2xl shadow-black/20">
              <p className="text-2xl font-semibold text-white">
                No EVs match your search.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-400">
                Try another brand, type, or keyword and keep exploring the
                PlugV lineup.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedType("All types");
                  setSelectedBrand("All brands");
                  setSortBy("recommended");
                }}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Built for comparison",
                desc: "Every EV card gives buyers the core details they need to make a faster decision.",
              },
              {
                title: "Built for trust",
                desc: "A calmer and more premium interface makes the platform feel dependable and clear.",
              },
              {
                title: "Built for growth",
                desc: "This page can scale into saved searches, AI recommendations, and lead generation.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                  Discovery principle
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}