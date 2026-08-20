import type { ChargingStation } from "./types";

export const kurnoolStations: ChargingStation[] = [
  {
    id: "kurnool-statiq-athidhi-44-drive-in-station",
    name: "Statiq Athidhi 44 Drive-in Station",
    operator: "Statiq",
    state: "Andhra Pradesh",
    city: "Kurnool",
    address: "Kurnool Road, Kurnool, Andhra Pradesh 509128, India",
    latitude: 15.8281,
    longitude: 78.0373,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Statiq+Athidhi+44+Drive-in+Station+Kurnool",
    connectors: {
      ccs2: true,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: false,
      dcFast: true,
      maxPowerKW: 120,
    },
    amenities: ["Restroom", "Cafe", "Wifi", "24x7"],
    reviewRating: 4.65,
    reviewCount: 3705,
    lastChecked: "2026-08-10",
    reviewSource: "community",
  },
  {
    id: "kurnool-hpcl-kvr-petromart",
    name: "HPCL Kvr petromart",
    operator: "HPCL",
    state: "Andhra Pradesh",
    city: "Kurnool",
    address: "Madhavi Nagar, Kurnool, Andhra Pradesh 518002, India",
    latitude: 15.8263,
    longitude: 78.0432,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=HPCL+Kvr+petromart+Kurnool",
    connectors: {
      ccs2: true,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: false,
      dcFast: true,
      maxPowerKW: 60,
    },
    amenities: ["24x7"],
    reviewRating: 5,
    reviewCount: 1,
    lastChecked: "2026-08-10",
    reviewSource: "community",
  },
];