"use client";

import { useMemo, useState } from "react";
import { Calculator, MapPin } from "lucide-react";

const CITIES = ["Ahmedabad", "Bengaluru", "Chennai", "Delhi", "Hyderabad", "Kolkata", "Mumbai", "Pune"];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export default function OnRoadPriceEstimator({ vehicleName, startingPrice, variants }: { vehicleName: string; startingPrice: number; variants: string[] }) {
  const [city, setCity] = useState("Delhi");
  const [variant, setVariant] = useState(variants[0] ?? "Variant to be confirmed");
  const [exShowroom, setExShowroom] = useState(startingPrice);
  const [insurance, setInsurance] = useState(Math.round(startingPrice * 0.035));
  const [roadTax, setRoadTax] = useState(0);
  const [otherFees, setOtherFees] = useState(2500);
  const tcs = exShowroom > 1_000_000 ? Math.round(exShowroom * 0.01) : 0;
  const total = useMemo(() => exShowroom + insurance + roadTax + otherFees + tcs, [exShowroom, insurance, roadTax, otherFees, tcs]);

  return <section className="overflow-hidden rounded-[2rem] border border-sky-300/15 bg-white/[0.045]">
    <div className="flex gap-4 p-5 sm:p-7"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300"><Calculator className="h-5 w-5" /></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">On-road price planner</p><h2 className="mt-1 text-2xl font-semibold">Estimate {vehicleName} in your city</h2><p className="mt-2 text-sm leading-6 text-slate-400">Start with PlugV’s listed price, then enter the dealer or RTO amounts you receive for an honest city-specific estimate.</p></div></div>
    <div className="grid gap-6 border-t border-white/10 p-5 sm:p-7 lg:grid-cols-[1fr_0.75fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <PriceSelect label="Major city" value={city} onChange={setCity} options={CITIES} />
        <PriceSelect label="Variant" value={variant} onChange={setVariant} options={variants.length ? variants : ["Variant to be confirmed"]} />
        <PriceInput label="Ex-showroom price" value={exShowroom} onChange={setExShowroom} />
        <PriceInput label="Insurance quote" value={insurance} onChange={setInsurance} />
        <PriceInput label="Road tax / registration" value={roadTax} onChange={setRoadTax} />
        <PriceInput label="FASTag, HSRP & other fees" value={otherFees} onChange={setOtherFees} />
      </div>
      <div className="rounded-[1.5rem] border border-sky-300/15 bg-sky-400/[0.08] p-6"><p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200"><MapPin className="h-4 w-4" />{city}</p><p className="mt-3 text-4xl font-semibold">{money(total)}</p><p className="mt-2 text-xs text-slate-400">Indicative total for {variant}</p><div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-slate-400"><p className="flex justify-between"><span>Ex-showroom</span><span>{money(exShowroom)}</span></p><p className="flex justify-between"><span>Insurance</span><span>{money(insurance)}</span></p><p className="flex justify-between"><span>Tax / registration</span><span>{money(roadTax)}</span></p><p className="flex justify-between"><span>TCS, if applicable</span><span>{money(tcs)}</span></p><p className="flex justify-between"><span>Other fees</span><span>{money(otherFees)}</span></p></div><p className="mt-5 text-[11px] leading-5 text-slate-500">Planning estimate only. EV road-tax benefits, registration fees, insurance, accessories and dealer charges vary. Confirm the final quotation with the dealer and the relevant state transport authority.</p></div>
    </div>
  </section>;
}

function PriceInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label><span className="text-xs font-semibold text-slate-300">{label}</span><span className="mt-2 flex min-h-12 items-center rounded-2xl border border-white/10 bg-slate-950/60 px-4"><span className="mr-2 text-slate-500">₹</span><input type="number" min={0} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full bg-transparent outline-none" /></span></label>; }
function PriceSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <label><span className="text-xs font-semibold text-slate-300">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 outline-none">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
