import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My EV — EV Owner Hub",
  description: "Calculate charging costs, manage service and insurance reminders, save trips and chargers, configure owner alerts, and access emergency assistance.",
  alternates: { canonical: "/my-ev" },
};

export default function MyEvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
