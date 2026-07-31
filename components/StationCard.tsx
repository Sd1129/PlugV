"use client";

import type { Station } from "@/data/stations";

const availabilityStyles: Record<Station["availability"], string> = {
  Available: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Busy: "border-amber-200 bg-amber-50 text-amber-700",
  Limited: "border-rose-200 bg-rose-50 text-rose-700",
};

type StationCardProps = {
  station: Station;
  selected?: boolean;
  onSelect?: () => void;
};

export default function StationCard({
  station,
  selected = false,
  onSelect,
}: StationCardProps) {
  return (
    <article
      className={[
        "flex h-full flex-col rounded-[28px] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        selected ? "border-emerald-700 ring-2 ring-emerald-200" : "border-emerald-100",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0f5132]">
            {station.network}
          </div>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{station.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {station.area}, {station.city}
          </p>
        </div>

        <div
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${availabilityStyles[station.availability]}`}
        >
          {station.availability}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <InfoRow label="City" value={station.city} />
        <InfoRow label="Area" value={station.area} />
        <InfoRow label="PIN code" value={station.pinCode} />
        <InfoRow label="Charging speed" value={station.speed} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {station.connectors.map((connector) => (
          <span
            key={connector}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {connector}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        View details
      </button>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}