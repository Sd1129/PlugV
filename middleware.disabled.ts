import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER ?? "plugv";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="PlugV Admin", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin/charging")) {
    return NextResponse.next();
  }

  if (!ADMIN_PASSWORD) {
    return unauthorized();
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const decoded = atob(auth.slice(6));
    const colonIndex = decoded.indexOf(":");

    if (colonIndex === -1) {
      return unauthorized();
    }

    const username = decoded.slice(0, colonIndex);
    const password = decoded.slice(colonIndex + 1);

    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return unauthorized();
    }

    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/admin/charging/:path*"],
};