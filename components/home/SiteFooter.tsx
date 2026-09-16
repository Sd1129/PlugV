import Image from "next/image";
import Link from "next/link";

const groups = [
  {
    title: "Explore",
    links: [
      { label: "Explore EVs", href: "/vehicles" },
      { label: "Compare EVs", href: "/compare" },
      { label: "Upcoming EVs", href: "/upcoming" },
      { label: "Search PlugV", href: "/search" },
    ],
  },
  {
    title: "Plan",
    links: [
      { label: "Find charging", href: "/charging" },
      { label: "Plan an EV trip", href: "/travel" },
      { label: "EV calculators", href: "/calculators" },
      { label: "My EV owner hub", href: "/my-ev" },
      { label: "EV Assistant", href: "/assistant" },
    ],
  },
  {
    title: "Learn & Trust",
    links: [
      { label: "Knowledge Hub", href: "/knowledge" },
      { label: "Community efficiency", href: "/community-range" },
      { label: "Data methodology", href: "/methodology" },
      { label: "About PlugV", href: "/about" },
      { label: "Meet the founder", href: "/founder" },
    ],
  },
];
const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclaimer & data clarity", href: "/disclaimer" },
];
const linkStyle = "inline-flex min-h-11 items-center rounded-md py-2 text-sm leading-6 text-slate-300 transition hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-9 lg:grid-cols-[1fr_2fr] lg:gap-14">
          <div>
            <Link href="/" className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300">
              <Image src="/brand/logo-horizontal.svg" alt="PlugV — India's EV Platform" width={220} height={66} className="h-12 w-auto"/>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">Research electric cars, compare your shortlist and plan charging stops across India.</p>
            <div className="mt-5 flex flex-wrap gap-2" aria-label="PlugV social profiles">
              <a href="https://x.com/plugvplatform" target="_blank" rel="noopener noreferrer" className={`${linkStyle} border border-white/15 px-3`}>Follow us on X: @plugvplatform</a>
              <a href="https://www.instagram.com/plugvplatform/" target="_blank" rel="noopener noreferrer" className={`${linkStyle} border border-white/15 px-3`} aria-label="PlugV on Instagram">Instagram</a>
              <a href="https://www.youtube.com/channel/UC0YJUyVpgbX5eClR-UBp_oQ" target="_blank" rel="noopener noreferrer" className={`${linkStyle} border border-white/15 px-3`} aria-label="PlugV on YouTube">YouTube</a>
            </div>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
            {groups.map((group, index) => (
              <section key={group.title} aria-labelledby={`footer-group-${index}`} className={index === 2 ? "col-span-2 sm:col-span-1" : undefined}>
                <h2 id={`footer-group-${index}`} className="text-sm font-semibold text-sky-200">{group.title}</h2>
                <ul className={`mt-3 grid gap-x-6 ${index === 2 ? "grid-cols-2 sm:grid-cols-1" : "grid-cols-1"}`}>
                  {group.links.map(item => <li key={item.href}><Link href={item.href} className={linkStyle}>{item.label}</Link></li>)}
                </ul>
              </section>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <nav aria-label="Legal information"><ul className="flex flex-wrap gap-x-5">{legalLinks.map(item => <li key={item.href}><Link href={item.href} className={linkStyle}>{item.label}</Link></li>)}</ul></nav>
            <a href="mailto:support@plugv.in?subject=PlugV%20data%20correction" className={`${linkStyle} self-start text-sky-200`}>Report incorrect information</a>
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-400">© {new Date().getFullYear()} PlugV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
