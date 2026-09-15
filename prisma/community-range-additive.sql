-- Additive setup only. Run on the intended database before enabling collection.
CREATE TABLE IF NOT EXISTS "CommunityTrip" (
  "id" TEXT PRIMARY KEY,
  "contributor" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewNote" TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS "CommunityTrip_fingerprint_key" ON "CommunityTrip"("fingerprint");
CREATE INDEX IF NOT EXISTS "CommunityTrip_status_createdAt_idx" ON "CommunityTrip"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "CommunityTrip_contributor_createdAt_idx" ON "CommunityTrip"("contributor", "createdAt");
