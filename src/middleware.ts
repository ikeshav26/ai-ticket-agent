import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl;

  if (!token) {
    if (
      url.pathname.startsWith("/tickets") ||
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/")
    ) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    // Allow access to public pages
    else if (
      url.pathname === "/sign-in" ||
      url.pathname === "/sign-up" ||
      url.pathname.startsWith("/api/")
    ) {
      return NextResponse.next();
    }
  } else {
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: ["/", "/sign-up", "/sign-in", "/tickets/:path*", "/admin/:path*"],
};
