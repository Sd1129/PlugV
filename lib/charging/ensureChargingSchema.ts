import { prisma } from "@/lib/prisma";

let schemaReady: Promise<void> | undefined;

async function createChargingSchema() {
  const statements = [
    `CREATE SCHEMA IF NOT EXISTS public`,
    `DO $$ BEGIN
      CREATE TYPE public."SourceType" AS ENUM ('MANUAL', 'OFFICIAL', 'CRAWLED', 'USER_SUBMITTED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$`,
    `DO $$ BEGIN
      CREATE TYPE public."VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$`,
    `CREATE TABLE IF NOT EXISTS public."City" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "state" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "City_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE TABLE IF NOT EXISTS public."Station" (
      "id" TEXT NOT NULL,
      "cityId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "operator" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "latitude" DOUBLE PRECISION NOT NULL,
      "longitude" DOUBLE PRECISION NOT NULL,
      "phone" TEXT,
      "website" TEXT,
      "openingHours" TEXT,
      "directionsUrl" TEXT,
      "chargingAc" BOOLEAN NOT NULL DEFAULT false,
      "chargingDcFast" BOOLEAN NOT NULL DEFAULT false,
      "maxPowerKW" INTEGER NOT NULL DEFAULT 0,
      "ccs2" BOOLEAN NOT NULL DEFAULT false,
      "chademo" BOOLEAN NOT NULL DEFAULT false,
      "acType2" BOOLEAN NOT NULL DEFAULT false,
      "gbt" BOOLEAN NOT NULL DEFAULT false,
      "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "searchText" TEXT NOT NULL DEFAULT '',
      "sourceStatus" public."VerificationStatus" NOT NULL DEFAULT 'PENDING',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE TABLE IF NOT EXISTS public."StationSource" (
      "id" TEXT NOT NULL,
      "stationId" TEXT NOT NULL,
      "sourceName" TEXT NOT NULL,
      "sourceUrl" TEXT,
      "sourceType" public."SourceType" NOT NULL,
      "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "rawPayload" JSONB,
      CONSTRAINT "StationSource_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE TABLE IF NOT EXISTS public."StationVerification" (
      "id" TEXT NOT NULL,
      "stationId" TEXT NOT NULL,
      "verifiedBy" TEXT NOT NULL,
      "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "notes" TEXT,
      CONSTRAINT "StationVerification_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "City_slug_key" ON public."City"("slug")`,
    `CREATE INDEX IF NOT EXISTS "City_state_idx" ON public."City"("state")`,
    `CREATE INDEX IF NOT EXISTS "City_name_idx" ON public."City"("name")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Station_slug_key" ON public."Station"("slug")`,
    `CREATE INDEX IF NOT EXISTS "Station_cityId_idx" ON public."Station"("cityId")`,
    `CREATE INDEX IF NOT EXISTS "Station_name_idx" ON public."Station"("name")`,
    `CREATE INDEX IF NOT EXISTS "Station_operator_idx" ON public."Station"("operator")`,
    `CREATE INDEX IF NOT EXISTS "Station_sourceStatus_idx" ON public."Station"("sourceStatus")`,
    `CREATE INDEX IF NOT EXISTS "Station_searchText_idx" ON public."Station"("searchText")`,
    `CREATE INDEX IF NOT EXISTS "StationSource_stationId_idx" ON public."StationSource"("stationId")`,
    `CREATE INDEX IF NOT EXISTS "StationSource_sourceType_idx" ON public."StationSource"("sourceType")`,
    `CREATE INDEX IF NOT EXISTS "StationVerification_stationId_idx" ON public."StationVerification"("stationId")`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Station_cityId_fkey') THEN
        ALTER TABLE public."Station" ADD CONSTRAINT "Station_cityId_fkey"
          FOREIGN KEY ("cityId") REFERENCES public."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StationSource_stationId_fkey') THEN
        ALTER TABLE public."StationSource" ADD CONSTRAINT "StationSource_stationId_fkey"
          FOREIGN KEY ("stationId") REFERENCES public."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StationVerification_stationId_fkey') THEN
        ALTER TABLE public."StationVerification" ADD CONSTRAINT "StationVerification_stationId_fkey"
          FOREIGN KEY ("stationId") REFERENCES public."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$`,
  ];

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
}

/** Creates only missing charging tables and indexes; it never drops or truncates data. */
export function ensureChargingSchema() {
  schemaReady ??= createChargingSchema().catch((error) => {
    schemaReady = undefined;
    throw error;
  });
  return schemaReady;
}
