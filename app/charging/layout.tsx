import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Charging Stations in India",
  description: "Find EV charging stations in Indian cities with connector, charging speed, distance and availability information.",
  alternates: { canonical: "/charging" },
};

export default function ChargingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
