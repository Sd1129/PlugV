import type { ReactNode } from "react";

type HeroBadgeProps = {
  children: ReactNode;
};

export default function HeroBadge({ children }: HeroBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
      {children}
    </div>
  );
}