import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Electric Cars, Charging and EV Tools",
  description: "Search PlugV for electric cars in India, vehicle comparisons, charging stations, upcoming EVs and ownership tools.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) { return children; }
