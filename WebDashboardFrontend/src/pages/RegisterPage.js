import React, { useState } from "react";
import { register } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Minimal register UI with backend integration. */
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      setDone(true);
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.payload?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <p className="helper">Create an account to use the dashboard.</p>
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      {done && <div style={{ color: "green" }}>Registration successful. Redirecting to login…</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input id="username" required value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        </div>
        <button className="btn" type="submit" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
      </form>
      <p className="helper" style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
