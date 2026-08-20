import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Gauge, Sparkles } from "lucide-react";
import { upcomingEVs } from "@/data/upcoming";
import PageContainer from "@/components/ui/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

type UpcomingVehicle = {
  slug: string;
  maker?: string;
  name: string;
  launch: string;
  note?: string;
  range?: string;
  battery?: string;
  charging?: string;
  image?: string;
};

export default function UpcomingVehicles() {
  const featuredUpcoming = (upcomingEVs as UpcomingVehicle[]).slice(0, 4);

  return (
    <section
      className="relative overflow-hidden border-y border-white/10 bg-slate-950 py-20 sm:py-24"
      aria-labelledby="upcoming-vehicles-title"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.08),transparent_28%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

      <PageContainer>
        <div className="flex flex-col gap-10">
          <SectionTitle
            eyebrow="Upcoming EVs"
            title="The future is electric."
            subtitle="Stay ahead with the most anticipated electric vehicle launches in India — curated to help buyers plan their next move."
            action={
              <Button href="/upcoming" variant="secondary" icon>
                View all upcoming EVs
              </Button>
            }
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredUpcoming.map((item, index) => {
              const imageSrc = item.image ?? `/upcoming/${item.slug}.jpg`;

              return (
                <article
                  key={item.slug}
                  className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:border-white/15"
                >
                  <div className="flex items-center justify-between px-5 pt-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-200">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Coming soon
                    </div>

                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {item.launch}
                    </div>
                  </div>

                  <div className="px-5 pt-4">
                    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-slate-950">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_35%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:22px_22px] opacity-20" />

                      <Image
                        src={imageSrc}
                        alt={item.name}
                        width={560}
                        height={320}
                        className="relative z-10 h-[190px] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
                        priority={index < 2}
                      />

                      <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-4">
                        <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-200 backdrop-blur">
                          EV preview
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                      {item.maker ?? "Upcoming EV"}
                    </div>

                    <h3 className="mt-2 text-[1.35rem] font-black leading-tight text-white">
                      {item.name}
                    </h3>

                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-300">
                      {item.note ?? "A new electric model arriving soon."}
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <SpecPill
                        icon={<Sparkles className="h-4 w-4" />}
                        label="Range"
                        value={item.range ?? "TBA"}
                      />
                      <SpecPill
                        icon={<Gauge className="h-4 w-4" />}
                        label="Battery"
                        value={item.battery ?? "TBA"}
                      />
                      <SpecPill
                        icon={<Sparkles className="h-4 w-4" />}
                        label="Charge"
                        value={item.charging ?? "Fast"}
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="text-sm font-medium text-slate-400">
                        Expected launch
                      </div>

                      <Link
                        href="/upcoming"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-white"
                      >
                        View details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function SpecPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-center">
      <div className="flex items-center justify-center gap-1.5 text-sky-300">
        {icon}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  );
}