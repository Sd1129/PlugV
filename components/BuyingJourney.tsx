import {
    Compass,
    GitCompareArrows,
    ShieldCheck,
    PlugZap,
  } from "lucide-react";
  import PageContainer from "@/components/ui/PageContainer";
  import SectionTitle from "@/components/ui/SectionTitle";
  import StatCard from "@/components/ui/StatCard";
  
  export default function BuyingJourney() {
    return (
      <section className="border-b border-emerald-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf7_100%)]">
        <PageContainer className="py-16">
          <div className="flex flex-col gap-8">
            <SectionTitle
              eyebrow="Your EV Buying Journey"
              title="A clear path from discovery to decision"
              subtitle="PlugV is built to help Indian buyers move from browsing to choosing the right EV with confidence."
            />
  
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Discover"
                value="Browse EVs"
                description="Start with launched and upcoming electric vehicles."
                icon={<Compass className="h-4 w-4" />}
              />
              <StatCard
                label="Compare"
                value="See the difference"
                description="Check range, battery, charging, price, and fit."
                icon={<GitCompareArrows className="h-4 w-4" />}
              />
              <StatCard
                label="Decide"
                value="PlugV Score"
                description="Use a practical score to shortlist the right EV."
                icon={<ShieldCheck className="h-4 w-4" />}
              />
              <StatCard
                label="Drive"
                value="Charge with ease"
                description="Find charging stations and plan your next move."
                icon={<PlugZap className="h-4 w-4" />}
              />
            </div>
          </div>
        </PageContainer>
      </section>
    );
  }