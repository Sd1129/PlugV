import type { Metadata } from "next";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compare Electric Cars in India",
  description: "Compare EV prices, range, DC charging speed and estimated electricity cost side by side with PlugV.",
  alternates: { canonical: "/compare" },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PlugV Electric Car Comparison",
    url: absoluteUrl("/compare"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    description: "Compare electric cars available in India across price, claimed range, charging, specifications and key features.",
    featureList: ["Side-by-side EV comparison", "Price and range comparison", "Charging comparison", "Variant specifications"],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(applicationSchema) }} />{children}</>;
}
