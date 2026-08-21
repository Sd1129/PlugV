import { MapPin, Route, Zap } from "lucide-react";

type TravelRouteMapProps = {
  origin: string;
  destination: string;
  isPlanned: boolean;
  knownStops: number;
};

export default function TravelRouteMap({
  origin,
  destination,
  isPlanned,
  knownStops,
}: TravelRouteMapProps) {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#071525] sm:h-[420px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_18%,rgba(56,189,248,0.20),transparent_22%),radial-gradient(circle_at_82%_70%,rgba(37,99,235,0.18),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-200 backdrop-blur">
        <Route className="h-3.5 w-3.5" />
        Live route planning
      </div>

      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 11 68 C 25 25, 42 78, 57 45 S 78 23, 89 43" fill="none" stroke="rgba(14,165,233,0.20)" strokeWidth="3.8" strokeLinecap="round" />
        <path d="M 11 68 C 25 25, 42 78, 57 45 S 78 23, 89 43" fill="none" stroke="rgba(56,189,248,0.85)" strokeWidth="0.8" strokeLinecap="round" strokeDasharray={isPlanned ? "0" : "2 2"} />
      </svg>

      <div className="absolute left-[11%] top-[68%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white text-slate-950"><MapPin className="h-5 w-5" /></div>
        <p className="mt-2 max-w-24 text-center text-xs font-semibold text-white">{origin || "Origin"}</p>
      </div>

      <div className="absolute left-[52%] top-[51%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200/50 bg-emerald-400 text-slate-950"><Zap className="h-4 w-4" /></div>
        <p className="mt-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">PlugV coverage</p>
      </div>

      <div className="absolute left-[89%] top-[43%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-300/60 bg-sky-300 text-slate-950"><MapPin className="h-5 w-5" /></div>
        <p className="mt-2 max-w-24 text-center text-xs font-semibold text-white">{destination || "Destination"}</p>
      </div>

      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/65 px-4 py-3 text-xs text-slate-300 backdrop-blur">
        <span>{isPlanned ? "Driving route calculated" : "Choose two places to plan"}</span>
        <span className="font-semibold text-sky-200">{knownStops} known stations near route</span>
      </div>
    </div>
  );
}
