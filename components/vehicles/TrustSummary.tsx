import { getVehicleInsights } from "@/lib/insights/vehicleInsights";

type Vehicle = {
  name: string;
  brand: string;
  type: string;
  status: string;
  range?: string;
  charging?: string;
  price?: string;
};

function ScoreRing({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 shadow-inner shadow-black/30">
      <div className="text-center">
        <div className="text-2xl font-black text-white">{pct}</div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
          PlugV Score
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

export default function TrustSummary({ vehicle }: { vehicle: Vehicle }) {
  const insights = getVehicleInsights(vehicle as never);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
            Trust & intelligence
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            PlugV Score and verdict.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            A clearer decision layer that turns raw EV details into a practical
            answer for buyers.
          </p>

          <p className="mt-6 text-base leading-7 text-slate-200">
            {insights.verdict}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              {insights.buyNow ? "Recommended" : "Consider carefully"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Confidence {insights.confidence}%
            </span>
          </div>
        </div>

        <ScoreRing score={insights.score} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricPill label="Best for" value={insights.bestFor.join(" · ") || "—"} />
        <MetricPill
          label="Confidence"
          value={`${insights.confidence}% buying confidence`}
        />
        <MetricPill
          label="Ownership fit"
          value={insights.considerAlternatives ? "Compare alternatives" : "Strong match"}
        />
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
          Ownership snapshot
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {insights.ownership.map((item) => (
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
    </section>
  );
}