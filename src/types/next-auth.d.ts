import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            email: string;
            role: "user" | "moderator" | "admin";
            skills?: string[];
            createdAt: Date;
        } & DefaultSession["user"];

    }
    interface User {
        _id: string;
        email: string;
        role: "user" | "moderator" | "admin";
        skills?: string[];
        createdAt: Date;
    }
    interface JWT {
        _id: string;
        email: string;
        role: "user" | "moderator" | "admin";
        skills?: string[];
        createdAt: string; // Use string to match the session type
    }
}