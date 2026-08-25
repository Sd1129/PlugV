import HeroContent from "@/components/home/HeroContent";
import HeroVisual from "@/components/home/HeroVisual";
import HeroShell from "@/components/design/HeroShell";
import TrustStrip from "@/components/design/TrustStrip";
import MotionReveal from "@/components/design/MotionReveal";

type HeroProps = {
  badge?: string;
  title: string;
  description: string;

  primaryLabel: string;
  primaryHref: string;

  secondaryLabel?: string;
  secondaryHref?: string;

  visualTitle: string;
  visualSubtitle?: string;
  visualScore?: string;
  visualRange?: string;
  visualCharging?: string;
  visualAvailability?: string;

  visualCtaLabel?: string;
  visualCtaHref?: string;

  backgroundImageSrc?: string;
  backgroundImageAlt?: string;

  trustItems?: {
    label: string;
    value?: string;
  }[];
};

export default function Hero({
  badge,
  title,
  description,

  primaryLabel,
  primaryHref,

  secondaryLabel,
  secondaryHref,

  visualTitle,
  visualSubtitle,
  visualScore,
  visualRange,
  visualCharging,
  visualAvailability,

  visualCtaLabel,
  visualCtaHref,

  backgroundImageSrc,
  backgroundImageAlt,

  trustItems = [
    { label: "150+ EVs" },
    { label: "AI Guidance" },
    { label: "Charging Intelligence" },
    { label: "India Focused" },
  ],
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient hero background */}
      <div className="absolute inset-0 -z-20 bg-slate-950" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.10),transparent_30%)]" />

      <HeroShell>
        {/* LEFT SIDE — MAIN HERO CONTENT */}
        <MotionReveal delay={0.05}>
          <HeroContent
            badge={badge}
            title={title}
            description={description}
            primaryLabel={primaryLabel}
            primaryHref={primaryHref}
            secondaryLabel={secondaryLabel}
            secondaryHref={secondaryHref}
          />
        </MotionReveal>

        {/* RIGHT SIDE — SPOTLIGHT VEHICLE */}
        <MotionReveal delay={0.15} y={24}>
          <HeroVisual
            title={visualTitle}
            subtitle={visualSubtitle}
            score={visualScore}
            range={visualRange}
            charging={visualCharging}
            availability={visualAvailability}
            ctaLabel={visualCtaLabel}
            ctaHref={visualCtaHref}
            imageSrc={
              backgroundImageSrc ?? "/images/plugv-owned/plugv-home-hero-2026-08.png"
            }
            imageAlt={backgroundImageAlt ?? visualTitle}
          />
        </MotionReveal>
      </HeroShell>

      {/* TRUST STRIP */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <MotionReveal delay={0.25} y={14}>
          <TrustStrip items={trustItems} />
        </MotionReveal>
      </div>
    </section>
  );
}
