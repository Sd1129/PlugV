"use client";

import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import UniversalSearch from "@/components/ui/UniversalSearch";
import VehiclesHero from "@/components/vehicles/VehiclesHero";
import VehicleFilters, {
  type SortOption,
} from "@/components/vehicles/VehicleFilters";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import VehicleHighlights from "@/components/vehicles/VehicleHighlights";
import { vehicles } from "@/data/vehicles";
import { useMemo, useState } from "react";

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

export default function VehiclesPage() {
  const launchedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.launched),
    []
  );

  const brands = useMemo(
    () => [
      "All brands",
      ...Array.from(new Set(launchedVehicles.map((v) => v.brand))).sort(),
    ],
    [launchedVehicles]
  );

  const types = useMemo(
    () => [
      "All types",
      ...Array.from(new Set(launchedVehicles.map((v) => v.type))).sort(),
    ],
    [launchedVehicles]
  );

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All types");
  const [selectedBrand, setSelectedBrand] = useState("All brands");
  const [sortBy, setSortBy] = useState<SortOption["value"]>("recommended");

  const filteredVehicles = useMemo(() => {
    const q = query.toLowerCase().trim();

    const matches = launchedVehicles.filter((vehicle) => {
      const matchesQuery =
        vehicle.name.toLowerCase().includes(q) ||
        vehicle.brand.toLowerCase().includes(q) ||
        vehicle.type.toLowerCase().includes(q) ||
        vehicle.status.toLowerCase().includes(q) ||
        (vehicle.price ?? "").toLowerCase().includes(q) ||
        (vehicle.range ?? "").toLowerCase().includes(q) ||
        (vehicle.charging ?? "").toLowerCase().includes(q);

      const matchesType =
        selectedType === "All types" || vehicle.type === selectedType;
      const matchesBrand =
        selectedBrand === "All brands" || vehicle.brand === selectedBrand;

      return matchesQuery && matchesType && matchesBrand;
    });

    const sorted = [...matches];

    switch (sortBy) {
      case "range-desc":
        sorted.sort((a, b) => parseNumeric(b.range) - parseNumeric(a.range));
        break;
      case "price-asc":
        sorted.sort((a, b) => parseNumeric(a.price) - parseNumeric(b.price));
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [launchedVehicles, query, selectedType, selectedBrand, sortBy]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <VehiclesHero />

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <UniversalSearch />
        </div>
      </section>

      <VehicleFilters
        query={query}
        onQueryChange={setQuery}
        selectedType={selectedType}
        onSelectedType={setSelectedType}
        selectedBrand={selectedBrand}
        onSelectedBrand={setSelectedBrand}
        sortBy={sortBy}
        onSortBy={setSortBy}
        types={types}
        brands={brands}
        resultCount={filteredVehicles.length}
        onReset={() => {
          setQuery("");
          setSelectedType("All types");
          setSelectedBrand("All brands");
          setSortBy("recommended");
        }}
      />

      <VehicleGrid vehicles={filteredVehicles} />

      <VehicleHighlights />

      <SiteFooter />
    </main>
  );
}