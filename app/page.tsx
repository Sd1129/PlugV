import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarClock,
  Compass,
  MapPinned,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import SiteFooter from "@/components/home/SiteFooter";
import SiteHeader from "@/components/home/SiteHeader";
import HomeEvMatcher from "@/components/home/HomeEvMatcher";
import { upcomingEVs } from "@/data/upcoming";

const capabilities = [
  {
    eyebrow: "Choose",
    title: "Find an EV that fits your actual life.",
    description:
      "A guided match built around your budget, home-charging setup, daily distance, and travel habits.",
    href: "#ev-match",
    icon: Compass,
  },
  {
    eyebrow: "Compare",
    title: "Make a clearer decision, not a longer spreadsheet.",
    description:
      "Compare usable range, charging reality, cabin, safety, and ownership cost in one considered workspace.",
    href: "/compare",
    icon: Scale,
  },
  {
    eyebrow: "Charge",
    title: "Know where charging actually works.",
    description:
      "Find compatible charging, understand availability, and build confidence before a long drive.",
    href: "/charging",
    icon: BatteryCharging,
  },
  {
    eyebrow: "Travel",
    title: "Plan the journey—not just the destination.",
    description:
      "Turn range, charging stops, and route awareness into a calm, reliable EV road trip.",
    href: "/travel",
    icon: Route,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030914] text-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[#061322]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_26%,rgba(56,189,248,0.17),transparent_25%),radial-gradient(circle_at_80%_72%,rgba(14,165,233,0.12),transparent_30%)]" />

        <div className="mx-auto grid min-h-[620px] w-full max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-8 lg:py-16">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
              <Sparkles className="h-3.5 w-3.5" />
              EV intelligence, built for India
            </div>
            <h1 className="mt-7 text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              EVERYTHING EV.
              <span className="block text-sky-300">ONE TRUSTED PLACE.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              PlugV is your companion for choosing, comparing, charging, travelling,
              and living with an electric vehicle. Less noise. Better decisions.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#ev-match"
                className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200"
              >
                Find my EV
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
              >
                Plan an EV trip
                <MapPinned className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <HomeEvMatcher />
          {/*
          <div id="ev-match" className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-[#071321]/90 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">EV Match</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Find the EV that fits your life.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Answer a few practical questions for an instant shortlist.</p>
              </div>
              <Compass className="mt-1 h-6 w-6 shrink-0 text-sky-300" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileSelect label="Main priority" value={priority.label} options={priorities.map((option) => option.label)} onChange={(value) => setPriority(priorities.find((option) => option.label === value) ?? priorities[0])} />
              <ProfileNumber label="Maximum budget (₹ lakh)" value={budget} min={4} max={300} onChange={setBudget} />
              <ProfileNumber label="Daily travel (km)" value={dailyDistance} min={5} max={500} onChange={setDailyDistance} />
              <ProfileSelect label="Home charging" value={homeCharging} options={["Yes", "No", "Not sure"]} onChange={setHomeCharging} />
            </div>

            <div className="mt-5 rounded-2xl border border-sky-300/15 bg-sky-300/[0.06] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">Top matches</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">Based on your budget, use and charging needs.</p>
                </div>
                <Link href="/vehicles" className="shrink-0 text-xs font-semibold text-sky-200 hover:text-white">View all</Link>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {matchedVehicles.length ? matchedVehicles.map((vehicle) => (
                  <Link key={vehicle.slug} href={`/vehicles/${vehicle.slug}`} className="rounded-xl border border-white/10 bg-slate-950/55 p-3 transition hover:border-sky-300/30">
                    <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-sky-300">{vehicle.brand}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-white">{vehicle.name}</p>
                    <p className="mt-1 truncate text-[10px] text-slate-500">{vehicle.range ?? "Range not listed"}</p>
                  </Link>
                )) : <p className="sm:col-span-3 text-xs leading-5 text-amber-100">No exact match yet. Increase the budget or reduce the daily travel distance.</p>}
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Your EV, in context</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Not a marketplace. A better way to move.</h2>
            <p className="mt-5 text-base leading-8 text-slate-400">The tools below work together, so every answer leads naturally to the next useful decision.</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:mt-12 sm:rounded-[2rem]">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <Link key={capability.title} href={capability.href} className="group min-w-0 bg-[#050d19] p-4 transition hover:bg-[#081526] sm:p-7 lg:p-9">
                  <Icon className="h-5 w-5 text-sky-300 sm:h-6 sm:w-6" />
                  <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-300/80 sm:mt-8 sm:text-[11px] sm:tracking-[0.24em]">{capability.eyebrow}</p>
                  <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-white sm:mt-3 sm:text-2xl">{capability.title}</h3>
                  <p className="mt-4 hidden max-w-lg text-sm leading-7 text-slate-400 sm:block">{capability.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white sm:mt-7 sm:gap-2 sm:text-sm">Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 sm:h-4 sm:w-4" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Launch radar</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Know what&apos;s worth waiting for.</h2>
            <p className="mt-5 max-w-md text-base leading-8 text-slate-400">Follow manufacturer targets and official EV concepts with clear sourcing—without confusing speculation with confirmed launches.</p>
            <Link href="/upcoming" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]">
              View upcoming EVs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-white/10 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 sm:px-8">
            {upcomingEVs.map((vehicle) => (
              <Link key={vehicle.slug} href="/upcoming" className="group flex items-center justify-between gap-6 py-6">
                <div>
                  <p className="text-sm font-medium text-slate-400">{vehicle.brand}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-white">{vehicle.name}</p>
                  <p className="mt-2 text-sm text-slate-400">{vehicle.launch} · {vehicle.range}</p>
                </div>
                <CalendarClock className="h-5 w-5 shrink-0 text-sky-300 transition group-hover:scale-110" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#061322] py-20 sm:py-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <ShieldCheck className="h-7 w-7 text-sky-300" />
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">A better EV life, from day one.</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">PlugV stays useful after the decision: charging, travel, ownership, alerts, and what comes next.</p>
          </div>
          <Link href="/vehicles" className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Begin exploring
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
