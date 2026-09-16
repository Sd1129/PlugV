export default function VehicleHighlights() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Didn&apos;t find what you&apos;re looking for?</h2>
        <a href="mailto:support@plugv.in?subject=EV%20model%20request&body=Brand%20and%20model%3A%20%0AOfficial%20India%20source%20%28if%20available%29%3A%20" className="inline-flex min-h-11 items-center justify-center rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300">Request a model</a>
      </div>
    </section>
  );
}
