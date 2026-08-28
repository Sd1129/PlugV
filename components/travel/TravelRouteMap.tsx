"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapPin, Route } from "lucide-react";

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

function markerElement(label: string, colour: string) {
  const element = document.createElement("div");
  element.className = "flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-white px-2 text-xs font-bold text-slate-950 shadow-lg";
  element.style.backgroundColor = colour;
  element.textContent = label;
  return element;
}

export default function TravelRouteMap({ origin, destination, geometry, primaryStops, backupStops, knownStops }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token || !origin || !destination || geometry.length < 2) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [origin.longitude, origin.latitude],
      zoom: 5,
      attributionControl: true,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    const markers: mapboxgl.Marker[] = [];
    const addMarker = (longitude: number, latitude: number, label: string, colour: string, title: string) => {
      markers.push(new mapboxgl.Marker({ element: markerElement(label, colour) }).setLngLat([longitude, latitude]).setPopup(new mapboxgl.Popup({ offset: 20 }).setText(title)).addTo(map));
    };

    map.on("load", () => {
      map.addSource("plugv-route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: geometry } } });
      map.addLayer({ id: "plugv-route-glow", type: "line", source: "plugv-route", paint: { "line-color": "#38bdf8", "line-width": 8, "line-opacity": 0.2 } });
      map.addLayer({ id: "plugv-route-line", type: "line", source: "plugv-route", paint: { "line-color": "#7dd3fc", "line-width": 4 } });
      addMarker(origin.longitude, origin.latitude, "A", "#ffffff", origin.label);
      primaryStops.forEach((station, index) => addMarker(station.longitude, station.latitude, String(index + 1), "#38bdf8", `Primary: ${station.name}`));
      backupStops.forEach((station) => addMarker(station.longitude, station.latitude, "B", "#fbbf24", `Backup: ${station.name}`));
      addMarker(destination.longitude, destination.latitude, "D", "#86efac", destination.label);
      const bounds = geometry.reduce((current, coordinate) => current.extend(coordinate), new mapboxgl.LngLatBounds(geometry[0], geometry[0]));
      map.fitBounds(bounds, { padding: 55, maxZoom: 11, duration: 0 });
    });

    return () => { markers.forEach((marker) => marker.remove()); map.remove(); };
  }, [backupStops, destination, geometry, origin, primaryStops, token]);

  if (!token || !origin || !destination || geometry.length < 2) {
    return <div className="flex h-[280px] flex-col items-center justify-center rounded-[1.75rem] border border-white/15 bg-[#071525]/90 px-6 text-center shadow-2xl shadow-black/30"><MapPin className="h-8 w-8 text-sky-300" /><p className="mt-3 text-sm font-semibold text-white">{geometry.length >= 2 ? "Interactive map is unavailable" : "Plan a route to view the map"}</p><p className="mt-2 max-w-md text-xs leading-5 text-slate-400">Route calculations and the charging itinerary remain available. The interactive map requires PlugV&apos;s Mapbox browser token.</p></div>;
  }

  return <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl shadow-black/30"><div ref={containerRef} aria-label="Interactive road route with primary and backup charging stops" className="h-[320px] w-full sm:h-[390px]" /><div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-100 backdrop-blur"><Route className="h-3.5 w-3.5" />Interactive route · {knownStops} compatible stations</div><div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-[10px] text-slate-200 backdrop-blur"><span className="text-sky-300">●</span> Primary &nbsp; <span className="text-amber-300">●</span> Backup</div></div>;
}
