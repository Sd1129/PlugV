import { allEVs, vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { knowledgeArticles } from "@/data/knowledge-articles";
import evidence from "@/data/official-launched-ev-evidence.json";
import { getRecommendations, parseAssistantPrompt, type AssistantRecommendation } from "./recommendationEngine";
import { cleanPrompt, containsPhrase, normalise } from "./promptText";

export type SmartAssistantAction = { label: string; href: string };
export type SmartAssistantReply = {
  text: string;
  recommendations?: AssistantRecommendation[];
  actions: SmartAssistantAction[];
};
type Vehicle = (typeof allEVs)[number];
const vehicleLabel = (vehicle: Vehicle) => `${vehicle.brand} ${vehicle.name}`;
const vehicleAction = (vehicle: Vehicle) => ({ label: `View ${vehicle.name}`, href: `${"launch" in vehicle ? "/upcoming" : "/vehicles"}/${vehicle.slug}` });
const clarify = (text: string, href = "/vehicles"): SmartAssistantReply => ({ text, actions: [{ label: href === "/travel" ? "Open route planner" : "Explore EVs", href }] });

export function findMentionedVehicles(prompt: string) {
  return allEVs.filter((vehicle) => {
    const name = normalise(vehicle.name);
    const aliases = [vehicleLabel(vehicle), vehicle.name, name.replace(/ /g, ""), vehicle.slug.replace(/-/g, " ")];
    // Common shorthand, bounded by words so 'seal' never matches 'sealion'.
    if (name.endsWith(" ev")) aliases.push(name.slice(0, -3));
    if (name.endsWith(" electric")) aliases.push(name.slice(0, -9));
    return aliases.some((alias) => normalise(alias).length >= 2 && containsPhrase(prompt, alias));
  });
}

function catalogueRow(vehicle: Vehicle) {
  if ("launch" in vehicle) return `${vehicleLabel(vehicle)}\nStatus: ${vehicle.status}\nTiming: ${vehicle.launch}\n${vehicle.note}\nSource checked: ${vehicle.verifiedAt}`;
  const record = evidence.find((item) => item.slug === vehicle.slug);
  return `${vehicleLabel(vehicle)}\nCatalogue price: ${vehicle.price ?? "Not recorded"}\nCatalogue claimed range: ${vehicle.range ?? "Not recorded"}\nCharging: ${vehicle.charging ?? "Not verified"}\nLaunch evidence: ${record ? `recorded ${record.verifiedOn}` : "not yet recorded"}`;
}

function sourceActions(vehicle: Vehicle): SmartAssistantAction[] {
  if ("launch" in vehicle) return [{ label: `${vehicle.name}: announcement source`, href: vehicle.sourceUrl }];
  const record = evidence.find((item) => item.slug === vehicle.slug);
  return record ? [{ label: `${vehicle.name}: launch/listing source (not all specifications)`, href: record.sourceUrl }] : [];
}
const catalogueCaution = "Catalogue prices and specifications still require field-by-field review. Launch evidence does not verify every price or variant. Starting price and maximum range may describe different variants. These are not on-road quotes, real-world range guarantees or live stock checks.";

function comparisonReply(prompt: string): SmartAssistantReply {
  const matches = findMentionedVehicles(prompt);
  if (matches.length < 2) return clarify("Name two different EVs to compare. I could not identify two distinct catalogue models. Example: Compare Nexon EV and BE 6.", "/compare");
  if (matches.length > 3) return clarify("Please compare two or three models at a time.", "/compare");
  return {
    text: `Catalogue comparison:\n\n${matches.map(catalogueRow).join("\n\n")}\n\n${catalogueCaution}`,
    actions: [...matches.map(vehicleAction), ...matches.flatMap(sourceActions), { label: "Open comparison", href: "/compare" }],
  };
}

function tripReply(prompt: string): SmartAssistantReply {
  const matches = findMentionedVehicles(prompt);
  const distances = [...prompt.matchAll(/(-?\d+(?:\.\d+)?)\s*km\b/gi)].map((match) => Number(match[1]));
  const batteries = [...prompt.matchAll(/(-?\d+(?:\.\d+)?)\s*%/g)].map((match) => Number(match[1]));
  if (matches.length !== 1 || distances.length !== 1 || batteries.length !== 1) {
    return clarify("For a trip estimate, give one EV, its battery variant, one total journey distance in km and starting battery percentage. Example: Can Tiago EV 24 kWh cover 180 km starting at 90%? For a journey between places, use the route planner; I have not calculated its road distance.", "/travel");
  }
  const [distance] = distances;
  const [startingBattery] = batteries;
  if (distance <= 0 || startingBattery < 0 || startingBattery > 100) return clarify("Use a positive journey distance and a starting battery between 0% and 100%. I will not silently change these values.", "/travel");
  const vehicle = matches[0];
  if ("launch" in vehicle) return clarify(`${vehicleLabel(vehicle)} is in Upcoming. I cannot treat it as a currently available car for a trip estimate.`, "/travel");
  const profile = getVehicleTripProfile(vehicle.slug);
  if (!profile?.variants.length) return clarify(`I do not have a usable trip profile for ${vehicleLabel(vehicle)}. I cannot reliably calculate arrival charge.`, "/travel");
  const capacity = prompt.match(/(\d+(?:\.\d+)?)\s*kwh\b/i);
  let variants = profile.variants;
  if (capacity) variants = variants.filter((item) => item.batteryCapacityKWh === Number(capacity[1]));
  else {
    const named = variants.filter((item) => containsPhrase(prompt, item.name));
    if (named.length) variants = named;
    else if (/\b(long|medium|standard|extended) range\b/.test(prompt)) {
      const descriptor = prompt.match(/\b(long|medium|standard|extended) range\b/)![0];
      variants = variants.filter((item) => containsPhrase(item.name, descriptor));
    }
  }
  const plans = Array.from(new Map(variants.map((item) => [`${item.batteryCapacityKWh}:${item.practicalRangeKm}`, item])).values());
  if (plans.length !== 1) return clarify(`Please specify a recorded battery variant for ${vehicleLabel(vehicle)}: ${Array.from(new Set(profile.variants.map((item) => `${item.batteryCapacityKWh} kWh`))).join(", ")}. I will not assume the longest-range variant.`, "/travel");
  const variant = plans[0];
  if (!(variant.practicalRangeKm > 0)) return clarify("This profile has no usable practical-range estimate.", "/travel");
  const arrival = startingBattery - distance / variant.practicalRangeKm * 100;
  const reserveKm = Math.max(20, variant.practicalRangeKm * 0.1);
  const comfortable = distance <= variant.practicalRangeKm * startingBattery / 100 - reserveKm;
  return {
    text: `${vehicleLabel(vehicle)} — ${variant.batteryCapacityKWh} kWh\nPlugV estimated practical range: ${variant.practicalRangeKm} km\nStarting battery: ${startingBattery}%\nJourney: ${distance} km\n${arrival < 0 ? "Estimated energy is insufficient to finish without charging." : `Estimated arrival battery: ${arrival.toFixed(1)}%`}\n\n${comfortable ? "The estimate leaves the planning reserve." : "Plan a charging stop to preserve the planning reserve."} Reserve: ${reserveKm.toFixed(1)} km (at least 20 km or 10% of estimated range).\n\nPractical range and arrival charge are estimates, not manufacturer-verified driving results. Profile source check recorded ${profile.verifiedAt}; weather, speed, elevation and load affect consumption. This calculation does not check or reserve any charger.`,
    actions: [{ label: "Plan route and charging stops", href: "/travel" }, vehicleAction(vehicle), { label: "Profile source (practical range is estimated)", href: profile.sourceUrl }],
  };
}

function chargerReply(): SmartAssistantReply {
  return {
    text: "Use PlugV Charging to search by city and check recorded connectors, operator and power. I have not searched station records or checked your location in this conversation.\n\nLive status is unknown unless a verified operator feed provides a recent timestamp. A directory entry does not confirm a working or unoccupied connector. Confirm access and compatibility in the operator’s app. PlugV cannot hold a connector; use the operator’s supported booking flow for reservations.",
    actions: [{ label: "Search station records", href: "/charging" }, { label: "Plan a route (does not reserve chargers)", href: "/travel" }],
  };
}

function knowledgeReply(prompt: string): SmartAssistantReply {
  const stop = new Set(["what", "which", "with", "that", "this", "about", "does", "have", "please", "tell", "electric"]);
  const words = normalise(prompt).split(" ").filter((word) => word.length > 3 && !stop.has(word));
  const ranked = knowledgeArticles.map((article) => ({ article, score: words.filter((word) => normalise(`${article.title} ${article.description} ${article.category}`).includes(word)).length }))
    .filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  return {
    text: ranked.length ? `These catalogue guides may help; this is a guide lookup, not a personalised factual answer. Check the linked sources and dates.\n\n${ranked.map(({ article }) => `${article.title}\nUpdate recorded: ${article.updatedAt}`).join("\n\n")}` : "I could not find a specific guide for that question. Please be more specific or browse the Knowledge Hub.",
    actions: ranked.length ? ranked.map(({ article }) => ({ label: article.shortTitle, href: `/knowledge/${article.slug}` })) : [{ label: "Knowledge Hub", href: "/knowledge" }],
  };
}

export function answerWithPlugV(rawPrompt: string, previousPrompt?: string): SmartAssistantReply {
  let prompt = cleanPrompt(rawPrompt.trim());
  if (!prompt) return clarify("Please enter an EV question.");
  if (prompt.length > 2000) return clarify("Please shorten the question to 2,000 characters and ask one decision at a time.");
  // Resolve only a single, explicitly named prior model. Never borrow old amounts or constraints.
  if (/\b(it|its|this car|that car|same car)\b/.test(prompt) && !findMentionedVehicles(prompt).length) {
    const previous = findMentionedVehicles(previousPrompt ?? "");
    if (previous.length !== 1) return clarify("Which EV do you mean? Please repeat the model name and any budget or trip details.");
    prompt += ` ${vehicleLabel(previous[0])}`;
  }
  const query = normalise(prompt);
  const matches = findMentionedVehicles(prompt);
  if (/\b(compare|versus|vs)\b/.test(query)) return comparisonReply(prompt);
  if (/\b(cheapest|lowest price|longest range|highest range|latest|newest|newly launched)\b/.test(query)) return clarify("I cannot reliably rank current prices, launch recency or range across every variant yet. Use Explore EVs for recorded launch dates and catalogue figures; missing dates and different range test cycles limit comparisons.");
  if (/\b(trip|travel|journey|route|cover|reach|drive)\b/.test(query) && !/\b(daily|recommend|buy|best|find)\b/.test(query)) return tripReply(prompt);
  if (/\b(home charging|home charger|baas|battery as a service|subsid\w*|insurance|myth|ownership|maintenance)\b/.test(query)) return knowledgeReply(prompt);
  if (/\b(chargers?|charging stations?|stations?|reserve|reservation|book a charger|occupied|offline|near me)\b/.test(query)) return chargerReply();
  if (/\b(seaters?|seats?|awd|boot|sunroof|adas|safe|safest|safety|airbags?|warranty|ground clearance|on road|real world|real range|used|second hand)\b/.test(query)) return clarify("I cannot reliably filter or confirm that requirement from the assistant’s current data. Please check the exact variant and manufacturer source. For on-road prices, get a city-specific dealer quote; for real-world range, use a clearly labelled planning estimate.");
  if (/\b(charging cost|cost to charge|charge cost|running cost)\b/.test(query)) return knowledgeReply(prompt);
  if (matches.length) {
    if (!/\b(price|cost|range|charging|specifications?|specs|details|about|show|launched|available)\b/.test(query) && !matches.some((vehicle) => [vehicleLabel(vehicle), vehicle.name].some((name) => normalise(name) === query))) return clarify("I recognise the model, but cannot reliably answer that specific question. Ask for its catalogue price, range or details, or check the manufacturer source.");
    return { text: `${matches.map(catalogueRow).join("\n\n")}\n\n${catalogueCaution}`, actions: [...matches.map(vehicleAction), ...matches.flatMap(sourceActions)] };
  }
  if (/\b(cost|guide|charging|battery|petrol|diesel)\b/.test(query) && !/\b(find|recommend|buy|under|budget|best)\b/.test(query)) return knowledgeReply(prompt);
  if (/^(hi|hello|hey|help|what can you do|start)[ !?.]*$/.test(prompt)) return clarify("I can look up named EVs, compare models, shortlist catalogue candidates, estimate trips with explicit battery and distance inputs, and link to charger records or guides. I use limited rules, so repeat model names and requirements in follow-ups.");
  const prefs = parseAssistantPrompt(prompt);
  if (/\b(price|specifications?|specs|tell me about)\b/.test(query) && !/\b(find|recommend|buy|best|under|budget)\b/.test(query)) return clarify("I could not identify that model in the catalogue. Please use its full brand and model name.");
  if (/\b(between|above|over|more than)\b/.test(query) && /\b(lakh|crore|rupees)\b/.test(query)) return clarify("Please state a maximum budget, for example under ₹25 lakh. Budget intervals and minimum prices are not supported yet.");
  if (/\b(under|below|budget)\s*(?:₹|rs\.?|inr)?\s*-\d/.test(prompt)) return clarify("Please give a positive budget, for example ₹20 lakh.");
  if (!/\b(ev|evs|cars?|suv|sedan|hatchback|mpv|roadster|upcoming|launched)\b/.test(query) && !prefs.brands?.length) return clarify("I could not identify a supported EV request. Please name the EV, or ask for a car with a budget and body type. I will not return unrelated recommendations.");
  if (!/\b(find|recommend|suggest|shortlist|show|buy|looking|want|need|under|below|budget|upcoming|best)\b/.test(query) && !/^(?:(?:all|launched|electric) )?(?:evs?|cars?)$/.test(query)) return clarify("I cannot reliably answer that question with the assistant’s current rules. Ask for a named model lookup, comparison, trip estimate or EV shortlist with a maximum budget.");
  if (/\b(not|no|without|except|exclude|excluding|avoid)\b/.test(query) && !prefs.excludedBrands?.length) return clarify("Please use a positive body-type requirement or explicitly name a brand to exclude. I cannot reliably interpret that exclusion.");
  if (prefs.budgetLakh !== undefined && prefs.budgetLakh <= 0) return clarify("Please give a positive budget, for example ₹20 lakh.");
  const result = getRecommendations(prompt, 3);
  if (!result.recommendations.length) return clarify("No catalogue candidates satisfy the supported filters. I have not relaxed your constraints. Prices or specifications may also be unrecorded; try changing one requirement.");
  return {
    text: `Catalogue candidates for your request:\n\nThese rule-based suggestions use recorded starting prices and claimed range, not verified variant quotations. ${/\bdaily\b/.test(query) ? "Daily-distance suitability has not been calculated; ask a trip question with the battery variant and starting charge for an estimate. " : ""}${prefs.budgetLakh && (prefs.rangeMinKm || prefs.chargingMinKw) ? "I cannot confirm that the same variant meets both your budget and performance requirement. " : ""}${catalogueCaution}`,
    recommendations: result.recommendations,
    actions: [{ label: prefs.scope === "upcoming" ? "Explore Upcoming" : "Explore EVs", href: prefs.scope === "upcoming" ? "/upcoming" : "/vehicles" }],
  };
}

export function launchedVehicleCount() { return vehicles.length; }
