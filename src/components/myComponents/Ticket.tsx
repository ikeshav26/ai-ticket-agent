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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>

      <div className="card bg-gray-800 shadow p-4 space-y-4">
        <h3 className="text-xl font-semibold">{ticket.title}</h3>
        <p>{ticket.description}</p>

        {ticket.status && (
          <>
            <div className="divider">Metadata</div>
            <p>
              <strong>Status:</strong> {ticket.status}
            </p>
            {ticket.priority && (
              <p>
                <strong>Priority:</strong> {ticket.priority}
              </p>
            )}
            {Array.isArray(ticket.relatedSkills) &&
              ticket.relatedSkills.length > 0 && (
                <p>
                  <strong>Related Skills:</strong>{" "}
                  {ticket.relatedSkills.join(", ")}
                </p>
              )}
            {ticket.helpfulNotes && (
              <div>
                <strong>Helpful Notes:</strong>
                <div className="prose max-w-none rounded mt-2">
                  <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
                </div>
              </div>
            )}
            {ticket.assignedTo && (
              <p>
                <strong>Assigned To:</strong> {ticket.assignedTo.email}
              </p>
            )}
            {ticket.createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Created At: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
