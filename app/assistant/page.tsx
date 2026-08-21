"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Gauge,
  Sparkles,
  Zap,
} from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import {
  getRecommendations,
  parseAssistantPrompt,
} from "@/lib/assistant/recommendationEngine";

const examplePrompts = [
  "I'm looking for an SUV under ₹25 lakh for family use",
  "Best EV for city driving with good range",
  "Show me the best EVs with fast charging and value",
];

function formatMaybe(value?: string) {
  return value && value.trim().length ? value : "—";
}

function ResultCard({
  rank,
  vehicle,
  score,
  reasons,
}: {
  rank: number;
  vehicle: {
    brand: string;
    name: string;
    type: string;
    price?: string;
    range?: string;
    charging?: string;
    slug: string;
  };
  score: number;
  reasons: string[];
}) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
            Recommendation #{rank}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {vehicle.brand} {vehicle.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{vehicle.type}</p>
        </div>

        <div className="rounded-2xl border border-sky-400/15 bg-sky-400/10 px-4 py-3 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200/80">
            PlugV score
          </p>
          <p className="mt-1 text-3xl font-semibold text-white">{score}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center gap-2 text-sky-200/80">
            <Gauge className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Range
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatMaybe(vehicle.range)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center gap-2 text-sky-200/80">
            <BatteryCharging className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Power / battery
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatMaybe(vehicle.charging)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center gap-2 text-sky-200/80">
            <Zap className="h-4 w-4" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              Price
            </p>
          </div>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatMaybe(vehicle.price)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Why PlugV picked it
        </p>
        <ul className="mt-3 space-y-2">
          {reasons.map((reason) => (
            <li key={reason} className="text-sm leading-6 text-slate-300">
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <Link
          href={`/vehicles/${vehicle.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          View vehicle
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default function AssistantPage() {
  const [prompt, setPrompt] = useState(
    "I'm looking for an SUV under ₹25 lakh for family use"
  );
  const [submittedPrompt, setSubmittedPrompt] = useState(prompt);

  const assistantPrefs = useMemo(() => {
    return parseAssistantPrompt(submittedPrompt);
  }, [submittedPrompt]);
  
  const scopeLabel =
    assistantPrefs.scope === "upcoming"
      ? "Upcoming"
      : assistantPrefs.scope === "both"
        ? "Both"
        : "Launched";

  const response = useMemo(() => {
    return getRecommendations(submittedPrompt);
  }, [submittedPrompt]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              <Sparkles className="h-4 w-4" />
              PlugV AI
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.5rem]">
              Ask PlugV for the best EVs.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Tell PlugV what you need and get a ranked shortlist with clear
              reasons, pricing, range, and available vehicle specifications.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[2.25rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Ask for a recommendation
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Try a prompt like this:
              </h2>

              <div className="mt-4 space-y-3">
                {examplePrompts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setPrompt(item);
                      setSubmittedPrompt(item);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Your prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500"
                  placeholder="I'm looking for an SUV under ₹25 lakh..."
                />
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmittedPrompt(prompt)}
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Get recommendations
                </button>

                <p className="text-sm text-slate-400">
                  Powered by the PlugV vehicle dataset.
                </p>
              </div>
            </section>

            <section className="space-y-6">
            <div className="rounded-[2.25rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
  <div className="flex flex-wrap items-center gap-3">
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300/80">
      PlugV answer
    </p>

    <span className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200">
      {scopeLabel}
    </span>
  </div>

  <h2 className="mt-3 text-2xl font-semibold text-white">
    {response.summary}
  </h2>
</div>

              <div className="grid gap-6">
                {response.recommendations.length > 0 ? (
                  response.recommendations.map((item, index) => (
                    <ResultCard
                      key={item.vehicle.slug}
                      rank={index + 1}
                      vehicle={{
                        brand: item.vehicle.brand,
  name: item.vehicle.name,
  type: "EV",
  price: "—",
  range: "—",
  charging: "—",
                        slug: item.vehicle.slug,
                      }}
                      score={item.score}
                      reasons={item.reasons}
                    />
                  ))
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-8 text-center">
                    <p className="text-xl font-semibold text-white">
                      No matching EVs found.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">
                      Try another prompt or make the budget more flexible.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
