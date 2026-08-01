import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Gauge,
  MapPinned,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import UniversalSearch from "@/components/ui/UniversalSearch";

const entryPoints = [
  {
    href: "/vehicles",
    label: "Explore EVs",
    desc: "Browse launched EVs with a premium product-style experience.",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    href: "/compare",
    label: "Compare EVs",
    desc: "Use smarter decision support to compare the right models.",
    icon: <Gauge className="h-4 w-4" />,
  },
  {
    href: "/charging",
    label: "Find Charging",
    desc: "Discover charging stations with speed, price, and distance cues.",
    icon: <MapPinned className="h-4 w-4" />,
  },
  {
    href: "/upcoming",
    label: "Upcoming EVs",
    desc: "Track launches and plan your next EV decision earlier.",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    href: "/about",
    label: "About PlugV",
    desc: "Understand the company and the product philosophy behind it.",
    icon: <BatteryCharging className="h-4 w-4" />,
  },
];

const quickSearches = [
  "Tata Nexon EV",
  "Best range EVs",
  "Fast charging stations",
  "Upcoming EV launches",
  "Compare SUVs",
  "PlugV India",
];

export default function SearchPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              Universal Search
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
              Search PlugV in one place.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Find EVs, compare-ready models, charging stations, upcoming launches,
              and company pages from one premium search entry point.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {quickSearches.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Explore EVs
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Compare EVs
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-200/80">
                  <Search className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                    Search first
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Search is designed to feel like the main command center for the
                  platform.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-200/80">
                  <BatteryCharging className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                    Platform-wide
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  One shared index powers EVs, charging, upcoming launches, and
                  company pages.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />

            <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="border-b border-white/10 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                      Search the platform
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      Ask PlugV anything EV-related.
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Search is shared across EVs, upcoming launches, charging,
                      and company pages.
                    </p>
                  </div>

                  <div className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
                    PlugV
                  </div>
                </div>
              </div>

              <div className="p-6">
                <UniversalSearch />
              </div>
            </div>

            <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center gap-2 text-sky-200/80">
                <Sparkles className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Popular paths
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Jump directly into the most common PlugV journeys.
              </p>

              <div className="mt-5 grid gap-3">
                {entryPoints.slice(0, 3).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sky-200">
                        {item.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:text-sky-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
              What you can search
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built for EV discovery, comparison, and action.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Search EV models, charging locations, upcoming launches, and
              company pages without switching context.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {entryPoints.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.07]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sky-200">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {item.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Search principle
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                One search, one standard.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Every search result should feel equally premium whether it is an
                EV, a charging station, or a company page.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Search principle
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                Fast to scan.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Results should be easy to understand immediately, with the
                important signal first.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Search principle
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                Built for repeat use.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The search page should become the place people return to when
                they need EV answers quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}