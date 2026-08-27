import type { ChargingStation } from "@/data/charging/types";

export type CityCoverage = {
  city: string;
  state: string;
  stationCount: number;
  latitude: number;
  longitude: number;
};

export type ChargingCoverageAudit = {
  generatedAt: string;
  totalStations: number;
  citiesCovered: number;
  statesCovered: number;
  officialStations: number;
  communityStations: number;
  lowCoverageCities: CityCoverage[];
  topCities: CityCoverage[];
};

const METRO_RADII_KM: Record<string, number> = {
  ahmedabad: 45,
  bengaluru: 55,
  bangalore: 55,
  chennai: 50,
  delhi: 65,
  gurugram: 45,
  hyderabad: 55,
  kolkata: 50,
  mumbai: 60,
  "new delhi": 65,
  noida: 45,
  pune: 50,
};

const SOURCE_PRIORITY: Record<string, number> = {
  OFFICIAL: 4,
  MANUAL: 3,
  CRAWLED: 2,
  USER_SUBMITTED: 1,
};

export function normalizePlace(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const radius = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(a));
}

function sourcePriority(station: ChargingStation) {
  return SOURCE_PRIORITY[station.trust?.sourceType ?? "CRAWLED"] ?? 0;
}

function usefulOperator(value: string) {
  const normalized = normalizePlace(value);
  return normalized && !["operator not listed", "unknown operator", "ev"].includes(normalized);
}

function tokenSimilarity(a: string, b: string) {
  const aTokens = new Set(normalizePlace(a).split(" ").filter((token) => token.length > 2));
  const bTokens = new Set(normalizePlace(b).split(" ").filter((token) => token.length > 2));
  if (!aTokens.size || !bTokens.size) return 0;
  const shared = [...aTokens].filter((token) => bTokens.has(token)).length;
  return shared / Math.min(aTokens.size, bTokens.size);
}

function samePhysicalStation(a: ChargingStation, b: ChargingStation) {
  const distance = haversineKm(a.latitude, a.longitude, b.latitude, b.longitude);
  if (distance <= 0.04) return true;
  if (distance > 0.2) return false;

  const operatorsMatch =
    usefulOperator(a.operator) &&
    usefulOperator(b.operator) &&
    normalizePlace(a.operator) === normalizePlace(b.operator);
  return operatorsMatch || tokenSimilarity(a.name, b.name) >= 0.6;
}

function mergeStationDetails(primary: ChargingStation, secondary: ChargingStation): ChargingStation {
  return {
    ...primary,
    phone: primary.phone || secondary.phone,
    website: primary.website || secondary.website,
    openingHours: primary.openingHours || secondary.openingHours,
    connectors: {
      ccs2: primary.connectors.ccs2 || secondary.connectors.ccs2,
      chademo: primary.connectors.chademo || secondary.connectors.chademo,
      acType2: primary.connectors.acType2 || secondary.connectors.acType2,
      gbt: primary.connectors.gbt || secondary.connectors.gbt,
    },
    charging: {
      ...primary.charging,
      ac: primary.charging.ac || secondary.charging.ac,
      dcFast: primary.charging.dcFast || secondary.charging.dcFast,
      maxPowerKW: Math.max(primary.charging.maxPowerKW, secondary.charging.maxPowerKW),
      lastChecked: primary.charging.lastChecked || secondary.charging.lastChecked,
    },
    amenities: Array.from(new Set([...(primary.amenities ?? []), ...(secondary.amenities ?? [])])),
  };
}

export function deduplicateStations(stations: ChargingStation[]) {
  const result: ChargingStation[] = [];
  const grid = new Map<string, number[]>();
  const gridSize = 0.002;

  function cell(value: number) {
    return Math.floor(value / gridSize);
  }

  function cellKey(latCell: number, lngCell: number) {
    return `${latCell}:${lngCell}`;
  }

  for (const station of [...stations].sort((a, b) => sourcePriority(b) - sourcePriority(a))) {
    const latCell = cell(station.latitude);
    const lngCell = cell(station.longitude);
    const nearbyIndexes: number[] = [];
    for (let latOffset = -1; latOffset <= 1; latOffset += 1) {
      for (let lngOffset = -1; lngOffset <= 1; lngOffset += 1) {
        nearbyIndexes.push(...(grid.get(cellKey(latCell + latOffset, lngCell + lngOffset)) ?? []));
      }
    }

    const duplicateIndex = nearbyIndexes.find((index) => samePhysicalStation(result[index], station)) ?? -1;
    if (duplicateIndex === -1) {
      const resultIndex = result.push(station) - 1;
      const key = cellKey(latCell, lngCell);
      grid.set(key, [...(grid.get(key) ?? []), resultIndex]);
      continue;
    }
    result[duplicateIndex] = mergeStationDetails(result[duplicateIndex], station);
  }

  return result;
}

export function buildCityCoverage(stations: ChargingStation[]) {
  const groups = new Map<string, ChargingStation[]>();
  for (const station of stations) {
    const key = `${normalizePlace(station.city)}|${normalizePlace(station.state)}`;
    groups.set(key, [...(groups.get(key) ?? []), station]);
  }

  return [...groups.values()].map((cityStations) => ({
    city: cityStations[0].city,
    state: cityStations[0].state,
    stationCount: cityStations.length,
    latitude: cityStations.reduce((sum, station) => sum + station.latitude, 0) / cityStations.length,
    longitude: cityStations.reduce((sum, station) => sum + station.longitude, 0) / cityStations.length,
  } satisfies CityCoverage));
}

export function findCityCoverage(stations: ChargingStation[], city: string) {
  const normalized = normalizePlace(city);
  return buildCityCoverage(stations).find((entry) => normalizePlace(entry.city) === normalized);
}

export function cityRadiusKm(city: string) {
  return METRO_RADII_KM[normalizePlace(city)] ?? 30;
}

export function auditChargingCoverage(stations: ChargingStation[]): ChargingCoverageAudit {
  const cities = buildCityCoverage(stations);
  return {
    generatedAt: new Date().toISOString(),
    totalStations: stations.length,
    citiesCovered: cities.length,
    statesCovered: new Set(stations.map((station) => normalizePlace(station.state))).size,
    officialStations: stations.filter((station) => station.trust?.sourceType === "OFFICIAL").length,
    communityStations: stations.filter((station) => station.trust?.sourceType === "CRAWLED").length,
    lowCoverageCities: cities
      .filter((entry) => entry.stationCount < 3)
      .sort((a, b) => a.stationCount - b.stationCount || a.city.localeCompare(b.city)),
    topCities: [...cities]
      .sort((a, b) => b.stationCount - a.stationCount || a.city.localeCompare(b.city))
      .slice(0, 25),
  };
}
