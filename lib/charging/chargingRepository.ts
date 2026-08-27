import { chargingStations } from "@/data/charging/stations";
import type { ChargingStation } from "@/data/charging/types";
import { prisma } from "@/lib/prisma";

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

function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) *
      Math.cos(toRad(bLat)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

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

  if (city && CITY_CENTERS[city]) {
    return CITY_CENTERS[city];
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

  let filtered = collection.filter((station) => {
    if (state && station.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }

    if (city && station.city.toLowerCase() !== city.toLowerCase()) {
      return false;
    }

    if (fastOnly && !station.charging.dcFast) return false;
    if (ccs2Only && !station.connectors.ccs2) return false;
    if (chademoOnly && !station.connectors.chademo) return false;
    if (!matchesSearch(station, search)) return false;

    return true;
  });

  filtered = [...filtered];

  const origin = getOrigin(city, originLat, originLng);

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
  };
}

async function databaseStations(): Promise<ChargingStation[]> {
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
  try {
    const synchronized = await databaseStations();
    if (synchronized.length > 0) return searchStationCollection(synchronized, query);
  } catch (error) {
    console.error("Charging database unavailable; using bundled fallback data.", error);
  }

  return searchStationCollection(chargingStations, query);
}
