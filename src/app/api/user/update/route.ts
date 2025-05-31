import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  const { email, skills, role } = await request.json();
  try {
    if (!email || !skills) {
      return NextResponse.json(
        { error: "Email, skills, and role are required" },
        { status: 400 },
      );
    }
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (token?.role !== "admin") {
      // If the user is not an admin, return a 403 Forbidden response
      console.error("Unauthorized access attempt by user:", token?.email);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (role) {
      // Update the user's role if provided
      user.role = role;
    }
    // Update the user's skills
    user.skills = skills;
    await user.save();
    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
