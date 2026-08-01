import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-300/80">
              PlugV
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              India&apos;s EV Intelligence Platform.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              PlugV helps people across India compare EVs, discover charging, explore upcoming launches, and make a better decision with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Compare EVs",
                "Discover Charging",
                "Upcoming Launches",
                "Buy with Confidence",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                Explore
              </p>
              <nav className="mt-4 space-y-3">
                <Link href="/vehicles" className="block text-sm text-slate-300 transition hover:text-white">
                  Explore EVs
                </Link>
                <Link href="/compare" className="block text-sm text-slate-300 transition hover:text-white">
                  Compare
                </Link>
                <Link href="/charging" className="block text-sm text-slate-300 transition hover:text-white">
                  Charging
                </Link>
                <Link href="/upcoming" className="block text-sm text-slate-300 transition hover:text-white">
                  Upcoming EVs
                </Link>
              </nav>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                Company
              </p>
              <nav className="mt-4 space-y-3">
                <Link href="/about" className="block text-sm text-slate-300 transition hover:text-white">
                  About PlugV
                </Link>
                <Link href="/about" className="block text-sm text-slate-300 transition hover:text-white">
                  Start your journey
                </Link>
                <Link href="/" className="block text-sm text-slate-300 transition hover:text-white">
                  Home
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} PlugV. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built for premium EV discovery, comparison, and trust.
          </p>
        </div>
      </div>
    </footer>
  );
}