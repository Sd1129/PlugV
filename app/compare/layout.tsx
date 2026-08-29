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
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "How should I compare two electric cars?", acceptedAnswer: { "@type": "Answer", text: "Compare the exact variants across price, claimed and practical range, battery, AC and DC charging, safety, space, warranty, service reach and ownership cost." } },
      { "@type": "Question", name: "Are PlugV comparison prices on-road prices?", acceptedAnswer: { "@type": "Answer", text: "Vehicle prices are generally indicative ex-showroom listings unless explicitly labelled otherwise. Obtain a current city- and variant-specific on-road quotation before purchasing." } },
      { "@type": "Question", name: "Does a longer claimed range guarantee longer real-world range?", acceptedAnswer: { "@type": "Answer", text: "No. Speed, traffic, climate control, temperature, elevation, load, tyres and the test method can change practical range." } },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(applicationSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />{children}</>;
}
