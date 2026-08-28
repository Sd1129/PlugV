"use client";

import { useMemo, useState } from "react";

const formatMoney = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

function Field({ label, value, min = 0, step = 1, onChange }: { label: string; value: number; min?: number; step?: number; onChange: (value: number) => void }) {
  return <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span><input type="number" min={min} step={step} value={value} onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))} className="min-h-12 rounded-xl border border-white/10 bg-slate-950 px-4 text-base font-semibold text-white outline-none focus:border-sky-300/40" /></label>;
}

export default function CostCalculator({ mode }: { mode: "five-year" | "tco" }) {
  const [years, setYears] = useState(mode === "five-year" ? 5 : 7);
  const [kilometres, setKilometres] = useState(15000);
  const [evPrice, setEvPrice] = useState(1800000);
  const [petrolPrice, setPetrolPrice] = useState(1400000);
  const [evEfficiency, setEvEfficiency] = useState(6.5);
  const [electricityRate, setElectricityRate] = useState(10);
  const [petrolEfficiency, setPetrolEfficiency] = useState(15);
  const [petrolRate, setPetrolRate] = useState(105);
  const [evMaintenance, setEvMaintenance] = useState(12000);
  const [petrolMaintenance, setPetrolMaintenance] = useState(24000);
  const [evInsurance, setEvInsurance] = useState(32000);
  const [petrolInsurance, setPetrolInsurance] = useState(26000);
  const [evResale, setEvResale] = useState(700000);
  const [petrolResale, setPetrolResale] = useState(550000);

  const result = useMemo(() => {
    const evEnergy = (kilometres / Math.max(evEfficiency, 0.1)) * electricityRate * years;
    const petrolFuel = (kilometres / Math.max(petrolEfficiency, 0.1)) * petrolRate * years;
    const evTotal = evPrice + evEnergy + (evMaintenance + evInsurance) * years - evResale;
    const petrolTotal = petrolPrice + petrolFuel + (petrolMaintenance + petrolInsurance) * years - petrolResale;
    return { evEnergy, petrolFuel, evTotal, petrolTotal, difference: petrolTotal - evTotal };
  }, [years, kilometres, evPrice, petrolPrice, evEfficiency, electricityRate, petrolEfficiency, petrolRate, evMaintenance, petrolMaintenance, evInsurance, petrolInsurance, evResale, petrolResale]);

  return <section className="rounded-[2rem] border border-sky-300/20 bg-[#071321] p-5 shadow-2xl shadow-black/30 sm:p-7" aria-labelledby="cost-calculator-heading">
    <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Interactive calculator</p><h2 id="cost-calculator-heading" className="mt-2 text-2xl font-semibold text-white">Use your own ownership assumptions</h2></div><p className="text-xs text-slate-500">Planning estimate · not financial advice</p></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Ownership years" value={years} min={1} onChange={setYears} /><Field label="Driving per year (km)" value={kilometres} min={1000} step={1000} onChange={setKilometres} /><Field label="EV on-road price (₹)" value={evPrice} step={10000} onChange={setEvPrice} /><Field label="Petrol on-road price (₹)" value={petrolPrice} step={10000} onChange={setPetrolPrice} />
      <Field label="EV efficiency (km/kWh)" value={evEfficiency} step={0.1} onChange={setEvEfficiency} /><Field label="Blended electricity (₹/kWh)" value={electricityRate} step={0.5} onChange={setElectricityRate} /><Field label="Petrol efficiency (km/l)" value={petrolEfficiency} step={0.5} onChange={setPetrolEfficiency} /><Field label="Petrol price (₹/l)" value={petrolRate} step={0.5} onChange={setPetrolRate} />
      <Field label="EV maintenance / year" value={evMaintenance} step={1000} onChange={setEvMaintenance} /><Field label="Petrol maintenance / year" value={petrolMaintenance} step={1000} onChange={setPetrolMaintenance} /><Field label="EV insurance / year" value={evInsurance} step={1000} onChange={setEvInsurance} /><Field label="Petrol insurance / year" value={petrolInsurance} step={1000} onChange={setPetrolInsurance} />
      <Field label="EV resale value" value={evResale} step={10000} onChange={setEvResale} /><Field label="Petrol resale value" value={petrolResale} step={10000} onChange={setPetrolResale} />
    </div>
    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Result label="EV energy cost" value={result.evEnergy} /><Result label="Petrol fuel cost" value={result.petrolFuel} /><Result label="EV total ownership cost" value={result.evTotal} highlight /><Result label="Petrol total ownership cost" value={result.petrolTotal} /></div>
    <div className={`mt-4 rounded-2xl border p-5 ${result.difference >= 0 ? "border-emerald-300/20 bg-emerald-300/10" : "border-amber-300/20 bg-amber-300/10"}`}><p className="text-sm font-semibold text-white">{result.difference >= 0 ? `Estimated EV saving: ${formatMoney(result.difference)}` : `Estimated petrol saving: ${formatMoney(Math.abs(result.difference))}`} over {years} years</p><p className="mt-2 text-xs leading-5 text-slate-300">Excludes finance interest, unexpected repairs, charger installation, taxes not included in entered prices and changes in energy prices. Verify all inputs for the exact variants.</p></div>
  </section>;
}

function Result({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return <div className={`rounded-2xl border p-4 ${highlight ? "border-sky-300/25 bg-sky-300/10" : "border-white/10 bg-slate-950/60"}`}><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</p><p className="mt-2 text-xl font-semibold text-white">{formatMoney(value)}</p></div>;
}
