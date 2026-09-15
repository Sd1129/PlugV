import Link from "next/link";

export default function BuyerEvidenceGuide({ topic }: { topic: "budget" | "tiago" | "upcoming" }) {
  return <section className="mx-auto my-8 max-w-5xl rounded-2xl border border-sky-300/20 bg-slate-900 p-6 text-slate-200 sm:p-8">
    <h2 className="text-2xl font-semibold text-white">{topic === "upcoming" ? "Should you wait for an upcoming EV?" : topic === "tiago" ? "Tiago EV: check the price and your charging needs" : "Build an EV budget you can actually compare"}</h2>
    {topic === "upcoming" ? <>
      <p className="mt-4 leading-7">An announced model, a booking opening and the start of deliveries are different milestones. A manufacturer target can change; a concept does not establish a production date or an India price.</p>
      <p className="mt-4 leading-7">For example, Honda states that the production Honda 0 Alpha is scheduled for global sales mainly in Japan and India starting in 2027. That statement does not give an exact Indian delivery date or a selling price. <a className="text-sky-300 underline" href="https://global.honda/en/design/interview/202510japanmobilityshow_honda0alpha/">Read Honda’s announcement context</a>.</p>
      <p className="mt-4 leading-7">If you need a car soon, compare launched models alongside the announcement. Before paying a booking amount, confirm the manufacturer’s cancellation terms, final specification and delivery estimate. Review the source and date on each listing rather than treating its launch window as a promise.</p>
    </> : <>
      <p className="mt-4 leading-7">Tata’s Tiago EV specification page advertises a starting price of ₹6.99 lakh and asks buyers to confirm exact prices with a dealer. This entry figure is not a quote for every variant or an on-road total. The full current variant price table remains under review. <a className="text-sky-300 underline" href="https://ev.tata.cars/tiago/ev/specifications.html">Check Tata’s Tiago EV specification and price page</a>.</p>
      <ul className="mt-4 list-disc space-y-3 pl-5 leading-7">
        <li>Ask for the exact variant and battery capacity on the quote. Compare battery-inclusive ownership prices separately from any battery-subscription offer.</li>
        <li>Add insurance, applicable registration charges, accessories and charging installation to the vehicle price. A model with an entry price below your budget may have higher trims above it.</li>
        <li>Check the selected variant’s AC and DC charging support against your home parking and regular routes. Manufacturer-claimed range is not a guaranteed journey distance.</li>
      </ul>
      {topic === "budget" ? <p className="mt-4 leading-7">Illustrative budget only: an ₹8 lakh vehicle plus ₹50,000 of quoted extras totals ₹8.5 lakh. If your cap is ₹10 lakh, that leaves ₹1.5 lakh—not a reason to assume a higher variant will fit. Replace both inputs with your own written quotation; this is not a tax or insurance estimate.</p> : <p className="mt-4 leading-7">For Tiago EV, begin with your daily distance and charging access, then inspect the variant selector on this page. Compare another small EV such as the MG Comet for your passenger, luggage and charging needs; a lower headline price alone does not decide suitability.</p>}
    </>}
    <p className="mt-4 text-sm text-slate-300">Editorial source check: 15 September 2026. This note does not refresh every catalogue specification or confirm dealer stock.</p>
    <nav aria-label="Related EV buying guides" className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-sky-300">
      <Link className="underline" href="/vehicles/tata-tiago-ev">Tiago EV variants and evidence</Link>
      <Link className="underline" href="/knowledge/best-electric-cars-under-10-lakh-india">EVs under ₹10 lakh</Link>
      <Link className="underline" href="/knowledge/best-electric-cars-under-15-lakh-india">EVs under ₹15 lakh</Link>
      <Link className="underline" href="/compare">Compare launched EVs</Link>
      <Link className="underline" href="/upcoming">Official upcoming EV tracker</Link>
      <Link className="underline" href="/methodology">Sources and verification method</Link>
    </nav>
  </section>;
}
