-- Adds only station-report storage. Does not change stations, operator status or sources.
CREATE TABLE IF NOT EXISTS "StationReport" (
  "id" TEXT PRIMARY KEY,
  "stationId" TEXT NOT NULL,
  "contributor" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewNote" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "StationReport_fingerprint_key" ON "StationReport"("fingerprint");
CREATE INDEX IF NOT EXISTS "StationReport_stationId_status_createdAt_idx" ON "StationReport"("stationId", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "StationReport_contributor_createdAt_idx" ON "StationReport"("contributor", "createdAt");
