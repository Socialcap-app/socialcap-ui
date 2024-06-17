import { API, type APIResponse } from "./api-client";
import { type Community, type User } from "$lib/types";
import { getCurrentUser } from "$lib/store";
import type { NewCommunity } from "$lib/types/community";
import type { Member } from "$lib/types/member";

export {
  getMembers,
  updateMemberRole
}

/**
 * Get the list of all the members of a given community
 * @param communityUid - UID of the required community
 * @param options - additional options
 * @param options.roles - filter by this roles, including admin
 * @param options.states - filter by the user states 
 * @returns A list of Member
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getMembers(communityUid: string, options?: {
  roles?: string[],
  states?: string[]
}): Promise<Member[]> {
  const rs = await API.query("get_members", {
    communityUid: communityUid
  });
  if (rs.error) throw Error(rs.error.message); // Todo handle error
  return rs.data || [];
}

/**
 * Update community member role
 * @param communityUid: string - Uid of community the member belong to
 * @param personUid: string - Uid of the member
 * @param role: number - new role
 *  * @returns Updated Member
 */
async function updateMemberRole(data: {
  communityUid: string,
  personUid: string,
  role: number
}): Promise<any> {
  const rs = await API.mutate("update_member_role", data)
  if (rs.error) throw Error(rs.error.message, rs.error.cause);
  return rs.data;
}