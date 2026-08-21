import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Explore EVs", href: "/vehicles" },
  { label: "Search", href: "/search" },
  { label: "Compare", href: "/compare" },
  { label: "Charging", href: "/charging" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "About", href: "/about" },
];

const supportLinks = [
  { label: "Plan an EV trip", href: "/travel" },
  { label: "Ask the EV Assistant", href: "/assistant" },
  { label: "Data methodology", href: "/methodology" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/brand/logo-horizontal.svg"
                alt="PlugV — India's EV Platform"
                width={220}
                height={66}
                className="h-14 w-auto"
                priority
              />
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
              PlugV helps people discover, compare, and understand electric
              vehicles in India with clarity, confidence, and a premium EV-first
              experience.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300/80">
              Explore
            </h3>
            <div className="mt-4 grid gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300/80">
              Plan
            </h3>
            <div className="mt-4 grid gap-3">
              {supportLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-300 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} PlugV. All rights reserved.</span>
          <a href="mailto:hello@plugv.in?subject=PlugV%20data%20correction" className="transition hover:text-white">Report incorrect information</a>
        </div>
      </div>
    </footer>
  );
}
