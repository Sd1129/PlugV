"use client";

import { useId, useMemo } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { ChevronDown } from "lucide-react";
import { startingPriceRupees } from "@/data/vehicle-buying-specs";

type Vehicle = { slug: string; name: string; brand: string; price?: string };
export function priceBand(price?: string) {
  const amount = startingPriceRupees(price);
  if (!amount) return "Price not confirmed";
  if (amount < 1_000_000) return "Under ₹10 lakh";
  if (amount < 1_500_000) return "₹10–15 lakh";
  if (amount < 2_500_000) return "₹15–25 lakh";
  if (amount < 5_000_000) return "₹25–50 lakh";
  return "₹50 lakh and above";
}

export default function VehiclePicker({ label, vehicles, value, excluded, onChange }: {
  label: string; vehicles: Vehicle[]; value: string; excluded: string; onChange: (slug: string) => void;
}) {
  const id = useId();
  const groups = useMemo(() => {
    const bands = ["Under ₹10 lakh", "₹10–15 lakh", "₹15–25 lakh", "₹25–50 lakh", "₹50 lakh and above", "Price not confirmed"];
    return bands.map(band => ({ value: band, items: vehicles.filter(v => v.slug !== excluded && priceBand(v.price) === band)
      .sort((a, b) => startingPriceRupees(a.price) - startingPriceRupees(b.price) || a.name.localeCompare(b.name)) })).filter(g => g.items.length);
  }, [vehicles, excluded]);
  return <div className="min-w-0 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
    <Combobox.Root items={groups} value={vehicles.find(v => v.slug === value) ?? null}
      itemToStringLabel={(v: Vehicle) => `${v.brand} ${v.name}`} isItemEqualToValue={(a, b) => a.slug === b.slug}
      onValueChange={v => { if (v && v.slug !== excluded) onChange(v.slug); }} autoHighlight>
      <label htmlFor={id} className="text-xs font-semibold text-sky-300">{label}</label>
      <Combobox.InputGroup className="mt-3 flex rounded-xl border border-white/20 bg-slate-950 focus-within:ring-2 focus-within:ring-sky-300">
        <Combobox.Input id={id} placeholder="Search a model or brand" onFocus={e => e.currentTarget.select()} className="min-h-12 min-w-0 w-full bg-transparent px-3 text-base text-white outline-none" />
        <Combobox.Trigger aria-label={`Browse ${label.toLowerCase()}`} className="min-h-12 min-w-12 text-sky-300"><ChevronDown className="mx-auto h-5 w-5" /></Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal><Combobox.Positioner sideOffset={6} className="z-[100] w-[var(--anchor-width)] max-w-[calc(100vw-32px)]">
        <Combobox.Popup className="overflow-hidden rounded-xl border border-slate-600 bg-slate-950 text-white shadow-2xl">
          <Combobox.Empty className="p-4 text-sm text-slate-300">No matching EV. Try another model or brand.</Combobox.Empty>
          <Combobox.List className="max-h-[min(360px,45dvh)] overflow-y-auto overscroll-contain p-2">
            {(group: { value: string; items: Vehicle[] }) => <Combobox.Group key={group.value} items={group.items}>
              <Combobox.GroupLabel className="px-3 pb-2 pt-4 text-xs font-semibold text-sky-300">{group.value}</Combobox.GroupLabel>
              <Combobox.Collection>{(v: Vehicle) => <Combobox.Item key={v.slug} value={v} className="cursor-pointer rounded-lg px-3 py-3 outline-none data-[highlighted]:bg-sky-900 data-[selected]:bg-slate-800">
                <span className="block text-sm font-semibold">{v.brand} {v.name}</span><span className="mt-1 block text-xs text-slate-300">{v.price ?? "Price not confirmed"} · ex-showroom</span>
              </Combobox.Item>}</Combobox.Collection>
            </Combobox.Group>}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner></Combobox.Portal>
    </Combobox.Root>
  </div>;
}
