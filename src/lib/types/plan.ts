export type { Plan };
export { PayedBy, VariantOptions, SeleectFromOptions };

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

const VariantOptions = [
  {
    value: "RandomAnonyomusValidators",
    text: "Random Anonyomus Validators"
  },
  {
    value: "AllMembersAnonymousVoting",
    text: "All Members Anonymous Voting"
  },
  {
    value: "NominatedValidators",
    text: "Nominated Validators"
  },
  {
    value: "AllJudgesSecretVoting",
    text: "All Judges Secret Voting"
  }
];

export const SelectFromOptions = [
  {
    value: "AllValidator",
    text: "All Validator"
  }, {
    value: "OnlyAuditors",
    text: "Only auditors"
  },
  {
    value: "FullCommunity",
    text: "Full community"
  }
]