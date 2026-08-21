import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Electric Cars in India",
  description: "Compare EV prices, range, DC charging speed and estimated electricity cost side by side with PlugV.",
  alternates: { canonical: "/compare" },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
