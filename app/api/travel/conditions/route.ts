import { NextRequest, NextResponse } from "next/server";

type ForecastPoint = {
  latitude?: number;
  longitude?: number;
  elevation?: number;
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    precipitation?: number;
    wind_speed_10m?: number;
    time?: string;
  };
};

function coordinates(value: string | null) {
  const [latitude, longitude] = (value ?? "").split(",").map(Number);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < 5 || latitude > 38 || longitude < 67 || longitude > 99) return null;
  return { latitude, longitude };
}

export async function GET(request: NextRequest) {
  const origin = coordinates(request.nextUrl.searchParams.get("origin"));
  const destination = coordinates(request.nextUrl.searchParams.get("destination"));
  if (!origin || !destination) return NextResponse.json({ error: "Valid Indian origin and destination coordinates are required." }, { status: 400 });

  const query = new URLSearchParams({
    latitude: `${origin.latitude},${destination.latitude}`,
    longitude: `${origin.longitude},${destination.longitude}`,
    current: "temperature_2m,apparent_temperature,precipitation,wind_speed_10m",
    timezone: "auto",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
    const raw = (await response.json()) as ForecastPoint | ForecastPoint[];
    const points = Array.isArray(raw) ? raw : [raw];
    const normalise = (point: ForecastPoint | undefined) => ({
      temperatureC: point?.current?.temperature_2m ?? null,
      feelsLikeC: point?.current?.apparent_temperature ?? null,
      precipitationMm: point?.current?.precipitation ?? null,
      windKph: point?.current?.wind_speed_10m ?? null,
      elevationM: point?.elevation ?? null,
      observedAt: point?.current?.time ?? null,
    });
    return NextResponse.json({ origin: normalise(points[0]), destination: normalise(points[1] ?? points[0]), source: "Open-Meteo", trafficAvailable: false });
  } catch {
    return NextResponse.json({ error: "Weather and elevation context is temporarily unavailable." }, { status: 503 });
  }
}
