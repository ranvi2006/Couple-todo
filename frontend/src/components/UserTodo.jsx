import { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const API_URL = "https://couple-todo-psa2.onrender.com/api";

export default function UserTodo({ user, date, isPast }) {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [performance, setPerformance] = useState({});
  const [view, setView] = useState("todos"); // "todos" | "performance"

  // 🔄 fetch todos & performance together whenever user/date changes
  const loadData = async () => {
    try {
      const [todosRes, perfRes] = await Promise.all([
        axios.get(`${API_URL}/todo/${user}/${date}`),
        axios.get(`${API_URL}/performance/${user}?date=${date}`),
      ]);
      setTodos(todosRes.data);
      setPerformance(perfRes.data);
    } catch (err) {
      console.error("❌ Load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, date]);

  // ➕ Add task
  const addTodo = async () => {
    if (!task.trim()) return;
    try {
      console.log(API_URL)
      await axios.post(`${API_URL}/todo`, { user, task, date });
      setTask("");
      loadData(); // refresh after add
    } catch(err) {
      console.log("Erroe,", err);
      alert("❌ Cannot add task for past days");
    }
  };

  // 🔄 Toggle status
  const toggleTodo = async (id) => {
    try {
      await axios.put(`${API_URL}/todo/${id}`);
      loadData(); // refresh after toggle
    } catch {
      alert("❌ Cannot edit past todos");
    }
  };

  // ❌ Delete
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todo/${id}`);
      loadData(); // refresh after delete
    } catch {
      alert("❌ Cannot delete past todos");
    }
  };

  // 📊 Prepare chart data
  const chartData = Object.entries(performance).map(([date, stats]) => ({
    date,
    percent: stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0,
  }));

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${view === "todos" ? "active" : ""}`}
              onClick={() => setView("todos")}
            >
              Todos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${view === "performance" ? "active" : ""}`}
              onClick={() => setView("performance")}
            >
              Performance
            </button>
          </li>
        </ul>

        {/* Card Title */}
        <h5 className="card-title text-center mb-3">
          <i className="fas fa-user me-2"></i> {user}
        </h5>

        {/* View Switching */}
        {view === "todos" ? (
          <>
            {/* Add Task */}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Add a task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={isPast}
              />
              <button
                className="btn btn-primary"
                onClick={addTodo}
                disabled={isPast}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            {/* Todo List */}
            <ul className="list-group flex-grow-1 overflow-auto">
              {todos.map((t) => (
                <li
                  key={t._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span
                    className={
                      t.status === "done" ? "text-decoration-line-through" : ""
                    }
                  >
                    {t.task}
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => toggleTodo(t._id)}
                      disabled={isPast}
                    >
                      {t.status === "done" ? (
                        <i className="fas fa-check-circle"></i>
                      ) : (
                        <i className="far fa-circle"></i>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTodo(t._id)}
                      disabled={isPast}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          // 📊 Performance View
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
            {chartData.length > 0 ? (
              <>
                {/* Performance Summary */}
                <div className="mb-3 text-center">
                  <p>Total Todos: {chartData[0].total}</p>
                  <p>Completed: {chartData[0].percent}%</p>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percent">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.percent > 70
                              ? "#28a745" // green
                              : entry.percent > 30
                              ? "#ffc107" // orange
                              : "#dc3545" // red
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <p className="text-muted">No performance data yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
