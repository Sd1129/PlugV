"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ChargingHero() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
      <Image
  src="/images/plugv-owned/plugv-charging-hero-2026-08.png"
  alt="PlugV charging station hero"
  fill
  priority
  sizes="100vw"
  className="object-cover object-center"
/>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.90)_0%,rgba(2,6,23,0.68)_34%,rgba(2,6,23,0.25)_60%,rgba(2,6,23,0.14)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(56,189,248,0.16),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-[560px] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Charging Finder
          </div>

          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
            EV Charging Stations in India.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/95 sm:text-base">
            Select a state and city to see charging stations, addresses, contact details,
            fast charging support, connector compatibility, and directions.
          </p>

          <div className="mt-8">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Explore EVs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
