import Link from "next/link";
import Image from "next/image";
import type { Vehicle } from "@/data/vehicles";

export default function VehicleCard({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image Panel */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-100">

        <Image
          src={`/vehicles/${vehicle.slug}.jpg`}
          alt={vehicle.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute left-4 top-4 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white shadow-md">
          {vehicle.status}
        </div>

        {/* Brand Badge */}
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
          {vehicle.brand}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">

        <h3 className="text-2xl font-bold text-slate-900">
          {vehicle.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {vehicle.type}
        </p>

        {/* Vehicle Specs */}
        <div className="mt-6 space-y-4">

          <Row label="Range" value={vehicle.range} />

          <Row label="Charging" value={vehicle.charging} />

          <Row label="Battery" value={vehicle.battery} />

        </div>

        {/* Price */}
        <div className="mt-8">

          <div className="text-sm uppercase tracking-wide text-slate-400">
            Starting Price
          </div>

          <div className="mt-1 text-3xl font-black text-emerald-700">
            {vehicle.price}
          </div>

        </div>

        {/* CTA */}
        <Link
          href={`/vehicles/${vehicle.slug}`}
          className="mt-8 flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View Details →
        </Link>

      </div>
    </article>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value}
      </span>

    </div>
  );
}