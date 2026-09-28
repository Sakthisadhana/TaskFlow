import React from "react";

const statusOptions = ["pending", "in_progress", "completed"];

export default function TaskList({ tasks, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return <p className="text-muted text-center mt-4">No tasks yet — add one above to get started.</p>;
  }

  return (
    <div className="row g-3">
      {tasks.map((task) => (
        <div className="col-md-6" key={task.id}>
          <div className={`card task-card shadow-sm priority-${task.priority}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title mb-1">{task.title}</h5>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(task.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
              {task.description && <p className="card-text text-muted small">{task.description}</p>}
              <div className="d-flex flex-wrap gap-2 mb-2">
                {task.category_name && <span className="badge bg-secondary">{task.category_name}</span>}
                {task.due_date && (
                  <span className="badge bg-light text-dark border">
                    Due {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <select
                className="form-select form-select-sm"
                value={task.status}
                onChange={(e) => onUpdate(task.id, { status: e.target.value })}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
