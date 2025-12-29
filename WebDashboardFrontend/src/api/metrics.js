import { apiGet } from "./client";

// PUBLIC_INTERFACE
export async function getMetrics() {
  /** Fetch overall metrics data for the dashboard. */
  return apiGet("/api/metrics");
}
