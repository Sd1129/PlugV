import type { Metadata } from "next";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { absoluteUrl, safeJsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PlugV | Electric Cars, Charging Stations & EV Comparison India",
    template: "%s | PlugV",
  },
  description:
    "Discover electric cars in India, compare EV prices and range, find charging stations, and plan EV trips with PlugV.",
  applicationName: SITE_NAME,
  keywords: [
    "electric cars India",
    "EV cars India",
    "compare electric cars",
    "EV charging stations India",
    "best EV cars",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: "PlugV — India's EV Discovery and Ownership Platform",
    description:
      "Compare electric cars, understand real-world range, find chargers, and plan EV journeys across India.",
    images: [{ url: "/images/hero/plugv-hero-v3.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlugV — India's EV Platform",
    description: "Electric cars, comparisons, charging and EV travel in one place.",
    images: ["/images/hero/plugv-hero-v3.webp"],
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/logo-icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "India-focused electric vehicle discovery, comparison, charging and travel platform.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/vehicles")}?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-slate-950 text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
