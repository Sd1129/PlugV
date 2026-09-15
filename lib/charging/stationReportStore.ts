import "server-only";
import { chargingStations } from "@/data/charging/stations";
import { prisma } from "@/lib/prisma";
export const reportsEnabled = () => process.env.STATION_REPORTS_ENABLED === "true" && (process.env.COMMUNITY_RANGE_SECRET?.length ?? 0) >= 32 && Boolean(process.env.ADMIN_PASSWORD);
export async function findReportStation(id: string) {
  if (!/^[a-zA-Z0-9_-]{1,150}$/.test(id)) return null;
  const local = chargingStations.find(s => s.id === id);
  if (local) return { id: local.id, name: local.name, address: local.address, operator: local.operator };
  try { return await prisma.station.findFirst({ where: { id, sourceStatus: { not: "REJECTED" } }, select: { id: true, name: true, address: true, operator: true } }); } catch { return null; }
}
