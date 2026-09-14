import type { ChargingStation } from "../../data/charging/types";

// Publication policy, not a physical limit: outliers need manual source review.
export function stationDataIssues(station: ChargingStation): string[] {
  const issues: string[] = [];
  if (!station.operator?.trim() || /^(operator not listed|unknown|n\/a)$/i.test(station.operator.trim())) issues.push("operator missing");
  if (!Object.values(station.connectors).some(Boolean)) issues.push("connector not identified");
  const power = station.charging.maxPowerKW;
  if (!Number.isFinite(power) || power <= 0 || power > 1000) issues.push("power requires review");
  if (!Number.isFinite(station.latitude) || Math.abs(station.latitude) > 90 || !Number.isFinite(station.longitude) || Math.abs(station.longitude) > 180) issues.push("invalid coordinates");
  return issues;
}

export function publishableStations(stations: ChargingStation[]) {
  // Keep source records intact; exclude incomplete/outlier records from discovery.
  return stations.filter((station) => stationDataIssues(station).length === 0);
}
