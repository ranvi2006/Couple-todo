import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotEnv from "dotenv";
import Todo from "./models/Todo.js";

dotEnv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// 🛠 Utility: normalize date to YYYY-MM-DD
function normalizeDate(dateInput) {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ➕ Add todo (❌ Block past days)
app.post("/api/todo", async (req, res) => {
  try {
    const { date } = req.body;
    const today = normalizeDate(new Date());
    const givenDate = normalizeDate(date);

    if (givenDate < today) {
      return res.status(403).json({ error: "Cannot add todo for past days" });
    }

    const todo = new Todo({ ...req.body, status: "pending" });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 Get todos by user & date
app.get("/api/todo/:user/:date", async (req, res) => {
  const { user, date } = req.params;
  const givenDate = normalizeDate(date);
  const todos = await Todo.find({ user, date: givenDate });
  res.json(todos);
});

// 🔄 Toggle status (❌ Block past days)
app.put("/api/todo/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  const today = normalizeDate(new Date());
  const todoDate = normalizeDate(todo.date);

  if (todoDate < today) {
    return res.status(403).json({ error: "Cannot edit old todos" });
  }

  todo.status = todo.status === "done" ? "pending" : "done";
  if (todo.status === "done") todo.completedAt = new Date();
  await todo.save();
  res.json(todo);
});

// ❌ Delete (❌ Block past days)
app.delete("/api/todo/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  const today = normalizeDate(new Date());
  const todoDate = normalizeDate(todo.date);

  if (todoDate < today) {
    return res.status(403).json({ error: "Cannot delete old todos" });
  }

  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 📊 Performance (by date or all history)
app.get("/api/performance/:user", async (req, res) => {
  const { user } = req.params;
  const { date } = req.query; // optional query param

  let filter = { user };
  if (date) {
    filter.date = normalizeDate(date);
  }

  const todos = await Todo.find(filter);

  const grouped = {};
  todos.forEach((t) => {
    const dateKey = normalizeDate(t.date);
    if (!grouped[dateKey]) grouped[dateKey] = { total: 0, done: 0 };
    grouped[dateKey].total++;
    if (t.status === "done") grouped[dateKey].done++;
  });

  res.json(grouped);
});

// 🚀 Start server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
