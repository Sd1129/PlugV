import type { ChargerConfidence } from "@/lib/charging/chargerConfidence";

export default function ChargerConfidenceBadge({ confidence, compact = false }: { confidence: ChargerConfidence; compact?: boolean }) {
  const tone = confidence.label === "High" ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200" : confidence.label === "Moderate" ? "border-amber-300/20 bg-amber-400/10 text-amber-100" : "border-slate-300/15 bg-white/[0.06] text-slate-300";
  return (
    <details className={`rounded-xl border ${tone}`}>
      <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
        Confidence {confidence.score}/100 · {confidence.label}
      </summary>
      {!compact ? <div className="border-t border-white/10 px-3 py-2 text-[10px] normal-case tracking-normal text-slate-300">
        {confidence.factors.map((factor) => <div key={factor.label} className="flex justify-between gap-3 py-0.5"><span>{factor.label}</span><span>{factor.points}/{factor.maximum}</span></div>)}
        <p className="mt-2 leading-4 text-slate-500">This is a data-confidence score, not a guarantee that a charger will work on arrival.</p>
      </div> : null}
    </details>
  );
}
