export type { Member }

export interface ActionMenu {
  name: string;
  action: string
  role?: number
}

export const SET_ADMIN_ROLE_MENU:ActionMenu = {name: 'Set as Admin', action: 'set_admin'}
export const UNSET_ADMIN_ROLE_MENU:ActionMenu = { name: 'Unset as Admin', action: 'unset_admin'}
const SET_MEMBER_ROLE_MENU:ActionMenu = { name: 'Set as Member', action: 'set_member', role: 1}
const SET_VALIDATOR_ROLE_MENU:ActionMenu = { name: 'Set as Validator', action: 'set_validator', role: 2}
const SET_AUDITOR_ROLE_MENU:ActionMenu = { name: 'Set as Auditor', action: 'set_auditor', role: 3}


export const ACTIONS_MENU:any = {
  "0": [SET_MEMBER_ROLE_MENU],
  "1": [SET_VALIDATOR_ROLE_MENU,SET_AUDITOR_ROLE_MENU],
  "2" : [SET_MEMBER_ROLE_MENU, SET_AUDITOR_ROLE_MENU],
  "3": [SET_MEMBER_ROLE_MENU, SET_VALIDATOR_ROLE_MENU]
}

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
