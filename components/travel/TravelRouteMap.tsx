"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, LoadScript, type Libraries } from "@react-google-maps/api";
import { MapPin, Route, ShieldAlert } from "lucide-react";

export type TravelMapPlace = { label: string; latitude: number; longitude: number };
export type TravelMapStation = { id: string; name: string; latitude: number; longitude: number; routeProgressKm: number };

type Props = {
  origin: TravelMapPlace | null;
  destination: TravelMapPlace | null;
  geometry: [number, number][];
  primaryStops: TravelMapStation[];
  backupStops: TravelMapStation[];
  knownStops: number;
};

const GOOGLE_MAP_LIBRARIES: Libraries = ["marker"];

function markerElement(label: string, colour: string, title: string) {
  const element = document.createElement("button");
  element.type = "button";
  element.title = title;
  element.setAttribute("aria-label", title);
  element.textContent = label;
  element.style.cssText = `min-width:32px;height:32px;padding:0 8px;border-radius:9999px;border:2px solid white;background:${colour};color:#082f49;font:700 12px system-ui;box-shadow:0 4px 14px rgba(2,6,23,.45)`;
  return element;
}

export default function TravelRouteMap({ origin, destination, geometry, primaryStops, backupStops, knownStops }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoadError, setMapLoadError] = useState(false);
  const overlaysRef = useRef<Array<google.maps.marker.AdvancedMarkerElement | google.maps.Polyline>>([]);
  const routePath = useMemo(() => geometry.map(([longitude, latitude]) => ({ lat: latitude, lng: longitude })), [geometry]);

  useEffect(() => {
    if (!map || !origin || !destination || routePath.length < 2 || !window.google?.maps?.marker) return;

    overlaysRef.current.forEach((overlay) => {
      if (overlay instanceof google.maps.Polyline) overlay.setMap(null);
      else overlay.map = null;
    });

    const routeGlow = new google.maps.Polyline({ map, path: routePath, strokeColor: "#0ea5e9", strokeOpacity: 0.22, strokeWeight: 10 });
    const routeLine = new google.maps.Polyline({ map, path: routePath, strokeColor: "#7dd3fc", strokeOpacity: 1, strokeWeight: 4 });
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    const addMarker = (latitude: number, longitude: number, label: string, colour: string, title: string) => {
      markers.push(new google.maps.marker.AdvancedMarkerElement({ map, position: { lat: latitude, lng: longitude }, title, content: markerElement(label, colour, title) }));
    };

    addMarker(origin.latitude, origin.longitude, "A", "#ffffff", `Start: ${origin.label}`);
    primaryStops.forEach((station, index) => addMarker(station.latitude, station.longitude, String(index + 1), "#38bdf8", `Primary charging stop: ${station.name}`));
    backupStops.forEach((station) => addMarker(station.latitude, station.longitude, "B", "#fbbf24", `Backup charging stop: ${station.name}`));
    addMarker(destination.latitude, destination.longitude, "D", "#86efac", `Destination: ${destination.label}`);

    const bounds = new google.maps.LatLngBounds();
    routePath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 56);
    overlaysRef.current = [routeGlow, routeLine, ...markers];

    return () => {
      routeGlow.setMap(null);
      routeLine.setMap(null);
      markers.forEach((marker) => { marker.map = null; });
      overlaysRef.current = [];
    };
  }, [backupStops, destination, map, origin, primaryStops, routePath]);

  if (!origin || !destination || routePath.length < 2) {
    return <div className="flex h-[280px] flex-col items-center justify-center rounded-[1.75rem] border border-white/15 bg-[#071525]/90 px-6 text-center shadow-2xl shadow-black/30"><MapPin className="h-8 w-8 text-sky-300" /><p className="mt-3 text-sm font-semibold text-white">Plan a route to view the map</p><p className="mt-2 max-w-md text-xs leading-5 text-slate-400">Choose a start and destination to calculate distance, journey time and charging coverage.</p></div>;
  }

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${origin.latitude},${origin.longitude}`)}&destination=${encodeURIComponent(`${destination.latitude},${destination.longitude}`)}&travelmode=driving`;

  if (!apiKey || mapLoadError) {
    return <div className="flex h-[320px] flex-col items-center justify-center rounded-[1.75rem] border border-white/15 bg-[#071525] px-6 text-center shadow-2xl shadow-black/30 sm:h-[390px]">
      <ShieldAlert className="h-8 w-8 text-amber-300" /><p className="mt-3 text-sm font-semibold text-white">Interactive map temporarily unavailable</p><p className="mt-2 max-w-lg text-xs leading-5 text-slate-400">Your route, distance and charging plan remain available. Open Google Maps for navigation while the map connection is restored.</p><a href={navigationUrl} target="_blank" rel="noreferrer" className="mt-4 rounded-full bg-sky-300 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-200">Open navigation</a>
    </div>;
  }

  return <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl shadow-black/30">
    <LoadScript id="plugv-travel-google-maps" googleMapsApiKey={apiKey} libraries={GOOGLE_MAP_LIBRARIES} onError={() => setMapLoadError(true)} loadingElement={<div className="flex h-[320px] items-center justify-center bg-[#071525] text-sm text-slate-400 sm:h-[390px]">Loading route map…</div>}>
      <GoogleMap mapContainerClassName="h-[320px] w-full sm:h-[390px]" center={{ lat: origin.latitude, lng: origin.longitude }} zoom={6} options={{ mapId, mapTypeControl: false, streetViewControl: false, clickableIcons: false, backgroundColor: "#020617" }} onLoad={setMap} onUnmount={() => setMap(null)} />
    </LoadScript>
    <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-100 backdrop-blur"><Route className="h-3.5 w-3.5" />Interactive route · {knownStops} compatible stations</div>
    <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-[10px] text-slate-200 backdrop-blur"><span className="text-sky-300">●</span> Primary &nbsp; <span className="text-amber-300">●</span> Backup</div>
  </div>;
}
