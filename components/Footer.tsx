import Link from "next/link";
import { siteCopy } from "@/data/siteCopy";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="text-3xl font-black text-white">
              Plug<span className="text-emerald-400">V</span>
            </div>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              PlugV is a modern electric vehicle platform that helps drivers discover EVs,
              compare specifications, explore upcoming models, and locate charging stations
              in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                EV Vehicles
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Upcoming EVs
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Charging Stations
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-slate-300">
              <Link href="/vehicles" className="transition hover:text-white">
                Vehicles
              </Link>
              <Link href="/upcoming" className="transition hover:text-white">
                Upcoming EVs
              </Link>
              <Link href="/charging" className="transition hover:text-white">
                Charging Stations
              </Link>
              <Link href="/about" className="transition hover:text-white">
                About PlugV
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Contact
            </h3>

            <div className="mt-5 space-y-3 text-slate-300">
              <p>support@plugv.com</p>
              <p>contact@plugv.com</p>
              <p>Available Worldwide</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} PlugV. All rights reserved.
            </p>

            <p className="text-sm font-medium text-emerald-400">
              {siteCopy.footerTagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}