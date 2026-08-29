import Link from "next/link";
import { vehicles } from "@/data/vehicles";

type Mode = "under-15" | "under-10" | "cheapest" | "longest-range";

function startingPriceLakh(price?: string) {
  if (!price) return Number.POSITIVE_INFINITY;
  const amount = Number(price.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0]);
  if (!Number.isFinite(amount)) return Number.POSITIVE_INFINITY;
  return /\bCr\b/i.test(price) ? amount * 100 : amount;
}

function maximumRange(range?: string) {
  return Math.max(0, ...(range?.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? []));
}

export default function VehicleRankingList({ mode }: { mode: Mode }) {
  const ranked = vehicles
    .filter((vehicle) => {
      const price = startingPriceLakh(vehicle.price);
      if (mode === "under-15") return price <= 15;
      if (mode === "under-10") return price <= 10;
      return Number.isFinite(price);
    })
    .sort((a, b) => mode === "longest-range"
      ? maximumRange(b.range) - maximumRange(a.range)
      : startingPriceLakh(a.price) - startingPriceLakh(b.price))
    .slice(0, mode === "cheapest" || mode === "longest-range" ? 10 : 20);

  return (
    <section className="rounded-[2rem] border border-sky-300/20 bg-sky-300/[0.06] p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Live from PlugV catalogue</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Current matching vehicles</h2>
        </div>
        <p className="text-xs text-slate-400">Generated from launched models · verify current variant pricing</p>
      </div>
      <div className="mt-5 divide-y divide-white/10">
        {ranked.length ? ranked.map((vehicle, index) => (
          <Link key={vehicle.slug} href={`/vehicles/${vehicle.slug}`} className="grid gap-2 py-4 transition hover:text-sky-200 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-5">
            <span className="text-sm font-semibold text-slate-500">{index + 1}</span>
            <span className="font-semibold text-white">{vehicle.brand} {vehicle.name}</span>
            <span className="text-sm text-slate-300">{vehicle.price ?? "Price not listed"}</span>
            <span className="text-sm font-semibold text-sky-300">{vehicle.range ?? "Range not listed"}</span>
          </Link>
        )) : <p className="py-6 text-sm text-slate-400">No launched models currently match this filter.</p>}
      </div>
    </section>
  );
}
