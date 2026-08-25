# PlugV maintenance automation

PlugV uses automated checks to help one operator maintain a reliable India-wide EV platform. Automation detects problems and proposes dependency updates; it does not publish vehicle facts or charging claims without review.

## Schedule

- Daily at 9:00 AM IST: checks plugv.in, critical journeys, sitemap, robots.txt, support address, and key security headers.
- Every Sunday at 9:30 AM IST: runs lint, production build, launch audit, data-freshness audit, official-source link audit, and production dependency security audit.
- Every Monday at 9:00 AM IST: Dependabot checks npm packages and opens grouped update pull requests.
- Manual runs are available from GitHub Actions at any time.

When a check fails, GitHub opens one issue named `[PlugV maintenance] Automated check failed`. Later failures are added to the same issue to avoid alert noise. GitHub notification email should be enabled for the repository.

## Data policy

- Launched-vehicle charging and trip facts are reviewed after 60 days and block release after 120 days.
- Upcoming-vehicle facts are reviewed after 30 days and block release after 60 days.
- The BEE charging-station snapshot raises a review warning after 90 days. It does not silently claim live availability.
- Broken official source links (HTTP 404 or 410) fail the weekly audit. Bot-protected sources are reported for review.

## Operator routine

1. Review GitHub Actions and any maintenance issue once a week.
2. Confirm changes against manufacturer, government, or charging-network sources.
3. Record the source URL and verification date with every factual update.
4. Merge Dependabot updates only after checks pass.
5. Run `npm run audit:release` before production deployment.
6. Test core journeys and support email after deployment.

## Commands

- `npm run audit:site` — live production health and SEO check.
- `npm run audit:freshness` — verification-age check.
- `npm run audit:sources` — official-source link check.
- `npm run audit:security` — production dependency security gate, including expiring reviewed exceptions.
- `npm run audit:maintenance` — launch and freshness checks.
- `npm run audit:release` — full local release gate.

Domain and Zoho renewal, trademark/legal review, emergency partnerships, and third-party API contracts still require human ownership and reminders.

The Prisma configuration-chain exception for `GHSA-ggr8-5vv4-36mx` expires on 15 September 2026. It must be removed as soon as Prisma publishes a compatible fix; the security audit blocks releases after the expiry date.
