import type { Community } from "./community";

export type { Credential };

interface Credential {
    uid: string
    // the MINA account where this credential "lives"
    accountId: string
    // this are the other related MINA account ids
    applicantId: string
    claimId: string
    // the source references (redundant by useful for querying)
    applicantUid: string
    communityUid: string
    claimUid: string
    // type & description data
    type?: string
    description?: string
    community?: string
    image?: string
    banner?: string // because Masterplans have both a Banner and an Avatar
    alias?: string
    stars?: number
    // additional options
    metadata?: string
    revocable?: boolean
    // timestamps
    issuedUTC?: Date
    expiresUTC?: Date
    communityInfo?: Community
    // this are ONLY for a "claimable" credential 
    isClaimable?: boolean // true if is a claimable one 
    joined?: boolean // is already joined to the community
    startsUTC?: Date // when claiming this credentials can start
    endsUTC?: Date // when claiming this credentials ends
    available?: number // number of claimable credentials of this type
}