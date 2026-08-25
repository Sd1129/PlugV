"use server";

import {
  Prisma,
  SourceType,
  VerificationStatus,
} from "@/generated/prisma/client";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

type SeedStation = {
  id: string;
  name: string;
  operator: string;
  state: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  openingHours?: string;
  directionsUrl: string;
  connectors: {
    ccs2: boolean;
    chademo: boolean;
    acType2: boolean;
    gbt?: boolean;
  };
  charging: {
    ac: boolean;
    dcFast: boolean;
    maxPowerKW: number;
  };
  amenities: string[];
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSearchText(station: SeedStation) {
  return [
    station.name,
    station.operator,
    station.address,
    station.city,
    station.state,
    station.openingHours ?? "",
    station.phone ?? "",
    station.website ?? "",
    ...station.amenities,
  ]
    .join(" ")
    .toLowerCase();
}

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function upsertSeedStation(
  station: SeedStation,
  sourceName: string,
  sourceUrl: string,
  sourceType: SourceType
) {
  const citySlug = slugify(`${station.city}-${station.state}`);

  const city = await prisma.city.upsert({
    where: { slug: citySlug },
    create: {
      id: citySlug,
      name: station.city,
      state: station.state,
      slug: citySlug,
    },
    update: {
      name: station.city,
      state: station.state,
    },
  });

  const savedStation = await prisma.station.upsert({
    where: { id: station.id },
    create: {
      id: station.id,
      cityId: city.id,
      name: station.name,
      operator: station.operator,
      slug: station.id,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      phone: station.phone,
      website: station.website,
      openingHours: station.openingHours,
      directionsUrl: station.directionsUrl,
      chargingAc: station.charging.ac,
      chargingDcFast: station.charging.dcFast,
      maxPowerKW: station.charging.maxPowerKW,
      ccs2: station.connectors.ccs2,
      chademo: station.connectors.chademo,
      acType2: station.connectors.acType2,
      gbt: station.connectors.gbt ?? false,
      amenities: station.amenities,
      searchText: buildSearchText(station),
      sourceStatus: VerificationStatus.PENDING,
    },
    update: {
      cityId: city.id,
      name: station.name,
      operator: station.operator,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      phone: station.phone,
      website: station.website,
      openingHours: station.openingHours,
      directionsUrl: station.directionsUrl,
      chargingAc: station.charging.ac,
      chargingDcFast: station.charging.dcFast,
      maxPowerKW: station.charging.maxPowerKW,
      ccs2: station.connectors.ccs2,
      chademo: station.connectors.chademo,
      acType2: station.connectors.acType2,
      gbt: station.connectors.gbt ?? false,
      amenities: station.amenities,
      searchText: buildSearchText(station),
    },
  });

  await prisma.stationSource.create({
    data: {
      stationId: savedStation.id,
      sourceName,
      sourceUrl: sourceUrl || null,
      sourceType,
      rawPayload: station as Prisma.InputJsonValue,
    },
  });
}

export async function bulkImportStations(formData: FormData) {
  await requireAdmin();
  const importJson = asString(formData.get("importJson"));
  const sourceName = asString(formData.get("sourceName")) || "Manual import";
  const sourceUrl = asString(formData.get("sourceUrl"));
  const sourceType = (asString(formData.get("sourceType")) || "MANUAL") as SourceType;

  if (!importJson) {
    throw new Error("Paste JSON before importing.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(importJson);
  } catch {
    throw new Error("Import JSON is invalid.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Import JSON must be an array of stations.");
  }

  for (const item of parsed) {
    const station = item as SeedStation;

    if (
      !station ||
      typeof station.id !== "string" ||
      typeof station.name !== "string" ||
      typeof station.city !== "string" ||
      typeof station.state !== "string" ||
      typeof station.address !== "string"
    ) {
      throw new Error("One or more station records are missing required fields.");
    }

    await upsertSeedStation(station, sourceName, sourceUrl, sourceType);
  }

  revalidatePath("/admin/charging");
  revalidatePath("/charging");
}

export async function addStationSource(formData: FormData) {
  await requireAdmin();
  const stationId = asString(formData.get("stationId"));
  const sourceName = asString(formData.get("sourceName"));
  const sourceUrl = asString(formData.get("sourceUrl"));
  const sourceType = (asString(formData.get("sourceType")) || "OFFICIAL") as SourceType;
  const rawPayloadText = asString(formData.get("rawPayload"));

  if (!stationId || !sourceName) {
    throw new Error("Station ID and source name are required.");
  }

  let rawPayload: Prisma.InputJsonValue | undefined;

  if (rawPayloadText) {
    try {
      rawPayload = JSON.parse(rawPayloadText) as Prisma.InputJsonValue;
    } catch {
      throw new Error("Raw payload must be valid JSON.");
    }
  }

  await prisma.stationSource.create({
    data: {
      stationId,
      sourceName,
      sourceUrl: sourceUrl || null,
      sourceType,
      rawPayload,
    },
  });

  revalidatePath("/admin/charging");
}

export async function verifyStation(formData: FormData) {
  await requireAdmin();
  const stationId = asString(formData.get("stationId"));
  const verifiedBy = asString(formData.get("verifiedBy")) || "Admin";
  const notes = asString(formData.get("notes"));

  if (!stationId) {
    throw new Error("Station ID is required.");
  }

  await prisma.stationVerification.create({
    data: {
      stationId,
      verifiedBy,
      notes: notes || null,
    },
  });

  await prisma.station.update({
    where: { id: stationId },
    data: {
      sourceStatus: VerificationStatus.VERIFIED,
    },
  });

  revalidatePath("/admin/charging");
  revalidatePath("/charging");
}

export async function rejectStation(formData: FormData) {
  await requireAdmin();
  const stationId = asString(formData.get("stationId"));
  const verifiedBy = asString(formData.get("verifiedBy")) || "Admin";
  const notes = asString(formData.get("notes"));

  if (!stationId) {
    throw new Error("Station ID is required.");
  }

  await prisma.stationVerification.create({
    data: {
      stationId,
      verifiedBy,
      notes: notes || "Rejected during admin review.",
    },
  });

  await prisma.station.update({
    where: { id: stationId },
    data: {
      sourceStatus: VerificationStatus.REJECTED,
    },
  });

  revalidatePath("/admin/charging");
  revalidatePath("/charging");
}
