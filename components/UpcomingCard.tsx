import Link from "next/link";

type UpcomingVehicle = {
  slug: string;
  brand: string;
  name: string;
  launch: string;
  price: string;
  range: string;
};

type UpcomingCardProps = {
  vehicle: UpcomingVehicle;
};

export default function UpcomingCard({ vehicle }: UpcomingCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-[#0f5132]">
            {vehicle.brand}
          </p>
        </div>

        {/* Updated Badge */}
        <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          Expected {vehicle.launch}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-slate-900">
          {vehicle.name}
        </h3>

        <div className="mt-6 grid gap-4">
          <InfoRow
            label="Expected Price"
            value={vehicle.price}
          />

          <InfoRow
            label="Estimated Range"
            value={vehicle.range}
          />

          <InfoRow
            label="Launch"
            value={vehicle.launch}
          />
        </div>

        <Link
          href={`/upcoming/${vehicle.slug}`}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}