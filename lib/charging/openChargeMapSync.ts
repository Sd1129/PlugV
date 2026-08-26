import { prisma } from "@/lib/prisma";
import { ensureChargingSchema } from "@/lib/charging/ensureChargingSchema";

const OCM_API_URL = "https://api.openchargemap.io/v3/poi/";
const SOURCE_NAME = "Open Charge Map";
const PAGE_SIZE = 500;
const MAX_STATIONS = 10_000;

type OcmConnection = {
  ConnectionType?: { Title?: string };
  PowerKW?: number;
  Level?: { IsFastChargeCapable?: boolean };
};

type OcmPoi = {
  ID?: number;
  UUID?: string;
  DataProvider?: { Title?: string; WebsiteURL?: string; License?: string };
  OperatorInfo?: { Title?: string; WebsiteURL?: string; PhonePrimaryContact?: string };
  AddressInfo?: {
    Title?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    Town?: string;
    StateOrProvince?: string;
    Postcode?: string;
    Latitude?: number;
    Longitude?: number;
    ContactTelephone1?: string;
  };
  Connections?: OcmConnection[];
  NumberOfPoints?: number;
  GeneralComments?: string;
  UsageCost?: string;
  DateLastStatusUpdate?: string;
  StatusType?: { IsOperational?: boolean; Title?: string };
};

export type ChargingSyncResult = {
  fetched: number;
  upserted: number;
  skipped: number;
  pages: number;
  startedAt: string;
  completedAt: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";
}

function connectorFacts(connections: OcmConnection[]) {
  const titles = connections.map((item) => item.ConnectionType?.Title?.toLowerCase() ?? "");
  const powers = connections
    .map((item) => Number(item.PowerKW ?? 0))
    .filter((value) => Number.isFinite(value) && value > 0);
  const maxPowerKW = powers.length ? Math.round(Math.max(...powers)) : 0;

  return {
    ccs2: titles.some((title) => title.includes("ccs") || title.includes("combo")),
    chademo: titles.some((title) => title.includes("chademo")),
    acType2: titles.some((title) => title.includes("type 2") && !title.includes("ccs")),
    gbt: titles.some((title) => title.includes("gb/t") || title.includes("gbt")),
    chargingAc: titles.some((title) => title.includes("type 2") || title.includes("type 1") || title.includes("bharat ac")),
    chargingDcFast:
      connections.some((item) => item.Level?.IsFastChargeCapable) ||
      titles.some((title) => title.includes("ccs") || title.includes("chademo") || title.includes("dc")) ||
      maxPowerKW >= 25,
    maxPowerKW,
  };
}

function stationAddress(poi: OcmPoi) {
  const address = poi.AddressInfo;
  return [address?.AddressLine1, address?.AddressLine2, address?.Town, address?.StateOrProvince, address?.Postcode]
    .filter(Boolean)
    .join(", ");
}

function validPoi(poi: OcmPoi): poi is OcmPoi & { ID: number } {
  return Boolean(
    Number.isInteger(poi.ID) &&
      Number.isFinite(poi.AddressInfo?.Latitude) &&
      Number.isFinite(poi.AddressInfo?.Longitude) &&
      poi.AddressInfo?.Town &&
      poi.AddressInfo?.StateOrProvince
  );
}

async function fetchPage(apiKey: string, greaterThanId: number) {
  const url = new URL(OCM_API_URL);
  url.searchParams.set("output", "json");
  url.searchParams.set("countrycode", "IN");
  url.searchParams.set("maxresults", String(PAGE_SIZE));
  url.searchParams.set("compact", "true");
  url.searchParams.set("verbose", "false");
  url.searchParams.set("sortby", "id_asc");
  url.searchParams.set("greaterthanid", String(greaterThanId));

  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
      "User-Agent": "PlugV/1.0 (https://plugv.in; support@plugv.in)",
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Open Charge Map returned ${response.status}: ${detail}`);
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) throw new Error("Open Charge Map returned an unexpected response.");
  return payload as OcmPoi[];
}

async function upsertPoi(poi: OcmPoi & { ID: number }) {
  const address = poi.AddressInfo!;
  const cityName = address.Town!.trim();
  const state = address.StateOrProvince!.trim();
  const citySlug = slugify(`${cityName}-${state}`);
  const stationId = `ocm-${poi.ID}`;
  const facts = connectorFacts(poi.Connections ?? []);
  const name = address.Title?.trim() || `${poi.OperatorInfo?.Title ?? "EV"} charging station`;
  const operator = poi.OperatorInfo?.Title?.trim() || "Operator not listed";
  const fullAddress = stationAddress(poi) || `${cityName}, ${state}`;
  const searchText = [name, operator, fullAddress, cityName, state, poi.UsageCost, poi.GeneralComments]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const city = await prisma.city.upsert({
    where: { slug: citySlug },
    create: { id: citySlug, slug: citySlug, name: cityName, state },
    update: { name: cityName, state },
  });

  await prisma.station.upsert({
    where: { id: stationId },
    create: {
      id: stationId,
      slug: stationId,
      cityId: city.id,
      name,
      operator,
      address: fullAddress,
      latitude: address.Latitude!,
      longitude: address.Longitude!,
      phone: poi.OperatorInfo?.PhonePrimaryContact || address.ContactTelephone1 || null,
      website: poi.OperatorInfo?.WebsiteURL || null,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${address.Latitude},${address.Longitude}`,
      ...facts,
      amenities: [],
      searchText,
      sourceStatus: "PENDING",
    },
    update: {
      cityId: city.id,
      name,
      operator,
      address: fullAddress,
      latitude: address.Latitude!,
      longitude: address.Longitude!,
      phone: poi.OperatorInfo?.PhonePrimaryContact || address.ContactTelephone1 || null,
      website: poi.OperatorInfo?.WebsiteURL || null,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${address.Latitude},${address.Longitude}`,
      ...facts,
      searchText,
    },
  });

  await prisma.stationSource.deleteMany({ where: { stationId, sourceName: SOURCE_NAME } });
  await prisma.stationSource.create({
    data: {
      stationId,
      sourceName: SOURCE_NAME,
      sourceUrl: `https://openchargemap.org/site/poi/details/${poi.ID}`,
      sourceType: "CRAWLED",
      capturedAt: new Date(),
      rawPayload: {
        ocmId: poi.ID,
        uuid: poi.UUID,
        numberOfPoints: poi.NumberOfPoints,
        usageCost: poi.UsageCost,
        operational: poi.StatusType?.IsOperational,
        status: poi.StatusType?.Title,
        lastStatusUpdate: poi.DateLastStatusUpdate,
        dataProvider: poi.DataProvider?.Title,
        dataProviderWebsite: poi.DataProvider?.WebsiteURL,
        dataLicense: poi.DataProvider?.License,
      },
    },
  });
}

export async function syncOpenChargeMapIndia(): Promise<ChargingSyncResult> {
  const apiKey = process.env.OCM_API_KEY || process.env.OPEN_CHARGE_MAP_API_KEY;
  if (!apiKey) {
    throw new Error("OCM_API_KEY or OPEN_CHARGE_MAP_API_KEY is not configured.");
  }

  await ensureChargingSchema();

  const startedAt = new Date();
  let greaterThanId = 0;
  let fetched = 0;
  let upserted = 0;
  let skipped = 0;
  let pages = 0;

  while (fetched < MAX_STATIONS) {
    const page = await fetchPage(apiKey, greaterThanId);
    if (!page.length) break;
    pages += 1;
    fetched += page.length;

    const valid = page.filter(validPoi);
    skipped += page.length - valid.length;
    for (let index = 0; index < valid.length; index += 10) {
      const batch = valid.slice(index, index + 10);
      await Promise.all(batch.map(upsertPoi));
      upserted += batch.length;
    }

    const ids = page.map((item) => item.ID ?? 0);
    const nextId = Math.max(...ids);
    if (!Number.isFinite(nextId) || nextId <= greaterThanId || page.length < PAGE_SIZE) break;
    greaterThanId = nextId;
  }

  return {
    fetched,
    upserted,
    skipped,
    pages,
    startedAt: startedAt.toISOString(),
    completedAt: new Date().toISOString(),
  };
}
