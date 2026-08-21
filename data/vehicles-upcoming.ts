export type UpcomingVehicle = {
  brand: string;
  name: string;
  segment: string;
  launch: string;
  note: string;
  slug: string;
  status: "Manufacturer target" | "Official concept";
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
    brand: "Tata",
    name: "Avinya",
    segment: "Premium EV",
    launch: "Targeted for 2027",
    note: "Tata's next-generation pure-EV family, focused on space, calm design, software and ultra-fast charging.",
    slug: "tata-avinya",
    status: "Manufacturer target",
    range: "500 km added in under 30 min",
    features: ["GEN 3 architecture", "Ultra-fast charging", "Human-centred cabin"],
    sourceName: "Tata.ev",
    sourceUrl: "https://ev.tatamotors.com/concept-cars/avinya.html",
    verifiedAt: "2026-08-21",
  },
  {
    brand: "Mahindra",
    name: "Vision Thar.e",
    segment: "Adventure SUV",
    launch: "No production date announced",
    note: "A born-electric interpretation of the Thar identity, presented with an AWD powertrain and modular construction.",
    slug: "mahindra-thar-e",
    status: "Official concept",
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
    features: ["Next-gen BEV", "Software-defined", "Energy and data sharing"],
    sourceName: "Toyota Global Newsroom",
    sourceUrl: "https://global.toyota/en/newsroom/corporate/39886279.html",
    verifiedAt: "2026-08-21",
  },
];
