"use client";

import { useState } from "react";

const fields = [
  ["price", "Selected trim ex-showroom ₹"],
  ["registration", "Road tax + registration ₹"],
  ["insurance", "Insurance ₹"],
  ["extras", "Other quoted charges ₹"],
  ["discount", "Confirmed discounts ₹"],
] as const;

export default function OnRoadBudget({ name, cataloguePrice }: { name: string; cataloguePrice?: string }) {
  const [city, setCity] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const complete = city.trim() && fields.every(([key]) => amounts[key]?.trim() && Number.isFinite(Number(amounts[key])) && Number(amounts[key]) >= 0) && Number(amounts.price) > 0;
  const total = complete ? Number(amounts.price) + Number(amounts.registration) + Number(amounts.insurance) + Number(amounts.extras) - Number(amounts.discount) : null;
  return <fieldset className="min-w-0 rounded-2xl border border-white/15 bg-slate-950/60 p-5">
    <legend className="px-2 font-semibold">{name}</legend>
    <p className="mb-4 text-sm text-slate-300">Catalogue reference: {cataloguePrice ?? "Price not confirmed"} ex-showroom. Enter your selected trim’s quote below.</p>
    <label className="block text-sm text-slate-300">City / state<input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Hyderabad, Telangana" className="mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-slate-950 px-3 text-base text-white focus:outline-sky-300" /></label>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="text-sm text-slate-300">{label}<input type="number" inputMode="decimal" min={0} step="any" value={amounts[key] ?? ""} onChange={e => setAmounts({ ...amounts, [key]: e.target.value })} placeholder="Enter amount" className="mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-slate-950 px-3 text-base text-white focus:outline-sky-300" /></label>)}</div>
    <p aria-live="polite" className="mt-5 text-lg font-semibold text-sky-200">{total !== null && total > 0 ? `Your on-road budget: ₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "Enter your city and all five amounts to calculate."}</p>
    <p className="mt-2 text-xs leading-5 text-slate-400">Enter 0 only where a charge or discount does not apply. User-entered budget, not a dealer quotation. Confirm applicable taxes, fees, subsidies and quote validity with the dealer.</p>
  </fieldset>;
}
