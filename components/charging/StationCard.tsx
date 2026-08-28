"use client";

import { useState } from "react";
import { ArrowRight, Bookmark, CheckCircle2, MapPin, Phone, Zap } from "lucide-react";
import type { ChargingStation } from "@/data/charging/stations";
import StationTrustRow from "@/components/charging/StationTrustRow";
import ChargerConfidenceBadge from "@/components/charging/ChargerConfidenceBadge";
import { getChargerConfidence } from "@/lib/charging/chargerConfidence";
import { readOwnerSavedItems, toggleTrustedCharger } from "@/lib/owner-saved-items";
type StationCardProps = {
  station: ChargingStation;
  distanceLabel?: string | null;
};

export default function StationCard({
  station,
  distanceLabel,
}: StationCardProps) {
  const hasPower = station.charging.maxPowerKW > 0;
  const confidence = getChargerConfidence(station);
  const [isTrusted, setIsTrusted] = useState(() => typeof window !== "undefined" && readOwnerSavedItems().some((item) => item.type === "Charger" && item.stationId === station.id));

  function toggleSaved(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const connectors = [station.connectors.ccs2 ? "CCS2" : null, station.connectors.chademo ? "CHAdeMO" : null, station.connectors.acType2 ? "Type 2" : null, station.connectors.gbt ? "GB/T" : null].filter(Boolean).join(" · ");
    setIsTrusted(toggleTrustedCharger({
      id: crypto.randomUUID(), type: "Charger", stationId: station.id, trustedByOwner: true,
      title: station.name,
      detail: `${station.operator} · ${station.address} · ${station.charging.maxPowerKW} kW${connectors ? ` · ${connectors}` : ""}`,
      href: station.directionsUrl,
      createdAt: new Date().toISOString(),
    }));
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
        <div className="min-w-0 flex-1">
          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-sky-400/15 bg-sky-400/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-sky-200">
            <Zap className="h-3 w-3 shrink-0" />
            <span className="truncate">{station.operator}</span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-6 tracking-tight text-white">
  {station.name}
</h3>

<div className="mt-2">
  <StationTrustRow trust={station.trust} />
</div>

<div className="mt-2"><ChargerConfidenceBadge confidence={confidence} /></div>

<div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
  <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-300" />

  <span className="truncate">
    {station.city}, {station.state}
  </span>
</div>
        </div>

        <div className="shrink-0 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-right">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Max power
          </p>
          <p className="mt-1 text-base font-semibold text-white">
            {hasPower ? `${station.charging.maxPowerKW} kW` : "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Address
          </p>
          <p className="mt-1.5 line-clamp-2 min-h-[40px] text-xs leading-5 text-slate-300">
            {station.address}
          </p>
        </div>

        {distanceLabel ? (
          <div className="mt-4 rounded-xl border border-sky-400/15 bg-sky-400/10 px-3 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-200/80">
              Distance
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {distanceLabel}
            </p>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2.5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Fast
            </p>
            <p
              className={`mt-1 text-xs font-semibold ${
                station.charging.dcFast ? "text-emerald-300" : "text-slate-300"
              }`}
            >
              {station.charging.dcFast ? "Yes" : "No"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2.5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              CCS2
            </p>
            <p
              className={`mt-1 text-xs font-semibold ${
                station.connectors.ccs2 ? "text-emerald-300" : "text-slate-300"
              }`}
            >
              {station.connectors.ccs2 ? "Yes" : "No"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2.5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              CHAdeMO
            </p>
            <p
              className={`mt-1 text-xs font-semibold ${
                station.connectors.chademo ? "text-emerald-300" : "text-slate-300"
              }`}
            >
              {station.connectors.chademo ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {station.connectors.acType2 ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-300">
              AC Type-2
            </span>
          ) : null}

          {station.charging.dcFast ? (
            <span className="rounded-full border border-sky-400/15 bg-sky-400/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-sky-200">
              DC Fast
            </span>
          ) : null}

          {station.openingHours ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-300">
              {station.openingHours}
            </span>
          ) : null}
        </div>

        {station.amenities?.length > 0 ? (
          <div className="mt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Amenities
            </p>

            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {station.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full border border-white/10 bg-slate-950/50 px-2 py-1 text-[9px] text-slate-400"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto pt-4">
          <div className="border-t border-white/10 pt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Contact
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {station.phone ?? "Contact not available"}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <a
              href={station.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-400 px-3 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Directions
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            {station.phone ? (
              <a
                href={`tel:${station.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="h-3.5 w-3.5" />
                Call
              </a>
            ) : null}
            <button type="button" onClick={toggleSaved} className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${isTrusted ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-white hover:bg-white/10"}`} aria-pressed={isTrusted} aria-label={`${isTrusted ? "Remove" : "Save"} ${station.name} as a trusted charger`}>
              {isTrusted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
              {isTrusted ? "My trusted charger" : "Save charger"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
