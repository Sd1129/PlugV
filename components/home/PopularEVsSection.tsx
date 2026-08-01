import { ArrowRight } from "lucide-react";
import SectionBlock from "@/components/home/SectionBlock";
import { featuredVehicles } from "@/components/home/homeData";

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function PopularEVsSection() {
  return (
    <SectionBlock
      id="featured-vehicles"
      eyebrow="Most popular EVs"
      title="Most Popular EVs in India."
      subtitle="A curated selection of standout EVs that feel premium, desirable, and worth exploring."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {featuredVehicles.map((vehicle, index) => (
          <article
            key={vehicle.name}
            className="group overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.75)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_100px_-24px_rgba(56,189,248,0.22)]"
          >
            <div
              className={`relative h-[320px] overflow-hidden bg-gradient-to-br ${vehicle.accent}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

              <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                #{index + 1} pick
              </div>

              <div className="absolute inset-x-0 bottom-6 px-6">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                    Spotlight
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    {vehicle.name}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                    {vehicle.tone}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-7">
              <div className="grid grid-cols-3 gap-3">
                <MiniStat label="Range" value={vehicle.range} />
                <MiniStat label="Acceleration" value={vehicle.accel} />
                <MiniStat label="Platform" value={vehicle.platform} />
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                <p className="text-sm text-slate-400">Premium EV profile</p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}