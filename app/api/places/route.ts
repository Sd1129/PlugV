import { NextRequest, NextResponse } from "next/server";
import { chargingStations } from "@/data/charging/stations";

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

const majorIndianCities = [
  ["Ahmedabad", "Gujarat", 23.0225, 72.5714], ["Bengaluru", "Karnataka", 12.9716, 77.5946],
  ["Bhopal", "Madhya Pradesh", 23.2599, 77.4126], ["Bhubaneswar", "Odisha", 20.2961, 85.8245],
  ["Chandigarh", "Chandigarh", 30.7333, 76.7794], ["Chennai", "Tamil Nadu", 13.0827, 80.2707],
  ["Coimbatore", "Tamil Nadu", 11.0168, 76.9558], ["Gurugram", "Haryana", 28.4595, 77.0266],
  ["Hyderabad", "Telangana", 17.385, 78.4867], ["Indore", "Madhya Pradesh", 22.7196, 75.8577],
  ["Jaipur", "Rajasthan", 26.9124, 75.7873], ["Kochi", "Kerala", 9.9312, 76.2673],
  ["Kolkata", "West Bengal", 22.5726, 88.3639], ["Lucknow", "Uttar Pradesh", 26.8467, 80.9462],
  ["Mumbai", "Maharashtra", 19.076, 72.8777], ["Mysuru", "Karnataka", 12.2958, 76.6394],
  ["Nagpur", "Maharashtra", 21.1458, 79.0882], ["Nashik", "Maharashtra", 19.9975, 73.7898],
  ["New Delhi", "Delhi", 28.6139, 77.209], ["Noida", "Uttar Pradesh", 28.5355, 77.391],
  ["Patna", "Bihar", 25.5941, 85.1376], ["Pune", "Maharashtra", 18.5204, 73.8567],
  ["Surat", "Gujarat", 21.1702, 72.8311], ["Thiruvananthapuram", "Kerala", 8.5241, 76.9366],
  ["Vadodara", "Gujarat", 22.3072, 73.1812], ["Visakhapatnam", "Andhra Pradesh", 17.6868, 83.2185],
] as const;

type PlaceResult = { id: string; label: string; detail: string; latitude: number; longitude: number; type: string };

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: { name?: string; city?: string; district?: string; state?: string; country?: string; countrycode?: string; type?: string; osm_id?: number };
};

function localMatches(query: string): PlaceResult[] {
  const normalized = query.toLowerCase();
  const cities = majorIndianCities
    .filter(([city, state]) => `${city} ${state}`.toLowerCase().includes(normalized))
    .map(([city, state, latitude, longitude]) => ({ id: `city:${city}-${state}`, label: `${city}, ${state}`, detail: `${city}, ${state}, India`, latitude, longitude, type: "city" }));
  const stations = chargingStations
    .filter((station) => [station.name, station.operator, station.address, station.city, station.state].join(" ").toLowerCase().includes(normalized))
    .map((station) => ({ id: `station:${station.id}`, label: station.name, detail: `${station.address} · ${station.operator}`, latitude: station.latitude, longitude: station.longitude, type: "charging_station" }));
  return [...cities, ...stations].slice(0, 8);
}

async function photonMatches(query: string): Promise<PlaceResult[]> {
  try {
    const params = new URLSearchParams({ q: `${query}, India`, limit: "12", lang: "en", bbox: "68.1,6.5,97.4,35.7" });
    const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4500) });
    if (!response.ok) return [];
    const payload = await response.json() as { features?: PhotonFeature[] };
    return (payload.features ?? []).flatMap((feature) => {
      const coordinates = feature.geometry?.coordinates;
      const properties = feature.properties;
      if (!coordinates || !properties?.name) return [];
      const countryCode = properties.countrycode?.toLowerCase();
      if (countryCode && countryCode !== "in") return [];
      const locality = properties.city ?? properties.district;
      const detailParts = [properties.name, locality && locality !== properties.name ? locality : "", properties.state, properties.country ?? "India"].filter(Boolean);
      return [{ id: `photon:${properties.osm_id ?? `${coordinates[0]}-${coordinates[1]}`}`, label: properties.state ? `${properties.name}, ${properties.state}` : properties.name, detail: detailParts.join(", "), latitude: coordinates[1], longitude: coordinates[0], type: properties.type ?? "place" }];
    });
  } catch {
    return [];
  }
}

function mergePlaces(...groups: PlaceResult[][]): PlaceResult[] {
  const seen = new Set<string>();
  return groups.flat().filter((place) => {
    const key = `${place.label.toLowerCase()}-${place.latitude.toFixed(3)}-${place.longitude.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
}

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
    limit: "8",
  });

  const local = localMatches(query);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
          "User-Agent": "PlugV-Travel/1.0 (https://plugv.in)",
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4500),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ places: mergePlaces(local, await photonMatches(query)) });
    }

    const results = (await response.json()) as NominatimPlace[];
    const external = results.map((place) => {
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

    const places = mergePlaces(local, external, await photonMatches(query));
    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ places: mergePlaces(local, await photonMatches(query)) });
  }
}
