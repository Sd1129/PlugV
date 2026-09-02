import { syncOpenChargeMapIndia, type ChargingSyncResult } from "@/lib/charging/openChargeMapSync";

const CRITICAL_PATHS = [
  { path: "/", marker: "EVERYTHING EV" },
  { path: "/vehicles", marker: "Electric Cars" },
  { path: "/compare", marker: "Compare" },
  { path: "/charging", marker: "Charging Stations" },
  { path: "/travel", marker: "Plan any EV trip" },
  { path: "/upcoming", marker: "Upcoming" },
  { path: "/my-ev", marker: "Everything you need to own your EV" },
  { path: "/knowledge", marker: "Knowledge" },
  { path: "/assistant", marker: "EV Assistant" },
  { path: "/about", marker: "PlugV" },
  { path: "/founder", marker: "Syed Manjoor Ahmed" },
  { path: "/privacy", marker: "Privacy" },
  { path: "/terms", marker: "Terms" },
  { path: "/disclaimer", marker: "Disclaimer" },
  { path: "/methodology", marker: "Methodology" },
  { path: "/sitemap.xml", marker: "<urlset" },
  { path: "/robots.txt", marker: "Sitemap:" },
] as const;

export type RouteHealth = {
  path: string;
  ok: boolean;
  status: number | null;
  durationMs: number;
  error?: string;
};

export type DailyOperationsResult = {
  startedAt: string;
  completedAt: string;
  charging: { ok: boolean; result?: ChargingSyncResult; error?: string };
  routes: RouteHealth[];
  failures: string[];
};

function publicOrigin() {
  return (process.env.APP_URL || "https://plugv.in").replace(/\/$/, "");
}

async function inspectRoute({ path, marker }: (typeof CRITICAL_PATHS)[number]): Promise<RouteHealth> {
  const started = performance.now();
  try {
    const response = await fetch(`${publicOrigin()}${path}`, {
      redirect: "follow",
      cache: "no-store",
      headers: { "user-agent": "PlugV-Daily-Operations/1.0 (+https://plugv.in)" },
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.text();
    const hasExpectedContent = body.toLowerCase().includes(marker.toLowerCase());
    return {
      path,
      ok: response.ok && hasExpectedContent,
      status: response.status,
      durationMs: Math.round(performance.now() - started),
      ...(!response.ok
        ? { error: `HTTP ${response.status}` }
        : !hasExpectedContent
          ? { error: `Expected content marker is missing: ${marker}` }
          : {}),
    };
  } catch (error) {
    return {
      path,
      ok: false,
      status: null,
      durationMs: Math.round(performance.now() - started),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function runDailyOperations(): Promise<DailyOperationsResult> {
  const startedAt = new Date().toISOString();
  const routesPromise = Promise.all(CRITICAL_PATHS.map(inspectRoute));
  const chargingPromise = syncOpenChargeMapIndia()
    .then((result) => ({ ok: true as const, result }))
    .catch((error) => ({
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    }));

  const [routes, charging] = await Promise.all([routesPromise, chargingPromise]);
  const failures = routes
    .filter((route) => !route.ok)
    .map((route) => `${route.path}: ${route.error ?? "unavailable"}`);
  if (!charging.ok) failures.push(`Charging station sync: ${charging.error}`);
  else if (charging.result.fetched < 100 || charging.result.upserted < 100) {
    failures.push(
      `Charging station sync returned an unexpectedly small dataset (${charging.result.fetched} fetched, ${charging.result.upserted} upserted)`,
    );
  }

  return {
    startedAt,
    completedAt: new Date().toISOString(),
    charging,
    routes,
    failures,
  };
}

export function operationsAlertText(result: DailyOperationsResult) {
  return [
    "PlugV daily operations alert",
    "",
    `Started: ${result.startedAt}`,
    `Completed: ${result.completedAt}`,
    "",
    "Failures:",
    ...result.failures.map((failure) => `- ${failure}`),
    "",
    "Public route checks:",
    ...result.routes.map(
      (route) => `- ${route.path}: ${route.ok ? "OK" : "FAILED"} (${route.status ?? "no response"}, ${route.durationMs} ms)`,
    ),
    "",
    "No catalogue facts were automatically published. Official EV discoveries remain behind PlugV's verification gate.",
  ].join("\n");
}
