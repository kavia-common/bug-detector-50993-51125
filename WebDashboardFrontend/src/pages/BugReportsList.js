import React, { useEffect, useMemo, useState } from "react";
import { listBugReports, exportBugReports } from "../api/bugReports";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function BugReportsList() {
  /** Paginated list with filters and export triggers. */
  const [query, setQuery] = useState({ status: "", severity: "", search: "", page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });

  const totalPages = useMemo(() => {
    if (!data?.total) return 1;
    return Math.max(1, Math.ceil(data.total / (query.pageSize || 10)));
  }, [data, query.pageSize]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await listBugReports(query);
      // Normalize to shape with items + total if backend differs
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
      const total = typeof res?.total === "number" ? res.total : items.length;
      setData({ items, total });
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.pageSize]);

  function applyFilters(e) {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    load();
  }

  async function handleExport(format) {
    try {
      const blob = await exportBugReports(format, {
        status: query.status,
        severity: query.severity,
        search: query.search,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bug-reports.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Export failed");
    }
  }

  return (
    <div className="container">
      <h2>Bug Reports</h2>
      <form className="filters" onSubmit={applyFilters}>
        <input
          placeholder="Search…"
          value={query.search}
          onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value }))}
        />
        <select value={query.status} onChange={(e) => setQuery((q) => ({ ...q, status: e.target.value }))}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={query.severity} onChange={(e) => setQuery((q) => ({ ...q, severity: e.target.value }))}>
          <option value="">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button className="btn" type="submit">Apply</button>
        <div style={{ flex: 1 }} />
        <button className="btn" type="button" onClick={() => handleExport("json")}>Export JSON</button>
        <button className="btn" type="button" onClick={() => handleExport("csv")}>Export CSV</button>
        <button className="btn" type="button" onClick={() => handleExport("pdf")}>Export PDF</button>
      </form>
      {loading && <div>Loading…</div>}
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      {!loading && !error && (
        <>
          <div className="list" role="table" aria-label="Bug reports">
            <div className="row header" role="row">
              <div>Title</div>
              <div>Severity</div>
              <div>Status</div>
              <div>Assignee</div>
              <div>Updated</div>
            </div>
            {(data.items || []).map((r) => (
              <div className="row" role="row" key={r.id}>
                <div><Link to={`/reports/${r.id}`}>{r.title || `Report #${r.id}`}</Link></div>
                <div>{r.severity || "-"}</div>
                <div>{r.status || "-"}</div>
                <div>{r.assigned_to_name || r.assigned_to || "-"}</div>
                <div>{r.updated_at || r.created_at || "-"}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
            <button className="btn" onClick={() => setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) }))} disabled={query.page <= 1}>
              Prev
            </button>
            <span>Page {query.page} of {totalPages}</span>
            <button className="btn" onClick={() => setQuery((q) => ({ ...q, page: Math.min(totalPages, q.page + 1) }))} disabled={query.page >= totalPages}>
              Next
            </button>
            <select
              value={query.pageSize}
              onChange={(e) => setQuery((q) => ({ ...q, page: 1, pageSize: Number(e.target.value) }))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
