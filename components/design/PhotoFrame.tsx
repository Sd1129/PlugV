import type { ReactNode } from "react";

type PhotoFrameProps = {
  children: ReactNode;
  className?: string;
  rounded?: "xl" | "2xl" | "3xl";
  glow?: "none" | "soft" | "medium";
  hover?: boolean;
};

const roundedMap: Record<NonNullable<PhotoFrameProps["rounded"]>, string> = {
  xl: "rounded-[1.5rem]",
  "2xl": "rounded-[2rem]",
  "3xl": "rounded-[2.5rem]",
};

const glowMap: Record<NonNullable<PhotoFrameProps["glow"]>, string> = {
  none: "",
  soft: "shadow-[0_20px_70px_-28px_rgba(56,189,248,0.18)]",
  medium: "shadow-[0_30px_100px_-30px_rgba(56,189,248,0.22)]",
};

export default function PhotoFrame({
  children,
  className = "",
  rounded = "3xl",
  glow = "medium",
  hover = true,
}: PhotoFrameProps) {
  return (
    <div
      className={[
        "group relative overflow-hidden border border-white/10 bg-slate-950/50 backdrop-blur-xl",
        roundedMap[rounded],
        glowMap[glow],
        hover ? "transition-transform duration-500 ease-out hover:-translate-y-1" : "",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.18)_45%,rgba(2,6,23,0.55))]" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative">{children}</div>
    </div>
  );
}