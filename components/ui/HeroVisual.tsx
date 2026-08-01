import Image from "next/image";
import Link from "next/link";

type HeroVisualProps = {
  imageSrc: string;
  imageAlt: string;
  cardTitle: string;
  brand: string;
  type: string;
  range: string;
  battery: string;
  charging: string;
  price: string;
  linkHref: string;
};

export default function HeroVisual({
  imageSrc,
  imageAlt,
  cardTitle,
  brand,
  type,
  range,
  battery,
  charging,
  price,
  linkHref,
}: HeroVisualProps) {
  return (
    <div className="relative lg:justify-self-end">
      <div className="overflow-hidden rounded-[34px] border border-emerald-200 bg-[#c8e2bf] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/30 px-6 py-4">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-950">
            Featured EV
          </div>
          <div className="rounded-full bg-emerald-700 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white shadow-lg">
            Popular
          </div>
        </div>

        <div className="relative h-[560px] overflow-hidden">
          <div className="absolute inset-0 opacity-35">
            <HeroVisualBackdrop />
          </div>

          <div className="absolute inset-y-0 right-0 flex w-[76%] items-end justify-center">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={900}
              height={620}
              priority
              className="h-auto w-full object-contain drop-shadow-[0_24px_40px_rgba(15,95,45,0.22)]"
            />
          </div>

          <div className="absolute right-8 top-8 rounded-full bg-white/40 px-4 py-2 text-xs font-bold tracking-[0.25em] text-emerald-950 backdrop-blur">
            FEATURED MODEL
          </div>

          <div className="absolute bottom-6 left-6 w-[255px] rounded-[26px] bg-white p-5 shadow-[0_30px_60px_rgba(0,0,0,0.18)] sm:w-[275px]">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.30em] text-emerald-700">
                PlugV Featured EV
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Popular
              </div>
            </div>

            <h2 className="mt-4 text-[26px] font-black leading-tight text-slate-900">
              {cardTitle}
            </h2>

            <div className="mt-1 text-sm font-medium text-slate-500">
              {brand} • {type}
            </div>

            <div className="mt-5 space-y-3">
              <DetailRow label="Range" value={range} />
              <DetailRow label="Battery" value={battery} />
              <DetailRow label="Charging" value={charging} />
              <DetailRow label="Price" value={price} />
            </div>

            <Link
              href={linkHref}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-emerald-800"
            >
              View Vehicle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function HeroVisualBackdrop() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1200 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="160" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M 160 0 L 0 0 0 120"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        </pattern>
        <pattern id="parts" width="320" height="220" patternUnits="userSpaceOnUse">
          <rect width="320" height="220" fill="transparent" />
          <circle
            cx="60"
            cy="70"
            r="42"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.28"
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="70"
            r="16"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          <path
            d="M 180 42 h 70 l 18 18 v 26 h -98 z"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.24"
            strokeWidth="2"
          />
          <path
            d="M 190 122 c 18 -18 54 -18 74 0"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          <path
            d="M 34 176 h 110"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.22"
            strokeWidth="2"
          />
          <path
            d="M 222 156 l 18 -18 h 34 l 14 14 v 22 h -66 z"
            fill="none"
            stroke="#1f7a38"
            strokeOpacity="0.24"
            strokeWidth="2"
          />
        </pattern>
      </defs>

      <rect width="1200" height="700" fill="url(#grid)" />
      <rect width="1200" height="700" fill="url(#parts)" />
    </svg>
  );
}