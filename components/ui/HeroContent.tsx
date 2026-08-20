"use client";

import { ReactNode } from "react";
import {
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import HeroBadge from "@/components/ui/HeroBadge";
import StatCard from "@/components/ui/StatCard";

type HeroContentProps = {
  badge?: string;
  title: string;
  subtitle: string;

  primaryCta?: {
    label: string;
    href: string;
  };

  secondaryCta?: {
    label: string;
    href: string;
  };

  stats?: {
    label: string;
    value: string;
    description?: string;
    icon?: ReactNode;
  }[];
};

const benefits = [
  "Compare EVs side by side",
  "Discover charging stations",
  "Track upcoming launches",
  "PlugV Decision Score™",
];

export default function HeroContent({
  badge = "PlugV Decision Platform",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  stats = [],
}: HeroContentProps) {
  return (
    <div className="max-w-3xl">

      <HeroBadge>
        <BadgeCheck className="h-4 w-4" />
        {badge}
      </HeroBadge>

      <h1 className="mt-7 text-[2.5rem] font-black leading-[1.03] tracking-[-0.04em] text-emerald-950 md:text-[3.5rem] lg:text-[4.5rem]">
        {title}
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        {subtitle}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {primaryCta && (
          <Button href={primaryCta.href} icon>
            {primaryCta.label}
          </Button>
        )}

        {secondaryCta && (
          <Button
            href={secondaryCta.href}
            variant="secondary"
          >
            {secondaryCta.label}
          </Button>
        )}
      </div>

      {/* WHY PLUGV */}

      <div className="mt-10 grid gap-3 sm:grid-cols-2">

        {benefits.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />

            <span className="font-medium text-slate-700">
              {item}
            </span>
          </div>
        ))}

      </div>

      {stats.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">

          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}

        </div>
      )}
    </div>
  );
}