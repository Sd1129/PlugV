# Community range rollout — 15 September 2026

Implemented routes: /community-range, /api/community-range, /admin/community-range.

Collection is OFF unless COMMUNITY_RANGE_ENABLED=true and COMMUNITY_RANGE_SECRET has at least 32 characters. Existing ADMIN_USER / ADMIN_PASSWORD protect moderation. DATABASE_URL connects the runtime. No real reports are seeded.

## Required activation steps
1. Apply prisma/community-range-additive.sql to the intended PostgreSQL database through its authenticated SQL console. This only adds the new table and indexes; do not reset the database or run a blanket schema push against existing production data.
2. Set a random private COMMUNITY_RANGE_SECRET (at least 32 characters) and DATABASE_URL in the deployment environment. Keep the feature flag false until a preview has been tested. Never put secrets in source control.
3. In an isolated preview database, test submission, duplicate and daily limits, unauthorized admin access, approval, rejection after approval, five reports across three browser contributors, method separation and withdrawal. Confirm no individual readings appear publicly. Remove test records.
4. Enable in production only after that test and a release audit pass. Actual reports require continuing manual moderation; no range claim is created by installing the feature.

## Method and limitations
- Reports cover the last 90 days. Public cohorts match variant, model year and all recorded condition categories.
- Minimum five approved reports and three browser contributors. Cookies are not verified people/cars. Cookie resets and coordinated fabrication remain possible; moderation is essential.
- Average each contributor's readings, then take the median across contributors. The displayed spread is the min/max contributor average, not a confidence interval.
- Dashboard kWh/100km, charger kWh/100km (including losses), and SOC extrapolated km never mix. Charger readings require returning to the original SOC. No arbitrary score, certified-range ratio or automatic planner override is published.
- Reports are self-reported; textual descriptions do not prove authenticity. Moderators reject inconsistent data and personal information. Do not call approved reports independently verified.
- Private payloads and reviewer notes are not sent to the public page. Essential HttpOnly cookie enables withdrawal; only its keyed hash is stored.
- Retention: exclude trips older than 90 days; purge records older than 180 days on the next submission. No background deletion schedule is claimed.
- Daily limits are serialized in PostgreSQL: three reports/browser and 500 total. This limits storage growth but is not strong identity or bot verification.

Current environment has no DIRECT_URL / DATABASE_URL configured. Live database provisioning and end-to-end persistence tests are therefore pending; collection must stay off.
