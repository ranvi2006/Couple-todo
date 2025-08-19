import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  user: { type: String, required: true },
  task: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ["pending", "done"], default: "pending" },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("Todo", todoSchema);
