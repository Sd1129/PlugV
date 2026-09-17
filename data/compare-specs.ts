import { getVehicleTripProfile } from "./vehicle-trip-profiles";
import { getVehicleChargingFact } from "./vehicle-charging-facts";

// A charger used in a timed test is not evidence of the vehicle's peak DC acceptance.
const eVitaraBrochure = "https://marutisuzuki.scene7.com/is/content/maruti/NEXA-eVITARA-Brochure-2026pdf";
export function getCompareCharging(slug: string) {
  const profile = getVehicleTripProfile(slug);
  const variant = profile?.confidence === "official" ? profile.variants.find(v => v.name === profile.defaultVariant) : undefined;
  const fact = getVehicleChargingFact(slug);
  if (slug === "hyundai-creta-electric") return {
    dcPower: "Peak vehicle input not confirmed; test uses a >100 kW / 400 V charger",
    acPower: "7.4 kW AC charging-time basis", connector: "CCS2",
    dcTime: "10–80% in 39 min with a >100 kW / 400 V charger",
    acTime: fact?.acTime ?? "Charging time not confirmed",
    scope: "India specification: 42 / 51.4 kWh; timed-test charger power is not the vehicle’s peak input.",
    sourceUrl: "https://www.hyundai.com/in/en/find-a-car/creta-electric/specification", checkedAt: "2026-09-17",
  };
  if (slug === "tata-punch-ev") return {
    dcPower: "Up to 65 kW (2026 facelift)", acPower: "3.3 kW standard / 7.2 kW optional charging",
    connector: variant?.connector ?? "Connector not confirmed",
    dcTime: "20–80% in 26 min (manufacturer’s 2026 facelift claim)",
    acTime: "Full-charge time not confirmed for the selected trim",
    scope: "2026 facelift charging claim; confirm battery/trim. Connector comes from the existing 40 kWh profile.",
    sourceUrl: "https://ev.tata.cars/blogs/new-punch-ev-facelift.html", checkedAt: "2026-09-17",
    acSourceUrl: profile?.sourceUrl, acCheckedAt: profile?.verifiedAt,
  };
  if (slug === "maruti-suzuki-e-vitara") return {
    dcPower: "Peak vehicle input not confirmed; timed test uses a 70 kW+ charger",
    acPower: "7.4 kW wallbox listed", connector: "Type 2 (AC) / CCS2 (DC)",
    dcTime: "61 kWh: 10–80% in approximately 45 min, with a 70 kW+ charger",
    acTime: "Full-charge time not confirmed", scope: "2026 India brochure; charging time applies to the 61 kWh battery",
    sourceUrl: eVitaraBrochure, checkedAt: "2026-09-17",
  };
  return {
    dcPower: slug === "mg-comet-ev" ? "DC fast charging not supported" : variant ? `${variant.maxDcChargeKW} kW` : "Vehicle peak not confirmed",
    acPower: variant?.maxAcChargeKW ? `${variant.maxAcChargeKW} kW` : "Vehicle AC limit not confirmed; see charging-time details",
    connector: variant?.connector ?? "Connector not confirmed",
    dcTime: variant ? `${variant.fastChargeFromPercent}–${variant.fastChargeToPercent}% in ${variant.fastChargeMinutes} min` : fact?.dcTime ?? "Charging time not confirmed",
    acTime: fact?.acTime ?? (variant?.maxAcChargeKW ? `Calculated ≈${(variant.batteryCapacityKWh / variant.maxAcChargeKW / 0.9).toFixed(1)} hr, 0–100%, assuming 90% charging efficiency` : "Charging time not confirmed"),
    scope: variant ? `Charging profile: ${variant.name}. Does not represent every listed trim.` : "Model-level manufacturer information; confirm your selected trim.",
    sourceUrl: variant ? profile?.sourceUrl : fact?.sourceUrl,
    checkedAt: variant ? profile?.verifiedAt : fact?.verifiedAt,
    acSourceUrl: fact?.sourceUrl,
    acCheckedAt: fact?.verifiedAt,
  };
}
