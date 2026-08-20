import type { ChargingStation } from "./types";

export const anantapurStations: ChargingStation[] = [
  {
    id: "anantapur-statiq-cubestop-anantpur-station",
    name: "Statiq Cubestop Anantpur Station",
    operator: "Statiq",
    state: "Andhra Pradesh",
    city: "Anantapur",
    address:
      "Land Survey No- 41, NH-44, Hyderabad Bengaluru Highway, 42/43, Village, Regatipalli, Anantapur, Andhra Pradesh 515672, India",
    latitude: 14.6818,
    longitude: 77.6475,

    openingHours: "Open 24x7",

    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Statiq+Cubestop+Anantpur+Station+Anantapur",

    connectors: {
      ccs2: true,
      chademo: false,
      acType2: false,
    },

    charging: {
      ac: false,
      dcFast: true,
      maxPowerKW: 240,
      reviewRating: 4.56,
      reviewCount: 394,
      lastChecked: "2026-08-10",
      reviewSource: "community",
    },

    amenities: [],
  },
];