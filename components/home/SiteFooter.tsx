import Image from "next/image";
import Link from "next/link";

const INSTAGRAM_URL = "https://www.instagram.com/plugvplatform/";

const footerLinks = [
  { label: "Explore EVs", href: "/vehicles" },
  { label: "Search", href: "/search" },
  { label: "Compare", href: "/compare" },
  { label: "Charging", href: "/charging" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "Knowledge Hub", href: "/knowledge" },
  { label: "About", href: "/about" },
  { label: "Founder", href: "/founder" },
];

const supportLinks = [
  { label: "My EV owner hub", href: "/my-ev" },
  { label: "Plan an EV trip", href: "/travel" },
  { label: "Ask the EV Assistant", href: "/assistant" },
  { label: "Data methodology", href: "/methodology" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.8fr_0.7fr]">
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

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow PlugV on Instagram at @plugvplatform"
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-pink-300/30 hover:bg-pink-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-pink-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              <span>Follow @plugvplatform</span>
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300/80">Legal</h3>
            <div className="mt-4 grid gap-3">{legalLinks.map((item) => <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">{item.label}</Link>)}</div>
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
          <a href="mailto:support@plugv.in?subject=PlugV%20data%20correction" className="transition hover:text-white">Report incorrect information</a>
        </div>
      </div>
    </footer>
  );
}
