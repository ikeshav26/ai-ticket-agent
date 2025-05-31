import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                //REVIEW - Auth related paths
                const { pathname } = req.nextUrl;
                if (pathname.startsWith("/api/auth") ||
                    pathname == "/login" ||
                    pathname == "/register"
                ) {
                    return true; // Allow access to authentication routes
                }

                //public

                if (pathname === "/") {
                    return true; // Allow access to the home page
                }

                return !!token;
                //NOTE - You can add more conditions here to restrict access based on user roles

            },
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: [
        //NOTE - ADD paths that should be protected by authentication
        "/",
        "/dashboard/:path*",
        "/profile/:path*",
        "/settings/:path*",
        "/admin/:path*",
        "/moderator/:path*",

    ]
}