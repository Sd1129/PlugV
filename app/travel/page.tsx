"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BatteryCharging,
  CircleHelp,
  Clock3,
  MapPin,
  Navigation,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import DataTrustNotice from "@/components/trust/DataTrustNotice";
import TravelRouteMap from "@/components/travel/TravelRouteMap";
import { chargingStations, type ChargingStation } from "@/data/charging/stations";
import { vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";

type Field = "origin" | "destination";

type Place = {
  id: string;
  label: string;
  detail: string;
  latitude: number;
  longitude: number;
  type: string;
};

type RouteResult = {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][];
};

type NearbyStation = ChargingStation & { distanceToRouteKm: number };

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}h ${remainder}m` : `${remainder}m`;
}

function highestNumber(value?: string) {
  const values = value?.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return values.length ? Math.max(...values) : 0;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearbyStations(route: RouteResult | null): NearbyStation[] {
  if (!route?.geometry.length) return [];
  const sampleStep = Math.max(1, Math.floor(route.geometry.length / 120));
  const routeSample = route.geometry.filter((_, index) => index % sampleStep === 0);

  return chargingStations
    .map((station) => ({
      ...station,
      distanceToRouteKm: Math.min(
        ...routeSample.map(([longitude, latitude]) =>
          haversineKm(station.latitude, station.longitude, latitude, longitude)
        )
      ),
    }))
    .filter((station) => station.distanceToRouteKm <= 60)
    .sort(
      (a, b) =>
        a.distanceToRouteKm - b.distanceToRouteKm ||
        (b.charging.maxPowerKW ?? 0) - (a.charging.maxPowerKW ?? 0)
    )
    .slice(0, 6);
}

export default function TravelPage() {
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [origin, setOrigin] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [suggestions, setSuggestions] = useState<Record<Field, Place[]>>({ origin: [], destination: [] });
  const [searching, setSearching] = useState<Record<Field, boolean>>({ origin: false, destination: false });
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [vehicleSlug, setVehicleSlug] = useState(vehicles[0]?.slug ?? "");
  const [variantName, setVariantName] = useState("");
  const [startingCharge, setStartingCharge] = useState(90);
  const [energyRate, setEnergyRate] = useState(18);
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState("");
  const searchTimers = useRef<Record<Field, ReturnType<typeof setTimeout> | null>>({ origin: null, destination: null });
  const searchSequence = useRef<Record<Field, number>>({ origin: 0, destination: 0 });

  const nearbyStations = getNearbyStations(route);
  const selectedVehicle = vehicles.find((vehicle) => vehicle.slug === vehicleSlug) ?? vehicles[0];
  const tripProfile = getVehicleTripProfile(vehicleSlug);
  const selectedVariant = tripProfile?.variants.find((variant) => variant.name === variantName) ?? tripProfile?.variants.find((variant) => variant.name === tripProfile.defaultVariant);
  const claimedRangeKm = highestNumber(selectedVehicle?.range);
  const practicalRangeKm = selectedVariant?.practicalRangeKm ?? Math.round(claimedRangeKm * 0.8);
  const usableStartRangeKm = Math.max(0, Math.round(practicalRangeKm * ((startingCharge - 15) / 100)));
  const usableRechargeRangeKm = Math.max(1, Math.round(practicalRangeKm * 0.65));
  const estimatedStops = route ? Math.max(0, Math.ceil(Math.max(0, route.distanceKm - usableStartRangeKm) / usableRechargeRangeKm)) : 0;
  const efficiencyKWhPerKm = selectedVariant ? selectedVariant.batteryCapacityKWh / selectedVariant.practicalRangeKm : 0.16;
  const estimatedEnergyKwh = route ? Math.round(route.distanceKm * efficiencyKWhPerKm) : 0;
  const estimatedEnergyCost = Math.round(estimatedEnergyKwh * energyRate);
  const totalAvailableRangeKm = usableStartRangeKm + estimatedStops * usableRechargeRangeKm;
  const arrivalCharge = route && practicalRangeKm ? Math.min(80, Math.max(15, Math.round(15 + ((totalAvailableRangeKm - route.distanceKm) / practicalRangeKm) * 100))) : 0;
  const fastestRouteChargerKw = Math.max(0, ...nearbyStations.map((station) => station.charging.maxPowerKW));
  const effectiveChargePowerKw = Math.max(30, Math.min(selectedVariant?.maxDcChargeKW ?? 60, fastestRouteChargerKw || selectedVariant?.maxDcChargeKW || 60));
  const estimatedChargingMinutes = estimatedStops ? Math.round(selectedVariant ? estimatedStops * selectedVariant.fastChargeMinutes * (selectedVariant.maxDcChargeKW / effectiveChargePowerKw) : (estimatedStops * usableRechargeRangeKm * efficiencyKWhPerKm * 60) / effectiveChargePowerKw) : 0;

  function updateInput(field: Field, value: string) {
    if (field === "origin") {
      setOriginInput(value);
      setOrigin(null);
    } else {
      setDestinationInput(value);
      setDestination(null);
    }

    setRoute(null);
    setError("");
    setActiveField(field);

    if (searchTimers.current[field]) clearTimeout(searchTimers.current[field]);
    const sequence = ++searchSequence.current[field];
    if (value.trim().length < 2) {
      setSuggestions((current) => ({ ...current, [field]: [] }));
      setSearching((current) => ({ ...current, [field]: false }));
      return;
    }

    setSearching((current) => ({ ...current, [field]: true }));
    searchTimers.current[field] = setTimeout(async () => {
      try {
        const response = await fetch(`/api/places?q=${encodeURIComponent(value.trim())}`);
        if (!response.ok) throw new Error("Place search failed");
        const payload = (await response.json()) as { places?: Place[] };
        if (sequence !== searchSequence.current[field]) return;
        setSuggestions((current) => ({ ...current, [field]: payload.places ?? [] }));
      } catch {
        if (sequence !== searchSequence.current[field]) return;
        setSuggestions((current) => ({ ...current, [field]: [] }));
      } finally {
        if (sequence === searchSequence.current[field]) setSearching((current) => ({ ...current, [field]: false }));
      }
    }, 250);
  }

  function choosePlace(field: Field, place: Place) {
    if (field === "origin") {
      setOrigin(place);
      setOriginInput(place.label);
    } else {
      setDestination(place);
      setDestinationInput(place.label);
    }
    setSuggestions((current) => ({ ...current, [field]: [] }));
    setActiveField(null);
    setRoute(null);
    setError("");
  }

  async function planRoute() {
    if (!origin || !destination) {
      setError("Choose one place from the suggestions for both your origin and destination.");
      return;
    }

    if (origin.id === destination.id) {
      setError("Choose two different places to plan a trip.");
      return;
    }

    setIsPlanning(true);
    setError("");
    try {
      const response = await fetch(
        `/api/travel?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}`
      );
      const payload = (await response.json()) as RouteResult & { error?: string };
      if (!response.ok || payload.error) throw new Error(payload.error ?? "The route could not be calculated.");
      setRoute(payload);
    } catch (routeError) {
      setRoute(null);
      setError(routeError instanceof Error ? routeError.message : "The route could not be calculated.");
    } finally {
      setIsPlanning(false);
    }
  }

  function swapPlaces() {
    const currentOrigin = origin;
    const currentOriginInput = originInput;
    setOrigin(destination);
    setOriginInput(destinationInput);
    setDestination(currentOrigin);
    setDestinationInput(currentOriginInput);
    setRoute(null);
    setError("");
  }

  const placeInput = (field: Field, label: string, value: string, selected: Place | null) => (
    <div className="relative">
      <label className="block rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 focus-within:border-sky-300/50">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
        <div className="mt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-sky-300" />
          <input
            value={value}
            onChange={(event) => updateInput(field, event.target.value)}
            onFocus={() => setActiveField(field)}
            placeholder={field === "origin" ? "Start typing a city, landmark or place" : "Where are you going?"}
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:font-normal placeholder:text-slate-500"
          />
        </div>
      </label>
      {selected ? <p className="mt-2 truncate text-xs text-emerald-300">Selected: {selected.detail}</p> : null}
      {activeField === field && value.trim().length >= 2 ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
          {searching[field] ? <p className="px-4 py-3 text-xs text-slate-400">Searching Indian cities, chargers and places…</p> : suggestions[field].length ? suggestions[field].map((place) => (
            <button key={place.id} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choosePlace(field, place)} className="block w-full border-b border-white/5 px-4 py-3 text-left last:border-b-0 hover:bg-white/5">
              <p className="text-sm font-semibold text-white">{place.label}</p>
              <p className="mt-1 truncate text-xs text-slate-400">{place.type === "charging_station" ? "Charging station · " : ""}{place.detail}</p>
            </button>
          )) : <p className="px-4 py-3 text-xs text-slate-400">No matching Indian place found. Try a city, landmark or charging-station name.</p>}
        </div>
      ) : null}
    </div>
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />
      <DataTrustNotice message="Routes, journey times, practical range and charging stops are planning estimates. Confirm charger status with the operator before departure." />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image src="/images/travel/travel-hero-v2.webp" alt="Electric vehicle travelling on an Indian highway at sunrise" fill priority sizes="100vw" className="-z-30 object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,6,23,0.78)_0%,rgba(2,6,23,0.58)_40%,rgba(2,6,23,0.20)_72%,rgba(2,6,23,0.08)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left,rgba(14,165,233,0.12),transparent_38%)]" />
        <div className="mx-auto grid min-h-[530px] w-full max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-slate-950/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-100 backdrop-blur-md"><Sparkles className="h-3.5 w-3.5" />PlugV Travel</div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">Plan any EV trip in India.</h1>
            <p className="mt-5 text-base leading-8 text-slate-200">Search for any city, neighbourhood, landmark, or place in India. PlugV calculates the driving route and shows charging coverage from our verified dataset.</p>
          </div>
          <TravelRouteMap origin={origin?.label ?? originInput} destination={destination?.label ?? destinationInput} isPlanned={Boolean(route)} knownStops={nearbyStations.length} />
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.02] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-7">
            <div className="flex flex-col gap-2 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Build your route</p><h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Where are you starting, and where are you going?</h2></div>
              <p className="text-sm text-slate-400">India-wide place search</p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-start">
              {placeInput("origin", "From", originInput, origin)}
              <button type="button" onClick={swapPlaces} className="mx-auto mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-300 transition hover:bg-sky-400 hover:text-slate-950 lg:mt-9" aria-label="Swap origin and destination"><ArrowLeftRight className="h-4 w-4" /></button>
              {placeInput("destination", "To", destinationInput, destination)}
              <button type="button" onClick={planRoute} disabled={isPlanning} className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sky-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60 lg:mt-9"><Search className="h-4 w-4" />{isPlanning ? "Planning…" : "Plan route"}</button>
            </div>

            <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:grid-cols-3 sm:p-5">
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Your EV</span>
                <select value={vehicleSlug} onChange={(event) => { const slug = event.target.value; setVehicleSlug(slug); setVariantName(getVehicleTripProfile(slug)?.defaultVariant ?? ""); }} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-white outline-none focus:border-sky-300/50">
                  {vehicles.filter((vehicle) => highestNumber(vehicle.range) > 0).map((vehicle) => <option key={vehicle.slug} value={vehicle.slug}>{vehicle.brand} {vehicle.name}</option>)}
                </select>
              </label>
              <label>
                <span className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"><span>Starting battery</span><span className="text-sky-200">{startingCharge}%</span></span>
                <input type="range" min="20" max="100" step="5" value={startingCharge} onChange={(event) => setStartingCharge(Number(event.target.value))} className="mt-4 w-full accent-sky-400" />
              </label>
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Public charging rate</span>
                <div className="mt-2 flex h-11 items-center rounded-xl border border-white/10 bg-slate-900 px-3"><span className="text-slate-400">₹</span><input type="number" min="1" max="100" value={energyRate} onChange={(event) => setEnergyRate(Math.max(1, Number(event.target.value) || 1))} className="w-full bg-transparent px-2 text-sm font-semibold text-white outline-none" /><span className="text-xs text-slate-500">/kWh</span></div>
              </label>
              <p className="sm:col-span-3 text-xs leading-5 text-slate-500">Verified models use variant-level battery and charging data; other models use 80% of listed range. Every plan keeps a 15% reserve. Weather, speed, traffic, elevation, payload, and charger power can change results.</p>
              {tripProfile && selectedVariant ? <div className="sm:col-span-3 grid gap-3 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.06] p-4 sm:grid-cols-[1fr_auto] sm:items-end"><label><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Verified battery variant</span><select value={selectedVariant.name} onChange={(event) => setVariantName(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-white outline-none">{tripProfile.variants.map((variant) => <option key={variant.name} value={variant.name}>{variant.name} · {variant.certifiedRangeKm} km · {variant.maxDcChargeKW} kW DC</option>)}</select></label><a href={tripProfile.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-200 hover:text-emerald-100">Official source · checked {tripProfile.verifiedAt}</a></div> : <p className="sm:col-span-3 rounded-xl border border-amber-300/15 bg-amber-400/[0.06] px-4 py-3 text-xs leading-5 text-amber-100">Estimated profile: exact battery and charging specifications have not yet been verified for this model.</p>}
            </div>

            {error ? <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{error}</p> : null}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {route && origin && destination ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Metric label="Driving distance" value={`${route.distanceKm.toLocaleString("en-IN")} km`} icon={Route} />
                <Metric label="Estimated drive time" value={formatDuration(route.durationMinutes)} icon={Clock3} />
                <Metric label="Suggested charging stops" value={`${estimatedStops}`} icon={BatteryCharging} />
                <Metric label="Estimated charging time" value={estimatedStops ? formatDuration(estimatedChargingMinutes) : "No stop needed"} icon={Clock3} />
                <Metric label="Estimated arrival battery" value={`~${arrivalCharge}%`} icon={BatteryCharging} />
                <Metric label="Estimated trip energy" value={`${estimatedEnergyKwh} kWh · ₹${estimatedEnergyCost.toLocaleString("en-IN")}`} icon={Zap} />
              </div>

              <div className={`mt-5 rounded-2xl border px-5 py-4 ${nearbyStations.length >= estimatedStops ? "border-emerald-300/20 bg-emerald-400/10" : "border-amber-300/20 bg-amber-400/10"}`}>
                <p className="text-sm font-semibold text-white">{selectedVehicle.brand} {selectedVehicle.name}{selectedVariant ? ` · ${selectedVariant.name}` : ""} · ~{practicalRangeKm} km practical range</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{nearbyStations.length >= estimatedStops ? `${nearbyStations.length} known stations are near this corridor, enough to review against the estimated ${estimatedStops} stop${estimatedStops === 1 ? "" : "s"}.` : `Only ${nearbyStations.length} known stations are close to this corridor. Review operator coverage before departure.`}</p>
              </div>

              <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Charging coverage</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Known stations near your route.</h2><p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Compare detour distance, charging speed, connectors, and live status where an operator feed is available.</p><div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold"><span className="inline-flex items-center gap-2 text-emerald-200"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Green: DC Fast</span><span className="inline-flex items-center gap-2 text-yellow-100"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />Yellow: AC Fast</span></div></div><span className="inline-flex items-center gap-2 text-sm text-slate-400"><Navigation className="h-4 w-4 text-sky-300" />{origin.label} → {destination.label}</span></div>

              {nearbyStations.length ? (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {nearbyStations.map((station) => <StationCard key={station.id} station={station} />)}
                </div>
              ) : (
                <div className="mt-8 rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center"><p className="text-xl font-semibold text-white">No PlugV stations are mapped close to this route yet.</p><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">Your route still works. PlugV&apos;s verified charging coverage is expanding across India—explore the charging map for the current network.</p><Link href="/charging" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5">Explore charging map<ArrowRight className="h-4 w-4" /></Link></div>
              )}
            </>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-10 text-center"><MapPin className="mx-auto h-7 w-7 text-sky-300" /><p className="mt-4 text-2xl font-semibold text-white">Your trip is ready when you are.</p><p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-400">Type any two places in India above, choose them from the suggestions, and PlugV will calculate the driving route.</p></div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02] py-16"><div className="mx-auto grid w-full max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8"><TravelBenefit icon={BatteryCharging} title="Charging-aware" description="See PlugV&apos;s known charging coverage in the context of your actual trip." /><TravelBenefit icon={ShieldCheck} title="Built for confidence" description="Station distance, power, connector support, and verification are presented clearly." /><TravelBenefit icon={Zap} title="Always improving" description="Every new verified station expands the routes PlugV can support with confidence." /></div></section>
      <SiteFooter />
    </main>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Route }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><Icon className="h-5 w-5 text-sky-300" /><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{value}</p></div>;
}

function StationCard({ station }: { station: NearbyStation }) {
  const connectors = [
    station.connectors.ccs2 ? "CCS2" : null,
    station.connectors.chademo ? "CHAdeMO" : null,
    station.connectors.acType2 ? "Type 2" : null,
    station.connectors.gbt ? "GB/T" : null,
  ].filter(Boolean) as string[];
  const availability = station.availability?.status ?? "unknown";
  const availabilityStyle = {
    available: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
    limited: "border-amber-300/30 bg-amber-400/10 text-amber-100",
    busy: "border-orange-300/30 bg-orange-400/10 text-orange-100",
    offline: "border-rose-300/30 bg-rose-400/10 text-rose-200",
    unknown: "border-white/10 bg-white/5 text-slate-300",
  }[availability];
  const availabilityLabel = {
    available: "Available",
    limited: "Limited",
    busy: "Busy",
    offline: "Offline",
    unknown: "Live status unavailable",
  }[availability];

  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">{station.operator}</p><h3 className="mt-2 text-lg font-semibold text-white">{station.name}</h3><p className="mt-1 text-sm text-slate-400">{station.city}, {station.state}</p></div>
        <span className="shrink-0 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-200">{station.distanceToRouteKm < 1 ? `${Math.round(station.distanceToRouteKm * 1000)} m` : `${station.distanceToRouteKm.toFixed(1)} km`} off route</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Charger types and availability">
        {station.charging.dcFast ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-200"><Zap className="h-3.5 w-3.5" />DC Fast</span> : null}
        {station.charging.ac ? <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300/30 bg-yellow-400/15 px-3 py-1.5 text-xs font-semibold text-yellow-100"><BatteryCharging className="h-3.5 w-3.5" />AC Fast</span> : null}
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${availabilityStyle}`}><CircleHelp className="h-3.5 w-3.5" />{availabilityLabel}</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-950/60 p-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Maximum power</p><p className="mt-1 text-sm font-semibold text-white">{station.charging.maxPowerKW} kW</p></div>
        <div className="rounded-xl bg-slate-950/60 p-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Connectors</p><p className="mt-1 text-sm font-semibold text-white">{connectors.join(" · ") || "Not listed"}</p></div>
      </div>
      {station.availability?.availableConnectors !== undefined ? <p className="mt-4 text-xs text-slate-400"><span className="font-semibold text-white">{station.availability.availableConnectors}</span>{station.availability.totalConnectors ? ` of ${station.availability.totalConnectors}` : ""} connectors available</p> : <p className="mt-4 text-xs leading-5 text-slate-500">Availability requires a live operator feed. Check the operator app before arriving.</p>}
    </article>
  );
}

function TravelBenefit({ icon: Icon, title, description }: { icon: typeof Route; title: string; description: string }) {
  return <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"><Icon className="h-5 w-5 text-sky-300" /><h3 className="mt-4 text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{description}</p></div>;
}
