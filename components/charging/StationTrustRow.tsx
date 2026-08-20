"use client";

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

function formatLastChecked(value?: string) {
  if (!value) {
    return "Not yet checked";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Check date unavailable";
  }

  const diffMs = Date.now() - date.getTime();
  const days = Math.max(0, Math.floor(diffMs / 86_400_000));

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
  if (!trust) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold text-slate-400">
          <ShieldCheck className="h-3 w-3" />
          Verification pending
        </span>
      </div>
    );
  }

  const official = trust.sourceType === "OFFICIAL";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {trust.verified ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
          <BadgeCheck className="h-3 w-3" />
          Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[9px] font-semibold text-amber-200">
          <ShieldCheck className="h-3 w-3" />
          Verification pending
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

      {trust.lastCheckedAt ? (
        <span className="inline-flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
          <Clock3 className="h-3 w-3" />
          {formatLastChecked(trust.lastCheckedAt)}
        </span>
      ) : null}
    </div>
  );
}