import Link from "next/link";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { safeJsonLd } from "@/lib/seo";

const customerFaqs = [
  {
    question: "How do I know PlugV's vehicle information is accurate and current?",
    answer:
      "PlugV prioritises official manufacturer material and clearly identified authoritative sources. Vehicle records are reviewed through automated audits and manual checks, with uncertain fields labelled instead of presented as facts. Because specifications, variants and prices can change, customers should confirm the final offer with the manufacturer or authorised dealer before purchasing.",
  },
  {
    question: "Are PlugV recommendations or rankings influenced by payments?",
    answer:
      "PlugV does not present paid placement as an independent recommendation. Comparisons are designed around practical inputs such as budget, range, charging, seating and ownership needs. If PlugV introduces sponsored content, lead-generation or commercial partnerships, they will be clearly disclosed so customers can distinguish advertising from editorial information.",
  },
  {
    question: "Can I rely on the range, price and charging-time figures shown?",
    answer:
      "PlugV separates manufacturer-claimed figures from planning estimates and labels prices as ex-showroom or estimated on-road where applicable. Real range, charging time and ownership cost vary with the exact variant, traffic, weather, driving style, charger output, battery condition, taxes and insurance. Use PlugV to shortlist and compare, then verify the final figures before making a financial decision.",
  },
  {
    question: "Does a listed charging station mean it is available and working now?",
    answer:
      "No. PlugV combines charging information from external data providers and available operator sources. A station listing confirms a known location, not guaranteed access, uptime or an empty charging bay. Live availability is shown only when a compatible operator feed provides it; for an important stop, check the operator app or contact the station before travelling.",
  },
  {
    question: "What happens to my email, location and saved EV information?",
    answer:
      "PlugV requests location only when you choose a location-based feature. Saved trips, chargers and device-only reminders remain in your browser, while an email reminder stores only the information needed to deliver that reminder after verification. PlugV does not sell personal information, and users can deny location access, unsubscribe from reminders or request deletion as explained in the Privacy Policy.",
  },
];


const tools = [
  { href: "/vehicles", title: "Explore electric cars", text: "Browse models listed for the Indian market, with prices, specifications and source notes where available." },
  { href: "/compare", title: "Compare your shortlist", text: "Compare vehicles side by side and see how their specifications fit your needs." },
  { href: "/charging", title: "Find charging locations", text: "Search station listings by city, connector and power. Check the source and timestamp before relying on a stop." },
  { href: "/travel", title: "Plan an EV journey", text: "Explore a route and charging stops. A plan does not reserve a charger or guarantee access." },
  { href: "/upcoming", title: "Follow announced EVs", text: "Read about upcoming models, with announcement sources and uncertainty around timing and specifications." },
  { href: "/calculators", title: "Estimate ownership costs", text: "Use your own inputs to estimate costs. Calculated results are estimates, not dealer quotations." },
];
export default function AboutPage() {
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: customerFaqs.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  return <main className="min-h-screen bg-slate-950 text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}/>
    <SiteHeader/>
    <div className="mx-auto max-w-6xl space-y-14 px-5 py-14 sm:px-8">
      <section className="max-w-3xl space-y-5"><p className="text-sm uppercase tracking-widest text-sky-200">About PlugV</p><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Helping you make sense of electric cars in India.</h1><p className="text-lg leading-8 text-slate-300">PlugV is an independent EV research and planning platform for buyers and owners in India. You can explore vehicles, compare a shortlist, find charging locations and plan journeys in one place.</p><p className="leading-7 text-slate-300">Choosing an EV involves more than a claimed range figure. Budget, home charging, daily travel and the charging stops on a longer trip all matter. PlugV brings these questions into the research process.</p></section>
      <section aria-labelledby="tools-heading"><h2 id="tools-heading" className="text-3xl font-semibold">What you can do on PlugV</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tools.map(tool=><Link key={tool.href} href={tool.href} className="rounded-2xl border border-white/15 bg-white/5 p-6 hover:border-sky-300"><h3 className="text-xl font-semibold text-sky-200">{tool.title}</h3><p className="mt-3 leading-7 text-slate-300">{tool.text}</p></Link>)}</div></section>
      <section className="rounded-2xl border border-white/15 p-6 sm:p-8"><h2 className="text-3xl font-semibold">How to read our information</h2><div className="mt-5 space-y-4 leading-7 text-slate-300"><p>We prioritise manufacturer publications for vehicle details and identify the source of charging information. Evidence coverage varies: a listed model does not mean every price, variant or specification has been independently confirmed.</p><p>Manufacturer claims, planning estimates and driver reports are different kinds of information. Check the source, date and any uncertainty label on the page. Prices and specifications can change; confirm your chosen variant and final quotation with the manufacturer or authorised dealer.</p><p>A charging-station listing is not confirmation that a connector is working or available now. Check the operator before travelling.</p><Link href="/methodology" className="inline-block text-sky-200 underline">Read our data methodology</Link></div></section>
      <section className="space-y-4"><h2 className="text-3xl font-semibold">Who is behind PlugV?</h2><p className="max-w-3xl leading-7 text-slate-300">PlugV is operated by Syed Manjoor Ahmed, trading as PlugV, in Hyderabad, India. PlugV is independent of vehicle manufacturers and charging operators; a listing does not imply their endorsement.</p><Link href="/founder" className="inline-block text-sky-200 underline">Meet the founder</Link></section>
      <section aria-labelledby="customer-faq-heading"><h2 id="customer-faq-heading" className="text-3xl font-semibold">Questions about PlugV</h2><div className="mt-6 space-y-4">{customerFaqs.map(item=><details key={item.question} className="rounded-2xl border border-white/15 p-5"><summary className="cursor-pointer font-semibold text-sky-100">{item.question}</summary><p className="mt-4 leading-7 text-slate-300">{item.answer}</p></details>)}</div><div className="mt-5 flex flex-wrap gap-6"><Link className="text-sky-200 underline" href="/privacy">Privacy Policy</Link><Link className="text-sky-200 underline" href="/terms">Terms of Use</Link></div></section>
      <section className="rounded-2xl bg-sky-400/10 p-6 sm:p-8"><h2 className="text-3xl font-semibold">Found something that needs correcting?</h2><p className="mt-4 leading-7 text-slate-300">Send the page link, the detail you believe is wrong and a supporting source to <a className="text-sky-200 underline" href="mailto:support@plugv.in">support@plugv.in</a>. Please do not send passwords or personal documents.</p><Link href="/vehicles" className="mt-6 inline-block rounded-full bg-sky-300 px-6 py-3 font-semibold text-slate-950">Explore electric cars</Link></section>
    </div><SiteFooter/>
  </main>;
}
