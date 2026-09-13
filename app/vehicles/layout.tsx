import { pageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";



export const metadata: Metadata = {
  ...pageSocialMetadata("Electric Cars in India — Prices, Range & Charging", "Explore electric cars in India by brand, body type, price, claimed range and recorded charging information on PlugV.", "/vehicles"),
  title: "Electric Cars in India — Prices, Range & Charging",
  description: "Explore electric cars in India by brand, body type, price, claimed range and recorded charging information on PlugV.",
  alternates: { canonical: "/vehicles" },
};

export default function VehiclesLayout({ children }: { children: React.ReactNode }) { return children; }
