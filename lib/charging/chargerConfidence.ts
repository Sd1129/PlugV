import type { ChargingStation } from "@/data/charging/stations";

export type ConfidenceFactor = { label: string; points: number; maximum: number; detail: string };
export type ChargerConfidence = { score: number; label: "High" | "Moderate" | "Limited"; factors: ConfidenceFactor[] };

function timestampAgeHours(value?: string) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? Math.max(0, (Date.now() - time) / 3_600_000) : null;
}

export function getChargerConfidence(station: ChargingStation, context: { compatible?: boolean; backupAvailable?: boolean } = {}): ChargerConfidence {
  const isOfficial = station.trust?.sourceType === "OFFICIAL";
  const ageHours = timestampAgeHours(station.availability?.lastUpdated ?? station.trust?.lastCheckedAt ?? station.charging.lastChecked);
  const freshness = ageHours === null ? 0 : ageHours <= 1 ? 25 : ageHours <= 24 ? 20 : ageHours <= 168 ? 12 : 5;
  const availability = station.availability?.status === "available" ? 15 : station.availability?.status === "limited" ? 10 : station.availability?.status === "busy" ? 6 : 0;
  const factors: ConfidenceFactor[] = [
    { label: "Data source", points: isOfficial ? 25 : station.trust?.sourceName ? 14 : 6, maximum: 25, detail: isOfficial ? "Official source" : station.trust?.sourceName ?? "Source not identified" },
    { label: "Freshness", points: freshness, maximum: 25, detail: ageHours === null ? "No verification timestamp" : ageHours <= 24 ? "Checked within 24 hours" : `Checked about ${Math.round(ageHours / 24)} days ago` },
    { label: "Current status", points: availability, maximum: 15, detail: station.availability?.status ? `Reported ${station.availability.status}` : "No live status" },
    { label: "Station verification", points: station.trust?.verified ? 15 : 4, maximum: 15, detail: station.trust?.verified ? "Station details verified" : "Verification pending" },
    { label: "Access information", points: station.openingHours ? 5 : 0, maximum: 5, detail: station.openingHours ?? "Opening hours unavailable" },
    { label: "Vehicle compatibility", points: context.compatible === false ? 0 : 5, maximum: 5, detail: context.compatible === false ? "Not compatible with selected EV" : context.compatible ? "Compatible with selected EV" : "Check connector compatibility" },
    { label: "Nearby backup", points: context.backupAvailable ? 5 : 0, maximum: 5, detail: context.backupAvailable ? "Backup identified nearby" : "No backup confirmed" },
    { label: "Community reliability", points: 0, maximum: 5, detail: "Recent owner check-in history is not available yet" },
  ];
  const score = factors.reduce((total, factor) => total + factor.points, 0);
  return { score, label: score >= 75 ? "High" : score >= 50 ? "Moderate" : "Limited", factors };
}
