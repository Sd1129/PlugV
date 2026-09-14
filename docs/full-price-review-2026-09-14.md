# Catalogue price and variant review

Reviewed all 39 launched models against accessible manufacturer pages, indexed manufacturer content and rendered configurators on 14 September 2026. The machine-readable register is data/vehicle-price-variant-reviews.json. This is a review of available evidence, not a certification of all prices.

14 models have supported price and variant evidence within their recorded scope. 25 retain partial, conflicting or unavailable evidence. Dealer availability, options, BaaS eligibility and on-road quotations are not verified. Historical announcements are explicitly identified. BMW model-page inconsistencies and Tesla access denial are not bypassed or treated as confirmations.

## Corrections

- Punch EV maximum listed price: 12.79 to 12.59 lakh, supported by current Tata price page.
- BYD Sealion 7 entry: 49.90 to 41.90 lakh; Dynamic trim added from rendered current manufacturer page. Cached search content was older.
- BYD eMAX 7 entry: 26.90 to 27.90 lakh; Comfort/Superior six-/seven-seat variants added. Corrected five-seat fallback and selected-variant seat display.
- BMW i5 M60 starting price: 1.20 to 1.195 crore, from current India model list with GST/ex-showroom terms.
- Added missing Kia Syros/Carens Clavis, XEV 9e, XUV 3XO and EC40 configurations; corrected Nexon and VF MPV 7 names. No unverified equipment was added to new trims.
- Carens Clavis EV summary supports six or seven seats, as stated by Kia.
- Vehicle pages display price and variant evidence status and sources. Unresolved prices are labelled review pending and omitted from Product additionalProperty price fields.
- Catalogue audit requires a review record per launched model and reports unresolved evidence rather than claiming full factual verification.

## Validation and deployment

Full release audit passed with disclosed review warnings. Following the final page/seat changes, production build/TypeScript and targeted lint passed. Production-build browser checks passed for changed price, new Dynamic trim, six-/seven-seat selection, pending-price label and omission from structured data. The initial browser check used an over-specific accessible-label locator; repeated using the actual select element and passed.

Previous deployment c68da94b was confirmed READY in production and its Creta source note was observed live. These additional changes require their own deployment.

## Google

The exclusion reports contain 30 discovered and six crawled URLs. The six crawled URLs include five vehicle pages and one knowledge article; they are not retired upcoming pages. Separately, retired upcoming URLs were checked for removal from the sitemap. No indexing request was submitted by the assistant: available Search Console browser controls are read-only. The user was guided to inspect the Tigor URL and use Request indexing. Opening the PlugV page alone is not a request. Do not mark indexing requested until Search Console confirms submission; submission is not a guarantee of indexing.
