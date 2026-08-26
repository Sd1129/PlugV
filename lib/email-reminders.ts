import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const REMINDER_COOKIE = "plugv_reminder_session";
export const CONSENT_VERSION = "email-reminders-2026-08-26";
let tablesReady: Promise<void> | undefined;

export function ensureReminderTables() {
  tablesReady ??= (async () => {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "ReminderSubscriber" ("id" TEXT PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "verifiedAt" TIMESTAMP(3), "verificationTokenHash" TEXT UNIQUE, "verificationExpiresAt" TIMESTAMP(3), "verificationSentAt" TIMESTAMP(3), "sessionTokenHash" TEXT UNIQUE, "consentedAt" TIMESTAMP(3), "consentVersion" TEXT, "unsubscribedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await prisma.$executeRawUnsafe(`DO $$ BEGIN CREATE TYPE "ReminderType" AS ENUM ('SERVICE','INSURANCE'); EXCEPTION WHEN duplicate_object THEN null; END $$`);
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "EmailReminder" ("id" TEXT PRIMARY KEY, "subscriberId" TEXT NOT NULL REFERENCES "ReminderSubscriber"("id") ON DELETE CASCADE, "type" "ReminderType" NOT NULL, "title" TEXT NOT NULL, "dueDate" TIMESTAMP(3) NOT NULL, "noticeDays" INTEGER NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "lastSentKey" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EmailReminder_subscriberId_active_idx" ON "EmailReminder"("subscriberId","active")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EmailReminder_dueDate_active_idx" ON "EmailReminder"("dueDate","active")`);
  })();
  return tablesReady;
}

export function randomToken() { return crypto.randomBytes(32).toString("base64url"); }
export function tokenHash(value: string) { return crypto.createHash("sha256").update(value).digest("hex"); }
export function appUrl() { return (process.env.APP_URL || "https://plugv.in").replace(/\/$/, ""); }

function signingSecret() {
  const value = process.env.REMINDER_SIGNING_SECRET;
  if (!value) throw new Error("REMINDER_SIGNING_SECRET is not configured.");
  return value;
}

export function unsubscribeSignature(id: string) {
  return crypto.createHmac("sha256", signingSecret()).update(id).digest("base64url");
}
export function validSignature(id: string, signature: string) {
  const expected = unsubscribeSignature(id);
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function currentSubscriber() {
  await ensureReminderTables();
  const raw = (await cookies()).get(REMINDER_COOKIE)?.value;
  if (!raw) return null;
  return prisma.reminderSubscriber.findFirst({ where: { sessionTokenHash: tokenHash(raw), verifiedAt: { not: null }, unsubscribedAt: null } });
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new Error("INVALID_ORIGIN");
}

function transporter() {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_APP_PASSWORD;
  if (!user || !pass) throw new Error("Email delivery is not configured.");
  return nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.in",
    port: Number(process.env.ZOHO_SMTP_PORT || 465),
    secure: true,
    auth: { user, pass },
  });
}

export async function sendMail(to: string, subject: string, text: string) {
  return transporter().sendMail({ from: process.env.EMAIL_FROM || "PlugV Support <support@plugv.in>", to, subject, text });
}
