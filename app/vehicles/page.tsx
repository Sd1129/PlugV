"use client";

import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import VehiclesHero from "@/components/vehicles/VehiclesHero";
import VehicleFilters, {
  type SortOption,
} from "@/components/vehicles/VehicleFilters";
import VehicleGrid from "@/components/vehicles/VehicleGrid";
import VehicleHighlights from "@/components/vehicles/VehicleHighlights";
import { vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function parseNumeric(value?: string) {
  const values = value?.replace(/,/g, "").match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  return values.length ? Math.max(...values) : 0;
}

function VehiclesContent() {
  const searchParams = useSearchParams();
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

  const [query, setQuery] = useState(() => searchParams.get("query") ?? "");
  const [selectedType, setSelectedType] = useState("All types");
  const [selectedBrand, setSelectedBrand] = useState("All brands");
  const [sortBy, setSortBy] = useState<SortOption["value"]>("recommended");
  const [minimumRange, setMinimumRange] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

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
      const matchesRange = parseNumeric(vehicle.range) >= minimumRange;
      const matchesVerification = !verifiedOnly || Boolean(getVehicleTripProfile(vehicle.slug));

      return matchesQuery && matchesType && matchesBrand && matchesRange && matchesVerification;
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
  }, [launchedVehicles, query, selectedType, selectedBrand, sortBy, minimumRange, verifiedOnly]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <VehiclesHero />

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
        minimumRange={minimumRange}
        onMinimumRange={setMinimumRange}
        verifiedOnly={verifiedOnly}
        onVerifiedOnly={setVerifiedOnly}
        onReset={() => {
          setQuery("");
          setSelectedType("All types");
          setSelectedBrand("All brands");
          setSortBy("recommended");
          setMinimumRange(0);
          setVerifiedOnly(false);
        }}
      />

      <VehicleGrid vehicles={filteredVehicles} />

      <VehicleHighlights />

      <SiteFooter />
    </main>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" aria-label="Loading electric vehicles" />}>
      <VehiclesContent />
    </Suspense>
  );
}
