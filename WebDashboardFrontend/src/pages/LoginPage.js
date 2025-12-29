import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function LoginPage({ onAuthed }) {
  /** Minimal login UI with error handling. */
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      onAuthed && onAuthed();
      navigate("/dashboard");
    } catch (err) {
      setError(err.payload?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <p className="helper">Use your credentials to access the dashboard.</p>
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 360 }}>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="helper" style={{ marginTop: 12 }}>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
