import { stats } from "@/components/home/homeData";

function Tile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
        {label}
      </p>
      <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{hint}</p>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.14),transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_20%,transparent_82%,rgba(255,255,255,0.02))]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
            PlugV Decision Platform
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
            A premium EV decision experience for shoppers who expect more.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            PlugV brings featured EVs, upcoming launches, charging insight, and comparison into one calm, high-trust homepage designed for faster, better decisions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#featured-vehicles"
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Explore EVs
            </a>
            <a
              href="#compare"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              See the comparison
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Premium discovery", "Sharper comparison", "Better EV decisions"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-slate-300"
                >
                  {item}
                </span>
              )
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10 backdrop-blur"
              >
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />

          <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                    Live dashboard
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    EV overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Snapshot of what serious buyers want to know first.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Updated today
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">489 km</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Tile label="Top range" value="Tata Nexon EV" hint="Popular city pick" />
                <Tile label="Fastest charge" value="18 min" hint="Fast charging window" />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Spotlight
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Compare, explore, and browse EV data with confidence.
                    </h3>
                  </div>
                  <div className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
                    PlugV
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    "Compare EVs side by side",
                    "Discover charging stations",
                    "Track upcoming launches",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
