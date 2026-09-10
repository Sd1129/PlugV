import type { ChargingStation } from "@/data/charging/stations";

export default function StationDataNote({ station }: { station: ChargingStation }) {
  const checked = station.trust?.lastCheckedAt ?? station.charging.lastChecked;
  return <div className="mt-3 text-sm leading-6 text-slate-400">
    <p>Source: {station.trust?.sourceName ?? "Source not recorded"}</p>
    <p>{station.trust?.verified ? "Station details marked verified" : "Station details awaiting verification"} · Recorded check: {checked ?? "Not recorded"}</p>
    <p>Live availability is not confirmed. Check access and working status with the operator. Planning or saving this station does not reserve or hold a connector.</p>
  </div>;
}
