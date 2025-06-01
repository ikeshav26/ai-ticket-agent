"use client";

import TicketDetailsPage from "@/components/myComponents/Ticket";
import { useParams } from "next/navigation";

export default function HomePage() {
  const params = useParams();
  return <TicketDetailsPage id={params.id as string} />;
}
