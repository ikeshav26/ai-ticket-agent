import dbConnect from "@/lib/dbConnect";
import TicketModel, { ITicket } from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    let tickets: ITicket[] = [];
    if (!token) {
      // If the token is not present, return unauthorized
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    await dbConnect(); // Ensure the database is connected
    if (token.role === "admin") {
      tickets = await TicketModel.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    }
    if (token.role === "moderator") {
      tickets = await TicketModel.find({ assignedTo: token._id })
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    }
    if (token.role === "user") {
      tickets = await TicketModel.find({ createdBy: token._id });
    }
    if (tickets.length === 0) {
      return NextResponse.json(
        { success: false, error: "No tickets found" },
        { status: 404 },
      );
    }
    // Return the tickets in the response

    return NextResponse.json({ success: true, tickets }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/ticket/getAllTickets:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
