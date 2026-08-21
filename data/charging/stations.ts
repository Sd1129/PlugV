import type { ChargingStation } from "./types";

import { hyderabadStations } from "./hyderabad";
import { kurnoolStations } from "./kurnool";
import { anantapurStations } from "./anantapur";
import { bengaluruStations } from "./bengaluru";
import { mumbaiStations } from "./mumbai";
import { newDelhiStations } from "./new-delhi";
import { puneStations } from "./pune";
import { chennaiStations } from "./chennai";
import { ahmedabadStations } from "./ahmedabad";
import { jaipurStations } from "./jaipur";
import { beeOfficialStations } from "./bee-official";

export type { ChargingStation };

const allChargingStations: ChargingStation[] = [
  ...hyderabadStations,
  ...kurnoolStations,
  ...anantapurStations,
  ...bengaluruStations,
  ...mumbaiStations,
  ...newDelhiStations,
  ...puneStations,
  ...chennaiStations,
  ...ahmedabadStations,
  ...jaipurStations,
  ...beeOfficialStations,
];

const seenStationLocations = new Set<string>();
export const chargingStations: ChargingStation[] = allChargingStations.filter((station) => {
  const key = `${station.latitude.toFixed(4)}:${station.longitude.toFixed(4)}`;
  if (seenStationLocations.has(key)) return false;
  seenStationLocations.add(key);
  return true;
});

export const states = Array.from(
  new Set(chargingStations.map((station) => station.state))
).sort();

export function getCitiesByState(state: string) {
  return Array.from(
    new Set(
      chargingStations
        .filter((station) => station.state === state)
        .map((station) => station.city)
    )
  ).sort();
}

export function getStationsByStateAndCity(state: string, city: string) {
  return chargingStations.filter(
    (station) => station.state === state && station.city === city
  );
}

export function getStationsByCity(city: string) {
  return chargingStations.filter((station) => station.city === city);
}
