"use client";

import { MapPinned, Navigation, Zap } from "lucide-react";
import type { ChargingStation } from "@/data/charging/types";

export default function ChargingMiniMap({
    stations,
    selectedStation,
    onSelectStation,
    city,
    distanceByStationId,
  }: {
    stations: ChargingStation[];
    selectedStation: ChargingStation | null;
    onSelectStation: (station: ChargingStation) => void;
    city: string;
    distanceByStationId: Record<string, string>;
  }) {
  const validStations = stations.filter(
    (station) =>
      Number.isFinite(station.latitude) && Number.isFinite(station.longitude)
  );

  if (validStations.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sm text-slate-500">
        Map coordinates unavailable.
      </div>
    );
  }

  const latitudes = validStations.map((station) => station.latitude);
  const longitudes = validStations.map((station) => station.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latRange = Math.max(maxLat - minLat, 0.01);
  const lngRange = Math.max(maxLng - minLng, 0.01);

  function position(station: ChargingStation) {
    const x = ((station.longitude - minLng) / lngRange) * 76 + 12;
    const y = 88 - ((station.latitude - minLat) / latRange) * 76;

    return {
      left: `${x}%`,
      top: `${y}%`,
    };
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-sky-300" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              Stations map
            </p>
          </div>

          <p className="mt-1 text-sm font-semibold text-white">{city}</p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          {validStations.length} shown
        </div>
      </div>

      <div className="relative h-[360px] overflow-hidden bg-[#07111f]">
        <div className="absolute left-[12%] top-[8%] h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-[8%] right-[5%] h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute left-[-10%] top-[25%] h-px w-[130%] rotate-[8deg] bg-white/[0.06]" />
        <div className="absolute left-[-10%] top-[48%] h-px w-[130%] -rotate-[6deg] bg-white/[0.06]" />
        <div className="absolute left-[-10%] top-[70%] h-px w-[130%] rotate-[3deg] bg-white/[0.06]" />

        <div className="absolute left-[20%] top-[-10%] h-[130%] w-px rotate-[8deg] bg-white/[0.05]" />
        <div className="absolute left-[48%] top-[-10%] h-[130%] w-px -rotate-[12deg] bg-white/[0.05]" />
        <div className="absolute left-[75%] top-[-10%] h-[130%] w-px rotate-[5deg] bg-white/[0.05]" />

        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 backdrop-blur">
          {city} network
        </div>

        {validStations.map((station, index) => {
          const active = selectedStation?.id === station.id;

          return (
            <button
              key={station.id}
              type="button"
              title={station.name}
              onClick={() => onSelectStation(station)}
              style={position(station)}
              className={[
                "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border transition duration-200",
                active
                  ? "h-8 w-8 border-sky-200 bg-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.65)]"
                  : "h-5 w-5 border-sky-300/40 bg-sky-400/80 hover:h-7 hover:w-7 hover:bg-sky-300",
              ].join(" ")}
              aria-label={`Select ${station.name}`}
            >
              <span
                className={[
                  "absolute inset-1 rounded-full",
                  active ? "bg-slate-950" : "bg-slate-950/70",
                ].join(" ")}
              />

              {active ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Zap className="relative z-10 h-3.5 w-3.5 text-sky-300" />
                </span>
              ) : (
                <span className="sr-only">Station {index + 1}</span>
              )}
            </button>
          );
        })}

        {selectedStation ? (
          <div className="absolute inset-x-3 bottom-3 z-20 rounded-xl border border-sky-400/20 bg-slate-950/90 p-3 shadow-xl backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Selected station
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {selectedStation.name}
                </p>
                {distanceByStationId[selectedStation.id] ? (
  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-sky-400/15 bg-sky-400/10 px-2.5 py-1">
    <Navigation className="h-3 w-3 text-sky-300" />

    <span className="text-[10px] font-semibold text-sky-200">
      {distanceByStationId[selectedStation.id]}
    </span>
  </div>
) : null}
                <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">
                  {selectedStation.address}
                </p>
              </div>

              <div className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white">
                {selectedStation.charging.maxPowerKW > 0
                  ? `${selectedStation.charging.maxPowerKW} kW`
                  : "—"}
              </div>
            </div>

            <a
              href={selectedStation.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition hover:text-sky-200"
            >
              <Navigation className="h-3.5 w-3.5" />
              Get directions
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}