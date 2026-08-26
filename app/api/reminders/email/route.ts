import { NextResponse } from "next/server";
import { assertSameOrigin, currentSubscriber } from "@/lib/email-reminders";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const subscriber = await currentSubscriber(); if (!subscriber) return NextResponse.json({ verified: false, reminders: [] });
  const reminders = await prisma.emailReminder.findMany({ where: { subscriberId: subscriber.id, active: true }, orderBy: { dueDate: "asc" } }); const [local, domain] = subscriber.email.split("@");
  return NextResponse.json({ verified: true, email: `${local.slice(0, 2)}***@${domain}`, reminders: reminders.map((item) => ({ id: item.id, type: item.type === "SERVICE" ? "Service" : "Insurance", title: item.title, date: item.dueDate.toISOString().slice(0, 10), notifyDays: item.noticeDays, email: true })) });
}
export async function POST(request: Request) {
  try { assertSameOrigin(request); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 403 }); }
  const subscriber = await currentSubscriber(); if (!subscriber) return NextResponse.json({ error: "Verify your email first." }, { status: 401 });
  const body = await request.json(); const title = String(body.title || "").trim(); const date = String(body.date || ""); const noticeDays = Number(body.notifyDays);
  if (!title || title.length > 100 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || ![0,1,3,7,14,30].includes(noticeDays) || !["Service","Insurance"].includes(body.type)) return NextResponse.json({ error: "Check the reminder details." }, { status: 400 });
  if (date < new Date().toISOString().slice(0,10)) return NextResponse.json({ error: "Choose today or a future date." }, { status: 400 });
  const reminder = await prisma.emailReminder.create({ data: { subscriberId: subscriber.id, type: body.type === "Service" ? "SERVICE" : "INSURANCE", title, dueDate: new Date(`${date}T00:00:00.000Z`), noticeDays } }); return NextResponse.json({ id: reminder.id });
}
export async function DELETE(request: Request) {
  try { assertSameOrigin(request); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 403 }); }
  const subscriber = await currentSubscriber(); if (!subscriber) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id"); if (!id) return NextResponse.json({ error: "Missing reminder." }, { status: 400 });
  await prisma.emailReminder.deleteMany({ where: { id, subscriberId: subscriber.id } }); return NextResponse.json({ ok: true });
}
