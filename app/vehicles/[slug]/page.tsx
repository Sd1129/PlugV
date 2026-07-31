"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";
import { Search, ArrowRight } from "lucide-react";

export default function VehiclesPage() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All types");
  const [selectedBrand, setSelectedBrand] = useState("All brands");

  const launchedVehicles = vehicles.filter((vehicle) => vehicle.launched);
  const types = ["All types", ...Array.from(new Set(launchedVehicles.map((v) => v.type)))];
  const brands = ["All brands", ...Array.from(new Set(launchedVehicles.map((v) => v.brand)))];

  const filteredVehicles = useMemo(() => {
    const q = query.toLowerCase().trim();

    return launchedVehicles.filter((vehicle) => {
      const matchesQuery =
        vehicle.name.toLowerCase().includes(q) ||
        vehicle.brand.toLowerCase().includes(q) ||
        vehicle.type.toLowerCase().includes(q) ||
        vehicle.status.toLowerCase().includes(q);

      const matchesType = selectedType === "All types" || vehicle.type === selectedType;
      const matchesBrand = selectedBrand === "All brands" || vehicle.brand === selectedBrand;

      return matchesQuery && matchesType && matchesBrand;
    });
  }, [query, selectedType, selectedBrand, launchedVehicles]);

  const highlightedVehicle = launchedVehicles[0];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="border-b border-emerald-100 bg-[linear-gradient(180deg,#f4fbf6_0%,#ffffff_70%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_0.85fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              Launched EVs
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Explore Electric Vehicles
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Browse launched EVs with clear pricing, range, charging speed, and detailed model pages.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/charging"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Find Charging Stations
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/upcoming"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-7 py-3 text-base font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                View Upcoming EVs
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Stat value={`${launchedVehicles.length}+`} label="Launched EVs" />
              <Stat value={String(new Set(launchedVehicles.map((v) => v.brand)).size)} label="Brands" />
              <Stat value={String(new Set(launchedVehicles.map((v) => v.type)).size)} label="Body styles" />
            </div>
          </div>

          <div className="rounded-[34px] border border-emerald-100 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Spotlight
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Updated today
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-lg">
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Featured vehicle
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  {highlightedVehicle?.name ?? "Featured EV"}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {highlightedVehicle?.brand ?? "EV Brand"} • {highlightedVehicle?.type ?? "Vehicle"}
                </p>

                <div className="mt-6 space-y-3">
                  <SummaryRow label="Range" value={highlightedVehicle?.range ?? "—"} />
                  <SummaryRow label="Charging" value={highlightedVehicle?.charging ?? "—"} />
                  <SummaryRow label="Price" value={highlightedVehicle?.price ?? "—"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-100 bg-white">
        <div className="mx-auto w-full max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Search and filter
            </div>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Find the right EV
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              Search by name, brand, type, or status and narrow results with simple filters.
            </p>
          </div>

          <div className="mt-8 grid gap-4 rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-sm lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
            <label className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-emerald-600" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles, brands, or status..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm outline-none"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="mt-8 rounded-[28px] border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-600 shadow-sm">
              No vehicles match your search. Try a different brand, type, or keyword.
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-emerald-100 bg-emerald-50/20">
        <div className="mx-auto w-full max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              title="Commercial layout"
              text="A clean premium design with white backgrounds, subtle borders, and green accents."
            />
            <InfoCard
              title="Launched vehicles only"
              text="This page shows the EVs currently available, with space for more models later."
            />
            <InfoCard
              title="Ready for expansion"
              text="Add comparison, sorting, photos, reviews, and country filters when you're ready."
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="text-3xl font-black text-emerald-700">{value}</div>
      <div className="mt-2 text-sm text-slate-600">{label}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}