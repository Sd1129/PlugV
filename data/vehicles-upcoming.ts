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
  range?: string;
  battery?: string;
  features: string[];
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
};

export const upcomingVehicles: UpcomingVehicle[] = [
  {
    brand: "Hyundai",
    name: "India-focused A-segment EV",
    segment: "Compact electric SUV",
    launch: "Officially targeted for Q4 2026",
    note: "Hyundai Motor has officially confirmed an all-new, locally designed A-segment electric SUV for India. The production name has not yet been announced.",
    slug: "hyundai-india-a-segment-ev",
    status: "Official announcement",
    launchYear: 2026,
    features: ["Designed for India", "Localised programme", "Level 2 driver assistance"],
    sourceName: "Hyundai Motor Company",
    sourceUrl: "https://www.hyundai.com/worldwide/en/newsroom/detail/0000001260",
    verifiedAt: "2026-08-26",
  },
  {
    brand: "JSW MG",
    name: "ADAPT Platform EV",
    segment: "New-energy vehicle",
    launch: "One EV targeted by FY 2026–27",
    note: "JSW MG Motor India has officially confirmed that one EV and one PHEV will debut on its new ADAPT architecture. The model name and specifications have not yet been announced.",
    slug: "jsw-mg-adapt-ev",
    status: "Manufacturer target",
    launchYear: 2027,
    features: ["ADAPT platform", "India programme", "Fast-charging focus"],
    sourceName: "JSW MG Motor India",
    sourceUrl: "https://www.mgmotor.co.in/media-center/newsroom/jsw-mg-motor-india-unveils-mg-adapt-indias-first-multi-new-energy-vehicle",
    verifiedAt: "2026-08-21",
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
    range: "Up to 600 km (preliminary)",
    features: ["Seven seats", "800V architecture", "Advanced safety"],
    sourceName: "Volvo Cars India",
    sourceUrl: "https://www.volvocars.com/in/cars/electric-cars/",
    verifiedAt: "2026-08-21",
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
    features: ["Compact footprint", "Urban EV", "Showcased in India"],
    sourceName: "VinFast India",
    sourceUrl: "https://vinfastauto.in/en/press-release/vinfast-officially-enters-the-indian-market-unveils-vf7-and-vf6",
    verifiedAt: "2026-08-21",
  },
  {
    brand: "Honda",
    name: "0 Alpha",
    segment: "Midsize electric SUV",
    launch: "India testing underway; date not announced",
    note: "Honda Cars India has begun public-road verification of its first upcoming battery-electric SUV across Indian conditions, including heat, monsoons and charging infrastructure.",
    slug: "honda-0-alpha",
    status: "Manufacturer target",
    launchYear: "Timing not announced",
    features: ["India road testing", "Global 0 Series", "India-focused validation"],
    sourceName: "Honda Cars India",
    sourceUrl: "https://m.hondacarindia.com/press-release/honda-flags-off-pan-india-test-run-first-upcoming-electric-suv",
    verifiedAt: "2026-08-21",
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
    range: "500 km added in under 30 min",
    features: ["GEN 3 architecture", "Ultra-fast charging", "Human-centred cabin"],
    sourceName: "Tata.ev",
    sourceUrl: "https://ev.tatamotors.com/concept-cars/avinya.html",
    verifiedAt: "2026-08-21",
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
    features: ["Developed for India", "Local production strategy", "Compact SUV"],
    sourceName: "Kia Corporation",
    sourceUrl: "https://worldwide.kia.com/files/investors/ir-activities/vg/197839585/bkhu/197909819osjp.pdf",
    verifiedAt: "2026-08-26",
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
    features: ["INGLO platform", "Electric AWD concept", "Modular design"],
    sourceName: "Mahindra Electric Automobiles",
    sourceUrl: "https://www.mahindraelectricsuv.com/on/demandware.static/-/Library-Sites-MEASharedLibrary/default/dw2fc90bd9/mahindraelectricimages/BEV/pdfs/thare.pdf",
    verifiedAt: "2026-08-21",
  },
  {
    brand: "Toyota",
    name: "FT-3e",
    segment: "Concept SUV",
    launch: "No India launch announced",
    note: "Toyota's next-generation battery-electric SUV concept exploring personalised services, energy sharing and software-led ownership.",
    slug: "toyota-ft-3e",
    status: "Official concept",
    launchYear: "Timing not announced",
    features: ["Next-gen BEV", "Software-defined", "Energy and data sharing"],
    sourceName: "Toyota Global Newsroom",
    sourceUrl: "https://global.toyota/en/newsroom/corporate/39886279.html",
    verifiedAt: "2026-08-21",
  },
];
