import { apiPost, setAuthToken, clearAuthToken, getAuthToken } from "./client";

// PUBLIC_INTERFACE
export async function login(username, password) {
  /** Login user and persist token. */
  const data = await apiPost("/auth/login", { username, password });
  if (data && data.access_token) {
    setAuthToken(data.access_token);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function register({ username, email, password }) {
  /** Register a new user. */
  return apiPost("/auth/register", { username, email, password });
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clear token and logout locally. */
  clearAuthToken();
}

// PUBLIC_INTERFACE
export function isAuthenticated() {
  /** Return true if a token is present. */
  return !!getAuthToken();
}
