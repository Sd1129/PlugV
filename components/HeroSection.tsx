"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import PageContainer from "@/components/ui/PageContainer";

type HeroSectionProps = {
  featuredVehicleSlug?: string;
};

export default function HeroSection({
  featuredVehicleSlug = "mg-windsor-ev",
}: HeroSectionProps) {
  const featuredVehicle =
    vehicles.find((vehicle) => vehicle.slug === featuredVehicleSlug) ??
    vehicles.find((vehicle) => vehicle.launched) ??
    vehicles[0];

  return (
    <section className="relative overflow-hidden border-b border-emerald-200 bg-[linear-gradient(180deg,#d9ead4_0%,#cfe5cc_42%,#d9ead4_100%)]">
      <div className="absolute inset-0 opacity-35">
        <BlueprintBackdrop />
      </div>

      <PageContainer className="relative py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.08fr]">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Leaf className="h-4 w-4" />
              PlugV Featured Vehicle
              <span className="rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                Updated July 2026
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl text-[2.5rem] font-black leading-[1.05] tracking-[-0.03em] text-emerald-950 md:text-[3.4rem] lg:text-[4.2rem]">
              Discover electric mobility with PlugV
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-700 md:text-lg lg:text-[1.15rem]">
              Explore launched EVs, upcoming models, and charging stations in a clean,
              premium experience built for Indian EV buyers.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition duration-300 hover:bg-emerald-800 hover:shadow-xl"
              >
                Explore Vehicles
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/upcoming"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-7 py-3 text-base font-semibold text-emerald-800 transition duration-300 hover:bg-emerald-50"
              >
                View Upcoming EVs
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <MiniStat value="6+" label="Launched EVs" />
              <MiniStat value="4+" label="Upcoming EVs" />
              <MiniStat value="10+" label="Charging points" />
            </div>
          </div>

          <div className="relative lg:justify-self-end lg:pr-4">
            <div className="overflow-hidden rounded-[34px] border border-emerald-200 bg-[#c8e2bf] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/30 px-6 py-4">
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-950">
                  PlugV Featured Vehicle
                </div>
                <div className="rounded-full bg-emerald-700 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white shadow-lg">
                  Popular
                </div>
              </div>

              <div className="relative h-[560px] overflow-hidden">
                <div className="absolute inset-0 opacity-35">
                  <BlueprintBackdrop />
                </div>

                <div className="absolute inset-y-0 right-0 flex w-[76%] items-end justify-center">
                  <Image
                    src="/mg-windsor.png"
                    alt="MG Windsor EV"
                    width={900}
                    height={620}
                    priority
                    className="h-auto w-full object-contain drop-shadow-[0_24px_40px_rgba(15,95,45,0.22)]"
                  />
                </div>

                <div className="absolute right-8 top-8 rounded-full bg-white/40 px-4 py-2 text-xs font-bold tracking-[0.25em] text-emerald-950 backdrop-blur">
                  FEATURED MODEL
                </div>

                <div className="absolute bottom-6 left-6 w-[255px] rounded-[26px] bg-white p-5 shadow-[0_30px_60px_rgba(0,0,0,0.18)] sm:w-[275px]">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-[0.30em] text-emerald-700">
                      PlugV Featured EV
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Popular
                    </div>
                  </div>

                  <h2 className="mt-4 text-[26px] font-black leading-tight text-slate-900">
                    {featuredVehicle?.name ?? "MG Windsor EV"}
                  </h2>

                  <div className="mt-1 text-sm font-medium text-slate-500">
                    {featuredVehicle?.brand ?? "MG Motor"} •{" "}
                    {featuredVehicle?.type ?? "Crossover"}
                  </div>

                  <div className="mt-5 space-y-3">
                    <Row label="Range" value={featuredVehicle?.range ?? "331 km"} />
                    <Row label="Battery" value={featuredVehicle?.battery ?? "38 kWh"} />
                    <Row
                      label="Charging"
                      value={featuredVehicle?.charging ?? "55 min fast charge"}
                    />
                    <Row label="Price" value={featuredVehicle?.price ?? "₹13.99 lakh"} />
                  </div>

                  <Link
                    href={`/vehicles/${featuredVehicle?.slug ?? "mg-windsor-ev"}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-800"
                  >
                    View Vehicle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        <Sparkles className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function BlueprintBackdrop() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1200 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="160" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M 160 0 L 0 0 0 120"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        </pattern>

        <pattern id="parts" width="320" height="220" patternUnits="userSpaceOnUse">
          <rect width="320" height="220" fill="transparent" />
          <circle cx="60" cy="70" r="42" fill="none" stroke="#1f7a38" strokeOpacity="0.28" strokeWidth="2" />
          <circle cx="60" cy="70" r="16" fill="none" stroke="#1f7a38" strokeOpacity="0.22" strokeWidth="2" />
          <path
            d="M 180 42 h 70 l 18 18 v 26 h -98 z"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.24"
            strokeWidth="2"
          />
          <path
            d="M 190 122 c 18 -18 54 -18 74 0"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          <path d="M 34 176 h 110" fill="none" stroke="#1f7a38" strokeOpacity="0.22" strokeWidth="2" />
        </pattern>
      </defs>

      <rect width="1200" height="700" fill="url(#grid)" />
      <rect width="1200" height="700" fill="url(#parts)" />
    </svg>
  );
}