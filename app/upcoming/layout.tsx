import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Electric Cars in India",
  description: "Track upcoming EV cars, official concepts and manufacturer launch targets in India without confusing rumours with confirmed information.",
  alternates: { canonical: "/upcoming" },
};

export default function UpcomingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
