import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// This file handles the NextAuth authentication routes for both GET and POST requests.
// It uses the authOptions defined in the lib/auth.ts file to configure the authentication process.
// The GET and POST exports allow Next.js to handle authentication requests appropriately.
// The handler is exported for use in the Next.js API routes, allowing for user authentication via NextAuth.js.
