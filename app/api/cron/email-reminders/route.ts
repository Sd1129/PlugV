import { NextResponse } from "next/server";
import { appUrl, ensureReminderTables, sendMail, unsubscribeSignature } from "@/lib/email-reminders";
import { prisma } from "@/lib/prisma";
export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureReminderTables();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const reminders = await prisma.emailReminder.findMany({ where: { active: true, subscriber: { verifiedAt: { not: null }, unsubscribedAt: null } }, include: { subscriber: true } }); let sent = 0;
  for (const reminder of reminders) {
    const due = reminder.dueDate.toISOString().slice(0,10); const notice = new Date(`${due}T00:00:00.000Z`); notice.setUTCDate(notice.getUTCDate()-reminder.noticeDays); const key = `${due}:${reminder.noticeDays}`;
    if (today < notice.toISOString().slice(0,10) || today > due || reminder.lastSentKey === key) continue;
    const formatted = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(reminder.dueDate); const unsubscribe = `${appUrl()}/api/reminders/email/unsubscribe?id=${reminder.subscriber.id}&sig=${unsubscribeSignature(reminder.subscriber.id)}`;
    await sendMail(reminder.subscriber.email, `PlugV reminder: ${reminder.title}`, `Hello,\n\nThis is your PlugV ${reminder.type === "SERVICE" ? "service" : "insurance"} reminder.\n\n${reminder.title}\nDue date: ${formatted}\n\nPlease confirm the appointment or renewal directly with your service centre or insurer.\n\nStop email reminders: ${unsubscribe}\n\nPlugV Support`);
    await prisma.emailReminder.update({ where: { id: reminder.id }, data: { lastSentKey: key } }); sent++;
  }
  return NextResponse.json({ ok: true, checked: reminders.length, sent });
}
