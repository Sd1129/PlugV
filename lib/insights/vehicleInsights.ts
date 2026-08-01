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
  const raw = (vehicle.charging ?? "").toLowerCase();

  // Handle text-based charging labels gracefully.
  if (raw.includes("ultra")) return 180;
  if (raw.includes("fast")) return 120;
  if (raw.includes("dc")) return 120;
  if (raw.includes("type 2")) return 60;
  if (raw.includes("ac")) return 60;
  if (raw.includes("slow")) return 30;

  return parseNumeric(vehicle.charging);
}

function scoreValue(vehicle: Vehicle) {
  const price = parseNumeric(vehicle.price);
  const range = scoreRange(vehicle);
  if (!price) return 0;
  return Math.round((range / price) * 1000);
}

function scorePracticality(vehicle: Vehicle) {
  const type = (vehicle.type ?? "").toLowerCase();
  let score = 45;

  if (type.includes("suv")) score += 15;
  if (type.includes("crossover")) score += 12;
  if (type.includes("hatchback")) score += 10;
  if (type.includes("sedan")) score += 8;

  return Math.min(score, 100);
}

function scoreFamily(vehicle: Vehicle) {
  const type = (vehicle.type ?? "").toLowerCase();
  let score = 40;

  if (type.includes("suv")) score += 18;
  if (type.includes("crossover")) score += 14;
  if (type.includes("sedan")) score += 8;

  return Math.min(score, 100);
}

function scoreHighway(vehicle: Vehicle) {
  const range = scoreRange(vehicle);
  const charging = scoreCharging(vehicle);

  let score = 35;
  if (range > 400) score += 25;
  if (charging >= 150) score += 20;
  else if (charging >= 100) score += 10;

  return Math.min(score, 100);
}

function scoreCity(vehicle: Vehicle) {
  const charging = scoreCharging(vehicle);
  const type = (vehicle.type ?? "").toLowerCase();

  let score = 45;
  if (charging >= 100) score += 20;
  if (type.includes("hatchback") || type.includes("sedan")) score += 10;
  if (type.includes("suv")) score += 5;

  return Math.min(score, 100);
}

function scoreConfidence(vehicle: Vehicle) {
  const range = scoreRange(vehicle);
  const charging = scoreCharging(vehicle);
  const value = scoreValue(vehicle);
  const practicality = scorePracticality(vehicle);

  const raw = range * 0.25 + charging * 0.2 + value * 0.25 + practicality * 0.3;
  return Math.max(1, Math.min(100, Math.round(raw / 5)));
}

function plugvScore(vehicle: Vehicle) {
  const range = scoreRange(vehicle);
  const charging = scoreCharging(vehicle);
  const value = scoreValue(vehicle);
  const practicality = scorePracticality(vehicle);

  const raw = range * 0.3 + charging * 0.25 + value * 0.2 + practicality * 0.25;
  return Math.max(1, Math.min(100, Math.round(raw / 5)));
}

function valueLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  return "Low";
}

export function getVehicleInsights(vehicle: Vehicle) {
  const score = plugvScore(vehicle);
  const confidence = scoreConfidence(vehicle);

  const city = scoreCity(vehicle);
  const highway = scoreHighway(vehicle);
  const family = scoreFamily(vehicle);
  const charging = scoreCharging(vehicle);
  const value = scoreValue(vehicle);
  const practicality = scorePracticality(vehicle);

  const bestFor = [
    city >= 60 ? "City driving" : null,
    family >= 60 ? "Family use" : null,
    highway >= 60 ? "Highway trips" : null,
    value >= 60 ? "Value buyers" : null,
  ].filter(Boolean) as string[];

  const verdict =
    score >= 85
      ? "An excellent EV with strong overall balance and a premium ownership case."
      : score >= 70
        ? "A strong EV that should suit the right buyer very well."
        : score >= 55
          ? "A decent option, best considered alongside similar alternatives."
          : "A more selective choice that may suit only specific use cases.";

  const ownership = [
    { label: "Running cost", value: valueLabel(value) },
    { label: "Charging ease", value: valueLabel(charging) },
    { label: "Maintenance", value: valueLabel(practicality) },
    { label: "Road trips", value: valueLabel(highway) },
    { label: "Family use", value: valueLabel(family) },
    { label: "Daily commute", value: valueLabel(city) },
  ];

  const buyNow = city >= 60 || family >= 60 || highway >= 60 || score >= 75;
  const considerAlternatives = score < 70 || charging < 50 || scoreRange(vehicle) < 250;

  return {
    score,
    confidence,
    bestFor,
    verdict,
    ownership,
    buyNow,
    considerAlternatives,
  };
}