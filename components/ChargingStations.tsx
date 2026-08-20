"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BatteryCharging,
  MapPin,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

import StationCard from "@/components/charging/StationCard";
import {
  chargingStations,
  type ChargingStation,
} from "@/data/charging/stations";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export default function ChargingStations() {
  const states = useMemo(() => {
    return Array.from(
      new Set(chargingStations.map((station) => station.state))
    ).sort();
  }, []);

  const [selectedState, setSelectedState] = useState(
    states[0] ?? ""
  );

  const cities = useMemo(() => {
    return Array.from(
      new Set(
        chargingStations
          .filter(
            (station) =>
              !selectedState ||
              station.state.toLowerCase() ===
                selectedState.toLowerCase()
          )
          .map((station) => station.city)
      )
    ).sort();
  }, [selectedState]);

  const [selectedCity, setSelectedCity] = useState("");
  const [query, setQuery] = useState("");
  const [fastOnly, setFastOnly] = useState(false);

  const activeCity =
    selectedCity && cities.includes(selectedCity)
      ? selectedCity
      : cities[0] ?? "";

  const selectedStations = useMemo<ChargingStation[]>(() => {
    const search = query.trim().toLowerCase();

    return chargingStations.filter((station) => {
      if (
        selectedState &&
        station.state.toLowerCase() !==
          selectedState.toLowerCase()
      ) {
        return false;
      }

      if (
        activeCity &&
        station.city.toLowerCase() !==
          activeCity.toLowerCase()
      ) {
        return false;
      }

      if (fastOnly && !station.charging.dcFast) {
        return false;
      }

      if (search) {
        const searchableText = [
          station.name,
          station.operator,
          station.address,
          station.city,
          station.state,
          station.openingHours ?? "",
          ...(station.amenities ?? []),
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedState,
    activeCity,
    query,
    fastOnly,
  ]);

  const totalFastStations = useMemo(() => {
    return selectedStations.filter(
      (station) => station.charging.dcFast
    ).length;
  }, [selectedStations]);

  const highestPower = useMemo(() => {
    if (selectedStations.length === 0) {
      return 0;
    }

    return Math.max(
      ...selectedStations.map(
        (station) => station.charging.maxPowerKW
      )
    );
  }, [selectedStations]);

  function handleStateChange(value: string) {
    setSelectedState(value);

    const nextCities = Array.from(
      new Set(
        chargingStations
          .filter(
            (station) =>
              station.state.toLowerCase() ===
              value.toLowerCase()
          )
          .map((station) => station.city)
      )
    ).sort();

    setSelectedCity(nextCities[0] ?? "");
  }

  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADING */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200">
              <Sparkles className="h-3.5 w-3.5" />
              Charging network
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Find EV charging stations.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Select a state and city to find charging
              stations, connector support, charging speed,
              and directions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="h-4 w-4 text-sky-300" />

            <span>
              {activeCity || "Select a city"}
              {selectedState
                ? `, ${selectedState}`
                : ""}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[0.8fr_0.8fr_1.4fr_auto]">
            {/* STATE */}
            <label className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                State
              </span>

              <select
                value={selectedState}
                onChange={(event) =>
                  handleStateChange(event.target.value)
                }
                className="mt-2 w-full bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark]"
              >
                {states.map((state) => (
                  <option
                    key={state}
                    value={state}
                    className="bg-slate-950 text-white"
                  >
                    {state}
                  </option>
                ))}
              </select>
            </label>

            {/* CITY */}
            <label className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                City
              </span>

              <select
                value={activeCity}
                onChange={(event) =>
                  setSelectedCity(event.target.value)
                }
                className="mt-2 w-full bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark]"
              >
                {cities.map((city) => (
                  <option
                    key={city}
                    value={city}
                    className="bg-slate-950 text-white"
                  >
                    {city}
                  </option>
                ))}
              </select>
            </label>

            {/* SEARCH */}
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-sky-300" />

              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search station, operator, address..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>

            {/* FAST FILTER */}
            <button
              type="button"
              onClick={() =>
                setFastOnly((current) => !current)
              }
              className={[
                "inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition",
                fastOnly
                  ? "border-sky-400/20 bg-sky-400 text-slate-950"
                  : "border-white/10 bg-slate-950/70 text-white hover:bg-white/10",
              ].join(" ")}
            >
              <Zap className="h-4 w-4" />
              DC fast
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Stations found
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {selectedStations.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-300" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                DC fast
              </p>
            </div>

            <p className="mt-2 text-2xl font-semibold text-white">
              {totalFastStations}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <BatteryCharging className="h-4 w-4 text-sky-300" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Highest power
              </p>
            </div>

            <p className="mt-2 text-2xl font-semibold text-white">
              {highestPower > 0
                ? `${highestPower} kW`
                : "—"}
            </p>
          </div>
        </div>

        {/* STATION CARDS */}
        {selectedStations.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {selectedStations.map((station) => (
              <motion.div
                key={station.id}
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <StationCard station={station} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center">
            <MapPin className="mx-auto h-6 w-6 text-sky-300" />

            <h3 className="mt-4 text-xl font-semibold text-white">
              No charging stations found.
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              Try another city, remove the DC fast filter,
              or search for a different station or operator.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFastOnly(false);
              }}
              className="mt-5 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}