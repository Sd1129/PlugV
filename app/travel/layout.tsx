import type { Metadata } from "next";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "EV Trip Planner India — Route, Range & Charging Stops",
  description: "Plan electric-car trips across India with route distance, duration, compatible chargers and practical charging-stop guidance.",
  alternates: { canonical: "/travel" },
};

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PlugV EV Trip Planner India",
    url: absoluteUrl("/travel"),
    applicationCategory: "TravelApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    description: "Plan electric-car journeys in India using route distance, duration, practical range and charging-stop estimates.",
    featureList: ["Route distance", "Journey duration", "Practical EV range planning", "Charging-stop guidance"],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(applicationSchema) }} />{children}</>;
}
