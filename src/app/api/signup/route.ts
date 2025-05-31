import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import inngest from "@/inngest/client";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: NextRequest) {
  const { email, password, skills = [] } = await request.json();
  try {
    await dbConnect();
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      email,
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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "supersecretkey",
    );
    return NextResponse.json(
      {
        message: "Signup successful",
        token,
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
