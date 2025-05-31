import TicketModel, { ITicket } from "@/models/Ticket";
import UserModel from "@/models/User";
import inngest from "../client";
import dbConnect from "@/lib/dbConnect";
import { NonRetriableError } from "inngest";
import { sendMail } from "@/lib/mailer";
import analyzeTicket from "@/lib/ai";

export const onTicketCreated = inngest.createFunction(
    {
        id: "on-ticket-created",
        retries: 2,
    },
    { event: "ticket/created" },
    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;
            dbConnect(); // Ensure the database is connected

            // Create a new ticket in the database
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await TicketModel.findById(ticketId);
                if (!ticketObject) {
                    throw new NonRetriableError(`Ticket with ID ${ticketId} not found`);
                }
                return ticketObject;
            }) as ITicket;

            await step.run("update-ticket-status", async () => {

                await TicketModel.findByIdAndUpdate(ticket._id, {
                    status: "TODO",
                })
            })

            // Send a confirmation email to the user
            const aiResponse = await analyzeTicket(ticket);

            const relatedSkills = await step.run("ai-processing", async () => {
                let skills = [];
                if (!aiResponse) {
                    throw new NonRetriableError("AI processing failed");
                }
                await TicketModel.findByIdAndUpdate(ticket._id, {
                    priority: ["low", "medium", "high"].includes(aiResponse.priority) ? aiResponse.priority : "medium",
                    helpfulNotes: aiResponse.helpfulNotes,
                    status: "IN_PROGRESS",
                    relatedSkills: aiResponse.relatedSkills,
                });
                skills = aiResponse.relatedSkills;
                return skills;
            });

            const moderator = await step.run("assign-moderator", async () => {
                let user = await UserModel.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i", // Case-insensitive match
                        }
                    }
                });
                if (!user) {
                    user = await UserModel.findOne({ role: "admin" });
                }
                await TicketModel.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id,
                });
                return user;
            })

            await step.run("send-email-notification", async () => {
                if (!moderator) {
                    throw new NonRetriableError("No moderator found to assign the ticket");
                }
                const finalTicket = await TicketModel.findById(ticket._id);
                if (!finalTicket) {
                    throw new NonRetriableError(`Ticket with ID ${ticket._id} not found after update`);
                }
                const subject = `New Ticket Created: ${ticket.title}`;
                const text = `Hello ${moderator.email},
                \n\nA new ticket has been created with the following details:
                \n\nTitle: ${finalTicket.title}
                \nPriority: ${finalTicket.priority}
                \n\nPlease review and take necessary action.
                \n\nBest regards,
                \nThe Ticketing System Team`;
                await sendMail(moderator.email, subject, text);
            });
        } catch (error) {
            console.error("Error in on-ticket-created function:", error);
            throw new NonRetriableError("Failed to create ticket");
        }
    }
)