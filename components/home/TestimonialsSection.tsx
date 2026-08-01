import SectionBlock from "@/components/home/SectionBlock";
import { testimonials } from "@/components/home/homeData";

export default function TestimonialsSection() {
  return (
    <SectionBlock
      id="testimonials"
      eyebrow="Testimonials"
      title="Proof that the experience feels more refined."
      subtitle="The testimonial section reinforces the PlugV 2.0 story with premium social proof that feels consistent with the rest of the page."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <blockquote
            key={item.name}
            className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.72)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.07]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sm font-semibold text-sky-200">
                {item.name.slice(0, 1)}
              </div>
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-slate-400">{item.role}</p>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-100">
              “{item.quote}”
            </p>

            <div className="mt-6 h-px w-full bg-white/10" />

            <p className="mt-4 text-sm text-slate-400">
              Premium EV decision experience
            </p>
          </blockquote>
        ))}
      </div>
    </SectionBlock>
  );
}