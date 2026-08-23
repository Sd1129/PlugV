export type VehicleChargingFact = {
  dcTime: string;
  acTime: string;
  sourceUrl: string;
  sourceName: string;
  verifiedAt: string;
  confidence: "official" | "partial";
};

export const vehicleChargingFacts: Record<string, VehicleChargingFact> = {
  "maruti-suzuki-e-vitara": {
    dcTime: "10–80% in approximately 45 min with a 70 kW+ DC charger",
    acTime: "7.4 kW AC wallbox; manufacturer does not state a fixed full-charge time",
    sourceUrl: "https://www.marutisuzuki.com/e-vitara",
    sourceName: "Maruti Suzuki",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
  "mg-windsor-ev": {
    dcTime: "0–80% in approximately 55 min (38 kWh); Pro charging varies by charger",
    acTime: "Approximately 6.5 hr (38 kWh) or 9.5 hr (52.9 kWh) with 7.4 kW AC",
    sourceUrl: "https://www.mgmotor.co.in/vehicles/windsor-ev-electric-car-in-india/specifications",
    sourceName: "JSW MG Motor India",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "tata-sierra-ev": {
    dcTime: "20–80% in approximately 25 min with a compatible fast charger",
    acTime: "7.2 kW and 11 kW AC charging supported; time varies by battery",
    sourceUrl: "https://ev.tatamotors.com/sierra/ev.html",
    sourceName: "Tata.ev",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
  "mg-comet-ev": {
    dcTime: "DC fast charging is not supported",
    acTime: "Approximately 7 hr with 3.3 kW AC; selected Fast Charge variants support 7.4 kW AC",
    sourceUrl: "https://www.mgmotor.co.in/vehicles/comet-ev-electric-car-in-india",
    sourceName: "JSW MG Motor India",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "tata-harrier-ev": {
    dcTime: "20–80% in approximately 25 min with a 120 kW DC charger",
    acTime: "7.2 kW AC charging supported; time varies by battery pack",
    sourceUrl: "https://ev.tatamotors.com/harrier/ev.html",
    sourceName: "Tata.ev",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
  "mg-cyberster": {
    dcTime: "10–80% in approximately 38 min with a compatible DC charger",
    acTime: "11 kW AC charging supported; full-charge time depends on supply",
    sourceUrl: "https://www.mgmotor.co.in/vehicles/mg-cyberster",
    sourceName: "JSW MG Motor India",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
  "tata-curvv-ev": {
    dcTime: "10–80% in approximately 40 min with a compatible DC charger",
    acTime: "7.2 kW AC charging supported; time varies between 45 kWh and 55 kWh packs",
    sourceUrl: "https://ev.tatamotors.com/curvv/ev.html",
    sourceName: "Tata.ev",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "vayve-mobility-eva": {
    dcTime: "DC fast-charging time is not published by the manufacturer",
    acTime: "Home charging supported; charging time varies by 9, 12.6 and 18 kWh battery option",
    sourceUrl: "https://vayve.com/eva",
    sourceName: "Vayve Mobility",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
  "byd-atto-3": {
    dcTime: "30–80% in approximately 29 min with a compatible DC charger",
    acTime: "7 kW AC charging supported; full-charge time varies by battery",
    sourceUrl: "https://bydautoindia.com/byd-atto3",
    sourceName: "BYD India",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "vinfast-vf7": {
    dcTime: "10–70% in 24 min (59.6 kWh) or 28 min (70.8 kWh)",
    acTime: "Up to 7.2 kW AC charging",
    sourceUrl: "https://vinfastauto.in/en/vf7",
    sourceName: "VinFast India",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "mg-zs-ev": {
    dcTime: "0–80% in approximately 60 min with a 50 kW DC charger",
    acTime: "Approximately 8.5–9 hr with a 7.4 kW AC charger",
    sourceUrl: "https://www.mgmotor.co.in/vehicles/mgzsev-electric-car-in-india",
    sourceName: "JSW MG Motor India",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "byd-sealion-7": {
    dcTime: "10–80% in approximately 24–32 min, depending on variant and charger",
    acTime: "11 kW AC charging supported",
    sourceUrl: "https://bydautoindia.com/byd-sealion7",
    sourceName: "BYD India",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
  "byd-seal": {
    dcTime: "10–80% in approximately 37 min with a compatible DC charger",
    acTime: "7 kW or 11 kW AC charging, depending on variant",
    sourceUrl: "https://bydautoindia.com/byd-seal",
    sourceName: "BYD India",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "mg-m9": {
    dcTime: "30–80% in approximately 30 min with a compatible DC charger",
    acTime: "11 kW AC charging supported; full-charge time depends on supply",
    sourceUrl: "https://www.mgmotor.co.in/vehicles/m9",
    sourceName: "JSW MG Motor India",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
  "mahindra-xuv400-ev": {
    dcTime: "0–80% in approximately 50 min with a 50 kW DC charger",
    acTime: "Approximately 6.5 hr with a 7.2 kW AC charger for the 39.4 kWh battery",
    sourceUrl: "https://auto.mahindra.com/suv/xuv400",
    sourceName: "Mahindra Auto",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "tesla-model-y": {
    dcTime: "Up to 238–288 km of range added in 15 min, depending on variant",
    acTime: "Up to 11 kW AC; Tesla does not publish a fixed India full-charge time",
    sourceUrl: "https://www.tesla.com/en_in/modely",
    sourceName: "Tesla India",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "vinfast-vf-mpv-7": {
    dcTime: "10–70% in 30 min; up to 80 kW DC",
    acTime: "AC charging supported; manufacturer does not state a fixed time on the India specification page",
    sourceUrl: "https://vinfastauto.in/en/mpv7",
    sourceName: "VinFast India",
    verifiedAt: "2026-08-23",
    confidence: "partial",
  },
};

export function getVehicleChargingFact(vehicleSlug: string) {
  return vehicleChargingFacts[vehicleSlug];
}

