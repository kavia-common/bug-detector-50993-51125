import { apiGet } from "./client";

// PUBLIC_INTERFACE
export async function listNotifications() {
  /** Get notifications for the current user. */
  return apiGet("/api/notifications");
}
