import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { findReportStation, reportsEnabled } from "@/lib/charging/stationReportStore";
import { publicObservation } from "@/lib/charging/stationReports";
import ReportForm from "./ReportForm";
export const dynamic = "force-dynamic";
export const metadata = { title: "Station reports | PlugV", robots: { index: false, follow: true } };
export default async function StationReportPage({ searchParams }: { searchParams: Promise<{ station?: string }> }) {
  const { station: id } = await searchParams;
  const station = await findReportStation(typeof id === "string" ? id : "");
  if (!station) return <main className="mx-auto max-w-3xl p-8 text-slate-100"><h1 className="text-3xl">Choose a charging station</h1><p>Open a station from <Link href="/charging" className="underline">the charging list</Link> and select “Report / view driver observations”.</p></main>;
  let enabled = reportsEnabled();
  let available = false;
  let observations: NonNullable<ReturnType<typeof publicObservation>>[] = [];
  try {
    const rows = await prisma.stationReport.findMany({ where: { stationId: station.id, status: "APPROVED", createdAt: { gte: new Date(Date.now()-90*86400000) } }, orderBy: { createdAt: "desc" }, take: 50 });
    observations = rows.map(publicObservation).filter((r): r is NonNullable<typeof r> => r !== null);
    available = true;
  } catch { enabled = false; }
  return <main className="mx-auto max-w-3xl px-5 py-10 text-slate-100"><Link href="/charging" className="text-cyan-200 underline">Back to charging stations</Link><h1 className="mt-6 text-3xl font-bold">{station.name}</h1><p>{station.operator} · {station.address}</p><section className="mt-8 space-y-3"><h2 className="text-2xl">Reviewed driver observations</h2><p>Source: original driver submissions reviewed by PlugV for consistency. Not independently verified. Reports do not confirm current availability, reserve a connector or automatically correct station details. Showing up to 50 recent reports; visits older than 90 days are omitted.</p>{!available ? <p>Driver observations are temporarily unavailable.</p> : observations.length===0 ? <p>No reviewed observations to display yet.</p> : observations.map(r=><article key={r.id} className="rounded border border-slate-600 p-4"><p className="font-semibold">Driver reported: {r.outcome}</p><p>{r.connector} · Visit: <time dateTime={r.visitedAt}>{new Date(r.visitedAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST</time></p><p>Reviewed: <time dateTime={r.reviewedAt}>{new Date(r.reviewedAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST</time></p></article>)}</section><ReportForm stationId={station.id} enabled={enabled}/></main>;
}
