import type { ChargingStation } from "./types";

export const hyderabadStations: ChargingStation[] = [
  {
    id: "hyderabad-ev-dock-banjara-hills",
    name: "EV DOCK Charging Station",
    operator: "EV DOCK",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Bhaskar Plaza, Prem Nagar, Banjara Hills, Hyderabad, Telangana 500034",
    latitude: 17.4138,
    longitude: 78.4483,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=EV+DOCK+Charging+Station+Banjara+Hills+Hyderabad",
    connectors: {
      ccs2: true,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: true,
      maxPowerKW: 60,
    },
    amenities: ["Fast Charging", "Parking", "24x7"],
  },

  {
    id: "hyderabad-masab-tank-public-ev",
    name: "Electric Vehicle Charging Station",
    operator: "Public EV",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Ambedkar Nagar, Masab Tank, Hyderabad, Telangana",
    latitude: 17.4003,
    longitude: 78.45,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Electric+Vehicle+Charging+Station+Masab+Tank+Hyderabad",
    connectors: {
      ccs2: true,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: true,
      maxPowerKW: 24,
    },
    amenities: ["Fast Charging", "Parking", "24x7"],
  },

  {
    id: "hyderabad-tata-power-somajiguda",
    name: "Tata Power Charging Station",
    operator: "Tata Power",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Greenlands Road, Nishat Bagh Colony, Somajiguda, Hyderabad, Telangana 500082",
    latitude: 17.4232,
    longitude: 78.4586,
    website: "https://www.tatapower.com",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Tata+Power+Charging+Station+Somajiguda+Hyderabad",
    connectors: {
      ccs2: true,
      chademo: true,
      acType2: false,
    },
    charging: {
      ac: false,
      dcFast: true,
      maxPowerKW: 25,
    },
    amenities: ["Fast Charging", "24x7"],
  },

  {
    id: "hyderabad-evnovator-somajiguda",
    name: "EV-novator Charging Station",
    operator: "EV-novator",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Banjara Hills Main Road, Erramanzil Colony, Somajiguda, Hyderabad, Telangana",
    latitude: 17.4219,
    longitude: 78.458,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=EV-novator+Charging+Station+Somajiguda+Hyderabad",
    connectors: {
      ccs2: true,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: false,
      dcFast: true,
      maxPowerKW: 90,
    },
    amenities: ["Fast Charging", "24x7"],
  },

  {
    id: "hyderabad-charge-and-drive-somajiguda",
    name: "Charge And Drive Charging Station",
    operator: "Charge & Drive",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Raj Bhavan Road, Somajiguda, Hyderabad, Telangana 500082",
    latitude: 17.4189,
    longitude: 78.462,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Charge+And+Drive+Charging+Station+Raj+Bhavan+Road+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: false,
      maxPowerKW: 10,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-bmw-central",
    name: "BMW Charging Station",
    operator: "BMW",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Banjara Hills, Hyderabad, Telangana",
    latitude: 17.4065,
    longitude: 78.4762,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=BMW+Charging+Station+Banjara+Hills+Hyderabad",
    connectors: {
      ccs2: true,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: true,
      maxPowerKW: 60,
    },
    amenities: ["Fast Charging", "24x7"],
  },

  {
    id: "hyderabad-glida-begumpet",
    name: "GLIDA Charging Station",
    operator: "GLIDA",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "IOC Begumpet, Uma Nagar, Begumpet, Hyderabad, Telangana",
    latitude: 17.4444,
    longitude: 78.4589,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=GLIDA+Charging+Station+Begumpet+Hyderabad",
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
    amenities: ["Fast Charging", "24x7"],
  },

  {
    id: "hyderabad-fortum-adikmet",
    name: "Fortum Charging Station",
    operator: "Fortum",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Osmania University Road, Adikmet, Hyderabad, Telangana 500044",
    latitude: 17.4017,
    longitude: 78.5032,
    website: "https://www.fortum.com",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Fortum+Charging+Station+Adikmet+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: false,
      maxPowerKW: 15,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-ather-grid-adikmet",
    name: "Ather Grid Charging Station",
    operator: "Ather Grid",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Vidya Nagar, Adikmet, Hyderabad, Telangana 500044",
    latitude: 17.4041,
    longitude: 78.5038,
    website: "https://www.atherenergy.com",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ather+Grid+Charging+Station+Adikmet+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: true,
      dcFast: false,
      maxPowerKW: 1.1,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-public-ev-ameerpet",
    name: "Electric Vehicle Charging Station",
    operator: "Public EV",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Leelanagar, Ameerpet, Hyderabad, Telangana 500016",
    latitude: 17.4372,
    longitude: 78.4487,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Electric+Vehicle+Charging+Station+Leelanagar+Ameerpet+Hyderabad",
    connectors: {
      ccs2: true,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: true,
      maxPowerKW: 24,
    },
    amenities: ["Fast Charging", "24x7"],
  },

  {
    id: "hyderabad-ather-grid-lakdikapul",
    name: "Ather Grid Charging Station",
    operator: "Ather Grid",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Lakdikapul Road, near Lakdikapul Metro, Hyderabad, Telangana 500004",
    latitude: 17.4066,
    longitude: 78.461,
    website: "https://www.atherenergy.com",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ather+Grid+Charging+Station+Lakdikapul+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: true,
      dcFast: false,
      maxPowerKW: 1.1,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-kazam-ameerpet",
    name: "Kazam Charging Station",
    operator: "Kazam",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Satyam Theatre Road, Ameerpet, Hyderabad, Telangana 500038",
    latitude: 17.4378,
    longitude: 78.4439,
    website: "https://www.kazam.in",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kazam+Charging+Station+Ameerpet+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: false,
      maxPowerKW: 3.3,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-ather-grid-abids",
    name: "Ather Grid Charging Station",
    operator: "Ather Grid",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Gun Foundry, Abids, Hyderabad, Telangana 500001",
    latitude: 17.3952,
    longitude: 78.4747,
    website: "https://www.atherenergy.com",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Ather+Grid+Charging+Station+Abids+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: true,
      dcFast: false,
      maxPowerKW: 1.1,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-sangeetha-himayatnagar",
    name: "Sangeetha Mobiles Charging Station",
    operator: "Sangeetha Mobiles",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Himayatnagar, Hyderabad, Telangana 500029",
    latitude: 17.4031,
    longitude: 78.48,
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Sangeetha+Mobiles+Charging+Station+Himayatnagar+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: true,
    },
    charging: {
      ac: true,
      dcFast: false,
      maxPowerKW: 3.3,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-charge-zone-kavadiguda",
    name: "Charge Zone Charging Station",
    operator: "Charge Zone",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Kavadiguda, Hyderabad, Telangana 500080",
    latitude: 17.4138,
    longitude: 78.4896,
    website: "https://www.chargezone.co",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Charge+Zone+Charging+Station+Kavadiguda+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: false,
      dcFast: false,
      maxPowerKW: 0,
    },
    amenities: ["24x7"],
  },

  {
    id: "hyderabad-boltearth-narayanguda",
    name: "Bolt.Earth Electric Vehicle Charging Station",
    operator: "Bolt.Earth",
    state: "Telangana",
    city: "Hyderabad",
    address:
      "Narayanguda, Hyderabad, Telangana 500029",
    latitude: 17.3942,
    longitude: 78.4882,
    website: "https://bolt.earth",
    openingHours: "Open 24x7",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Bolt.Earth+Electric+Vehicle+Charging+Station+Narayanguda+Hyderabad",
    connectors: {
      ccs2: false,
      chademo: false,
      acType2: false,
    },
    charging: {
      ac: false,
      dcFast: false,
      maxPowerKW: 0,
    },
    amenities: ["24x7"],
  },
];