# Compare usability and evidence review — 17 September 2026

## Changes

- Searchable keyboard-accessible model pickers, grouped by indicative starting ex-showroom price. Other selected vehicle excluded; empty results explained; mobile popup height bounded.
- Removed implicit first-catalogue-trim selection. Battery options use the independent battery evidence records. Charging figures identify their recorded battery/profile scope and evidence dates.
- Added e Vitara Type 2 / CCS2 connector evidence from the 2026 NEXA brochure. The 70 kW test charger is not presented as peak vehicle input.
- Added Creta Electric CCS2 evidence from Hyundai's India specification page. Its >100 kW test charger is not presented as peak vehicle input.
- Updated Compare's Punch.ev DC display to the current manufacturer facelift claim of up to 65 kW. Existing trip-planner profile is unchanged; connector evidence retains its older date.
- Unknown values no longer contribute to the difference count. Incomplete trim equipment is explained once instead of filling multiple trim rows with placeholders.
- Added Delhi/BSES Yamuna June 2025 and Telangana FY2025–26 published slab examples, with dates, sources and exclusions. These are explicitly not current tariff quotes or state averages. Custom decimal rates supported.
- Added separate city/selected-trim on-road worksheets. All amounts, including explicit zeroes, must be entered; changing a model resets that side's worksheet. No inferred state taxes, exemptions or dealer prices.

## Evidence

- NEXA: https://marutisuzuki.scene7.com/is/content/maruti/NEXA-eVITARA-Brochure-2026pdf
- Hyundai: https://www.hyundai.com/in/en/find-a-car/creta-electric/specification
- Tata: https://ev.tata.cars/blogs/new-punch-ev-facelift.html
- BSES Yamuna: https://www.bsesdelhi.com/documents/73527/1989278520/Form_2_1_a_June_2025.pdf
- TGERC FY2025–26: https://tgerc.telangana.gov.in/file_upload/uploads/Tariff%20Orders/Current%20Year%20Orders/2025/RST%20Order%20FY%202025-26%20FINAL.pdf

## Validation

- `npm run audit:release`: passed, including lint, production build, maintenance/content/SEO and dependency-security checks.
- Browser checks against the production build: search, keyboard selection, grouped browsing, duplicate exclusion, no-match feedback, decimal tariff editing, on-road arithmetic (₹10,35,000 fixture), incomplete-quote suppression, no horizontal overflow at 390px and 1365px, no uncaught JavaScript errors.
- Visual inspection of mobile picker and desktop specifications.

## Still incomplete

This is not a fresh verification of every trim in the catalogue. Existing sourced profile dates are preserved. Some peak AC/DC and connector fields remain unconfirmed. Current all-state electricity schedules and city/variant dealer quotations are not available. Practical-range inputs remain planning estimates, not community measurements. Deployment must be verified separately from these local checks.
