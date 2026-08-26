import { NextResponse } from "next/server";
import { syncOpenChargeMapIndia } from "@/lib/charging/openChargeMapSync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncOpenChargeMapIndia();
    console.info("Open Charge Map India sync completed", result);
    return NextResponse.json({ ok: true, source: "Open Charge Map", country: "IN", ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown charging sync error";
    console.error("Open Charge Map India sync failed", { message });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
