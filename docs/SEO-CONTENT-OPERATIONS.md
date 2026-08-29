# PlugV SEO content operations

## Publishing rule

Publish only when the page gives an Indian EV buyer a clearer decision. Do not change an article date unless its facts, catalogue output or official sources were actually reviewed.

## Freshness workflow

- **Event-driven:** publish a concise update after an official manufacturer launch, official price/range change, or government policy notification. Link the official source and update the affected model or policy page.
- **Monthly:** review prices, variants, claimed range, charging information, BaaS terms, city charging guides and budget pages.
- **Quarterly:** reassess “best” lists and methodology. Rankings must be reproducible from catalogue fields, not editorial payment.
- Update `data/content-refresh-registry.json` only after completing the review.
- Run `npm run audit:content` before release.

## Google Search Console weekly review

Every Monday export or review the last 28 days against the previous 28 days. Track, per registry keyword and landing page:

1. Impressions
2. Clicks
3. CTR
4. Average position
5. Indexed/canonical status

Prioritise pages at positions **8–20** with growing impressions. Improve the answer, source quality, title clarity, internal links and missing comparison details; do not make cosmetic date-only changes. Investigate falling pages only after checking indexing, query mix and seasonality.

## News-break template

1. Confirm the news on an official manufacturer or government source.
2. Record announcement date, India applicability, launch/status language and source URL.
3. State what changed, what remains unconfirmed and which PlugV pages were updated.
4. Add visible “Published” and “Last reviewed” dates plus Article schema.
5. Link to the relevant model, comparison, Upcoming/Explore catalogue and one useful guide.
6. Submit the URL in Search Console only for material new or substantially updated content.

## Guardrails

- Never call a directory station “live” without an authorised operator status feed.
- Never merge BaaS headline price with battery-owned price.
- Treat prices as variant- and city-sensitive.
- Separate manufacturer-claimed range from practical estimates.
- Do not promise ranking or instant indexing in Google.
