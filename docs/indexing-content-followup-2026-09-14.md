# Indexing and content follow-up — 14 September 2026

Google's supplied reports identify 30 discovered and 6 crawled exclusions. Live checks find 30 HTTP 200 pages with matching canonicals, sitemap inclusion and no noindex directives; 6 retired upcoming URLs return 404 and are omitted from the sitemap. This does not prove indexing, current prices or full source verification.

## Changes

- Added field-specific source-review notes to the five vehicle pages in the crawled report. Notes distinguish current product-page evidence, historical launch pricing, search-indexed source content and unresolved fields. No blanket verified badge or refreshed launch dates.
- Removed the Creta trip profile's unsupported 100 kW vehicle peak. Hyundai specifies a >100 kW / 400 V test charger. Retained its documented charging times in partial charging facts; planner falls back to estimates until a complete profile is supported.
- Expanded the cheapest-EVs guide with its sorting method, price limitations, battery-rental comparison and manufacturer links. Updated only this article's review date and matching registry entry.
- Corrected Open Charge Map sync to request full reference objects. Compact responses omit the operator and connector objects consumed by the importer. Existing incomplete records remain filtered until a successful sync; this does not create live CPO availability or verification.

Source contract: https://community.openchargemap.org/t/api-request-returns-null-values-for-cetain-keys-e-g-dataprovider/1093
Vehicle sources and review limits: data/vehicle-content-reviews.json.

## Validation

49 assistant checks passed, including Creta peak-power regression. Charging quality and mocked sync contract passed. Lint, production build/TypeScript, automation, catalogue structure, freshness, content and SEO authority checks passed when run. Production dependency audit passed. Initial release run caught an article-date mismatch; corrected it and reran content, remaining gates, and production build. Mobile production-build render confirmed source notes and expanded guide.

## Open dependencies

- Current price/variant verification is not complete across the catalogue. Do not treat this focused review or structural audit as a full factual pass. BMW's retrieved page did not expose current pricing; Tata direct retrieval was unavailable; Mahindra pricing is a dated announcement.
- Nine charging-fact entries are partial; bundled BEE data is 323 days old. No authorized live CPO feed or reservations are established.
- Remote main remained e5fffbf5 when checked. Push from this agent session did not complete; production therefore still lacks the pending commits.
- Google report still shows last update 4 September. Reinspection and any indexing request must follow confirmed deployment. Google controls recrawl/indexing; leave intentionally retired URLs excluded. No indexing request or validation was submitted in this session.
