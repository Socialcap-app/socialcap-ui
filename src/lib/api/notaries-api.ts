import { API } from "./api-client";
import type { NotaryGithubArgs } from "$lib/types/plan";

export {
  notarize_github,
  verify_notary_github
}

/**
 * Get the plan details
 * @returns Plan 
 */
async function notarize_github(params: NotaryGithubArgs): Promise<any> {
  const rs = await API.query("notarize_github", params);
  if (rs.error) throw rs.error; // TODO handle error
  return rs.data;
}

async function verify_notary_github(proofData: string, notaryPubKey: string): Promise<any> {
  const rs = await API.query("verify_notary_github", { proofData, notaryPubKey });
  if (rs.error) throw rs.error; // TODO handle error
  return rs.data;
}

