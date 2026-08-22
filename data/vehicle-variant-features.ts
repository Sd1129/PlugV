const featuresByVehicle: Record<string, Record<string, string[]>> = {
  "tata-tiago-ev": {
    "Smart 19 (Medium Range)": [
      "6 airbags as standard",
      "Fully automatic temperature control",
      "Digital Island instrument cluster",
      "Multi-mode regenerative braking",
      "iRA.ev connected-car features",
    ],
    "Pure Plus 19 (Medium Range)": [
      "All four power windows",
      "Wireless Android Auto and Apple CarPlay",
      "Electrically adjustable ORVMs with turn indicators",
      "6 airbags as standard",
      "Fully automatic temperature control",
    ],
    "Pure Plus 24 (Long Range)": [
      "All four power windows",
      "Wireless Android Auto and Apple CarPlay",
      "Electrically adjustable ORVMs with turn indicators",
      "6 airbags as standard",
      "Lifetime HV battery warranty eligibility for the first private owner, subject to Tata.ev terms",
    ],
    "Creative Plus 24 (Long Range)": [
      "26.03 cm HD touchscreen infotainment",
      "360-degree surround-view camera and blind-view monitor",
      "Electronic stability control, traction control and hill-hold control",
      "LED DRLs and Lux Beam LED headlamps",
      "Cruise control and passive entry/passive start",
      "Lifetime HV battery warranty eligibility for the first private owner, subject to Tata.ev terms",
    ],
  },
};

export function getVariantFeatures(slug: string, variantName: string) {
  return featuresByVehicle[slug]?.[variantName] ?? [];
}
