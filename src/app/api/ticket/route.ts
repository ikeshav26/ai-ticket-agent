import dbConnect from "@/lib/dbConnect";
import TicketModel, { ITicket } from "@/models/Ticket";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
  try {
    const { id } = await req.json();
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Ticket ID is required" }),
        { status: 400 },
      );
    }
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    let ticket;
    if (!token) {
      // If the token is not present, return unauthorized
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401 },
      );
    }
    await dbConnect(); // Ensure the database is connected
    if (token.role !== "user") {
      const foundTicket = await TicketModel.findById(id)
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
      if (!foundTicket) {
        return new Response(
          JSON.stringify({ success: false, error: "Ticket not found" }),
          { status: 404 },
        );
      }
      ticket = foundTicket as ITicket;
    } else {
      // If the user is a regular user, only return their own tickets
      const foundTicket = await TicketModel.findOne({
        _id: id,
        createdBy: token.userId,
      }).select("title description status createdAt");
      if (!foundTicket) {
        return new Response(
          JSON.stringify({ success: false, error: "Ticket not found" }),
          { status: 404 },
        );
      }
      ticket = foundTicket as ITicket;
    }
    // Return the ticket in the response
    return new Response(JSON.stringify({ success: true, ticket }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in GET /api/ticket/getAllTickets:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 },
    );
  }
};
