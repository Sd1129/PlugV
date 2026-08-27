import { chargingStations } from "@/data/charging/stations";
import type { ChargingStation } from "@/data/charging/types";
import {
  auditChargingCoverage,
  cityRadiusKm,
  deduplicateStations,
  findCityCoverage,
  haversineKm,
  normalizePlace,
} from "@/lib/charging/stationCoverage";

export type ChargingSort =
  | "recommended"
  | "distance-asc"
  | "power-desc"
  | "name-asc";

export type ChargingQuery = {
  state?: string;
  city?: string;
  search?: string;
  fastOnly?: boolean;
  ccs2Only?: boolean;
  chademoOnly?: boolean;
  sortBy?: ChargingSort;
  limit?: number;
  offset?: number;
  originLat?: number;
  originLng?: number;
};

export type ChargingResult = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  stations: ChargingStation[];
  states: string[];
  citiesByState: Record<string, string[]>;
  suggestions: string[];
  coverage: {
    mode: "india" | "city-radius" | "location";
    city?: string;
    radiusKm?: number;
  };
};

const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  "New Delhi": { lat: 28.6139, lng: 77.209 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
};

function getOrigin(
  city: string | undefined,
  originLat?: number,
  originLng?: number
): { lat: number; lng: number } | undefined {
  if (
    Number.isFinite(originLat) &&
    Number.isFinite(originLng)
  ) {
    return { lat: originLat as number, lng: originLng as number };
  }

  if (city) {
    const known = Object.entries(CITY_CENTERS).find(([name]) => normalizePlace(name) === normalizePlace(city));
    if (known) return known[1];
  }

  return undefined;
}

function matchesSearch(station: ChargingStation, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;

  const text = [
    station.name,
    station.operator,
    station.address,
    station.city,
    station.state,
    station.openingHours ?? "",
    station.phone ?? "",
    station.website ?? "",
    ...(station.amenities ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(q);
}

function stationDistanceKm(
  station: ChargingStation,
  origin?: { lat: number; lng: number }
): number {
  if (!origin) return Number.POSITIVE_INFINITY;

  return haversineKm(
    origin.lat,
    origin.lng,
    station.latitude,
    station.longitude
  );
}

function searchStationCollection(
  collection: ChargingStation[],
  query: ChargingQuery = {}
): ChargingResult {
  const {
    state,
    city,
    search = "",
    fastOnly = false,
    ccs2Only = false,
    chademoOnly = false,
    sortBy = "recommended",
    limit = 12,
    offset = 0,
    originLat,
    originLng,
  } = query;

  const safeLimit = Math.min(Math.max(limit, 1), 500);
  const safeOffset = Math.max(offset, 0);
  const states = Array.from(new Set(collection.map((station) => station.state))).sort();
  const citiesByState = Object.fromEntries(
    states.map((stateName) => [
      stateName,
      Array.from(
        new Set(
          collection
            .filter((station) => station.state === stateName)
            .map((station) => station.city)
        )
      ).sort(),
    ])
  );

  const cityCoverage = city ? findCityCoverage(collection, city) : undefined;
  const cityOrigin = cityCoverage
    ? { lat: cityCoverage.latitude, lng: cityCoverage.longitude }
    : getOrigin(city, originLat, originLng);
  const radiusKm = city ? cityRadiusKm(city) : undefined;

  let filtered = collection.filter((station) => {
    if (state && station.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }

    if (city) {
      const exactCity = normalizePlace(station.city) === normalizePlace(city);
      const withinMetro = cityOrigin && radiusKm
        ? haversineKm(cityOrigin.lat, cityOrigin.lng, station.latitude, station.longitude) <= radiusKm
        : false;
      if (!exactCity && !withinMetro) return false;
    }

    if (fastOnly && !station.charging.dcFast) return false;
    if (ccs2Only && !station.connectors.ccs2) return false;
    if (chademoOnly && !station.connectors.chademo) return false;
    if (!matchesSearch(station, search)) return false;

    return true;
  });

  filtered = [...filtered];

  const origin = cityOrigin ?? getOrigin(city, originLat, originLng);

  switch (sortBy) {
    case "distance-asc":
      filtered.sort((a, b) => stationDistanceKm(a, origin) - stationDistanceKm(b, origin));
      break;
    case "power-desc":
      filtered.sort((a, b) => b.charging.maxPowerKW - a.charging.maxPowerKW);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      filtered.sort((a, b) => {
        if (a.charging.dcFast !== b.charging.dcFast) {
          return a.charging.dcFast ? -1 : 1;
        }

        const powerDiff = b.charging.maxPowerKW - a.charging.maxPowerKW;
        if (powerDiff !== 0) return powerDiff;

        return a.name.localeCompare(b.name);
      });
      break;
  }

  const total = filtered.length;
  const stations = filtered.slice(safeOffset, safeOffset + safeLimit);
  const suggestionQuery = search.trim().toLowerCase();
  const suggestions = suggestionQuery
    ? Array.from(
        new Set(
          collection.map((station) => station.city)
        )
      )
        .filter((value) => value.toLowerCase().includes(suggestionQuery))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(suggestionQuery) ? 0 : 1;
          const bStarts = b.toLowerCase().startsWith(suggestionQuery) ? 0 : 1;
          return aStarts - bStarts || a.localeCompare(b);
        })
        .slice(0, 8)
    : [];

  return {
    total,
    limit: safeLimit,
    offset: safeOffset,
    hasMore: safeOffset + stations.length < total,
    stations,
    states,
    citiesByState,
    suggestions,
    coverage: originLat !== undefined && originLng !== undefined
      ? { mode: "location" }
      : city
        ? { mode: "city-radius", city, radiusKm }
        : { mode: "india" },
  };
}

async function databaseStations(): Promise<ChargingStation[]> {
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.station.findMany({
    include: {
      city: true,
      sources: { orderBy: { capturedAt: "desc" }, take: 1 },
    },
  });

  return rows.map((station) => {
    const source = station.sources[0];
    const sourceType =
      source?.sourceType === "OFFICIAL"
        ? "OFFICIAL"
        : source?.sourceType === "MANUAL"
          ? "MANUAL"
          : source?.sourceType === "USER_SUBMITTED"
            ? "USER_SUBMITTED"
            : "CRAWLED";

    return {
      id: station.id,
      name: station.name,
      operator: station.operator,
      state: station.city.state,
      city: station.city.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      phone: station.phone ?? undefined,
      website: station.website ?? undefined,
      openingHours: station.openingHours ?? undefined,
      directionsUrl:
        station.directionsUrl ??
        `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
      connectors: {
        ccs2: station.ccs2,
        chademo: station.chademo,
        acType2: station.acType2,
        gbt: station.gbt,
      },
      charging: {
        ac: station.chargingAc,
        dcFast: station.chargingDcFast,
        maxPowerKW: station.maxPowerKW,
        lastChecked: source?.capturedAt.toISOString(),
        reviewSource: source?.sourceName === "Open Charge Map" ? "community" : "plugv",
      },
      availability: { status: "unknown" },
      trust: {
        verified: station.sourceStatus === "VERIFIED",
        sourceType,
        sourceName: source?.sourceName,
        lastCheckedAt: source?.capturedAt.toISOString(),
      },
      amenities: station.amenities,
    } satisfies ChargingStation;
  });
}

export async function searchChargingStations(
  query: ChargingQuery = {}
): Promise<ChargingResult> {
  let synchronized: ChargingStation[] = [];
  try {
    synchronized = await databaseStations();
  } catch (error) {
    console.error("Charging database unavailable; using bundled fallback data.", error);
  }
  return searchStationCollection(deduplicateStations([...synchronized, ...chargingStations]), query);
}

export async function getChargingCoverageAudit() {
  let synchronized: ChargingStation[] = [];
  try {
    synchronized = await databaseStations();
  } catch (error) {
    console.error("Charging database unavailable during coverage audit.", error);
  }
  return auditChargingCoverage(deduplicateStations([...synchronized, ...chargingStations]));
}
