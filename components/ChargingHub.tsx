"use client";

import { useMemo, useState } from "react";
import {
  BatteryCharging,
  Filter,
  MapPin,
  PlugZap,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { stations } from "@/data/stations";
import PageContainer from "@/components/ui/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/button";
import StatCard from "@/components/ui/StatCard";

type Station = (typeof stations)[number];

export default function ChargingHub() {
  const cityStats = useMemo(() => {
    const counts = new Map<string, number>();

    stations.forEach((station) => {
      counts.set(station.city, (counts.get(station.city) ?? 0) + 1);
    });

    return [...counts.entries()]
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const topCities = cityStats.slice(0, 6);
  const allConnectors = useMemo(() => {
    const set = new Set<string>();
    stations.forEach((station) => {
      station.connectors?.forEach((connector) => set.add(connector));
    });
    return [...set].sort();
  }, []);

  const [selectedCity, setSelectedCity] = useState<string>(topCities[0]?.city ?? "All cities");
  const [query, setQuery] = useState("");
  const [selectedConnector, setSelectedConnector] = useState<string>("All");
  const [fastOnly, setFastOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredStations = useMemo(() => {
    const q = query.trim().toLowerCase();

    return stations.filter((station) => {
      const cityMatch =
        selectedCity === "All cities" || station.city === selectedCity;

      const queryMatch =
        !q ||
        station.name.toLowerCase().includes(q) ||
        station.city.toLowerCase().includes(q) ||
        station.area.toLowerCase().includes(q) ||
        station.network.toLowerCase().includes(q);

      const connectorMatch =
        selectedConnector === "All" ||
        station.connectors?.includes(selectedConnector);

      const fastMatch =
        !fastOnly ||
        station.speed.toLowerCase().includes("fast") ||
        station.speed.toLowerCase().includes("kw");

      const availabilityMatch =
        !availableOnly || station.availability === "Available";

      return (
        cityMatch &&
        queryMatch &&
        connectorMatch &&
        fastMatch &&
        availabilityMatch
      );
    });
  }, [availableOnly, fastOnly, query, selectedCity, selectedConnector]);

  const selectedStations = useMemo(() => {
    return filteredStations.slice(0, 6);
  }, [filteredStations]);

  const totalStations = stations.length;
  const totalCities = cityStats.length;

  return (
    <section className="border-b border-emerald-200 bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#dfeedd_55%,#d8ead6_100%)]">
      <PageContainer className="py-16">
        <div className="flex flex-col gap-8">
          <SectionTitle
            eyebrow="PlugV Charging Network"
            title="Find charging stations near you"
            subtitle="Browse Indian cities, discover nearby EV charging stations, and filter by connector type, charging speed, and availability."
            action={
              <Button href="/charging" variant="secondary" icon>
                Open full charging page
              </Button>
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Cities covered"
              value={`${totalCities}+`}
              description="Top Indian cities with charging coverage."
              icon={<MapPin className="h-4 w-4" />}
            />
            <StatCard
              label="Charging stations"
              value={`${totalStations}+`}
              description="Premium network overview across cities."
              icon={<BatteryCharging className="h-4 w-4" />}
            />
            <StatCard
              label="Fast charging focus"
              value="PlugV Ready"
              description="Built for practical EV route planning."
              icon={<Zap className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                <Filter className="h-4 w-4" />
                Search and filters
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.75fr_0.75fr]">
                <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Search station, city, or network
                  </div>
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-emerald-700" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search charging stations..."
                      className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>

                <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Connector
                  </div>
                  <select
                    value={selectedConnector}
                    onChange={(e) => setSelectedConnector(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none"
                  >
                    <option value="All">All connectors</option>
                    {allConnectors.map((connector) => (
                      <option key={connector} value={connector}>
                        {connector}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Quick filters
                  </div>
                  <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={fastOnly}
                        onChange={(e) => setFastOnly(e.target.checked)}
                        className="h-4 w-4 accent-emerald-700"
                      />
                      Fast charging only
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={availableOnly}
                        onChange={(e) => setAvailableOnly(e.target.checked)}
                        className="h-4 w-4 accent-emerald-700"
                      />
                      Available now
                    </label>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <CityChip
                  label="All cities"
                  active={selectedCity === "All cities"}
                  onClick={() => setSelectedCity("All cities")}
                />
                {topCities.map((city) => (
                  <CityChip
                    key={city.city}
                    label={`${city.city} (${city.count})`}
                    active={selectedCity === city.city}
                    onClick={() => setSelectedCity(city.city)}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {selectedStations.map((station) => (
                  <StationCard key={station.name} station={station} />
                ))}
              </div>

              {selectedStations.length === 0 && (
                <div className="mt-6 rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center text-slate-600">
                  No stations found. Try a different city or remove one of the filters.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-sm">
                <div className="p-6">
                  <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    India charging map
                  </div>
                  <h3 className="mt-2 text-3xl font-black text-slate-950">
                    City-first route planning
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
                    A premium charging hub designed to help drivers quickly find the
                    right station for their city and route.
                  </p>
                </div>

                <div className="border-t border-emerald-100 bg-[radial-gradient(circle_at_top,#f7fff5_0%,#eef7ec_100%)] p-6">
                  <ChargingMapVisual />
                </div>
              </div>

              <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Why it helps
                </div>
                <div className="mt-4 grid gap-4">
                  <MiniRow
                    icon={<MapPin className="h-4 w-4" />}
                    title="Nearby stations"
                    text="See charging options by city first."
                  />
                  <MiniRow
                    icon={<PlugZap className="h-4 w-4" />}
                    title="Connector filters"
                    text="CCS2, Type 2 and more."
                  />
                  <MiniRow
                    icon={<Zap className="h-4 w-4" />}
                    title="Fast charging"
                    text="Focus on practical charging stops."
                  />
                  <MiniRow
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Premium feel"
                    text="Clean, calm, and easy to scan."
                  />
                </div>
              </div>

              <Button href="/charging" variant="secondary" icon fullWidth>
                Explore the charging network
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function CityChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
  type="button"
  onClick={onClick}
      className={[
        "rounded-full border px-4 py-2 text-sm font-semibold transition",
        active
          ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
          : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50",
      ].join(" ")}
    >
      {label}
    </Button>
  );
}

function StationCard({ station }: { station: Station }) {
  const isAvailable = station.availability === "Available";

  return (
    <article className="flex h-full flex-col rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf7_100%)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {station.network}
          </div>
          <h4 className="mt-2 text-lg font-bold text-slate-950">{station.name}</h4>
          <p className="mt-1 text-sm text-slate-500">
            {station.area}, {station.city}
          </p>
        </div>

        <div
          className={[
            "rounded-full border px-3 py-1 text-xs font-semibold",
            isAvailable
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          {station.availability}
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <DetailRow label="Pin code" value={station.pinCode} />
        <DetailRow label="Speed" value={station.speed} />
        <DetailRow label="Connectors" value={station.connectors.join(", ")} />
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function MiniRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-emerald-700">
        {icon}
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          {title}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ChargingMapVisual() {
  return (
    <svg
      viewBox="0 0 900 560"
      className="h-auto w-full"
      role="img"
      aria-label="PlugV charging map visual"
    >
      <defs>
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9fff8" />
          <stop offset="100%" stopColor="#e2efe0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="900" height="560" rx="28" fill="url(#mapBg)" />
      <path
        d="M118 135C202 88 304 79 394 98C495 118 564 164 651 151C731 139 797 95 835 66"
        fill="none"
        stroke="#15803d"
        strokeOpacity="0.2"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M114 318C203 279 284 272 353 290C438 312 519 348 607 331C703 313 766 270 835 234"
        fill="none"
        stroke="#15803d"
        strokeOpacity="0.16"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M138 450C221 419 304 415 392 433C478 451 560 487 654 475C745 463 798 424 846 398"
        fill="none"
        stroke="#15803d"
        strokeOpacity="0.12"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {[
        [180, 120],
        [260, 170],
        [390, 120],
        [500, 185],
        [640, 135],
        [740, 220],
        [210, 320],
        [360, 300],
        [540, 280],
        [700, 320],
        [260, 440],
        [440, 415],
        [620, 420],
      ].map(([x, y], idx) => (
        <g key={idx}>
          <circle cx={x} cy={y} r="13" fill="#ffffff" stroke="#15803d" strokeWidth="3" />
          <circle cx={x} cy={y} r="26" fill="none" stroke="#15803d" strokeOpacity="0.12" strokeWidth="2" />
        </g>
      ))}

      <rect x="36" y="38" width="260" height="88" rx="22" fill="#ffffff" opacity="0.92" />
      <text x="58" y="73" fill="#0f5132" fontSize="24" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
        PlugV Charging Hub
      </text>
      <text x="58" y="102" fill="#64748b" fontSize="16" fontWeight="500" fontFamily="Inter, Arial, sans-serif">
        Explore city-first charging coverage
      </text>

      <rect x="604" y="42" width="260" height="88" rx="22" fill="#ffffff" opacity="0.92" />
      <text x="626" y="76" fill="#0f5132" fontSize="18" fontWeight="700" fontFamily="Inter, Arial, sans-serif">
        Fast charging
      </text>
      <text x="626" y="103" fill="#64748b" fontSize="16" fontWeight="500" fontFamily="Inter, Arial, sans-serif">
        CCS2 • Type 2 • Available now
      </text>
    </svg>
  );
}
