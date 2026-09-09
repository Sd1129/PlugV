import Image from "next/image";
import Link from "next/link";
import { BatteryCharging, BookOpen, CarFront, ChevronDown, Gauge, GitCompareArrows, Route } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/plugvplatform/";
const YOUTUBE_URL = "https://www.youtube.com/channel/UC0YJUyVpgbX5eClR-UBp_oQ";

const footerLinks = [
  { label: "Explore EVs", href: "/vehicles" },
  { label: "Search", href: "/search" },
  { label: "Compare", href: "/compare" },
  { label: "Charging", href: "/charging" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "Knowledge Hub", href: "/knowledge" },
  { label: "EV Calculators", href: "/calculators" },
  { label: "About", href: "/about" },
  { label: "Founder", href: "/founder" },
];

const supportLinks = [
  { label: "My EV owner hub", href: "/my-ev" },
  { label: "Plan an EV trip", href: "/travel" },
  { label: "Ask the EV Assistant", href: "/assistant" },
  { label: "Data methodology", href: "/methodology" },
  { label: "EV calculators", href: "/calculators" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Data Clarity", href: "/disclaimer#data-clarity" },
];

const mobilePrimaryLinks = [
  { label: "Explore EVs", href: "/vehicles", icon: CarFront, featured: true },
  { label: "Compare EVs", href: "/compare", icon: GitCompareArrows },
  { label: "Charging", href: "/charging", icon: BatteryCharging },
  { label: "Plan a Trip", href: "/travel", icon: Route },
  { label: "Upcoming EVs", href: "/upcoming", icon: BookOpen },
  { label: "My EV", href: "/my-ev", icon: Gauge },
];

const mobileTrustLinks = [
  { label: "Knowledge Hub", href: "/knowledge" },
  { label: "EV Calculators", href: "/calculators" },
  { label: "Data Methodology", href: "/methodology" },
  { label: "Data Clarity", href: "/disclaimer#data-clarity" },
  { label: "Report incorrect data", href: "mailto:support@plugv.in?subject=PlugV%20data%20correction" },
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
              href="https://x.com/plugvplatform"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-sky-300/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
            >
              Follow us on X: @plugvplatform
            </a>

            <div className="mt-6 hidden flex-wrap gap-3 lg:flex">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow PlugV on Instagram at @plugvplatform"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-pink-300/30 hover:bg-pink-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-pink-300" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                <span>Instagram</span>
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch PlugV on YouTube"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-red-300/30 hover:bg-red-400/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-400" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300/80">Legal</h3>
            <div className="mt-4 grid gap-3">{legalLinks.map((item) => <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">{item.label}</Link>)}</div>
          </div>

          <div className="hidden lg:block">
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

          <div className="hidden lg:block">
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

        <div className="mt-8 space-y-7 lg:hidden">
          <section aria-labelledby="mobile-footer-explore">
            <h3 id="mobile-footer-explore" className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">Explore PlugV</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {mobilePrimaryLinks.map(({ label, href, icon: Icon, featured }) => (
                <Link key={href} href={href} className={`flex min-h-12 items-center gap-2.5 rounded-xl border px-3 text-sm font-semibold transition ${featured ? "border-sky-200 bg-sky-300 text-slate-950" : "border-white/10 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]"}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="mobile-footer-trust">
            <h3 id="mobile-footer-trust" className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">Learn &amp; Trust</h3>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              {mobileTrustLinks.map((item) => <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">{item.label}</Link>)}
            </div>
          </section>

          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] px-4">
            <details className="group py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-white">Company <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" /></summary>
              <div className="grid grid-cols-2 gap-3 pb-4"><Link href="/about" className="text-sm text-slate-300">About PlugV</Link><Link href="/founder" className="text-sm text-slate-300">Founder</Link></div>
            </details>
            <details className="group py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-semibold text-white">Legal <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" /></summary>
              <div className="grid grid-cols-2 gap-3 pb-4">{legalLinks.slice(0, 3).map((item) => <Link key={item.href} href={item.href} className="text-sm text-slate-300">{item.label}</Link>)}</div>
            </details>
          </div>

          <div className="flex gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-pink-300/20 bg-pink-400/[0.06] text-sm font-semibold text-slate-100"><span aria-hidden="true">◎</span>Instagram</a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-red-300/20 bg-red-400/[0.06] text-sm font-semibold text-slate-100"><span aria-hidden="true">▶</span>YouTube</a>
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
