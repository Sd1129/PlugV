"use client";

import Link from "next/link";
import { ArrowRight, BatteryCharging, Gauge, Zap } from "lucide-react";

import { vehicles } from "@/data/vehicles";

type Vehicle = (typeof vehicles)[number];

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-3 last:border-b-0">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

export default function VehicleCard({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const range = vehicle.range ?? "—";
  const charging = vehicle.charging ?? "—";

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-sky-400/25 hover:bg-white/[0.06]">
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_35%),linear-gradient(145deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              {vehicle.brand}
            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              {vehicle.name}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {vehicle.type}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sky-300">
            <BatteryCharging className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Gauge className="h-4 w-4 text-sky-300" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                Range
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-white">
              {range}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Zap className="h-4 w-4 text-sky-300" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                Power / battery
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-white">
              {charging}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-0">
          <Row label="Brand" value={vehicle.brand} />
          <Row label="Type" value={vehicle.type} />
          <Row label="Range" value={range} />
          <Row label="Power / battery" value={charging} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link
            href={`/vehicles/${vehicle.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            View Vehicle
            <ArrowRight className="h-4 w-4" />
          </Link>

          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            PlugV
          </span>
        </div>
      </div>
    </article>
  );
}
