import Image from "next/image";

type HeroBackgroundProps = {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  overlayStrength?: "light" | "medium" | "strong";
};

const overlayMap: Record<
  NonNullable<HeroBackgroundProps["overlayStrength"]>,
  string
> = {
  light: "from-slate-950/20 via-slate-950/35 to-slate-950/70",
  medium: "from-slate-950/35 via-slate-950/55 to-slate-950/85",
  strong: "from-slate-950/50 via-slate-950/70 to-slate-950/95",
};

export default function HeroBackground({
  imageSrc = "/images/hero/plugv-hero-placeholder.webp",
  imageAlt = "PlugV hero placeholder",
  className = "",
  overlayStrength = "medium",
}: HeroBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={["absolute inset-0 -z-10 overflow-hidden bg-slate-950", className].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.20),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.95),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.10)_12%,rgba(2,6,23,0.35)_45%,rgba(2,6,23,0.88))]" />

      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70 mix-blend-screen"
        />
      </div>

      <div
        className={["absolute inset-0 bg-gradient-to-b", overlayMap[overlayStrength]].join(" ")}
      />

      <div className="absolute -left-24 top-[-6rem] h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
    </div>
  );
}