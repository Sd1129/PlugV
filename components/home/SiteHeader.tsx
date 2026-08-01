import Link from "next/link";

const navItems = [
  { href: "/vehicles", label: "Explore EVs" },
  { href: "/search", label: "Search" },
  { href: "/compare", label: "Compare" },
  { href: "/charging", label: "Charging" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 sm:px-6 lg:px-8">
          <span>India&apos;s EV Intelligence Platform</span>
          <span className="hidden sm:inline">Built for clarity and confidence</span>
        </div>
      </div>

      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
            <span className="text-lg font-black text-sky-300">P</span>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">PlugV</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              India&apos;s EV platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/vehicles"
          className="hidden rounded-full border border-sky-400/20 bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 sm:inline-flex"
        >
          Explore EVs
        </Link>
      </div>
    </header>
  );
}