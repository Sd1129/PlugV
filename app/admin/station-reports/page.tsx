import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { reviewStationReport } from "./actions";
export const dynamic = "force-dynamic";
export default async function StationReportQueue({searchParams}:{searchParams:Promise<{page?:string}>}) {
  await requireAdmin();
  const params=await searchParams; const page=Math.max(1,Math.min(10000,Number.parseInt(params.page??"1",10)||1));
  let rows;
  try { rows=await prisma.stationReport.findMany({orderBy:[{createdAt:"desc"},{id:"desc"}],skip:(page-1)*25,take:25}); }
  catch {return <main className="p-8 text-white"><h1>Station report queue unavailable</h1><p>Check the database connection and additive StationReport table setup.</p></main>;}
  return <main className="mx-auto max-w-4xl p-6 text-slate-100"><h1 className="text-3xl">Station report moderation</h1><p>Check the station, visit time, connector, duplicates and consistency. Reject copied content and personal information. Approving publishes only the outcome, connector, visit and review times. A report is not independently verified or live status. Confirm corrections with a permitted primary source before editing a station separately.</p>{rows.map(r=><form key={r.id} action={reviewStationReport} className="my-6 rounded border border-slate-600 p-4"><p>{r.status} · {r.createdAt.toISOString()}</p><Link className="underline text-cyan-200" href={`/charging/report?station=${encodeURIComponent(r.stationId)}`}>Station {r.stationId}</Link><pre className="my-3 whitespace-pre-wrap break-words">{JSON.stringify(r.payload,null,2)}</pre><input type="hidden" name="id" value={r.id}/><label className="block"><input name="checked" type="checkbox" required/> I checked this report against the review criteria.</label><label className="block">Private rationale<textarea name="note" required minLength={20} maxLength={1000} defaultValue={r.reviewNote??""} className="block w-full rounded bg-slate-800 p-3"/></label><button name="status" value="APPROVED" className="m-2 rounded bg-cyan-300 p-3 text-slate-950">Approve observation</button><button name="status" value="REJECTED" className="m-2 rounded border p-3">Reject / remove</button></form>)}<nav aria-label="Report pages" className="flex gap-6">{page>1&&<Link href={`?page=${page-1}`}>Previous</Link>}{rows.length===25&&<Link href={`?page=${page+1}`}>Next</Link>}</nav></main>;
}
