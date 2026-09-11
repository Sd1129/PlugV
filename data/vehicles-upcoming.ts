import { launchedVehicles } from "@/data/vehicles-launched";

export type UpcomingVehicle = {
  brand: string;
  name: string;
  segment: string;
  launch: string;
  note: string;
  slug: string;
  status: "Official announcement" | "Manufacturer target" | "Official concept";
  launchYear: number | "Timing not announced";
  expectedPrice?: string;
  priceBasis?: "PlugV planning estimate" | "Manufacturer announced";
  range?: string;
  battery?: string;
  features: string[];
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
};

export const upcomingVehicleCandidates: UpcomingVehicle[] = [
  {
    brand: "Hyundai",
    name: "India-focused A-segment EV",
    segment: "Compact electric SUV",
    launch: "Officially targeted for Q4 2026",
    note: "Hyundai Motor has officially confirmed an all-new, locally designed A-segment electric SUV for India. The production name has not yet been announced.",
    slug: "hyundai-india-a-segment-ev",
    status: "Official announcement",
    launchYear: 2026,
    range: "Not announced",
    battery: "Not announced",
    features: ["Designed for India", "Localised programme", "Level 2 driver assistance"],
    sourceName: "Hyundai Motor Company",
    sourceUrl: "https://www.hyundai.com/worldwide/en/newsroom/detail/0000001260",
    verifiedAt: "2026-09-11",
  },
  {
    brand: "Honda",
    name: "0 Alpha",
    segment: "Midsize electric SUV",
    launch: "Global sales targeted from 2027, mainly Japan and India",
    note: "Honda has officially named India as a principal market for the production 0 Alpha from 2027. Final India timing and specifications remain unannounced.",
    slug: "honda-0-alpha",
    status: "Official announcement",
    launchYear: 2027,
    range: "Not announced",
    battery: "Not announced",
    features: ["Production model planned", "Honda 0 Series", "India named as a principal market"],
    sourceName: "Honda Motor Co.",
    sourceUrl: "https://global.honda/en/newsroom/news/2025/4251029aeng.html",
    verifiedAt: "2026-09-11",
  },
];

export const upcomingCatalogueLastUpdated = upcomingVehicleCandidates
  .map((vehicle) => vehicle.verifiedAt)
  .sort()
  .at(-1) ?? "Not recorded";

const normalizeVehicleIdentity = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const launchedSlugs = new Set(launchedVehicles.map((vehicle) => vehicle.slug));
const launchedNames = new Set(
  launchedVehicles.map((vehicle) =>
    normalizeVehicleIdentity(`${vehicle.brand}${vehicle.name}`)
  )
);

// Explore EVs is the source of truth. As soon as a verified launched model is
// added there, it is removed from every Upcoming consumer automatically.
export const upcomingVehicles = upcomingVehicleCandidates.filter(
  (vehicle) =>
    !launchedSlugs.has(vehicle.slug) &&
    !launchedNames.has(normalizeVehicleIdentity(`${vehicle.brand}${vehicle.name}`))
);
