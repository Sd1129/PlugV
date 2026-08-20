"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { ChargingStation } from "@/data/charging/stations";

type StationResult = {
  station: ChargingStation;
  distanceKm?: number;
};

type ChargingMapboxProps = {
  stations: StationResult[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function ChargingMapbox({
  stations,
  selectedId,
  onSelect,
}: ChargingMapboxProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
      return;
    }

    mapboxgl.accessToken = token;

    const first = stations[0]?.station;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      center: first ? [first.longitude, first.latitude] : [78.9629, 20.5937],
      zoom: first ? 5 : 3,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [stations]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!stations.length) return;

    const bounds = new mapboxgl.LngLatBounds();

    stations.forEach(({ station }) => {
      const active = station.id === selectedId;

      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", station.name);
      el.className = [
        "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold shadow-xl transition",
        active
          ? "border-sky-300 bg-sky-400 text-slate-950 scale-110"
          : "border-white/15 bg-slate-950 text-white hover:border-sky-300/40 hover:bg-slate-900",
      ].join(" ");
      el.textContent = "⚡";
      el.addEventListener("click", () => onSelect(station.id));

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([station.longitude, station.latitude])
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([station.longitude, station.latitude]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 13,
        duration: 900,
      });
    }
  }, [stations, selectedId, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = stations.find((item) => item.station.id === selectedId);
    if (!map || !selected) return;

    map.flyTo({
      center: [selected.station.longitude, selected.station.latitude],
      zoom: 13,
      duration: 800,
    });
  }, [selectedId, stations]);

  return (
    <div
      ref={mapContainerRef}
      className="h-[480px] w-full overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#07111f]"
    />
  );
}