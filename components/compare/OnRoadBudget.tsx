"use client";

import { useState } from "react";
import { startingPriceRupees } from "@/data/vehicle-buying-specs";

const fields = [["price", "Selected trim ex-showroom ₹"], ["registration", "Road tax + registration ₹"], ["insurance", "Insurance allowance ₹"], ["extras", "Other charges allowance ₹"], ["discount", "Confirmed discounts ₹"]] as const;

export default function OnRoadBudget({ name, cataloguePrice }: { name: string; cataloguePrice?: string }) {
  const [region, setRegion] = useState("telangana");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const basePrice = startingPriceRupees(cataloguePrice);
  const price = overrides.price === undefined ? basePrice : Number(overrides.price);
  const exemptionActive = new Date().toISOString().slice(0, 10) <= "2026-12-31";
  const taxRate = region === "telangana" && exemptionActive ? 0 : 0.08;
  const defaults: Record<string, number> = { price: basePrice, registration: Math.round(price * taxRate), insurance: Math.round(price * 0.03), extras: 1500, discount: 0 };
  const amounts = Object.fromEntries(fields.map(([key]) => [key, overrides[key] ?? String(defaults[key])]));
  const valid = fields.every(([key]) => amounts[key].trim() !== "" && Number.isFinite(Number(amounts[key])) && Number(amounts[key]) >= 0) && price > 0;
  const total = valid ? price + Number(amounts.registration) + Number(amounts.insurance) + Number(amounts.extras) - Number(amounts.discount) : null;
  const edited = Object.keys(overrides).length > 0;
  return <fieldset className="min-w-0 rounded-2xl border border-white/15 bg-slate-950/60 p-4 sm:p-5">
    <legend className="px-2 font-semibold">{name}</legend>
    <label className="block text-sm text-slate-300">Registration state scenario<select value={region} onChange={e => { setRegion(e.target.value); setOverrides(previous => { const next = { ...previous }; delete next.registration; return next; }); }} className="mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-slate-950 px-3 text-base text-white">
      <option value="telangana">Telangana · {exemptionActive ? "eligible EV exemption" : "policy review due"}</option><option value="custom">Other state · generic 8% tax allowance</option>
    </select></label>
    <p aria-live="polite" className="mt-4 text-xl font-semibold text-sky-200">{total !== null && total > 0 ? `Estimated on-road: ₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "Enter valid amounts to calculate."}</p>
    <p className="mt-2 text-sm leading-6 text-slate-300">{edited ? "Includes your edits." : "Based on the catalogue starting price."} Planning estimate, not a dealer quote.</p>
    <details className="mt-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-sky-300">Adjust price and charges</summary>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="text-sm text-slate-300">{label}<input type="number" inputMode="decimal" min={0} step="any" value={amounts[key]} onChange={e => setOverrides(previous => ({ ...previous, [key]: e.target.value }))} className="mt-2 min-h-12 w-full rounded-lg border border-white/20 bg-slate-950 px-3 text-base text-white focus:outline-sky-300" /></label>)}</div>
      <button type="button" onClick={() => setOverrides({})} className="mt-3 min-h-11 text-sm text-sky-300 underline">Reset to estimates</button>
    </details>
    <details className="mt-2 border-t border-white/10 pt-2"><summary className="min-h-11 cursor-pointer py-2 text-sm text-slate-300">How this estimate works</summary>
      <ul className="mt-2 space-y-3 text-sm leading-6 text-slate-300">
        <li>{region === "telangana" && exemptionActive ? <>Eligible private EVs purchased and registered in Telangana: road tax and registration exemption through 31 December 2026. <a href="https://tgtransport.net/onlinedashboard/Dashboard/Flagship.aspx" target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">Transport Department source</a> (checked 17 September 2026). Confirm eligibility.</> : "8% is an illustrative tax allowance, not this state’s legal rate. Replace it with the dealer/RTO amount."}</li>
        <li>Insurance: a rough 3% of ex-showroom allowance, not an insurer rate. Actual cover, tenure, add-ons and location change the premium.</li>
        <li>Other charges: ₹1,500 allowance. Discounts default to ₹0. Confirm all fees, TCS if applicable, charger costs and quote validity with your dealer.</li>
        <li>Changing state resets road tax only. Editing price updates unedited percentage allowances. This scenario does not detect your location.</li>
      </ul>
    </details>
  </fieldset>;
}
