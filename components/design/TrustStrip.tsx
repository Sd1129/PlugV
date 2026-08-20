import type { ReactNode } from "react";

type TrustItem = {
  label: string;
  value?: string;
  icon?: ReactNode;
};

type TrustStripProps = {
  items: TrustItem[];
  className?: string;
  compact?: boolean;
};

export default function TrustStrip({
  items,
  className = "",
  compact = false,
}: TrustStripProps) {
  return (
    <div
      className={[
        "grid gap-3",
        compact ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4",
        className,
      ].join(" ")}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur"
        >
          <div className="flex items-center justify-center gap-2 text-sky-200/80">
            {item.icon}
            {item.value ? (
              <span className="text-sm font-semibold tracking-tight text-white">
                {item.value}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-300">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}