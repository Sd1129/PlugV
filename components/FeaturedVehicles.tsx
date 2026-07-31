"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import PageContainer from "@/components/ui/PageContainer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export default function FeaturedVehicles() {
  const launchedVehicles = vehicles.filter((vehicle) => vehicle.launched).slice(0, 6);

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={fadeUp}
      className="border-b border-emerald-200 bg-white"
    >
      <PageContainer className="py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Featured vehicles
            </div>

            <h2 className="mt-5 text-[1.95rem] font-black leading-[1.05] tracking-[-0.03em] text-emerald-950 md:text-[2.4rem] lg:text-[2.9rem]">
              Popular EVs in India
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg lg:text-[1.15rem]">
              Explore the most popular electric vehicles available in India with a premium showroom-style layout.
            </p>
          </div>

          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition duration-300 hover:bg-emerald-100"
          >
            View all vehicles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={stagger}
          className="mt-8 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
        >
          {launchedVehicles.map((vehicle) => (
            <motion.div
              key={vehicle.slug}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="min-w-[220px] max-w-[220px] snap-start overflow-hidden rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf7_100%)] shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <Link href={`/vehicles/${vehicle.slug}`} className="block">
                <div className="relative bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#eaf5e7_100%)] p-3">
                  <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
                    EV
                  </div>

                  <img
                    src={`/vehicles/${vehicle.slug}.jpg`}
                    alt={vehicle.name}
                    className="h-28 w-full object-contain pt-8"
                  />
                </div>

                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    {vehicle.brand}
                  </div>

                  <h3 className="mt-2 text-base font-black leading-tight text-slate-950">
                    {vehicle.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <span>{vehicle.range}</span>
                    <span>•</span>
                    <span>{vehicle.type}</span>
                  </div>

                  <div className="mt-3 text-sm font-semibold text-emerald-700">
                    {vehicle.price}
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    View details <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </PageContainer>
    </motion.section>
  );
}