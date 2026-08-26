import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { appUrl, REMINDER_COOKIE, validSignature } from "@/lib/email-reminders";
import { prisma } from "@/lib/prisma";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams; const id = params.get("id") || ""; const signature = params.get("sig") || "";
  if (!id || !signature || !validSignature(id, signature)) return NextResponse.redirect(`${appUrl()}/my-ev?email=invalid#owner-reminders`);
  await prisma.$transaction([prisma.emailReminder.updateMany({ where: { subscriberId: id }, data: { active: false } }), prisma.reminderSubscriber.update({ where: { id }, data: { unsubscribedAt: new Date(), sessionTokenHash: null } })]);
  (await cookies()).delete(REMINDER_COOKIE); return NextResponse.redirect(`${appUrl()}/my-ev?email=unsubscribed#owner-reminders`);
}
