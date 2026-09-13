import { pageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...pageSocialMetadata("My EV — EV Owner Hub", "Calculate charging costs, manage service and insurance reminders, save trips and chargers, configure owner alerts, and access emergency assistance.", "/my-ev"),
  title: "My EV — EV Owner Hub",
  description: "Calculate charging costs, manage service and insurance reminders, save trips and chargers, configure owner alerts, and access emergency assistance.",
  alternates: { canonical: "/my-ev" },
};

export default function MyEvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
