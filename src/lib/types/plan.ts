export type { Plan, EvidenceType, EvidenceExtra, Evidence, Strategy, StrategyVariant, SelectionSet };
export { PayedBy, VariantOptions, SelectFromOptions, EvidenceTypeOptions, PayedByOptions };

enum PayedBy {
  applicant = 1,
  community = 2,
  socialcap = 3
}
type EvidenceType = "text" | "note" | "files" | "remark" | "links" | "radio" | "checks" | "images";
type StrategyVariant =
  "RandomAnonyomusValidators" |
  "AllMembersAnonymousVoting" |
  "NominatedValidators";

type SelectionSet =
  "ValidatorsSet" |
  "WholeCommunity";

interface Strategy {
  title: string,
  variant: StrategyVariant,
  selection: SelectionSet,
  minValidators: number,
  minVotes: number,
  minPositiveVotes: number,
  minAuditors: number,
  auditFrequency: number

}

interface EvidenceExtra {
  max: number, // max number of chars in this field  for Text and Note fields
  allowed?: string, // allowed file types for File and Image fields
  options?: string // options for Radio field
}

interface Evidence {
  sid: string;
  required: boolean;
  label: string;
  description: string;
  id: string;
  type: EvidenceType;
  extras: EvidenceExtra;
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
  evidence?: Evidence;
  strategy?: Strategy;
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
    name: "Random Anonyomus Validators"
  },
  {
    value: "AllMembersAnonymousVoting",
    name: "All Members Anonymous Voting"
  },
  {
    value: "NominatedValidators",
    name: "Nominated Validators"
  },
  // {
  //   value: "AllJudgesSecretVoting",
  //   name: "All Judges Secret Voting"
  // }
];

const SelectFromOptions = [
  {
    value: "ValidatorsSet",
    name: "Validators Set"
  },
  {
    value: "WholeCommunity",
    name: "The whole community"
  }
]

const PayedByOptions = [
  { value: "1", name: "Applicant" },
  { value: "2", name: "Community" },
  { value: "3", name: "Socialcap" }
]

const EvidenceTypeOptions = [
  { value: 'text', name: 'Simple text input' },
  { value: 'note', name: 'Text note input' },
  { value: 'radio', name: 'Radio buttons input' },
  { value: 'checks', name: 'Check buttons input' },
  { value: 'links', name: 'Links input' },
  { value: 'files', name: 'File links input' },
  { value: 'images', name: 'Image links input' },
  { value: 'remark', name: 'Readonly remarks' }
]