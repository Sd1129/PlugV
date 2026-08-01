"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Gauge,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { getRecommendations, type AssistantProfile } from "@/lib/assistant/recommendationEngine";

const budgetOptions = [15, 20, 25, 30, 35, 40, 50] as const;

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 shadow-inner shadow-black/30">
      <div className="text-center">
        <div className="text-xl font-black text-white">{score}</div>
        <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
          Match
        </div>
      </div>
    </div>
  );
}

function ControlCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

export default function AssistantPage() {
  const [budgetLakh, setBudgetLakh] = useState(25);
  const [bodyStyle, setBodyStyle] = useState<AssistantProfile["bodyStyle"]>("SUV");
  const [usage, setUsage] = useState<AssistantProfile["usage"]>("Mixed");
  const [homeCharging, setHomeCharging] = useState<AssistantProfile["homeCharging"]>("Yes");
  const [seats, setSeats] = useState<AssistantProfile["seats"]>("4-5");
  const [priority, setPriority] = useState<AssistantProfile["priority"]>("Balanced");

  const recommendations = useMemo(
    () =>
      getRecommendations({
        budgetLakh,
        bodyStyle,
        usage,
        homeCharging,
        seats,
        priority,
      }),
    [budgetLakh, bodyStyle, usage, homeCharging, seats, priority]
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              AI Decision Assistant
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
              Tell PlugV how you drive. Get a better EV shortlist.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              This is the first version of PlugV’s AI assistant: a practical decision layer that turns your needs into a cleaner recommendation.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-200/80">
                  <Gauge className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                    Budget
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">
                  ₹{budgetLakh}L
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-200/80">
                  <BatteryCharging className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                    Usage
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{usage}</p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-200/80">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                    Priority
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{priority}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Explore EVs
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Search PlugV
              </Link>
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center gap-2 text-sky-200/80">
                <Search className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Assistant guidance
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Pick a few preferences and PlugV will return a ranked shortlist with reasons.
              </p>
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/80">
              Your preference profile
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Shape the recommendation.
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ControlCard label="Budget (₹ lakh)">
                <select
                  value={budgetLakh}
                  onChange={(e) => setBudgetLakh(Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  {budgetOptions.map((item) => (
                    <option key={item} value={item}>
                      ₹{item}L
                    </option>
                  ))}
                </select>
              </ControlCard>

              <ControlCard label="Body style">
                <select
                  value={bodyStyle}
                  onChange={(e) =>
                    setBodyStyle(e.target.value as AssistantProfile["bodyStyle"])
                  }
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  {["Any", "SUV", "Crossover", "Hatchback", "Sedan"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </ControlCard>

              <ControlCard label="Driving pattern">
                <select
                  value={usage}
                  onChange={(e) => setUsage(e.target.value as AssistantProfile["usage"])}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  {["City", "Mixed", "Highway", "Daily commute"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </ControlCard>

              <ControlCard label="Home charging">
                <select
                  value={homeCharging}
                  onChange={(e) =>
                    setHomeCharging(e.target.value as AssistantProfile["homeCharging"])
                  }
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  {["Yes", "No"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </ControlCard>

              <ControlCard label="Seats">
                <select
                  value={seats}
                  onChange={(e) => setSeats(e.target.value as AssistantProfile["seats"])}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  {["Any", "4-5", "6-7"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </ControlCard>

              <ControlCard label="Priority">
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as AssistantProfile["priority"])
                  }
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none"
                >
                  {["Balanced", "Range", "Price", "Charging"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </ControlCard>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                How it works
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The assistant scores launched EVs against your profile, then ranks the top matches with a simple explanation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
              Top recommendations
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your best EV matches.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Ranked against your current preferences.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {recommendations.map((item) => (
              <article
                key={item.vehicle.slug}
                className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                        Recommendation
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {item.vehicle.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {item.vehicle.brand} · {item.vehicle.type}
                      </p>
                    </div>
                    <ScoreRing score={item.score} />
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <p className="text-sm leading-7 text-slate-300">
                    {item.vehicle.brand} · {item.vehicle.status}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        Range
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.vehicle.range ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        Charging
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.vehicle.charging ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        Price
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.vehicle.price ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Why it fits
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/vehicles/${item.vehicle.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                  >
                    View details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                AI principle
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                Helpful, not noisy.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The assistant should simplify the decision, not overwhelm the user.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                AI principle
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                Balanced recommendations.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Every recommendation should explain why it is a fit in plain language.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                AI principle
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                Built for trust.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The assistant should feel like a careful product advisor, not a sales tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}