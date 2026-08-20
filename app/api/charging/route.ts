import { NextResponse } from "next/server";
import {
  searchChargingStations,
  type ChargingSort,
} from "@/lib/charging/chargingRepository";

const allowedSorts: ChargingSort[] = [
  "recommended",
  "distance-asc",
  "power-desc",
  "name-asc",
];

function getBoolean(value: string | null) {
  return value === "true";
}

function getNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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

    const result = searchChargingStations({
      state: searchParams.get("state") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      search: searchParams.get("search") ?? "",
      fastOnly: getBoolean(searchParams.get("fastOnly")),
      ccs2Only: getBoolean(searchParams.get("ccs2Only")),
      chademoOnly: getBoolean(searchParams.get("chademoOnly")),
      sortBy,
      limit: getNumber(searchParams.get("limit"), 12),
      offset: getNumber(searchParams.get("offset"), 0),
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