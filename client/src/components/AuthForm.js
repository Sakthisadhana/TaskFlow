import React, { useState } from "react";
import api from "../api";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, form);
      localStorage.setItem("taskflow_token", data.token);
      onAuth(data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-sm p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-3">TaskFlow</h3>
        <div className="btn-group mb-3 w-100">
          <button
            className={`btn btn-sm ${mode === "login" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`btn btn-sm ${mode === "register" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="mb-2">
              <input
                className="form-control"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="mb-2">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
