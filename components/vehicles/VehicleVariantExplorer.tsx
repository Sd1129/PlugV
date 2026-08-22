"use client";

import { useState } from "react";
import { BatteryCharging, CarFront, CheckCircle2, Gauge, PlugZap, ShieldCheck, Users } from "lucide-react";

type Variant = { name: string; battery?: string; range?: string; practicalRange?: string; dcPower?: string; acPower?: string; dcTime?: string; connector?: string; features?: string[] };

export default function VehicleVariantExplorer({ vehicleName, bodyType, seating, listedRange, listedPower, variants }: { vehicleName: string; bodyType: string; seating: number; listedRange: string; listedPower: string; variants: Variant[] }) {
  const [selectedName, setSelectedName] = useState(variants[0]?.name ?? "All listed configurations");
  const selected = variants.find((variant) => variant.name === selectedName);
  const specifications = [
    { icon: CarFront, label: "Body type", value: bodyType },
    { icon: Users, label: "Seating capacity", value: `${seating} seats` },
    { icon: Gauge, label: "Claimed range", value: selected?.range ?? listedRange },
    { icon: BatteryCharging, label: "Power / battery", value: selected?.battery ?? listedPower },
    { icon: PlugZap, label: "Maximum DC charging", value: selected?.dcPower ?? "See model-wide figure" },
    { icon: PlugZap, label: "Maximum AC charging", value: selected?.acPower ?? "Awaiting trim verification" },
    { icon: BatteryCharging, label: "DC charging time", value: selected?.dcTime ?? "Awaiting trim verification" },
    { icon: ShieldCheck, label: "Connector", value: selected?.connector ?? "Awaiting trim verification" },
  ];

  return <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
    <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_320px] lg:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">Variants & specifications</p><h2 className="mt-2 text-2xl font-semibold">Explore {vehicleName} configurations</h2><p className="mt-2 text-sm leading-6 text-slate-400">Select a verified battery configuration to update the figures below.</p></div><label><span className="text-xs font-semibold text-slate-300">Select variant</span><select value={selectedName} disabled={!variants.length} onChange={(event) => setSelectedName(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold outline-none disabled:cursor-not-allowed disabled:text-slate-500">{variants.length ? variants.map((variant) => <option key={variant.name}>{variant.name}</option>) : <option>All listed configurations</option>}</select></label></div>
    <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">{specifications.map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><Icon className="h-5 w-5 text-sky-300" /><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p></div>)}</div>
    <div className="border-t border-white/10 p-5 sm:p-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">Key features in this variant</p>
      <h3 className="mt-2 text-xl font-semibold text-white">{selectedName}</h3>
      {selected?.features?.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{selected.features.map((feature) => <div key={feature} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /><p className="text-sm leading-6 text-slate-300">{feature}</p></div>)}</div> : <p className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-400/[0.06] p-4 text-xs leading-6 text-amber-100/80">Trim-specific equipment is being checked against the manufacturer’s current catalogue. Confirm this variant’s final equipment with the manufacturer or authorised dealer.</p>}
    </div>
    {variants.length && !selected?.battery ? <p className="border-t border-white/10 px-5 py-4 text-xs leading-5 text-amber-100/80 sm:px-7">Variant selected. PlugV is showing model-wide figures where trim-level battery and charging details are still being manufacturer-verified.</p> : null}
  </section>;
}
