import { NextResponse } from "next/server";
import { appUrl, assertSameOrigin, CONSENT_VERSION, ensureReminderTables, randomToken, sendMail, tokenHash } from "@/lib/email-reminders";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request); const body = await request.json(); const email = String(body.email || "").trim().toLowerCase();
    await ensureReminderTables();
    if (!body.consent || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email and provide consent." }, { status: 400 });
    const existing = await prisma.reminderSubscriber.findUnique({ where: { email } });
    if (existing?.verificationSentAt && Date.now() - existing.verificationSentAt.getTime() < 60_000) return NextResponse.json({ error: "Please wait one minute before requesting another email." }, { status: 429 });
    const token = randomToken(); const data = { verificationTokenHash: tokenHash(token), verificationExpiresAt: new Date(Date.now() + 1_800_000), verificationSentAt: new Date(), consentedAt: new Date(), consentVersion: CONSENT_VERSION, unsubscribedAt: null };
    await prisma.reminderSubscriber.upsert({ where: { email }, create: { email, ...data }, update: data });
    await sendMail(email, "Verify your email for PlugV reminders", `Hello,\n\nConfirm this email address to use PlugV service and insurance reminders:\n\n${appUrl()}/api/reminders/email/verify?token=${encodeURIComponent(token)}\n\nThis link expires in 30 minutes. If you did not request this, ignore this email.\n\nPlugV Support`);
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("Reminder verification request failed", error); return NextResponse.json({ error: "Email reminders are temporarily unavailable. Please try again later." }, { status: 503 }); }
}
