import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBugReport, updateBugReport } from "../api/bugReports";

// PUBLIC_INTERFACE
export default function BugReportDetail() {
  /** Detail view for a bug report with update support and UI sections. */
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", severity: "medium", status: "open", assigned_to: "" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getBugReport(id);
        if (mounted) {
          setReport(data);
          setForm({
            title: data.title || "",
            description: data.description || "",
            severity: data.severity || "medium",
            status: data.status || "open",
            assigned_to: data.assigned_to || "",
          });
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load report");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await updateBugReport(id, form);
      setReport(updated);
    } catch (err) {
      setError(err.message || "Failed to update report");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <h2>Report Detail #{id}</h2>
      {loading && <div>Loading…</div>}
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      {!loading && report && (
        <>
          <form onSubmit={handleSave} style={{ maxWidth: 720 }}>
            <div className="form-field">
              <label htmlFor="title">Title</label>
              <input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="desc">Description</label>
              <textarea id="desc" rows={5} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="severity">Severity</label>
              <select id="severity" value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="assignee">Assigned To (user id or name)</label>
              <input id="assignee" value={form.assigned_to} onChange={(e) => setForm((f) => ({ ...f, assigned_to: e.target.value }))} />
            </div>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>

          <div className="section">
            <h3>History</h3>
            <p className="helper">Timeline of status changes and assignments (to be populated from backend when available).</p>
          </div>

          <div className="section">
            <h3>Comments</h3>
            <p className="helper">Add and view comments. This UI is ready to connect to /comments endpoints when implemented.</p>
            <div className="form-field">
              <textarea placeholder="Write a comment…" rows={3} />
            </div>
            <button className="btn" type="button" disabled>Post Comment (coming soon)</button>
          </div>

          <div className="section">
            <h3>Attachments</h3>
            <p className="helper">Upload and list attachments. This UI is ready to connect to /attachments endpoints when implemented.</p>
            <input type="file" disabled />
            <button className="btn" type="button" disabled style={{ marginLeft: 8 }}>Upload (coming soon)</button>
          </div>
        </>
      )}
    </div>
  );
}
