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
      <div className="bg-red-400 w-[60%] h-[70vh] flex flex-col items-center justify-center">
        <div className="flex flex-col gap-3">
          <h1>Ticket #{ticket._id.slice(-4)}</h1>
          <p>Description : {ticket.title || "NA"}</p>
        </div>
        <div>
          <h1>Ticket details</h1>
        </div>
         <div>
          <p>{ticket.description}</p>
         </div>
        <div>
          <p>
            <span>Status</span>
            <span>{ticket.status || "NA"}</span>
          </p>
          <p>
            <span>Priority</span>
            <span>{ticket.priority || "NA"}</span>
          </p>
        </div>
        <div>
          <p>
            <span>Created At</span>
            <span>{ticket.createdAt
                ? new Date(ticket.createdAt).toLocaleString()
                : "N/A"}</span>
          </p>
          <p>
            <span>Assigned To</span>
            <span>{ticket.assignedTo?.email || "NA"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
