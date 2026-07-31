import Link from "next/link";
import { ArrowRight, Globe2, Leaf, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen text-slate-950">
      <Navbar />

      <section className="border-b border-emerald-200 bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#e4f0e1_50%,#d9ead4_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Leaf className="h-4 w-4" />
              About PlugV
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight text-emerald-950 sm:text-6xl lg:text-7xl">
              Built for India’s electric future
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              PlugV is a premium EV platform for exploring launched vehicles, upcoming launches, charging stations, and side-by-side comparisons.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-800"
              >
                Explore vehicles
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-7 py-3 text-base font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                Compare EVs
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <AboutStat
              icon={<Sparkles className="h-4 w-4" />}
              title="Discover"
              text="Find EVs with clean browsing and premium cards."
            />
            <AboutStat
              icon={<MapPinned className="h-4 w-4" />}
              title="Locate"
              text="Browse charging stations by city and availability."
            />
            <AboutStat
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Compare"
              text="Use PlugV Compare for smarter buying decisions."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf7_100%)] p-8 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Our mission
              </div>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
                Make EV discovery feel clear, premium, and simple
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                PlugV brings together vehicles, upcoming launches, charging networks, and comparisons in one polished place so users can make better electric mobility decisions.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <MiniCard title="Clean design" text="White space, green accents, and modern layout." />
                <MiniCard title="India first" text="Built for Indian EV users and city coverage." />
                <MiniCard title="Scalable" text="Ready for maps, filters, and more data later." />
                <MiniCard title="Commercial feel" text="Looks like a real platform, not a demo." />
              </div>
            </div>

            <div className="space-y-4">
              <InfoPanel title="What PlugV does">
                <ul className="space-y-3 text-slate-600">
                  <li>• Helps users explore launched EVs with details and specs.</li>
                  <li>• Shows upcoming EVs with launch timing and summaries.</li>
                  <li>• Surfaces charging stations by city for Indian users.</li>
                  <li>• Lets buyers compare vehicles side by side with confidence.</li>
                </ul>
              </InfoPanel>

              <InfoPanel title="Why it feels premium">
                <ul className="space-y-3 text-slate-600">
                  <li>• Consistent spacing, typography, and card styling.</li>
                  <li>• Soft shadows and rounded surfaces throughout.</li>
                  <li>• Shared mint-green and white visual language.</li>
                  <li>• Clear buyer-focused structure across pages.</li>
                </ul>
              </InfoPanel>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-emerald-200 bg-[#d9ead4]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-[32px] border border-emerald-100 bg-white p-8 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              The PlugV experience
            </div>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Explore. Compare. Charge. Decide.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Everything is designed to feel connected, consistent, and easy to use across the website.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function AboutStat({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        {icon}
        {title}
      </div>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function MiniCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-4">
      <div className="text-sm font-bold text-slate-950">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function InfoPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}