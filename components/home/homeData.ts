export type CompareRow = {
    label: string;
    before: string;
    after: string;
  };
  
  export type FeaturedVehicle = {
    name: string;
    range: string;
    accel: string;
    platform: string;
    tone: string;
    accent: string;
  };
  
  export type FeatureBlock = {
    title: string;
    desc: string;
  };
  
  export type Testimonial = {
    quote: string;
    name: string;
    role: string;
  };
  
  export type UpcomingEV = {
    name: string;
    launch: string;
    note: string;
  };
  
  export const stats = [
    { value: "6+", label: "Launched EVs" },
    { value: "4+", label: "Upcoming EVs" },
    { value: "10+", label: "Charging points" },
  ];
  
  export const compareRows: CompareRow[] = [
    {
      label: "Discovery",
      before: "Scattered tabs and unclear paths",
      after: "A single premium flow to compare and decide",
    },
    {
      label: "Clarity",
      before: "Too much noise, not enough focus",
      after: "Key info first, details when needed",
    },
    {
      label: "Trust",
      before: "Hard to know what matters",
      after: "Confidence built into every section",
    },
    {
      label: "Action",
      before: "Slow handoff to the next step",
      after: "Clear CTA paths and faster decisions",
    },
  ];
  
  export const featuredVehicles: FeaturedVehicle[] = [
    {
      name: "Lucid Air Dream",
      range: "580 mi range",
      accel: "2.8s 0-60",
      platform: "900V architecture",
      tone: "Quiet luxury with long-range confidence.",
      accent: "from-sky-400/25 via-cyan-400/10 to-transparent",
    },
    {
      name: "Porsche Taycan",
      range: "318 mi range",
      accel: "2.4s 0-60",
      platform: "800V architecture",
      tone: "Performance-first with crisp road feel.",
      accent: "from-fuchsia-400/25 via-rose-400/10 to-transparent",
    },
    {
      name: "Rivian R1S",
      range: "410 mi range",
      accel: "3.0s 0-60",
      platform: "Dual-motor platform",
      tone: "Adventure-ready utility with three-row flexibility.",
      accent: "from-emerald-400/25 via-teal-400/10 to-transparent",
    },
  ];
  
  export const reasonBlocks: FeatureBlock[] = [
    {
      title: "Compare",
      desc: "See EVs side by side with the key details surfaced first.",
    },
    {
      title: "Discover",
      desc: "Find models that match your budget, use case, and style.",
    },
    {
      title: "Charge",
      desc: "Understand charging speed, range, and practical usability.",
    },
    {
      title: "Decide",
      desc: "Turn browsing into a clear next step with less friction.",
    },
    {
      title: "Plan",
      desc: "Track upcoming launches and time your purchase better.",
    },
    {
      title: "Trust",
      desc: "Feel confident with a calmer, more premium experience.",
    },
  ];
  
  export const testimonials: Testimonial[] = [
    {
      quote:
        "The new homepage feels much more intentional. It is easier to scan, easier to trust, and much closer to a premium product.",
      name: "Avery Chen",
      role: "Product Lead",
    },
    {
      quote:
        "The comparison section makes the value obvious immediately. It feels like a platform, not just a listings page.",
      name: "Jordan Patel",
      role: "EV Sales Manager",
    },
    {
      quote:
        "PlugV 2.0 turns EV discovery into something calm and structured. That makes the entire buying journey feel better.",
      name: "Morgan Rivera",
      role: "Operations Director",
    },
  ];
  
  export const upcomingEVs: UpcomingEV[] = [
    {
      name: "Tata Curvv EV",
      launch: "Q4 2026",
      note: "A sharp crossover with a more modern electric profile.",
    },
    {
      name: "Hyundai Creta EV",
      launch: "Early 2027",
      note: "A familiar nameplate moving into the electric mainstream.",
    },
    {
      name: "Mahindra XUV.e9",
      launch: "2027",
      note: "A premium electric SUV with a stronger road presence.",
    },
    {
      name: "Kia EV5",
      launch: "2027",
      note: "A balanced family EV with a clean, future-focused shape.",
    },
  ];