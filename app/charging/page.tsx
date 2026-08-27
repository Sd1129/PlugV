"use client";

import ChargingHero from "@/components/charging/ChargingHero";
import ChargingControls from "@/components/charging/ChargingControls";
import ChargingMiniMap from "@/components/charging/ChargingMiniMap";
import StationCard from "@/components/charging/StationCard";
import ChargingStats from "@/components/charging/ChargingStats";
import CityBanner from "@/components/charging/CityBanner";
import { useChargingStations } from "@/hooks/useChargingStations";

import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import DataTrustNotice from "@/components/trust/DataTrustNotice";

const PAGE_SIZE = 100;

const CITY_IMAGES: Record<string, string> = {
  Hyderabad: "/images/cities/hyderabad.webp",
  Bengaluru: "/images/cities/bengaluru.webp",
  Mumbai: "/images/cities/mumbai.webp",
  "New Delhi": "/images/cities/new-delhi.webp",
  Pune: "/images/cities/pune.webp",
  Chennai: "/images/cities/chennai.webp",
  Ahmedabad: "/images/cities/ahmedabad.webp",
  Jaipur: "/images/cities/jaipur.webp",
  Tirupati: "/images/cities/tirupati.png",
  Tirupathi: "/images/cities/tirupati.png",
};

const STATE_IMAGES: Record<string, string> = {
  "Andhra Pradesh": "/images/cities/tirupati.png",
};

function getCityImage(city: string, state: string) {
  return CITY_IMAGES[city] ?? STATE_IMAGES[state] ?? "/images/cities/hyderabad.webp";
}

export default function ChargingPage() {
  const charging = useChargingStations(PAGE_SIZE);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <ChargingHero />
      <DataTrustNotice message="A listed charger is not guaranteed to be operational or free. Live status appears only when an operator feed provides it." />

      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.08),transparent_28%)]" />

        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <ChargingControls
            searchQuery={charging.searchQuery}
            suggestions={charging.suggestions}
            sortBy={charging.sortBy}
            fastOnly={charging.fastOnly}
            ccs2Only={charging.ccs2Only}
            chademoOnly={charging.chademoOnly}
            nearbyMode={charging.nearbyMode}
            userLocation={charging.userLocation}
            locationLoading={charging.locationLoading}
            locationNote={charging.locationNote}
            onSearchQueryChange={charging.setSearchQuery}
            onSuggestionSelect={charging.setSearchQuery}
            onFastOnlyToggle={charging.toggleFastOnly}
            onCcs2OnlyToggle={charging.toggleCcs2Only}
            onChademoOnlyToggle={charging.toggleChademoOnly}
            onSortByChange={charging.setSortBy}
            onUseMyLocation={charging.useMyLocation}
            onBackToCitySearch={charging.backToCitySearch}
          />

          <ChargingStats
            total={charging.total}
            showing={charging.showing}
            remaining={charging.remaining}
            pageSize={PAGE_SIZE}
          />

          {charging.error ? (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {charging.error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="pb-16 pt-4 sm:pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <CityBanner
            city={charging.searchQuery.trim() || "India"}
            state=""
            total={charging.total}
            imageSrc={getCityImage(charging.searchQuery.trim(), "")}
          />

          {charging.loading && charging.stations.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-sky-400" />
              <p className="mt-4 text-sm text-slate-400">
                Loading charging stations...
              </p>
            </div>
          ) : null}

          {charging.stations.length > 0 ? (
            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid gap-4 md:grid-cols-2">
                {charging.stations.map((station) => {
                  const active = charging.selectedStation?.id === station.id;

                  return (
                    <div
                      key={station.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => charging.setSelectedStation(station)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          charging.setSelectedStation(station);
                        }
                      }}
                      className={[
                        "cursor-pointer rounded-2xl transition",
                        active ? "ring-1 ring-sky-400/40" : "",
                      ].join(" ")}
                    >
                      <StationCard
                        station={station}
                        distanceLabel={
                          charging.distanceByStationId[station.id] ?? null
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <aside className="hidden xl:block">
                <div className="sticky top-24">
                  <ChargingMiniMap
                    stations={charging.stations}
                    selectedStation={charging.selectedStation}
                    onSelectStation={charging.setSelectedStation}
                    city={charging.searchQuery.trim()}
                    distanceByStationId={charging.distanceByStationId}
                  />
                </div>
              </aside>
            </div>
          ) : !charging.loading && !charging.error ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
              <p className="text-xl font-semibold text-white">
                No charging stations found.
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Try another city, search term, or turn off one of the charging
                filters.
              </p>
            </div>
          ) : null}

          {charging.canLoadMore ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={charging.loadMore}
                disabled={charging.loading}
                className="inline-flex min-w-[160px] cursor-pointer items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 px-6 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-400 hover:text-slate-950 disabled:cursor-wait disabled:opacity-50"
              >
                {charging.loading ? "Loading..." : "Load More"}
              </button>

              <p className="text-xs text-slate-500">
                Showing {charging.showing} of {charging.total} stations
              </p>
            </div>
          ) : charging.stations.length > 0 ? (
            <p className="mt-8 text-center text-xs text-slate-500">
              Showing all {charging.total} station
              {charging.total === 1 ? "" : "s"} in this result.
            </p>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
