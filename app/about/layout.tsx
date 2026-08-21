import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PlugV — India's EV Intelligence Platform",
  description: "Learn how PlugV helps EV buyers and owners across India discover vehicles, compare choices, find charging and plan confident journeys.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) { return children; }
