"use client";

import { Search } from "lucide-react";

export type ChargingSortMode =
  | "recommended"
  | "distance-asc"
  | "power-desc"
  | "name-asc";

export type NearbyLocation = {
  lat: number;
  lng: number;
};

type ChargingControlsProps = {
  states: string[];
  cities: string[];
  selectedState: string;
  selectedCity: string;
  searchQuery: string;
  sortBy: ChargingSortMode;
  fastOnly: boolean;
  ccs2Only: boolean;
  chademoOnly: boolean;
  nearbyMode: boolean;
  userLocation: NearbyLocation | null;
  locationLoading: boolean;
  locationNote: string | null;
  onSearchQueryChange: (value: string) => void;
  onStateChange: (nextState: string) => void;
  onCityChange: (nextCity: string) => void;
  onFastOnlyToggle: () => void;
  onCcs2OnlyToggle: () => void;
  onChademoOnlyToggle: () => void;
  onSortByChange: (value: ChargingSortMode) => void;
  onUseMyLocation: () => void;
  onBackToCitySearch: () => void;
};

export default function ChargingControls({
  states,
  cities,
  selectedState,
  selectedCity,
  searchQuery,
  sortBy,
  fastOnly,
  ccs2Only,
  chademoOnly,
  nearbyMode,
  userLocation,
  locationLoading,
  locationNote,
  onSearchQueryChange,
  onStateChange,
  onCityChange,
  onFastOnlyToggle,
  onCcs2OnlyToggle,
  onChademoOnlyToggle,
  onSortByChange,
  onUseMyLocation,
  onBackToCitySearch,
}: ChargingControlsProps) {
  return (
    <>
      <div className="mt-8 grid gap-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            Search station
          </p>

          <label className="mt-2.5 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3">
            <Search className="h-4 w-4 shrink-0 text-sky-300" />

            <input
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search operator, station, address..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            State
          </p>

          <select
            value={selectedState}
            onChange={(event) => onStateChange(event.target.value)}
            className="mt-2.5 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-sm font-semibold text-white outline-none"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            City
          </p>

          <select
            value={selectedCity}
            onChange={(event) => onCityChange(event.target.value)}
            className="mt-2.5 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-sm font-semibold text-white outline-none"
          >
            <option value="">All cities in {selectedState}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCityChange("")}
          className={[
            "cursor-pointer rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
            !nearbyMode && !selectedCity
              ? "border-sky-400/30 bg-sky-400 text-slate-950"
              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
          ].join(" ")}
        >
          All {selectedState}
        </button>
        {cities.map((city) => {
          const active = !nearbyMode && city === selectedCity;

          return (
            <button
              key={city}
              type="button"
              onClick={() => onCityChange(city)}
              className={[
                "cursor-pointer rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                active
                  ? "border-sky-400/30 bg-sky-400 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
              ].join(" ")}
            >
              {city}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            Filters
          </p>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onFastOnlyToggle}
              className={[
                "cursor-pointer rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition",
                fastOnly
                  ? "border-sky-400/30 bg-sky-400 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
              ].join(" ")}
            >
              Fast only
            </button>

            <button
              type="button"
              onClick={onCcs2OnlyToggle}
              className={[
                "cursor-pointer rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition",
                ccs2Only
                  ? "border-sky-400/30 bg-sky-400 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
              ].join(" ")}
            >
              CCS2
            </button>

            <button
              type="button"
              onClick={onChademoOnlyToggle}
              className={[
                "cursor-pointer rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition",
                chademoOnly
                  ? "border-sky-400/30 bg-sky-400 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
              ].join(" ")}
            >
              CHAdeMO
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:sticky lg:top-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
              Sort by
            </p>

            <button
              type="button"
              onClick={onUseMyLocation}
              disabled={locationLoading}
              className={[
                "cursor-pointer rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition disabled:cursor-wait",
                nearbyMode && userLocation
                  ? "border-sky-400/30 bg-sky-400 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
              ].join(" ")}
            >
              {locationLoading
                ? "Locating..."
                : nearbyMode && userLocation
                  ? "Location active"
                  : "Use my location"}
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(event) =>
              onSortByChange(event.target.value as ChargingSortMode)
            }
            className="mt-2.5 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 text-sm font-semibold text-white outline-none"
          >
            <option value="distance-asc">Nearest</option>
            <option value="recommended">Recommended</option>
            <option value="power-desc">Power — high to low</option>
            <option value="name-asc">Name — A to Z</option>
          </select>

          <p className="mt-2 text-[10px] leading-5 text-slate-500">
            {locationNote ??
              "Nearest uses the selected city until you choose Use my location."}
          </p>

          {nearbyMode ? (
            <button
              type="button"
              onClick={onBackToCitySearch}
              className="mt-3 cursor-pointer text-xs font-semibold text-sky-300 transition hover:text-sky-200"
            >
              Back to city search
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
