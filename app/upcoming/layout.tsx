import type { Metadata } from "next";
import { upcomingVehicles } from "@/data/vehicles-upcoming";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Upcoming Electric Cars in India: Official Launch Tracker",
  description: "Explore officially announced and manufacturer-targeted upcoming electric cars in India for the current and next year, with clear launch status and primary sources.",
  keywords: ["upcoming electric cars in India", "upcoming EV cars India", "new electric cars India", "future EV launches India"],
  alternates: { canonical: "/upcoming" },
  openGraph: {
    type: "website",
    url: "/upcoming",
    title: "Upcoming Electric Cars in India | PlugV.in",
    description: "A source-checked tracker of upcoming EV cars, manufacturer targets and official concepts relevant to India.",
    images: [{ url: "/brand/plugv-social-card.png", width: 1200, height: 630 }],
  },
};

export default function UpcomingLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Upcoming Electric Cars in India ${currentYear}–${nextYear}`,
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
