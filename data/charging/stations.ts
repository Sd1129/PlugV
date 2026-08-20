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

export type { ChargingStation };

export const chargingStations: ChargingStation[] = [
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
];

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