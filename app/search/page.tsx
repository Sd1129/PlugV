import Link from "next/link";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import UniversalSearch from "@/components/ui/UniversalSearch";
const destinations = [
  { href: "/vehicles", title: "Browse electric cars", text: "Explore the vehicle catalogue and its filters." },
  { href: "/compare", title: "Compare EVs", text: "Choose models for a side-by-side comparison." },
  { href: "/charging", title: "Search charging stations", text: "Use the charging finder for city, network, connector and power filters." },
  { href: "/upcoming", title: "Upcoming EVs", text: "Read announcement sources and available launch details." },
  { href: "/assistant", title: "Ask the EV Assistant", text: "Ask a question about EV choices. Check supporting details before making a decision." },
  { href: "/about", title: "About PlugV", text: "Learn who operates PlugV and how to report a correction." },
];
export default function SearchPage() {
  return <main className="min-h-screen bg-slate-950 text-white"><SiteHeader/><div className="mx-auto max-w-5xl space-y-10 px-5 py-12 sm:px-8"><section className="space-y-5"><h1 className="text-4xl font-semibold tracking-tight">Search PlugV</h1><p className="max-w-3xl text-lg leading-8 text-slate-300">Find listed EV models, upcoming models and links to PlugV tools. Enter a model, brand or a page name such as “Compare”.</p><UniversalSearch/><p className="text-sm leading-6 text-slate-300">This search shows up to six keyword matches. It does not search individual charging stations or answer open-ended questions. Use the charging finder or EV Assistant below for those tasks.</p></section><section><h2 className="text-2xl font-semibold">Go directly to a tool</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">{destinations.map(item=><Link key={item.href} href={item.href} className="rounded-2xl border border-white/15 bg-white/5 p-6 hover:border-sky-300"><h3 className="text-xl font-semibold text-sky-200">{item.title}</h3><p className="mt-3 leading-7 text-slate-300">{item.text}</p></Link>)}</div></section></div><SiteFooter/></main>;
}
