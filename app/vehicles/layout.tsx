import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electric Cars in India — Prices, Range & Charging",
  description: "Explore electric cars in India by brand, body type, price, claimed range and verified charging data on PlugV.",
  alternates: { canonical: "/vehicles" },
};

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
