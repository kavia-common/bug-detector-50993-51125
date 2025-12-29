import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/user";

// PUBLIC_INTERFACE
export default function ProfilePage() {
  /** View and edit basic profile information. */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ username: "", email: "" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProfile();
        if (mounted) {
          setForm({ username: data.username || "", email: data.email || "" });
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    try {
      await updateProfile(form);
      setMsg("Profile updated");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <h2>My Profile</h2>
      {loading && <div>Loading…</div>}
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {!loading && (
        <form onSubmit={handleSave} style={{ maxWidth: 480 }}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input id="username" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <button className="btn" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </form>
      )}
    </div>
  );
}
