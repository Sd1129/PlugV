import { NextResponse } from "next/server";
import { operationsAlertText, runDailyOperations } from "@/lib/operations/dailyOperations";
import { sendMail } from "@/lib/email-reminders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function alertRecipients() {
  return (process.env.OPERATIONS_ALERT_EMAILS || "manzoorsyed02@yahoo.com")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDailyOperations();
  const alertDelivery: { attempted: boolean; delivered: boolean; error?: string } = {
    attempted: false,
    delivered: false,
  };

  if (result.failures.length) {
    alertDelivery.attempted = true;
    try {
      await sendMail(
        alertRecipients().join(","),
        `[PlugV operations] ${result.failures.length} failure(s) require attention`,
        operationsAlertText(result),
      );
      alertDelivery.delivered = true;
    } catch (error) {
      alertDelivery.error = error instanceof Error ? error.message : String(error);
      console.error("PlugV operations alert email failed", alertDelivery.error);
    }
  }

  console.info("PlugV daily operations completed", { ...result, alertDelivery });
  return NextResponse.json(
    { ok: result.failures.length === 0, ...result, alertDelivery },
    { status: result.failures.length ? 500 : 200 },
  );
}
