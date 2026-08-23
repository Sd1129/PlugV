"use client";

import Link from "next/link";
import { useState } from "react";
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
import { upcomingEVs } from "@/data/upcoming";
import { vehicles } from "@/data/vehicles";
import { vehicleTripProfiles } from "@/data/vehicle-trip-profiles";

const priorities = [
  { label: "Daily city driving", detail: "Efficient, easy, stress-free" },
  { label: "Family & weekends", detail: "Space, comfort, practical range" },
  { label: "Long highway runs", detail: "Range and charging confidence" },
  { label: "Performance & design", detail: "A more emotional EV choice" },
];

function highestNumber(value?: string) {
  const numbers = value?.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return numbers.length ? Math.max(...numbers) : 0;
}

function startingPriceLakh(value?: string) {
  const amount = Number(value?.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
  return value && /\b(?:cr|crore)\b/i.test(value) ? amount * 100 : amount;
}

function matchesForProfile(priority: string, budget: number, bodyType: string, dailyDistance: number, homeCharging: string, highwayUse: string) {
  const candidates = vehicles.filter((vehicle) => {
    const price = startingPriceLakh(vehicle.price);
    if (price && price > budget) return false;
    if (bodyType !== "Any" && !vehicle.type.toLowerCase().includes(bodyType.toLowerCase())) return false;
    return highestNumber(vehicle.range) >= Math.max(180, dailyDistance * 2);
  });
  const ranked = candidates.map((vehicle) => {
    const range = highestNumber(vehicle.range);
    const profile = vehicleTripProfiles[vehicle.slug];
    let score = range / 25;
    if (priority === "Daily city driving" && ["Hatchback", "Microcar"].includes(vehicle.type)) score += 24;
    if (priority === "Family & weekends" && ["SUV", "MPV"].includes(vehicle.type)) score += 24;
    if (priority === "Long highway runs" && range >= 450) score += 28;
    if (priority === "Performance & design" && ["Roadster", "Luxury Sedan", "SUV Coupe", "Crossover"].includes(vehicle.type)) score += 24;
    if (highwayUse === "Often" && range >= 450) score += 18;
    if (homeCharging === "No" && profile) score += Math.max(...profile.variants.map((variant) => variant.maxDcChargeKW)) / 8;
    return { vehicle, score };
  }).sort((a, b) => b.score - a.score).map((item) => item.vehicle);
  return ranked.slice(0, 3);
}

const capabilities = [
  {
    eyebrow: "Choose",
    title: "Find an EV that fits your actual life.",
    description:
      "A guided match built around your city, budget, home-charging setup, daily distance, and travel habits.",
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
  const [priority, setPriority] = useState(priorities[0]);
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState(25);
  const [dailyDistance, setDailyDistance] = useState(40);
  const [homeCharging, setHomeCharging] = useState("Yes");
  const [bodyType, setBodyType] = useState("Any");
  const [highwayUse, setHighwayUse] = useState("Sometimes");
  const matchedVehicles = matchesForProfile(priority.label, budget, bodyType, dailyDistance, homeCharging, highwayUse);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030914] text-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[#061322]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_26%,rgba(56,189,248,0.17),transparent_25%),radial-gradient(circle_at_80%_72%,rgba(14,165,233,0.12),transparent_30%)]" />

        <div className="mx-auto flex min-h-[480px] w-full max-w-7xl items-center px-4 py-12 sm:min-h-[500px] sm:px-6 lg:px-8 lg:py-16">
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

        </div>
      </section>


      <section id="ev-match" className="scroll-mt-24 bg-[#030914] py-20 sm:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">EV Match</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              Start with how you live.
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-slate-400">
              Most platforms begin with filters. PlugV begins with you—then explains
              which EV choices make sense and why.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-white">What matters most to you?</p>
                <p className="mt-1 text-sm text-slate-400">Choose a starting point. We will shape the rest around it.</p>
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">Instant shortlist</span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {priorities.map((option) => {
                const selected = option.label === priority.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setPriority(option)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-sky-300/50 bg-sky-300/10"
                        : "border-white/10 bg-slate-950/40 hover:border-white/25 hover:bg-white/[0.04]"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{option.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{option.detail}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4 sm:grid-cols-2 lg:grid-cols-3">
              <ProfileInput label="City" value={city} placeholder="e.g. Bengaluru" onChange={setCity} />
              <ProfileNumber label="Maximum budget (₹ lakh)" value={budget} min={4} max={300} onChange={setBudget} />
              <ProfileNumber label="Daily travel (km)" value={dailyDistance} min={5} max={500} onChange={setDailyDistance} />
              <ProfileSelect label="Home charging" value={homeCharging} options={["Yes", "No", "Not sure"]} onChange={setHomeCharging} />
              <ProfileSelect label="Body style" value={bodyType} options={["Any", "SUV", "Hatchback", "MPV", "Sedan", "Crossover"]} onChange={setBodyType} />
              <ProfileSelect label="Highway travel" value={highwayUse} options={["Rarely", "Sometimes", "Often"]} onChange={setHighwayUse} />
            </div>

            <div className="mt-6 rounded-2xl border border-sky-300/15 bg-sky-300/[0.06] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">Your starting profile</p>
                <p className="mt-1 text-lg font-semibold text-white">{priority.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Up to ₹{budget} lakh · {dailyDistance} km/day{city.trim() ? ` · ${city.trim()}` : ""} · {homeCharging === "Yes" ? "Home charging" : homeCharging === "No" ? "Public charging" : "Charging undecided"}</p>
                </div>
                <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200 hover:text-white">
                Explore the full catalog
                <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {matchedVehicles.length ? matchedVehicles.map((vehicle) => <Link key={vehicle.slug} href={`/vehicles/${vehicle.slug}`} className="rounded-xl border border-white/10 bg-slate-950/55 p-4 transition hover:border-sky-300/30 hover:bg-slate-950/75"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">{vehicle.brand}</p><p className="mt-1 text-sm font-semibold text-white">{vehicle.name}</p><p className="mt-2 text-xs text-slate-400">{vehicle.range ?? "Range not listed"} · {vehicle.price ?? "Price not listed"}</p></Link>) : <p className="sm:col-span-3 rounded-xl border border-amber-300/15 bg-amber-400/[0.06] p-4 text-sm text-amber-100">No exact match found. Increase the budget or choose Any body style.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Your EV, in context</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Not a marketplace. A better way to move.</h2>
            <p className="mt-5 text-base leading-8 text-slate-400">The tools below work together, so every answer leads naturally to the next useful decision.</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-2">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <Link key={capability.title} href={capability.href} className="group bg-[#050d19] p-7 transition hover:bg-[#081526] sm:p-9">
                  <Icon className="h-6 w-6 text-sky-300" />
                  <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">{capability.eyebrow}</p>
                  <h3 className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-white">{capability.title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">{capability.description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
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

function ProfileInput({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm font-semibold text-white outline-none placeholder:font-normal placeholder:text-slate-600 focus:border-sky-300/40" /></label>;
}

function ProfileNumber({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span><input type="number" value={value} min={min} max={max} onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value) || min)))} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm font-semibold text-white outline-none focus:border-sky-300/40" /></label>;
}

function ProfileSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm font-semibold text-white outline-none focus:border-sky-300/40">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
