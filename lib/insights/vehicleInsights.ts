import { getVehicleChargingFact } from "@/data/vehicle-charging-facts";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { vehicles } from "@/data/vehicles";
import { startingPriceRupees } from "@/data/vehicle-buying-specs";

type Vehicle = (typeof vehicles)[number];

function numbers(value?: string) {
  return [...(value ?? "").replace(/,/g, "").matchAll(/\d+(?:\.\d+)?/g)].map(([match]) => Number(match));
}

function clamp(value: number, minimum = 0, maximum = 100) {
  return Math.max(minimum, Math.min(maximum, value));
}

function normalize(value: number, low: number, high: number) {
  return clamp(((value - low) / (high - low)) * 100);
}

function practicalityScore(vehicle: Vehicle) {
  const type = vehicle.type.toLowerCase();
  if (type.includes("mpv")) return 92;
  if (type.includes("suv")) return 84;
  if (type.includes("crossover")) return 80;
  if (type.includes("hatchback")) return 78;
  if (type.includes("sedan")) return 72;
  if (type.includes("microcar")) return 68;
  if (type.includes("roadster")) return 42;
  return 65;
}

function metrics(vehicle: Vehicle) {
  const range = Math.max(0, ...numbers(vehicle.range).filter((value) => value >= 100));
  const priceLakh = startingPriceRupees(vehicle.price) / 100_000;
  const profile = getVehicleTripProfile(vehicle.slug);
  const chargingFact = getVehicleChargingFact(vehicle.slug);
  const dcPower = profile ? Math.max(...profile.variants.map((variant) => variant.maxDcChargeKW)) : 0;
  const chargeMinutes = chargingFact
    ? numbers(chargingFact.dcTime).filter((value) => value >= 10 && value <= 90).at(-1) ?? 0
    : 0;
  const rangeScore = range ? 30 + normalize(range, 180, 700) * 0.7 : 0;
  const valueRatio = range && priceLakh ? range / priceLakh : 0;
  const valueScore = valueRatio ? 25 + normalize(valueRatio, 8, 42) * 0.75 : 0;
  const chargingScore = dcPower
    ? 30 + normalize(dcPower, 30, 350) * 0.7
    : chargeMinutes
      ? 30 + normalize(70 - chargeMinutes, 10, 52) * 0.7
      : 0;

  return {
    range,
    priceLakh,
    dcPower,
    rangeScore: Math.round(rangeScore),
    valueScore: Math.round(valueScore),
    chargingScore: Math.round(chargingScore),
    practicalityScore: practicalityScore(vehicle),
    profile,
    chargingFact,
  };
}

function weightedScore(vehicle: Vehicle) {
  const data = metrics(vehicle);
  const inputs = [
    { score: data.rangeScore, weight: 35 },
    { score: data.valueScore, weight: 30 },
    { score: data.chargingScore, weight: 20 },
    { score: data.practicalityScore, weight: 15 },
  ].filter((input) => input.score > 0);
  const weight = inputs.reduce((total, input) => total + input.weight, 0);
  return Math.round(inputs.reduce((total, input) => total + input.score * input.weight, 0) / weight);
}

function dataConfidence(vehicle: Vehicle) {
  const data = metrics(vehicle);
  let score = 10;
  if (data.range) score += 25;
  if (data.priceLakh) score += 20;
  if (data.profile) score += data.profile.confidence === "official" ? 25 : 15;
  if (data.chargingFact) score += data.chargingFact.confidence === "official" ? 20 : 12;
  return clamp(score);
}

function valueLabel(score: number) {
  if (!score) return "Not verified";
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Good";
  return "Limited";
}

function verdictFor(vehicle: Vehicle) {
  const data = metrics(vehicle);
  const lead = [
    { key: "range", score: data.rangeScore },
    { key: "value", score: data.valueScore },
    { key: "charging", score: data.chargingScore },
    { key: "practicality", score: data.practicalityScore },
  ].sort((left, right) => right.score - left.score)[0]?.key;

  if (lead === "range") return `${vehicle.name} is strongest on claimed range, with up to ${data.range} km listed; confirm the chosen variant and test conditions.`;
  if (lead === "value") return `${vehicle.name} presents a strong range-to-entry-price case; compare variant equipment, battery terms and on-road pricing before deciding.`;
  if (lead === "charging" && data.dcPower) return `${vehicle.name} stands out for DC charging capability of up to ${data.dcPower} kW; actual speed depends on the charger and battery conditions.`;
  return `${vehicle.name} is oriented toward ${vehicle.type.toLowerCase()} practicality; compare its verified range, charging and variant details with your daily needs.`;
}

export function getVehicleInsights(vehicle: Vehicle) {
  const data = metrics(vehicle);
  const score = weightedScore(vehicle);
  const confidence = dataConfidence(vehicle);
  const familyScore = /mpv|suv|crossover/i.test(vehicle.type) ? 78 : /sedan|hatchback/i.test(vehicle.type) ? 64 : 40;
  const cityScore = /microcar|hatchback|sedan/i.test(vehicle.type) ? 82 : 68;
  const highwayScore = Math.round(data.rangeScore * 0.65 + data.chargingScore * 0.35);
  const bestFor = [
    cityScore >= 75 ? "City driving" : null,
    familyScore >= 70 ? "Family use" : null,
    highwayScore >= 68 ? "Highway trips" : null,
    data.valueScore >= 68 ? "Value buyers" : null,
  ].filter(Boolean) as string[];

  return {
    score,
    confidence,
    bestFor,
    verdict: verdictFor(vehicle),
    ownership: [
      { label: "Range value", value: valueLabel(data.valueScore) },
      { label: "Charging evidence", value: valueLabel(data.chargingScore) },
      { label: "Practicality", value: valueLabel(data.practicalityScore) },
      { label: "Road trips", value: valueLabel(highwayScore) },
      { label: "Family use", value: valueLabel(familyScore) },
      { label: "Daily commute", value: valueLabel(cityScore) },
    ],
    buyNow: score >= 70 && confidence >= 60,
    considerAlternatives: score < 75 || confidence < 70,
  };
}
