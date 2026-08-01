"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Clock3,
  Filter,
  MapPinned,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import ChargingIntelligence from "@/components/charging/ChargingIntelligence";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

type ChargingStation = {
  name: string;
  city: string;
  connector: string;
  speed: string;
  availability: "High" | "Medium" | "Low";
  distance: string;
  price: string;
  hours: string;
  amenities: string[];
  note: string;
};

const chargingStations: ChargingStation[] = [
  {
    name: "PlugV City Hub",
    city: "Mumbai",
    connector: "CCS2",
    speed: "120 kW",
    availability: "High",
    distance: "2.4 km",
    price: "₹22/kWh",
    hours: "24/7",
    amenities: ["Cafe", "Restrooms", "Parking", "Wi-Fi"],
    note: "A premium city charging stop designed for quick top-ups and easy access.",
  },
  {
    name: "Express Charge Point",
    city: "Delhi NCR",
    connector: "CCS2",
    speed: "150 kW",
    availability: "High",
    distance: "4.1 km",
    price: "₹24/kWh",
    hours: "24/7",
    amenities: ["Lounge", "Parking", "Security", "Wi-Fi"],
    note: "A fast-charging location with strong throughput for daily drivers and fleet users.",
  },
  {
    name: "GreenLine Station",
    city: "Bengaluru",
    connector: "Type 2",
    speed: "60 kW",
    availability: "Medium",
    distance: "1.8 km",
    price: "₹18/kWh",
    hours: "6 AM - 11 PM",
    amenities: ["Cafe", "Restrooms", "Fast Pay"],
    note: "A well-placed urban charging station for comfortable everyday charging.",
  },
  {
    name: "Highway Power Stop",
    city: "Pune",
    connector: "CCS2",
    speed: "180 kW",
    availability: "High",
    distance: "9.2 km",
    price: "₹26/kWh",
    hours: "24/7",
    amenities: ["Restrooms", "Parking", "Snacks", "Security"],
    note: "Built for highway confidence with a stronger fast-charge experience.",
  },
  {
    name: "PlugV Premium Lounge",
    city: "Hyderabad",
    connector: "CCS2",
    speed: "90 kW",
    availability: "Medium",
    distance: "3.7 km",
    price: "₹20/kWh",
    hours: "24/7",
    amenities: ["Lounge", "Cafe", "Wi-Fi", "Parking"],
    note: "A premium environment for buyers who want comfort while they recharge.",
  },
  {
    name: "Express Depot",
    city: "Chennai",
    connector: "Type 2",
    speed: "50 kW",
    availability: "Low",
    distance: "5.6 km",
    price: "₹17/kWh",
    hours: "7 AM - 10 PM",
    amenities: ["Parking", "Fast Pay", "Restrooms"],
    note: "A practical charging location for local drivers and regular city use.",
  },
];

const connectorFilters = ["All connectors", "CCS2", "Type 2"] as const;
const availabilityFilters = ["All availability", "High", "Medium", "Low"] as const;
const speedFilters = ["All speeds", "50-90 kW", "100-150 kW", "150+ kW"] as const;

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "distance-asc", label: "Distance (nearest)" },
  { value: "speed-desc", label: "Charging speed (fastest)" },
  { value: "price-asc", label: "Price (low to high)" },
] as const;

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function speedBucket(speed: string) {
  const value = parseNumeric(speed);
  if (value >= 150) return "150+ kW";
  if (value >= 100) return "100-150 kW";
  return "50-90 kW";
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

export default function ChargingPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All cities");
  const [connector, setConnector] =
    useState<(typeof connectorFilters)[number]>("All connectors");
  const [availability, setAvailability] =
    useState<(typeof availabilityFilters)[number]>("All availability");
  const [speed, setSpeed] = useState<(typeof speedFilters)[number]>("All speeds");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[number]["value"]>("recommended");

  const cities = useMemo(
    () => ["All cities", ...Array.from(new Set(chargingStations.map((s) => s.city))).sort()],
    []
  );

  const filteredStations = useMemo(() => {
    const q = query.toLowerCase().trim();

    const matches = chargingStations.filter((station) => {
      const matchesQuery =
        station.name.toLowerCase().includes(q) ||
        station.city.toLowerCase().includes(q) ||
        station.connector.toLowerCase().includes(q) ||
        station.speed.toLowerCase().includes(q) ||
        station.availability.toLowerCase().includes(q) ||
        station.price.toLowerCase().includes(q);

      const matchesCity = city === "All cities" || station.city === city;
      const matchesConnector =
        connector === "All connectors" || station.connector === connector;
      const matchesAvailability =
        availability === "All availability" || station.availability === availability;
      const matchesSpeed = speed === "All speeds" || speedBucket(station.speed) === speed;

      return matchesQuery && matchesCity && matchesConnector && matchesAvailability && matchesSpeed;
    });

    const sorted = [...matches];

    switch (sortBy) {
      case "distance-asc":
        sorted.sort((a, b) => parseNumeric(a.distance) - parseNumeric(b.distance));
        break;
      case "speed-desc":
        sorted.sort((a, b) => parseNumeric(b.speed) - parseNumeric(a.speed));
        break;
      case "price-asc":
        sorted.sort((a, b) => parseNumeric(a.price) - parseNumeric(b.price));
        break;
      default:
        break;
    }

    return sorted;
  }, [query, city, connector, availability, speed, sortBy]);

  const spotlightStation = useMemo(() => {
    const source = filteredStations.length > 0 ? filteredStations : chargingStations;
    if (!source.length) return null;
    return [...source].sort((a, b) => parseNumeric(b.speed) - parseNumeric(a.speed))[0];
  }, [filteredStations]);

  const cityCount = useMemo(
    () => new Set(chargingStations.map((s) => s.city)).size,
    []
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              Charging Intelligence
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
              Find charging stations with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Discover premium charging locations across India, compare speed and availability, and plan the right stop for your EV journey.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Explore EVs
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Compare EVs
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Fast charging", "Premium locations", "Route-ready"].map((item) => (
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
                label="Stations"
                value={`${chargingStations.length}+`}
                icon={<MapPinned className="h-4 w-4" />}
              />
              <StatCard
                label="Cities"
                value={`${cityCount}+`}
                icon={<Sparkles className="h-4 w-4" />}
              />
              <StatCard
                label="24/7 sites"
                value={`${chargingStations.filter((s) => s.hours === "24/7").length}+`}
                icon={<Clock3 className="h-4 w-4" />}
              />
              <StatCard
                label="Fast hubs"
                value={`${chargingStations.filter((s) => parseNumeric(s.speed) >= 100).length}+`}
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
                      Spotlight station
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      {spotlightStation?.name ?? "Premium charging hub"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {spotlightStation
                        ? `${spotlightStation.city} · ${spotlightStation.connector} · ${spotlightStation.speed}`
                        : "Charging stops designed for clarity and confidence."}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Availability
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {spotlightStation?.availability ?? "High"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`relative h-[340px] overflow-hidden bg-gradient-to-br ${
                  spotlightStation
                    ? accentFor(`${spotlightStation.name}-${spotlightStation.city}`)
                    : "from-sky-400/25 via-cyan-400/10 to-transparent"
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                  Premium location
                </div>

                <div className="absolute inset-x-0 bottom-6 px-6">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                      Why this matters
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      Charging that feels easy to trust.
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                      Premium EV users want speed, convenience, and confidence. PlugV brings those together in one calm discovery surface.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniStat label="Speed" value={spotlightStation?.speed ?? "—"} />
                  <MiniStat label="Distance" value={spotlightStation?.distance ?? "—"} />
                  <MiniStat label="Price" value={spotlightStation?.price ?? "—"} />
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Network insight
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Discover the best charging stop for your next trip.
                  </h3>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {["Fast hubs", "City stops", "Route planning"].map((item) => (
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
                Find the right charging station, faster.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Search by city, connector, speed, availability, distance, or price. Then filter the results into a cleaner, route-ready list.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {connectorFilters.map((item) => (
                <Pill
                  key={item}
                  active={connector === item}
                  onClick={() => setConnector(item)}
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
                  placeholder="Search stations, cities, connectors, or pricing..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                  aria-label="Search charging stations"
                />
              </label>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none"
                >
                  {cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value as (typeof availabilityFilters)[number])
                }
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none"
              >
                {availabilityFilters.map((item) => (
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

            <div className="mt-4 flex flex-wrap gap-3">
              {speedFilters.map((item) => (
                <Pill
                  key={item}
                  active={speed === item}
                  onClick={() => setSpeed(item)}
                >
                  {item}
                </Pill>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Charging locations
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Premium stops for serious EV users.
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-400">
                Showing {filteredStations.length} result{filteredStations.length === 1 ? "" : "s"}.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Fast charge
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                City ready
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Route friendly
              </span>
            </div>
          </div>

          {filteredStations.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {filteredStations.map((station, index) => {
                const accent = accentFor(`${station.name}-${station.city}`);

                return (
                  <article
                    key={station.name}
                    className="group overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.72)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/20 hover:shadow-[0_30px_100px_-24px_rgba(56,189,248,0.22)]"
                  >
                    <div
                      className={`relative h-[320px] overflow-hidden bg-gradient-to-br ${accent}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

                      <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                        #{index + 1} stop
                      </div>

                      <div className="absolute inset-x-0 bottom-6 px-6">
                        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                            Spotlight
                          </p>
                          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                            {station.name}
                          </h3>
                          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                            {station.city} · {station.connector} · {station.speed}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 p-7">
                      <div className="grid grid-cols-3 gap-3">
                        <MiniStat label="Distance" value={station.distance} />
                        <MiniStat label="Availability" value={station.availability} />
                        <MiniStat label="Price" value={station.price} />
                      </div>

                      <p className="text-sm leading-7 text-slate-300">
                        {station.note}
                      </p>

                      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Amenities
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {station.amenities.map((item) => (
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
                          View on map
                          <MapPinned className="h-4 w-4" />
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
                No charging stations match your search.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-400">
                Try another city, connector, or charging speed and keep exploring the PlugV network.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCity("All cities");
                  setConnector("All connectors");
                  setAvailability("All availability");
                  setSpeed("All speeds");
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
      <ChargingIntelligence stations={chargingStations} />

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Built for route planning",
                desc: "Use the charging page to think beyond a single stop and plan the full journey with confidence.",
              },
              {
                title: "Built for trust",
                desc: "Premium layout, clear availability, and clean filters make the experience feel reliable and calm.",
              },
              {
                title: "Built for growth",
                desc: "This page can expand into live availability, saved stations, route optimization, and partnerships.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                  Charging principle
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
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