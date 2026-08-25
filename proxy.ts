import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER ?? "plugv";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="PlugV Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  if (!ADMIN_PASSWORD) return unauthorized();

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(auth.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return unauthorized();

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) return unauthorized();

    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

