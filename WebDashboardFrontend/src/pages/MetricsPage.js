import React, { useEffect, useState } from "react";
import { getMetrics } from "../api/metrics";

// PUBLIC_INTERFACE
export default function MetricsPage() {
  /** Metrics overview with simple bar displays based on metrics. */
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
    return () => { mounted = false; };
  }, []);

  const jobsProcessed = Number(metrics?.jobs_processed || 0);
  const avgDuration = Number(metrics?.avg_duration || 0);
  const errorRate = Math.min(100, Math.max(0, Number(metrics?.error_rate || 0) * 100));

  return (
    <div className="container">
      <h2>Metrics</h2>
      {loading && <div>Loading…</div>}
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      {metrics && (
        <div className="section">
          <div className="section">
            <div>Jobs processed: <strong>{jobsProcessed}</strong></div>
            <div style={{ background: "#ddd", height: 10, borderRadius: 6, marginTop: 6 }}>
              <div style={{ width: Math.min(100, jobsProcessed % 100) + "%", background: "#3c8dbc", height: "100%", borderRadius: 6 }} />
            </div>
          </div>
          <div className="section">
            <div>Average duration: <strong>{avgDuration}s</strong></div>
            <div style={{ background: "#ddd", height: 10, borderRadius: 6, marginTop: 6 }}>
              <div style={{ width: Math.min(100, avgDuration) + "%", background: "#28a745", height: "100%", borderRadius: 6 }} />
            </div>
          </div>
          <div className="section">
            <div>Error rate: <strong>{errorRate.toFixed(1)}%</strong></div>
            <div style={{ background: "#ddd", height: 10, borderRadius: 6, marginTop: 6 }}>
              <div style={{ width: errorRate + "%", background: "#dc3545", height: "100%", borderRadius: 6 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
