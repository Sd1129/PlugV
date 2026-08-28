import Link from "next/link";
import { vehicles } from "@/data/vehicles";

function maximumNumber(value?: string) { return Math.max(0, ...(value?.replace(/,/g, "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [])); }

export default function CategoryLists() {
  const categories = ["SUV", "Hatchback", "Sedan", "MPV", "Crossover"];
  return <div className="grid gap-6 lg:grid-cols-2">{categories.map((category) => {
    const items = vehicles.filter((vehicle) => vehicle.launched && vehicle.type.toLowerCase().includes(category.toLowerCase())).sort((a, b) => maximumNumber(b.range) - maximumNumber(a.range)).slice(0, 10);
    return <section key={category} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">{category}</p><h2 className="mt-2 text-2xl font-semibold text-white">Launched electric {category.toLowerCase()}s</h2><div className="mt-5 divide-y divide-white/10">{items.length ? items.map((vehicle, index) => <Link key={vehicle.slug} href={`/vehicles/${vehicle.slug}`} className="flex items-center justify-between gap-4 py-4 transition hover:text-sky-200"><div><p className="font-semibold text-white"><span className="mr-3 text-slate-600">{index + 1}</span>{vehicle.brand} {vehicle.name}</p><p className="mt-1 text-xs text-slate-400">{vehicle.price ?? "Price not listed"}</p></div><span className="shrink-0 text-sm font-semibold text-sky-300">{vehicle.range ?? "—"}</span></Link>) : <p className="py-5 text-sm text-slate-400">No launched vehicles currently classified here.</p>}</div></section>;
  })}</div>;
}
