import type { Metadata } from "next";
export function pageSocialMetadata(title: string, description: string, url: string): Metadata {
  const images = [{ url: "/brand/plugv-social-card.png", width: 1200, height: 630, alt: "PlugV — electric vehicle information for India" }];
  return { openGraph: { type: "website", title, description, url, siteName: "PlugV.in", images }, twitter: { card: "summary_large_image", site: "@plugvplatform", title, description, images: ["/brand/plugv-social-card.png"] } };
}
