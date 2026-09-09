"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";

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
  searchQuery: string;
  suggestions: string[];
  sortBy: ChargingSortMode;
  fastOnly: boolean;
  ccs2Only: boolean;
  chademoOnly: boolean;
  connector: string;
  operator: string;
  operators: string[];
  powerBand: string;
  liveOnly: boolean;
  reservableOnly: boolean;
  nearbyMode: boolean;
  userLocation: NearbyLocation | null;
  locationLoading: boolean;
  locationNote: string | null;
  onSearchQueryChange: (value: string) => void;
  onSuggestionSelect: (value: string) => void;
  onFastOnlyToggle: () => void;
  onCcs2OnlyToggle: () => void;
  onChademoOnlyToggle: () => void;
  onConnectorChange: (value: string) => void;
  onOperatorChange: (value: string) => void;
  onPowerBandChange: (value: string) => void;
  onLiveOnlyToggle: () => void;
  onReservableOnlyToggle: () => void;
  onSortByChange: (value: ChargingSortMode) => void;
  onUseMyLocation: () => void;
  onBackToCitySearch: () => void;
};

export default function ChargingControls({
  searchQuery,
  suggestions,
  sortBy,
  fastOnly,
  ccs2Only,
  chademoOnly,
  connector,
  operator,
  operators,
  powerBand,
  liveOnly,
  reservableOnly,
  nearbyMode,
  userLocation,
  locationLoading,
  locationNote,
  onSearchQueryChange,
  onSuggestionSelect,
  onFastOnlyToggle,
  onCcs2OnlyToggle,
  onChademoOnlyToggle,
  onConnectorChange,
  onOperatorChange,
  onPowerBandChange,
  onLiveOnlyToggle,
  onReservableOnlyToggle,
  onSortByChange,
  onUseMyLocation,
  onBackToCitySearch,
}: ChargingControlsProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const showSuggestions = searchFocused && searchQuery.trim().length > 0;

  return (
    <>
      <div className="relative z-50 mt-8">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            Search station by city
          </p>

          <label className="mt-2.5 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-3 focus-within:border-sky-400/40">
            <Search className="h-4 w-4 shrink-0 text-sky-300" />

            <input
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
              placeholder="Start typing a city or place name..."
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls="charging-search-suggestions"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>

          {showSuggestions ? (
            <div id="charging-search-suggestions" role="listbox" className="absolute left-4 right-4 top-full z-[60] mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
              {suggestions.length ? suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onSuggestionSelect(suggestion);
                    setSearchFocused(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-sky-300" />
                  <span className="truncate">{suggestion}</span>
                </button>
              )) : (
                <p className="px-3 py-3 text-sm text-slate-500">No matching city or place found.</p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-0 mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
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

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Network</span>
              <select value={operator} onChange={(event) => onOperatorChange(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white outline-none focus:border-sky-400/40">
                <option value="">All networks</option>
                {operators.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>

            <label>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Connector</span>
              <select value={connector} onChange={(event) => onConnectorChange(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white outline-none focus:border-sky-400/40">
                <option value="">All connectors</option>
                <option value="ccs2">CCS2 (4-wheelers)</option>
                <option value="type2">Type 2 AC</option>
                <option value="bharat-ac">Bharat AC-001</option>
                <option value="bharat-dc">Bharat DC-001</option>
                <option value="chademo">CHAdeMO</option>
                <option value="gbt">GB/T</option>
              </select>
            </label>

            <label>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">Power / speed</span>
              <select value={powerBand} onChange={(event) => onPowerBandChange(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white outline-none focus:border-sky-400/40">
                <option value="">Any power</option>
                <option value="0-7.4">Up to 7.4 kW</option>
                <option value="7.4-25">7.4–25 kW</option>
                <option value="25-50">25–50 kW</option>
                <option value="50-100">50–100 kW</option>
                <option value="100-">100+ kW</option>
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onLiveOnlyToggle} aria-pressed={liveOnly} className={`rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${liveOnly ? "border-emerald-300/30 bg-emerald-300 text-slate-950" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
              Live status only
            </button>
            <button type="button" onClick={onReservableOnlyToggle} aria-pressed={reservableOnly} className={`rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${reservableOnly ? "border-violet-300/30 bg-violet-300 text-slate-950" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
              Bookable only
            </button>
          </div>

          <p className="mt-3 text-[10px] leading-5 text-slate-500">Live and bookable filters return results only from timestamped, authorized operator integrations. PlugV never estimates availability or invents slots.</p>
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
