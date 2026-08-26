# PlugV charging data sync

PlugV refreshes Indian charging-station metadata from Open Charge Map once per day. The production Vercel cron calls `GET /api/cron/charging-stations` at 04:00 UTC (09:30 IST).

## Data flow

1. Vercel sends the protected cron request with `Authorization: Bearer <CRON_SECRET>`.
2. PlugV fetches Open Charge Map POIs using `countrycode=IN`, ordered and paginated by OCM ID.
3. Valid records are idempotently upserted into the existing PostgreSQL `City`, `Station`, and `StationSource` tables.
4. The Charging API reads synchronized database records. If the database is temporarily unavailable or empty, it serves the bundled PlugV station catalogue instead.
5. Upstream failures never delete previously working station records.

## Required Vercel environment variables

- `DATABASE_URL`: existing PlugV Neon PostgreSQL connection string.
- `CRON_SECRET`: random server-only secret of at least 16 characters.
- `OPEN_CHARGE_MAP_API_KEY`: API key created in Open Charge Map under **My Profile → My Apps**.

Set secrets for **Production** in Vercel Project → Settings → Environment Variables, then redeploy. Never prefix these variables with `NEXT_PUBLIC_`.

## Trust and availability rules

- Open Charge Map imports are labelled `CRAWLED` and are not marked PlugV-verified.
- `StatusType` from OCM is retained in source metadata, but PlugV does not present it as live occupancy.
- Open Charge Map does not provide reliable real-time busy/available connector status. That requires direct operator/OCPP feeds.
- PlugV attributes each imported station to Open Charge Map and stores its source URL, provider and licence metadata.

## Manual verification

After deployment, trigger a protected test request and inspect the JSON result and Vercel runtime logs:

```powershell
$headers = @{ Authorization = "Bearer $env:CRON_SECRET" }
Invoke-RestMethod -Headers $headers https://plugv.in/api/cron/charging-stations
```

A successful result reports `fetched`, `upserted`, `skipped`, `pages`, and timestamps. Then open `/charging` and confirm that newly synchronized states and cities appear in the selectors.

## Operations

- Cron definitions live in `vercel.json` and only run on production deployments.
- The route is idempotent: repeating it updates the same `ocm-<ID>` records.
- Check Vercel Project → Settings → Cron Jobs and Runtime Logs for failures.
- Rotate either secret in Vercel when needed; no code change is required.
