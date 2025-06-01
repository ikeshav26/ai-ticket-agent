import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  skills?: string[];
  createdAt: Date; // Optional field for skills
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "moderator", "admin"],
  },
  skills: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
