export type VehicleTripVariant = {
  name: string;
  batteryCapacityKWh: number;
  certifiedRangeKm: number;
  practicalRangeKm: number;
  maxDcChargeKW: number;
  maxAcChargeKW?: number;
  connector: "CCS2";
  fastChargeFromPercent: number;
  fastChargeToPercent: number;
  fastChargeMinutes: number;
};

export type VehicleTripProfile = {
  vehicleSlug: string;
  defaultVariant: string;
  variants: VehicleTripVariant[];
  sourceUrl: string;
  sourceName: string;
  verifiedAt: string;
  confidence: "official" | "estimated";
};

export const vehicleTripProfiles: Record<string, VehicleTripProfile> = {
  "tata-tiago-ev": {
    vehicleSlug: "tata-tiago-ev",
    defaultVariant: "Creative Plus 24 (Long Range)",
    variants: [
      { name: "Creative Plus 24 (Long Range)", batteryCapacityKWh: 24, certifiedRangeKm: 285, practicalRangeKm: 210, maxDcChargeKW: 30, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 58 },
      { name: "Pure Plus 24 (Long Range)", batteryCapacityKWh: 24, certifiedRangeKm: 285, practicalRangeKm: 210, maxDcChargeKW: 30, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 58 },
      { name: "Pure Plus 19 (Medium Range)", batteryCapacityKWh: 19.2, certifiedRangeKm: 223, practicalRangeKm: 165, maxDcChargeKW: 30, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 58 },
      { name: "Smart 19 (Medium Range)", batteryCapacityKWh: 19.2, certifiedRangeKm: 223, practicalRangeKm: 165, maxDcChargeKW: 30, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 58 },
    ],
    sourceUrl: "https://ev.tatamotors.com/tiago/ev/next-gen/faqs.html",
    sourceName: "Tata.ev",
    verifiedAt: "2026-08-23",
    confidence: "official",
  },
  "hyundai-creta-electric": {
    vehicleSlug: "hyundai-creta-electric",
    defaultVariant: "Long Range 51.4 kWh",
    variants: [
      { name: "42 kWh", batteryCapacityKWh: 42, certifiedRangeKm: 420, practicalRangeKm: 336, maxDcChargeKW: 100, maxAcChargeKW: 7.4, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
      { name: "Long Range 51.4 kWh", batteryCapacityKWh: 51.4, certifiedRangeKm: 510, practicalRangeKm: 408, maxDcChargeKW: 100, maxAcChargeKW: 7.4, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
    ],
    sourceUrl: "https://www.hyundai.com/in/en/find-a-car/creta-electric/specification",
    sourceName: "Hyundai Motor India",
    verifiedAt: "2026-08-21",
    confidence: "official",
  },
  "tata-nexon-ev": {
    vehicleSlug: "tata-nexon-ev",
    defaultVariant: "45 kWh",
    variants: [
      { name: "45 kWh", batteryCapacityKWh: 45, certifiedRangeKm: 489, practicalRangeKm: 391, maxDcChargeKW: 60, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 40 },
    ],
    sourceUrl: "https://ev.tatamotors.com/nexon/ev/specifications.html",
    sourceName: "Tata.ev",
    verifiedAt: "2026-08-21",
    confidence: "official",
  },
  "tata-punch-ev": {
    vehicleSlug: "tata-punch-ev",
    defaultVariant: "40 kWh",
    variants: [
      { name: "40 kWh", batteryCapacityKWh: 40, certifiedRangeKm: 468, practicalRangeKm: 355, maxDcChargeKW: 60, connector: "CCS2", fastChargeFromPercent: 20, fastChargeToPercent: 80, fastChargeMinutes: 26 },
    ],
    sourceUrl: "https://ev.tatamotors.com/punch/ev/specifications.html",
    sourceName: "Tata.ev",
    verifiedAt: "2026-08-21",
    confidence: "official",
  },
  "mahindra-be-6": {
    vehicleSlug: "mahindra-be-6",
    defaultVariant: "79 kWh",
    variants: [
      { name: "59 kWh", batteryCapacityKWh: 59, certifiedRangeKm: 556, practicalRangeKm: 445, maxDcChargeKW: 140, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 20, fastChargeToPercent: 80, fastChargeMinutes: 20 },
      { name: "79 kWh", batteryCapacityKWh: 79, certifiedRangeKm: 682, practicalRangeKm: 546, maxDcChargeKW: 175, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 20, fastChargeToPercent: 80, fastChargeMinutes: 20 },
    ],
    sourceUrl: "https://www.mahindraelectricsuv.com/press-releases/be6-and-xev9e-launched.html",
    sourceName: "Mahindra Electric Origin SUVs",
    verifiedAt: "2026-08-21",
    confidence: "official",
  },
  "mahindra-xev-9e": {
    vehicleSlug: "mahindra-xev-9e",
    defaultVariant: "79 kWh",
    variants: [
      { name: "59 kWh", batteryCapacityKWh: 59, certifiedRangeKm: 542, practicalRangeKm: 434, maxDcChargeKW: 140, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 20, fastChargeToPercent: 80, fastChargeMinutes: 20 },
      { name: "79 kWh", batteryCapacityKWh: 79, certifiedRangeKm: 656, practicalRangeKm: 525, maxDcChargeKW: 175, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 20, fastChargeToPercent: 80, fastChargeMinutes: 20 },
    ],
    sourceUrl: "https://www.mahindraelectricsuv.com/press-releases/be6-and-xev9e-launched.html",
    sourceName: "Mahindra Electric Origin SUVs",
    verifiedAt: "2026-08-21",
    confidence: "official",
  },
  "kia-syros-ev": {
    vehicleSlug: "kia-syros-ev", defaultVariant: "HTX Long Range",
    variants: [
      { name: "HTK Plus Standard Range", batteryCapacityKWh: 42, certifiedRangeKm: 443, practicalRangeKm: 354, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
      { name: "HTX Standard Range", batteryCapacityKWh: 42, certifiedRangeKm: 443, practicalRangeKm: 354, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
      { name: "HTX Long Range", batteryCapacityKWh: 51.4, certifiedRangeKm: 526, practicalRangeKm: 421, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
      { name: "HTX Plus Long Range", batteryCapacityKWh: 51.4, certifiedRangeKm: 526, practicalRangeKm: 421, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
    ],
    sourceUrl: "https://www.kia.com/in/our-vehicles/syros-ev/showroom.html", sourceName: "Kia India", verifiedAt: "2026-08-23", confidence: "official",
  },
  "kia-carens-clavis-ev": {
    vehicleSlug: "kia-carens-clavis-ev", defaultVariant: "HTX Plus 51.4 kWh",
    variants: [
      { name: "HTK Plus 42 kWh", batteryCapacityKWh: 42, certifiedRangeKm: 404, practicalRangeKm: 323, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
      { name: "HTX 42 kWh", batteryCapacityKWh: 42, certifiedRangeKm: 404, practicalRangeKm: 323, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
      { name: "HTX 51.4 kWh", batteryCapacityKWh: 51.4, certifiedRangeKm: 490, practicalRangeKm: 392, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
      { name: "HTX Plus 51.4 kWh", batteryCapacityKWh: 51.4, certifiedRangeKm: 490, practicalRangeKm: 392, maxDcChargeKW: 100, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 39 },
    ],
    sourceUrl: "https://www.kia.com/content/dam/kia2/in/en/our-vehicles/kia-carens-clavis-ev/showroom/Carens_Clavis_EV_Brochure_Desktop.pdf", sourceName: "Kia India brochure", verifiedAt: "2026-08-23", confidence: "official",
  },
  "vinfast-vf6": {
    vehicleSlug: "vinfast-vf6", defaultVariant: "Wind",
    variants: [
      { name: "Earth", batteryCapacityKWh: 59.6, certifiedRangeKm: 468, practicalRangeKm: 374, maxDcChargeKW: 100, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 70, fastChargeMinutes: 25 },
      { name: "Wind", batteryCapacityKWh: 59.6, certifiedRangeKm: 463, practicalRangeKm: 370, maxDcChargeKW: 100, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 70, fastChargeMinutes: 25 },
      { name: "Wind Infinity", batteryCapacityKWh: 59.6, certifiedRangeKm: 463, practicalRangeKm: 370, maxDcChargeKW: 100, maxAcChargeKW: 7.2, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 70, fastChargeMinutes: 25 },
    ],
    sourceUrl: "https://vinfastauto.in/en/vf6", sourceName: "VinFast India", verifiedAt: "2026-08-23", confidence: "official",
  },
  "bmw-i7": {
    vehicleSlug: "bmw-i7", defaultVariant: "xDrive60 M Sport",
    variants: [
      { name: "eDrive50 M Sport", batteryCapacityKWh: 101.7, certifiedRangeKm: 603, practicalRangeKm: 482, maxDcChargeKW: 200, maxAcChargeKW: 22, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 34 },
      { name: "xDrive60 M Sport", batteryCapacityKWh: 101.7, certifiedRangeKm: 624, practicalRangeKm: 499, maxDcChargeKW: 200, maxAcChargeKW: 22, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 34 },
      { name: "M70 xDrive", batteryCapacityKWh: 101.7, certifiedRangeKm: 560, practicalRangeKm: 448, maxDcChargeKW: 200, maxAcChargeKW: 22, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 34 },
    ],
    sourceUrl: "https://www.bmw.in/en/all-models/bmw-i/i7/bmw-i7-sedan-technical-data.html", sourceName: "BMW India", verifiedAt: "2026-08-23", confidence: "official",
  },
  "kia-ev6": {
    vehicleSlug: "kia-ev6", defaultVariant: "GT Line AWD",
    variants: [{ name: "GT Line AWD", batteryCapacityKWh: 84, certifiedRangeKm: 663, practicalRangeKm: 530, maxDcChargeKW: 350, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 18 }],
    sourceUrl: "https://www.kia.com/in/our-vehicles/ev6/specs.html", sourceName: "Kia India", verifiedAt: "2026-08-23", confidence: "official",
  },
  "volvo-ex30": {
    vehicleSlug: "volvo-ex30", defaultVariant: "Ultra",
    variants: [{ name: "Ultra", batteryCapacityKWh: 69, certifiedRangeKm: 480, practicalRangeKm: 384, maxDcChargeKW: 175, maxAcChargeKW: 11, connector: "CCS2", fastChargeFromPercent: 10, fastChargeToPercent: 80, fastChargeMinutes: 28 }],
    sourceUrl: "https://www.volvocars.com/in/cars/ex30-electric/specifications/", sourceName: "Volvo Cars India", verifiedAt: "2026-08-23", confidence: "official",
  },
};

export function getVehicleTripProfile(vehicleSlug: string) {
  return vehicleTripProfiles[vehicleSlug];
}
