import { prisma } from "@/lib/prisma";
import { contributor, digest, readBody } from "@/lib/community-range-server";
import { validateStationReport } from "@/lib/charging/stationReports";
import { reportsEnabled, findReportStation } from "@/lib/charging/stationReportStore";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!reportsEnabled()) return Response.json({ message: "Station reporting is not open yet." }, { status: 503 });
  let report;
  try { report = validateStationReport(await readBody(request)); } catch (e) { return Response.json({ message: e instanceof Error ? e.message : "Invalid report." }, { status: 400 }); }
  if (!await findReportStation(report.stationId)) return Response.json({ message: "Station not found. Return to the charging list." }, { status: 404 });
  try {
    const owner = (await contributor(true))!;
    const accepted = await prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(81729342)`;
      await tx.stationReport.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 180 * 86400000) } } });
      const since = new Date(Date.now() - 86400000);
      if (await tx.stationReport.count({ where: { contributor: owner, createdAt: { gte: since } } }) >= 5 || await tx.stationReport.count({ where: { createdAt: { gte: since } } }) >= 500) return false;
      const fingerprint = digest(JSON.stringify([owner, report.stationId, report.visitedAt.slice(0,10), report.connector, report.outcome]));
      if (await tx.stationReport.findUnique({ where: { fingerprint } })) return false;
      await tx.stationReport.create({ data: { stationId: report.stationId, contributor: owner, fingerprint, payload: report } }); return true;
    });
    return Response.json({ message: accepted ? "Received for private review. Your report does not change live availability. Keep this browser cookie to withdraw it." : "Duplicate report or daily submission limit reached." }, { status: accepted ? 201 : 429 });
  } catch { return Response.json({ message: "Reporting is temporarily unavailable. Please try later." }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  if ((process.env.COMMUNITY_RANGE_SECRET?.length ?? 0) < 32) return Response.json({ message: "Contact support@plugv.in for withdrawal help." }, { status: 503 });
  try { await readBody(request); } catch { return Response.json({ message: "Invalid request." }, { status: 400 }); }
  try { const owner = await contributor(); if (owner) await prisma.stationReport.deleteMany({ where: { contributor: owner } }); return Response.json({ message: "Station reports associated with this browser have been deleted." }); } catch { return Response.json({ message: "Withdrawal is unavailable. Retry later or contact support@plugv.in." }, { status: 503 }); }
}
