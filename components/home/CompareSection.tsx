import SectionBlock from "@/components/home/SectionBlock";
import { compareRows } from "@/components/home/homeData";

export default function CompareSection() {
  return (
    <SectionBlock
      id="compare"
      eyebrow="Why PlugV"
      title="A clearer comparison experience."
      subtitle="The comparison section explains the shift from a fragmented flow to a cleaner, faster, more confident product experience."
    >
      <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                  Side-by-side comparison
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Old experience vs PlugV 2.0
                </h3>
              </div>

              <div className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
                Clearer flow
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {compareRows.map((row) => (
              <div
                key={row.label}
                className="grid gap-4 px-6 py-5 sm:grid-cols-[160px_1fr_1fr]"
              >
                <div className="font-medium text-white">{row.label}</div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-300/80">
                    Before
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {row.before}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
                    After
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {row.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-300/80">
            Comparison lens
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Built for faster decisions.
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Clear states, fewer distractions, and a cleaner way to move from browsing to action.
          </p>

          <div className="mt-6 grid gap-4">
            {[
              {
                title: "Focus on the essentials",
                desc: "The important details are visible first.",
              },
              {
                title: "Side-by-side clarity",
                desc: "Before and after are easy to compare at a glance.",
              },
              {
                title: "Premium hierarchy",
                desc: "The design feels calmer and more deliberate.",
              },
              {
                title: "Cleaner path to action",
                desc: "The section points visitors toward the next step.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </SectionBlock>
  );
}