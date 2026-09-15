import { prisma } from "@/lib/prisma";
import { validateTrip } from "@/lib/community-range";
import { communityEnabled, contributor, digest, readBody, pruneTrips } from "@/lib/community-range-server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!communityEnabled()) return Response.json({ message: "Community submissions are not open yet." }, { status: 503 });
  let trip;
  try { trip = validateTrip(await readBody(request)); } catch (e) { return Response.json({ message: e instanceof Error ? e.message : "Invalid report." }, { status: 400 }); }
  try {
    const id = (await contributor(true))!;
    await pruneTrips();
    const accepted = await prisma.$transaction(async tx => {
      // Serialize submissions so daily bounds hold across server instances.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(81729341)`;
      const since = new Date(Date.now() - 86400000);
      if (await tx.communityTrip.count({ where: { contributor: id, createdAt: { gte: since } } }) >= 3 || await tx.communityTrip.count({ where: { createdAt: { gte: since } } }) >= 500) return false;
      const fingerprint = digest(JSON.stringify([id, trip.slug, trip.variant, trip.date, trip.distance, trip.start, trip.end]));
      if (await tx.communityTrip.findUnique({ where: { fingerprint } })) return false;
      await tx.communityTrip.create({ data: { contributor: id, fingerprint, payload: trip } });
      return true;
    });
    return Response.json({ message: accepted ? "Received for private review. This report is not published. Keep this browser cookie to withdraw your reports." : "Duplicate report or daily submission limit reached." }, { status: accepted ? 201 : 429 });
  } catch { return Response.json({ message: "Submissions are temporarily unavailable. Please try later." }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  if (!communityEnabled()) return Response.json({ message: "Contact support@plugv.in for withdrawal." }, { status: 503 });
  try { await readBody(request); } catch { return Response.json({ message: "Invalid request." }, { status: 400 }); }
  try { const id = await contributor(); if (id) await prisma.communityTrip.deleteMany({ where: { contributor: id } }); return Response.json({ message: "Reports associated with this browser have been removed." }); }
  catch { return Response.json({ message: "Withdrawal unavailable. Please retry later." }, { status: 503 }); }
}
