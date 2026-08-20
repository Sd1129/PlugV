"use client";

import { useMemo } from "react";
import { BatteryCharging, MapPin, Route, Zap } from "lucide-react";

type RoutePoint = {
  state: string;
  city: string;
  label: string;
  order: number;
};

type TravelRouteMapProps = {
  fromCity: string;
  toCity: string;
  corridor: RoutePoint[];
};

type MapPoint = RoutePoint & {
  x: number;
  y: number;
  isOrigin: boolean;
  isDestination: boolean;
  isChargingStop: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function TravelRouteMap({
  fromCity,
  toCity,
  corridor,
}: TravelRouteMapProps) {
  const mapPoints = useMemo<MapPoint[]>(() => {
    if (!corridor.length) {
      return [];
    }

    const total = Math.max(corridor.length - 1, 1);

    return corridor.map((point, index) => {
      const progress = index / total;

      /*
       * Give the route a gentle natural curve.
       * The horizontal position is based on corridor order,
       * so the route always changes when From / To changes.
       */
      const x = 8 + progress * 84;

      const wave =
        Math.sin(progress * Math.PI * 2.4) * 13 +
        Math.sin(progress * Math.PI * 4.6) * 5;

      const y = clamp(52 + wave, 25, 75);

      return {
        ...point,
        x,
        y,
        isOrigin: index === 0,
        isDestination: index === corridor.length - 1,
        isChargingStop:
          index > 0 && index < corridor.length - 1,
      };
    });
  }, [corridor]);

  const routePath = useMemo(() => {
    if (mapPoints.length < 2) {
      return "";
    }

    const first = mapPoints[0];

    let path = `M ${first.x} ${first.y}`;

    for (let i = 1; i < mapPoints.length; i += 1) {
      const previous = mapPoints[i - 1];
      const current = mapPoints[i];

      const midpointX = (previous.x + current.x) / 2;

      path += `
        C
        ${midpointX} ${previous.y},
        ${midpointX} ${current.y},
        ${current.x} ${current.y}
      `;
    }

    return path;
  }, [mapPoints]);

  if (!mapPoints.length) {
    return (
      <div className="relative h-[340px] overflow-hidden rounded-[1.9rem] border border-white/15 bg-slate-950/30 backdrop-blur-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.10),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(37,99,235,0.10),transparent_30%)]" />

        <div className="relative flex h-full items-center justify-center text-sm text-slate-400">
          Select a route to view the journey.
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.9rem] border border-white/20 bg-slate-950/20 shadow-2xl shadow-black/25 backdrop-blur-[5px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[18%] h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[8%] bottom-[15%] h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Map surface */}
      <div className="relative h-[350px] overflow-hidden sm:h-[380px]">
        {/* Subtle terrain / geographic texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(30,64,175,0.22),transparent_30%),radial-gradient(ellipse_at_72%_58%,rgba(14,116,144,0.18),transparent_28%),linear-gradient(145deg,rgba(2,6,23,0.40),rgba(2,6,23,0.14))]" />

        {/* Topographic-style contour lines */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-25"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M-5 25 C 15 5, 35 8, 55 22 S 82 42, 105 24"
            fill="none"
            stroke="rgba(148,163,184,0.22)"
            strokeWidth="0.35"
          />
          <path
            d="M-10 40 C 16 18, 34 19, 53 35 S 83 54, 108 36"
            fill="none"
            stroke="rgba(148,163,184,0.18)"
            strokeWidth="0.35"
          />
          <path
            d="M-8 58 C 15 39, 38 41, 58 54 S 84 74, 108 58"
            fill="none"
            stroke="rgba(148,163,184,0.16)"
            strokeWidth="0.35"
          />
          <path
            d="M-8 77 C 15 58, 34 61, 56 74 S 86 91, 108 76"
            fill="none"
            stroke="rgba(148,163,184,0.14)"
            strokeWidth="0.35"
          />

          <path
            d="M18 0 C 8 20, 20 34, 17 51 S 12 78, 24 104"
            fill="none"
            stroke="rgba(56,189,248,0.12)"
            strokeWidth="0.45"
          />

          <path
            d="M70 -4 C 61 15, 74 30, 70 48 S 64 80, 78 104"
            fill="none"
            stroke="rgba(56,189,248,0.10)"
            strokeWidth="0.45"
          />
        </svg>

        {/* Fine map grid */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Header */}
        <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-5 sm:right-5 sm:top-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/40 px-3 py-1.5 backdrop-blur-md">
              <Route className="h-3.5 w-3.5 text-sky-300" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-sky-200">
                Route map
              </span>
            </div>

            <h3 className="mt-2 text-base font-semibold text-white drop-shadow-lg sm:text-lg">
              {fromCity}
              <span className="mx-2 text-sky-300">→</span>
              {toCity}
            </h3>
          </div>

          <div className="rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-300 backdrop-blur-md">
            {corridor.length} route points
          </div>
        </div>

        {/* Main route SVG */}
        <svg
          aria-label={`Route from ${fromCity} to ${toCity}`}
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Wide glow */}
          <path
            d={routePath}
            fill="none"
            stroke="rgba(14,165,233,0.16)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary blue glow */}
          <path
            d={routePath}
            fill="none"
            stroke="rgba(59,130,246,0.30)"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Main route */}
          <path
            d={routePath}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Moving route highlight */}
          <path
            d={routePath}
            fill="none"
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.22"
            strokeLinecap="round"
            strokeDasharray="1.8 3"
            opacity="0.7"
          />

          <defs>
            <linearGradient
              id="routeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="45%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Route points */}
        {mapPoints.map((point) => {
          const labelPosition =
            point.isOrigin || point.isDestination
              ? "bottom"
              : point.order % 2 === 0
                ? "top"
                : "bottom";

          return (
            <div
              key={`${point.city}-${point.order}`}
              className="absolute z-10"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
            >
              {/* Charging point glow */}
              {point.isChargingStop ? (
                <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-xl" />
              ) : null}

              {/* Pin */}
              <div
                className={[
                  "relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-xl",
                  point.isOrigin || point.isDestination
                    ? "h-8 w-8 border-white/70 bg-white text-slate-950"
                    : "h-7 w-7 border-emerald-200/50 bg-emerald-500/90 text-white",
                ].join(" ")}
              >
                {point.isChargingStop ? (
                  <Zap className="h-3.5 w-3.5" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </div>

              {/* Outer ring for start/end */}
              {point.isOrigin || point.isDestination ? (
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border border-sky-300/40" />
              ) : null}

              {/* City label */}
              <div
                className={[
                  "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
                  labelPosition === "top"
                    ? "bottom-7"
                    : "top-7",
                ].join(" ")}
              >
                <div className="rounded-md border border-white/10 bg-slate-950/75 px-2.5 py-1 shadow-lg backdrop-blur-md">
                  <p
                    className={[
                      "text-[9px] font-semibold uppercase tracking-[0.16em]",
                      point.isOrigin || point.isDestination
                        ? "text-white"
                        : "text-emerald-100",
                    ].join(" ")}
                  >
                    {point.city}
                  </p>
                </div>

                {!point.isOrigin && !point.isDestination ? (
                  <p className="mt-1 text-center text-[8px] text-slate-400">
                    {point.label}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Origin badge */}
        <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />

            <div>
              <p className="text-[8px] uppercase tracking-[0.18em] text-slate-500">
                Start
              </p>
              <p className="text-xs font-semibold text-white">
                {fromCity}
              </p>
            </div>
          </div>
        </div>

        {/* Destination badge */}
        <div className="absolute bottom-4 right-4 z-20 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.9)]" />

            <div>
              <p className="text-[8px] uppercase tracking-[0.18em] text-slate-500">
                Destination
              </p>
              <p className="text-xs font-semibold text-white">
                {toCity}
              </p>
            </div>
          </div>
        </div>

        {/* Fast charging legend */}
        <div className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 sm:block">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 backdrop-blur-md">
            <span className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-emerald-200">
              <BatteryCharging className="h-3.5 w-3.5" />
              Charging stop
            </span>

            <span className="h-3 w-px bg-white/10" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              Corridor route
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}