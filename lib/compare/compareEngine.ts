import { vehicles } from "@/data/vehicles";

type Vehicle = (typeof vehicles)[number];

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function scoreRange(vehicle: Vehicle) {
  return parseNumeric(vehicle.range);
}

function scoreCharging(vehicle: Vehicle) {
  return parseNumeric(vehicle.charging);
}

function scoreValue(vehicle: Vehicle) {
  const price = parseNumeric(vehicle.price);
  const range = scoreRange(vehicle);
  if (!price) return 0;
  return Math.round((range / price) * 1000);
}

function scoreFamily(vehicle: Vehicle) {
  const type = (vehicle.type ?? "").toLowerCase();
  const brand = (vehicle.brand ?? "").toLowerCase();
  let score = 50;

  if (type.includes("suv")) score += 18;
  if (type.includes("crossover")) score += 14;
  if (type.includes("sedan")) score += 8;
  if (brand.includes("tata") || brand.includes("hyundai") || brand.includes("mahindra")) {
    score += 8;
  }

  return Math.min(score, 100);
}

function scoreCity(vehicle: Vehicle) {
  const range = scoreRange(vehicle);
  const charging = scoreCharging(vehicle);
  const type = (vehicle.type ?? "").toLowerCase();

  let score = 45;
  if (range > 350) score += 20;
  if (charging >= 100) score += 15;
  if (type.includes("hatchback") || type.includes("sedan")) score += 10;
  if (type.includes("suv")) score += 5;

  return Math.min(score, 100);
}

function scoreHighway(vehicle: Vehicle) {
  const range = scoreRange(vehicle);
  const charging = scoreCharging(vehicle);

  let score = 40;
  if (range > 400) score += 25;
  if (charging >= 150) score += 20;
  else if (charging >= 100) score += 12;

  return Math.min(score, 100);
}

function rankVehicles(
  list: Vehicle[],
  scorer: (vehicle: Vehicle) => number
) {
  return [...list]
    .map((vehicle) => ({
      vehicle,
      score: scorer(vehicle),
    }))
    .sort((a, b) => b.score - a.score);
}

export function getCompareInsights(input: Vehicle[]) {
  const launched = input.filter((vehicle) => vehicle.launched);

  if (launched.length === 0) {
    return {
      bestRange: null,
      bestCharging: null,
      bestValue: null,
      bestCity: null,
      bestHighway: null,
      bestFamily: null,
    };
  }

  const byRange = rankVehicles(launched, scoreRange)[0];
  const byCharging = rankVehicles(launched, scoreCharging)[0];
  const byValue = rankVehicles(launched, scoreValue)[0];
  const byCity = rankVehicles(launched, scoreCity)[0];
  const byHighway = rankVehicles(launched, scoreHighway)[0];
  const byFamily = rankVehicles(launched, scoreFamily)[0];

  return {
    bestRange: byRange,
    bestCharging: byCharging,
    bestValue: byValue,
    bestCity: byCity,
    bestHighway: byHighway,
    bestFamily: byFamily,
  };
}