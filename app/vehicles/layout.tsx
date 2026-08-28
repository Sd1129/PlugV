import type { Metadata } from "next";
import { vehicles } from "@/data/vehicles";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Electric Cars in India — Prices, Range & Charging",
  description: "Explore electric cars in India by brand, body type, price, claimed range and verified charging data on PlugV.",
  alternates: { canonical: "/vehicles" },
};

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  const launchedVehicles = vehicles.filter((vehicle) => vehicle.launched);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Electric Cars in India",
    description: "Explore launched electric cars in India by price, claimed range, body type and charging information.",
    url: absoluteUrl("/vehicles"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: launchedVehicles.length,
      itemListElement: launchedVehicles.map((vehicle, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/vehicles/${vehicle.slug}`),
        name: `${vehicle.brand} ${vehicle.name}`,
      })),
    },
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionSchema) }} />{children}</>;
}
