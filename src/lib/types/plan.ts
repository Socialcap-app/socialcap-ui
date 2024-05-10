export type { Plan };
export { PayedBy };

enum PayedBy {
  applicant = 1,
  community = 2,
  socialcap = 3
}

interface Plan {
    uid: string;
    communityUid: string;
    state: number;
    stateDescr: string;
    name: string;
    alias?: string;
    description?: string;
    image?: string; // for avatar
    banner?: string; // has banner additionally to avatar image
    template?: string;
    evidence?: string;
    strategy?: string;
    createdUTC: Date;
    updatedUTC: Date;
    approvedUTC?: Date;
    fee?: number;
    rewardsShare?: number;
    communityShare?: number;
    protocolShare?: number;
    total?: number;
    available?: number;
    expiration?: number;
    revocable?: boolean;
    startsUTC?: Date;
    endsUTC?: Date;
    joined?: boolean;
    payedBy?: PayedBy;
    votingStartsUTC?: Date;
    votingEndsUTC?: Date;
}