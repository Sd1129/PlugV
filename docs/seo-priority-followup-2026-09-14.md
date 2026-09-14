# SEO priority follow-up — 14 September 2026

## Indexing remains open

Signed-in Search Console still reports 30 discovered/not indexed and 6 crawled/not indexed, with a report date of 4 September. The exact example URLs were not obtainable through the available browser controls; requested from the owner. These 36 exclusions are NOT resolved or matched to specific pages yet.

Live crawl of all 74 sitemap URLs: HTTP 200, headings present, no meta/header noindex, canonical URLs match (homepage trailing slash normalises to the same URL). 73 URLs are reachable within two links from the homepage in server-rendered anchor links. The budget landing page /best-ev-cars-under-25-lakh had zero incoming links from the other sitemap pages. Added a contextual link from /vehicles; verified it in raw HTML and browser navigation. This addresses discovery, not a guarantee of indexing or proof that Google excluded this URL.

When the Google examples are available, match exact URLs including parameters; check last crawl, Google-selected canonical, robots, rendered content, inbound links, redirects and unique value. Prioritise key buying pages and model details, then guides. Keep legitimate redirected/alternate URLs excluded. Request indexing selectively only after current inspection confirms the intended canonical page is ready; do not bulk-submit or relabel every exclusion as an error. No indexing requests submitted in this session.

## Contrast fix

Global unlayered `a { color: inherit }` overrode Tailwind text colours. Move defaults into the base layer so explicit link colours win. Raise dim slate-500 text to slate-400 in the homepage matcher and shared header/footer.

Before: axe-core 4.10.3 found 13 failing elements at 390px and 12 at 1440px on the live homepage. After: no text-contrast violations at either width against the local production build. One mobile decorative, aria-hidden symbol is an axe manual-review item, not a text-contrast pass. This is not a site-wide WCAG certification or a refreshed Lighthouse score.

Validation: targeted ESLint, TypeScript, production build, browser rendering with no page errors, homepage anchor, budget-link navigation and server-rendered presence. Production CSP was preserved. Dev-only React eval warning avoided by verifying the production build, not relaxing CSP.

## Editorial preparation

Owner-facing drafts, source limitations and real comparison screenshots prepared separately. Autocar India and ET Auto contacts verified on their official contact pages. No email sent, endorsement claimed or publication secured. Tata historical source returned 403 in this audit; its record is not treated as newly verified. A manufacturer announcement does not establish current battery-inclusive prices for every variant.
