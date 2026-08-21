import type { Metadata } from "next";
import { upcomingVehicles } from "@/data/vehicles-upcoming";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Upcoming Electric Cars in India 2026–2027: Launch Tracker",
  description: "Explore upcoming electric cars in India for 2026–2027 with manufacturer-confirmed targets, expected launch timing, range information and official sources.",
  keywords: ["upcoming electric cars in India", "upcoming EV cars India 2026", "new electric cars India", "future EV launches India"],
  alternates: { canonical: "/upcoming" },
  openGraph: {
    type: "website",
    url: "/upcoming",
    title: "Upcoming Electric Cars in India 2026–2027 | PlugV.in",
    description: "A source-checked tracker of upcoming EV cars, manufacturer targets and official concepts relevant to India.",
    images: [{ url: "/brand/plugv-social-card.png", width: 1200, height: 630 }],
  },
};

export default function UpcomingLayout({ children }: { children: React.ReactNode }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Upcoming Electric Cars in India 2026–2027",
    url: absoluteUrl("/upcoming"),
    numberOfItems: upcomingVehicles.length,
    itemListElement: upcomingVehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Car",
        name: `${vehicle.brand} ${vehicle.name}`,
        description: vehicle.note,
        url: `${absoluteUrl("/upcoming")}#${vehicle.slug}`,
        brand: { "@type": "Brand", name: vehicle.brand },
      },
    })),
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }} />{children}</>;
}
