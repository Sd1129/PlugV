import "server-only";
import { cookies } from "next/headers";
import { createHmac, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
export const communityEnabled = () => process.env.COMMUNITY_RANGE_ENABLED === "true" && (process.env.COMMUNITY_RANGE_SECRET?.length ?? 0) >= 32;
export function digest(value: string) { return createHmac("sha256", process.env.COMMUNITY_RANGE_SECRET!).update(value).digest("hex"); }
export async function contributor(create = false) {
  const jar = await cookies();
  let token = jar.get("plugv-community")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    if (!create) return null;
    token = randomBytes(32).toString("hex");
    jar.set("plugv-community", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 180 * 86400, path: "/" });
  }
  return digest(token);
}
export async function readBody(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw Error("Invalid origin.");
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw Error("JSON required.");
  const reader = request.body?.getReader();
  if (!reader) throw Error("Missing body.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 8192) { await reader.cancel(); throw Error("Report too large."); } chunks.push(value); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function pruneTrips() { await prisma.communityTrip.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 180 * 86400000) } } }); }
