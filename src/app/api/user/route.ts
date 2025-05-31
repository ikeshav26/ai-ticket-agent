import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token || token.role !== "admin") {
            // If the user is not an admin, return a 403 Forbidden response
            console.error("Unauthorized access attempt by user:", token?.email);
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        await dbConnect();
        const users = await UserModel.find({}, "-password"); // Exclude password field
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}