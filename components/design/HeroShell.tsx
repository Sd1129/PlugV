import type { ReactNode } from "react";

type HeroShellProps = {
  children: ReactNode;
  className?: string;
};

export default function HeroShell({
  children,
  className = "",
}: HeroShellProps) {
  return (
    <section
      className={[
        "relative overflow-hidden",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[760px] items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          {children}
        </div>
      </div>
    </section>
  );
}