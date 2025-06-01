import { serve } from "inngest/next";
import inngest from "@/inngest/client";
import { onSignup } from "@/inngest/functions/on-signup";
import { onTicketCreated } from "@/inngest/functions/on-ticket-create";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [onSignup, onTicketCreated],
});
