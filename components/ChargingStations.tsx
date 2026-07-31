"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Zap,
  BatteryCharging,
  PlugZap,
  Gauge,
  Sparkles,
} from "lucide-react";
import { stations } from "@/data/stations";
import StationCard from "@/components/StationCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export default function ChargingStations() {
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
  const [selectedCity, setSelectedCity] = useState(topCities[0]?.city ?? "");

  const selectedStations = useMemo(() => {
    if (!selectedCity) return [];
    return stations.filter((station) => station.city === selectedCity);
  }, [selectedCity]);

  const totalStations = stations.length;
  const totalCities = cityStats.length;

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      className="border-b border-emerald-200 bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#dfeedd_55%,#d8ead6_100%)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Charging Stations
            </div>

            <h2 className="mt-5 text-[1.95rem] font-black leading-[1.05] tracking-[-0.03em] text-emerald-950 md:text-[2.4rem] lg:text-[2.9rem]">
              Top Indian cities with EV charging
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg lg:text-[1.15rem]">
              Choose a city to explore charging stations, connector types, and
              premium route-friendly coverage.
            </p>
          </div>

          <Link
            href="/charging"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition duration-300 hover:bg-emerald-100"
          >
            Open full charging map <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <HeroStat
            icon={<MapPin className="h-4 w-4" />}
            label="Cities covered"
            value={`${totalCities}+`}
          />
          <HeroStat
            icon={<BatteryCharging className="h-4 w-4" />}
            label="Charging stations"
            value={`${totalStations}+`}
          />
          <HeroStat
            icon={<Gauge className="h-4 w-4" />}
            label="Fast charging focus"
            value="Premium"
          />
        </div>

        <motion.div
          variants={stagger}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topCities.map((city) => {
            const active = city.city === selectedCity;

            return (
              <motion.button
                key={city.city}
                type="button"
                onClick={() => setSelectedCity(city.city)}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className={[
                  "rounded-[24px] border p-5 text-left shadow-sm transition",
                  active
                    ? "border-emerald-700 bg-white ring-2 ring-emerald-200"
                    : "border-emerald-100 bg-white/90 hover:shadow-lg",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      City
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-slate-950">
                      {city.city}
                    </h3>
                  </div>

                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {city.count} stations
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  Tap to view stations in this city
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <Zap className="h-4 w-4" />
              Stations in {selectedCity}
            </div>

            <motion.div
              variants={stagger}
              className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {selectedStations.map((station) => (
                <motion.div
                  key={station.name}
                  variants={fadeUp}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                >
                  <StationCard
                    station={station}
                    onSelect={() => {
                      // future: open a drawer or map focus
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {selectedStations.length === 0 && (
              <div className="mt-6 rounded-[28px] border border-dashed border-emerald-200 bg-emerald-50/30 p-8 text-center text-slate-600">
                No stations found for this city.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-sm">
              <div className="p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Network overview
                </div>
                <h3 className="mt-2 text-3xl font-black text-slate-950">
                  Charging made simpler
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
                  PlugV helps drivers quickly find usable charging options with a
                  premium city-first experience.
                </p>
              </div>

              <div className="border-t border-emerald-100 bg-[radial-gradient(circle_at_top,#f7fff5_0%,#eef7ec_100%)] p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <MiniCard
                    icon={<PlugZap className="h-4 w-4" />}
                    title="Connector types"
                    text="CCS2, Type 2, and more."
                  />
                  <MiniCard
                    icon={<BatteryCharging className="h-4 w-4" />}
                    title="Fast charging"
                    text="Focus on practical, usable speeds."
                  />
                  <MiniCard
                    icon={<MapPin className="h-4 w-4" />}
                    title="City coverage"
                    text="Browse by Indian cities only."
                  />
                  <MiniCard
                    icon={<Sparkles className="h-4 w-4" />}
                    title="Premium feel"
                    text="Clean layouts and polished browsing."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Best for your route
              </div>
              <h4 className="mt-2 text-2xl font-black text-slate-950">
                Nearby charging by city
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use the city selector to surface the most relevant charging stations
                and keep the experience focused and useful.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            More charging coverage and route intelligence are on the way.
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
    </div>
  );
}

function MiniCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm">
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