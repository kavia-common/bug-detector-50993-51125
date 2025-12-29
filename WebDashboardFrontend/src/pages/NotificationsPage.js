import React, { useEffect, useState } from "react";
import { listNotifications } from "../api/notifications";

// PUBLIC_INTERFACE
export default function NotificationsPage() {
  /** List user notifications. */
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listNotifications();
        if (mounted) setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load notifications");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container">
      <h2>Notifications</h2>
      {loading && <div>Loading…</div>}
      {error && <div role="alert" style={{ color: "crimson" }}>{error}</div>}
      {!loading && !error && (
        <ul>
          {items.map((n) => (
            <li key={n.id}>
              <strong>[{n.type || "info"}]</strong> {n.message} {n.created_at ? <em>({n.created_at})</em> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
