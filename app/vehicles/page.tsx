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
import { startingPriceRupees } from "@/data/vehicle-buying-specs";
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
  const [priceBand, setPriceBand] = useState("all");
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
      const priceLakh = startingPriceRupees(vehicle.price) / 100_000;
      const matchesPrice = priceBand === "all" ||
        (priceBand === "under-10" && priceLakh > 0 && priceLakh < 10) ||
        (priceBand === "10-15" && priceLakh >= 10 && priceLakh < 15) ||
        (priceBand === "15-25" && priceLakh >= 15 && priceLakh < 25) ||
        (priceBand === "25-50" && priceLakh >= 25 && priceLakh < 50) ||
        (priceBand === "above-50" && priceLakh >= 50);
      const matchesVerification = !verifiedOnly || Boolean(getVehicleTripProfile(vehicle.slug));

      return matchesQuery && matchesType && matchesBrand && matchesRange && matchesPrice && matchesVerification;
    });

    const sorted = [...matches];

    switch (sortBy) {
      case "range-desc":
        sorted.sort((a, b) => parseNumeric(b.range) - parseNumeric(a.range));
        break;
      case "price-asc":
        sorted.sort((a, b) => startingPriceRupees(a.price) - startingPriceRupees(b.price));
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // The catalogue is maintained newest-first from verified launch data.
        // Keep that editorial order for the default Explore view so the latest
        // India launches appear at the top; users can still choose another sort.
        break;
    }

    return sorted;
  }, [launchedVehicles, query, selectedType, selectedBrand, sortBy, minimumRange, priceBand, verifiedOnly]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <VehiclesHero>
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
        priceBand={priceBand}
        onPriceBand={setPriceBand}
        verifiedOnly={verifiedOnly}
        onVerifiedOnly={setVerifiedOnly}
        onReset={() => {
          setQuery("");
          setSelectedType("All types");
          setSelectedBrand("All brands");
          setSortBy("recommended");
          setMinimumRange(0);
          setPriceBand("all");
          setVerifiedOnly(false);
        }}
          embedded
        />
      </VehiclesHero>

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

