import UserModel from "@/models/User";
import inngest from "../client";
import dbConnect from "@/lib/dbConnect";
import { NonRetriableError } from "inngest";
import { sendMail } from "@/lib/mailer";

export const onSignup = inngest.createFunction(
  {
    id: "on-signup",
    retries: 2,
  },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      const user = await step.run("get-user-email", async () => {
        dbConnect(); // Ensure the database is connected
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new NonRetriableError(`User with email ${email} not found`);
        }
        return user;
      });
      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to the Ticketing System";
        const text = `Hello ${user.email},
            \n\n
            Welcome to the Ticketing System! We're glad to have you on board.
            \n\n
            Best regards,
            \n
            The Ticketing System Team`;
        const res = await sendMail(user.email, subject, text);
        return res;
      });
      return { success: true };
    } catch (error) {
      console.error("Error in on-signup function:", error);
      return { success: false };
    }
  },
);
