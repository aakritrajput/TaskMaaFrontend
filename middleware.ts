import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token"); // or however you store auth

//   const isAuthenticated = !!token;

// for now we will make fake isAuthenticated which will be true

  const isAuthenticated = true;
  const { pathname } = req.nextUrl;

  // Redirect authenticated user from "/" → "/user/dashboard"
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  // Redirect non-authenticated users from protected routes
  if (pathname.startsWith("/user") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/user/:path*"], // apply middleware only to these paths
};
