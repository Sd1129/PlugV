"use client";

import Image from "next/image";
import { MapPinned } from "lucide-react";

export default function CityBanner({
  city,
  state,
  total,
  imageSrc,
}: {
  city: string;
  state: string;
  total: number;
  imageSrc: string;
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20">
      <div className="grid md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-7">
          <div className="flex items-center gap-2">
            <MapPinned className="h-3.5 w-3.5 text-sky-300" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
              City directory
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {city}, {state}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {total} station{total === 1 ? "" : "s"} match the current filters.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              EV Charging
            </span>

            <span className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sky-200">
              {total} Stations
            </span>
          </div>
        </div>

        <div className="relative min-h-[180px] md:min-h-[190px]">
          <Image
            src={imageSrc}
            alt={`${city}, ${state}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/10 to-transparent md:from-slate-950/70" />

          <div className="absolute bottom-3 right-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-950/70 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
              <MapPinned className="h-3 w-3 text-sky-300" />
              {city}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}