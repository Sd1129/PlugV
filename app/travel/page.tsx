"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BatteryCharging,
  Bookmark,
  CheckCircle2,
  CircleHelp,
  Clock3,
  ExternalLink,
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
import { readOwnerSavedItems, toggleTrustedCharger } from "@/lib/owner-saved-items";

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
  estimated?: boolean;
  routeSource?: "live-routing" | "fallback";
};

type NearbyStation = ChargingStation & {
  distanceToRouteKm: number;
  routeProgressKm: number;
};

type DrivingCondition = "balanced" | "highway" | "demanding";

type SavedTrip = {
  id: string;
  type: "Trip";
  title: string;
  detail: string;
  href: string;
  createdAt: string;
};

const SAVED_ITEMS_KEY = "plugv-owner-saved";
const DEFAULT_TRAVEL_VEHICLE_SLUG = vehicles.some((vehicle) => vehicle.slug === "tata-nexon-ev")
  ? "tata-nexon-ev"
  : vehicles.find((vehicle) => getVehicleTripProfile(vehicle.slug))?.slug ?? vehicles[0]?.slug ?? "";

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

function stationSupportsConnector(station: ChargingStation, connector?: string) {
  if (!connector) return true;
  const normalized = connector.toLowerCase();
  if (normalized.includes("ccs")) return station.connectors.ccs2;
  if (normalized.includes("chademo")) return station.connectors.chademo;
  if (normalized.includes("type 2")) return station.connectors.acType2;
  if (normalized.includes("gb/t") || normalized.includes("gbt")) return Boolean(station.connectors.gbt);
  return true;
}

function getNearbyStations(route: RouteResult | null, connector?: string): NearbyStation[] {
  if (!route?.geometry.length) return [];
  const sampleStep = Math.max(1, Math.floor(route.geometry.length / 120));
  const routeSample = route.geometry.filter((_, index) => index % sampleStep === 0);

  return chargingStations
    .filter((station) => stationSupportsConnector(station, connector))
    .map((station) => {
      const distances = routeSample.map(([longitude, latitude]) =>
        haversineKm(station.latitude, station.longitude, latitude, longitude)
      );
      const nearestIndex = distances.reduce((best, distance, index) => distance < distances[best] ? index : best, 0);
      return {
        ...station,
        distanceToRouteKm: distances[nearestIndex],
        routeProgressKm: Math.round((nearestIndex / Math.max(1, routeSample.length - 1)) * route.distanceKm),
      };
    })
    .filter((station) => station.distanceToRouteKm <= 25)
    .sort(
      (a, b) =>
        a.routeProgressKm - b.routeProgressKm ||
        a.distanceToRouteKm - b.distanceToRouteKm ||
        (b.charging.maxPowerKW ?? 0) - (a.charging.maxPowerKW ?? 0)
    );
}

function pickRecommendedStops(stations: NearbyStation[], count: number, distanceKm: number, firstLegKm: number, rechargeLegKm: number) {
  const selected: NearbyStation[] = [];
  for (let index = 0; index < count; index += 1) {
    const targetKm = Math.min(distanceKm - 20, firstLegKm + index * rechargeLegKm);
    const candidate = stations
      .filter((station) => !selected.some((item) => item.id === station.id))
      .filter((station) => Math.abs(station.routeProgressKm - targetKm) <= Math.max(70, rechargeLegKm * 0.45))
      .sort((a, b) => {
        const aScore = Math.abs(a.routeProgressKm - targetKm) + a.distanceToRouteKm * 4 - Math.min(a.charging.maxPowerKW ?? 0, 180) / 20;
        const bScore = Math.abs(b.routeProgressKm - targetKm) + b.distanceToRouteKm * 4 - Math.min(b.charging.maxPowerKW ?? 0, 180) / 20;
        return aScore - bScore;
      })[0];
    if (candidate) selected.push(candidate);
  }
  return selected.sort((a, b) => a.routeProgressKm - b.routeProgressKm);
}

function getCorridorHighlights(stations: NearbyStation[]) {
  const buckets = new Map<number, NearbyStation>();
  stations.forEach((station) => {
    const bucket = Math.floor(station.routeProgressKm / 35);
    const current = buckets.get(bucket);
    if (!current || station.distanceToRouteKm < current.distanceToRouteKm || (station.distanceToRouteKm === current.distanceToRouteKm && station.charging.maxPowerKW > current.charging.maxPowerKW)) {
      buckets.set(bucket, station);
    }
  });
  return [...buckets.values()].sort((a, b) => a.routeProgressKm - b.routeProgressKm).slice(0, 12);
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
  const [vehicleSlug, setVehicleSlug] = useState(DEFAULT_TRAVEL_VEHICLE_SLUG);
  const [variantName, setVariantName] = useState("");
  const [startingCharge, setStartingCharge] = useState(90);
  const [arrivalReserve, setArrivalReserve] = useState(15);
  const [drivingCondition, setDrivingCondition] = useState<DrivingCondition>("balanced");
  const [energyRate, setEnergyRate] = useState(18);
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const searchTimers = useRef<Record<Field, ReturnType<typeof setTimeout> | null>>({ origin: null, destination: null });
  const searchSequence = useRef<Record<Field, number>>({ origin: 0, destination: 0 });

  const selectedVehicle = vehicles.find((vehicle) => vehicle.slug === vehicleSlug) ?? vehicles[0];
  const tripProfile = getVehicleTripProfile(vehicleSlug);
  const selectedVariant = tripProfile?.variants.find((variant) => variant.name === variantName) ?? tripProfile?.variants.find((variant) => variant.name === tripProfile.defaultVariant);
  const nearbyStations = getNearbyStations(route, selectedVariant?.connector);
  const claimedRangeKm = highestNumber(selectedVehicle?.range);
  const practicalRangeKm = selectedVariant?.practicalRangeKm ?? Math.round(claimedRangeKm * 0.8);
  const conditionFactor = { balanced: 1, highway: 0.88, demanding: 0.78 }[drivingCondition];
  const adjustedPracticalRangeKm = Math.max(1, Math.round(practicalRangeKm * conditionFactor));
  const usableStartRangeKm = Math.max(0, Math.round(adjustedPracticalRangeKm * ((startingCharge - arrivalReserve) / 100)));
  const usableRechargeRangeKm = Math.max(1, Math.round(adjustedPracticalRangeKm * ((80 - arrivalReserve) / 100)));
  const estimatedStops = route ? Math.max(0, Math.ceil(Math.max(0, route.distanceKm - usableStartRangeKm) / usableRechargeRangeKm)) : 0;
  const efficiencyKWhPerKm = selectedVariant ? selectedVariant.batteryCapacityKWh / adjustedPracticalRangeKm : 0.16 / conditionFactor;
  const estimatedEnergyKwh = route ? Math.round(route.distanceKm * efficiencyKWhPerKm) : 0;
  const estimatedEnergyCost = Math.round(estimatedEnergyKwh * energyRate);
  const totalAvailableRangeKm = adjustedPracticalRangeKm * (startingCharge / 100) + estimatedStops * adjustedPracticalRangeKm * 0.65;
  const arrivalCharge = route ? Math.min(80, Math.max(0, Math.round(((totalAvailableRangeKm - route.distanceKm) / adjustedPracticalRangeKm) * 100))) : 0;
  const fastestRouteChargerKw = Math.max(0, ...nearbyStations.map((station) => station.charging.maxPowerKW));
  const effectiveChargePowerKw = Math.max(30, Math.min(selectedVariant?.maxDcChargeKW ?? 60, fastestRouteChargerKw || selectedVariant?.maxDcChargeKW || 60));
  const estimatedChargingMinutes = estimatedStops ? Math.round(selectedVariant ? estimatedStops * selectedVariant.fastChargeMinutes * (selectedVariant.maxDcChargeKW / effectiveChargePowerKw) : (estimatedStops * usableRechargeRangeKm * efficiencyKWhPerKm * 60) / effectiveChargePowerKw) : 0;
  const recommendedStops = route ? pickRecommendedStops(nearbyStations, estimatedStops, route.distanceKm, usableStartRangeKm, usableRechargeRangeKm) : [];
  const corridorHighlights = getCorridorHighlights(nearbyStations);
  const routeConfidence = !route ? "Not calculated" : estimatedStops === 0 ? "High — no public stop required" : recommendedStops.length >= estimatedStops ? "Good — compatible stops identified" : "Limited — add backup planning";
  const googleMapsUrl = origin && destination
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`
    : "";

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("saved") !== "1") return;
      const fromLat = Number(params.get("fromLat")); const fromLng = Number(params.get("fromLng"));
      const toLat = Number(params.get("toLat")); const toLng = Number(params.get("toLng"));
      const fromLabel = params.get("from") ?? "Saved origin"; const toLabel = params.get("to") ?? "Saved destination";
      if (![fromLat, fromLng, toLat, toLng].every(Number.isFinite)) return;
      setOrigin({ id: `saved-origin-${fromLat}-${fromLng}`, label: fromLabel, detail: "Restored from My EV", latitude: fromLat, longitude: fromLng, type: "saved_place" });
      setDestination({ id: `saved-destination-${toLat}-${toLng}`, label: toLabel, detail: "Restored from My EV", latitude: toLat, longitude: toLng, type: "saved_place" });
      setOriginInput(fromLabel); setDestinationInput(toLabel);
      const savedVehicle = params.get("vehicle");
      if (savedVehicle && vehicles.some((vehicle) => vehicle.slug === savedVehicle)) setVehicleSlug(savedVehicle);
      setVariantName(params.get("variant") ?? "");
      setStartingCharge(Math.min(100, Math.max(20, Number(params.get("charge")) || 90)));
      setArrivalReserve(Math.min(30, Math.max(10, Number(params.get("reserve")) || 15)));
      const savedCondition = params.get("condition");
      if (savedCondition === "balanced" || savedCondition === "highway" || savedCondition === "demanding") setDrivingCondition(savedCondition);
      setEnergyRate(Math.min(100, Math.max(1, Number(params.get("rate")) || 18)));
      setIsPlanning(true);
      fetch(`/api/travel?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}`)
        .then(async (response) => { const payload = (await response.json()) as RouteResult & { error?: string }; if (!response.ok || payload.error) throw new Error(payload.error ?? "The saved route could not be calculated."); if (!cancelled) setRoute(payload); })
        .catch((routeError: unknown) => { if (!cancelled) setError(routeError instanceof Error ? routeError.message : "The saved route could not be calculated."); })
        .finally(() => { if (!cancelled) setIsPlanning(false); });
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timeout); };
  }, []);

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

  function saveTrip() {
    if (!route || !origin || !destination || !selectedVehicle) return;
    const params = new URLSearchParams({
      saved: "1",
      from: origin.label,
      fromLat: String(origin.latitude),
      fromLng: String(origin.longitude),
      to: destination.label,
      toLat: String(destination.latitude),
      toLng: String(destination.longitude),
      vehicle: vehicleSlug,
      variant: selectedVariant?.name ?? "",
      charge: String(startingCharge),
      reserve: String(arrivalReserve),
      condition: drivingCondition,
      rate: String(energyRate),
    });
    const href = `/travel?${params.toString()}`;
    const savedTrip: SavedTrip = {
      id: crypto.randomUUID(),
      type: "Trip",
      title: `${origin.label} to ${destination.label}`,
      detail: `${Math.round(route.distanceKm)} km · ${formatDuration(route.durationMinutes)} · ${selectedVehicle.brand} ${selectedVehicle.name}${selectedVariant ? ` · ${selectedVariant.name}` : ""} · ${estimatedStops} charging stop${estimatedStops === 1 ? "" : "s"}`,
      href,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(SAVED_ITEMS_KEY) ?? "[]") as Array<SavedTrip | Record<string, unknown>>;
      const withoutDuplicate = existing.filter((item) => !("href" in item) || item.href !== href);
      localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify([savedTrip, ...withoutDuplicate]));
      setSaveStatus("saved");
    } catch {
      setError("This trip could not be saved in your browser. Check browser storage permissions and try again.");
    }
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
        <Image src="/images/travel/travel-hero-v2.webp" alt="Electric vehicle travelling on an Indian highway at sunrise" fill priority sizes="100vw" className="-z-30 object-cover object-[68%_center] sm:object-center" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,6,23,0.86)_0%,rgba(2,6,23,0.70)_34%,rgba(2,6,23,0.24)_58%,rgba(2,6,23,0.02)_78%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left,rgba(14,165,233,0.12),transparent_38%)]" />
        <div className="mx-auto flex min-h-[620px] w-full max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
          <div className="w-full max-w-[560px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-slate-950/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-100 backdrop-blur-md"><Sparkles className="h-3.5 w-3.5" />PlugV Travel</div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">Plan any EV trip in India.</h1>
            <p className="mt-5 text-base leading-8 text-slate-200">Search for any city, neighbourhood, landmark, or place in India. PlugV calculates the driving route and shows charging coverage from our verified dataset.</p>
            <div className="mt-8"><TravelRouteMap origin={origin?.label ?? originInput} destination={destination?.label ?? destinationInput} isPlanned={Boolean(route)} knownStops={nearbyStations.length} /></div>
          </div>
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

            <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:grid-cols-2 lg:grid-cols-5 sm:p-5">
              <label className="sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Your EV</span>
                <select value={vehicleSlug} onChange={(event) => { const slug = event.target.value; setVehicleSlug(slug); setVariantName(getVehicleTripProfile(slug)?.defaultVariant ?? ""); }} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-white outline-none focus:border-sky-300/50">
                  {vehicles.filter((vehicle) => highestNumber(vehicle.range) > 0).map((vehicle) => <option key={vehicle.slug} value={vehicle.slug}>{vehicle.brand} {vehicle.name}</option>)}
                </select>
              </label>
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Trip conditions</span>
                <select value={drivingCondition} onChange={(event) => setDrivingCondition(event.target.value as DrivingCondition)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-white outline-none focus:border-sky-300/50">
                  <option value="balanced">Balanced driving</option>
                  <option value="highway">Fast highway driving</option>
                  <option value="demanding">Heat, hills or heavy load</option>
                </select>
              </label>
              <label>
                <span className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"><span>Starting battery</span><span className="text-sky-200">{startingCharge}%</span></span>
                <input type="range" min="20" max="100" step="5" value={startingCharge} onChange={(event) => setStartingCharge(Number(event.target.value))} className="mt-4 w-full accent-sky-400" />
              </label>
              <label>
                <span className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"><span>Arrival reserve</span><span className="text-emerald-200">{arrivalReserve}%</span></span>
                <input type="range" min="10" max="30" step="5" value={arrivalReserve} onChange={(event) => setArrivalReserve(Number(event.target.value))} className="mt-4 w-full accent-emerald-400" />
              </label>
              <label>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Public charging rate</span>
                <div className="mt-2 flex h-11 items-center rounded-xl border border-white/10 bg-slate-900 px-3"><span className="text-slate-400">₹</span><input type="number" min="1" max="100" value={energyRate} onChange={(event) => setEnergyRate(Math.max(1, Number(event.target.value) || 1))} className="w-full bg-transparent px-2 text-sm font-semibold text-white outline-none" /><span className="text-xs text-slate-500">/kWh</span></div>
              </label>
              <p className="sm:col-span-2 lg:col-span-5 text-xs leading-5 text-slate-500">PlugV adjusts practical range for your selected conditions and preserves your chosen arrival reserve. Weather, speed, traffic, elevation, payload, tyre pressure and charger power can still change the result.</p>
              {tripProfile && selectedVariant ? <div className="sm:col-span-2 lg:col-span-5 grid gap-3 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.06] p-4 sm:grid-cols-[1fr_auto] sm:items-end"><label><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Verified battery variant</span><select value={selectedVariant.name} onChange={(event) => setVariantName(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-white outline-none">{tripProfile.variants.map((variant) => <option key={variant.name} value={variant.name}>{variant.name} · {variant.certifiedRangeKm} km · {variant.maxDcChargeKW} kW DC</option>)}</select></label><a href={tripProfile.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-200 hover:text-emerald-100">Official source · checked {tripProfile.verifiedAt}</a></div> : <p className="sm:col-span-2 lg:col-span-5 rounded-xl border border-amber-300/15 bg-amber-400/[0.06] px-4 py-3 text-xs leading-5 text-amber-100">Estimated profile: exact battery and charging specifications have not yet been verified for this model.</p>}
            </div>

            {error ? <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{error}</p> : null}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {route && origin && destination ? (
            <>
              {route.estimated ? <div className="mb-5 rounded-2xl border border-amber-300/20 bg-amber-400/[0.08] px-5 py-4"><p className="text-sm font-semibold text-amber-100">Live road routing is temporarily unavailable—showing a planning estimate.</p><p className="mt-1 text-xs leading-5 text-slate-300">Distance and journey time use a road-distance allowance between the selected places. Confirm the exact route in your navigation app before departure.</p></div> : <div className="mb-5 rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.08] px-5 py-4 text-sm font-semibold text-emerald-100">Live road route calculated successfully.</div>}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Driving distance" value={`${route.distanceKm.toLocaleString("en-IN")} km`} icon={Route} />
                <Metric label="Estimated drive time" value={formatDuration(route.durationMinutes)} icon={Clock3} />
                <Metric label="Adjusted practical range" value={`~${adjustedPracticalRangeKm} km`} icon={BatteryCharging} />
                <Metric label="Suggested charging stops" value={`${estimatedStops}`} icon={BatteryCharging} />
                <Metric label="Estimated charging time" value={estimatedStops ? formatDuration(estimatedChargingMinutes) : "No stop needed"} icon={Clock3} />
                <Metric label="Estimated arrival battery" value={`~${arrivalCharge}%`} icon={BatteryCharging} />
                <Metric label="Estimated trip energy" value={`${estimatedEnergyKwh} kWh · ₹${estimatedEnergyCost.toLocaleString("en-IN")}`} icon={Zap} />
                <Metric label="Route confidence" value={routeConfidence} icon={ShieldCheck} compact />
              </div>

              <div className={`mt-5 rounded-2xl border px-5 py-4 ${nearbyStations.length >= estimatedStops ? "border-emerald-300/20 bg-emerald-400/10" : "border-amber-300/20 bg-amber-400/10"}`}>
                <p className="text-sm font-semibold text-white">{selectedVehicle.brand} {selectedVehicle.name}{selectedVariant ? ` · ${selectedVariant.name}` : ""} · {selectedVariant?.connector ?? "connector not verified"}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{nearbyStations.length >= estimatedStops ? `${nearbyStations.length} compatible stations are within 25 km of this corridor. PlugV found ${recommendedStops.length} practical stop candidate${recommendedStops.length === 1 ? "" : "s"} for the estimated ${estimatedStops} stop${estimatedStops === 1 ? "" : "s"}.` : `Only ${nearbyStations.length} compatible stations are close to this corridor. Add operator-app checks and backup stops before departure.`}</p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Suggested stop plan</p><h2 className="mt-2 text-xl font-semibold text-white">Review stops in journey order</h2></div>{googleMapsUrl ? <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold text-white hover:bg-white/5">Open driving route<ExternalLink className="h-3.5 w-3.5" /></a> : null}</div>
                  {estimatedStops === 0 ? <p className="mt-5 rounded-xl border border-emerald-300/15 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-100">No public charging stop is estimated. Keep your arrival reserve and identify one backup charger for unexpected delays.</p> : recommendedStops.length ? <div className="mt-5 space-y-3">{recommendedStops.map((station, index) => <div key={station.id} className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/55 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-300 text-sm font-bold text-slate-950">{index + 1}</span><div><p className="text-sm font-semibold text-white">{station.name}</p><p className="mt-1 text-xs text-slate-400">Around km {station.routeProgressKm} · {station.distanceToRouteKm.toFixed(1)} km detour · {station.charging.maxPowerKW} kW · {station.operator}</p></div><a href={station.directionsUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-200 hover:text-white">Directions</a></div>)}</div> : <p className="mt-5 rounded-xl border border-amber-300/15 bg-amber-400/[0.07] px-4 py-3 text-sm leading-6 text-amber-100">PlugV could not identify enough compatible stop candidates near the ideal charging points. Check the Charging section and operator apps before relying on this trip.</p>}
                  {recommendedStops.length < estimatedStops ? <p className="mt-3 text-xs leading-5 text-amber-200">Coverage warning: {estimatedStops - recommendedStops.length} additional stop{estimatedStops - recommendedStops.length === 1 ? "" : "s"} still {estimatedStops - recommendedStops.length === 1 ? "requires" : "require"} manual confirmation.</p> : null}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Before departure</p><h2 className="mt-2 text-xl font-semibold text-white">Five checks that prevent range anxiety</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{["Confirm every planned charger in its operator app.", "Keep at least one compatible backup charger per stop.", `Leave with at least ${startingCharge}% and protect a ${arrivalReserve}% reserve.`, "Check tyres, weather, road closures and elevation.", "Carry the correct charging apps, payment methods and cable."].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" /><span>{item}</span></li>)}</ul></div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-sky-300/15 bg-sky-400/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-sm font-semibold text-white">Keep this route in My EV</p><p className="mt-1 text-xs leading-5 text-slate-400">Save the places, vehicle, variant, distance, duration and charging-stop estimate in this browser.</p></div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={saveTrip} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sky-300 px-5 text-sm font-semibold text-slate-950 hover:bg-sky-200">{saveStatus === "saved" ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{saveStatus === "saved" ? "Saved to My EV" : "Save trip"}</button>
                  {saveStatus === "saved" ? <Link href="/my-ev#owner-saved" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/5">View saved trips<ArrowRight className="h-4 w-4" /></Link> : null}
                </div>
              </div>

              <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Charging coverage</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Compatible stations near your route.</h2><p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Shown in journey order. Compare route position, detour distance, charging speed, connectors, and live status where an operator feed is available.</p><div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold"><span className="inline-flex items-center gap-2 text-emerald-200"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Green: DC Fast</span><span className="inline-flex items-center gap-2 text-yellow-100"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />Yellow: AC Fast</span></div></div><span className="inline-flex items-center gap-2 text-sm text-slate-400"><Navigation className="h-4 w-4 text-sky-300" />{origin.label} → {destination.label}</span></div>

              {nearbyStations.length ? (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {corridorHighlights.map((station) => <StationCard key={station.id} station={station} />)}
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

function Metric({ label, value, icon: Icon, compact = false }: { label: string; value: string; icon: typeof Route; compact?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><Icon className="h-5 w-5 text-sky-300" /><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p><p className={`mt-2 font-semibold text-white ${compact ? "text-base leading-6" : "text-2xl"}`}>{value}</p></div>;
}

function StationCard({ station }: { station: NearbyStation }) {
  const [isTrusted, setIsTrusted] = useState(() => typeof window !== "undefined" && readOwnerSavedItems().some((item) => item.type === "Charger" && item.stationId === station.id));
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

  function toggleSaved() {
    setIsTrusted(toggleTrustedCharger({
      id: crypto.randomUUID(), type: "Charger", stationId: station.id, trustedByOwner: true,
      title: station.name,
      detail: `${station.operator} · ${station.address} · ${station.charging.maxPowerKW} kW${connectors.length ? ` · ${connectors.join(" · ")}` : ""}`,
      href: station.directionsUrl,
      createdAt: new Date().toISOString(),
    }));
  }

  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">{station.operator}</p><h3 className="mt-2 text-lg font-semibold text-white">{station.name}</h3><p className="mt-1 text-sm text-slate-400">{station.city}, {station.state}</p></div>
        <div className="flex shrink-0 flex-col items-end gap-2"><span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-100">Around km {station.routeProgressKm}</span><span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-200">{station.distanceToRouteKm < 1 ? `${Math.round(station.distanceToRouteKm * 1000)} m` : `${station.distanceToRouteKm.toFixed(1)} km`} detour</span></div>
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
      <button type="button" onClick={toggleSaved} className={`mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition ${isTrusted ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-white hover:bg-white/10"}`} aria-pressed={isTrusted}>
        {isTrusted ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{isTrusted ? "My trusted charger" : "Save charger"}
      </button>
    </article>
  );
}

function TravelBenefit({ icon: Icon, title, description }: { icon: typeof Route; title: string; description: string }) {
  return <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"><Icon className="h-5 w-5 text-sky-300" /><h3 className="mt-4 text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{description}</p></div>;
}
