import { API } from "./api-client";
import type { Credential, CredentialMint, OnchainCredentialData } from "$lib/types/credential";

export {
  getMyCredentials,
  getCommunityCredentials,
  getCredential,
  getCredentialOnchainData,
  registerCredentialMint,
  getCredentialMints
}

/**
 * Get the list of all user credentials
 * @returns Credential[]
 */
async function getMyCredentials(params?: any): Promise<Credential[]> {
  const rs = await API.query("get_my_credentials", params);
  if (rs.error) return []; // TODO handle error
  return rs.data;
}

/**
 * Get the list of all user credentials
 * @returns Credential[]
 */
async function getCommunityCredentials(
  communityUid: string
): Promise<Credential[]> {
  const rs = await API.query("get_community_credentials", {
    communityUid: communityUid
  });
  if (rs.error) return []; // TODO handle error
  return rs.data;
}

/**
 * Get credential details  
 * @returns Credential
 */
async function getCredential(
  uid: string
): Promise<Credential> {
  const rs = await API.query("get_credential", {
    uid: uid
  });
  if (rs.error) throw rs.error;
  return rs.data;
}

/**
 * Get on-chain data for credential  
 * @returns OnchainCredentialData object
 *
 * Get the Credential onchain data
 * @returns A OnchainCredentialData object
 */
async function getCredentialOnchainData(params: {
  claimUid: string
}): Promise<OnchainCredentialData> {
  const { claimUid } = params; 
  const rs = await API.query("get_credential_onchain_data", { 
    claimUid: claimUid 
  });
  if (rs.error) throw rs.error; // TODO handle error
  return rs.data;
}

async function getCredentialMints(params: {
  claimUid: string
}): Promise<CredentialMint[]> {
  const { claimUid } = params; 
  const rs = await API.query("get_credential_mints", { 
    claimUid: claimUid 
  });
  if (rs.error) throw rs.error; // TODO handle error
  return rs.data;
}

/**
 * Register a new mint for a issued credential
 * @param params
 * @param params.credentialUid - UID of the credential
 * @param params.userUid - UID of the user
 * @param params.protocol - Name of the protocol which is minting
 * @param params.txnHash - Transaction hash
 * @param params.explorerUrl - transaction explorer url
 * @param params.marketplaceUrl - marketplace url e.g. https://testnet.minanft.io/@Final%20Badge..
 * @returns
 */
async function registerCredentialMint(params: CredentialMint): Promise<any> {
  const rs = await API.mutate("register_credential_mint", params);
  if (rs.error)
    throw rs.error;
  return rs.data;
}