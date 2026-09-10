"use client";

import { stationStatus } from "@/lib/charging/stationStatus";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, LoadScript, type Libraries } from "@react-google-maps/api";
import { ExternalLink, MapPin, Radio, ShieldAlert, Zap } from "lucide-react";
import type { ChargingStation } from "@/data/charging/stations";

const INDIA_CENTER = { lat: 22.9734, lng: 78.6569 };
const GOOGLE_MAP_LIBRARIES: Libraries = ["marker"];
const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  backgroundColor: "#020617",
};

type Props = {
  stations: ChargingStation[];
  selectedStation: ChargingStation | null;
  onSelectStation: (station: ChargingStation) => void;
  city?: string;
  distanceByStationId: Record<string, string>;
  total: number;
};

function connectorNames(station: ChargingStation) {
  return [
    station.connectors.ccs2 ? "CCS2" : null,
    station.connectors.chademo ? "CHAdeMO" : null,
    station.connectors.acType2 ? "Type 2" : null,
    station.connectors.gbt ? "GB/T" : null,
  ].filter(Boolean) as string[];
}

function liveStatus(station: ChargingStation) {
  const availability = station.availability;
  const isLive = stationStatus(station).live;

  if (!isLive || !availability) {
    return { live: false, label: stationStatus(station).label, colour: "#94a3b8" };
  }

  const colours = {
    available: "#34d399",
    limited: "#fbbf24",
    busy: "#fb923c",
    offline: "#f87171",
    unknown: "#94a3b8",
  };

  return {
    live: true,
    label: availability.status.charAt(0).toUpperCase() + availability.status.slice(1),
    colour: colours[availability.status],
  };
}

export default function ChargingAdvancedMap({
  stations,
  selectedStation,
  onSelectStation,
  city,
  distanceByStationId,
  total,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";
  const [mapLoadError, setMapLoadError] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const validStations = useMemo(
    () => stations.filter((station) => Number.isFinite(station.latitude) && Number.isFinite(station.longitude)),
    [stations]
  );

  useEffect(() => {
    if (!map || !window.google?.maps?.marker) return;

    markersRef.current.forEach((marker) => { marker.map = null; });
    const bounds = new google.maps.LatLngBounds();

    markersRef.current = validStations.map((station) => {
      const status = liveStatus(station);
      const pin = document.createElement("button");
      pin.type = "button";
      pin.title = `${station.name}: ${status.label}`;
      pin.setAttribute("aria-label", `${station.name}, ${station.operator}, ${status.label}`);
      pin.style.cssText = `width:28px;height:28px;border-radius:9999px;border:3px solid #fff;background:${status.colour};box-shadow:0 4px 14px rgba(2,6,23,.5);cursor:pointer;transition:transform .15s ease`;
      pin.addEventListener("mouseenter", () => { pin.style.transform = "scale(1.18)"; });
      pin.addEventListener("mouseleave", () => { pin.style.transform = "scale(1)"; });

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: station.latitude, lng: station.longitude },
        title: station.name,
        content: pin,
      });
      marker.addListener("click", () => onSelectStation(station));
      bounds.extend({ lat: station.latitude, lng: station.longitude });
      return marker;
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, 48);
      google.maps.event.addListenerOnce(map, "idle", () => {
        if ((map.getZoom() ?? 0) > 14) map.setZoom(14);
      });
    }

    return () => {
      markersRef.current.forEach((marker) => { marker.map = null; });
      markersRef.current = [];
    };
  }, [map, onSelectStation, validStations]);

  useEffect(() => {
    if (!map || !selectedStation) return;
    map.panTo({ lat: selectedStation.latitude, lng: selectedStation.longitude });
  }, [map, selectedStation]);

  const selectedStatus = selectedStation ? liveStatus(selectedStation) : null;
  const selectedConnectors = selectedStation ? connectorNames(selectedStation) : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Advanced charger map</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{city ? `${city} charging network` : "Charging stations across India"}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">{validStations.length}{total > validStations.length ? ` of ${total}` : ""} mapped</span>
          <span className="rounded-full border border-slate-400/20 bg-slate-400/10 px-3 py-1.5 text-slate-300">Grey = status unavailable</span>
        </div>
      </div>

      {!apiKey ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
          <MapPin className="h-9 w-9 text-sky-300" />
          <h3 className="mt-4 text-base font-semibold text-white">Map configuration required</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Station results remain available below. Add the restricted Google Maps browser key to enable the coordinate map.</p>
        </div>
      ) : mapLoadError ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
          <ShieldAlert className="h-9 w-9 text-amber-300" />
          <h3 className="mt-4 text-base font-semibold text-white">Map temporarily unavailable</h3>
          <p className="mt-2 text-sm text-slate-400">The station list below is still available. No charger status has been estimated.</p>
        </div>
      ) : (
        <LoadScript
          id="plugv-google-maps"
          googleMapsApiKey={apiKey}
          libraries={GOOGLE_MAP_LIBRARIES}
          loadingElement={<div className="flex min-h-[360px] items-center justify-center text-sm text-slate-400">Loading coordinate map…</div>}
          onError={() => setMapLoadError(true)}
        >
          <GoogleMap
            mapContainerClassName="h-[420px] w-full sm:h-[500px]"
            center={INDIA_CENTER}
            zoom={5}
            options={{ ...MAP_OPTIONS, mapId }}
            onLoad={setMap}
            onUnmount={() => setMap(null)}
          />
        </LoadScript>
      )}

      <div className="border-t border-white/10 bg-slate-950/90 p-4 sm:p-5">
        {selectedStation && selectedStatus ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-semibold text-white">{selectedStation.name}</h3>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${selectedStatus.live ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" : "border-slate-400/20 bg-slate-400/10 text-slate-300"}`}>
                  {selectedStatus.live ? <Radio className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                  {selectedStatus.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{selectedStation.operator} · {selectedStation.city}, {selectedStation.state}{distanceByStationId[selectedStation.id] ? ` · ${distanceByStationId[selectedStation.id]}` : ""}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedConnectors.length ? selectedConnectors.map((connector) => <span key={connector} className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-slate-300">{connector}</span>) : <span className="text-[11px] text-slate-500">Plug type not published</span>}
                {selectedStation.charging.maxPowerKW > 0 ? <span className="inline-flex items-center gap-1 rounded-full bg-sky-400/10 px-2 py-1 text-[10px] text-sky-200"><Zap className="h-3 w-3" />{selectedStation.charging.maxPowerKW} kW</span> : null}
              </div>
              {!selectedStatus.live ? <p className="mt-2 text-[11px] text-amber-200/80">Check the operator app or call the site before travelling. PlugV does not infer availability.</p> : null}
            </div>
            <a href={selectedStation.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-300">Open directions <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Select a marker to inspect its operator, plug types, power and recorded station details.</p>
        )}
      </div>
    </section>
  );
}
