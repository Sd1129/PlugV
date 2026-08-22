import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";

const THREE_SEATERS = new Set(["vayve-mobility-eva"]);
const TWO_SEATERS = new Set(["mg-cyberster"]);
const SIX_SEATERS = new Set(["mg-m9"]);
const SEVEN_SEATERS = new Set(["kia-carens-clavis-ev", "vinfast-vf-mpv-7"]);

export function getSeatingCapacity(slug: string) {
  if (TWO_SEATERS.has(slug)) return 2;
  if (THREE_SEATERS.has(slug)) return 3;
  if (SIX_SEATERS.has(slug)) return 6;
  if (SEVEN_SEATERS.has(slug)) return 7;
  return 5;
}

export function getBuyingSpecs(slug: string) {
  const profile = getVehicleTripProfile(slug);
  const variants = profile?.variants ?? [];
  const dcTimes = [...new Set(variants.map((variant) => `${variant.fastChargeFromPercent}–${variant.fastChargeToPercent}% in ${variant.fastChargeMinutes} min`))];
  const acTimes = [...new Set(variants.filter((variant) => variant.maxAcChargeKW).map((variant) => {
    const hours = variant.batteryCapacityKWh / (variant.maxAcChargeKW ?? 1) / 0.9;
    return `≈${hours.toFixed(1)} hr at ${variant.maxAcChargeKW} kW`;
  }))];

  return {
    seats: getSeatingCapacity(slug),
    dcTime: dcTimes.join(" / ") || "Awaiting official specification",
    acTime: acTimes.join(" / ") || "Awaiting official specification",
    variants: variants.map((variant) => variant.name),
    sourceUrl: profile?.sourceUrl,
    sourceName: profile?.sourceName,
    verifiedAt: profile?.verifiedAt,
  };
}

export function startingPriceRupees(price?: string) {
  if (!price) return 0;
  const amount = Number(price.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
  return /cr/i.test(price) ? amount * 10_000_000 : amount * 100_000;
}
