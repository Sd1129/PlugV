import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Trip Planner India — Route, Range & Charging Stops",
  description: "Plan electric-car trips across India with route distance, duration, compatible chargers and practical charging-stop guidance.",
  alternates: { canonical: "/travel" },
};

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
