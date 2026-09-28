import React, { useState } from "react";

export default function TaskForm({ categories, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category_id: "",
    due_date: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onCreate(form);
    setForm({ title: "", description: "", priority: "medium", category_id: "", due_date: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 shadow-sm mb-4">
      <h5 className="mb-3">Add a new task</h5>
      <div className="row g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" name="category_id" value={form.category_id} onChange={handleChange}>
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input className="form-control" type="date" name="due_date" value={form.due_date} onChange={handleChange} />
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </div>
    </form>
  );
}
