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
  targetKeyword?: string;
  refreshCadence?: "monthly" | "quarterly" | "event-driven";
  vehicleList?: "under-15" | "under-10" | "cheapest" | "longest-range";
  relatedSlugs?: string[];
};

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: "how-to-buy-used-electric-car-india",
    title: "How to Buy a Used Electric Car in India: Complete Inspection Guide",
    shortTitle: "Buying a Used EV",
    description: "A practical India-focused checklist for checking a used electric car's documents, battery evidence, charging, warranty, condition, price and ownership transfer.",
    category: "Buying",
    readTime: "12 min",
    updatedAt: "2026-09-01",
    targetKeyword: "how to buy a used electric car in India",
    refreshCadence: "quarterly",
    relatedSlugs: ["how-to-sell-used-electric-car-india"],
    intro: "A used EV can offer strong value, but the battery, charging system, software history and remaining warranty need more evidence than a short test drive can provide. Use this checklist to verify the car—not merely the seller's claims—before paying or signing transfer documents.",
    sections: [
      { heading: "1. Confirm that the EV fits your life", bullets: ["Estimate your normal weekday distance and occasional highway journeys", "Confirm reliable overnight charging at home or work", "Check the exact variant's connector, AC charging rate and DC fast-charging support", "Keep a practical arrival reserve instead of planning around the full claimed range", "Compare insurance, service access and tyre costs—not only the asking price"] },
      { heading: "2. Verify the seller, vehicle and documents", bullets: ["Match the seller's identity with the Registration Certificate (RC)", "Match VIN/chassis and motor details with the vehicle and records", "Review insurance validity, claim history, service invoices and loan or hypothecation status", "Check pending challans and confirm that FASTag and connected-app access will be removed or transferred", "Do not pay the full amount until the agreed transfer documents and delivery record are ready"] },
      { heading: "3. Demand battery evidence", paragraphs: ["Do not infer battery health from age, odometer or the percentage shown on the dashboard. Ask an authorised service centre for the available diagnostic or battery-health report and confirm what the displayed metric actually measures."], bullets: ["Battery State of Health or equivalent diagnostic, with report date", "Cell imbalance, isolation or thermal-system fault history where the diagnostic exposes it", "Remaining battery and vehicle warranty, including transfer conditions", "Unexplained range loss, warning lights, repeated charging faults or battery repairs", "Flood, impact or underbody damage near the battery enclosure"] },
      { heading: "4. Test AC and DC charging", paragraphs: ["A normal drive does not prove that both charging paths work. Where practical, test the supplied portable or wall-box cable and complete a short compatible DC fast-charging session."], bullets: ["Charging starts without repeated connection errors", "Connector locks and releases correctly", "Displayed charging power is reasonable for battery temperature and state of charge", "Cable, inlet and pins show no melting, corrosion or physical damage", "Original charging cable, adapters and emergency accessories are included"] },
      { heading: "5. Inspect the whole car", bullets: ["Tyres: age, uneven wear, correct load rating and replacement cost", "Brakes and suspension: noise, vibration, pulling or corrosion from limited brake use", "Cooling and air-conditioning: stable cabin cooling and no battery-temperature warnings", "Body and underfloor: accident repairs, water ingress, rust and battery-shield damage", "12-volt battery, lights, cameras, ADAS, infotainment, keys and charge-port controls"] },
      { heading: "6. Run a repeatable test drive", paragraphs: ["Record the starting battery percentage, distance, traffic, average speed and climate-control use. Repeat the same observations at the end. This is only a short-trip efficiency check—not a certified battery-capacity test—but it can reveal abnormal consumption, warnings or drivability problems."], bullets: ["Test urban and faster-road driving where safe", "Check regenerative-braking modes and low-speed behaviour", "Listen for wheel-bearing, suspension or drivetrain noise", "Confirm navigation, mobile connectivity and all driver displays", "Arrange an independent or authorised inspection before a large payment"] },
      { heading: "7. Price the car using total ownership cost", paragraphs: ["Compare the used EV with the current transaction price of a similar new EV, not only its old launch price. New-car discounts, warranty coverage and finance rates can materially change the value gap."], bullets: ["Asking price and transfer costs", "Remaining warranty and expected tyre or 12-volt battery replacement", "Home charger installation or relocation", "Insurance renewal and loan cost", "Likely daily charging mix and electricity tariff"] },
      { heading: "8. Complete a safe ownership transfer", paragraphs: ["Parivahan identifies Forms 29 and 30 for transfer of ownership and states different reporting timelines for transfers within and outside a state. Requirements can vary by jurisdiction and transaction, so confirm the current checklist with the relevant registering authority before completing payment."], bullets: ["Record payment terms, odometer, accessories, keys and delivery time in writing", "Submit the prescribed transfer forms and supporting documents", "Obtain lender clearance when hypothecation is recorded", "Update insurance and retain acknowledgement or application references", "Confirm RC transfer completion rather than relying only on signed forms"] },
      { heading: "Walk away from these red flags", bullets: ["VIN, RC or seller identity does not match", "Battery or high-voltage warning is dismissed without a diagnostic", "Seller refuses an independent inspection or charging test", "Flood or severe underbody damage is suspected", "Outstanding finance, challans or transfer responsibility remains unclear", "Pressure to make an irreversible payment before documentation"] },
    ],
    faqs: [
      { question: "How can I verify a used EV battery?", answer: "Request the most recent available diagnostic from an authorised service centre, understand the metric being reported, review fault and repair history, and combine that evidence with charging tests and an inspection. Dashboard range alone is not a battery-health certificate." },
      { question: "Should I avoid every EV with a repaired battery?", answer: "Not automatically. Ask who performed the repair, which parts were replaced, whether warranty remains, and whether current diagnostics are clean. Avoid cars with undocumented high-voltage work or unresolved warnings." },
      { question: "Is a used EV always cheaper than a used petrol car?", answer: "No. The result depends on purchase price, annual kilometres, charging access, insurance, finance, battery and warranty condition, and resale value. Compare total ownership cost for the exact vehicles." },
      { question: "When should I pay the seller?", answer: "Use a written transaction plan that links payment, delivery, signed transfer documents and lender clearance. Confirm the current RTO requirements and use traceable payment methods." },
    ],
    sources: [
      { label: "Transfer of ownership guidance — Parivahan", url: "https://mparivahan.parivahan.gov.in/mstatic/english/rc-info-ownership.html" },
      { label: "Form 29: Notice of transfer of ownership — Parivahan", url: "https://parivahan.gov.in/parivahan/sites/default/files/DownloadForm/form%2029.pdf" },
      { label: "Form 30: Application for transfer of ownership — Parivahan", url: "https://parivahan.gov.in/parivahan/sites/default/files/DownloadForm/form%2030.pdf" },
      { label: "Official eChallan portal — Ministry of Road Transport and Highways", url: "https://echallan.parivahan.gov.in/" },
    ],
  },
  {
    slug: "how-to-sell-used-electric-car-india",
    title: "How to Sell a Used Electric Car in India: Documents, Battery Proof and Safe Transfer",
    shortTitle: "Selling a Used EV",
    description: "Prepare, price and safely sell a used electric car in India with clear battery evidence, charging records, documents and ownership-transfer steps.",
    category: "Ownership",
    readTime: "10 min",
    updatedAt: "2026-09-01",
    targetKeyword: "how to sell a used electric car in India",
    refreshCadence: "quarterly",
    relatedSlugs: ["how-to-buy-used-electric-car-india"],
    intro: "A used EV is easier to sell when the buyer can verify its condition. Clear battery evidence, complete charging accessories, service history and a documented transfer process reduce uncertainty and support a fairer conversation about price.",
    sections: [
      { heading: "1. Build a buyer-ready evidence pack", bullets: ["RC, insurance and owner identity details", "Service invoices, warranty terms and repair history", "Latest available battery diagnostic or health report", "Charging cable, wall-box details, keys and accessories", "Loan or hypothecation closure documents where applicable", "Records of major tyre, 12-volt battery or accident repairs"] },
      { heading: "2. Resolve issues before listing", paragraphs: ["A warning light, unreliable charging inlet or missing ownership document will create more distrust than a realistic asking price. Complete essential safety and charging repairs first and disclose material defects in writing."], bullets: ["Clear legitimate pending challans", "Check both AC and DC charging where supported", "Repair safety-critical tyre, brake, lighting or visibility issues", "Remove personal data from infotainment and connected services", "Prepare the vehicle for inspection without hiding faults"] },
      { heading: "3. Set an evidence-based asking price", paragraphs: ["Start with comparable cars of the same variant, model year, location, mileage and warranty position. Then compare against the current effective price of a new alternative. Do not assume an EV will retain more or less value than petrol or diesel solely because of its powertrain."], bullets: ["Exact variant and original invoice", "Battery and vehicle warranty remaining", "Diagnostic evidence and charging performance", "Service history, condition and accident record", "Tyres, charging equipment and transferable accessories", "Current new-EV discounts and finance offers"] },
      { heading: "4. Write a transparent listing", bullets: ["State the exact variant, registration year and odometer", "Separate manufacturer-claimed range from your observed usage", "Describe home and public charging experience without promising future performance", "Mention remaining warranty only after checking transfer terms", "Disclose known repairs or limitations", "Use your own current photos and hide sensitive document numbers"] },
      { heading: "5. Protect test drives and payment", bullets: ["Verify the driver's licence and accompany the test drive", "Meet in a safe location and avoid sharing original documents prematurely", "Use traceable banking channels and verify receipt independently", "Treat screenshots, payment links and requests for OTPs as unsafe", "Do not hand over the car, keys or signed originals until agreed cleared funds and documents are in place"] },
      { heading: "6. Complete transfer and delivery", paragraphs: ["Parivahan lists Forms 29 and 30 for ownership transfer and describes reporting timelines. Confirm the exact procedure, fees and supporting documents with the relevant registering authority because requirements can differ by state and transaction."], bullets: ["Record date, time, odometer, battery percentage, keys and accessories on a delivery note", "Submit the prescribed ownership-transfer documents", "Complete hypothecation termination or lender formalities where required", "Notify or transfer insurance as required by the insurer", "Retain acknowledgements and follow the application until the RC reflects the buyer"] },
      { heading: "7. Close digital and charging access", bullets: ["Remove the vehicle from the manufacturer's connected app only at the agreed handover stage", "Delete navigation history, addresses, contacts and paired phones", "Remove or transfer charging-network accounts without exposing stored payment methods", "Cancel or transfer FASTag in line with the provider's process", "Give the buyer manuals, charging guidance and emergency contacts"] },
      { heading: "EV versus petrol or diesel resale: the honest answer", paragraphs: ["There is no universal winner. A documented EV with healthy diagnostics, useful remaining warranty and complete charging equipment may reduce buyer uncertainty. Its resale can still be affected by new-model price cuts, battery-replacement concern, local demand and charging access. Petrol and diesel vehicles have different fuel, maintenance, regulatory and demand risks. Compare real offers for the exact vehicles instead of using a powertrain-wide claim."] },
    ],
    faqs: [
      { question: "Do I need a battery-health report to sell my EV?", answer: "It may not be a universal legal requirement, but a recent available diagnostic from an authorised service centre can materially improve buyer confidence. Explain exactly what the report measures." },
      { question: "Can I promise the range I normally see?", answer: "No. Share it as an observed result with route, speed, weather and climate-control context. Range varies by driver and conditions." },
      { question: "Should I sell privately or through a dealer?", answer: "A private sale may offer a higher price but requires screening, test-drive management, payment checks and transfer follow-up. A dealer may simplify the process but offer less. Obtain multiple written offers and compare net proceeds and responsibility." },
      { question: "When is the sale complete?", answer: "Physical delivery alone is not enough. Follow the prescribed ownership-transfer process and retain proof until the registration record reflects the buyer." },
    ],
    sources: [
      { label: "Transfer of ownership guidance — Parivahan", url: "https://mparivahan.parivahan.gov.in/mstatic/english/rc-info-ownership.html" },
      { label: "Form 29: Notice of transfer of ownership — Parivahan", url: "https://parivahan.gov.in/parivahan/sites/default/files/DownloadForm/form%2029.pdf" },
      { label: "Form 30: Application for transfer of ownership — Parivahan", url: "https://parivahan.gov.in/parivahan/sites/default/files/DownloadForm/form%2030.pdf" },
      { label: "Official eChallan portal — Ministry of Road Transport and Highways", url: "https://echallan.parivahan.gov.in/" },
    ],
  },
  {
    slug: "ev-vs-petrol-5-year-cost-comparison",
    title: "EV vs Petrol: 5-Year Cost Comparison for India",
    shortTitle: "EV vs Petrol: 5-Year Cost",
    description: "Calculate and understand the five-year cost difference between an electric car and a petrol car in India using your own driving and energy assumptions.",
    category: "Costs",
    readTime: "8 min",
    updatedAt: "2026-08-29",
    targetKeyword: "EV vs petrol 5 year cost comparison India",
    refreshCadence: "quarterly",
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
    sources: [
      { label: "EV charging consumer guidance — Bureau of Energy Efficiency", url: "https://www.beeindia.gov.in/view_content.php?lang=1&lid=589" },
      { label: "EV Charging Infrastructure Guidelines — Ministry of Power", url: "https://powermin.gov.in/sites/default/files/uploads/RS10122024_Eng.pdf" },
    ],
  },
  {
    slug: "ev-subsidies-incentives-by-state-india",
    title: "EV Subsidies and Incentives in India (2026): State-wise Verification Guide",
    shortTitle: "EV Subsidies by State",
    description: "Understand Indian EV incentive types and learn how to verify current state benefits, road-tax treatment and eligibility before buying an electric car.",
    category: "Policy",
    readTime: "9 min",
    updatedAt: "2026-08-29",
    targetKeyword: "EV subsidies and incentives in India 2026",
    refreshCadence: "event-driven",
    intro: "EV incentives in India are not one permanent national discount. Eligibility can depend on vehicle category, policy validity, registration date, price caps, battery criteria and remaining state allocation.",
    sections: [
      { heading: "Start with the vehicle category", paragraphs: ["Do not assume an incentive for electric two-wheelers also applies to private electric cars. As reviewed on 29 August 2026, the official PM E-DRIVE eligible-category list covers e-2Ws, e-3Ws, e-ambulances, e-trucks, e-buses, charging infrastructure and testing-agency upgrades; it does not list private electric passenger cars for a central demand incentive. Always re-check the portal and the state rule applicable on the registration date."] },
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
      { label: "PM E-DRIVE scheme notifications — Ministry of Heavy Industries", url: "https://pmedrive.heavyindustries.gov.in/policy_document" },
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
    updatedAt: "2026-08-29",
    targetKeyword: "how to choose first electric car India",
    refreshCadence: "quarterly",
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
    sources: [
      { label: "EV consumer guidance — Bureau of Energy Efficiency", url: "https://www.beeindia.gov.in/view_content.php?lang=1&lid=589" },
      { label: "EV incentives portal — NITI Aayog e-AMRIT", url: "https://e-amrit.niti.gov.in/electric-vehicle-incentives" },
    ],
  },
  {
    slug: "home-charging-vs-public-charging-india",
    title: "EV Charging in India: Home vs Public Charging",
    shortTitle: "Home vs Public Charging",
    description: "Compare home and public EV charging in India across cost, speed, convenience, installation and everyday reliability.",
    category: "Charging",
    readTime: "8 min",
    updatedAt: "2026-08-29",
    targetKeyword: "home charging vs public charging India",
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
    sources: [
      { label: "EV Charging Infrastructure Guidelines — Ministry of Power", url: "https://powermin.gov.in/sites/default/files/uploads/RS10122024_Eng.pdf" },
      { label: "EV charging consumer guidance — Bureau of Energy Efficiency", url: "https://www.beeindia.gov.in/view_content.php?lang=1&lid=589" },
    ],
  },
  {
    slug: "electric-car-total-cost-of-ownership-calculator-india",
    title: "Electric Car Total Cost of Ownership Calculator India",
    shortTitle: "EV TCO Calculator",
    description: "Estimate an electric car’s total cost of ownership in India using purchase price, electricity, annual driving, maintenance, insurance and resale assumptions.",
    category: "Costs",
    readTime: "7 min",
    updatedAt: "2026-08-29",
    targetKeyword: "electric car total cost of ownership calculator India",
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
    sources: [
      { label: "EV charging consumer guidance — Bureau of Energy Efficiency", url: "https://www.beeindia.gov.in/view_content.php?lang=1&lid=589" },
    ],
  },
  {
    slug: "electric-car-myths-vs-facts-india",
    title: "Electric Car Myths vs Facts in India",
    shortTitle: "EV Myths vs Facts",
    description: "Clear, practical answers to common electric-car myths about batteries, charging, rain, range, cost and long-distance travel in India.",
    category: "Ownership",
    readTime: "9 min",
    updatedAt: "2026-08-29",
    targetKeyword: "electric car myths vs facts India",
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
    sources: [
      { label: "EV consumer guidance — Bureau of Energy Efficiency", url: "https://www.beeindia.gov.in/view_content.php?lang=1&lid=589" },
      { label: "EV Charging Infrastructure Guidelines — Ministry of Power", url: "https://powermin.gov.in/sites/default/files/uploads/RS10122024_Eng.pdf" },
    ],
  },
  {
    slug: "top-electric-cars-by-category-india",
    title: "Top Electric Cars by Category in India",
    shortTitle: "Top EVs by Category",
    description: "Explore launched electric cars in India by category, including SUVs, hatchbacks, sedans, MPVs, premium EVs and long-range choices.",
    category: "Rankings",
    readTime: "6 min",
    updatedAt: "2026-08-29",
    targetKeyword: "top electric cars by category India",
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
  {
    slug: "cost-to-charge-electric-car-india-2026",
    title: "How Much Does It Cost to Charge an EV in India in 2026?",
    shortTitle: "EV Charging Cost in India",
    description: "Calculate EV charging cost in India using battery size, electricity tariff, charging losses and the difference between home and public charging.",
    category: "Costs",
    readTime: "8 min",
    updatedAt: "2026-08-29",
    targetKeyword: "how much does it cost to charge an EV in India 2026",
    refreshCadence: "quarterly",
    intro: "There is no single nationwide EV charging price. Your cost depends on the usable energy added, charging losses, your home electricity slab or the operator tariff, taxes and any session or parking fee.",
    sections: [
      { heading: "The calculation", paragraphs: ["Estimated session cost = energy drawn from the meter × applicable tariff. If a car receives 30 kWh and charging losses are 12%, the meter may supply about 33.6 kWh. Multiply that figure by your actual tariff."], bullets: ["Home: use the marginal electricity rate on your bill, not an assumed national average", "Public AC/DC: use the operator-app tariff displayed before starting", "Add parking, idle, subscription or session fees when applicable", "Divide total session cost by kilometres added to compare running cost"] },
      { heading: "Home charging", paragraphs: ["Residential owners may use an existing connection or seek a separately metered EV connection subject to the local distribution licensee’s requirements. Electricity tariffs remain state- and slab-specific, so PlugV does not publish one universal home-charging rate."] },
      { heading: "Public charging", paragraphs: ["The Ministry of Power guidelines regulate the electricity-supply framework and charging-service fees, but the amount a driver pays can still vary by charger type, time, operator, taxes and site charges. Check the final tariff in the operator app before connecting."] },
    ],
    faqs: [
      { question: "How do I estimate the cost of a full charge?", answer: "Multiply the energy required by your tariff and account for charging losses. A battery’s advertised capacity is not necessarily the same as energy drawn during a session." },
      { question: "Is DC fast charging more expensive than home charging?", answer: "It often is, but not universally. Compare the current operator price, fees and taxes with your marginal home electricity tariff." },
    ],
    sources: [{ label: "EV Charging Infrastructure Guidelines — Ministry of Power", url: "https://powermin.gov.in/sites/default/files/uploads/RS03022025_Eng_0.pdf" }],
  },
  {
    slug: "battery-as-a-service-india-is-baas-worth-it",
    title: "Battery as a Service (BaaS) in India: Is It Worth It?",
    shortTitle: "BaaS in India: Is It Worth It?",
    description: "Understand EV Battery as a Service in India, including lower upfront price, per-kilometre battery fees, finance conditions and break-even questions.",
    category: "Buying",
    readTime: "9 min",
    updatedAt: "2026-08-29",
    targetKeyword: "Battery as a Service India is BaaS worth it",
    refreshCadence: "event-driven",
    intro: "BaaS separates some or all of the battery cost from the vehicle purchase price. It can reduce the upfront amount, but it creates an ongoing usage or subscription obligation that must be compared with outright ownership over your expected tenure.",
    sections: [
      { heading: "What to compare", bullets: ["Vehicle price with and without the battery", "Battery fee per kilometre or minimum monthly charge", "Charging electricity cost, which may be separate", "Finance tenure, security deposit and early-closure terms", "Transfer, resale and ownership-change rules", "Battery warranty, damage and end-of-contract responsibility"] },
      { heading: "When BaaS may suit a buyer", paragraphs: ["It may help when reducing upfront cash or EMI is important and the usage contract closely matches predictable driving. It is not automatically cheaper: high kilometres, minimum-use clauses or a long tenure can change the result."] },
      { heading: "A practical break-even check", paragraphs: ["Calculate the full battery payment over your expected kilometres and ownership period, add charging electricity, finance and applicable fees, then compare that with the outright-battery version. Obtain the current lender agreement before booking."] },
    ],
    faqs: [
      { question: "Does a BaaS fee include charging electricity?", answer: "Not necessarily. For example, MG’s published BaaS FAQ states that its per-kilometre battery usage cost excludes charging cost. Verify the exact current contract." },
      { question: "Can I sell a BaaS vehicle?", answer: "Transfer and foreclosure terms depend on the provider and financier. Ask for written resale, transfer and early-closure conditions before purchasing." },
    ],
    sources: [{ label: "MG Windsor EV BaaS FAQ — JSW MG Motor India", url: "https://www.mgmotor.co.in/vehicles/windsor-ev-electric-car-in-india/baas-faq" }],
  },
  {
    slug: "best-electric-cars-under-15-lakh-india",
    title: "Best Electric Cars Under ₹15 Lakh in India (2026)",
    shortTitle: "Best EVs Under ₹15 Lakh",
    description: "Compare launched electric cars in India with a listed starting price under ₹15 lakh using range, battery and charging context.",
    category: "Rankings", readTime: "6 min", updatedAt: "2026-08-29",
    targetKeyword: "best electric cars under 15 lakh in India", refreshCadence: "monthly", vehicleList: "under-15",
    intro: "This is a transparent discovery list generated from PlugV’s launched catalogue. Inclusion is based on the listed starting ex-showroom price—not a paid placement or universal recommendation.",
    sections: [{ heading: "How to shortlist", bullets: ["Confirm the exact variant remains below your budget", "Compare practical range and charging time", "Add insurance, registration and home-charger costs", "Check service availability and warranty terms"] }],
    faqs: [{ question: "Are these on-road prices?", answer: "No. The filter uses listed starting prices. Obtain a city- and variant-specific on-road quotation." }, { question: "Is the first car the best overall?", answer: "No. Lists use transparent data ordering and are not paid or universal rankings." }],
  },
  {
    slug: "best-electric-cars-under-10-lakh-india",
    title: "Best Electric Cars Under ₹10 Lakh in India (2026)",
    shortTitle: "Best EVs Under ₹10 Lakh",
    description: "See launched electric cars in India whose listed starting price is below ₹10 lakh and compare their range and battery information.",
    category: "Rankings", readTime: "6 min", updatedAt: "2026-08-29",
    targetKeyword: "best electric cars under 10 lakh in India", refreshCadence: "monthly", vehicleList: "under-10",
    intro: "The sub-₹10-lakh market can change with variant revisions and introductory pricing. PlugV generates this list from current catalogue starting prices and clearly separates BaaS or conditional prices where identified.",
    sections: [{ heading: "Check the price basis", paragraphs: ["A headline price may exclude the battery, depend on BaaS, apply only to a base variant or be introductory. Verify the complete payable structure with the manufacturer or authorised dealer."] }],
    faqs: [{ question: "Can BaaS vehicles appear below ₹10 lakh?", answer: "They may if the listed vehicle price excludes battery ownership. Treat the battery fee and charging cost as additional obligations." }, { question: "Does the list include upcoming cars?", answer: "No. It is generated from PlugV’s launched catalogue." }],
  },
  {
    slug: "cheapest-electric-cars-india",
    title: "Cheapest Electric Cars in India (2026)",
    shortTitle: "Cheapest EVs in India",
    description: "Compare the lowest listed starting prices among launched electric cars in India, with clear cautions for variants, BaaS and on-road costs.",
    category: "Rankings", readTime: "6 min", updatedAt: "2026-08-29",
    targetKeyword: "cheapest electric cars in India", refreshCadence: "monthly", vehicleList: "cheapest",
    intro: "Cheapest should mean lowest comparable ownership entry cost—not just the smallest promotional number. PlugV orders launched models by parsed starting price and asks buyers to verify exclusions and conditions.",
    sections: [{ heading: "What the headline price may omit", bullets: ["Battery rental or subscription", "Insurance and registration", "Home charger installation", "Finance and processing costs", "Accessories and extended warranty"] }],
    faqs: [{ question: "Is the cheapest EV always the lowest-cost EV to own?", answer: "No. Driving, efficiency, insurance, battery arrangements, maintenance and resale assumptions affect total cost." }, { question: "Are promotional offers included?", answer: "Catalogue prices may change. Confirm current eligibility and written terms before relying on an offer." }],
  },
  {
    slug: "longest-range-electric-car-india",
    title: "Which Electric Car Has the Longest Range in India? (2026)",
    shortTitle: "Longest-Range EVs in India",
    description: "Compare launched electric cars in India by their highest listed manufacturer-claimed range and understand why practical range differs.",
    category: "Rankings", readTime: "7 min", updatedAt: "2026-08-29",
    targetKeyword: "which electric car has the longest range in India", refreshCadence: "monthly", vehicleList: "longest-range",
    intro: "PlugV orders launched vehicles by the highest numeric range currently recorded in its catalogue. This is a discovery tool, not a guarantee of real-world distance or an overall quality ranking.",
    sections: [{ heading: "Claimed range is not practical range", paragraphs: ["Test-cycle figures support comparison, but speed, temperature, traffic, elevation, load, tyre condition and climate control change actual range. Compare figures produced under the same certification method where possible."] }],
    faqs: [{ question: "Will I achieve the displayed range?", answer: "Not necessarily. Treat manufacturer-claimed range as a standardised reference and plan with a practical reserve." }, { question: "Does longest range mean fastest charging?", answer: "No. Battery size, peak charging power and the charging curve are separate considerations." }],
  },
];

export function getKnowledgeArticle(slug: string) {
  return knowledgeArticles.find((article) => article.slug === slug);
}
