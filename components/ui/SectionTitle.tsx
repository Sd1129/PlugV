import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
};

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
}: SectionTitleProps) {
  return (
    <div
      className={[
        "flex max-w-4xl flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
      ].join(" ")}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200 shadow-sm">
        {eyebrow}
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-4xl lg:text-5xl">
          {title}
        </h2>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {subtitle ? (
        <p className="max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}