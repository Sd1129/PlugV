import { NextRequest, NextResponse } from "next/server";

type NominatimPlace = {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2 || query.length > 120) {
    return NextResponse.json({ places: [] });
  }

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "in",
    limit: "5",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
          "User-Agent": "PlugV Travel Planner",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ places: [] }, { status: 502 });
    }

    const results = (await response.json()) as NominatimPlace[];
    const places = results.map((place) => {
      const locality =
        place.address?.city ?? place.address?.town ?? place.address?.village ?? place.display_name.split(",")[0];
      const region = place.address?.state;

      return {
        id: `${place.lat},${place.lon}`,
        label: region ? `${locality}, ${region}` : locality,
        detail: place.display_name,
        latitude: Number(place.lat),
        longitude: Number(place.lon),
        type: place.type,
      };
    });

    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ places: [] }, { status: 503 });
  }
}
