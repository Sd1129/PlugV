import { pageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageSocialMetadata("EV Charging Stations in India", "Find EV charging stations in Indian cities with connector, charging speed, distance and status-verification information.", "/charging"),
  title: "EV Charging Stations in India",
  description: "Find EV charging stations in Indian cities with connector, charging speed, distance and status-verification information.",
  alternates: { canonical: "/charging" },
};

export default function ChargingLayout({ children }: { children: React.ReactNode }) {
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PlugV EV Charging Station Search",
    url: absoluteUrl("/charging"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    description: "Search known public electric vehicle charging stations by city in India and review available connector, speed and status information.",
    featureList: ["City-based charger search", "Connector information", "Charging-speed labels", "Availability information when supplied"],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(applicationSchema) }} />{children}</>;
}
