"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status?: string;
  priority?: string;
  relatedSkills?: string[];
  helpfulNotes?: string;
  assignedTo?: {
    email: string;
  };
  createdAt?: string;
}

export default function TicketDetailsPage({ id }: { id?: string }) {
  const { data: session, status } = useSession();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`/api/ticket/${id}`);
        setTicket(res.data.ticket);
      } catch (err: any) {
        console.error("Error fetching ticket:", err);
        alert("Failed to fetch ticket");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchTicket();
    }
  }, [id, status]);

  if (status === "loading" || loading)
    return <div className="text-center mt-10">Loading ticket details...</div>;

  if (!session)
    return <div className="text-center mt-10">You must be signed in.</div>;
  if (!ticket) return <div className="text-center mt-10">Ticket not found</div>;

  return (
    <div className="ticketContainer w-full min-h-screen pt-25 flex items-center justify-center">
      <div className="border-2 rounded-xl w-[90%] md:w-[60%] h-[80vh] md:h-[70vh] flex flex-col items-start justify-center gap-5 p-10 md:p-16 ">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-5xl font-bold">Ticket #{ticket._id.slice(-4)}</h1>
          <p className="text-xl md:text-3xl font-semibold capitalize">Title : {ticket.title || "NA"}</p>
        </div>
        <div>
          <h1 className="text-sm md:text-lg">Ticket details</h1>
        </div>
         <div className="border-t-2 w-full pt-2">
          <p className="flex flex-col items-center justify-center gap-2">
            <span className="font-bold text-xl ">Description</span>
            <span className="capitalize text-sm md:text-lg">{ticket.description}</span>
          </p>
         </div>
        <div className="border-t-2 w-full flex items-center justify-between pt-2">
          <p className="flex flex-col items-center justify-center gap-2">
            <span className="font-bold text-lg md:text-xl">Status</span>
            <span className="text-sm md:text-lg">{ticket.status || "NA"}</span>
          </p>
          <p className="flex flex-col items-center justify-center gap-2">
            <span className="font-bold text-lg md:text-xl">Priority</span>
            <span className="text-sm md:text-lg">{ticket.priority || "NA"}</span>
          </p>
        </div>
        <div className="border-t-2 w-full flex items-center justify-between pt-2">
          <p className="flex flex-col items-center justify-center gap-2">
            <span className="font-bold text-lg md:text-xl">Created At</span>
            <span className="text-sm md:text-lg w-20 md:w-auto">{ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleString()
                : "N/A"}</span>
          </p>
          <p className="flex flex-col items-center justify-center gap-2">
            <span className="font-bold md:text-xl text-lg">Assigned To</span>
            <span className="text-sm md:text-lg">{ticket.assignedTo?.email || "NA"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
