import { pageSocialMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...pageSocialMetadata("Search EV Models and PlugV Pages", "Find listed electric-car models, upcoming EVs and links to PlugV tools by keyword.", "/search"),
  title: "Search EV Models and PlugV Pages",
  description: "Find listed electric-car models, upcoming EVs and links to PlugV tools by keyword.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) { return children; }
