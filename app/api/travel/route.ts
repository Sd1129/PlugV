import { NextRequest, NextResponse } from "next/server";

type OsrmRoute = {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
};

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

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "The route could not be calculated." }, { status: 502 });
    }

    const payload = (await response.json()) as { routes?: OsrmRoute[] };
    const route = payload.routes?.[0];

    if (!route) {
      return NextResponse.json({ error: "No driving route was found." }, { status: 404 });
    }

    return NextResponse.json({
      distanceKm: Math.round(route.distance / 1000),
      durationMinutes: Math.round(route.duration / 60),
      geometry: route.geometry.coordinates,
    });
  } catch {
    return NextResponse.json({ error: "Route service is unavailable." }, { status: 503 });
  }
}
