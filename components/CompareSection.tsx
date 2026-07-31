"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  BatteryCharging,
  CarFront,
  Gauge,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { vehicles } from "@/data/vehicles";

type Vehicle = (typeof vehicles)[number];
type MetricKey = "range" | "battery" | "charging" | "price" | "seats" | "drivetrain";

type ScoreSet = {
  overall: number;
  city: number;
  family: number;
  longTrip: number;
  value: number;
  range: number;
  battery: number;
  charging: number;
  price: number;
  seats: number;
  drivetrain: number;
};

type MetricRow = {
  key: MetricKey;
  label: string;
  note: string;
  leftValue: string;
  rightValue: string;
  winner: "left" | "right" | "tie";
};

export default function CompareSection() {
  const launchedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.launched),
    []
  );

  const defaultLeft =
    launchedVehicles.find((vehicle) => vehicle.slug === "mg-windsor-ev") ??
    launchedVehicles[0];

  const defaultRight =
    launchedVehicles.find((vehicle) => vehicle.slug === "tata-nexon-ev") ??
    launchedVehicles.find((vehicle) => vehicle.slug !== defaultLeft.slug) ??
    defaultLeft;

  const [leftSlug, setLeftSlug] = useState(defaultLeft.slug);
  const [rightSlug, setRightSlug] = useState(defaultRight.slug);

  const leftVehicle =
    launchedVehicles.find((vehicle) => vehicle.slug === leftSlug) ?? defaultLeft;

  const rightVehicle =
    launchedVehicles.find((vehicle) => vehicle.slug === rightSlug) ?? defaultRight;

  const handleLeftChange = (slug: string) => {
    setLeftSlug(slug);
    if (slug === rightSlug) {
      const fallback = launchedVehicles.find((vehicle) => vehicle.slug !== slug);
      if (fallback) setRightSlug(fallback.slug);
    }
  };

  const handleRightChange = (slug: string) => {
    setRightSlug(slug);
    if (slug === leftSlug) {
      const fallback = launchedVehicles.find((vehicle) => vehicle.slug !== slug);
      if (fallback) setLeftSlug(fallback.slug);
    }
  };

  const handleSwap = () => {
    setLeftSlug(rightSlug);
    setRightSlug(leftSlug);
  };

  const leftScores = useMemo(
    () => buildScoreSet(leftVehicle, rightVehicle),
    [leftVehicle, rightVehicle]
  );

  const rightScores = useMemo(
    () => buildScoreSet(rightVehicle, leftVehicle),
    [rightVehicle, leftVehicle]
  );

  const metricRows = useMemo<MetricRow[]>(
    () => [
      {
        key: "range",
        label: "Range",
        note: "Longer range means fewer charging stops on longer journeys.",
        leftValue: leftVehicle.range,
        rightValue: rightVehicle.range,
        winner: winnerByHigher(
          parseNumber(leftVehicle.range),
          parseNumber(rightVehicle.range)
        ),
      },
      {
        key: "battery",
        label: "Battery",
        note: "A bigger battery usually gives more usable distance and confidence.",
        leftValue: leftVehicle.battery,
        rightValue: rightVehicle.battery,
        winner: winnerByHigher(
          parseNumber(leftVehicle.battery),
          parseNumber(rightVehicle.battery)
        ),
      },
      {
        key: "charging",
        label: "Charging",
        note: "Faster charging helps when you are short on time.",
        leftValue: leftVehicle.charging,
        rightValue: rightVehicle.charging,
        winner: winnerByLower(
          parseNumber(leftVehicle.charging),
          parseNumber(rightVehicle.charging)
        ),
      },
      {
        key: "price",
        label: "Price",
        note: "Lower price usually improves overall value and buying comfort.",
        leftValue: leftVehicle.price,
        rightValue: rightVehicle.price,
        winner: winnerByLower(
          parsePrice(leftVehicle.price),
          parsePrice(rightVehicle.price)
        ),
      },
      {
        key: "seats",
        label: "Seats",
        note: "More seats can make the vehicle better for families and group travel.",
        leftValue: leftVehicle.seats,
        rightValue: rightVehicle.seats,
        winner: winnerByHigher(
          parseNumber(leftVehicle.seats),
          parseNumber(rightVehicle.seats)
        ),
      },
      {
        key: "drivetrain",
        label: "Drivetrain",
        note: "This is a tie-break detail rather than a decisive performance factor.",
        leftValue: leftVehicle.drivetrain,
        rightValue: rightVehicle.drivetrain,
        winner: "tie",
      },
    ],
    [leftVehicle, rightVehicle]
  );

  const verdict = useMemo(() => {
    const cityWinner = leftScores.city >= rightScores.city ? leftVehicle : rightVehicle;
    const familyWinner =
      leftScores.family >= rightScores.family ? leftVehicle : rightVehicle;
    const longTripWinner =
      leftScores.longTrip >= rightScores.longTrip ? leftVehicle : rightVehicle;
    const valueWinner = leftScores.value >= rightScores.value ? leftVehicle : rightVehicle;
    const overallWinner =
      leftScores.overall >= rightScores.overall ? leftVehicle : rightVehicle;

    return {
      overallWinner,
      cityWinner,
      familyWinner,
      longTripWinner,
      valueWinner,
    };
  }, [leftScores, rightScores, leftVehicle, rightVehicle]);

  const similarEVs = useMemo(() => {
    return launchedVehicles
      .filter(
        (vehicle) =>
          vehicle.slug !== leftVehicle.slug && vehicle.slug !== rightVehicle.slug
      )
      .slice(0, 3);
  }, [launchedVehicles, leftVehicle.slug, rightVehicle.slug]);

  const leftOptions = launchedVehicles.filter((vehicle) => vehicle.slug !== rightSlug);
  const rightOptions = launchedVehicles.filter((vehicle) => vehicle.slug !== leftSlug);

  return (
    <section className="border-b border-emerald-200 bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#dfeedd_55%,#d8ead6_100%)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            PlugV Compare
          </div>

          <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
            Compare EVs with confidence
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Select two electric vehicles and compare premium insights, winner badges,
            visual scores, and a PlugV Verdict designed for real buyers.
          </p>
        </div>

        <div className="mt-10 grid gap-4 rounded-[32px] border border-emerald-100 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto_1fr]">
          <SelectCard
            title="Choose Vehicle A"
            subtitle="Your first comparison pick"
            value={leftSlug}
            onChange={handleLeftChange}
            options={leftOptions}
            selectedVehicle={leftVehicle}
            accent="left"
          />

          <div className="flex items-center justify-center py-4 lg:py-0">
            <button
              type="button"
              onClick={handleSwap}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold uppercase tracking-[0.22em] text-emerald-700 transition hover:bg-emerald-100"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Swap
            </button>
          </div>

          <SelectCard
            title="Choose Vehicle B"
            subtitle="Your second comparison pick"
            value={rightSlug}
            onChange={handleRightChange}
            options={rightOptions}
            selectedVehicle={rightVehicle}
            accent="right"
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <VehicleSummaryCard
                vehicle={leftVehicle}
                score={leftScores.overall}
                tone="left"
              />
              <VehicleSummaryCard
                vehicle={rightVehicle}
                score={rightScores.overall}
                tone="right"
              />
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Side-by-side breakdown
                  </div>
                  <h3 className="mt-2 text-3xl font-bold text-slate-950">
                    Detailed spec comparison
                  </h3>
                </div>

                <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 md:flex">
                  <BadgeCheck className="h-4 w-4" />
                  Premium view
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {metricRows.map((row) => (
                  <MetricRow
                    key={row.key}
                    row={row}
                    leftVehicle={leftVehicle}
                    rightVehicle={rightVehicle}
                    leftScore={getMetricScore(row.key, leftVehicle, rightVehicle)}
                    rightScore={getMetricScore(row.key, rightVehicle, leftVehicle)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Winner badges
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <WinnerBadge
                  title="Longer Range"
                  winner={
                    winnerByHigher(
                      parseNumber(leftVehicle.range),
                      parseNumber(rightVehicle.range)
                    ) === "left"
                      ? leftVehicle.name
                      : winnerByHigher(
                          parseNumber(leftVehicle.range),
                          parseNumber(rightVehicle.range)
                        ) === "right"
                      ? rightVehicle.name
                      : "Tie"
                  }
                  left={leftVehicle.range}
                  right={rightVehicle.range}
                />

                <WinnerBadge
                  title="Better Value"
                  winner={
                    winnerByLower(
                      parsePrice(leftVehicle.price),
                      parsePrice(rightVehicle.price)
                    ) === "left"
                      ? leftVehicle.name
                      : winnerByLower(
                          parsePrice(leftVehicle.price),
                          parsePrice(rightVehicle.price)
                        ) === "right"
                      ? rightVehicle.name
                      : "Tie"
                  }
                  left={leftVehicle.price}
                  right={rightVehicle.price}
                />

                <WinnerBadge
                  title="Faster Charging"
                  winner={
                    winnerByLower(
                      parseNumber(leftVehicle.charging),
                      parseNumber(rightVehicle.charging)
                    ) === "left"
                      ? leftVehicle.name
                      : winnerByLower(
                          parseNumber(leftVehicle.charging),
                          parseNumber(rightVehicle.charging)
                        ) === "right"
                      ? rightVehicle.name
                      : "Tie"
                  }
                  left={leftVehicle.charging}
                  right={rightVehicle.charging}
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                <CarFront className="h-4 w-4" />
                Similar EVs
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {similarEVs.map((vehicle) => (
                  <Link
                    key={vehicle.slug}
                    href={`/vehicles/${vehicle.slug}`}
                    className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcf7_100%)] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      {vehicle.brand}
                    </div>
                    <h4 className="mt-2 text-2xl font-black text-slate-950">
                      {vehicle.name}
                    </h4>
                    <p className="mt-3 text-sm text-slate-600">
                      {vehicle.range} • {vehicle.price}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      View vehicle <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-sm">
              <div className="px-6 py-5">
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  PlugV Compare
                </div>
                <h3 className="mt-2 text-3xl font-black text-slate-950">
                  Choose smart. Drive electric.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
                  A premium side-by-side comparison view for selecting the EV that fits
                  your lifestyle.
                </p>
              </div>

              <div className="relative h-[360px] bg-[radial-gradient(circle_at_top,#f4fbf4_0%,#e8f4e3_45%,#dbead8_100%)]">
                <Image
                  src="/compare-hero.png"
                  alt="PlugV Compare hero"
                  fill
                  priority
                  className="object-contain p-4"
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-950 bg-slate-950 p-6 text-white shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                <Trophy className="h-4 w-4" />
                PlugV Verdict
              </div>

              <h3 className="mt-4 text-3xl font-black">
                {verdict.overallWinner.name} takes the edge
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {verdict.overallWinner.name} is the stronger all-round pick based on the
                selected specs and the current comparison settings.
              </p>

              <div className="mt-6 grid gap-3">
                <VerdictChip label="City driving" vehicle={verdict.cityWinner} />
                <VerdictChip label="Family use" vehicle={verdict.familyWinner} />
                <VerdictChip label="Long trips" vehicle={verdict.longTripWinner} />
                <VerdictChip label="Value for money" vehicle={verdict.valueWinner} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ScoreCard
                label={leftVehicle.name}
                score={leftScores.overall}
                sub="Overall compatibility score"
                tone="left"
              />
              <ScoreCard
                label={rightVehicle.name}
                score={rightScores.overall}
                sub="Overall compatibility score"
                tone="right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectCard({
  title,
  subtitle,
  value,
  onChange,
  options,
  selectedVehicle,
  accent,
}: {
  title: string;
  subtitle: string;
  value: string;
  onChange: (value: string) => void;
  options: Vehicle[];
  selectedVehicle: Vehicle;
  accent: "left" | "right";
}) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {title}
          </div>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-700">
          {accent === "left" ? "A" : "B"}
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-3">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-500"
        >
          {options.map((vehicle) => (
            <option key={vehicle.slug} value={vehicle.slug}>
              {vehicle.name} — {vehicle.price}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 rounded-[24px] bg-[linear-gradient(180deg,#f8fcf7_0%,#eef8eb_100%)] p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
          Current selection
        </div>
        <div className="mt-2 text-xl font-black text-slate-950">
          {selectedVehicle.name}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="rounded-full bg-white px-3 py-1 font-semibold">
            {selectedVehicle.type}
          </span>
          <span className="rounded-full bg-white px-3 py-1 font-semibold">
            {selectedVehicle.range}
          </span>
          <span className="rounded-full bg-white px-3 py-1 font-semibold">
            {selectedVehicle.price}
          </span>
        </div>
      </div>
    </div>
  );
}

function VehicleSummaryCard({
  vehicle,
  score,
  tone,
}: {
  vehicle: Vehicle;
  score: number;
  tone: "left" | "right";
}) {
  return (
    <div className="rounded-[32px] border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {vehicle.brand}
          </div>
          <h3 className="mt-2 text-3xl font-black text-slate-950">{vehicle.name}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {vehicle.type} • {vehicle.status}
          </p>
        </div>

        <div
          className={[
            "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]",
            tone === "left"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-sky-50 text-sky-700",
          ].join(" ")}
        >
          PlugV Score
        </div>
      </div>

      <div className="mt-6 flex items-end gap-4">
        <div className="text-6xl font-black text-slate-950">{score}</div>
        <div className="pb-1 text-sm font-medium text-slate-500">out of 100</div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={[
            "h-full rounded-full",
            tone === "left"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-700"
              : "bg-gradient-to-r from-sky-500 to-emerald-600",
          ].join(" ")}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MiniStat label="Range" value={vehicle.range} />
        <MiniStat label="Charge" value={vehicle.charging} />
        <MiniStat label="Price" value={vehicle.price} />
      </div>
    </div>
  );
}

function MetricRow({
  row,
  leftVehicle,
  rightVehicle,
  leftScore,
  rightScore,
}: {
  row: MetricRow;
  leftVehicle: Vehicle;
  rightVehicle: Vehicle;
  leftScore: number;
  rightScore: number;
}) {
  const winnerLabel =
    row.winner === "left"
      ? leftVehicle.name
      : row.winner === "right"
      ? rightVehicle.name
      : "Tie";

  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
            {row.label}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{row.note}</p>
        </div>

        <div
          className={[
            "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]",
            row.winner === "tie"
              ? "bg-slate-200 text-slate-700"
              : "bg-emerald-700 text-white",
          ].join(" ")}
        >
          {row.winner === "tie" ? "Tie" : `Winner: ${winnerLabel}`}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr]">
        <MetricCard
          name={leftVehicle.name}
          value={row.leftValue}
          score={leftScore}
          win={row.winner === "left"}
        />

        <div className="hidden items-center justify-center md:flex">
          <div className="rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            VS
          </div>
        </div>

        <MetricCard
          name={rightVehicle.name}
          value={row.rightValue}
          score={rightScore}
          win={row.winner === "right"}
          alignRight
        />
      </div>
    </div>
  );
}

function MetricCard({
  name,
  value,
  score,
  win,
  alignRight = false,
}: {
  name: string;
  value: string;
  score: number;
  win: boolean;
  alignRight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[24px] border bg-white p-4 shadow-sm",
        win ? "border-emerald-500 ring-2 ring-emerald-200" : "border-slate-200",
        alignRight ? "text-right" : "text-left",
      ].join(" ")}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {name}
      </div>
      <div className="mt-2 text-lg font-black text-slate-950">{value}</div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={["h-full rounded-full", win ? "bg-emerald-700" : "bg-slate-400"].join(
              " "
            )}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="text-sm font-semibold text-slate-500">{score}</div>
      </div>
    </div>
  );
}

function VerdictChip({
  label,
  vehicle,
}: {
  label: string;
  vehicle: Vehicle;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
        {label}
      </div>
      <div className="mt-2 text-base font-bold text-white">{vehicle.name}</div>
      <div className="mt-1 text-sm text-slate-300">
        {vehicle.range} • {vehicle.price}
      </div>
    </div>
  );
}

function WinnerBadge({
  title,
  winner,
  left,
  right,
}: {
  title: string;
  winner: string;
  left: string;
  right: string;
}) {
  return (
    <div className="rounded-[26px] border border-emerald-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fcf7_100%)] p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
        <Trophy className="h-4 w-4" />
        {title}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">Left: {left}</div>
        <div className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
          {winner}
        </div>
        <div className="text-sm text-slate-500">Right: {right}</div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  sub,
  tone,
}: {
  label: string;
  score: number;
  sub: string;
  tone: "left" | "right";
}) {
  const barTone =
    tone === "left"
      ? "from-emerald-500 to-emerald-700"
      : "from-sky-500 to-emerald-600";

  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {sub}
      </div>
      <div className="mt-2 text-xl font-bold text-slate-950">{label}</div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barTone}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="text-2xl font-black text-slate-950">{score}</div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-slate-50 px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-slate-950">{value}</div>
    </div>
  );
}

function parseNumber(value: string): number {
  const match = value.match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : 0;
}

function parsePrice(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, "");
  return cleaned ? Number.parseFloat(cleaned) : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function relativeHigher(value: number, other: number): number {
  if (!value && !other) return 78;
  if (value === other) return 78;
  const max = Math.max(value, other, 0.01);
  return clamp(Math.round(40 + 60 * (value / max)), 40, 100);
}

function relativeLower(value: number, other: number): number {
  if (!value && !other) return 78;
  if (value === other) return 78;
  const min = Math.min(value || other, other || value, 0.01);
  return clamp(Math.round(40 + 60 * (min / Math.max(value, 0.01))), 40, 100);
}

function getMetricScore(key: MetricKey, vehicle: Vehicle, other: Vehicle): number {
  switch (key) {
    case "range":
      return relativeHigher(parseNumber(vehicle.range), parseNumber(other.range));
    case "battery":
      return relativeHigher(parseNumber(vehicle.battery), parseNumber(other.battery));
    case "charging":
      return relativeLower(parseNumber(vehicle.charging), parseNumber(other.charging));
    case "price":
      return relativeLower(parsePrice(vehicle.price), parsePrice(other.price));
    case "seats":
      return relativeHigher(parseNumber(vehicle.seats), parseNumber(other.seats));
    case "drivetrain":
      return vehicle.drivetrain === other.drivetrain ? 78 : 72;
    default:
      return 70;
  }
}

function buildScoreSet(vehicle: Vehicle, other: Vehicle): ScoreSet {
  const range = getMetricScore("range", vehicle, other);
  const battery = getMetricScore("battery", vehicle, other);
  const charging = getMetricScore("charging", vehicle, other);
  const price = getMetricScore("price", vehicle, other);
  const seats = getMetricScore("seats", vehicle, other);
  const drivetrain = getMetricScore("drivetrain", vehicle, other);

  const overall = Math.round(
    range * 0.27 +
      battery * 0.15 +
      charging * 0.2 +
      price * 0.2 +
      seats * 0.1 +
      drivetrain * 0.08
  );

  const city = Math.round(charging * 0.45 + price * 0.35 + range * 0.2);
  const family = Math.round(seats * 0.35 + range * 0.35 + battery * 0.15 + price * 0.15);
  const longTrip = Math.round(range * 0.45 + charging * 0.3 + battery * 0.15 + price * 0.1);
  const value = Math.round(price * 0.4 + range * 0.3 + charging * 0.2 + battery * 0.1);

  return {
    overall,
    city,
    family,
    longTrip,
    value,
    range,
    battery,
    charging,
    price,
    seats,
    drivetrain,
  };
}

function winnerByHigher(left: number, right: number): "left" | "right" | "tie" {
  if (left > right) return "left";
  if (right > left) return "right";
  return "tie";
}

function winnerByLower(left: number, right: number): "left" | "right" | "tie" {
  if (left < right) return "left";
  if (right < left) return "right";
  return "tie";
}