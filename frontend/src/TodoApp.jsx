import { useState } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const addTodo = () => {
    if (!task) return;
    const newTodo = {
      id: Date.now(),
      task,
      status: "pending",
      date: new Date().toLocaleDateString(),
    };
    setTodos([...todos, newTodo]);
    setTask("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">💖 Our Todo List</h1>

      {/* Add Todo */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Enter task..."
        />
        <button
          onClick={addTodo}
          className="bg-pink-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {todos.map((t) => (
          <div
            key={t.id}
            className={`flex justify-between p-3 rounded border ${
              t.status === "done" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <span
              onClick={() => toggleTodo(t.id)}
              className={`cursor-pointer ${
                t.status === "done" ? "line-through" : ""
              }`}
            >
              {t.task}
            </span>
            <button
              onClick={() => deleteTodo(t.id)}
              className="text-sm text-gray-600 hover:text-red-500"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
