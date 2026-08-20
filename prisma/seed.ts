import { prisma } from "../lib/prisma";
import { hyderabadStations } from "../data/charging/hyderabad";
import { bengaluruStations } from "../data/charging/bengaluru";
import { mumbaiStations } from "../data/charging/mumbai";
import { newDelhiStations } from "../data/charging/new-delhi";
import { puneStations } from "../data/charging/pune";
import { chennaiStations } from "../data/charging/chennai";
import { ahmedabadStations } from "../data/charging/ahmedabad";
import { jaipurStations } from "../data/charging/jaipur";

const ALL_STATIONS = [
  ...hyderabadStations,
  ...bengaluruStations,
  ...mumbaiStations,
  ...newDelhiStations,
  ...puneStations,
  ...chennaiStations,
  ...ahmedabadStations,
  ...jaipurStations,
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSearchText(station: {
  name: string;
  operator: string;
  address: string;
  city: string;
  state: string;
  openingHours?: string;
  phone?: string;
  website?: string;
  amenities: string[];
}) {
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

async function main() {
  for (const station of ALL_STATIONS) {
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

    const stationSlug = station.id;

    await prisma.station.upsert({
      where: { id: stationSlug },
      create: {
        id: stationSlug,
        cityId: city.id,
        name: station.name,
        operator: station.operator,
        slug: stationSlug,
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
  }

  console.log(`Seeded ${ALL_STATIONS.length} stations.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });