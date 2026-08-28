import type { MetadataRoute } from "next";
import { vehicles } from "@/data/vehicles";
import { upcomingVehicles } from "@/data/vehicles-upcoming";
import { knowledgeArticles } from "@/data/knowledge-articles";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/vehicles", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/best-ev-cars-under-25-lakh", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/compare", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/charging", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/travel", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/upcoming", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/knowledge", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/assistant", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/my-ev", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/founder", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/methodology", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: updated,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...vehicles.map((vehicle) => ({
      url: absoluteUrl(`/vehicles/${vehicle.slug}`),
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...upcomingVehicles.map((vehicle) => ({
      url: absoluteUrl(`/upcoming/${vehicle.slug}`),
      lastModified: new Date(`${vehicle.verifiedAt}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...knowledgeArticles.map((article) => ({
      url: absoluteUrl(`/knowledge/${article.slug}`),
      lastModified: new Date(`${article.updatedAt}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: article.calculator ? 0.9 : 0.8,
    })),
  ];
}
