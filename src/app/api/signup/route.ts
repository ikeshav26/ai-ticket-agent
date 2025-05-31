import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import inngest from "@/inngest/client";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: NextRequest) {
  const { email, password, skills = [] } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  const normalizedEmail = email.toLowerCase().trim();


  try {
    console.log("Received signup request:", { email, skills });
    await dbConnect();
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }
    // Validate email and password
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      normalizedEmail,
      password: hashed,
      skills,
    });

    // Fire the Inngest event for user signup
    await inngest.send({
      name: "user/signup",
      data: {
        email: user.email,
      },
    });
    return NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          skills: user.skills,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
