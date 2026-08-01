export type ChargingStation = {
    name: string;
    city: string;
    connector: string;
    speed: string;
    availability: "High" | "Medium" | "Low";
    distance: string;
    price: string;
    hours: string;
    amenities: string[];
    note: string;
  };
  
  function parseNumeric(value?: string) {
    if (!value) return 0;
    const cleaned = value.replace(/,/g, "");
    const match = cleaned.match(/(\d+(\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  }
  
  function scoreAvailability(value: ChargingStation["availability"]) {
    if (value === "High") return 100;
    if (value === "Medium") return 72;
    return 55;
  }
  
  function scoreSpeed(speed: string) {
    const raw = parseNumeric(speed);
    if (raw >= 150) return 100;
    if (raw >= 100) return 84;
    if (raw >= 80) return 70;
    if (raw >= 50) return 58;
    return 42;
  }
  
  function scorePrice(price: string) {
    const raw = parseNumeric(price);
    if (raw <= 18) return 100;
    if (raw <= 20) return 88;
    if (raw <= 22) return 78;
    if (raw <= 24) return 68;
    return 58;
  }
  
  function scoreConvenience(station: ChargingStation) {
    let score = 45;
  
    if (station.hours.includes("24/7")) score += 20;
    if (station.amenities.length >= 4) score += 12;
    if (station.amenities.some((item) => item.toLowerCase().includes("wi-fi"))) {
      score += 6;
    }
    if (station.amenities.some((item) => item.toLowerCase().includes("lounge"))) {
      score += 6;
    }
  
    return Math.min(100, score);
  }
  
  function scoreCityFit(station: ChargingStation) {
    const speed = scoreSpeed(station.speed);
    const availability = scoreAvailability(station.availability);
  
    let score = 45;
    if (parseNumeric(station.distance) <= 3) score += 12;
    if (speed >= 70) score += 18;
    score += availability >= 72 ? 10 : 4;
  
    return Math.min(100, score);
  }
  
  function scoreHighwayFit(station: ChargingStation) {
    const speed = scoreSpeed(station.speed);
    const availability = scoreAvailability(station.availability);
  
    let score = 40;
    if (speed >= 84) score += 24;
    if (availability >= 72) score += 16;
    if (station.hours.includes("24/7")) score += 12;
    if (parseNumeric(station.distance) >= 4) score += 4;
  
    return Math.min(100, score);
  }
  
  function scoreRouteFit(station: ChargingStation) {
    const speed = scoreSpeed(station.speed);
    const availability = scoreAvailability(station.availability);
    const convenience = scoreConvenience(station);
  
    return Math.min(
      100,
      Math.round(speed * 0.45 + availability * 0.25 + convenience * 0.3)
    );
  }
  
  function scoreTrust(station: ChargingStation) {
    const availability = scoreAvailability(station.availability);
    const convenience = scoreConvenience(station);
    const price = scorePrice(station.price);
  
    return Math.min(
      100,
      Math.round(availability * 0.4 + convenience * 0.35 + price * 0.25)
    );
  }
  
  function valueLabel(score: number) {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    return "Low";
  }
  
  export function getChargingInsights(station: ChargingStation) {
    const speed = scoreSpeed(station.speed);
    const availability = scoreAvailability(station.availability);
    const convenience = scoreConvenience(station);
    const city = scoreCityFit(station);
    const highway = scoreHighwayFit(station);
    const route = scoreRouteFit(station);
    const trust = scoreTrust(station);
  
    const score = Math.max(
      1,
      Math.min(
        100,
        Math.round(
          speed * 0.28 +
            availability * 0.18 +
            convenience * 0.16 +
            route * 0.18 +
            trust * 0.2
        )
      )
    );
  
    const confidence = Math.max(
      1,
      Math.min(100, Math.round(score * 0.9 + availability * 0.1))
    );
  
    const bestFor = [
      speed >= 84 ? "Fast top-ups" : null,
      city >= 60 ? "City charging" : null,
      highway >= 60 ? "Highway stops" : null,
      station.hours.includes("24/7") ? "Any-time users" : null,
    ].filter(Boolean) as string[];
  
    const verdict =
      score >= 85
        ? "A very strong charging stop with excellent real-world usefulness."
        : score >= 70
          ? "A solid charging option for most EV users."
          : score >= 55
            ? "A practical stop, best used in the right context."
            : "A more selective charging option that may suit only specific trips.";
  
    const ownership = [
      { label: "Charging speed", value: valueLabel(speed) },
      { label: "Availability", value: valueLabel(availability) },
      { label: "Route confidence", value: valueLabel(route) },
      { label: "Trust factor", value: valueLabel(trust) },
      { label: "City fit", value: valueLabel(city) },
      { label: "Highway fit", value: valueLabel(highway) },
    ];
  
    return {
      score,
      confidence,
      bestFor,
      verdict,
      ownership,
    };
  }