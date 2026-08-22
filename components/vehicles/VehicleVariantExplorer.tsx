"use client";

import { useState } from "react";
import { BatteryCharging, CarFront, CheckCircle2, Gauge, GitCompareArrows, PlugZap, ShieldCheck, Users } from "lucide-react";

type Variant = { name: string; battery?: string; range?: string; practicalRange?: string; dcPower?: string; acPower?: string; dcTime?: string; connector?: string; features?: string[] };
const rows: { label: string; key: keyof Variant }[] = [
  { label: "Battery", key: "battery" }, { label: "Claimed range", key: "range" },
  { label: "Practical range", key: "practicalRange" }, { label: "Maximum DC charging", key: "dcPower" },
  { label: "Maximum AC charging", key: "acPower" }, { label: "DC charging time", key: "dcTime" },
  { label: "Connector", key: "connector" },
];

export default function VehicleVariantExplorer({ vehicleName, bodyType, seating, listedRange, listedPower, variants }: { vehicleName: string; bodyType: string; seating: number; listedRange: string; listedPower: string; variants: Variant[] }) {
  const [selectedName, setSelectedName] = useState(variants[0]?.name ?? "All listed configurations");
  const [compareName, setCompareName] = useState(variants[1]?.name ?? variants[0]?.name ?? "");
  const selected = variants.find((variant) => variant.name === selectedName);
  const compared = variants.find((variant) => variant.name === compareName);
  const specifications = [
    { icon: CarFront, label: "Body type", value: bodyType }, { icon: Users, label: "Seating capacity", value: `${seating} seats` },
    { icon: Gauge, label: "Claimed range", value: selected?.range ?? listedRange }, { icon: BatteryCharging, label: "Power / battery", value: selected?.battery ?? listedPower },
    { icon: PlugZap, label: "Maximum DC charging", value: selected?.dcPower ?? "See model-wide figure" }, { icon: PlugZap, label: "Maximum AC charging", value: selected?.acPower ?? "Awaiting trim verification" },
    { icon: BatteryCharging, label: "DC charging time", value: selected?.dcTime ?? "Awaiting trim verification" }, { icon: ShieldCheck, label: "Connector", value: selected?.connector ?? "Awaiting trim verification" },
  ];

  return <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
    <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_320px] lg:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">Variants & specifications</p><h2 className="mt-2 text-2xl font-semibold">Explore {vehicleName} configurations</h2><p className="mt-2 text-sm leading-6 text-slate-400">Select a variant to update its available specifications and equipment.</p></div><VariantSelect label="Select variant" value={selectedName} variants={variants} onChange={setSelectedName} /></div>
    <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">{specifications.map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><Icon className="h-5 w-5 text-sky-300" /><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p></div>)}</div>
    <div className="border-t border-white/10 p-5 sm:p-7"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">Key features in this variant</p><h3 className="mt-2 text-xl font-semibold text-white">{selectedName}</h3>{selected?.features?.length ? <FeatureList features={selected.features} /> : <VerificationNotice />}</div>
    {variants.length > 1 ? <div className="border-t border-white/10 bg-slate-950/25 p-5 sm:p-7">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-sky-400/10 p-2 text-sky-300"><GitCompareArrows className="h-5 w-5" /></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">Compare variants</p><h3 className="mt-1 text-xl font-semibold text-white">See the differences side by side</h3></div></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><VariantSelect label="First variant" value={selectedName} variants={variants} onChange={setSelectedName} /><VariantSelect label="Second variant" value={compareName} variants={variants} onChange={setCompareName} /></div>
      {selectedName === compareName ? <p className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-400/[0.06] p-4 text-sm text-amber-100">Choose two different variants to compare.</p> : <><div className="mt-5 overflow-x-auto rounded-2xl border border-white/10"><div className="min-w-[620px]">
        <div className="grid grid-cols-[180px_repeat(2,minmax(210px,1fr))] border-b border-white/10 bg-white/[0.04] text-xs font-semibold text-white"><div className="p-4 text-slate-400">Specification</div><div className="border-l border-white/10 p-4">{selectedName}</div><div className="border-l border-white/10 p-4">{compareName}</div></div>
        {rows.map((row) => <div key={row.label} className="grid grid-cols-[180px_repeat(2,minmax(210px,1fr))] border-b border-white/10 text-xs last:border-0"><div className="p-4 font-semibold text-slate-400">{row.label}</div><div className="border-l border-white/10 p-4 text-slate-200">{valueFor(selected, row.key, row.key === "range" ? listedRange : row.key === "battery" ? listedPower : undefined)}</div><div className="border-l border-white/10 p-4 text-slate-200">{valueFor(compared, row.key, row.key === "range" ? listedRange : row.key === "battery" ? listedPower : undefined)}</div></div>)}
      </div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><FeatureColumn variant={selected} /><FeatureColumn variant={compared} /></div></>}
    </div> : null}
    {variants.length && !selected?.battery ? <p className="border-t border-white/10 px-5 py-4 text-xs leading-5 text-amber-100/80 sm:px-7">Variant selected. PlugV is showing model-wide figures where trim-level battery and charging details are still being manufacturer-verified.</p> : null}
  </section>;
}

function VariantSelect({ label, value, variants, onChange }: { label: string; value: string; variants: Variant[]; onChange: (value: string) => void }) {
  return <label><span className="text-xs font-semibold text-slate-300">{label}</span><select value={value} disabled={!variants.length} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-sm font-semibold text-white outline-none focus:border-sky-300/40 disabled:cursor-not-allowed disabled:text-slate-500">{variants.length ? variants.map((variant) => <option key={variant.name}>{variant.name}</option>) : <option>All listed configurations</option>}</select></label>;
}
function FeatureList({ features }: { features: string[] }) { return <div className="mt-5 grid gap-3 sm:grid-cols-2">{features.map((feature) => <div key={feature} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /><p className="text-sm leading-6 text-slate-300">{feature}</p></div>)}</div>; }
function VerificationNotice() { return <p className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-400/[0.06] p-4 text-xs leading-6 text-amber-100/80">Trim-specific equipment is being checked against the manufacturer’s current catalogue. Confirm this variant’s final equipment with the manufacturer or authorised dealer.</p>; }
function FeatureColumn({ variant }: { variant?: Variant }) { return <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><p className="text-sm font-semibold text-white">{variant?.name}</p>{variant?.features?.length ? <ul className="mt-3 space-y-2">{variant.features.map((feature) => <li key={feature} className="flex gap-2 text-xs leading-5 text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{feature}</li>)}</ul> : <p className="mt-3 text-xs leading-5 text-slate-500">Trim-specific features are awaiting manufacturer verification.</p>}</div>; }
function valueFor(variant: Variant | undefined, key: keyof Variant, fallback?: string) { const value = variant?.[key]; return typeof value === "string" ? value : fallback ?? "Awaiting trim verification"; }
