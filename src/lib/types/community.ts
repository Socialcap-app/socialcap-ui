import type { Plan } from "./plan";

export type { Community, NewCommunity };

type CommunityState =  "INITIAL" | "APPROVED" | "PAUSED" | "REJECTED";

interface Community {
  /// from basic DB Claim Entity ///
  // ids and references 
  uid: string; 
  accountId: string;
  adminUid: string,
  name: string; 
  description: string;
  state: CommunityState;
  image: string; // logo image
  xadmins: string;

  // activity times
  createdUTC: string;
  updatedUTC: string;
  approvedUTC: string;

  // master plans
  plans: Plan[]; 

  // extras 
  countMembers: number;
  countCredentials: number;
  countClaims: number;
  countClaimables?: number;
  isAdmin?: boolean;
  isMember?: string;
}

interface NewCommunity {
  name: string;
  description: string;
  adminUid?: string;
}
