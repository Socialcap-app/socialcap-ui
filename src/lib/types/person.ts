export type { Person }

interface Person {
    uid: string
    fullName: string
    email: string
    createdUTC: Date
    approvedUTC: Date
    updatedUTC: Date
    accountId?: string
    state?: string
    description?: string
    image?: string
    phone?: string
    telegram?: string
    preferences?: string
    identityHash?: string
}