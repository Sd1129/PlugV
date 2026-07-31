"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  CalendarDays,
  Gauge,
  Sparkles,
} from "lucide-react";
import { upcomingEVs } from "@/data/upcoming";

type UpcomingVehicle = {
  slug: string;
  maker?: string;
  name: string;
  launch: string;
  note?: string;
  range?: string;
  battery?: string;
  charging?: string;
  image?: string;
};

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

export default function UpcomingVehicles() {
  const featuredUpcoming = (upcomingEVs as UpcomingVehicle[]).slice(0, 4);

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={fadeUp}
      className="border-b border-emerald-200 bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#dfeedd_55%,#d8ead6_100%)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Upcoming EVs
            </div>

            <h2 className="mt-5 text-[1.95rem] font-black leading-[1.05] tracking-[-0.03em] text-emerald-950 md:text-[2.4rem] lg:text-[2.9rem]">
              The Future is Electric
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg lg:text-[1.15rem]">
              Explore the most anticipated electric vehicles launching soon in India with a premium preview layout.
            </p>
          </div>

          <Link
            href="/upcoming"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition duration-300 hover:bg-emerald-100"
          >
            View all upcoming EVs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={stagger}
          className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {featuredUpcoming.map((item) => {
            const imageSrc = item.image ?? `/upcoming/${item.slug}.jpg`;

            return (
              <motion.article
                key={item.slug}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="group overflow-hidden rounded-[30px] border border-emerald-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between px-5 pt-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Coming soon
                  </div>

                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {item.launch}
                  </div>
                </div>

                <div className="px-5 pt-4">
                  <div className="relative overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_top,#f5fbf4_0%,#eef7ec_100%)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.08),transparent_42%)]" />

                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="h-[190px] w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-500 backdrop-blur">
                        EV preview
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    {item.maker ?? "Upcoming EV"}
                  </div>

                  <h3 className="mt-2 text-[1.35rem] font-black leading-tight text-slate-950">
                    {item.name}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
                    {item.note ?? "A new electric model arriving soon."}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <SpecPill
                      icon={<Sparkles className="h-4 w-4" />}
                      label="Range"
                      value={item.range ?? "TBA"}
                    />
                    <SpecPill
                      icon={<BatteryCharging className="h-4 w-4" />}
                      label="Battery"
                      value={item.battery ?? "TBA"}
                    />
                    <SpecPill
                      icon={<Gauge className="h-4 w-4" />}
                      label="Charge"
                      value={item.charging ?? "Fast"}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-emerald-100 pt-4">
                    <div className="text-sm font-medium text-slate-500">
                      Expected launch
                    </div>

                    <Link
                      href="/upcoming"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                    >
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            More exciting EVs are on the way. Stay tuned!
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function SpecPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
      <div className="flex items-center justify-center gap-1.5 text-emerald-700">
        {icon}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-slate-950">{value}</div>
    </div>
  );
}