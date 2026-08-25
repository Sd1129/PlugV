import "server-only";

import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";

function matches(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function requireAdmin() {
  const expectedUser = process.env.ADMIN_USER ?? "plugv";
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const authorization = (await headers()).get("authorization");

  if (!expectedPassword || !authorization?.startsWith("Basic ")) {
    throw new Error("Unauthorized admin operation.");
  }

  try {
    const decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) throw new Error("Unauthorized admin operation.");
    const user = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    if (!matches(user, expectedUser) || !matches(password, expectedPassword)) {
      throw new Error("Unauthorized admin operation.");
    }
  } catch {
    throw new Error("Unauthorized admin operation.");
  }
}
