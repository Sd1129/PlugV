import Link from "next/link";
import { ArrowRight, BatteryCharging, MapPin, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import ChargingStations from "@/components/ChargingStations";
import Footer from "@/components/Footer";

export default function ChargingPage() {
  return (
    <main className="min-h-screen text-slate-950">
      <Navbar />

      <section className="border-b border-emerald-200 bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#e4f0e1_50%,#d9ead4_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Zap className="h-4 w-4" />
              PlugV Charging Network
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-emerald-950 sm:text-6xl lg:text-7xl">
              Find charging stations that fit your route
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Explore charging stations across Indian cities with a clean, premium PlugV experience.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#stations"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-800"
              >
                Explore stations
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-7 py-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Compare EVs
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <FeatureStat
              icon={<MapPin className="h-4 w-4" />}
              title="Top Indian cities"
              text="Browse city-wise EV charging coverage."
            />
            <FeatureStat
              icon={<BatteryCharging className="h-4 w-4" />}
              title="Connector types"
              text="See CCS2, Type 2, and more."
            />
            <FeatureStat
              icon={<Zap className="h-4 w-4" />}
              title="Fast chargers"
              text="Focus on faster, practical charging options."
            />
          </div>
        </div>
      </section>

      <div id="stations">
        <ChargingStations />
      </div>

      <section className="border-t border-emerald-200 bg-[#d9ead4]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Charging made easier
            </div>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Plan your next EV trip with confidence
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Use city coverage, station details, and future map integrations to find the best charging stops on your journey.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureStat({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        {icon}
        {title}
      </div>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}