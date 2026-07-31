import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpcomingCard from "@/components/UpcomingCard";
import { upcomingEVs } from "@/data/upcoming";
import { siteCopy } from "@/data/siteCopy";

export default function UpcomingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0f5132]">
            Upcoming EVs
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {siteCopy.upcomingTitle}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {siteCopy.upcomingDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {upcomingEVs.map((item) => (
            <UpcomingCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}