export default function FinalCTASection() {
    return (
      <section id="final-cta" className="relative overflow-hidden py-24 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-slate-950" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
  
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 px-8 py-14 shadow-2xl shadow-black/30 backdrop-blur sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
                Start your journey
              </div>
  
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your next EV deserves a better decision.
              </h2>
  
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                PlugV is India&apos;s EV Intelligence Platform for comparing, discovering, charging, and choosing with confidence.
              </p>
  
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#featured-vehicles"
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Explore India&apos;s EV Platform
                </a>
                <a
                  href="#compare"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Review the comparison
                </a>
              </div>
  
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                <span>Compare EVs</span>
                <span>•</span>
                <span>Discover Charging</span>
                <span>•</span>
                <span>Upcoming Launches</span>
                <span>•</span>
                <span>Buy with Confidence</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }