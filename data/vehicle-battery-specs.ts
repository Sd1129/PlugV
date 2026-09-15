import { getVehicleTripProfile } from "./vehicle-trip-profiles";

type BatterySpec = { value: string; sourceUrl: string; checkedAt: string; scope: string };
const reviewed = (value: string, sourceUrl: string, scope = "Manufacturer-published model battery options; confirm the selected trim."): BatterySpec => ({ value, sourceUrl, checkedAt: "2026-09-15", scope });

// Battery evidence is independent of the completeness of a trip-planning profile.
// Preserve usable/nominal labels; do not calculate capacity from range or power.
export const batterySpecifications: Record<string, BatterySpec> = {
  "hyundai-creta-electric": reviewed("42 / 51.4 kWh", "https://www.hyundai.com/in/en/find-a-car/creta-electric/highlights"),
  "hyundai-ioniq-5": reviewed("84 kWh", "https://www.hyundai.com/in/en/find-a-car/ioniq-5/specification"),
  "mg-comet-ev": reviewed("17.4 kWh", "https://www.mgmotor.co.in/vehicles/comet-ev-electric-car-in-india"),
  "mg-zs-ev": reviewed("50.3 kWh", "https://www.mgmotor.co.in/vehicles/mgzsev-electric-car-in-india"),
  "mg-windsor-ev": reviewed("38 / 52.9 kWh", "https://www.mgmotor.co.in/vehicles/windsor-ev-electric-car-in-india/specifications"),
  "mg-cyberster": reviewed("77 kWh", "https://www.mgmotor.co.in/media-center/newsroom/jsw-mg-motor-india-launches-the-cyberster-at-an-introductory-price-of-inr-72-49-lakh-for-pre-reserved-bookings", "Manufacturer India launch specification; confirm current trim."),
  "mg-m9": reviewed("90 kWh", "https://www.mgmotor.co.in/content/dam/brand/mgmotor/press-release/documents/mgi-pr-pdf-0046.pdf"),
  "mg-hector-tomahawk-ev": reviewed("69.2 kWh", "https://www.mgmotor.co.in/vehicles/hector-tomahawk/ev"),
  "tata-tigor-ev": reviewed("26 kWh", "https://www.tatamotors.com/press-releases/tigor-ev-now-with-more-tech-and-more-lux-features/", "Manufacturer India specification; current trim availability requires confirmation."),
  "tata-curvv-ev": reviewed("45 / 55 kWh", "https://ev.tata.cars/curvv/ev/specifications.html", "Manufacturer lists 45 and 55 kWh; current SeriesX trim availability must be checked separately."),
  "tata-harrier-ev": reviewed("65 / 75 kWh", "https://www.tatamotors.com/press-releases/delete-impossible-harrier-ev-unleashes-a-bold-new-league-of-suvs/"),
  "tata-sierra-ev": reviewed("63 / 75 kWh", "https://ev.tata.cars/support.html"),
  "byd-atto-3": reviewed("49.92 / 60.48 kWh", "https://bydautoindia.com/bydatto3"),
  "vinfast-vf7": reviewed("59.6 / 70 kWh usable", "https://vinfastauto.in/en/vf7"),
  "vinfast-vf-mpv-7": reviewed("60.13 kWh", "https://vinfastauto.in/en/mpv7"),
  "mahindra-xev-9s": reviewed("59 / 70 / 79 kWh", "https://www.mahindra.com/annual-report-FY2026/171/"),
  "mahindra-xuv-3xo-ev": reviewed("39.4 kWh", "https://www.mahindra.com/annual-report-FY2026/154/"),
  "mahindra-xuv400-ev": reviewed("34.5 / 39.4 kWh", "https://www.mahindra.com/news-room/press-release/en/mahindra-launches-its-first-csegment-electric-suv-the-fun-and-fast-xuv400-starting-at-inr-15-99-lakh", "Published India launch battery options; current stock and trim availability are not established."),
  "volvo-ec40": reviewed("82 kWh nominal", "https://www.volvocars.com/in/cars/ec40-electric/specifications/"),
  "kia-ev9": reviewed("99.8 kWh", "https://www.kia.com/in/our-vehicles/ev9/specs.html"),
  "bmw-ix1-lwb": reviewed("66.4 kWh", "https://www.bmw.in/en/all-models/bmw-i/iX1/2025/bmw-ix1-highlights.html"),
  "bmw-i5-m60": reviewed("81.2 kWh usable", "https://www.press.bmwgroup.com/india/article/attachment/T0441441EN/614860"),
};

export function getBatterySpecification(slug: string): BatterySpec | undefined {
  if (batterySpecifications[slug]) return batterySpecifications[slug];
  const profile = getVehicleTripProfile(slug);
  if (!profile || profile.confidence !== "official") return undefined;
  const capacities = [...new Set(profile.variants.map(v => v.batteryCapacityKWh))].sort((a, b) => a - b);
  if (!capacities.length) return undefined;
  return { value: `${capacities.join(" / ")} kWh`, sourceUrl: profile.sourceUrl, checkedAt: profile.verifiedAt, scope: "Battery options recorded in PlugV’s sourced profiles; this may not cover every current trim." };
}
