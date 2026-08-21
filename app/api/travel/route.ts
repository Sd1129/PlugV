import { NextRequest, NextResponse } from "next/server";

type OsrmRoute = {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
};

const routingProviders = [
  "https://router.project-osrm.org/route/v1/driving",
  "https://routing.openstreetmap.de/routed-car/route/v1/driving",
] as const;

async function requestRoute(provider: string, coordinates: string) {
  try {
    const response = await fetch(
      `${provider}/${coordinates}?overview=full&geometries=geojson`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "PlugV-Travel/1.0 (https://plugv.in)",
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as { code?: string; routes?: OsrmRoute[] };
    if (payload.code !== "Ok") return null;
    return payload.routes?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get("origin")?.split(",").map(Number);
  const destination = request.nextUrl.searchParams.get("destination")?.split(",").map(Number);

  if (
    origin?.length !== 2 ||
    destination?.length !== 2 ||
    origin.some((value) => !Number.isFinite(value)) ||
    destination.some((value) => !Number.isFinite(value))
  ) {
    return NextResponse.json({ error: "A valid origin and destination are required." }, { status: 400 });
  }

  const coordinates = `${origin[1]},${origin[0]};${destination[1]},${destination[0]}`;

  for (const provider of routingProviders) {
    const route = await requestRoute(provider, coordinates);
    if (route) {
      return NextResponse.json({
        distanceKm: Math.round(route.distance / 1000),
        durationMinutes: Math.round(route.duration / 60),
        geometry: route.geometry.coordinates,
      });
    }
  }

  return NextResponse.json(
    { error: "Driving directions are temporarily unavailable. Please try again in a moment." },
    { status: 503, headers: { "Retry-After": "30" } }
  );
}
