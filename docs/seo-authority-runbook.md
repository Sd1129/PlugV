# PlugV search authority and accuracy runbook

## Purpose

Build search visibility without trading away trust. Each target query must have one useful canonical page, current catalogue data, visible review information and a documented refresh owner.

## Weekly Search Console review

1. Open **Performance → Search results** and compare the latest 28 days with the previous 28 days.
2. Export **Queries** and **Pages**.
3. Prioritise non-branded queries with impressions and an average position between 8 and 30.
4. Map each query to one existing canonical PlugV page. Do not create competing pages for the same intent.
5. Improve the matching page with a clearer title, direct answer, verified evidence, internal links and an updated review date.
6. Inspect pages with impressions but low CTR; refine titles and descriptions without unsupported claims.
7. Record the review in `data/content-refresh-registry.json` only after the page content and sources have actually been checked.

## Accuracy gate before publishing

- Launched status requires an official India manufacturer page, price announcement, booking/sale evidence or equivalent primary source.
- Upcoming status must distinguish official announcement, manufacturer target and official concept.
- Prices must state their basis and must not imply on-road pricing when ex-showroom data is used.
- Range must identify claimed or certified figures; practical estimates must be labelled separately.
- Time-sensitive policy, tariff and incentive claims need a governing official source and review date.
- Dynamic rankings must explain their ordering and must never be described as paid or universal recommendations.

## Release checks

Run:

```powershell
npm run audit:seo-authority
npm run audit:content
npm run build
```

Do not publish when the SEO authority audit, freshness audit or production build fails.
