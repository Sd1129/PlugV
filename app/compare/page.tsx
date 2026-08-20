"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Gauge,
  MapPinned,
  Sparkles,
  Zap,
} from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import TrustSummary from "@/components/vehicles/TrustSummary";
import { vehicles } from "@/data/vehicles";
import { getCompareInsights } from "@/lib/compare/compareEngine";

type Vehicle = (typeof vehicles)[number];

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
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

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
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

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
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

function InsightCard({
  title,
  subtitle,
  value,
  icon,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sky-200">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-400">{subtitle}</p>
      <p className="mt-4 text-sm font-semibold text-sky-300">{value}</p>
    </article>
  );
}

function StatusBar({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const numeric = parseNumeric(value);
  const width = Math.max(12, Math.min(100, numeric > 0 ? numeric / 5 : 20));

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-sky-400"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function ComparePage() {
  const launchedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.launched),
    []
  );

  const [leftSlug, setLeftSlug] = useState(launchedVehicles[0]?.slug ?? "");
  const [rightSlug, setRightSlug] = useState(
    launchedVehicles[1]?.slug ?? launchedVehicles[0]?.slug ?? ""
  );

  const leftVehicle = useMemo(
    () =>
      vehicles.find((vehicle) => vehicle.slug === leftSlug) ??
      launchedVehicles[0],
    [leftSlug, launchedVehicles]
  );

  const rightVehicle = useMemo(
    () =>
      vehicles.find((vehicle) => vehicle.slug === rightSlug) ??
      launchedVehicles[1] ??
      launchedVehicles[0],
    [rightSlug, launchedVehicles]
  );

  const compareInsights = useMemo(() => getCompareInsights(vehicles), []);

  const leftRange = parseNumeric(leftVehicle?.range);
  const rightRange = parseNumeric(rightVehicle?.range);
  const leftCharging = parseNumeric(leftVehicle?.charging);
  const rightCharging = parseNumeric(rightVehicle?.charging);
  const leftPrice = parseNumeric(leftVehicle?.price);
  const rightPrice = parseNumeric(rightVehicle?.price);

  const heroStats = [
    {
      label: "Launched EVs",
      value: `${launchedVehicles.length}+`,
      icon: <Zap className="h-4 w-4" />,
    },
    {
      label: "Brands",
      value: `${new Set(launchedVehicles.map((v) => v.brand)).size}+`,
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      label: "Decision focus",
      value: "Premium",
      icon: <Gauge className="h-4 w-4" />,
    },
  ];

  const decisionCards = [
    {
      title: "Best for city",
      subtitle:
        "Optimized for daily commutes, practicality, and easy urban ownership.",
      value: compareInsights.bestCity?.vehicle?.name ?? "—",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      title: "Best for highway",
      subtitle:
        "Strong for longer drives, range confidence, and fast-charge planning.",
      value: compareInsights.bestHighway?.vehicle?.name ?? "—",
      icon: <MapPinned className="h-4 w-4" />,
    },
    {
      title: "Best for family",
      subtitle:
        "More confidence for family trips, cabin utility, and everyday versatility.",
      value: compareInsights.bestFamily?.vehicle?.name ?? "—",
      icon: <BatteryCharging className="h-4 w-4" />,
    },
    {
      title: "Best value",
      subtitle: "A stronger balance of price and usability for smart buyers.",
      value: compareInsights.bestValue?.vehicle?.name ?? "—",
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      title: "Best range",
      subtitle:
        "For shoppers who care about travel confidence and fewer charging stops.",
      value: compareInsights.bestRange?.vehicle?.name ?? "—",
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      title: "Best charging",
      subtitle: "The quickest charging experience in the launched lineup.",
      value: compareInsights.bestCharging?.vehicle?.name ?? "—",
      icon: <BatteryCharging className="h-4 w-4" />,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      {/* HERO */}
<section className="relative overflow-hidden">
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
  <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

  <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
        Compare EVs
      </div>

      <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
        Compare EVs the premium way.
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        PlugV turns comparison into a calm decision experience so shoppers
        can evaluate range, charging, and value without noise.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/vehicles"
          className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          Explore EVs
        </Link>

        <Link
          href="/search"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Search PlugV
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {heroStats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  </div>
</section>

{/* COMPARISON SETUP */}
<section className="border-y border-white/10 bg-white/[0.02] py-8 sm:py-10">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
          Comparison setup
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Choose two EVs to compare
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Select the two vehicles you want to compare side-by-side.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        
        {/* LEFT PICK */}
        <label className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
            Left pick
          </span>

          <select
            value={leftSlug}
            onChange={(e) => setLeftSlug(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/90 px-3 py-3 text-sm font-semibold text-white outline-none [color-scheme:dark]"
          >
            {launchedVehicles.map((vehicle) => (
              <option
                key={vehicle.slug}
                value={vehicle.slug}
                className="bg-slate-950 text-white"
              >
                {vehicle.brand} — {vehicle.name}
              </option>
            ))}
          </select>
        </label>

        {/* VS */}
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-xs font-bold text-sky-300">
          VS
        </div>

        {/* RIGHT PICK */}
        <label className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
            Right pick
          </span>

          <select
            value={rightSlug}
            onChange={(e) => setRightSlug(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/90 px-3 py-3 text-sm font-semibold text-white outline-none [color-scheme:dark]"
          >
            {launchedVehicles.map((vehicle) => (
              <option
                key={vehicle.slug}
                value={vehicle.slug}
                className="bg-slate-950 text-white"
              >
                {vehicle.brand} — {vehicle.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* CURRENT SELECTION */}
      <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Current comparison
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {leftVehicle?.name}
            <span className="mx-2 text-sky-400">vs</span>
            {rightVehicle?.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {["overview", "range", "charging", "value"].map((item) => (
            <Pill key={item} active={item === "overview"}>
              {item}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {[leftVehicle, rightVehicle].map((vehicle, idx) => {
              if (!vehicle) return null;
              const accent = accentFor(`${vehicle.brand}-${vehicle.name}`);
              const side = idx === 0 ? "Left pick" : "Right pick";

              return (
                <article
                  key={`${side}-${vehicle.slug}`}
                  className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.72)] backdrop-blur"
                >
                  <div
                    className={`relative h-[260px] overflow-hidden bg-gradient-to-br ${accent}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                    <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                      {side}
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

                  <div className="space-y-4 p-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <MiniStat label="Range" value={vehicle.range ?? "—"} />
                      <MiniStat label="Charging" value={vehicle.charging ?? "—"} />
                      <MiniStat label="Price" value={vehicle.price ?? "—"} />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Why it matters
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        A premium EV profile that highlights the decision details
                        first and gives the buyer a clear path forward.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Trust & intelligence
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                One intelligence standard everywhere.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                The same PlugV score, verdict, and ownership snapshot now
                appears across comparison flows too.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <TrustSummary vehicle={leftVehicle} />
            <TrustSummary vehicle={rightVehicle} />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Smart compare
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Richer recommendations for real buyers.
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {decisionCards.map((item) => (
              <InsightCard key={item.title} {...item} />
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Head-to-head signals
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Current comparison signals
              </h3>

              <div className="mt-6 grid gap-4">
                <StatusBar
                  label="Range advantage"
                  value={
                    leftRange === rightRange
                      ? "Even"
                      : leftRange > rightRange
                        ? leftVehicle?.name ?? "—"
                        : rightVehicle?.name ?? "—"
                  }
                />
                <StatusBar
                  label="Charging advantage"
                  value={
                    leftCharging === rightCharging
                      ? "Even"
                      : leftCharging > rightCharging
                        ? leftVehicle?.name ?? "—"
                        : rightVehicle?.name ?? "—"
                  }
                />
                <StatusBar
                  label="Price position"
                  value={
                    leftPrice === rightPrice
                      ? "Even"
                      : leftPrice < rightPrice
                        ? leftVehicle?.name ?? "—"
                        : rightVehicle?.name ?? "—"
                  }
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Quick verdict
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Better EV decision flow.
              </h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Range
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {leftRange === rightRange
                      ? "Even"
                      : leftRange > rightRange
                        ? leftVehicle?.name ?? "—"
                        : rightVehicle?.name ?? "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Charging
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {leftCharging === rightCharging
                      ? "Even"
                      : leftCharging > rightCharging
                        ? leftVehicle?.name ?? "—"
                        : rightVehicle?.name ?? "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Value
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {leftPrice === rightPrice
                      ? "Even"
                      : leftPrice < rightPrice
                        ? leftVehicle?.name ?? "—"
                        : rightVehicle?.name ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}