import { apiGet, apiPut, apiDownload } from "./client";

// PUBLIC_INTERFACE
export async function listBugReports({ status, severity, search, page = 1, pageSize = 10 } = {}) {
  /** List bug reports with filters and pagination. */
  return apiGet("/api/bug-reports", { status, severity, search, page, pageSize });
}

// PUBLIC_INTERFACE
export async function getBugReport(id) {
  /** Get a bug report by id. */
  return apiGet(`/api/bug-reports/${id}`);
}

// PUBLIC_INTERFACE
export async function updateBugReport(id, payload) {
  /** Update a bug report by id. */
  return apiPut(`/api/bug-reports/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function exportBugReports(format = "json", filters = {}) {
  /** Trigger export and return Blob. */
  // Some backends use GET with query, but spec shows POST /api/export
  const blob = await apiDownload("/api/export", { format, filters });
  return blob;
}
