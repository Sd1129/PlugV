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
    <div className="relative h-[250px] overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#071525]/90 shadow-2xl shadow-black/30 backdrop-blur-sm sm:h-[280px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_18%,rgba(56,189,248,0.20),transparent_22%),radial-gradient(circle_at_82%_70%,rgba(37,99,235,0.18),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-200 backdrop-blur">
        <Route className="h-3.5 w-3.5" />
        Journey overview
      </div>

      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 11 68 C 25 25, 42 78, 57 45 S 78 23, 89 43" fill="none" stroke="rgba(14,165,233,0.20)" strokeWidth="3.8" strokeLinecap="round" />
        <path d="M 11 68 C 25 25, 42 78, 57 45 S 78 23, 89 43" fill="none" stroke="rgba(56,189,248,0.85)" strokeWidth="0.8" strokeLinecap="round" strokeDasharray={isPlanned ? "0" : "2 2"} />
      </svg>

      <div className="absolute left-[11%] top-[68%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white text-slate-950"><MapPin className="h-4 w-4" /></div>
        <p className="mt-1.5 max-w-24 text-center text-[10px] font-semibold text-white">{origin || "Origin"}</p>
      </div>

      <div className="absolute left-[52%] top-[51%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200/50 bg-emerald-400 text-slate-950"><Zap className="h-3.5 w-3.5" /></div>
        <p className="mt-1.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-200">PlugV coverage</p>
      </div>

      <div className="absolute left-[89%] top-[43%] -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/60 bg-sky-300 text-slate-950"><MapPin className="h-4 w-4" /></div>
        <p className="mt-1.5 max-w-24 text-center text-[10px] font-semibold text-white">{destination || "Destination"}</p>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/75 px-3 py-2.5 text-[10px] text-slate-300 backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:text-xs">
        <span>{isPlanned ? "Road route and EV estimates ready" : "Choose two places to plan"}</span>
        <span className="font-semibold text-sky-200">{knownStops} compatible stations near route</span>
      </div>
    </div>
  );
}
