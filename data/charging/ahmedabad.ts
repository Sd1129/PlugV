import type { ChargingStation } from "./types";

export const ahmedabadStations: ChargingStation[] = [
  {
    id: "ahmedabad-itc-narmada-001",
    name: "Statiq ITC Narmada Station",
    operator: "Statiq",
    state: "Gujarat",
    city: "Ahmedabad",
    address:
      "Right side of Exit Gate, ITC Narmada, Survey #104 A, Judges Bunglow Rd, I I M, Vastrapur, Ahmedabad, Gujarat 380015, India",
    latitude: 23.025,
    longitude: 72.516,
    openingHours: "Open 24 hours",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Statiq+ITC+Narmada+Station+Ahmedabad",
    connectors: { ccs2: true, chademo: false, acType2: false },
    charging: { ac: false, dcFast: true, maxPowerKW: 120 },
    amenities: ["Fast Charging", "Restroom"],
  },
  {
    id: "ahmedabad-riya-autolink-001",
    name: "Tata Power- Riya Autolink EV Charging Station",
    operator: "Tata Power",
    state: "Gujarat",
    city: "Ahmedabad",
    address: "Ahmedabad, Gujarat",
    latitude: 23.022,
    longitude: 72.571,
    openingHours: "Open 24 hours",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tata+Power+Riya+Autolink+EV+Charging+Station+Ahmedabad",
    connectors: { ccs2: true, chademo: false, acType2: true },
    charging: { ac: true, dcFast: true, maxPowerKW: 60 },
    amenities: ["Fast Charging", "Parking", "24x7"],
  },
  {
    id: "ahmedabad-supernova-001",
    name: "Tata power- Supernova EV Charging Station",
    operator: "Tata Power",
    state: "Gujarat",
    city: "Ahmedabad",
    address: "Ahmedabad, Gujarat",
    latitude: 23.030,
    longitude: 72.530,
    openingHours: "Open 24 hours",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tata+power+Supernova+EV+Charging+Station+Ahmedabad",
    connectors: { ccs2: true, chademo: false, acType2: true },
    charging: { ac: true, dcFast: true, maxPowerKW: 60 },
    amenities: ["Fast Charging", "Parking"],
  },
  {
    id: "ahmedabad-glida-mg-001",
    name: "GLIDA MG Ahmedabad EV Charging Station",
    operator: "GLIDA",
    state: "Gujarat",
    city: "Ahmedabad",
    address: "Ahmedabad, Gujarat",
    latitude: 23.028,
    longitude: 72.540,
    openingHours: "Open 24 hours",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=GLIDA+MG+Ahmedabad+EV+Charging+Station",
    connectors: { ccs2: true, chademo: false, acType2: true },
    charging: { ac: true, dcFast: true, maxPowerKW: 60 },
    amenities: ["Fast Charging", "Parking"],
  },
];