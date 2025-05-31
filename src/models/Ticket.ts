import mongoose, { Document } from "mongoose";

export interface ITicket extends Document {
  title: string;
  description: string;
  status: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  assignedTo: mongoose.Schema.Types.ObjectId;
  priority: string;
  deadline: Date;
  helpfulNote?: string;
  relatedSkills?: string[];
  createdAt: Date;
}

const ticketSchema = new mongoose.Schema<ITicket>({
  title: String,
  description: String,
  status: {
    type: String,
    default: "open",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  priority: {
    type: String,
  },
  deadline: {
    type: Date,
    default: null,
  },
  helpfulNote: {
    type: String,
  },
  relatedSkills: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TicketModel = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", ticketSchema);
export default TicketModel;
