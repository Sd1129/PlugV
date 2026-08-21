import { vehicles, upcomingEVs } from "@/data/vehicles";

type LaunchedVehicle = (typeof vehicles)[number];
type UpcomingVehicle = (typeof upcomingEVs)[number];
type CatalogVehicle = LaunchedVehicle | UpcomingVehicle;

export type AssistantPreferences = {
  budgetLakh?: number;
  bodyType?: string;
  rangeMinKm?: number;
  chargingMinKw?: number;
  useCase?: string;
  keywords?: string[];
  scope?: "launched" | "upcoming" | "both";
};

export type AssistantRecommendation = {
  vehicle: CatalogVehicle;
  score: number;
  reasons: string[];
};

export type AssistantResponse = {
  summary: string;
  recommendations: AssistantRecommendation[];
};

function safeText(value: unknown): string {
  return String(value ?? "").toLowerCase().trim();
}

function parseNumeric(value?: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function getVehicleLabel(vehicle: CatalogVehicle): string {
  return `${vehicle.brand} ${vehicle.name}`.trim();
}

function getVehicleType(vehicle: CatalogVehicle): string {
  if ("type" in vehicle && vehicle.type) return vehicle.type;
  if ("segment" in vehicle && vehicle.segment) return vehicle.segment;
  return "";
}

function getVehicleStatus(vehicle: CatalogVehicle): string {
  return vehicle.status;
}

function getVehiclePrice(vehicle: CatalogVehicle): string | undefined {
  if ("price" in vehicle) return vehicle.price;
  return undefined;
}

function getVehicleRange(vehicle: CatalogVehicle): string | undefined {
  if ("range" in vehicle) return vehicle.range;
  return undefined;
}

function getVehicleCharging(vehicle: CatalogVehicle): string | undefined {
  if ("charging" in vehicle) return vehicle.charging;
  return undefined;
}

function extractBudgetLakh(input: string): number | undefined {
  const match = input.match(
    /(?:under|below|within|upto|up to|less than|max|maximum)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|crore|cr|k)?/i
  );

  if (!match) return undefined;

  const amount = Number(match[1]);
  const unit = (match[2] ?? "lakh").toLowerCase();

  if (unit === "crore" || unit === "cr") return amount * 100;
  if (unit === "k") return amount / 100;
  return amount;
}

function extractBodyType(input: string): string | undefined {
  const q = safeText(input);

  const bodyTypes = [
    "compact suv",
    "luxury suv",
    "electric suv",
    "suv coupe",
    "hatchback",
    "sedan",
    "mpv",
    "coupe",
    "wagon",
    "pickup",
    "microcar",
    "roadster",
  ];

  return bodyTypes.find((type) => q.includes(type));
}

function extractUseCase(input: string): string | undefined {
  const q = safeText(input);

  if (q.includes("family")) return "family";
  if (q.includes("city")) return "city";
  if (q.includes("highway") || q.includes("long drive") || q.includes("road trip")) {
    return "highway";
  }
  if (q.includes("value") || q.includes("cheap") || q.includes("budget")) {
    return "value";
  }
  if (q.includes("performance") || q.includes("fun")) return "performance";

  return undefined;
}

function extractScope(input: string): AssistantPreferences["scope"] {
  const q = safeText(input);

  if (
    q.includes("upcoming") ||
    q.includes("coming soon") ||
    q.includes("launch") ||
    q.includes("future")
  ) {
    return "upcoming";
  }

  if (q.includes("both") || q.includes("all")) {
    return "both";
  }

  return "launched";
}

function scoreVehicle(
  vehicle: CatalogVehicle,
  prefs: AssistantPreferences
): AssistantRecommendation {
  const reasons: string[] = [];
  let score = 0;

  const price = parseNumeric(getVehiclePrice(vehicle));
  const range = parseNumeric(getVehicleRange(vehicle));
  const charging = parseNumeric(getVehicleCharging(vehicle));

  const vehicleType = safeText(getVehicleType(vehicle));
  const vehicleName = safeText(vehicle.name);
  const vehicleStatus = safeText(getVehicleStatus(vehicle));
  const vehicleBrand = safeText(vehicle.brand);

  // Body type match
  if (prefs.bodyType) {
    const desiredBody = safeText(prefs.bodyType);
    if (
      vehicleType.includes(desiredBody) ||
      desiredBody.includes(vehicleType) ||
      vehicleName.includes(desiredBody) ||
      vehicleBrand.includes(desiredBody)
    ) {
      score += 20;
      reasons.push(`Matches requested body type: ${getVehicleType(vehicle)}`);
    }
  }

  // Budget fit
  if (prefs.budgetLakh && price > 0) {
    if (price <= prefs.budgetLakh) {
      score += 24;
      reasons.push(`Fits within the ₹${prefs.budgetLakh} lakh budget`);

      const headroom = prefs.budgetLakh - price;
      if (headroom >= 5) {
        score += 4;
        reasons.push("Leaves comfortable budget headroom");
      }
    } else {
      const overBy = price - prefs.budgetLakh;
      if (overBy <= 5) {
        score += 5;
        reasons.push("Slightly above budget but still close to the target");
      } else {
        score -= 12;
      }
    }
  }

  // If budget is specified but price is unknown (common for upcoming)
  if (prefs.budgetLakh && price === 0 && "launch" in vehicle) {
    score -= 2;
    reasons.push("Pricing is not confirmed yet");
  }

  // Range
  if (prefs.rangeMinKm && range > 0) {
    if (range >= prefs.rangeMinKm) {
      score += 18;
      reasons.push(`Offers ${range} km of range`);
    } else {
      score -= 6;
    }
  } else if (range > 0) {
    score += Math.min(12, Math.round(range / 100));
  }

  // Charging
  if (prefs.chargingMinKw && charging > 0) {
    if (charging >= prefs.chargingMinKw) {
      score += 16;
      reasons.push(`Fast charging capability is ${charging} kW`);
    } else {
      score -= 4;
    }
  } else if (charging > 0) {
    score += Math.min(8, Math.round(charging / 30));
  }

  // Use case tuning
  switch (prefs.useCase) {
    case "family":
      if (vehicleType.includes("suv") || vehicleType.includes("mpv")) {
        score += 10;
        reasons.push("Good fit for family use");
      }
      if (range >= 400) score += 5;
      break;

    case "city":
      if (
        vehicleType.includes("compact") ||
        vehicleType.includes("hatchback") ||
        vehicleType.includes("sedan") ||
        vehicleType.includes("microcar")
      ) {
        score += 10;
        reasons.push("Compact and practical for city driving");
      }
      break;

    case "highway":
      if (range >= 450) {
        score += 14;
        reasons.push("Strong range confidence for highway trips");
      }
      if (charging >= 100) {
        score += 8;
        reasons.push("Fast charging helps on long drives");
      }
      break;

    case "value":
      if (price > 0) {
        score += 8;
        reasons.push("Balanced price-to-capability profile");
      }
      break;

    case "performance":
      if (charging >= 100) score += 6;
      if (range >= 400) score += 6;
      break;
  }

  // General signals
  if (vehicleStatus.includes("launched")) {
    score += 6;
    reasons.push("Available now");
  } else if (vehicleStatus.includes("upcoming") || "launch" in vehicle) {
    score += 2;
    reasons.push("Upcoming model");
  }

  if (vehicleBrand) score += 1;
  if (vehicleName.includes("ev")) score += 1;

  const combined = `${vehicleBrand} ${vehicleName} ${vehicleType} ${vehicleStatus}`;
  const keywordBoost = (prefs.keywords ?? []).reduce((acc, keyword) => {
    const k = safeText(keyword);
    if (!k) return acc;
    if (combined.includes(k)) return acc + 2;
    return acc;
  }, 0);

  score += keywordBoost;

  const uniqueReasons = Array.from(new Set(reasons)).slice(0, 3);

  return {
    vehicle,
    score: Math.max(0, score),
    reasons:
      uniqueReasons.length > 0
        ? uniqueReasons
        : ["Solid overall fit based on PlugV scoring signals"],
  };
}

function buildSummary(
  recommendations: AssistantRecommendation[],
  prefs: AssistantPreferences
): string {
  const top = recommendations[0]?.vehicle;
  if (!top) return "No matching EVs were found.";

  const parts = [
    getVehicleLabel(top),
    prefs.budgetLakh ? `within ₹${prefs.budgetLakh} lakh` : undefined,
    prefs.useCase ? `for ${prefs.useCase} use` : undefined,
  ].filter(Boolean);

  return `Here are the strongest matches from PlugV for ${parts.join(" ")}.`;
}

export function parseAssistantPrompt(prompt: string): AssistantPreferences {
  const budgetLakh = extractBudgetLakh(prompt);
  const bodyType = extractBodyType(prompt);
  const useCase = extractUseCase(prompt);
  const scope = extractScope(prompt);
  const q = safeText(prompt);

  const keywords: string[] = [];
  if (q.includes("awd")) keywords.push("awd");
  if (q.includes("suv")) keywords.push("suv");
  if (q.includes("family")) keywords.push("family");
  if (q.includes("city")) keywords.push("city");
  if (q.includes("highway")) keywords.push("highway");
  if (q.includes("range")) keywords.push("range");
  if (q.includes("charging")) keywords.push("charging");
  if (q.includes("budget")) keywords.push("budget");
  if (q.includes("value")) keywords.push("value");
  if (q.includes("fast")) keywords.push("fast");
  if (q.includes("launched")) keywords.push("launched");
  if (q.includes("upcoming")) keywords.push("upcoming");

  return {
    budgetLakh,
    bodyType,
    useCase,
    keywords,
    scope,
  };
}

export function getRecommendations(prompt: string, limit = 3): AssistantResponse {
  const prefs = parseAssistantPrompt(prompt);

  const catalog: CatalogVehicle[] =
    prefs.scope === "upcoming"
      ? upcomingEVs
      : prefs.scope === "both"
        ? [...vehicles, ...upcomingEVs]
        : vehicles;

  const ranked = catalog
    .map((vehicle) => scoreVehicle(vehicle, prefs))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    summary: buildSummary(ranked, prefs),
    recommendations: ranked,
  };
}

// Backward-compatible alias
export const getPlugVRecommendations = getRecommendations;
