import Link from "next/link";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="text-3xl font-black text-[#0f5132]">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-emerald-50/70 to-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-[#0f5132] shadow-sm">
            India&apos;s premium EV discovery platform
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Track EV vehicles, upcoming models, and charging stations in one place.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            PlugV helps users explore electric vehicle data, compare range and charging speed,
            discover upcoming EV launches, and find charging stations quickly across India.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/vehicles"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0f5132] px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-[#0b3d26]"
            >
              Explore EVs
            </Link>
            <Link
              href="/charging"
              className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-sm font-semibold text-[#0f5132] transition hover:bg-emerald-50"
            >
              Find Charging Stations
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <StatCard value="6+" label="Popular EV models" />
            <StatCard value="3+" label="Charging networks" />
            <StatCard value="3+" label="Upcoming launches" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-100/40">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#0f5132]">Live dashboard</div>
              <div className="text-2xl font-bold text-slate-950">EV overview</div>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0f5132]">
              Updated today
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Top range</span>
                <span className="font-semibold text-slate-950">489 km</span>
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-950">Tata Nexon EV</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Fastest charge</div>
                <div className="mt-1 text-xl font-bold text-slate-950">18 min</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Popular city</div>
                <div className="mt-1 text-xl font-bold text-slate-950">Bengaluru</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="font-semibold text-slate-950">Search, filter, and browse Indian EV data</div>
              <div className="mt-1 text-sm text-slate-500">
                Built for a clean, commercial product experience.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}