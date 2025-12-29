import { apiGet, apiPut } from "./client";

// PUBLIC_INTERFACE
export async function getProfile() {
  /** Get logged-in user's profile. */
  return apiGet("/api/user/profile");
}

// PUBLIC_INTERFACE
export async function updateProfile(payload) {
  /** Update user's profile. */
  return apiPut("/api/user/profile", payload);
}
