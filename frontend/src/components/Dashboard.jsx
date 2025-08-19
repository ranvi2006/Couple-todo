import { useState } from "react";
import UserTodo from "./UserTodo";

export default function Dashboard() {
  // default = today
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">
        <i className="fas fa-tachometer-alt me-2"></i> Dashboard
      </h2>

      {/* Date Picker */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="date"
          className="form-control w-auto"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {/* Raju */}
        <div className="col-md-6">
          <UserTodo
            user="Anokhi"
            date={selectedDate}
            isPast={selectedDate < today}
          />
        </div>

        {/* Anokhi */}
        <div className="col-md-6">
          <UserTodo
            user="Raju"
            date={selectedDate}
            isPast={selectedDate < today}
          />
        </div>
      </div>
    </div>
  );
}
