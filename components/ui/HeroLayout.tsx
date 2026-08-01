import type { ReactNode } from "react";
import PageContainer from "@/components/ui/PageContainer";

type HeroLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function HeroLayout({ children, className = "" }: HeroLayoutProps) {
  return (
    <section className="relative overflow-hidden border-b border-emerald-200 bg-[radial-gradient(circle_at_top,#f7fff5_0%,#e6f2e3_48%,#d9ead4_100%)]">
      <PageContainer className="relative py-14 lg:py-20">
        <div className={`grid items-center gap-10 lg:grid-cols-[1fr_1.06fr] ${className}`}>
          {children}
        </div>
      </PageContainer>
    </section>
  );
}