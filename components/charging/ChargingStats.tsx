"use client";

export default function ChargingStats({
  total,
  showing,
  remaining,
  pageSize,
}: {
  total: number;
  showing: number;
  remaining: number;
  pageSize: number;
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Stations in city
        </p>
        <p className="mt-1.5 text-2xl font-semibold text-white">{total}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Showing now
        </p>
        <p className="mt-1.5 text-2xl font-semibold text-white">{showing}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Remaining
        </p>
        <p className="mt-1.5 text-2xl font-semibold text-white">{remaining}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Page size
        </p>
        <p className="mt-1.5 text-2xl font-semibold text-white">{pageSize}</p>
      </div>
    </div>
  );
}