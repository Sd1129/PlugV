import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { reviewTrip } from "./actions";
export const dynamic = "force-dynamic";
export default async function ReviewPage() {
  await requireAdmin();
  const rows = await prisma.communityTrip.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return <main className="mx-auto max-w-4xl p-6 text-white"><h1 className="text-3xl">Community range moderation</h1><p>Latest 100 reports. Check model/variant, units, conditions, duplicates, energy boundary and internal consistency. Reject personal information and unsupported readings. Approval means reviewed self-report, not independent verification. Reviewed reports can be rejected later to remove them from results.</p>{rows.map(row => <form action={reviewTrip} key={row.id} className="my-6 rounded border p-4"><p>{row.id} · {row.status}</p><pre className="whitespace-pre-wrap break-words">{JSON.stringify(row.payload, null, 2)}</pre><input type="hidden" name="id" value={row.id}/><label className="block"><input required type="checkbox" name="checked"/> I completed these checks.</label><label className="block">Private review rationale<textarea required minLength={20} maxLength={1000} name="note" className="block w-full bg-slate-900 p-2" defaultValue={row.reviewNote ?? ""}/></label><button name="status" value="APPROVED" className="m-2 rounded bg-cyan-300 p-3 text-slate-950">Approve self-report</button><button name="status" value="REJECTED" className="m-2 rounded border p-3">Reject / remove</button></form>)}</main>;
}
