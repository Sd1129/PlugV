# Station reports — 16 September 2026

Implemented:
- Station cards link to /charging/report?station=<station ID>.
- Original visit reports: successful charge, charger failed, access blocked, incorrect location or details; connector and visit timestamp required.
- Submission API validates inputs and the selected station, bounds request bodies, requires same-origin JSON, applies serialized daily limits (five per browser, 500 total) and duplicate detection (same browser/station/day/connector/outcome).
- /admin/station-reports uses existing admin authentication. Reviewers may approve, reject or remove prior approval. Private notes are never published. Corrections require separate source verification; no automatic station update.
- Public observations show outcome, connector, visit time and review time; never live availability or reservations. Visits older than 90 days are omitted. No ranking or planner changes.
- Essential pseudonymous cookie supports withdrawal. Database stores its keyed hash. Cookie resets can bypass browser-level limits; this is not verified identity or strong bot protection.
- Retention deletes records older than 180 days on the next valid submission request. No scheduled retention job is claimed.
- No PlugShare or Zeon data ingestion was added. No copied review content or images are accepted by policy; moderators must enforce it.

Activation requirements:
1. Apply prisma/station-reports-additive.sql to the intended PostgreSQL database. It does not alter existing station/source records and supports both bundled and database station IDs.
2. Configure ADMIN_PASSWORD and COMMUNITY_RANGE_SECRET (minimum 32 private random characters). The latter is shared with community trip reporting; do not rotate it casually because existing withdrawal cookies depend on it.
3. Test a preview connected to an isolated database: submit, duplicate limit, unauthorized moderation, approve, reject, withdraw, and confirm public notes remain private. Delete test records.
4. Set STATION_REPORTS_ENABLED=true only after those checks and redeploy. Absent configuration or table, the UI fails closed.

Local verification includes pure validation/projection tests and API tests with mock persistence, plus the release gate. These do not replace a real database integration test. Production table/configuration and activation are not performed by this code commit.
