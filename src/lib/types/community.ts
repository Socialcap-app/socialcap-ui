import type { Claim } from "./claim";
import type { Plan } from "./plan";
import type { CommunityState } from "./states";

export type { Community, NewCommunity };

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

  tokenId?: string;                // unique identifier for community custom token
  tokenMaxSupply?: number;        // community custom token max supply
  tokenOwner?: string;            // account that creates, facilitates, and governs how the comm token can be used
  tokenMasterAccount?: string;    // hold initial token balance to be distributed to community
  tokenSymbol?: string;           // community custom token symbol

  // activity times
  createdUTC: string;
  updatedUTC: string;
  approvedUTC: string;

  // master plans
  plans: Plan[]; 

  // claims
  claims: Claim[];

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
