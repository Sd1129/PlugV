import { Filter, Search } from "lucide-react";

export type SortOption = {
  value: "recommended" | "range-desc" | "price-asc" | "name-asc";
  label: string;
};

type VehicleFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;

  selectedType: string;
  onSelectedType: (value: string) => void;

  selectedBrand: string;
  onSelectedBrand: (value: string) => void;

  sortBy: SortOption["value"];
  onSortBy: (value: SortOption["value"]) => void;

  types: string[];
  brands: string[];
  sortOptions?: readonly SortOption[];
  resultCount: number;
  minimumRange: number;
  onMinimumRange: (value: number) => void;
  priceBand: string;
  onPriceBand: (value: string) => void;
  verifiedOnly: boolean;
  onVerifiedOnly: (value: boolean) => void;
  onReset: () => void;
  embedded?: boolean;
};

const DEFAULT_SORT_OPTIONS: readonly SortOption[] = [
  { value: "recommended", label: "Recommended" },
  { value: "range-desc", label: "Range (high to low)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "name-asc", label: "Name (A–Z)" },
];

export default function VehicleFilters({
  query,
  onQueryChange,
  selectedType,
  onSelectedType,
  selectedBrand,
  onSelectedBrand,
  sortBy,
  onSortBy,
  types,
  brands,
  sortOptions = DEFAULT_SORT_OPTIONS,
  resultCount,
  minimumRange,
  onMinimumRange,
  priceBand,
  onPriceBand,
  verifiedOnly,
  onVerifiedOnly,
  onReset,
  embedded = false,
}: VehicleFiltersProps) {
  const featuredTypes = types.slice(1, 5);

  return (
    <section className={embedded ? "overflow-hidden rounded-[2rem] border border-white/10 bg-[#071321]/90 shadow-2xl shadow-black/30 backdrop-blur" : "border-y border-white/10 bg-white/[0.02]"}>
      <div className={embedded ? "p-5 sm:p-7" : "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
              Search and filter
            </div>

            <h2 className={`mt-4 font-semibold tracking-tight text-white ${embedded ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
              Find the right EV, faster.
            </h2>

            <p className={`${embedded ? "mt-3 text-sm leading-6" : "mt-4 text-base leading-7"} text-slate-400`}>
              Search by brand, type, charging, price, or range. Then narrow the
              lineup with premium filters and sort by what matters most.
            </p>

            <p className="mt-4 text-sm text-slate-500">
              Showing {resultCount} result{resultCount === 1 ? "" : "s"}.
            </p>
          </div>

          <div className={`flex flex-wrap gap-3 ${embedded ? "lg:hidden" : ""}`}>
            {featuredTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onSelectedType(type)}
                className={[
                  "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition",
                  selectedType === type
                    ? "border-sky-400/25 bg-sky-400 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={`${embedded ? "mt-6 rounded-2xl" : "mt-8 rounded-[2rem]"} border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur lg:p-5`}>
          <div className={`grid gap-3 md:grid-cols-2 ${embedded ? "xl:grid-cols-3" : "xl:grid-cols-[1.3fr_repeat(5,0.7fr)]"}`}>
            <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-sm">
              <Search className="h-4 w-4 text-sky-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search vehicles, brands, types, range, price..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                aria-label="Search vehicles"
              />
            </label>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                value={selectedType}
                onChange={(e) => onSelectedType(e.target.value)}
                aria-label="Body style"
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === "All types" ? "All body styles" : type}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => onSelectedBrand(e.target.value)}
              className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select value={priceBand} onChange={(event) => onPriceBand(event.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none" aria-label="Starting price range">
              <option value="all">Any starting price</option>
              <option value="under-10">Under ₹10 lakh</option>
              <option value="10-15">₹10–15 lakh</option>
              <option value="15-25">₹15–25 lakh</option>
              <option value="25-50">₹25–50 lakh</option>
              <option value="above-50">Above ₹50 lakh</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => onSortBy(e.target.value as SortOption["value"])}
              className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select value={minimumRange} onChange={(e) => onMinimumRange(Number(e.target.value))} className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white outline-none" aria-label="Minimum driving range">
              <option value={0}>Any range</option>
              <option value={300}>300+ km range</option>
              <option value={400}>400+ km range</option>
              <option value={500}>500+ km range</option>
              <option value={600}>600+ km range</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {sortBy === "recommended" ? <p className="basis-full text-xs leading-5 text-slate-400"><span className="font-semibold text-sky-200">Recommended:</span> balances listed range, starting-price value, verified charging evidence and body-style practicality. It is not sponsored or personalised financial advice.</p> : null}
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300"><input type="checkbox" checked={verifiedOnly} onChange={(event) => onVerifiedOnly(event.target.checked)} className="h-4 w-4 accent-emerald-400" />Verified trip specs only</label>

            <button
              type="button"
              onClick={onReset}
              className="min-h-11 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

