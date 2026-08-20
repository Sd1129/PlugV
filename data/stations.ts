export type Station = {
    id: string;
    name: string;
    city: string;
    area: string;
    pinCode: string;
    network: string;
    speed: string;
    connectors: string[];
    reviewRating?: number;
    reviewCount?: number;
    lastChecked?: string;
    reviewSource?: "community" | "operator" | "plugv";
    availability: "Available" | "Busy" | "Limited";
    lat: number;
    lng: number;
  };
  
  export const stations: Station[] = [
    {
      id: "mumbai-nariman-point",
      name: "Tata Power EZ Charge - Nariman Point",
      city: "Mumbai",
      area: "Nariman Point",
      pinCode: "400021",
      network: "Tata Power EZ Charge",
      speed: "120 kW",
      connectors: ["CCS2", "Type 2"],
      availability: "Available",
      lat: 18.9256,
      lng: 72.8242,
    },
    {
      id: "delhi-connaught-place",
      name: "ChargeZone - Connaught Place",
      city: "Delhi",
      area: "Connaught Place",
      pinCode: "110001",
      network: "ChargeZone",
      speed: "150 kW",
      connectors: ["CCS2"],
      availability: "Busy",
      lat: 28.6315,
      lng: 77.2167,
    },
    {
      id: "bengaluru-indiranagar",
      name: "Statiq - Indiranagar",
      city: "Bengaluru",
      area: "Indiranagar",
      pinCode: "560038",
      network: "Statiq",
      speed: "60 kW",
      connectors: ["CCS2", "Type 2"],
      availability: "Available",
      lat: 12.9719,
      lng: 77.6412,
    },
    {
      id: "hyderabad-hitech-city",
      name: "Jio-bp pulse - Hitech City",
      city: "Hyderabad",
      area: "Hitech City",
      pinCode: "500081",
      network: "Jio-bp pulse",
      speed: "180 kW",
      connectors: ["CCS2"],
      availability: "Available",
      lat: 17.4452,
      lng: 78.3711,
    },
    {
      id: "chennai-egmore",
      name: "Shell Recharge - Egmore",
      city: "Chennai",
      area: "Egmore",
      pinCode: "600008",
      network: "Shell Recharge",
      speed: "100 kW",
      connectors: ["CCS2", "Type 2"],
      availability: "Limited",
      lat: 13.072,
      lng: 80.2575,
    },
    {
      id: "pune-koregaon-park",
      name: "Magenta ChargeGrid - Koregaon Park",
      city: "Pune",
      area: "Koregaon Park",
      pinCode: "411001",
      network: "Magenta ChargeGrid",
      speed: "75 kW",
      connectors: ["CCS2", "Type 2"],
      availability: "Available",
      lat: 18.5362,
      lng: 73.894,
    },
    {
      id: "ahmedabad-satellite",
      name: "Zeon Charging - Satellite",
      city: "Ahmedabad",
      area: "Satellite",
      pinCode: "380015",
      network: "Zeon Charging",
      speed: "120 kW",
      connectors: ["CCS2"],
      availability: "Available",
      lat: 23.0225,
      lng: 72.5714,
    },
    {
      id: "kochi-marine-drive",
      name: "Tata Power EZ Charge - Marine Drive",
      city: "Kochi",
      area: "Marine Drive",
      pinCode: "682011",
      network: "Tata Power EZ Charge",
      speed: "50 kW",
      connectors: ["CCS2", "Type 2"],
      availability: "Available",
      lat: 9.9312,
      lng: 76.2673,
    },
    {
      id: "jaipur-vaishali-nagar",
      name: "Statiq Fast Charge - Vaishali Nagar",
      city: "Jaipur",
      area: "Vaishali Nagar",
      pinCode: "302021",
      network: "Statiq",
      speed: "90 kW",
      connectors: ["CCS2"],
      availability: "Busy",
      lat: 26.9124,
      lng: 75.7873,
    },
    {
      id: "gurugram-cyber-hub",
      name: "ChargeZone - Cyber Hub",
      city: "Gurugram",
      area: "Cyber Hub",
      pinCode: "122002",
      network: "ChargeZone",
      speed: "150 kW",
      connectors: ["CCS2"],
      availability: "Available",
      lat: 28.4595,
      lng: 77.0266,
    },
  ];