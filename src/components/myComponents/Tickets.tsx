"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      toast.success("Ticket created successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create ticket.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToast=()=>{
    toast.success("Ticket details loaded successfully!");
  }

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>You must be signed in to view tickets.</p>;

  return (
    <div className="ticketContainer w-full min-h-screen px-4 pt-20 pb-10 lg:pb-1">
      <div className="flex flex-col md:flex-row items-center justify-center gap-30 md:gap-7">
        <div className=" w-[70%] md:w-[35%] h-[40vh] md:h-[60vh] flex flex-col justify-center items-center gap-5 pt-10 md:pt-0">
          <h1 className="font-bold text-3xl">CREATE TICKET</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-center justify-center">
            <div className="flex flex-col gap-1">
              <p>Title</p>
              <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="Enter Ticket Title" className="input w-60  lg:w-100 rounded-full focus:outline-none"/>
            </div>
            <div className="flex flex-col gap-1">
              <p>Description</p>
              <textarea name="description" value={form.description} onChange={handleChange} required  placeholder="Enter Ticket Description" className="input w-60 h-20  lg:w-100 rounded-2xl pt-3 focus:outline-none"/>
            </div>
            <div className="flex flex-col gap-1"> 
              <button type="submit" className="bttn w-60  lg:w-100 rounded-full py-2 px-1 mt-3 md:mt-2 cursor-pointer" disabled={loading}>{loading?"Submitting Ticket..":"Submit Ticket"}</button>
            </div>
          </form>
        </div>
        <div className=" w-[90%] md:w-[60%]  overflow-y-auto  max-h-[80vh]">
          <div className="flex items-center justify-between  p-4 border-2">
            <h3 className="font-bold text-xl">Ticket ID</h3>
            <h3 className="font-bold text-xl">Title</h3>
            <h3 className="font-bold text-xl">Created At</h3>
          </div>
          {tickets.map((ticket) => (
            <Link href={`/tickets/${ticket._id}`} onClick={handleToast} key={ticket._id} className="flex items-center justify-between p-5 border-l-2 border-r-2 border-b-2">
              <p>#{ticket._id.slice(-4)}</p>
              <p>{ticket.title}</p>
              <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
          {tickets.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className=" text-2xl">No tickets found.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
