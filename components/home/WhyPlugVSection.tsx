import SectionBlock from "@/components/home/SectionBlock";
import { reasonBlocks } from "@/components/home/homeData";

export default function WhyPlugVSection() {
  return (
    <SectionBlock
      id="why-plugv"
      eyebrow="Why PlugV"
      title="What can PlugV do for me?"
      subtitle="Instead of statistics, this section uses six premium feature blocks to show exactly how PlugV helps shoppers move from curiosity to confidence."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reasonBlocks.map((item) => (
          <article
            key={item.title}
            className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.65)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sm font-semibold text-sky-200">
                {item.title.slice(0, 1)}
              </div>
              <div className="ml-4 h-px flex-1 bg-white/10" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{item.desc}</p>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}