"use server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export async function reviewStationReport(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  const note = String(form.get("note") ?? "").trim();
  if (!/^[a-z0-9]{20,40}$/.test(id) || !["APPROVED","REJECTED"].includes(status) || note.length<20 || note.length>1000 || form.get("checked")!=="on") throw Error("Complete the checklist and a 20–1000 character review rationale.");
  await prisma.stationReport.update({where:{id},data:{status,reviewedAt:new Date(),reviewNote:note}});
  revalidatePath("/charging/report"); revalidatePath("/admin/station-reports");
}
