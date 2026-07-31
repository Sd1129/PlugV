export type Vehicle = {
    slug: string;
    name: string;
    brand: string;
    type: string;
    range: string;
    price: string;
    charging: string;
    status: string;
    launched: boolean;
    battery: string;
    drivetrain: string;
    seats: string;
  };
  
  export const vehicles: Vehicle[] = [
    {
      slug: "tata-nexon-ev",
      name: "Tata Nexon EV",
      brand: "Tata Motors",
      type: "SUV",
      range: "465 km",
      price: "₹14.49 lakh",
      charging: "56 min fast charge",
      status: "Best Seller",
      launched: true,
      battery: "40.5 kWh",
      drivetrain: "FWD",
      seats: "5",
    },
    {
      slug: "tata-punch-ev",
      name: "Tata Punch EV",
      brand: "Tata Motors",
      type: "SUV",
      range: "421 km",
      price: "₹10.99 lakh",
      charging: "56 min fast charge",
      status: "Popular",
      launched: true,
      battery: "35 kWh",
      drivetrain: "FWD",
      seats: "5",
    },
    {
      slug: "mahindra-xuv400",
      name: "Mahindra XUV400",
      brand: "Mahindra",
      type: "SUV",
      range: "456 km",
      price: "₹15.49 lakh",
      charging: "50 min fast charge",
      status: "Available",
      launched: true,
      battery: "39.4 kWh",
      drivetrain: "FWD",
      seats: "5",
    },
    {
      slug: "mg-windsor-ev",
      name: "MG Windsor EV",
      brand: "MG",
      type: "Crossover",
      range: "331 km",
      price: "₹13.99 lakh",
      charging: "55 min fast charge",
      status: "New",
      launched: true,
      battery: "38 kWh",
      drivetrain: "FWD",
      seats: "5",
    },
    {
      slug: "byd-atto-3",
      name: "BYD Atto 3",
      brand: "BYD",
      type: "SUV",
      range: "521 km",
      price: "₹24.99 lakh",
      charging: "50 min fast charge",
      status: "Premium",
      launched: true,
      battery: "60.48 kWh",
      drivetrain: "FWD",
      seats: "5",
    },
    {
      slug: "hyundai-kona-electric",
      name: "Hyundai Kona Electric",
      brand: "Hyundai",
      type: "SUV",
      range: "452 km",
      price: "₹23.84 lakh",
      charging: "57 min fast charge",
      status: "Available",
      launched: true,
      battery: "39.2 kWh",
      drivetrain: "FWD",
      seats: "5",
    },
  ];