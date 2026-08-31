import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Gauge,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import TrustSummary from "@/components/vehicles/TrustSummary";
import { vehicles } from "@/data/vehicles";
import { getVehicleVisual } from "@/data/vehicle-images";
import { getBuyingSpecs, startingPriceRupees } from "@/data/vehicle-buying-specs";
import OnRoadPriceEstimator from "@/components/vehicles/OnRoadPriceEstimator";
import VehicleVariantExplorer from "@/components/vehicles/VehicleVariantExplorer";
import { getCompareInsights } from "@/lib/compare/compareEngine";
import { absoluteUrl, safeJsonLd } from "@/lib/seo";

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = vehicles.find((item) => item.slug === slug);
  if (!vehicle) return {};

  const title = `${vehicle.brand} ${vehicle.name} Price, Range & Specs`;
  const description = `Explore ${vehicle.brand} ${vehicle.name} price in India, claimed range, available specifications and comparison tools on PlugV.`;
  return {
    title,
    description,
    alternates: { canonical: `/vehicles/${vehicle.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/vehicles/${vehicle.slug}`,
      images: ["/images/plugv-owned/plugv-compare-hero-2026-08.png"],
    },
  };
}

function accentFor(seed: string) {
  const accents = [
    "from-sky-400/25 via-cyan-400/10 to-transparent",
    "from-fuchsia-400/25 via-rose-400/10 to-transparent",
    "from-emerald-400/25 via-teal-400/10 to-transparent",
    "from-amber-300/25 via-orange-400/10 to-transparent",
    "from-violet-400/25 via-indigo-400/10 to-transparent",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return accents[hash % accents.length];
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10 backdrop-blur">
      <div className="flex items-center gap-2 text-sky-200/80">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-slate-300">
      {children}
    </span>
  );
}

function InfoCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-400">{desc}</p>
    </div>
  );
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const vehicle = vehicles.find((item) => item.slug === resolvedParams.slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = vehicles
    .filter((item) => item.slug !== vehicle.slug)
    .slice(0, 3);

  const accent = accentFor(`${vehicle.brand}-${vehicle.name}`);
  const vehicleVisual = getVehicleVisual(vehicle.slug);
  const vehicleImage = vehicleVisual.src;
  const buyingSpecs = getBuyingSpecs(vehicle.slug);
  const compareInsights = getCompareInsights(vehicles);
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${vehicle.brand} ${vehicle.name}`,
    brand: { "@type": "Brand", name: vehicle.brand },
    category: `Electric ${vehicle.type}`,
    description: `${vehicle.brand} ${vehicle.name} electric vehicle in India with ${vehicle.range ?? "range information"}.`,
    url: absoluteUrl(`/vehicles/${vehicle.slug}`),
    additionalProperty: [
      { "@type": "PropertyValue", name: "Claimed range", value: vehicle.range ?? "Not listed" },
      { "@type": "PropertyValue", name: "Price", value: vehicle.price ?? "Not listed" },
      { "@type": "PropertyValue", name: "Power or battery specification", value: vehicle.charging ?? "Not listed" },
    ],
  };

  const stats = [
    {
      label: "Range",
      value: vehicle.range ?? "—",
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      label: "Power / battery",
      value: vehicle.charging ?? "—",
      icon: <BatteryCharging className="h-4 w-4" />,
    },
    {
      label: "Price",
      value: vehicle.price ?? "—",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      label: "Seating",
      value: `${buyingSpecs.seats} seats`,
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      label: "DC charging time",
      value: buyingSpecs.dcTime,
      icon: <BatteryCharging className="h-4 w-4" />,
    },
    {
      label: "AC charging time",
      value: buyingSpecs.acTime,
      icon: <BatteryCharging className="h-4 w-4" />,
    },
  ];

  const fitCards = [
    {
      title: "City confidence",
      desc: "A quick view of how well this EV fits daily urban use and practical ownership.",
    },
    {
      title: "Charging confidence",
      desc: "A clearer look at charging speed and what that means for real-world use.",
    },
    {
      title: "Premium presentation",
      desc: "The page feels like a product story, not a spec dump.",
    },
  ];
  const keyFeatures = [
    `${vehicle.type} body style with seating for ${buyingSpecs.seats}`,
    `Listed claimed range: ${vehicle.range ?? "Awaiting official specification"}`,
    `Listed power or battery: ${vehicle.charging ?? "Awaiting official specification"}`,
    buyingSpecs.variants.length > 1 ? `${buyingSpecs.variants.length} verified battery configurations in PlugV` : buyingSpecs.variants.length === 1 ? "One verified battery configuration in PlugV" : "Variant-level specifications are being verified",
    buyingSpecs.dcTime === "Not yet verified by PlugV" ? "DC charging time not yet verified by PlugV" : `DC fast charging: ${buyingSpecs.dcTime}`,
    buyingSpecs.acTime === "Not yet verified by PlugV" ? "AC charging time not yet verified by PlugV" : `Indicative AC charging: ${buyingSpecs.acTime}`,
  ];

  const nextSteps = [
    {
      label: "Compare against other EVs",
      href: `/compare?vehicle=${encodeURIComponent(vehicle.slug)}`,
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      label: "Browse the full lineup",
      href: "/vehicles",
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      label: "Check charging options",
      href: "/charging",
      icon: <MapPinned className="h-4 w-4" />,
    },
    {
      label: "Explore upcoming EVs",
      href: "/upcoming",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(vehicleSchema) }} />
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_28%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Explore EVs
            </Link>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              {vehicle.brand}
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.35rem]">
              {vehicle.name}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {vehicle.brand} · {vehicle.type} · {vehicle.status}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              A premium EV profile built to surface the most important decision details first, so buyers can move from browsing to confidence more quickly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Badge>Premium EV profile</Badge>
              <Badge>Decision-ready</Badge>
              <Badge>India-focused</Badge>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/compare?vehicle=${encodeURIComponent(vehicle.slug)}`}
                className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Compare on PlugV
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Search PlugV
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-sky-400/10 blur-3xl" />

            <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className={`relative h-[360px] overflow-hidden bg-gradient-to-br ${accent}`}>
                {vehicleImage ? (
                  <Image
                    src={vehicleImage}
                    alt={`PlugV concept visual representing the ${vehicle.type} category; actual ${vehicle.brand} ${vehicle.name} may differ`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(225deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:26px_26px] opacity-15" />

                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                  PlugV concept · Actual vehicle may differ
                </div>

              </div>

              <div className="grid gap-4 p-6">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Quick summary
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    A cleaner EV buying view.
                  </h3>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Platform
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {vehicle.type}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        State
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {vehicle.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-4 sm:px-6 lg:px-8">
        <VehicleVariantExplorer vehicleName={`${vehicle.brand} ${vehicle.name}`} bodyType={vehicle.type} seating={buyingSpecs.seats} listedRange={vehicle.range ?? "Awaiting official specification"} listedPower={vehicle.charging ?? "Awaiting official specification"} variants={buyingSpecs.variantDetails} />
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-7"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">Key features</p><h2 className="mt-2 text-2xl font-semibold">What stands out at a glance</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{keyFeatures.map((feature) => <div key={feature} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /><p className="text-sm leading-6 text-slate-300">{feature}</p></div>)}</div>{buyingSpecs.sourceUrl ? <a href={buyingSpecs.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-xs font-semibold text-sky-300 hover:text-sky-200">Source: {buyingSpecs.sourceName} · checked {buyingSpecs.verifiedAt}</a> : <p className="mt-5 text-xs leading-5 text-slate-500">Model-wide catalogue values only. Confirm trim equipment and specifications with the manufacturer or dealer before purchase.</p>}</div>
        <OnRoadPriceEstimator vehicleName={`${vehicle.brand} ${vehicle.name}`} startingPrice={startingPriceRupees(vehicle.price)} variants={buyingSpecs.variants} />
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-10">
          <TrustSummary vehicle={vehicle} />
        </div>
      </div>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Why this EV stands out
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                What PlugV helps buyers understand.
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {fitCards.map((item) => (
                  <InfoCard key={item.title} title={item.title} desc={item.desc} />
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Compare context
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                How it fits the current lineup.
              </h2>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Best for range
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {compareInsights.bestRange?.vehicle?.name ?? "—"}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Best for charging
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {compareInsights.bestCharging?.vehicle?.name ?? "—"}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Best for value
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {compareInsights.bestValue?.vehicle?.name ?? "—"}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-sky-400/15 bg-sky-400/10 p-5">
                <div className="flex items-center gap-2 text-sky-200">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.24em]">
                    PlugV insight
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  The detail page should feel like a premium product page: calm, informative, and built to help the buyer move forward with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Next steps
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                What the buyer can do next.
              </h2>
            </div>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
            >
              View all vehicles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {nextSteps.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.07]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-sky-200">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{item.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">
                Related EVs
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                More models to explore.
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {relatedVehicles.map((item, index) => {
              const relatedAccent = accentFor(`${item.brand}-${item.name}`);

              return (
                <article
                  key={item.slug}
                  className="group overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.75)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/20 hover:shadow-[0_30px_100px_-24px_rgba(56,189,248,0.22)]"
                >
                  <div
                    className={`relative h-[260px] overflow-hidden bg-gradient-to-br ${relatedAccent}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
                    <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                      #{index + 1} pick
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                        Related model
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.brand} • {item.type}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <StatCard
                        label="Range"
                        value={item.range ?? "—"}
                        icon={<Gauge className="h-4 w-4" />}
                      />
                      <StatCard
                        label="Power / battery"
                        value={item.charging ?? "—"}
                        icon={<BatteryCharging className="h-4 w-4" />}
                      />
                      <StatCard
                        label="Price"
                        value={item.price ?? "—"}
                        icon={<Sparkles className="h-4 w-4" />}
                      />
                    </div>

                    <Link
                      href={`/vehicles/${item.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
