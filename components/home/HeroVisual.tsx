"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  Gauge,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

type HeroVisualProps = {
  title: string;
  subtitle?: string;
  score?: string;
  range?: string;
  charging?: string;
  availability?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        <span className="text-sky-300">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
        {value}
      </div>
    </div>
  );
}

export default function HeroVisual({
  title = "Mahindra BE 6 hero",
  subtitle = "Premium electric SUV built for long-distance confidence and everyday intelligence.",
  score = "92",
  range = "663 km",
  charging = "321 bhp",
  availability = "Available",
  ctaLabel = "View Vehicle",
  ctaHref = "/vehicles",
  imageSrc = "/images/hero/plugv-hero-v3.webp",
  imageAlt = "Mahindra BE 6 hero",
  className = "",
}: HeroVisualProps) {
  return (
    <motion.article
      className={[
        "overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-[0_30px_100px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl",
        className,
      ].join(" ")}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="relative h-[420px] overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[center_18%]"
          />
        </div>

        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.18)_0%,rgba(2,6,23,0.06)_42%,rgba(2,6,23,0.12)_100%)]" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.08),transparent_28%)]" />

        <motion.div
          className="pointer-events-none absolute left-[58%] top-[-8px] z-20 -translate-x-1/2"
          animate={{
            rotate: [-6, 6, -6],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/images/effects/spotlight.png"
            alt=""
            width={190}
            height={190}
            className="h-24 w-auto object-contain drop-shadow-[0_0_22px_rgba(125,211,252,0.55)]"
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-[58%] top-[64px] z-10 -translate-x-1/2"
          animate={{
            rotate: [-3, 3, -3],
            opacity: [0.72, 1, 0.72],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="
              h-[300px]
              w-[350px]
              bg-[linear-gradient(to_bottom,rgba(255,255,255,0.30),rgba(125,211,252,0.18)_26%,rgba(125,211,252,0.08)_50%,transparent_88%)]
              [clip-path:polygon(43%_0,57%_0,100%_100%,0_100%)]
              blur-xl
              mix-blend-screen
            "
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-[58%] top-[38%] z-10 h-52 w-[68%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,255,255,0.35)_0%,rgba(56,189,248,0.18)_32%,transparent_74%)] blur-2xl mix-blend-screen"
          animate={{
            opacity: [0.65, 1, 0.65],
            scale: [0.96, 1.04, 0.96],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute left-6 top-6 z-30 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 text-sky-300" />
          SPOTLIGHT VEHICLE
        </div>

        <div className="absolute right-6 top-6 z-30 rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200 backdrop-blur-xl">
          PlugV
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-950/55 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
              PlugV Score
            </p>

            <div className="mt-2 flex items-end gap-4">
              <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {score}
              </p>
              <p className="pb-1 text-sm leading-6 text-slate-300">{subtitle}</p>
            </div>

            <p className="mt-2 text-sm font-medium text-white/90">{title}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<Gauge className="h-4 w-4" />} label="Range" value={range} />
            <Stat
              icon={<BatteryCharging className="h-4 w-4" />}
              label="Charge"
              value={charging}
            />
            <Stat
              icon={<Zap className="h-4 w-4" />}
              label="Status"
              value={availability}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 hover:shadow-lg hover:shadow-sky-400/20"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}