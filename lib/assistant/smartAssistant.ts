import { allEVs, vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { knowledgeArticles } from "@/data/knowledge-articles";
import { getRecommendations, type AssistantRecommendation } from "@/lib/assistant/recommendationEngine";

export type SmartAssistantAction = { label: string; href: string };
export type SmartAssistantReply = {
  text: string;
  recommendations?: AssistantRecommendation[];
  actions: SmartAssistantAction[];
};

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function vehicleLabel(vehicle: (typeof allEVs)[number]) {
  return `${vehicle.brand} ${vehicle.name}`.trim();
}

function findMentionedVehicles(prompt: string) {
  const query = normalise(prompt);
  return allEVs.filter((vehicle) => {
    const label = normalise(vehicleLabel(vehicle));
    const name = normalise(vehicle.name);
    return query.includes(label) || (name.length > 3 && query.includes(name));
  });
}

function field(vehicle: (typeof allEVs)[number], key: "price" | "range" | "charging") {
  const record = vehicle as unknown as Record<string, unknown>;
  return key in record ? String(record[key] ?? "Not published") : "Not published";
}

function comparisonReply(prompt: string): SmartAssistantReply {
  const matches = findMentionedVehicles(prompt).slice(0, 3);
  if (matches.length < 2) {
    return {
      text: "Tell me the names of at least two EVs to compare. Example: “Compare Tata Nexon EV and Mahindra BE 6.”",
      actions: [{ label: "Open full comparison", href: "/compare" }],
    };
  }

  const rows = matches.map((vehicle) => [
    vehicleLabel(vehicle),
    `Price: ${field(vehicle, "price")}`,
    `Claimed range: ${field(vehicle, "range")}`,
    `Power / battery: ${field(vehicle, "charging")}`,
  ].join("\n"));

  return {
    text: `Here is a quick catalogue comparison:\n\n${rows.join("\n\n")}\n\nPrices are generally ex-showroom and range figures are manufacturer-claimed unless labelled otherwise. Use the comparison workspace for exact variants and feature differences.`,
    actions: matches.map((vehicle) => ({ label: `View ${vehicle.name}`, href: `/vehicles/${vehicle.slug}` })).concat({ label: "Compare in detail", href: "/compare" }),
  };
}

function tripReply(prompt: string): SmartAssistantReply {
  const distance = Number(prompt.match(/(\d{2,4})\s*km/i)?.[1] ?? 0);
  const startingBattery = Math.min(100, Number(prompt.match(/(?:start|starting|battery)\D{0,12}(\d{1,3})\s*%/i)?.[1] ?? 90));
  const vehicle = findMentionedVehicles(prompt)[0];
  const profile = vehicle ? getVehicleTripProfile(vehicle.slug) : undefined;

  if (!vehicle || !profile || !distance) {
    return {
      text: "For a useful trip check, include the EV name, journey distance and starting battery. Example: “Can the Tiago EV Long Range cover 180 km starting at 90%?”",
      actions: [{ label: "Plan a complete route", href: "/travel" }],
    };
  }

  const variant = profile.variants.find((item) => item.name === profile.defaultVariant) ?? profile.variants[0];
  const availableKm = variant.practicalRangeKm * (startingBattery / 100);
  const reserveKm = Math.max(20, variant.practicalRangeKm * 0.1);
  const comfortableKm = Math.max(0, availableKm - reserveKm);
  const arrivalPercent = Math.max(0, Math.round(startingBattery - (distance / variant.practicalRangeKm) * 100));
  const comfortable = distance <= comfortableKm;

  return {
    text: `${vehicleLabel(vehicle)} — ${variant.name}\n\nPractical planning range: ${variant.practicalRangeKm} km\nStarting battery: ${startingBattery}%\nJourney: ${distance} km\nEstimated arrival battery: ${arrivalPercent}%\n\n${comfortable ? "This appears achievable with a planning reserve." : "This trip needs a charging stop or a higher starting charge to preserve a sensible reserve."}\n\nThis is a planning estimate based on PlugV’s ${profile.confidence} profile, verified ${profile.verifiedAt}. Weather, speed, traffic, elevation and load can change consumption.`,
    actions: [
      { label: "Build the route and charging plan", href: "/travel" },
      { label: `View ${vehicle.name}`, href: `/vehicles/${vehicle.slug}` },
    ],
  };
}

function chargerReply(prompt: string): SmartAssistantReply {
  const city = prompt.match(/(?:in|near|around)\s+([a-z][a-z .-]{2,30})/i)?.[1]?.replace(/\b(?:and|with|for)\b.*$/i, "").trim();
  return {
    text: `${city ? `To find chargers in ${city},` : "To find a charger,"} open PlugV Charging and enter the city name. PlugV will show the available station records, connector and power information.\n\nLive availability must be treated as unknown unless an official operator feed supplies a fresh status. Always verify access and operation in the network operator’s app before travelling.`,
    actions: [{ label: city ? `Find chargers in ${city}` : "Search charging stations", href: "/charging" }],
  };
}

function knowledgeReply(prompt: string): SmartAssistantReply | null {
  const words = normalise(prompt).split(" ").filter((word) => word.length > 3);
  const ranked = knowledgeArticles.map((article) => ({
    article,
    score: words.filter((word) => normalise(`${article.title} ${article.description} ${article.category}`).includes(word)).length,
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  if (!ranked.length) return null;

  return {
    text: `These reviewed PlugV guides are the closest match:\n\n${ranked.map(({ article }) => `• ${article.title}\n  Updated ${article.updatedAt} · ${article.readTime}`).join("\n\n")}`,
    actions: ranked.map(({ article }) => ({ label: article.shortTitle, href: `/knowledge/${article.slug}` })),
  };
}

export function answerWithPlugV(prompt: string): SmartAssistantReply {
  const query = normalise(prompt);
  if (/\b(compare|versus| vs )\b/.test(` ${query} `)) return comparisonReply(prompt);
  if (/\b(trip|travel|journey|route|cover)\b/.test(query) && /\d{2,4}\s*km/i.test(prompt)) return tripReply(prompt);
  if (/\b(charger|charging station|fast charge|ccs2)\b/.test(query)) return chargerReply(prompt);

  if (/\b(cost|subsid|myth|guide|insurance|ownership|home charging|baas|battery as a service)\b/.test(query)) {
    const reply = knowledgeReply(prompt);
    if (reply) return reply;
  }

  if (/\b(help|what can you|hello|hi|start)\b/.test(query)) {
    return {
      text: "I can help you shortlist EVs, compare named models, check whether a journey fits a vehicle’s practical range, direct you to city charger records, and find reviewed PlugV ownership guides. Include specific names, kilometres, city and budget for the clearest result.",
      actions: [
        { label: "Explore EVs", href: "/vehicles" },
        { label: "Plan a trip", href: "/travel" },
        { label: "Search chargers", href: "/charging" },
      ],
    };
  }

  const result = getRecommendations(prompt, 3);
  if (!result.recommendations.length) {
    return {
      text: "I could not find a confident catalogue match for every requirement. Try changing one constraint or tell me your budget, preferred body type, minimum range and whether the EV is mainly for city or highway use.",
      actions: [{ label: "Search and filter all EVs", href: "/vehicles" }],
    };
  }

  return {
    text: `${result.summary}\n\nThese are rule-based matches from PlugV’s current catalogue—not paid rankings. Open each model to confirm the exact variant, price and features.`,
    recommendations: result.recommendations,
    actions: [{ label: "Explore all matching EVs", href: "/vehicles" }],
  };
}

export function launchedVehicleCount() {
  return vehicles.length;
}
