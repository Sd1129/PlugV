"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BatteryCharging,
  Clock3,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import TravelRouteMap from "@/components/travel/TravelRouteMap";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { chargingStations, type ChargingStation } from "@/data/charging/stations";

type SortMode = "recommended" | "distance-asc" | "speed-desc" | "name-asc";

type RoutePoint = {
  state: string;
  city: string;
  label: string;
  order: number;
};

type RoutePlan = {
  from: string;
  to: string;
  distance: string;
  duration: string;
  stops: number;
  corridor: RoutePoint[];
  summary: string;
};

type TravelStop = ChargingStation & {
  corridorCity: string;
  corridorLabel: string;
  corridorOrder: number;
  routeScore: number;
  speedValue: number;
  distanceValue: number;
};

const routePlans: Record<string, RoutePlan> = {
  "hyderabad__bengaluru": {
    from: "Hyderabad",
    to: "Bengaluru",
    distance: "570 km",
    duration: "~9h 20m",
    stops: 3,
    summary:
      "A practical southbound EV corridor with reliable DC fast charging on the way to Bengaluru.",
    corridor: [
      { state: "Telangana", city: "Hyderabad", label: "Origin city", order: 0 },
      { state: "Andhra Pradesh", city: "Kurnool", label: "Fast corridor hub", order: 1 },
      { state: "Andhra Pradesh", city: "Anantapur", label: "Midway stop", order: 2 },
      { state: "Karnataka", city: "Bengaluru Rural", label: "Arrival corridor", order: 3 },
      { state: "Karnataka", city: "Bengaluru", label: "Destination city", order: 4 },
    ],
  },
  "chennai__bengaluru": {
    from: "Chennai",
    to: "Bengaluru",
    distance: "345 km",
    duration: "~6h 10m",
    stops: 2,
    summary:
      "A shorter interstate route with a compact set of charging options between Chennai and Bengaluru.",
    corridor: [
      { state: "Tamil Nadu", city: "Chennai", label: "Origin city", order: 0 },
      { state: "Tamil Nadu", city: "Krishnagiri", label: "Highway stop", order: 1 },
      { state: "Karnataka", city: "Hosur", label: "Border corridor", order: 2 },
      { state: "Karnataka", city: "Bengaluru", label: "Destination city", order: 3 },
    ],
  },
  "mumbai__pune": {
    from: "Mumbai",
    to: "Pune",
    distance: "155 km",
    duration: "~3h 10m",
    stops: 1,
    summary:
      "A short but important corridor for quick charging and confident weekend travel.",
    corridor: [
      { state: "Maharashtra", city: "Mumbai", label: "Origin city", order: 0 },
      { state: "Maharashtra", city: "Lonavala", label: "En route stop", order: 1 },
      { state: "Maharashtra", city: "Pune", label: "Destination city", order: 2 },
    ],
  },
};

const allRouteCities = Array.from(
  new Set(
    Object.values(routePlans).flatMap((route) => route.corridor.map((point) => point.city))
  )
).sort();

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function routeKey(fromCity: string, toCity: string) {
  return `${normalizeKey(fromCity)}__${normalizeKey(toCity)}`;
}

function getRoutePlan(fromCity: string, toCity: string): RoutePlan {
  const direct = routePlans[routeKey(fromCity, toCity)];
  if (direct) {
    return direct;
  }

  const reverse = routePlans[routeKey(toCity, fromCity)];
  if (reverse) {
    return {
      ...reverse,
      from: fromCity,
      to: toCity,
      corridor: [...reverse.corridor]
        .reverse()
        .map((point, index, array) => ({
          ...point,
          order: index,
          label:
            index === 0
              ? "Origin city"
              : index === array.length - 1
                ? "Destination city"
                : point.label,
        })),
    };
  }

  return {
    ...routePlans["hyderabad__bengaluru"],
    from: fromCity,
    to: toCity,
  };
}

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function scoreStation(station: ChargingStation, point: RoutePoint) {
  const powerValue = station.charging?.maxPowerKW ?? 0;
  const reviewRating = station.charging?.reviewRating ?? 0;
const reviewCount = station.charging?.reviewCount ?? 0;
  const connector =
    `${station.connectors.ccs2 ? "ccs2" : ""} ${station.connectors.chademo ? "chademo" : ""} ${station.connectors.acType2 ? "type2" : ""}`.toLowerCase();
  const reviewSource = (station.charging?.reviewSource ?? "").toLowerCase();

  const reviewScore = reviewRating ? Math.round(reviewRating * 10) : 10;
  const reviewCountScore = reviewCount ? Math.min(Math.round(reviewCount / 10), 20) : 0;
  const fastScore = Math.min(powerValue, 240) * 0.35;
  const connectorScore = connector.includes("ccs2") ? 10 : connector.includes("type2") ? 7 : 4;
  const corridorScore = Math.max(0, 14 - point.order * 2);
  const sourceScore = reviewSource === "operator" ? 6 : reviewSource === "community" ? 4 : 2;

  return Math.round(
    fastScore + reviewScore + reviewCountScore + connectorScore + corridorScore + sourceScore
  );
}

function stationDistanceKm(_: ChargingStation, corridorIndex: number) {
  return corridorIndex * 120 + 15;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function MetricCard({
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
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function TravelStopCard({
  stop,
  index,
  selected,
  onSelect,
}: {
  stop: TravelStop;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const reviewRating = stop.charging?.reviewRating ?? null;
const reviewCount = stop.charging?.reviewCount ?? null;
const lastChecked = stop.charging?.lastChecked ?? null;
const reviewSource = stop.charging?.reviewSource ?? null;
const maxPower = stop.charging?.maxPowerKW ?? null;

  const statusClass =
    reviewRating && reviewRating >= 4.5
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
      : reviewRating && reviewRating >= 4
        ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
        : "border-white/10 bg-white/5 text-slate-200";

  const amenities = Array.isArray(stop.amenities) ? stop.amenities : [];
  
  const isFast = stop.charging?.dcFast || maxPower >= 50;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "text-left rounded-[1.75rem] border p-5 shadow-2xl shadow-black/20 backdrop-blur transition",
        selected
          ? "border-sky-400/30 bg-sky-400/10 ring-1 ring-sky-400/30"
          : "border-white/10 bg-white/5 hover:bg-white/7",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
            Route stop #{index + 1}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{stop.name}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {stop.city}
            {stop.state ? `, ${stop.state}` : ""}
          </p>
        </div>

        <div
          className={[
            "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
            statusClass,
          ].join(" ")}
        >
          {reviewRating ? `${reviewRating.toFixed(1)} ★` : "No rating yet"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MetricCard label="DC power" value={`${maxPower || "—"} kW`} />
        <MetricCard
          label="Connector"
          value={
            stop.connectors.ccs2
              ? "CCS2"
              : stop.connectors.chademo
                ? "CHAdeMO"
                : "AC Type-2"
          }
        />
        <MetricCard label="Route score" value={`${stop.routeScore}`} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <MetricCard label="Reviews" value={reviewCount ? `${reviewCount}` : "—"} />
        <MetricCard label="Last checked" value={lastChecked ?? "—"} />
        <MetricCard label="Source" value={reviewSource ?? "—"} />
      </div>

      {amenities.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-slate-300">
          {amenities.slice(0, 4).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Station note
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
        {"PlugV Travel is using the shared charging dataset for corridor planning."}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
        <span>{isFast ? "Fast DC priority" : "Corridor stop"}</span>
        <span>{stop.corridorLabel}</span>
      </div>
    </button>
  );
}

function DetailPanel({ stop }: { stop: TravelStop | null }) {
  if (!stop) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur lg:sticky lg:top-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
          Station detail
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          Select a stop to inspect it.
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          The panel shows DC power, connector type, hours, amenities, and review details when present.
        </p>
      </div>
    );
  }

  const reviewRating = stop.charging?.reviewRating ?? null;
const reviewCount = stop.charging?.reviewCount ?? null;
const lastChecked = stop.charging?.lastChecked ?? null;
const reviewSource = stop.charging?.reviewSource ?? null;
const maxPower = stop.charging?.maxPowerKW ?? null;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur lg:sticky lg:top-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
            Station detail
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{stop.name}</h3>
          <p className="mt-2 text-sm text-slate-400">
            {stop.city}
            {stop.state ? `, ${stop.state}` : ""}
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
          {reviewRating ? `${reviewRating.toFixed(1)} ★` : "No rating yet"}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricCard label="DC power" value={`${maxPower || "—"} kW`} />
        <MetricCard
          label="Connector"
          value={
            stop.connectors.ccs2
              ? "CCS2"
              : stop.connectors.chademo
                ? "CHAdeMO"
                : "AC Type-2"
          }
        />
        <MetricCard label="Hours" value={stop.openingHours ?? "—"} />
        <MetricCard label="Website" value={stop.website ? "Available" : "—"} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Route fit
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{stop.corridorLabel}</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="h-4 w-4 text-sky-300" />
          <span>
            Corridor city:{" "}
            <span className="font-semibold text-white">{stop.corridorCity}</span>
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Review snapshot
        </p>

        {reviewRating !== null || reviewCount !== null ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <Star className="h-4 w-4 text-sky-300" />
              {reviewRating?.toFixed(1) ?? "—"} / 5
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {reviewCount ?? "—"} reviews
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {reviewSource ?? "unknown source"}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Review source not connected yet. Once available, this panel will show live ratings, review counts, and recent check-ins.
          </p>
        )}

        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-sky-300" />
            <span>Last checked</span>
          </div>
          <p className="mt-2 text-white">{lastChecked ?? "Not yet available"}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Station note
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
        {"PlugV Travel is using the shared charging dataset for corridor planning."}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
        <span>PlugV score: {stop.routeScore}</span>
        <span>{stop.city}</span>
      </div>
    </div>
  );
}

export default function TravelPage() {
  const [fromCity, setFromCity] = useState("Hyderabad");
  const [toCity, setToCity] = useState("Bengaluru");
  const [sortBy, setSortBy] = useState<SortMode>("recommended");
  const [fastOnly, setFastOnly] = useState(true);
  const [reliableOnly, setReliableOnly] = useState(true);
  const [selectedStopId, setSelectedStopId] = useState<string | number | null>(null);

  const activeRoute = useMemo(() => getRoutePlan(fromCity, toCity), [fromCity, toCity]);
  const routeSupported = Boolean(
    routePlans[routeKey(fromCity, toCity)] || routePlans[routeKey(toCity, fromCity)]
  );

  const routeStops = useMemo(() => {
    const corridorCities = new Set(activeRoute.corridor.map((point) => point.city));
    const corridorStateCities = new Set(
      activeRoute.corridor.map((point) => `${point.state}__${point.city}`.toLowerCase())
    );

    const mapped = chargingStations
      .filter((station) => {
        const cityMatch = corridorCities.has(station.city);
        const stateCityMatch = corridorStateCities.has(
          `${station.state}__${station.city}`.toLowerCase()
        );
        return cityMatch || stateCityMatch;
      })
      .map((station) => {
        const corridorPoint = activeRoute.corridor.find(
          (point) =>
            point.city.toLowerCase() === station.city.toLowerCase() ||
            `${point.state}__${point.city}`.toLowerCase() ===
              `${station.state}__${station.city}`.toLowerCase()
        );

        const corridorOrder = corridorPoint?.order ?? 999;
        const speedValue = station.charging?.maxPowerKW ?? 0;
        const distanceValue = stationDistanceKm(station, corridorOrder);
        const routeScore = corridorPoint ? scoreStation(station, corridorPoint) : 0;

        return {
          ...station,
          corridorCity: corridorPoint?.city ?? station.city,
          corridorLabel: corridorPoint?.label ?? "Corridor stop",
          corridorOrder,
          routeScore,
          speedValue,
          distanceValue,
        };
      });

    const filtered = mapped.filter((station) => {
      if (fastOnly && !(station.charging?.dcFast || station.speedValue >= 50)) return false;

      if (reliableOnly && station.charging?.reviewRating && station.charging?.reviewRating < 4) return false;

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance-asc":
          return a.distanceValue - b.distanceValue || b.routeScore - a.routeScore;
        case "speed-desc":
          return b.speedValue - a.speedValue || b.routeScore - a.routeScore;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return b.routeScore - a.routeScore || b.speedValue - a.speedValue || a.corridorOrder - b.corridorOrder;
      }
    });

    return filtered;
  }, [activeRoute, fastOnly, reliableOnly, sortBy]);

  const selectedStop =
    routeStops.find((stop) => String(stop.id) === String(selectedStopId)) ?? routeStops[0] ?? null;

  useEffect(() => {
    if (routeStops.length === 0) {
      return;
    }

    const hasSelection = routeStops.some(
      (stop) => String(stop.id) === String(selectedStopId)
    );

    if (!hasSelection) {
      setSelectedStopId(routeStops[0].id);
    }
  }, [routeStops, selectedStopId]);

  const fastStops = routeStops.filter((stop) => stop.charging?.maxPowerKW >= 50).length;
  const dcFastStops = routeStops.filter((stop) => stop.charging?.dcFast).length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10">
  {/* Travel background */}
  <div className="absolute inset-0 -z-30">
    <img
      src="/images/travel/travel-hero.webp"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>

  {/* Dark readability overlay */}
  {/* Light overall tint — keeps the actual photograph visible */}
<div className="absolute inset-0 -z-20 bg-slate-950/15" />

{/* Darken mainly behind the LEFT text */}
<div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.82)_0%,rgba(2,6,23,0.60)_30%,rgba(2,6,23,0.22)_55%,rgba(2,6,23,0.04)_78%,transparent_100%)]" />

{/* Very subtle bottom blend */}
<div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-slate-950/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-100 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          PlugV Travel
        </div>

        <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
          Plan EV road trips with confidence.
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-100/90 drop-shadow-lg sm:text-base">
          Enter a starting point and destination to see the best charging
          stations along the route, ranked by DC fast charging, availability,
          corridor fit, and confidence.
        </p>

        {!routeSupported ? (
          <p className="mt-4 inline-flex rounded-full border border-amber-300/20 bg-slate-950/50 px-4 py-2 text-xs font-semibold text-amber-100 backdrop-blur-md">
            This corridor is still being expanded. Showing the Hyderabad →
            Bengaluru plan as the first wired route.
          </p>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-white/20 bg-slate-950/20 p-1 shadow-2xl shadow-black/20 backdrop-blur-[6px]">
        <TravelRouteMap
          fromCity={fromCity}
          toCity={toCity}
          corridor={activeRoute.corridor}
        />
      </div>
    </div>
  </div>
</section>

      <section className="border-b border-white/10 bg-white/[0.02] py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur lg:p-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
              <label className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  From
                </span>
                <input
                  value={fromCity}
                  onChange={(event) => setFromCity(event.target.value)}
                  placeholder="Hyderabad"
                  list="travel-cities"
                  className="mt-2 w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const currentFrom = fromCity;
                    setFromCity(toCity);
                    setToCity(currentFrom);
                    setSelectedStopId(null);
                  }}
                  className="mt-7 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-300 transition hover:bg-sky-400 hover:text-slate-950"
                  aria-label="Swap from and to cities"
                  title="Swap from and to cities"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </div>

              <label className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  To
                </span>
                <input
                  value={toCity}
                  onChange={(event) => setToCity(event.target.value)}
                  placeholder="Bengaluru"
                  list="travel-cities"
                  className="mt-2 w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <datalist id="travel-cities">
                {allRouteCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setFastOnly((value) => !value)}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition",
                  fastOnly
                    ? "border-sky-400/20 bg-sky-400 text-slate-950"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                ].join(" ")}
              >
                <Zap className="h-4 w-4" />
                DC fast only
              </button>

              <button
                type="button"
                onClick={() => setReliableOnly((value) => !value)}
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition",
                  reliableOnly
                    ? "border-sky-400/20 bg-sky-400 text-slate-950"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                ].join(" ")}
              >
                <ShieldCheck className="h-4 w-4" />
                High confidence
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Search className="h-4 w-4" />
                Auto route search
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <StatCard label="Distance" value={activeRoute.distance} />
              <StatCard label="Drive time" value={activeRoute.duration} />
              <StatCard label="Stops" value={`${activeRoute.stops}`} />
              <StatCard label="Fast stations" value={`${fastStops}/${dcFastStops}`} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                  Route summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {fromCity} → {toCity}
                </h2>
              </div>
              <Route className="h-6 w-6 text-sky-300" />
            </div>

            <div className="mt-5 space-y-3">
              {activeRoute.corridor.map((point) => (
                <div
                  key={`${point.state}-${point.city}-${point.order}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">{point.city}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {point.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{point.state}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Corridor insight
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This page now reads from the shared charging dataset, so corridor files
                will show up here as soon as they are included in `chargingStations`.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col items-end justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Recommended stops
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Best charging stations along your trip.
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-400">
                Showing {routeStops.length} stations across {activeRoute.corridor.length} corridor points.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {(["recommended", "distance-asc", "speed-desc", "name-asc"] as const).map(
                (mode) => {
                  const label =
                    mode === "recommended"
                      ? "Recommended"
                      : mode === "distance-asc"
                        ? "Nearest"
                        : mode === "speed-desc"
                          ? "Fastest DC"
                          : "Name A-Z";

                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSortBy(mode)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        sortBy === mode
                          ? "border-sky-400/20 bg-sky-400 text-slate-950"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {routeStops.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-5">
                {routeStops.map((stop, index) => (
                  <TravelStopCard
                    key={String(stop.id ?? `${stop.name}-${index}`)}
                    stop={stop}
                    index={index}
                    selected={String(stop.id) === String(selectedStopId)}
                    onSelect={() => setSelectedStopId(stop.id)}
                  />
                ))}
              </div>

              <DetailPanel stop={selectedStop} />
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center shadow-2xl shadow-black/20">
              <p className="text-2xl font-semibold text-white">
                No corridor charging stations found.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-400">
                Make sure the corridor files are imported into `data/charging/stations.ts`
                and that the cities match the route corridor.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02] py-14 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <BatteryCharging className="h-5 w-5 text-sky-300" />
              <h3 className="mt-4 text-xl font-semibold text-white">
                Vehicle-aware planning
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The next step is to estimate charging time by EV model and arrival state of charge.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <MapPin className="h-5 w-5 text-sky-300" />
              <h3 className="mt-4 text-xl font-semibold text-white">
                Route corridor filtering
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Stations are scored by corridor fit, not just by city name.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <h3 className="mt-4 text-xl font-semibold text-white">
                Trust and reliability
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Review ratings, counts, and last-checked timestamps show up automatically when the station data includes them.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/charging"
              className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Back to Charging
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}