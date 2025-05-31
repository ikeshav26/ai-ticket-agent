import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "  Enter your email" },
                password: { label: "Password", type: "password", placeholder: "  Enter your password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                const { email, password } = credentials || {};

                if (!email || !password) {
                    throw new Error("Email and password are required");
                }
                try {
                    await dbConnect();
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        throw new Error("No user found with the provided email");
                    }
                    //NOTE -  verify the password
                    const isPasswordValid = await bcrypt.compare(password, user.password)
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    // Return user object if authentication is successful
                    return {
                        _id: user._id,
                        email: user.email,
                        role: user.role,
                        skills: user.skills || [],
                        createdAt: user.createdAt,
                    };


                }
                catch (error) {
                    console.error("Error during authentication:", error);
                    throw new Error("Authentication failed");
                }
            },

        })
    ],
    callbacks: {
        jwt: async ({ session, token, user, trigger }) => {
            if (user) {
                token._id = user._id;
                token.email = user.email;
                token.role = user.role;
                token.skills = user.skills || [];
                token.createdAt = user.createdAt.toISOString(); // Convert Date to string
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as "user" | "moderator" | "admin";
                session.user.skills = token.skills as string[];
                session.user.createdAt = new Date(token.createdAt as string);
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
        error: "/signin", // Error page URL
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}