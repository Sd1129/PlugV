import Link from "next/link";
import { ArrowRight, BatteryCharging, Gauge, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Built for comparison",
    desc: "Every EV card gives buyers the core details they need to make a faster decision.",
    icon: <Gauge className="h-4 w-4" />,
  },
  {
    title: "Built for trust",
    desc: "A calmer and more premium interface makes the platform feel dependable and clear.",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    title: "Built for growth",
    desc: "This page can scale into saved searches, AI recommendations, and lead generation.",
    icon: <BatteryCharging className="h-4 w-4" />,
  },
];

export default function VehicleHighlights() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sky-200">
                {item.icon}
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Discovery principle
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {item.desc}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] border border-sky-400/15 bg-sky-400/10 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                PlugV insight
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                The Explore EVs page should feel like a premium product catalog.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Clean structure, calm presentation, and clear decision support
                help users move from browsing to confidence.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Compare EVs
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Search PlugV
              </Link>
              <Link
                href="/upcoming"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse upcoming EVs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}