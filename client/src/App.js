import React, { useEffect, useState, useCallback } from "react";
import api from "./api";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [taskRes, catRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/tasks/categories")
      ]);
      setTasks(taskRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    if (token) {
      setUser({ loggedIn: true });
      loadData();
    }
    setLoading(false);
  }, [loadData]);

  const handleAuth = (loggedInUser) => {
    setUser(loggedInUser);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem("taskflow_token");
    setUser(null);
    setTasks([]);
  };

  const handleCreate = async (form) => {
    const { data } = await api.post("/tasks", form);
    setTasks((prev) => [data, ...prev]);
  };

  const handleUpdate = async (id, updates) => {
    const { data } = await api.put(`/tasks/${id}`, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const visibleTasks = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  if (loading) return null;
  if (!user) return <AuthForm onAuth={handleAuth} />;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📋 TaskFlow</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      <TaskForm categories={categories} onCreate={handleCreate} />

      <div className="d-flex gap-2 mb-3">
        {["all", "pending", "in_progress", "completed"].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setFilter(f)}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <TaskList tasks={visibleTasks} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}
