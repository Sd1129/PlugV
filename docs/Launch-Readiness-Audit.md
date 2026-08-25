# PlugV India Launch Readiness Audit

**Assessment date:** 23 August 2026  
**Decision:** **NOT READY FOR PUBLIC LAUNCH**

This audit is an engineering and content-risk review, not legal advice. PlugV should be described as an **independent India-focused EV information platform**, not an official, government-approved, manufacturer-authorised, guaranteed, or fully verified platform unless written evidence supports that statement.

## Release blockers

1. **Dependency security:** `npm audit --omit=dev` reports 12 high findings, including Next.js image processing/build dependencies and Prisma dependencies. Each must be upgraded, removed, mitigated or formally risk-accepted before launch.
2. **Legal completeness:** activate `support@plugv.in`; publish the legal operator name, address and grievance contact; obtain review by qualified Indian counsel for the Privacy Policy, Terms and Disclaimer.
3. **Brand protection:** complete an IP India trademark clearance search and obtain professional advice before relying on the PlugV name/icon nationally.
4. **Operational readiness:** production monitoring, rate limiting, database backup/restore testing, incident response, external-provider failure testing and cross-browser/mobile acceptance evidence are not yet documented.

## Controls implemented during this audit

- Added a permanent `.cursor` launch-safety rule applied to future work.
- Added `npm run audit:release` covering lint, production build, structured data checks and dependency audit.
- Added an asset-rights register and dated legal-page summaries.
- Added baseline security headers.
- Replaced disabled middleware protection with the Next.js 16 `proxy.ts` convention.
- Added authorization inside charging admin server actions.
- Bounded charging API pagination and restricted travel route coordinates to India.
- Removed the unused `shadcn` CLI package from production dependencies.

## Current verification evidence

- ESLint: **pass**
- Next.js production build and TypeScript: **pass** (31 routes generated)
- Charging provenance coverage: **29/29 launched vehicles present**
- Data/rights gate: **pass** (29/29 official-source charging records; served imagery documented; uncertain legacy assets quarantined)
- Production dependency audit: **fail** (12 high findings, 0 critical)

## Mandatory recurring release process

Run `npm run audit:release` before every deployment. A green command is necessary but not sufficient: any change affecting content, personal data, security, third-party services, imagery, prices, availability or public claims must also receive human editorial verification and, where relevant, legal/security review.

Keep release evidence for every version: source URLs or documents, verification dates, asset licences/generation records, test results, dependency report, privacy impact notes and approval owner. Never represent estimated routes or charger availability as live facts.

## Recommended acceptance journeys

- Buyer: discover, filter, open vehicle, change variant, view city price estimate and compare.
- Owner: charging search, travel route and fallback, saved charger/trip, reminder, alert and emergency information.
- Trust: source/methodology, privacy, terms, disclaimer, contact and correction request.
- Failure: routing/geocoding unavailable, no stations, invalid query, stale data and offline/slow network.
- Accessibility: keyboard-only, visible focus, screen-reader labels, contrast, text zoom and reduced motion.

## External reviews required

- Indian privacy/consumer-law counsel, including DPDP Act/Rules readiness and grievance wording.
- Security review and production penetration test.
- Trademark professional/IP India clearance.
- Copyright/licensing review for every non-PlugV-owned public asset.
