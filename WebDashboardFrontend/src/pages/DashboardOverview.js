import React, { useEffect, useState } from "react";
import { getMetrics } from "../api/metrics";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function DashboardOverview() {
  /** Overview with key metrics and quick links. */
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMetrics();
        if (mounted) setMetrics(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load metrics");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <h2>Overview</h2>
      <p className="helper">Quick snapshot of system metrics and recent activity.</p>
      {loading && <div>Loading metrics…</div>}
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      {metrics && (
        <div className="section">
          <div>Jobs processed: <strong>{metrics.jobs_processed ?? "-"}</strong></div>
          <div>Average duration: <strong>{metrics.avg_duration ?? "-"}</strong></div>
          <div>Error rate: <strong>{metrics.error_rate ?? "-"}</strong></div>
        </div>
      )}
      <div className="section">
        <h3>Quick Links</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn" to="/reports">View Reports</Link>
          <Link className="btn" to="/metrics">Metrics</Link>
          <Link className="btn" to="/notifications">Notifications</Link>
          <Link className="btn" to="/profile">My Profile</Link>
        </div>
      </div>
    </div>
  );
}
