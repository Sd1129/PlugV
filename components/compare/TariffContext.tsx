"use client";

import { useState } from "react";

const examples = [
  { id: "delhi", label: "Delhi · BSES Yamuna · published June 2025 example", rate: 6.5, basis: "Domestic energy slab: 401–800 units/month, ₹6.50/kWh.", source: "https://www.bsesdelhi.com/documents/73527/1989278520/Form_2_1_a_June_2025.pdf" },
  { id: "telangana", label: "Telangana · FY 2025–26 example", rate: 9, basis: "Domestic consumption above 200 units/month: the 301–400 unit slab is ₹9/kWh.", source: "https://tgerc.telangana.gov.in/file_upload/uploads/Tariff%20Orders/Current%20Year%20Orders/2025/RST%20Order%20FY%202025-26%20FINAL.pdf" },
];

export default function TariffContext({ rate, onChange }: { rate: number; onChange: (rate: number) => void }) {
  const [selected, setSelected] = useState("");
  const example = examples.find(e => e.id === selected);
  return <div className="mt-5 rounded-2xl border border-white/15 bg-slate-950/60 p-4">
    <label className="block text-sm font-semibold text-slate-200">City / state electricity example
      <select value={selected} onChange={e => { setSelected(e.target.value); const next = examples.find(x => x.id === e.target.value); if (next) onChange(next.rate); }} className="mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-slate-950 px-3 text-base text-white">
        <option value="">Custom rate / use my current bill</option>{examples.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
      </select>
    </label>
    <p className="mt-3 text-sm leading-6 text-slate-300">{example ? <>{example.basis} <a className="text-sky-300 underline" href={example.source} target="_blank" rel="noopener noreferrer">Official published schedule</a>. {rate !== example.rate ? "You have edited the example rate. " : ""}</> : "The starting ₹10/kWh is a planning assumption, not a city tariff. Replace it with the rate for additional electricity on your current bill. "}These dated examples are not current tariff quotations or state averages. Charging can move your household into a higher slab.</p>
    <p className="mt-2 text-xs leading-5 text-slate-400">Base energy only: excludes fixed charges, fuel adjustments, duties, subsidies and public-charging service fees. Check your DISCOM’s current schedule before budgeting. Source examples checked 17 September 2026.</p>
  </div>;
}
