import type { ChargingStation } from "@/data/charging/stations";
export default function StationCard({ station }: { station: ChargingStation }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/10 transition hover:border-sky-400/25 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full border border-sky-400/15 bg-sky-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200">
            {station.operator}
          </div>

          <h3 className="mt-3 truncate text-lg font-semibold tracking-tight text-white">
            {station.name}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {station.city}, {station.state}
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Max power
          </p>
          <p className="mt-1 text-xl font-semibold text-white">
            {station.charging.maxPowerKW > 0 ? `${station.charging.maxPowerKW} kW` : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Address
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-200">
          {station.address}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Fast
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {station.charging.dcFast ? "Yes" : "No"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            CCS2
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {station.connectors.ccs2 ? "Yes" : "No"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            CHAdeMO
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {station.connectors.chademo ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          {station.connectors.acType2 ? "AC Type-2" : "AC Type-2 —"}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          {station.openingHours ?? "Hours not listed"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <a
          href={station.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          Directions
        </a>

        {station.phone ? (
          <a
            href={`tel:${station.phone.replace(/\s+/g, "")}`}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Call
          </a>
        ) : null}
      </div>
    </article>
  );
}