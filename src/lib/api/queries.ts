/**
 * All queries
 */
export { getAllCommunities, getMyCommunities, getCommunity, getAdminCommunity } from "./communities-api";
export { getMyClaims, getClaim } from "./claims-api";
export { getPlan, getAdminedPlans, getAllClaimables, updatePlan } from "./plans-api";
export { getMyCredentials, getCommunityCredentials, getCredential, getCredentialOnchainData } from "./credentials-api";
export { getMembers, updateMemberRole, addMemberToAdmins, removeMemberFromAdmins } from "./members-api";
export { getMyTasks, submitBatchTasks } from "./tasks-api";
export { getMyActivities } from "./activities-api";
export { getProfile, updateProfile} from "./profile-api";
export {notarize_github} from "./notaries-api";
