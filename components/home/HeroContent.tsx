import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type HeroContentProps = {
  badge?: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function HeroContent({
  badge = "India's EV Intelligence Platform",
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: HeroContentProps) {
  return (
    <div className="relative z-10 max-w-3xl">
      {/* Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 backdrop-blur">
        <Sparkles className="h-4 w-4 text-sky-300" />

        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
          {badge}
        </span>
      </div>

      {/* Headline */}

      <h1 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
        {title}
      </h1>

      {/* Description */}

      <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-300">
        {description}
      </p>

      {/* CTA */}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          {primaryLabel}

          <ArrowRight className="h-4 w-4" />
        </Link>

        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>

      {/* Trust strip */}

      <div className="mt-12 flex flex-wrap gap-3">
        {[
          "150+ EVs",
          "AI Guidance",
          "Charging Intelligence",
          "India Focused",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-slate-300 backdrop-blur"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}