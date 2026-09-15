"use server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export async function reviewTrip(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? ""); const status = String(form.get("status") ?? ""); const note = String(form.get("note") ?? "").trim();
  if (!/^[a-z0-9]{20,40}$/.test(id) || !["APPROVED", "REJECTED"].includes(status) || note.length < 20 || note.length > 1000 || form.get("checked") !== "on") throw Error("Review checklist and a 20–1000 character rationale are required.");
  await prisma.communityTrip.update({ where: { id }, data: { status, reviewedAt: new Date(), reviewNote: note } });
  revalidatePath("/community-range"); revalidatePath("/admin/community-range");
}
