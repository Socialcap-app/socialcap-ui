import type { State, StateValue } from "./states"

export type { Claim }

interface Claim {
    uid: string
    communityUid: string
    applicantUid: string
    applicant: string;
    planUid: string
    state: StateValue
    accountId?: string
    alias?: string
    createdUTC: Date
    updatedUTC: Date
    votedUTC?: Date
    issuedUTC?: Date
    dueUTC?: Date
    requiredVotes?: number
    requiredPositives?: number
    positiveVotes?: number
    negativeVotes?: number
    ignoredVotes?: number
    evidenceData?: string
    tokenAccountId?: string // token account that holds community custom token


    // Master Plan data
    community: string
    description: string
    image: string
    type: string

    // custom
    stateInfo: State
    searchable: string;
}
