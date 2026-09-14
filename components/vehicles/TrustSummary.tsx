import evidence from "@/data/official-launched-ev-evidence.json";
import reviews from "@/data/vehicle-content-reviews.json";
import priceReviews from "@/data/vehicle-price-variant-reviews.json";

type Vehicle = { slug?: string; name: string; brand: string };

export default function TrustSummary({ vehicle }: { vehicle: Vehicle }) {
  const record = evidence.find((item) => item.slug === vehicle.slug);
  const review = reviews.find((item) => item.slug === vehicle.slug);
  const priceReview = priceReviews.find((item) => item.slug === vehicle.slug);
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-widest text-sky-300">Evidence status</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{vehicle.brand} {vehicle.name}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300">
        {record ? "An India launch source is recorded for this model." : "India launch evidence review is pending for this model."}
        {" "}Launch evidence does not verify every price, variant or range figure. Catalogue specification review is ongoing.
      </p>
      {record && <p className="mt-4 text-sm text-sky-300"><a href={record.sourceUrl} target="_blank" rel="noopener noreferrer">View manufacturer source</a><span className="text-slate-400"> · Recorded check: {record.verifiedOn}</span></p>}
      <p className="mt-4 text-sm leading-7 text-slate-400">No numerical trust rating or overall buyer score is assigned. Confirm the selected variant, battery-inclusive price and range test cycle before making a purchase decision.</p>
      {review && <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-slate-300">
        <h3 className="font-semibold text-white">Content review · {review.reviewedAt}</h3>
        <p>{review.supported}</p>
        <p className="mt-2 text-amber-200">Still to confirm: {review.pending}</p>
        <a className="text-sky-300 underline" href={review.sourceUrl} target="_blank" rel="noopener noreferrer">Read the source used for this review</a>
      </div>}
      {priceReview && <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-slate-300">
        <h3 className="font-semibold text-white">Price and variant review · {priceReview.reviewedAt}</h3>
        <p>Price evidence: {priceReview.priceStatus}. Variant evidence: {priceReview.variantStatus}.</p>
        <p className="mt-2">{priceReview.note}</p>
        <a className="text-sky-300 underline" href={priceReview.sourceUrl} target="_blank" rel="noopener noreferrer">Manufacturer pricing or variant source</a>
        <p className="mt-2 text-slate-400">Supported means the source supports the stated scope. It does not confirm local stock, on-road cost, optional equipment or every specification.</p>
      </div>}
    </section>
  );
}
