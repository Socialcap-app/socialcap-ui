export type { Member }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Roles: any = {
  "0": 'INITIAL',
  "1": 'PLAIN',
  "2": 'VALIDATOR',
  "3": 'AUDITOR'
}

interface Member {
    uid: string
    communityUid: string;
    personUid: string;
    fullName: string;
    role: string;     // TODO: ask about this undefined
    roleDescr?: string; 
    isAdmin?: boolean;
    accountId?: string
    createdUTC?: Date
    approvedUTC?: Date
}
