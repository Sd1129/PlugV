"use client";

import { useEffect, useMemo, useRef } from "react";
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
  const fallbackMap = useMemo(() => {
    if (geometry.length < 2) return null;
    const longitudes = geometry.map(([longitude]) => longitude);
    const latitudes = geometry.map(([, latitude]) => latitude);
    const minimumLongitude = Math.min(...longitudes);
    const maximumLongitude = Math.max(...longitudes);
    const minimumLatitude = Math.min(...latitudes);
    const maximumLatitude = Math.max(...latitudes);
    const longitudeSpan = Math.max(0.001, maximumLongitude - minimumLongitude);
    const latitudeSpan = Math.max(0.001, maximumLatitude - minimumLatitude);
    const point = (longitude: number, latitude: number) => ({
      x: 24 + ((longitude - minimumLongitude) / longitudeSpan) * 552,
      y: 276 - ((latitude - minimumLatitude) / latitudeSpan) * 252,
    });
    return {
      route: geometry.map(([longitude, latitude]) => point(longitude, latitude)).map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "),
      origin: origin ? point(origin.longitude, origin.latitude) : point(geometry[0][0], geometry[0][1]),
      destination: destination ? point(destination.longitude, destination.latitude) : point(geometry.at(-1)![0], geometry.at(-1)![1]),
      primary: primaryStops.map((station) => ({ ...point(station.longitude, station.latitude), id: station.id })),
      backup: backupStops.map((station) => ({ ...point(station.longitude, station.latitude), id: station.id })),
    };
  }, [backupStops, destination, geometry, origin, primaryStops]);

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

  if (!origin || !destination || geometry.length < 2 || !fallbackMap) {
    return <div className="flex h-[280px] flex-col items-center justify-center rounded-[1.75rem] border border-white/15 bg-[#071525]/90 px-6 text-center shadow-2xl shadow-black/30"><MapPin className="h-8 w-8 text-sky-300" /><p className="mt-3 text-sm font-semibold text-white">Plan a route to view the map</p><p className="mt-2 max-w-md text-xs leading-5 text-slate-400">Choose a start and destination to calculate distance, journey time and charging coverage.</p></div>;
  }

  if (!token) {
    const navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${origin.latitude},${origin.longitude}`)}&destination=${encodeURIComponent(`${destination.latitude},${destination.longitude}`)}&travelmode=driving`;
    return <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#071525] shadow-2xl shadow-black/30">
      <svg viewBox="0 0 600 300" role="img" aria-label="Route overview with primary and backup charging stops" className="h-[320px] w-full sm:h-[390px]">
        <defs><pattern id="route-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e3a4f" strokeWidth="1" /></pattern></defs>
        <rect width="600" height="300" fill="#071525" /><rect width="600" height="300" fill="url(#route-grid)" opacity="0.55" />
        <polyline points={fallbackMap.route} fill="none" stroke="#0ea5e9" strokeWidth="10" opacity="0.18" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={fallbackMap.route} fill="none" stroke="#7dd3fc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {fallbackMap.backup.map((stop) => <circle key={`backup-${stop.id}`} cx={stop.x} cy={stop.y} r="7" fill="#fbbf24" stroke="white" strokeWidth="2" />)}
        {fallbackMap.primary.map((stop) => <circle key={`primary-${stop.id}`} cx={stop.x} cy={stop.y} r="8" fill="#38bdf8" stroke="white" strokeWidth="2" />)}
        <circle cx={fallbackMap.origin.x} cy={fallbackMap.origin.y} r="10" fill="white" stroke="#38bdf8" strokeWidth="3" /><circle cx={fallbackMap.destination.x} cy={fallbackMap.destination.y} r="10" fill="#86efac" stroke="white" strokeWidth="3" />
      </svg>
      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-100 backdrop-blur"><Route className="h-3.5 w-3.5" />Route overview · {knownStops} compatible stations</div>
      <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-[10px] text-slate-200 backdrop-blur"><span className="text-sky-300">●</span> Primary &nbsp; <span className="text-amber-300">●</span> Backup</div>
      <a href={navigationUrl} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 rounded-full bg-sky-300 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-200">Open navigation</a>
    </div>;
  }

  return <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl shadow-black/30"><div ref={containerRef} aria-label="Interactive road route with primary and backup charging stops" className="h-[320px] w-full sm:h-[390px]" /><div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-100 backdrop-blur"><Route className="h-3.5 w-3.5" />Interactive route · {knownStops} compatible stations</div><div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 text-[10px] text-slate-200 backdrop-blur"><span className="text-sky-300">●</span> Primary &nbsp; <span className="text-amber-300">●</span> Backup</div></div>;
}
