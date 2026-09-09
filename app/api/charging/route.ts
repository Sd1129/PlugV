import { NextResponse } from "next/server";
import {
  searchChargingStations,
  type ChargingConnector,
  type ChargingSort,
} from "@/lib/charging/chargingRepository";

const allowedSorts: ChargingSort[] = [
  "recommended",
  "distance-asc",
  "power-desc",
  "name-asc",
];
const allowedConnectors: ChargingConnector[] = ["ccs2", "type2", "chademo", "gbt", "bharat-ac", "bharat-dc"];

function getBoolean(value: string | null) {
  return value === "true";
}

function getNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedSort = searchParams.get("sortBy");
    const sortBy: ChargingSort =
      requestedSort && allowedSorts.includes(requestedSort as ChargingSort)
        ? (requestedSort as ChargingSort)
        : "recommended";

    const originLatRaw = searchParams.get("originLat");
    const originLngRaw = searchParams.get("originLng");

    const originLat = originLatRaw ? Number(originLatRaw) : undefined;
    const originLng = originLngRaw ? Number(originLngRaw) : undefined;
    const requestedConnector = searchParams.get("connector");
    const connector = requestedConnector && allowedConnectors.includes(requestedConnector as ChargingConnector)
      ? requestedConnector as ChargingConnector
      : undefined;

    const result = await searchChargingStations({
      state: searchParams.get("state") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      search: searchParams.get("search") ?? "",
      fastOnly: getBoolean(searchParams.get("fastOnly")),
      ccs2Only: getBoolean(searchParams.get("ccs2Only")),
      chademoOnly: getBoolean(searchParams.get("chademoOnly")),
      connector,
      operator: searchParams.get("operator") ?? undefined,
      minPowerKW: clamp(getNumber(searchParams.get("minPowerKW"), 0), 0, 1000),
      maxPowerKW: searchParams.has("maxPowerKW") ? clamp(getNumber(searchParams.get("maxPowerKW"), 1000), 0, 1000) : undefined,
      liveOnly: getBoolean(searchParams.get("liveOnly")),
      reservableOnly: getBoolean(searchParams.get("reservableOnly")),
      sortBy,
      limit: clamp(getNumber(searchParams.get("limit"), 12), 1, 100),
      offset: clamp(getNumber(searchParams.get("offset"), 0), 0, 10_000),
      originLat: Number.isFinite(originLat) ? originLat : undefined,
      originLng: Number.isFinite(originLng) ? originLng : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Charging API error:", error);

    return NextResponse.json(
      { error: "Unable to load charging stations." },
      { status: 500 }
    );
  }
}
