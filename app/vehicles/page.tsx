import { vehicles } from "@/data/vehicles";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";
import VehiclesClient from "./VehiclesClient";
export default async function VehiclesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
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

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionSchema) }} /><VehiclesClient key={query} initialQuery={query} /></>;
}
