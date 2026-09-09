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
    expectedPrice: "₹10–16 lakh",
    priceBasis: "PlugV planning estimate",
    range: "Not announced",
    battery: "Not announced",
    features: ["Designed for India", "Localised programme", "Level 2 driver assistance"],
    sourceName: "Hyundai Motor Company",
    sourceUrl: "https://www.hyundai.com/worldwide/en/newsroom/detail/0000001260",
    verifiedAt: "2026-09-07",
  },
  {
    brand: "Volvo",
    name: "EX90",
    segment: "Luxury 7-seat SUV",
    launch: "Listed by Volvo India; sale date not announced",
    note: "Volvo Cars India includes the EX90 in its electric range information. A final Indian sale date and local pricing have not been announced.",
    slug: "volvo-ex90",
    status: "Manufacturer target",
    launchYear: "Timing not announced",
    expectedPrice: "₹1.2–1.5 crore",
    priceBasis: "PlugV planning estimate",
    range: "Up to 600 km (preliminary)",
    battery: "111 kWh nominal (global specification)",
    features: ["Seven seats", "800V architecture", "Advanced safety"],
    sourceName: "Volvo Cars India",
    sourceUrl: "https://www.volvocars.com/in/cars/electric-cars/",
    verifiedAt: "2026-09-07",
  },
  {
    brand: "VinFast",
    name: "VF 3",
    segment: "Compact urban EV",
    launch: "Showcased in India; launch not announced",
    note: "VinFast officially showcased the VF 3 at Bharat Mobility Global Expo 2025, but named the VF 6 and VF 7 as its first India-market models. A VF 3 India launch is not confirmed.",
    slug: "vinfast-vf-3",
    status: "Official concept",
    launchYear: "Timing not announced",
    expectedPrice: "₹8–12 lakh",
    priceBasis: "PlugV planning estimate",
    range: "Not announced for India",
    battery: "Not announced for India",
    features: ["Compact footprint", "Urban EV", "Showcased in India"],
    sourceName: "VinFast India",
    sourceUrl: "https://vinfastauto.in/en/press-release/vinfast-officially-enters-the-indian-market-unveils-vf7-and-vf6",
    verifiedAt: "2026-09-07",
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
    expectedPrice: "₹25–35 lakh",
    priceBasis: "PlugV planning estimate",
    range: "Not announced",
    battery: "Not announced",
    features: ["India road testing", "Global 0 Series", "India-focused validation"],
    sourceName: "Honda Motor Co.",
    sourceUrl: "https://global.honda/en/newsroom/news/2025/4251029aeng.html",
    verifiedAt: "2026-09-09",
  },
  {
    brand: "Tata",
    name: "Avinya",
    segment: "Premium EV",
    launch: "Targeted for 2027",
    note: "Tata's next-generation pure-EV family, focused on space, calm design, software and ultra-fast charging.",
    slug: "tata-avinya",
    status: "Manufacturer target",
    launchYear: 2027,
    expectedPrice: "₹35–50 lakh",
    priceBasis: "PlugV planning estimate",
    range: "Not announced",
    battery: "Not announced",
    features: ["GEN 3 architecture", "Ultra-fast charging", "Human-centred cabin"],
    sourceName: "Tata.ev",
    sourceUrl: "https://ev.tatamotors.com/concept-cars/avinya.html",
    verifiedAt: "2026-09-07",
  },
  {
    brand: "Kia",
    name: "Locally developed B-SUV EV",
    segment: "Compact electric SUV",
    launch: "Official roadmap target from 2027",
    note: "Kia's official emerging-markets roadmap confirms a locally developed B-SUV EV for India from 2027. The production name, exact launch date and specifications have not yet been announced.",
    slug: "kia-india-b-suv-ev",
    status: "Manufacturer target",
    launchYear: 2027,
    expectedPrice: "₹15–22 lakh",
    priceBasis: "PlugV planning estimate",
    range: "Not announced",
    battery: "Not announced",
    features: ["Developed for India", "Local production strategy", "Compact SUV"],
    sourceName: "Kia Corporation",
    sourceUrl: "https://worldwide.kia.com/files/investors/ir-activities/vg/197839585/bkhu/197909819osjp.pdf",
    verifiedAt: "2026-09-07",
  },
  {
    brand: "Mahindra",
    name: "Vision Thar.e",
    segment: "Adventure SUV",
    launch: "No production date announced",
    note: "A born-electric interpretation of the Thar identity, presented with an AWD powertrain and modular construction.",
    slug: "mahindra-thar-e",
    status: "Official concept",
    launchYear: "Timing not announced",
    expectedPrice: "₹25–40 lakh",
    priceBasis: "PlugV planning estimate",
    range: "Not announced",
    battery: "Not announced",
    features: ["INGLO platform", "Electric AWD concept", "Modular design"],
    sourceName: "Mahindra Electric Automobiles",
    sourceUrl: "https://www.mahindraelectricsuv.com/on/demandware.static/-/Library-Sites-MEASharedLibrary/default/dw2fc90bd9/mahindraelectricimages/BEV/pdfs/thare.pdf",
    verifiedAt: "2026-09-07",
  },
  {
    brand: "Mahindra",
    name: "BE.07",
    segment: "Family electric SUV concept",
    launch: "Original manufacturer target: October 2026",
    note: "Mahindra's 2022 Born Electric roadmap assigned the BE.07 an October 2026 target. PlugV retains this as a dated manufacturer target until a newer official launch update is published.",
    slug: "mahindra-be-07",
    status: "Manufacturer target",
    launchYear: 2026,
    expectedPrice: "₹30–40 lakh",
    priceBasis: "PlugV planning estimate",
    range: "Not announced for BE.07",
    battery: "60–80 kWh platform envelope; model pack not announced",
    features: ["INGLO platform concept", "Family SUV format", "Original October 2026 target"],
    sourceName: "Mahindra & Mahindra",
    sourceUrl: "https://www.mahindra.com/news-room/press-release/en/mahindra-unveils-five-electrifying-suvs-under-two-brands-based-on-the-purpose-built-inglo-platform",
    verifiedAt: "2026-09-09",
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
import { launchedVehicles } from "@/data/vehicles-launched";
