import { API, type APIResponse } from "./api-client";
import { type Community, type Plan, type User } from "$lib/types";
import { getCurrentUser } from "$lib/store";
import type { NewCommunity } from "$lib/types/community";

export {
  getAllCommunities,
  getMyCommunities,
  getCommunity,
  createCommunity,
  checkCommunityNameExist,
  joinCommunity,
  getAdminCommunity,
  updateCommunity,
}

async function getCommunity(params: {
  uid: string,
  extras?: boolean
}): Promise<Community> {
  const rs = await API.query("get_community", {
    uid: params.uid,
    extras: params.extras || false // do not include claims,etc in response
  });
  if (rs.error) throw Error(rs.error.message, rs.error.cause); // Todo handle error
  return rs.data;
}

async function getAdminCommunity(params: {
  uid: string,
}): Promise<Community> {
  const rs = await API.query("get_admined_community", {
    uid: params.uid
  });
  if (rs.error) throw Error(rs.error.message, rs.error.cause); // Todo handle error
  return rs.data;
}

/**
 * Get the list of all the Socialcap communities
 * @param columns?: string[] - selected columns to return from query
 * @param notJoined?: boolean - filter by joined/not joined communities 
 * @returns APIResponse - on success array of Community 
 */
async function getAllCommunities(params: {
  columns?: string[],
  notJoined?: boolean,
  states?: string[]
}): Promise<Community[]> {
  const rs = await API.query("get_all_communities", params);
  if (rs.error) return []; // TODO handle error
  if (!params.states) return rs.data;

  // only the ones in the given states
  return (rs.data || []).filter((t: Community) => (
    (params?.states || []).includes(t.state)
  ));
}

/**
 * Get the list of communities that I have joined
 * @params admined?: boolean - only admined by current user
 * @param columns?: string[] - selected columns to return from query
 * @returns APIResponse - on success array of Community 
 */
async function getMyCommunities(params: {
  admined?: boolean,
  columns?: string[],
}): Promise<Community[]> {
  const rs = await API.query("get_my_communities", {});
  if (rs.error) return []; // Todo handle error

  // if not admined return all
  if (!params.admined) return rs.data;

  // only the ones admined by this user
  if (params.admined) {
    const user = getCurrentUser();
    if (!user) throw Error("Can not filter admined communities No active user !");
    return (rs.data || []).filter((t: Community) => (
      t.adminUid === user!.uid || t.xadmins.includes(user!.uid)
    ));
  }
  return [];
}

/**
 * Create a new community
 * @param name: string
 * @param description: string
 * @returns Created Commmunity
 */
async function createCommunity(data: NewCommunity): Promise<Community> {
  const rs = await API.mutate("update_community", { ...data, state: "INITIAL", new: true })
  if (rs.error) throw Error(rs.error.message, rs.error.cause);
  return rs.data;
}

async function checkCommunityNameExist(name: string): Promise<boolean> {
  const rs = await API.query("check_community_name_exist", { name });
  if (rs.error) throw Error(rs.error.message, rs.error.cause);
  return rs.data;
}

/**
 * Join an existent community
 * @param communityUid: string - Uid of community to join
 * @param personUid: string - Uid of the user to Join
 * @returns Created Commmunity
 */
async function joinCommunity(data: {
  communityUid: string, 
  personUid: string
}): Promise<any> {
  const rs = await API.mutate("join_community", data)
  if (rs.error) throw Error(rs.error.message, rs.error.cause);
  return rs.data;
}

/**
 * Update community
 * @param communityUid: string - Uid of community to update
 * @returns Updated Commmunity
 */
async function updateCommunity(data: {
  // communityUid: string,
  uid: string,
  name: string,
  description: string,
  tokenId?: string,
  tokenMaxSupply?: number,
  tokenOwner?: string,
  tokenMasterAccount?: string,
  tokenSymbol?: string
}): Promise<any> {
  const rs = await API.mutate("update_community", data)
  if (rs.error) throw Error(rs.error.message, rs.error.cause);
  return rs.data;
}