import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { appUrl, ensureReminderTables, randomToken, REMINDER_COOKIE, tokenHash } from "@/lib/email-reminders";
import { prisma } from "@/lib/prisma";
export async function GET(request: Request) {
  await ensureReminderTables();
  const token = new URL(request.url).searchParams.get("token") || "";
  const subscriber = await prisma.reminderSubscriber.findFirst({ where: { verificationTokenHash: tokenHash(token), verificationExpiresAt: { gt: new Date() } } });
  if (!subscriber) return NextResponse.redirect(`${appUrl()}/my-ev?email=invalid#owner-reminders`);
  const session = randomToken();
  await prisma.reminderSubscriber.update({ where: { id: subscriber.id }, data: { verifiedAt: new Date(), verificationTokenHash: null, verificationExpiresAt: null, sessionTokenHash: tokenHash(session), unsubscribedAt: null } });
  (await cookies()).set(REMINDER_COOKIE, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 31_536_000 });
  return NextResponse.redirect(`${appUrl()}/my-ev?email=verified#owner-reminders`);
}
