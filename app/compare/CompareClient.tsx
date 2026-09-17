"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import TrustSummary from "@/components/vehicles/TrustSummary";
import { vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import VehiclePicker from "@/components/compare/VehiclePicker";
import OnRoadBudget from "@/components/compare/OnRoadBudget";
import TariffContext from "@/components/compare/TariffContext";
import { getCompareCharging } from "@/data/compare-specs";
import { getBuyingSpecs, startingPriceRupees } from "@/data/vehicle-buying-specs";

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function CompareClient({ initialVehicle, initialWith }: { initialVehicle: string; initialWith: string }) {
  const launchedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.launched),
    []
  );

  const requestedSlug = initialVehicle;
  const requestedVehicle = launchedVehicles.find((vehicle) => vehicle.slug === requestedSlug);
  const requestedComparisonSlug = initialWith;
  const requestedComparisonVehicle = launchedVehicles.find((vehicle) => vehicle.slug === requestedComparisonSlug);
  const [leftSlug, setLeftSlug] = useState(requestedVehicle?.slug ?? launchedVehicles[0]?.slug ?? "");
  const [rightSlug, setRightSlug] = useState(
    (requestedComparisonVehicle?.slug !== leftSlug ? requestedComparisonVehicle?.slug : undefined) ?? launchedVehicles.find((vehicle) => vehicle.slug !== leftSlug)?.slug ?? ""
  );
  const [annualDistanceKm, setAnnualDistanceKm] = useState(12000);
  const [electricityRate, setElectricityRate] = useState(10);
  const [ownershipYears, setOwnershipYears] = useState(5);

  const leftVehicle = useMemo(
    () =>
      vehicles.find((vehicle) => vehicle.slug === leftSlug) ??
      launchedVehicles[0],
    [leftSlug, launchedVehicles]
  );

  const rightVehicle = useMemo(
    () =>
      vehicles.find((vehicle) => vehicle.slug === rightSlug) ??
      launchedVehicles[1] ??
      launchedVehicles[0],
    [rightSlug, launchedVehicles]
  );


  const leftTripVariant = defaultTripVariant(leftVehicle?.slug);
  const rightTripVariant = defaultTripVariant(rightVehicle?.slug);
  const leftBuyingSpecs = getBuyingSpecs(leftVehicle?.slug ?? "");
  const rightBuyingSpecs = getBuyingSpecs(rightVehicle?.slug ?? "");
  const leftCharging = getCompareCharging(leftVehicle?.slug ?? "");
  const rightCharging = getCompareCharging(rightVehicle?.slug ?? "");
  const leftEfficiency = leftTripVariant ? leftTripVariant.batteryCapacityKWh / leftTripVariant.practicalRangeKm : 0.16;
  const rightEfficiency = rightTripVariant ? rightTripVariant.batteryCapacityKWh / rightTripVariant.practicalRangeKm : 0.16;
  const leftEnergyCost = Math.round(annualDistanceKm * ownershipYears * leftEfficiency * electricityRate);
  const rightEnergyCost = Math.round(annualDistanceKm * ownershipYears * rightEfficiency * electricityRate);
  const specificationRows = [
    { label: "Ex-showroom price range", left: leftVehicle?.price ?? "Price not confirmed", right: rightVehicle?.price ?? "Price not confirmed" },
    { label: "Body type", left: leftVehicle?.type ?? "—", right: rightVehicle?.type ?? "—" },
    { label: "Seating capacity", left: `${leftBuyingSpecs.seats} seats`, right: `${rightBuyingSpecs.seats} seats` },
    { label: "Claimed range (model options)", left: leftVehicle?.range ?? "Range not confirmed", right: rightVehicle?.range ?? "Range not confirmed" },
    { label: "Battery options", left: leftBuyingSpecs.batterySpec?.value ?? "Battery not confirmed", right: rightBuyingSpecs.batterySpec?.value ?? "Battery not confirmed" },
    { label: "Listed variants", left: `${leftBuyingSpecs.variants.length} listed`, right: `${rightBuyingSpecs.variants.length} listed` },
    { label: "DC charging power", left: leftCharging.dcPower, right: rightCharging.dcPower },
    { label: "AC charging power", left: leftCharging.acPower, right: rightCharging.acPower },
    { label: "Connector", left: leftCharging.connector, right: rightCharging.connector },
    { label: "DC charging time", left: leftCharging.dcTime, right: rightCharging.dcTime },
    { label: "AC charging time", left: leftCharging.acTime, right: rightCharging.acTime },
  ];
  const leftPrice = startingPriceRupees(leftVehicle?.price);
  const rightPrice = startingPriceRupees(rightVehicle?.price);
  const priceGap = Math.abs(leftPrice - rightPrice);
  const headline = !leftPrice || !rightPrice ? "Price comparison needs confirmed prices" : priceGap === 0 ? "Same starting ex-showroom price" : `${leftPrice < rightPrice ? leftVehicle?.name : rightVehicle?.name} starts ₹${priceGap.toLocaleString("en-IN")} lower`;

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-950 text-white">
      <SiteHeader />
      {/* HERO */}
<section className="relative isolate overflow-hidden border-b border-white/10 bg-slate-950">
  <Image src="/images/plugv-owned/plugv-compare-hero-2026-08.webp" alt="PlugV illustration of two electric SUVs positioned side by side for comparison" fill priority sizes="100vw" className="-z-30 object-contain object-top sm:object-cover sm:object-center" />
  <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(2,6,23,0.12)_0%,rgba(2,6,23,0.88)_34%,rgba(2,6,23,0.98)_58%)] sm:bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.84)_38%,rgba(2,6,23,0.32)_68%,rgba(2,6,23,0.16)_100%)]" />
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_left,rgba(56,189,248,0.16),transparent_38%)]" />

  <div className="mx-auto flex min-h-[260px] w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
        Compare EVs
      </div>

      <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
        Compare EVs the premium way.
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        PlugV turns comparison into a calm decision experience so shoppers
        can evaluate range, charging, and value without noise.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/vehicles"
          className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          Explore EVs
        </Link>

        <Link
          href="/search"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Search PlugV
        </Link>
      </div>


    </div>
  </div>
</section>

{/* COMPARISON SETUP */}
<section className="border-y border-white/10 bg-white/[0.02] py-8 sm:py-10">
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
          Comparison setup
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Choose two EVs to compare
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Search a model or brand. Price groups use starting ex-showroom prices.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        
        <VehiclePicker label="Left pick" vehicles={launchedVehicles} value={leftSlug} excluded={rightSlug} onChange={setLeftSlug} />
        <div aria-hidden="true" className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-xs font-bold text-sky-300">VS</div>
        <VehiclePicker label="Right pick" vehicles={launchedVehicles} value={rightSlug} excluded={leftSlug} onChange={setRightSlug} />
      </div>


    </div>
  </div>
</section>

      <aside aria-label="Comparison headline" className="sticky top-36 z-40 border-y border-sky-400/20 bg-slate-950/95 px-4 py-3 shadow-lg backdrop-blur lg:top-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div><p className="text-xs text-slate-300">{leftVehicle?.name} vs {rightVehicle?.name} · ex-showroom</p><p className="mt-1 text-sm font-semibold text-sky-200 sm:text-base">{headline}</p></div>
          <nav aria-label="Comparison sections" className="flex gap-4 text-sm font-semibold text-sky-300"><a href="#on-road" className="py-2 underline">On-road</a><a href="#specifications" className="py-2 underline">Specs</a><a href="#energy" className="py-2 underline">Running cost</a></nav>
        </div>
      </aside>

      <section id="on-road" className="mx-auto max-w-7xl scroll-mt-72 px-4 py-7 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Your starting on-road estimate</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Estimates are prefilled. Choose a state scenario, then adjust only what differs in your quote.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <OnRoadBudget key={`left-${leftSlug}`} name={`${leftVehicle?.brand} ${leftVehicle?.name}`} cataloguePrice={leftVehicle?.price} />
          <OnRoadBudget key={`right-${rightSlug}`} name={`${rightVehicle?.brand} ${rightVehicle?.name}`} cataloguePrice={rightVehicle?.price} />
        </div>
      </section>

      <section id="specifications" className="scroll-mt-72 py-7 sm:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Key specifications</p><h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Every important difference, side by side.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Model options, not one exact trim. Starting prices may apply to a different battery version than the charging figures.</p></div><span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold text-sky-200">{specificationRows.filter((row) => differentValues(row.left, row.right)).length} differences found</span></div>
            <details className="mt-4 text-sm leading-6 text-slate-300"><summary className="min-h-11 cursor-pointer py-2 font-semibold text-sky-300">Sources, battery versions and verification dates</summary><div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[{ vehicle: leftVehicle, charging: leftCharging, specs: leftBuyingSpecs }, { vehicle: rightVehicle, charging: rightCharging, specs: rightBuyingSpecs }].map(({ vehicle, charging, specs }) => <div key={vehicle?.slug} className="rounded-xl border border-white/15 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                <p className="font-semibold text-white">{vehicle?.name}</p><p>{charging.scope}</p>
                {charging.sourceUrl ? <p><a href={charging.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">Charging source</a> · checked {charging.checkedAt}</p> : <p>Charging evidence is incomplete.</p>}
                {charging.acSourceUrl && charging.acSourceUrl !== charging.sourceUrl ? <p><a href={charging.acSourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">Supporting specification source</a> · checked {charging.acCheckedAt}</p> : null}
                {specs.batterySpec ? <p><a href={specs.batterySpec.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">Battery source</a> · checked {specs.batterySpec.checkedAt}. {specs.batterySpec.scope}</p> : null}
              </div>)}
            </div><p className="mt-3">Unknown values are not counted as differences. Missing information does not mean a feature is absent. Practical range is an estimate, not an owner test.</p></details>
            <div className="mt-4 space-y-3 sm:hidden">
              {specificationRows.map((row) => { const different = differentValues(row.left, row.right); return <article key={row.label} className={`rounded-2xl border p-4 ${different ? "border-sky-300/20 bg-sky-400/[0.06]" : "border-white/10 bg-slate-950/35"}`}><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold text-slate-300">{row.label}</h3>{different ? <span className="rounded-full bg-sky-400/10 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-sky-300">Different</span> : null}</div><dl className="mt-3 grid grid-cols-2 gap-3"><div><dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{leftVehicle?.name}</dt><dd className="mt-1 text-sm font-semibold leading-5 text-white">{row.left}</dd></div><div className="border-l border-white/10 pl-3"><dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{rightVehicle?.name}</dt><dd className="mt-1 text-sm font-semibold leading-5 text-white">{row.right}</dd></div></dl></article>; })}
            </div>
            <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-white/10 sm:block"><div className="min-w-[700px]">
              <div className="grid grid-cols-[190px_repeat(2,minmax(240px,1fr))] border-b border-white/10 bg-slate-950/80 text-sm font-semibold"><div className="p-4 text-slate-400">Specification</div><div className="border-l border-white/10 p-4 text-white">{leftVehicle?.brand} {leftVehicle?.name}</div><div className="border-l border-white/10 p-4 text-white">{rightVehicle?.brand} {rightVehicle?.name}</div></div>
              {specificationRows.map((row) => { const different = differentValues(row.left, row.right); return <div key={row.label} className={`grid grid-cols-[190px_repeat(2,minmax(240px,1fr))] border-b border-white/10 text-sm last:border-0 ${different ? "bg-sky-400/[0.06]" : "bg-slate-950/35"}`}><div className="flex items-center justify-between gap-2 p-4 font-semibold text-slate-400"><span>{row.label}</span>{different ? <span className="rounded-full bg-sky-400/10 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-sky-300">Different</span> : null}</div><div className={`border-l p-4 font-semibold ${different ? "border-sky-300/20 text-sky-100" : "border-white/10 text-slate-200"}`}>{row.left}</div><div className={`border-l p-4 font-semibold ${different ? "border-sky-300/20 text-sky-100" : "border-white/10 text-slate-200"}`}>{row.right}</div></div>; })}
            </div></div>
          </div>


        </div>
      </section>

      <section id="energy" className="scroll-mt-72 py-7 sm:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Ownership cost preview</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Compare the energy cost of living with each EV.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Adjust your expected driving and electricity price. Energy intensity uses the named battery profile and an estimated practical range, or a generic assumption where no profile is available.</p></div>
              <div className="grid gap-3 sm:grid-cols-3">
                <CostInput label="Kilometres / year" value={annualDistanceKm} min={1000} max={100000} step={1000} onChange={setAnnualDistanceKm} />
                <CostInput label="Electricity ₹ / kWh" value={electricityRate} min={0} max={100} step={0.1} onChange={setElectricityRate} />
                <CostInput label="Ownership years" value={ownershipYears} min={1} max={15} step={1} onChange={setOwnershipYears} />
              </div>
            </div>
            <TariffContext rate={electricityRate} onChange={setElectricityRate} />
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <OwnershipCostCard vehicleName={`${leftVehicle?.brand ?? ""} ${leftVehicle?.name ?? ""}`} energyCost={leftEnergyCost} efficiency={leftEfficiency} profileName={leftTripVariant?.name} years={ownershipYears} />
              <OwnershipCostCard vehicleName={`${rightVehicle?.brand ?? ""} ${rightVehicle?.name ?? ""}`} energyCost={rightEnergyCost} efficiency={rightEfficiency} profileName={rightTripVariant?.name} years={ownershipYears} />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">Energy estimate only. It excludes purchase price, finance, insurance, service, tyres, battery degradation, charging losses and changing tariffs. It is not total ownership cost. Use the separate on-road worksheet for purchase budgeting.</p>
          </div>
        </div>
      </section>



      <section className="py-7 sm:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <details className="rounded-2xl border border-white/15 p-5"><summary className="min-h-11 cursor-pointer py-2 text-base font-semibold text-sky-300">Full catalogue evidence and review limits</summary>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <TrustSummary vehicle={leftVehicle} />
            <TrustSummary vehicle={rightVehicle} />
          </div></details>
        </div>
      </section>



      <section className="border-t border-white/10 bg-white/[0.02] py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-semibold text-white">EV comparison questions</h2>
            <span className="text-xs text-slate-500">Reviewed 29 August 2026</span>
          </div>
          <div className="mt-7 grid gap-4">
            <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><summary className="cursor-pointer font-semibold text-white">How should I compare two electric cars?</summary><p className="mt-3 text-sm leading-7 text-slate-300">Compare the exact variants across price, claimed and practical range, battery, AC and DC charging, safety, space, warranty, service reach and ownership cost.</p></details>
            <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><summary className="cursor-pointer font-semibold text-white">Are PlugV comparison prices on-road prices?</summary><p className="mt-3 text-sm leading-7 text-slate-300">Vehicle prices are generally indicative ex-showroom listings unless explicitly labelled otherwise. Obtain a current city- and variant-specific on-road quotation before purchasing.</p></details>
            <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><summary className="cursor-pointer font-semibold text-white">Does a longer claimed range guarantee longer real-world range?</summary><p className="mt-3 text-sm leading-7 text-slate-300">No. Speed, traffic, climate control, temperature, elevation, load, tyres and the test method can change practical range.</p></details>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function defaultTripVariant(slug?: string) {
  if (!slug) return undefined;
  const profile = getVehicleTripProfile(slug);
  return profile?.variants.find((variant) => variant.name === profile.defaultVariant);
}

function differentValues(left: string, right: string) {
  const unknown = /not confirmed|not verified|awaiting|not yet verified/i;
  return !unknown.test(left) && !unknown.test(right) && left.trim().toLowerCase() !== right.trim().toLowerCase();
}

function CostInput({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return <label className="rounded-xl border border-white/20 bg-slate-950/60 px-3 py-2"><span className="text-xs font-semibold text-slate-300">{label}</span><input type="number" inputMode="decimal" value={draft ?? value} min={min} max={max} step={step} onChange={event => { const text = event.target.value; setDraft(text); const number = Number(text); if (text !== "" && Number.isFinite(number) && number >= min && number <= max) onChange(number); }} onBlur={() => { if (draft !== null && draft !== "" && Number.isFinite(Number(draft))) onChange(Math.min(max, Math.max(min, Number(draft)))); setDraft(null); }} className="mt-1 min-h-10 w-full bg-transparent text-base font-semibold text-white focus:outline-sky-300" /></label>;
}

function OwnershipCostCard({ vehicleName, energyCost, efficiency, profileName, years }: { vehicleName: string; energyCost: number; efficiency: number; profileName?: string; years: number }) {
  return <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-white">{vehicleName}</p><p className="mt-1 text-xs text-slate-500">{profileName ? `${profileName}: estimated practical range` : "Generic assumption: 0.16 kWh/km"}</p></div><span className={`rounded-full border px-3 py-1 text-[10px] font-semibold border-amber-300/20 bg-amber-400/10 text-amber-100`}>Energy cost estimate</span></div><div className="mt-5 grid grid-cols-2 gap-3"><MiniStat label={`${years}-year energy`} value={`₹${energyCost.toLocaleString("en-IN")}`} /><MiniStat label="Energy intensity" value={`${(efficiency * 100).toFixed(1)} kWh / 100 km`} /></div></article>;
}

