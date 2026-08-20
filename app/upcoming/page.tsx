"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Filter,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import UniversalSearch from "@/components/ui/UniversalSearch";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

type UpcomingEV = {
  name: string;
  brand: string;
  launchWindow: string;
  segment: string;
  expectedPrice: string;
  range: string;
  charging: string;
  note: string;
  status: "Confirmed" | "Expected" | "Rumoured";
  features: string[];
};

const upcomingEVs: UpcomingEV[] = [
  {
    name: "Tata Curvv EV",
    brand: "Tata",
    launchWindow: "Q4 2026",
    segment: "SUV",
    expectedPrice: "₹20–24 lakh",
    range: "450 km",
    charging: "Fast charging",
    note: "A sharp electric crossover with a more premium road presence and modern proportions.",
    status: "Confirmed",
    features: ["Panoramic feel", "SUV stance", "Family ready"],
  },
  {
    name: "Hyundai Creta EV",
    brand: "Hyundai",
    launchWindow: "Early 2027",
    segment: "SUV",
    expectedPrice: "₹22–26 lakh",
    range: "420 km",
    charging: "DC fast charge",
    note: "A familiar nameplate moving into the electric mainstream with broad appeal.",
    status: "Expected",
    features: ["Mainstream appeal", "City + highway", "Premium cabin"],
  },
  {
    name: "Mahindra XUV.e9",
    brand: "Mahindra",
    launchWindow: "2027",
    segment: "SUV",
    expectedPrice: "₹28–35 lakh",
    range: "500 km",
    charging: "Ultra-fast capable",
    note: "A premium electric SUV with a stronger road presence and futuristic proportions.",
    status: "Confirmed",
    features: ["Bold styling", "Large cabin", "Performance focus"],
  },
  {
    name: "Kia EV5",
    brand: "Kia",
    launchWindow: "2027",
    segment: "SUV",
    expectedPrice: "₹30–38 lakh",
    range: "480 km",
    charging: "Fast charging",
    note: "A balanced family EV with a clean, future-focused design language.",
    status: "Expected",
    features: ["Family first", "Modern design", "Long range"],
  },
  {
    name: "Maruti eVX",
    brand: "Maruti",
    launchWindow: "Late 2026",
    segment: "SUV",
    expectedPrice: "₹18–22 lakh",
    range: "550 km",
    charging: "Fast charging",
    note: "A high-volume electric SUV expected to be important for mainstream adoption.",
    status: "Expected",
    features: ["Mass-market", "High range", "Value focus"],
  },
  {
    name: "Toyota Urban Cruiser EV",
    brand: "Toyota",
    launchWindow: "2027",
    segment: "Crossover",
    expectedPrice: "₹21–27 lakh",
    range: "430 km",
    charging: "DC fast charge",
    note: "A practical crossover positioned for buyers who want reliability and brand trust.",
    status: "Rumoured",
    features: ["Reliable brand", "Practical shape", "City efficient"],
  },
  {
    name: "MG Cloud EV",
    brand: "MG",
    launchWindow: "Late 2026",
    segment: "Hatchback",
    expectedPrice: "₹16–20 lakh",
    range: "360 km",
    charging: "Fast charging",
    note: "A compact, premium urban EV likely to appeal to city-first buyers.",
    status: "Expected",
    features: ["Urban friendly", "Compact size", "Premium feel"],
  },
  {
    name: "VinFast VF 6",
    brand: "VinFast",
    launchWindow: "2027",
    segment: "SUV",
    expectedPrice: "₹24–30 lakh",
    range: "400 km",
    charging: "Fast charging",
    note: "A global EV contender bringing a fresh design and strong feature set.",
    status: "Rumoured",
    features: ["Fresh design", "Global EV", "New entrant"],
  },
];

const segmentOptions = ["All segments", "SUV", "Crossover", "Hatchback"] as const;
const statusOptions = ["All statuses", "Confirmed", "Expected", "Rumoured"] as const;
const launchOptions = ["All launch windows", "Late 2026", "Q4 2026", "Early 2027", "2027"] as const;
const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "launch-asc", label: "Earliest launch" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "range-desc", label: "Range (high to low)" },
] as const;

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function launchRank(value: string) {
  switch (value) {
    case "Late 2026":
      return 1;
    case "Q4 2026":
      return 2;
    case "Early 2027":
      return 3;
    case "2027":
      return 4;
    default:
      return 99;
  }
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

function StatusBadge({ status }: { status: UpcomingEV["status"] }) {
  const classes =
    status === "Confirmed"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : status === "Expected"
        ? "border-sky-400/20 bg-sky-400/10 text-sky-200"
        : "border-amber-400/20 bg-amber-400/10 text-amber-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${classes}`}
    >
      {status}
    </span>
  );
}

export default function UpcomingEVsPage() {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState<(typeof segmentOptions)[number]>(
    "All segments"
  );
  const [status, setStatus] = useState<(typeof statusOptions)[number]>(
    "All statuses"
  );
  const [launch, setLaunch] = useState<(typeof launchOptions)[number]>(
    "All launch windows"
  );
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>(
    "recommended"
  );

  const filteredEVs = useMemo(() => {
    const q = query.toLowerCase().trim();

    const matched = upcomingEVs.filter((ev) => {
      const matchesQuery =
        ev.name.toLowerCase().includes(q) ||
        ev.brand.toLowerCase().includes(q) ||
        ev.segment.toLowerCase().includes(q) ||
        ev.note.toLowerCase().includes(q) ||
        ev.status.toLowerCase().includes(q) ||
        ev.launchWindow.toLowerCase().includes(q);

      const matchesSegment = segment === "All segments" || ev.segment === segment;
      const matchesStatus = status === "All statuses" || ev.status === status;
      const matchesLaunch = launch === "All launch windows" || ev.launchWindow === launch;

      return matchesQuery && matchesSegment && matchesStatus && matchesLaunch;
    });

    const sorted = [...matched];

    switch (sortBy) {
      case "launch-asc":
        sorted.sort((a, b) => launchRank(a.launchWindow) - launchRank(b.launchWindow));
        break;
      case "price-asc":
        sorted.sort((a, b) => parseNumeric(a.expectedPrice) - parseNumeric(b.expectedPrice));
        break;
      case "range-desc":
        sorted.sort((a, b) => parseNumeric(b.range) - parseNumeric(a.range));
        break;
      default:
        break;
    }

    return sorted;
  }, [query, segment, status, launch, sortBy]);

  const spotlightEV = useMemo(() => {
    const source = filteredEVs.length > 0 ? filteredEVs : upcomingEVs;
    return source[0] ?? null;
  }, [filteredEVs]);

  const confirmedCount = upcomingEVs.filter((ev) => ev.status === "Confirmed").length;
  const expectedCount = upcomingEVs.filter((ev) => ev.status === "Expected").length;
  const rumouredCount = upcomingEVs.filter((ev) => ev.status === "Rumoured").length;
  const brandsCount = new Set(upcomingEVs.map((ev) => ev.brand)).size;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              Upcoming EVs
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
              Track the EV launches that matter most.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              PlugV turns upcoming launches into a premium research experience so buyers can plan, compare, and time their next EV decision with clarity.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Explore launched EVs
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Compare EVs
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Launch-ready", "Premium previews", "Confidence first"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-4">
              <StatCard
                label="Launches"
                value={`${upcomingEVs.length}+`}
                icon={<CalendarDays className="h-4 w-4" />}
              />
              <StatCard
                label="Brands"
                value={`${brandsCount}+`}
                icon={<Sparkles className="h-4 w-4" />}
              />
              <StatCard
                label="Confirmed"
                value={`${confirmedCount}+`}
                icon={<Bell className="h-4 w-4" />}
              />
              <StatCard
                label="Expected"
                value={`${expectedCount + rumouredCount}+`}
                icon={<Zap className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />

            <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                      Spotlight launch
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      {spotlightEV?.name ?? "Future EV"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {spotlightEV
                        ? `${spotlightEV.brand} · ${spotlightEV.segment} · ${spotlightEV.launchWindow}`
                        : "A premium launch preview experience."}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {spotlightEV?.status ?? "Expected"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`relative h-[340px] overflow-hidden bg-gradient-to-br ${
                  spotlightEV
                    ? accentFor(`${spotlightEV.brand}-${spotlightEV.name}`)
                    : "from-sky-400/25 via-cyan-400/10 to-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                  Premium preview
                </div>

                <div className="absolute inset-x-0 bottom-6 px-6">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                      Why this matters
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      Plan the next EV before it arrives.
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                      PlugV makes upcoming launches easy to monitor, compare, and act on without losing the premium feel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniStat label="Price" value={spotlightEV?.expectedPrice ?? "—"} />
                  <MiniStat label="Range" value={spotlightEV?.range ?? "—"} />
                  <MiniStat label="Charging" value={spotlightEV?.charging ?? "—"} />
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Launch insights
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Premium launch previews and future planning.
                  </h3>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {["Launch timeline", "Expected pricing", "Notification-ready"].map((item) => (
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
                
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mt-10 max-w-4xl">
    <UniversalSearch />
  </div>
</div>
                Search and filter
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Discover upcoming EVs faster.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Search by name, brand, segment, launch window, or status and keep the research flow calm and premium.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {segmentOptions.map((item) => (
                <Pill
                  key={item}
                  active={segment === item}
                  onClick={() => setSegment(item)}
                >
                  {item}
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
                  placeholder="Search launches, brands, or segments..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  aria-label="Search upcoming EVs"
                />
              </label>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as (typeof statusOptions)[number])}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none"
                >
                  {statusOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={launch}
                onChange={(e) => setLaunch(e.target.value as (typeof launchOptions)[number])}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none"
              >
                {launchOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
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
                Upcoming launches
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Discover upcoming EV launches in India.
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-400">
                Showing {filteredEVs.length} result{filteredEVs.length === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Launch timeline
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Expected pricing
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Notify me ready
              </span>
            </div>
          </div>

          {filteredEVs.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-4">
              {filteredEVs.map((ev, index) => {
                const accent = accentFor(`${ev.brand}-${ev.name}`);

                return (
                  <article
                    key={ev.name}
                    className="group overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.72)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/20 hover:shadow-[0_30px_100px_-24px_rgba(56,189,248,0.22)]"
                  >
                    <div className={`relative h-[290px] overflow-hidden bg-gradient-to-br ${accent}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

                      <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                        #{index + 1} launch
                      </div>

                      <div className="absolute inset-x-0 bottom-6 px-6">
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                                Spotlight
                              </p>
                              <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                                {ev.name}
                              </h3>
                            </div>
                            <StatusBadge status={ev.status} />
                          </div>

                          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                            {ev.brand} · {ev.segment}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 p-6">
                      <div className="grid grid-cols-3 gap-3">
                        <MiniStat label="Launch" value={ev.launchWindow} />
                        <MiniStat label="Range" value={ev.range} />
                        <MiniStat label="Price" value={ev.expectedPrice} />
                      </div>

                      <p className="text-sm leading-7 text-slate-300">
                        {ev.note}
                      </p>

                      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Key highlights
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {ev.features.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-5">
                        <a
                          href="#"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          Notify me
                          <Bell className="h-4 w-4" />
                        </a>

                        <Link
                          href="/vehicles"
                          className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                        >
                          Explore EVs
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
                No upcoming EVs match your search.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-400">
                Try another brand, segment, or launch window to keep exploring the future EV lineup.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSegment("All segments");
                  setStatus("All statuses");
                  setLaunch("All launch windows");
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
                title: "Built for planning",
                desc: "Use the launch page to compare timing, budget, and feature expectations before the EV arrives.",
              },
              {
                title: "Built for trust",
                desc: "Clear labels, premium layout, and thoughtful hierarchy make the launch journey feel dependable.",
              },
              {
                title: "Built for growth",
                desc: "This page can evolve into reminders, watchlists, launch news, and pre-booking flows.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                  Launch principle
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}