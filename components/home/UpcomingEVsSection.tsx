import SectionBlock from "@/components/home/SectionBlock";
import { upcomingEVs } from "@/components/home/homeData";

export default function UpcomingEVsSection() {
  return (
    <SectionBlock
      id="upcoming"
      eyebrow="Upcoming EVs"
      title="The future is electric."
      subtitle="Stay ahead with the most anticipated electric vehicle launches in India — curated to help buyers plan their next move."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {upcomingEVs.map((item) => (
          <article
            key={item.name}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
              Coming soon
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">{item.name}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">
              {item.launch}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.note}</p>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}