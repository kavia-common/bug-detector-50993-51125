const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "";

// Simple in-memory + localStorage token handling
let memoryToken = null;

const TOKEN_KEY = "auth_token";

function getStoredToken() {
  if (memoryToken) return memoryToken;
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      memoryToken = t;
      return t;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Set JWT auth token for API usage. */
  memoryToken = token || null;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage might be disabled; keep in memory
  }
}

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Retrieve the currently set auth token. */
  return getStoredToken();
}

// PUBLIC_INTERFACE
export function clearAuthToken() {
  /** Clear authentication token. */
  memoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

function buildHeaders(extra = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };
  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  if (!res.ok) {
    let errorPayload = null;
    if (isJson) {
      try {
        errorPayload = await res.json();
      } catch {
        // ignore
      }
    } else {
      try {
        errorPayload = await res.text();
      } catch {
        // ignore
      }
    }
    const error = new Error(
      (errorPayload && errorPayload.message) ||
        `Request failed with status ${res.status}`
    );
    error.status = res.status;
    error.payload = errorPayload;
    throw error;
  }
  if (isJson) return res.json();
  return res.blob();
}

// PUBLIC_INTERFACE
export async function apiGet(path, params = {}) {
  /** Perform a GET request to the backend with query params. */
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.append(k, v);
  });
  const res = await fetch(url.toString().replace(window.location.origin, ""), {
    method: "GET",
    headers: buildHeaders(),
    mode: "cors",
    credentials: "omit",
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPost(path, body = {}, options = {}) {
  /** Perform a POST request to the backend. */
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(options.headers),
    body: JSON.stringify(body),
    mode: "cors",
    credentials: "omit",
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiPut(path, body = {}, options = {}) {
  /** Perform a PUT request to the backend. */
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(options.headers),
    body: JSON.stringify(body),
    mode: "cors",
    credentials: "omit",
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function apiDownload(path, body = {}) {
  /** POST to an export endpoint and return a Blob for download. */
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
    mode: "cors",
    credentials: "omit",
  });
  // Reuse handleResponse but if JSON, convert to error, else blob
  if (!res.ok) {
    let msg = `Request failed with status ${res.status}`;
    try {
      const asJson = await res.json();
      if (asJson && asJson.message) msg = asJson.message;
    } catch {
      // ignore
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.blob();
}
