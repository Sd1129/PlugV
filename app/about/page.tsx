import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Gauge,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

const pillars = [
  {
    title: "Explore EVs",
    desc: "Browse launched EVs with a premium discovery experience built for serious buyers.",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    title: "Compare EVs",
    desc: "Help users compare range, charging, pricing, and fit with calm, clear decision surfaces.",
    icon: <Gauge className="h-4 w-4" />,
  },
  {
    title: "Charging intelligence",
    desc: "Make charging discovery feel trustworthy, useful, and easy to plan around.",
    icon: <BatteryCharging className="h-4 w-4" />,
  },
  {
    title: "Upcoming launches",
    desc: "Give buyers a premium way to track what is coming next and plan ahead.",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "Decision support",
    desc: "Turn information into action with clearer next steps and more confidence.",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    title: "India-first trust",
    desc: "Build a platform people across India can rely on for EV research and planning.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];

const roadmap = [
  {
    step: "1",
    title: "Premium homepage",
    desc: "A polished front door that feels like a real EV company, not a simple website.",
  },
  {
    step: "2",
    title: "Core research pages",
    desc: "Explore, compare, charging, and upcoming launches with the same visual language.",
  },
  {
    step: "3",
    title: "Decision tools",
    desc: "Add calculators, recommendations, saved items, and smarter search experiences.",
  },
  {
    step: "4",
    title: "Company growth",
    desc: "Expand into partnerships, trust content, and a full product ecosystem for EV buyers.",
  },
];

const principles = [
  "Premium, calm, and commercial",
  "Clear information hierarchy",
  "Trust first, then conversion",
  "Built for India",
  "Fast, responsive, and accessible",
  "Scales into a real product company",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.14),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_20%,transparent_82%,rgba(255,255,255,0.02))]" />

        <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              About PlugV
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
              PlugV is India&apos;s EV Intelligence Platform.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              We are building a premium EV product company that helps people across India explore launched EVs, compare vehicles, discover charging, and track upcoming launches with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Explore EVs
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Compare EVs
              </Link>
              <Link
                href="/founder"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Meet the founder <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: "India-first", label: "Built for Indian EV shoppers" },
                { value: "Premium", label: "Designed to feel commercial" },
                { value: "Scalable", label: "Built to grow into a company" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10 backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />

            <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
                  Company vision
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  A product company, not a content site.
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Premium design, useful information, and a clear path to decision-making.
                </p>
              </div>

              <div className="grid gap-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Mission
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Help EV shoppers make better decisions through premium design, accurate information, and clear product experiences.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Audience
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Buyers, researchers, early adopters, families, and anyone in India looking for a trusted EV decision platform.
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        What PlugV stands for
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        Trust, clarity, and premium product thinking.
                      </h3>
                    </div>
                    <div className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
                      PlugV
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {["Explore", "Compare", "Charge"].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
              Product pillars
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything PlugV does should answer one question.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Can this help someone make a better EV decision? If yes, it belongs in PlugV.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.07]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sky-200">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Design principles
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                The look should feel premium, commercial, and calm.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {principles.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Roadmap
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                How PlugV grows into a real company.
              </h2>

              <div className="mt-6 grid gap-4">
                {roadmap.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Phase {item.step}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "A real EV platform",
                desc: "PlugV is being built as a product company that serves buyers, researchers, and future partners.",
              },
              {
                title: "Designed to scale",
                desc: "The structure supports more pages, more tools, and more premium experiences without losing consistency.",
              },
              {
                title: "Made for India",
                desc: "Every experience should serve the Indian EV market with confidence and trust.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                  Company note
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-slate-950" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 px-8 py-14 shadow-2xl shadow-black/30 backdrop-blur sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
                Start your journey
              </div>

              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ready to build PlugV like a real company?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                The product foundation is in place. The next step is to keep expanding the platform with the same premium standard across every page.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/vehicles"
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Explore EVs
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Compare EVs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
