import { API } from "./api-client";
import type { Person } from "$lib/types/person";

export { 
  getProfile,
  updateProfile
}

/**
 * Get user profile
 * @returns Person Profile
 */
async function getProfile(): Promise<Person> {
  const rs = await API.query("get_profile", {});
  if (rs.error) throw rs.error; // TODO handle error
  return rs.data;
}

/**
 * Update user profile
 * @param data: Profile
 * @returns Updated Person Profile
 */
async function updateProfile(data: Person): Promise<Person> {
  const rs = await API.mutate("update_profile", data)
  if (rs.error) throw rs.error;
  return rs.data;
}
