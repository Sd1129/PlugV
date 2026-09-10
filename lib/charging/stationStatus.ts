import type { ChargingStation } from "../../data/charging/types";

// PlugV policy: operator status expires after five minutes.
export function stationStatus(station: ChargingStation, now = Date.now()) {
  const record = station.availability;
  const timestamp = record?.lastUpdated;
  const time = timestamp && /T.*(Z|[+-]\d{2}:\d{2})$/.test(timestamp) ? Date.parse(timestamp) : NaN;
  const age = now - time;
  const recent = Number.isFinite(age) && age >= 0 && age <= 300_000;
  const live = Boolean(record?.liveFeedVerified && record.source && recent && record.status !== "unknown");
  const stale = Boolean(timestamp && (!recent));
  return {
    live,
    stale,
    status: live ? record!.status : "unknown",
    label: live ? `Operator reports ${record!.status === "busy" ? "occupied" : record!.status}` : stale ? "Status not recently verified" : "Live availability unknown",
    timestamp: timestamp ?? "Not recorded",
    source: record?.source ?? "Status source not recorded",
  };
}

export function operatorBookingUrl(station: ChargingStation) {
  const booking = station.reservation;
  if (!booking?.supported || !booking.verifiedBookingUrl || !booking.provider || !booking.lastChecked) return null;
  try {
    const url = new URL(booking.bookingUrl ?? "");
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
