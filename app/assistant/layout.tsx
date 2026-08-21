import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Assistant India — Find the Right Electric Car",
  description: "Tell PlugV your budget and driving needs to get an explainable shortlist of electric cars available in India.",
  alternates: { canonical: "/assistant" },
};

export default function AssistantLayout({ children }: { children: React.ReactNode }) { return children; }
