"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useState } from "react";
import { vehicleTripProfiles } from "@/data/vehicle-trip-profiles";
import { vehicles } from "@/data/vehicles";

const priorities = ["Daily city driving", "Family & weekends", "Long highway runs", "Performance & design"];

const budgetOptions = [
  { label: "Under 10 lakh", min: 0, max: 10 },
  { label: "10 lakh–15 lakh", min: 10, max: 15 },
  { label: "15 lakh–20 lakh", min: 15, max: 20 },
  { label: "20 lakh–25 lakh", min: 20, max: 25 },
  { label: "25 lakh–30 lakh", min: 25, max: 30 },
  { label: "30 lakh–40 lakh", min: 30, max: 40 },
  { label: "40 lakh–50 lakh", min: 40, max: 50 },
  { label: "Above 50 lakh", min: 50, max: Number.POSITIVE_INFINITY },
] as const;

function highestNumber(value?: string) {
  const numbers = value?.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return numbers.length ? Math.max(...numbers) : 0;
}

function startingPriceLakh(value?: string) {
  const amount = Number(value?.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
  return value && /\b(?:cr|crore)\b/i.test(value) ? amount * 100 : amount;
}

function matchesForProfile(priority: string, budgetLabel: string, dailyDistance: number, homeCharging: string) {
  const budget = budgetOptions.find((option) => option.label === budgetLabel) ?? budgetOptions[3];

  return vehicles
    .filter((vehicle) => {
      const price = startingPriceLakh(vehicle.price);
      const isWithinBudget = !price || (price >= budget.min && price <= budget.max);
      return isWithinBudget && highestNumber(vehicle.range) >= Math.max(180, dailyDistance * 2);
    })
    .map((vehicle) => {
      const range = highestNumber(vehicle.range);
      const profile = vehicleTripProfiles[vehicle.slug];
      let score = range / 25;
      if (priority === "Daily city driving" && ["Hatchback", "Microcar"].includes(vehicle.type)) score += 24;
      if (priority === "Family & weekends" && ["SUV", "MPV"].includes(vehicle.type)) score += 24;
      if (priority === "Long highway runs" && range >= 450) score += 28;
      if (priority === "Performance & design" && ["Roadster", "Luxury Sedan", "SUV Coupe", "Crossover"].includes(vehicle.type)) score += 24;
      if (homeCharging === "No" && profile) score += Math.max(...profile.variants.map((variant) => variant.maxDcChargeKW)) / 8;
      return { vehicle, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ vehicle }) => vehicle);
}

export default function HomeEvMatcher() {
  const [priority, setPriority] = useState(priorities[0]);
  const [budget, setBudget] = useState<string>(budgetOptions[3].label);
  const [dailyDistance, setDailyDistance] = useState(40);
  const [homeCharging, setHomeCharging] = useState("Yes");
  const matchedVehicles = matchesForProfile(priority, budget, dailyDistance, homeCharging);

  return (
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
        <ProfileSelect label="Main priority" value={priority} options={priorities} onChange={setPriority} />
        <ProfileSelect label="Choose Your Budget" value={budget} options={budgetOptions.map((option) => option.label)} onChange={setBudget} />
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
          )) : <p className="text-xs leading-5 text-amber-100 sm:col-span-3">No exact match yet. Increase the budget or reduce the daily travel distance.</p>}
        </div>
      </div>
    </div>
  );
}

function ProfileNumber({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span><input type="number" value={value} min={min} max={max} onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value) || min)))} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm font-semibold text-white outline-none focus:border-sky-300/40" /></label>;
}

function ProfileSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 text-sm font-semibold text-white outline-none focus:border-sky-300/40">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
