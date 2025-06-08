import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // If user is not authenticated and tries to access a protected route
  if (!token) {
    if (
      pathname.startsWith("/tickets") ||
      pathname.startsWith("/admin") ||
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next(); // Allow access to public routes
  }

  // If user is authenticated and tries to access signin or signup
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next(); // Allow access
}

export const config = {
  matcher: ["/", "/signup", "/signin", "/tickets/:path*", "/admin/:path*"],
};