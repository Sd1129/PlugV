"use client";

import { useEffect, useState } from "react";

import {
  BadgeCheck,
  Clock3,
  Database,
  ShieldCheck,
} from "lucide-react";

type StationTrust = {
  verified: boolean;
  sourceType:
    | "OFFICIAL"
    | "MANUAL"
    | "CRAWLED"
    | "USER_SUBMITTED";
  sourceName?: string;
  lastCheckedAt?: string;
};

function formatLastChecked(value: string | undefined, now: number | null) {
  if (now === null) return "Checking date";
  if (!value) {
    return "Not yet checked";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Check date unavailable";
  }

  const diffMs = now - date.getTime();
  if (diffMs < 0) return "Check date unavailable";
  const days = Math.floor(diffMs / 86_400_000);

  if (days === 0) {
    return "Checked today";
  }

  if (days === 1) {
    return "Checked yesterday";
  }

  if (days < 30) {
    return `Checked ${days} days ago`;
  }

  return `Checked ${date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

export default function StationTrustRow({
  trust,
}: {
  trust?: StationTrust;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setNow(Date.now());
    const initial = setTimeout(update, 0);
    const interval = setInterval(update, 60_000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  if (!trust) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold text-slate-400">
          <Database className="h-3 w-3 text-sky-300" />
          Directory listing
        </span>
        <span className="text-[9px] font-medium text-slate-500">
          Confirm with operator
        </span>
      </div>
    );
  }

  const official = trust.sourceType === "OFFICIAL";
  // Directory verification expires after 90 days; this never establishes live status.
  const checkedAt = Date.parse(trust.lastCheckedAt ?? "");
  const age = now === null ? NaN : now - checkedAt;
  const recentlyChecked = Number.isFinite(age) && age >= 0 && age <= 90 * 86_400_000;

  if (official) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[9px] font-semibold text-sky-200">
          <Database className="h-3 w-3" />
          Official source
        </span>
        <span className="text-[9px] font-medium text-slate-500">{recentlyChecked ? "Status not live" : "Station information not recently verified; status not live"}</span>
        {trust.lastCheckedAt ? <span className="inline-flex items-center gap-1.5 text-[9px] font-medium text-slate-500"><Clock3 className="h-3 w-3" />{formatLastChecked(trust.lastCheckedAt, now)}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {trust.verified && recentlyChecked ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
          <BadgeCheck className="h-3 w-3" />
          Directory information checked
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[9px] font-semibold text-amber-200">
          <ShieldCheck className="h-3 w-3" />
          {recentlyChecked ? "Verification pending" : "Station information not recently verified"}
        </span>
      )}

      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold text-slate-300">
        <Database className="h-3 w-3 text-sky-300" />

        {official
          ? "Official source"
          : trust.sourceType === "USER_SUBMITTED"
            ? "User submitted"
            : trust.sourceType === "CRAWLED"
              ? "Public source"
              : "Manual source"}
      </span>

      <span className="text-[9px] font-medium text-slate-500">Status not live</span>
      {trust.lastCheckedAt ? (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
          <Clock3 className="h-3 w-3" />
          {formatLastChecked(trust.lastCheckedAt, now)}
        </span>
      ) : null}
    </div>
  );
}
