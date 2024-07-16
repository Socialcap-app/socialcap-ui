import { API, type APIResponse } from "./api-client";
import type { Claim } from "$lib/types/claim";
import type { Plan } from "$lib/types/plan";
import { type State, findState, toState } from "$lib/types/states";
import { UID } from "$lib/types/uid";
import { fixEvidenceData } from "./fix-evidence-data";
import { getCurrentUser } from "$lib/store";

export { 
  getMyClaims,
  getClaim,
  saveDratClaim,
  updateClaim
}

/**
 * Get the list of all user claims
 * @returns Claim[]
 */
async function getMyClaims(params: {
  states?: number[]
}): Promise<Claim[]> {
  const rs = await API.query("get_my_claims", params);
  if (rs.error) return []; // TODO handle error
  return rs.data;
}

/**
 * Get a single claim
 * @returns Claim
 */
async function getClaim(params: {
  uid: string,
  plan?: Plan // we ALWAYS need to check against the plan
}): Promise<Claim> {
  // if isNew we need to return an empty claim for the given plan
  const { uid, plan } = params; 
  if (uid === 'new' && !plan) 
    throw Error("We can not create an empty claim without a Masterplan");

  if (uid === 'new') {
    return buildEmptyClaim(plan!);
  }

  if (!plan) 
    throw Error("We can not check the Claim without a Masterplan");
  // we are looking for an existent claim with a given Uid
  const rs = await API.query("get_claim", { uid: uid });
  if (rs.error) throw rs.error; // TODO handle error

  // fix evidence data in case the masterplan form has changed 
  // AFTER the evidence claim data was saved
  const data = rs.data;
  data.evidence = fixEvidenceData(plan.evidence, data.evidenceData);
  return data;
}

/**
 * Save claim as draft
 * @param data: Claim
 * @returns Created Claim
 */
async function saveDratClaim(data: Claim): Promise<Claim> {
  console.log("adding new claim", data)
  const rs = await API.mutate("add_claim", data)
  if (rs.error) throw rs.error;
  return rs.data;
}

/**
 * Update claim
 * @param data: Claim
 * @returns Updated Claim
 */
async function updateClaim(data: Claim): Promise<Claim> {
  const rs = await API.mutate("update_claim", data)
  if (rs.error) throw rs.error;
  return rs.data;
}


function buildEmptyClaim(plan: Plan): Claim {

  const applicant = getCurrentUser();
  const state: State | undefined = toState(findState('Draft'));

  return {
    // uid: UID.uuid4(),
    communityUid: plan.communityUid,
    applicantUid: applicant?.uid as string,
    planUid: plan.uid,
    state: state?.value as number,
    accountId: "", // it MUST be empty when creating a new Claim
    alias: plan.alias,
    createdUTC: new Date(),
    updatedUTC: new Date(),
    votedUTC: undefined,
    issuedUTC: undefined,
    dueUTC: undefined,
    evidenceData: fixEvidenceData(plan.evidence, []),
    // requiredVotes: plan.strategy.number
    // requiredPositives?: number
    // positiveVotes?: number
    // negativeVotes?: number
    // ignoredVotes?: number

    // Master Plan data
    community: "",
    description: "",
    image: plan.image as string,
    type: plan.name,

    // custom
    stateInfo: state as State
  }
}
