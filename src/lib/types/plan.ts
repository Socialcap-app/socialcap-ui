export type { Plan, EvidenceType, EvidenceExtra, Evidence, Strategy, StrategyVariant, SelectionSet, NotaryType, NotaryConfig, NotaryGithubArgs };
export { PayedBy, VariantOptions, SelectFromOptions, EvidenceTypeOptions, PayedByOptions, NotaryTypeOptions  };

enum PayedBy {
  applicant = 1,
  community = 2,
  socialcap = 3
}
type EvidenceType = "text" | "note" | "files" | "remark" | "links" | "radio" | "checks" | "images" | "notary";
type NotaryType = "github"

type StrategyVariant =
  "RandomAnonyomusValidators" |
  "AllMembersAnonymousVoting" ;

type SelectionSet =
  "AllValidators" |
  "OnlyAuditors"|
  "FullCommunity";

interface Strategy {
  title?: string,
  variant: StrategyVariant,
  selection: SelectionSet,
  minValidators: number,
  minVotes: number,
  minPositives: number,
  minAuditors: number,
  auditFrequency: number
}

 type NotaryGithubArgs = {
  username: string;
  repo: string;
  since: Date;
  until: Date;
};

type NotaryConfig = NotaryGithubArgs;  // TODO: add other notary types args

interface EvidenceExtra {
  max?: number; // max number of chars in this field  for Text and Note fields
  allowed?: string; // allowed file types for File and Image fields
  options?: string; // options for Radio field
  notaryType?: NotaryType; // zk notary type to use for Notary field
  notaryConfig?: NotaryConfig; // notary data to be use by zkNotary  eg: "{"username", "repo", "since", "until"}""
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
  uid?: string;
  communityUid: string;
  state: number;
  stateDescr: string;
  name: string;
  alias?: string;
  description?: string;
  image?: string; // for avatar
  banner?: string; // has banner additionally to avatar image
  template?: string;
  evidence: Evidence[];
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
  tokenSharePerClaim?: number; // amount of community token to distribute per issued claim
}

const VariantOptions: { value: StrategyVariant, name: string }[] = [
  {
    value: "RandomAnonyomusValidators",
    name: "Random"
  },
  {
    value: "AllMembersAnonymousVoting",
    name: "All Members"
  },
  // {
  //   value: "NominatedValidators",
  //   name: "Nominated Validators"
  // },
  // {
  //   value: "AllJudgesSecretVoting",
  //   name: "All Judges Secret Voting"
  // }
];

const SelectFromOptions: { value: SelectionSet, name: string }[] = [
  {
    value: "AllValidators",
    name: "All Validators"
  },
  {
    value: "OnlyAuditors",
    name: "Only auditors"
  },
  {
    value: "FullCommunity",
    name: "Full community"
  }
]

const PayedByOptions = [
  { value: "1", name: "Applicant" },
  { value: "2", name: "Community" },
  { value: "3", name: "Socialcap" }
]

const EvidenceTypeOptions: { value: EvidenceType, name: string }[] = [
  { value: 'text', name: 'Simple text input' },
  { value: 'note', name: 'Text note input' },
  { value: 'radio', name: 'Radio buttons input' },
  { value: 'checks', name: 'Check buttons input' },
  { value: 'links', name: 'Links input' },
  { value: 'files', name: 'File links input' },
  { value: 'images', name: 'Image links input' },
  { value: 'remark', name: 'Readonly remarks' },
  { value: 'notary', name: 'TLS Notary' }
]

const NotaryTypeOptions: { value: NotaryType, name: string }[] = [
  { value: 'github', name: 'GitHub' }
]