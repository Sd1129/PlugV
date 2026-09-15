import { vehicles } from "@/data/vehicles";
import { getCatalogueVariants } from "@/data/vehicle-variant-catalogue";

export const roads = ["City", "Highway", "Mixed"] as const;
export const temperatures = ["Below 20°C", "20–30°C", "Above 30°C"] as const;
export const speeds = ["Below 30 km/h", "30–60 km/h", "Above 60 km/h"] as const;
export type Trip = { slug: string; variant: string; modelYear: number; date: string; road: string; temperature: string; speed: string; ac: string; passengers: number; terrain: string; distance: number; start: number; end: number; energy: number | null; method: string; evidence: string; consent: true };

export function validateTrip(input: unknown): Trip {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw Error("Enter a trip report.");
  const x = input as Record<string, unknown>;
  const number = (key: string, min: number, max: number) => { const n = x[key]; if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max) throw Error(`Check ${key}.`); return n; };
  const choice = (key: string, allowed: readonly string[]) => { if (typeof x[key] !== "string" || !allowed.includes(x[key] as string)) throw Error(`Choose ${key}.`); return x[key] as string; };
  const slug = choice("slug", vehicles.map(v => v.slug));
  const variant = choice("variant", getCatalogueVariants(slug));
  const modelYear = number("modelYear", 2015, new Date().getUTCFullYear());
  const passengers = number("passengers", 1, 8);
  if (!Number.isInteger(modelYear) || !Number.isInteger(passengers)) throw Error("Year and occupants must be whole numbers.");
  const date = typeof x.date === "string" ? x.date : "";
  const day = new Date(date + "T00:00:00Z");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(day.getTime()) || day.toISOString().slice(0,10) !== date || day.getTime() > Date.now() || Date.now() - day.getTime() > 90 * 86400000) throw Error("Use a valid trip date within the last 90 days.");
  const start = number("start", 1, 100), end = number("end", 0, 99), distance = number("distance", 10, 1000);
  if (start - end < 10) throw Error("Use a trip consuming at least 10 percentage points, without charging during the trip.");
  const method = choice("method", ["Dashboard energy", "Charger energy", "Battery percentage"]);
  const energy = method === "Battery percentage" ? null : number("energy", 0.5, 200);
  if (energy !== null && (energy / distance < 0.04 || energy / distance > 0.6)) throw Error("Energy is outside our review range. Check kWh and distance units.");
  const evidence = typeof x.evidence === "string" ? x.evidence.trim() : "";
  if (evidence.length < 20 || evidence.length > 1000) throw Error("Provide 20–1000 characters describing the readings and measurement method.");
  if (x.consent !== true) throw Error("Consent is required.");
  return { slug, variant, modelYear, date, road: choice("road", roads), temperature: choice("temperature", temperatures), speed: choice("speed", speeds), ac: choice("ac", ["On", "Off"]), passengers, terrain: choice("terrain", ["Mostly flat", "Hilly"]), distance, start, end, method, energy, evidence, consent: true };
}

export function summarizeTrips(rows: { contributor: string; payload: Trip }[]) {
  const groups = new Map<string, { trip: Trip; values: Map<string, number[]>; count: number; latest: string }>();
  for (const { contributor, payload: t } of rows) {
    // Old reports remain stored for moderation but cannot make a current cohort.
    if (Date.now() - Date.parse(t.date) > 90 * 86400000) continue;
    const key = JSON.stringify([t.slug,t.variant,t.modelYear,t.road,t.temperature,t.speed,t.ac,t.passengers,t.terrain,t.method]);
    const g = groups.get(key) ?? { trip: t, values: new Map<string, number[]>(), count: 0, latest: t.date };
    const value = t.method === "Battery percentage" ? t.distance / (t.start-t.end) * 100 : t.energy! / t.distance * 100;
    g.values.set(contributor, [...(g.values.get(contributor) ?? []), value]); g.count++; g.latest = t.date > g.latest ? t.date : g.latest; groups.set(key,g);
  }
  return [...groups.values()].filter(g=>g.count >= 5 && g.values.size >= 3).map(g=> {
    const values = [...g.values.values()].map(a=>a.reduce((x,y)=>x+y,0)/a.length).sort((a,b)=>a-b);
    const median = values.length % 2 ? values[(values.length-1)/2] : (values[values.length/2-1]+values[values.length/2])/2;
    const { slug, variant, modelYear, road, temperature, speed, ac, passengers, terrain, method } = g.trip;
    const conditions = { slug, variant, modelYear, road, temperature, speed, ac, passengers, terrain, method };
    return { conditions, trips: g.count, contributors: values.length, median, low: values[0], high: values.at(-1)!, latest: g.latest };
  });
}

