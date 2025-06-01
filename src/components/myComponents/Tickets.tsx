"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Tickets() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/api/ticket/getAllTickets");
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchTickets();
    }
  }, [status]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/ticket/create", form);

      setForm({ title: "", description: "" });
      fetchTickets(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || "Ticket creation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>You must be signed in to view tickets.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket._id}
            href={`/tickets/${ticket._id}`}
            className="card shadow-md p-4 bg-gray-800 block"
          >
            <h3 className="font-bold text-lg">{ticket.title}</h3>
            <p className="text-sm">{ticket.description}</p>
            <p className="text-sm text-gray-500">
              Created At: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
        {tickets.length === 0 && <p>No tickets submitted yet.</p>}
      </div>
    </div>
  );
}
