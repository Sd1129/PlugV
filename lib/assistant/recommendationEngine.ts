import { vehicles } from "@/data/vehicles";

type Vehicle = (typeof vehicles)[number];

export type AssistantProfile = {
  budgetLakh: number;
  bodyStyle: "Any" | "SUV" | "Crossover" | "Hatchback" | "Sedan";
  usage: "City" | "Mixed" | "Highway" | "Daily commute";
  homeCharging: "Yes" | "No";
  seats: "Any" | "4-5" | "6-7";
  priority: "Balanced" | "Range" | "Price" | "Charging";
};

export type Recommendation = {
  vehicle: Vehicle;
  score: number;
  reasons: string[];
};

function parseNumeric(value?: string) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function priceScore(vehicle: Vehicle, budgetLakh: number) {
  const price = parseNumeric(vehicle.price);
  if (!price || !budgetLakh) return 40;
  const diff = Math.abs(price - budgetLakh);
  return Math.max(10, Math.min(100, Math.round(100 - diff * 7)));
}

function rangeScore(vehicle: Vehicle) {
  return parseNumeric(vehicle.range);
}

function chargingScore(vehicle: Vehicle) {
  const raw = (vehicle.charging ?? "").toLowerCase();
  if (raw.includes("ultra")) return 180;
  if (raw.includes("fast")) return 120;
  if (raw.includes("dc")) return 120;
  if (raw.includes("type 2")) return 70;
  if (raw.includes("ac")) return 70;
  return parseNumeric(vehicle.charging);
}

function bodyScore(vehicle: Vehicle, bodyStyle: AssistantProfile["bodyStyle"]) {
  if (bodyStyle === "Any") return 50;
  const type = (vehicle.type ?? "").toLowerCase();
  return type.includes(bodyStyle.toLowerCase()) ? 100 : 35;
}

function usageScore(
  vehicle: Vehicle,
  usage: AssistantProfile["usage"],
  homeCharging: AssistantProfile["homeCharging"]
) {
  const range = rangeScore(vehicle);
  const charging = chargingScore(vehicle);
  const type = (vehicle.type ?? "").toLowerCase();

  let score = 50;

  if (usage === "City") {
    if (charging >= 100) score += 18;
    if (range > 300) score += 8;
    if (type.includes("hatchback") || type.includes("sedan")) score += 10;
  }

  if (usage === "Daily commute") {
    if (charging >= 100) score += 16;
    if (range > 300) score += 12;
    if (type.includes("suv")) score += 6;
  }

  if (usage === "Mixed") {
    if (range > 350) score += 16;
    if (charging >= 100) score += 14;
  }

  if (usage === "Highway") {
    if (range > 400) score += 22;
    if (charging >= 100) score += 18;
    if (charging >= 150) score += 8;
  }

  if (homeCharging === "No" && charging >= 100) score += 10;
  if (homeCharging === "Yes" && range > 350) score += 6;

  return Math.min(100, score);
}

function seatsScore(vehicle: Vehicle, seats: AssistantProfile["seats"]) {
  if (seats === "Any") return 50;
  const type = (vehicle.type ?? "").toLowerCase();

  if (seats === "6-7") {
    return type.includes("suv") || type.includes("crossover") ? 100 : 35;
  }

  return type.includes("hatchback") || type.includes("sedan") ? 100 : 70;
}

function priorityScore(vehicle: Vehicle, priority: AssistantProfile["priority"]) {
  const price = priceScore(vehicle, 25);
  const range = rangeScore(vehicle);
  const charging = chargingScore(vehicle);

  if (priority === "Price") return price;
  if (priority === "Range") return Math.min(100, Math.round(range / 5));
  if (priority === "Charging") return Math.min(100, Math.round(charging / 2));
  return Math.round((price + Math.min(100, range / 5) + Math.min(100, charging / 2)) / 3);
}

function buildReasons(
  vehicle: Vehicle,
  profile: AssistantProfile
) {
  const reasons: string[] = [];
  const price = parseNumeric(vehicle.price);
  const range = parseNumeric(vehicle.range);
  const charging = chargingScore(vehicle);
  const type = (vehicle.type ?? "").toLowerCase();

  if (Math.abs(price - profile.budgetLakh) <= 4) {
    reasons.push("Fits your budget target closely.");
  }
  if (profile.usage === "City" && charging >= 100) {
    reasons.push("Strong for city charging convenience.");
  }
  if (profile.usage === "Highway" && range >= 400) {
    reasons.push("Good for longer highway trips.");
  }
  if (profile.homeCharging === "No" && charging >= 100) {
    reasons.push("Fast charging helps because you do not have home charging.");
  }
  if (profile.seats === "6-7" && (type.includes("suv") || type.includes("crossover"))) {
    reasons.push("Body style suits a larger family footprint.");
  }
  if (profile.priority === "Range" && range >= 400) {
    reasons.push("Strong range match for your priority.");
  }
  if (profile.priority === "Charging" && charging >= 100) {
    reasons.push("Charging speed matches your priority.");
  }
  if (reasons.length === 0) {
    reasons.push("A balanced fit based on your selected preferences.");
  }

  return reasons.slice(0, 3);
}

export function getRecommendations(profile: AssistantProfile): Recommendation[] {
  const launched = vehicles.filter((vehicle) => vehicle.launched);

  return launched
    .map((vehicle) => {
      const price = priceScore(vehicle, profile.budgetLakh);
      const range = Math.min(100, Math.round(rangeScore(vehicle) / 5));
      const charging = Math.min(100, Math.round(chargingScore(vehicle) / 2));
      const body = bodyScore(vehicle, profile.bodyStyle);
      const usage = usageScore(vehicle, profile.usage, profile.homeCharging);
      const seats = seatsScore(vehicle, profile.seats);
      const priority = priorityScore(vehicle, profile.priority);

      const score = Math.max(
        1,
        Math.min(
          100,
          Math.round(
            price * 0.22 +
              range * 0.2 +
              charging * 0.2 +
              body * 0.12 +
              usage * 0.16 +
              seats * 0.05 +
              priority * 0.05
          )
        )
      );

      return {
        vehicle,
        score,
        reasons: buildReasons(vehicle, profile),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}