import type { ReactNode } from "react";

type SectionBlockProps = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function SectionBlock({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: SectionBlockProps) {
  return (
    <section id={id} className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-slate-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_40%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
            {eyebrow}
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}