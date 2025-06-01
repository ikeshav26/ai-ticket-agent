import inngest from "@/inngest/client";
import dbConnect from "@/lib/dbConnect";
import TicketModel, { ITicket } from "@/models/Ticket";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const POST = async (req: NextRequest) => {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401 },
      );
    }
    console.log(token);
    const userId = token._id;
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User ID not found" }),
        { status: 400 },
      );
    }
    await dbConnect(); // Ensure the database is connected
    const { title, description } = await req.json();

    if (!title || !description || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400 },
      );
    }

    // Create a new ticket in the database
    const newTicket = await TicketModel.create({
      title,
      description,
      createdBy: userId,
      status: "TODO",
      priority: "medium", // Default priority
      relatedSkills: [],
      helpfulNotes: "",
    });

    // Trigger the Inngest function for ticket creation
    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id,
        title: newTicket.title,
        description: newTicket.description,
        createdBy: newTicket.createdBy,
      },
    });

    return new Response(JSON.stringify({ success: true, newTicket }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error in POST /api/ticket/create:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 },
    );
  }
};
