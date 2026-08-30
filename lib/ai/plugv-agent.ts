import { ToolLoopAgent, isStepCount, tool } from "ai";
import { z } from "zod";
import { allEVs } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { knowledgeArticles } from "@/data/knowledge-articles";
import { getRecommendations } from "@/lib/assistant/recommendationEngine";
import { searchChargingStations } from "@/lib/charging/chargingRepository";

function catalogueVehicle(vehicle: (typeof allEVs)[number]) {
  return {
    slug: vehicle.slug,
    name: `${vehicle.brand} ${vehicle.name}`,
    status: vehicle.status,
    bodyType: "type" in vehicle ? vehicle.type : vehicle.segment,
    price: "price" in vehicle ? vehicle.price : "expectedPrice" in vehicle ? vehicle.expectedPrice : undefined,
    range: vehicle.range,
    href: "launched" in vehicle ? `/vehicles/${vehicle.slug}` : `/upcoming/${vehicle.slug}`,
    source: "sourceName" in vehicle ? { name: vehicle.sourceName, url: vehicle.sourceUrl, verifiedAt: vehicle.verifiedAt } : undefined,
  };
}

const recommendVehicles = tool({
  description: "Rank launched or upcoming Indian EVs from PlugV's catalogue for a buyer's stated budget, use, body style, range or charging needs.",
  inputSchema: z.object({ query: z.string().min(3), limit: z.number().int().min(1).max(5).default(3) }),
  execute: async ({ query, limit }) => {
    const result = getRecommendations(query, limit);
    return {
      summary: result.summary,
      matches: result.recommendations.map(({ vehicle, score, reasons }) => ({ ...catalogueVehicle(vehicle), score, reasons })),
      caveat: "Prices are generally ex-showroom and range figures are manufacturer-claimed unless explicitly labelled practical.",
    };
  },
});

const compareVehicles = tool({
  description: "Compare two or three EVs using PlugV catalogue and verified trip-profile data. Use exact vehicle slugs returned by another tool where possible.",
  inputSchema: z.object({ slugs: z.array(z.string()).min(2).max(3) }),
  execute: async ({ slugs }) => ({
    vehicles: slugs.map((slug) => {
      const vehicle = allEVs.find((item) => item.slug === slug);
      if (!vehicle) return { slug, found: false };
      const trip = getVehicleTripProfile(slug);
      return {
        found: true,
        ...catalogueVehicle(vehicle),
        variants: trip?.variants.map((variant) => ({
          name: variant.name,
          batteryKWh: variant.batteryCapacityKWh,
          certifiedRangeKm: variant.certifiedRangeKm,
          practicalRangeKm: variant.practicalRangeKm,
          dcChargingKW: variant.maxDcChargeKW,
          acChargingKW: variant.maxAcChargeKW,
          fastChargeMinutes: variant.fastChargeMinutes,
        })) ?? [],
        tripDataConfidence: trip?.confidence ?? "not available",
      };
    }),
    comparisonUrl: `/compare?vehicles=${slugs.map(encodeURIComponent).join(",")}`,
  }),
});

const findChargers = tool({
  description: "Find public EV charging stations in an Indian city from PlugV's synchronized and bundled station data. Never describe unknown availability as live or available.",
  inputSchema: z.object({
    city: z.string().min(2),
    connector: z.enum(["any", "ccs2", "chademo"]).default("any"),
    fastOnly: z.boolean().default(false),
    limit: z.number().int().min(1).max(8).default(5),
  }),
  execute: async ({ city, connector, fastOnly, limit }) => {
    const result = await searchChargingStations({ city, fastOnly, ccs2Only: connector === "ccs2", chademoOnly: connector === "chademo", limit });
    return {
      city,
      totalMatches: result.total,
      coverage: result.coverage,
      stations: result.stations.map((station) => ({
        name: station.name,
        operator: station.operator,
        address: station.address,
        connector: station.connectors.ccs2 ? "CCS2" : station.connectors.chademo ? "CHAdeMO" : station.connectors.acType2 ? "Type 2 AC" : "Unspecified",
        maxPowerKW: station.charging.maxPowerKW,
        availability: station.availability?.status ?? "unknown",
        lastUpdated: station.availability?.lastUpdated ?? station.trust?.lastCheckedAt ?? station.charging.lastChecked ?? "not available",
        confidence: station.trust?.verified ? "verified listing" : "verification pending",
        directionsUrl: station.directionsUrl,
      })),
      warning: "A station listing does not guarantee that a connector is working or free. Availability marked unknown is not live operator status.",
      browseUrl: `/charging?city=${encodeURIComponent(city)}`,
    };
  },
});

const estimateTripReadiness = tool({
  description: "Estimate whether a specific EV variant can cover a stated trip distance and calculate approximate energy, battery arrival, and charging requirement.",
  inputSchema: z.object({
    vehicleSlug: z.string(),
    variantName: z.string().optional(),
    distanceKm: z.number().positive().max(5000),
    startingBatteryPercent: z.number().min(1).max(100).default(90),
    arrivalReservePercent: z.number().min(5).max(50).default(15),
  }),
  execute: async ({ vehicleSlug, variantName, distanceKm, startingBatteryPercent, arrivalReservePercent }) => {
    const profile = getVehicleTripProfile(vehicleSlug);
    if (!profile) return { available: false, reason: "PlugV does not yet have a verified trip profile for this vehicle.", travelUrl: "/travel" };
    const variant = profile.variants.find((item) => item.name.toLowerCase() === variantName?.toLowerCase())
      ?? profile.variants.find((item) => item.name === profile.defaultVariant)
      ?? profile.variants[0];
    const usableStartKm = variant.practicalRangeKm * (startingBatteryPercent / 100);
    const reserveKm = variant.practicalRangeKm * (arrivalReservePercent / 100);
    const usableJourneyKm = Math.max(0, usableStartKm - reserveKm);
    const energyKWh = (distanceKm / variant.practicalRangeKm) * variant.batteryCapacityKWh;
    const arrivalPercent = Math.max(0, startingBatteryPercent - (distanceKm / variant.practicalRangeKm) * 100);
    const requiredChargingStops = distanceKm <= usableJourneyKm ? 0 : Math.max(1, Math.ceil((distanceKm - usableJourneyKm) / (variant.practicalRangeKm * 0.65)));
    return {
      available: true,
      vehicleSlug,
      variant: variant.name,
      distanceKm,
      practicalRangeKm: variant.practicalRangeKm,
      estimatedEnergyKWh: Number(energyKWh.toFixed(1)),
      estimatedArrivalBatteryPercent: Number(arrivalPercent.toFixed(0)),
      arrivalReservePercent,
      estimatedChargingStops: requiredChargingStops,
      typicalFastChargeMinutesPerStop: variant.fastChargeMinutes,
      connector: variant.connector,
      confidence: profile.confidence,
      source: { name: profile.sourceName, url: profile.sourceUrl, verifiedAt: profile.verifiedAt },
      warning: "Planning estimate only. Weather, traffic, speed, elevation, load, battery health and charger conditions can materially change the result.",
      travelUrl: `/travel?vehicle=${encodeURIComponent(vehicleSlug)}`,
    };
  },
});

const searchKnowledge = tool({
  description: "Search PlugV's reviewed owner and buyer guides for costs, charging, policy, ownership and buying questions.",
  inputSchema: z.object({ query: z.string().min(2), limit: z.number().int().min(1).max(5).default(3) }),
  execute: async ({ query, limit }) => {
    const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 2);
    const results = knowledgeArticles
      .map((article) => ({ article, score: terms.reduce((score, term) => score + `${article.title} ${article.description} ${article.category} ${article.intro}`.toLowerCase().split(term).length - 1, 0) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ article }) => ({ title: article.title, category: article.category, summary: article.description, updatedAt: article.updatedAt, href: `/knowledge/${article.slug}`, sources: article.sources ?? [] }));
    return { results, note: results.length ? "Use the visible last-updated date and linked primary sources when relying on time-sensitive guidance." : "No matching PlugV guide was found." };
  },
});

export const plugvAgent = new ToolLoopAgent({
  model: process.env.PLUGV_AI_MODEL || "openai/gpt-5.4-mini",
  instructions: `You are PlugV Copilot, an EV decision and ownership assistant for India.

Rules:
- Use PlugV tools before making vehicle, variant, range, charger, trip, price, policy or ownership claims.
- Never invent specifications, prices, launch dates, charger availability or operator status.
- Separate manufacturer-claimed figures, PlugV practical estimates, and unknown fields.
- If a user asks what is working "now", only call it live when the tool explicitly returns fresh live operator status.
- Give a direct recommendation, the important trade-offs, and the best next action.
- Use ₹, lakh, km and kWh. Keep answers concise and mobile-readable.
- Link to relevant PlugV pages using the href or URL returned by tools.
- Do not provide financial, legal or safety guarantees. For emergencies, direct the user to local emergency services or the vehicle manufacturer's roadside assistance.
- PlugV is independent; do not claim official endorsement by a manufacturer or charging operator.`,
  tools: { recommendVehicles, compareVehicles, findChargers, estimateTripReadiness, searchKnowledge },
  stopWhen: isStepCount(8),
});

export type PlugVAgentMessage = import("ai").InferAgentUIMessage<typeof plugvAgent>;
