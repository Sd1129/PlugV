export type KnowledgeSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type KnowledgeArticle = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: "Costs" | "Buying" | "Charging" | "Policy" | "Ownership" | "Rankings";
  readTime: string;
  updatedAt: string;
  intro: string;
  sections: KnowledgeSection[];
  faqs: { question: string; answer: string }[];
  sources?: { label: string; url: string }[];
  calculator?: "five-year" | "tco";
};

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: "ev-vs-petrol-5-year-cost-comparison",
    title: "EV vs Petrol: 5-Year Cost Comparison for India",
    shortTitle: "EV vs Petrol: 5-Year Cost",
    description: "Calculate and understand the five-year cost difference between an electric car and a petrol car in India using your own driving and energy assumptions.",
    category: "Costs",
    readTime: "8 min",
    updatedAt: "2026-08-28",
    intro: "An EV can cost more to buy but less to run. The useful question is not which fuel is always cheaper—it is which vehicle costs less for your mileage, charging mix, ownership period and financing situation.",
    calculator: "five-year",
    sections: [
      { heading: "What the comparison includes", bullets: ["Purchase price and one-time costs", "Electricity or petrol used over five years", "Routine maintenance assumptions", "Insurance and annual ownership costs", "Estimated resale value at the end of the period"] },
      { heading: "The inputs that change the answer most", paragraphs: ["Annual kilometres and home-charging access usually have the greatest influence. A driver covering 20,000 km per year can recover an EV price premium much faster than a driver covering 5,000 km.", "Public fast charging may cost substantially more than home charging, so use a realistic blended electricity rate rather than the lowest domestic tariff."] },
      { heading: "How to interpret the result", paragraphs: ["A lower five-year cost does not automatically make a vehicle the right choice. Check practical range, charging access, loan cost, warranty, service reach and the exact variant before deciding."] },
    ],
    faqs: [
      { question: "Does the calculator include loan interest?", answer: "The first release compares purchase and operating costs. Add financing costs separately because rates, down payments and tenures vary by buyer." },
      { question: "Are electricity and petrol prices fixed?", answer: "No. Enter the prices you actually expect to pay. The result is a planning estimate, not a quotation." },
    ],
  },
  {
    slug: "ev-subsidies-incentives-by-state-india",
    title: "EV Subsidies and Incentives by State in India: Verification Guide",
    shortTitle: "EV Subsidies by State",
    description: "Understand Indian EV incentive types and learn how to verify current state benefits, road-tax treatment and eligibility before buying an electric car.",
    category: "Policy",
    readTime: "9 min",
    updatedAt: "2026-08-28",
    intro: "EV incentives in India are not one permanent national discount. Eligibility can depend on vehicle category, policy validity, registration date, price caps, battery criteria and remaining state allocation.",
    sections: [
      { heading: "Start with the vehicle category", paragraphs: ["Do not assume an incentive for electric two-wheelers also applies to private electric cars. The current PM E-DRIVE framework focuses demand incentives on specified categories and charging infrastructure; buyers should verify the exact eligible category on the official portal."] },
      { heading: "State benefits to check", bullets: ["Purchase incentive or early-bird cap", "Road-tax exemption or reduction", "Registration-fee treatment", "Scrappage-linked benefit", "Interest subsidy or reimbursement", "Residential charging or electricity-tariff support"] },
      { heading: "How to verify your state", bullets: ["Open your state transport or EV-policy portal", "Confirm the policy validity date and vehicle category", "Check price, battery and registration caps", "Ask the dealer to show the benefit separately on the quotation", "Save the notification and acknowledgement used for your application"] },
      { heading: "Why PlugV does not publish an unqualified subsidy amount", paragraphs: ["A stale subsidy number can change a purchase decision. PlugV therefore treats incentive values as time-sensitive and directs users to the governing notification or portal before presenting a benefit as available."] },
    ],
    faqs: [
      { question: "Do all private electric cars receive a central subsidy?", answer: "No. Central schemes define eligible vehicle categories and conditions. Verify the current PM E-DRIVE rules and the exact vehicle category before assuming a benefit." },
      { question: "Can road-tax benefits change?", answer: "Yes. State governments can revise policy periods, caps and eligibility. Confirm the rule applicable on your registration date." },
    ],
    sources: [
      { label: "PM E-DRIVE — Ministry of Heavy Industries", url: "https://pmedrive.heavyindustries.gov.in/" },
      { label: "Electric Vehicle Incentives — NITI Aayog e-AMRIT", url: "https://e-amrit.niti.gov.in/electric-vehicle-incentives" },
    ],
  },
  {
    slug: "how-to-choose-your-first-electric-car-india",
    title: "How to Choose Your First Electric Car in India",
    shortTitle: "Your First EV: Beginner’s Guide",
    description: "A practical beginner’s guide to choosing an electric car in India based on daily distance, charging access, range, budget and ownership needs.",
    category: "Buying",
    readTime: "10 min",
    updatedAt: "2026-08-28",
    intro: "The best first EV is not automatically the model with the longest claimed range. It is the vehicle that covers your routine comfortably, charges where you live and travel, and remains affordable after insurance and installation costs.",
    sections: [
      { heading: "1. Measure your real weekly travel", paragraphs: ["Use a normal week, not your shortest commute. Include school runs, office travel, weekend errands and an occasional longer journey."] },
      { heading: "2. Confirm charging before choosing the car", bullets: ["Dedicated parking and sanctioned electrical load", "Socket, earthing and installer assessment", "Apartment or landlord permission", "Reliable public alternatives near home and work"] },
      { heading: "3. Add a practical range buffer", paragraphs: ["Claimed range is measured under a test procedure. Keep a buffer for speed, climate control, traffic, elevation, passengers, tyre pressure and battery ageing."] },
      { heading: "4. Compare the exact variant", bullets: ["Battery capacity and claimed range", "AC and DC charging limits", "Safety equipment", "Warranty and roadside assistance", "Service reach", "On-road price and finance cost"] },
      { heading: "5. Test the complete ownership journey", paragraphs: ["During the test drive, check rear-seat comfort, visibility, charging-port placement and the manufacturer app. Ask the dealer to demonstrate charging and provide written warranty terms."] },
    ],
    faqs: [
      { question: "How much range should my first EV have?", answer: "There is no universal minimum. Choose enough practical range for your routine plus a comfortable buffer and a workable charging plan." },
      { question: "Is home charging essential?", answer: "It is not mandatory, but dependable overnight charging makes ownership simpler and often cheaper. Buyers without it should validate reliable alternatives before purchase." },
    ],
  },
  {
    slug: "home-charging-vs-public-charging-india",
    title: "EV Charging in India: Home vs Public Charging",
    shortTitle: "Home vs Public Charging",
    description: "Compare home and public EV charging in India across cost, speed, convenience, installation and everyday reliability.",
    category: "Charging",
    readTime: "8 min",
    updatedAt: "2026-08-28",
    intro: "Most owners benefit from using home charging for routine energy and public fast charging for longer journeys. The right mix depends on parking, electrical capacity, tariff and travel pattern.",
    sections: [
      { heading: "Home charging", bullets: ["Usually the most convenient option for overnight charging", "Cost depends on your electricity tariff and charging losses", "Requires safe wiring, earthing and an installer assessment", "Apartment permission and load enhancement may be necessary"] },
      { heading: "Public charging", bullets: ["Useful during intercity travel and for owners without private parking", "DC fast charging can reduce stop duration", "Pricing, uptime, access and connector availability vary", "Operator apps may be required to start or pay for a session"] },
      { heading: "Build a resilient charging routine", paragraphs: ["Keep more than one compatible charger option for important journeys. Check the operator app shortly before arrival, and do not treat a directory listing as a guarantee that a bay is free or operational."] },
    ],
    faqs: [
      { question: "Is public fast charging always faster?", answer: "The charger may be capable of high output, but the vehicle controls the power it accepts. Battery temperature, state of charge and shared power can also reduce speed." },
      { question: "Can I use a normal socket?", answer: "Only follow the vehicle manufacturer and qualified installer guidance. Electrical capacity, earthing, protection and connector requirements must be assessed for safe regular charging." },
    ],
  },
  {
    slug: "electric-car-total-cost-of-ownership-calculator-india",
    title: "Electric Car Total Cost of Ownership Calculator India",
    shortTitle: "EV TCO Calculator",
    description: "Estimate an electric car’s total cost of ownership in India using purchase price, electricity, annual driving, maintenance, insurance and resale assumptions.",
    category: "Costs",
    readTime: "7 min",
    updatedAt: "2026-08-28",
    intro: "Total cost of ownership turns a vehicle’s price tag into an ownership estimate. It is most useful when every assumption is visible and adjustable.",
    calculator: "tco",
    sections: [
      { heading: "What TCO means", paragraphs: ["TCO combines upfront cost, energy, maintenance, insurance and expected resale value over a chosen ownership period. It does not predict the future; it makes your assumptions comparable."] },
      { heading: "Use conservative assumptions", bullets: ["Use a blended electricity rate if you rely on public charging", "Use the exact variant’s consumption where available", "Include charger installation or electrical upgrades", "Do not assume an unusually high resale value", "Compare equivalent insurance cover"] },
    ],
    faqs: [
      { question: "Is depreciation included?", answer: "The calculator uses your expected resale value to represent the value remaining at the end of ownership." },
      { question: "Is this an on-road quotation?", answer: "No. It is an educational planning estimate. Obtain final prices, taxes, insurance and finance terms before purchasing." },
    ],
  },
  {
    slug: "electric-car-myths-vs-facts-india",
    title: "Electric Car Myths vs Facts in India",
    shortTitle: "EV Myths vs Facts",
    description: "Clear, practical answers to common electric-car myths about batteries, charging, rain, range, cost and long-distance travel in India.",
    category: "Ownership",
    readTime: "9 min",
    updatedAt: "2026-08-28",
    intro: "EV discussions often replace one exaggeration with another. The reality depends on the vehicle, charging environment and user—not a universal slogan.",
    sections: [
      { heading: "Myth: Every EV delivers its claimed range", paragraphs: ["Fact: certified range is a standardised comparison figure. Real use changes with speed, traffic, temperature, elevation, load, tyres and climate control."] },
      { heading: "Myth: EVs cannot be driven in rain", paragraphs: ["Fact: road-legal vehicles are engineered and tested for normal weather exposure. Owners must still follow the manufacturer’s safety guidance and avoid floodwater, just as with any car."] },
      { heading: "Myth: Fast charging is always equally fast", paragraphs: ["Fact: charging follows a curve. Vehicles normally reduce power as the battery fills, and output can vary with temperature, charger capability and shared load."] },
      { heading: "Myth: An EV is automatically cheaper for everyone", paragraphs: ["Fact: running cost can be lower, but purchase price, annual kilometres, charging tariff, insurance, finance and resale assumptions determine the ownership result."] },
      { heading: "Myth: EVs cannot travel between cities", paragraphs: ["Fact: many routes are practical, but success depends on usable range, compatible chargers, backup stops and current operator status."] },
    ],
    faqs: [
      { question: "Does an EV battery need replacement after a few years?", answer: "Battery ageing is gradual and varies by chemistry, temperature, charging behaviour and use. Review the manufacturer’s battery warranty and health conditions for the exact model." },
      { question: "Are EVs maintenance-free?", answer: "No. EVs have fewer routine powertrain service items, but tyres, brakes, suspension, cooling, filters and other components still require inspection and maintenance." },
    ],
  },
  {
    slug: "top-electric-cars-by-category-india",
    title: "Top Electric Cars by Category in India",
    shortTitle: "Top EVs by Category",
    description: "Explore launched electric cars in India by category, including SUVs, hatchbacks, sedans, MPVs, premium EVs and long-range choices.",
    category: "Rankings",
    readTime: "6 min",
    updatedAt: "2026-08-28",
    intro: "There is no single best EV for every buyer. PlugV groups launched vehicles by practical category and shows comparable catalogue information so you can create your own shortlist.",
    sections: [
      { heading: "How this list is organised", paragraphs: ["Vehicles are grouped using PlugV’s launched catalogue. Within each category, longer claimed range is used as a transparent discovery order—not as an overall quality score or paid ranking."] },
      { heading: "Before choosing from a category", bullets: ["Compare the exact variant", "Check the range certification method", "Confirm AC and DC charging capability", "Review seating, boot space and safety equipment", "Verify final on-road price and delivery availability"] },
    ],
    faqs: [
      { question: "Is the first vehicle a PlugV recommendation?", answer: "No. Ordering is based on available catalogue range data for discovery. It does not represent an overall verdict or paid ranking." },
      { question: "Why can a vehicle move in the list?", answer: "Catalogue details, model status and variants change. PlugV updates the list when verified source information changes." },
    ],
  },
];

export function getKnowledgeArticle(slug: string) {
  return knowledgeArticles.find((article) => article.slug === slug);
}
