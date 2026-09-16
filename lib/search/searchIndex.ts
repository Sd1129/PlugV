import { vehicles } from "@/data/vehicles";
import { upcomingVehicles } from "@/data/vehicles-upcoming";

export type SearchCategory = "vehicle" | "upcoming" | "charging" | "company";

export type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  keywords: string[];
};

export const searchIndex: SearchItem[] = [
  ...vehicles.map((vehicle) => ({
    id: vehicle.slug,
    title: vehicle.name,
    subtitle: `${vehicle.brand} • ${vehicle.type} • ${vehicle.status}`,
    category: "vehicle" as const,
    href: `/vehicles/${vehicle.slug}`,
    keywords: [
      vehicle.name,
      vehicle.brand,
      vehicle.type,
      vehicle.status,
      vehicle.range ?? "",
      vehicle.price ?? "",
      vehicle.charging ?? "",
    ],
  })),
  ...upcomingVehicles.map((item) => ({
    id: item.slug,
    title: item.name,
    subtitle: item.launch || item.note || "Upcoming EV",
    category: "upcoming" as const,
    href: `/upcoming/${item.slug}`,
    keywords: [item.brand, item.name, item.launch ?? "", item.note ?? ""],
  })),
  {
    id: "charging",
    title: "Charging stations",
    subtitle: "Open the charging finder to search by city and connector",
    category: "charging",
    href: "/charging",
    keywords: ["charging", "stations", "map", "connectors", "route planning"],
  },
  {
    id: "compare",
    title: "Compare EVs",
    subtitle: "Compare vehicles side by side",
    category: "company",
    href: "/compare",
    keywords: ["compare", "comparison", "range", "price", "charging"],
  },
  {
    id: "about",
    title: "About PlugV",
    subtitle: "Learn what PlugV stands for",
    category: "company",
    href: "/about",
    keywords: ["about", "plugv", "company", "mission", "platform"],
  },
];