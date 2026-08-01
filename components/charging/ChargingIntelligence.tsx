"use client";

import { MapPinned, Zap } from "lucide-react";
import { getChargingInsights, type ChargingStation } from "@/lib/charging/chargingInsights";

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 shadow-inner shadow-black/30">
      <div className="text-center">
        <div className="text-2xl font-black text-white">{score}</div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
          Charging Score
        </div>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function ChargingIntelligence({
  stations,
}: {
  stations: ChargingStation[];
}) {
  const ranked = [...stations]
    .map((station) => ({
      station,
      insights: getChargingInsights(station),
    }))
    .sort((a, b) => b.insights.score - a.insights.score);

  const spotlight = ranked[0];

  if (!spotlight) return null;

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
            Charging intelligence
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            PlugV charging score and route confidence.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            A clearer charging layer that turns raw station data into a practical decision signal for EV users.
          </p>

          <p className="mt-6 text-base leading-7 text-slate-200">
            {spotlight.insights.verdict}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Premium stop
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Confidence {spotlight.insights.confidence}%
            </span>
          </div>
        </div>

        <ScoreRing score={spotlight.insights.score} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricPill
          label="Best for"
          value={spotlight.insights.bestFor.join(" · ") || "—"}
        />
        <MetricPill
          label="Top station"
          value={`${spotlight.station.city} · ${spotlight.station.connector}`}
        />
        <MetricPill
          label="Network fit"
          value={spotlight.station.hours.includes("24/7") ? "Always useful" : "Time-sensitive"}
        />
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
          Ownership snapshot
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {spotlight.insights.ownership.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 text-sky-200/80">
          <Zap className="h-4 w-4" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
            Top recommended stations
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {ranked.slice(0, 3).map(({ station, insights }) => (
            <article
              key={station.name}
              className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{station.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {station.city} · {station.connector} · {station.speed}
                  </p>
                </div>
                <div className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
                  {insights.score}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">{station.note}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {insights.bestFor.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                <MapPinned className="h-4 w-4" />
                <span>{station.distance}</span>
                <span>•</span>
                <span>{station.price}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}