import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  intensity?: "light" | "medium" | "strong";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "lg" | "xl" | "2xl" | "3xl";
};

const intensityMap: Record<NonNullable<GlassPanelProps["intensity"]>, string> =
  {
    light:
      "bg-white/[0.03] border-white/10 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.35)] backdrop-blur-md",
    medium:
      "bg-white/[0.05] border-white/10 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.55)] backdrop-blur-xl",
    strong:
      "bg-slate-950/65 border-white/10 shadow-[0_30px_100px_-30px_rgba(0,0,0,0.70)] backdrop-blur-2xl",
  };

const paddingMap: Record<NonNullable<GlassPanelProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const roundedMap: Record<NonNullable<GlassPanelProps["rounded"]>, string> = {
  lg: "rounded-2xl",
  xl: "rounded-[1.75rem]",
  "2xl": "rounded-[2rem]",
  "3xl": "rounded-[2.5rem]",
};

export default function GlassPanel({
  children,
  className = "",
  as: Component = "div",
  intensity = "medium",
  padding = "md",
  rounded = "2xl",
}: GlassPanelProps) {
  return (
    <Component
      className={[
        "overflow-hidden border",
        intensityMap[intensity],
        paddingMap[padding],
        roundedMap[rounded],
        className,
      ].join(" ")}
    >
      {children}
    </Component>
  );
}