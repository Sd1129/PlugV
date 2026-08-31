import { syncOpenChargeMapIndia, type ChargingSyncResult } from "@/lib/charging/openChargeMapSync";

const CRITICAL_PATHS = [
  "/",
  "/vehicles",
  "/compare",
  "/charging",
  "/travel",
  "/upcoming",
  "/my-ev",
  "/sitemap.xml",
  "/robots.txt",
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

async function inspectRoute(path: string): Promise<RouteHealth> {
  const started = performance.now();
  try {
    const response = await fetch(`${publicOrigin()}${path}`, {
      redirect: "follow",
      cache: "no-store",
      headers: { "user-agent": "PlugV-Daily-Operations/1.0 (+https://plugv.in)" },
      signal: AbortSignal.timeout(20_000),
    });
    return {
      path,
      ok: response.ok,
      status: response.status,
      durationMs: Math.round(performance.now() - started),
      ...(!response.ok ? { error: `HTTP ${response.status}` } : {}),
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
