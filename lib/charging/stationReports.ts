export const reportOutcomes = ["Successful charge", "Charger failed", "Access blocked", "Location incorrect", "Station details incorrect"] as const;
export const reportConnectors = ["CCS2", "Type 2", "CHAdeMO", "GB/T", "Bharat AC", "Bharat DC", "Unknown / not applicable"] as const;
export type StationObservation = { stationId: string; visitedAt: string; outcome: string; connector: string; notes: string; consent: true };
export function validateStationReport(input: unknown): StationObservation {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw Error("Enter a report.");
  const x = input as Record<string, unknown>;
  if (typeof x.stationId !== "string" || !/^[a-zA-Z0-9_-]{1,150}$/.test(x.stationId)) throw Error("Invalid station.");
  if (!reportOutcomes.includes(x.outcome as typeof reportOutcomes[number])) throw Error("Select an outcome.");
  if (!reportConnectors.includes(x.connector as typeof reportConnectors[number])) throw Error("Select a connector.");
  if (x.outcome === "Successful charge" && x.connector === "Unknown / not applicable") throw Error("Identify the connector used for a successful charge.");
  const visited = typeof x.visitedAt === "string" ? Date.parse(x.visitedAt) : NaN;
  if (!Number.isFinite(visited) || !/Z$|[+-]\d\d:\d\d$/.test(String(x.visitedAt)) || visited > Date.now() || Date.now() - visited > 30 * 86400000) throw Error("Use a visit time within the last 30 days, not in the future.");
  const notes = typeof x.notes === "string" ? x.notes.trim() : "";
  if (notes.length < 20 || notes.length > 1000) throw Error("Enter 20–1000 characters describing your own observation.");
  if (x.consent !== true) throw Error("Consent is required.");
  return { stationId: x.stationId, visitedAt: new Date(visited).toISOString(), outcome: String(x.outcome), connector: String(x.connector), notes, consent: true };
}
export function publicObservation(row: { id: string; status: string; reviewedAt: Date | null; payload: unknown }) {
  if (row.status !== "APPROVED" || !row.reviewedAt) return null;
  const x = row.payload as StationObservation;
  if (!x || !reportOutcomes.includes(x.outcome as typeof reportOutcomes[number]) || !reportConnectors.includes(x.connector as typeof reportConnectors[number]) || !Number.isFinite(Date.parse(x.visitedAt)) || Date.parse(x.visitedAt) > Date.now() || Date.now() - Date.parse(x.visitedAt) > 90 * 86400000) return null;
  return { id: row.id, outcome: x.outcome, connector: x.connector, visitedAt: x.visitedAt, reviewedAt: row.reviewedAt.toISOString() };
}
