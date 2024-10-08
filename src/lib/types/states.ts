export type StateValue = 0 | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 19 | 20 | 21 | 32 | 99;

export type State = {
    name: string
    value: StateValue,
    badgeType?: "info" | "success" | "danger" | "warning"
}

export type CommunityState =  "INITIAL" | "APPROVED" | "PAUSED" | "REJECTED";
export const CommunityStates = {
    Revision: "INITIAL",
    Approved: "APPROVED",
    Paused: "PAUSED",
    Rejected: "REJECTED"
}

export const 
  NONE =  0,
  DRAFT = 1,
  CANCELLED = 2,
  REVISION = 3,
  CLAIMED = 4,
  VOTING =  6,  
  ASSIGNED = 7,
  ACTIVE = 8,
  WAITING = 9,
  DONE = 10,
  IGNORED = 11,
  UNPAID = 12,
  REJECTED = 19,
  APPROVED = 20,
  TALLYING = 21,
  ISSUING = 32,
  UNKNOWN = 99;

export const ALL_STATES = {
    0: "NONE",
    1: "DRAFT",
    2: "CANCELED",
    3: "REVISION",
    4: "CLAIMED",
    6: "VOTING",
    7: "ASSIGNED",
    8: "ACTIVE",
    9: "WAITING",
    10: "DONE",
    11: "IGNORED",
    12: "UNPAID",
    13: "FAILED",
    19: "REJECTED",
    20: "APPROVED",
    21: "TALLYING",
    32: "ISSUING",
    99: "UNKNOWN"
}

export const 
    CLAIMING_TEXT = "Claiming",
    ASSIGNING_TEXT = "Assigning",
    ISSUING_TEXT  = "Issuing",
    TALLYING_TEXT = "Tallying",
    VOTING_TEXT = "Voting";

export enum StepState {
    PENDING = 0,
    ONGOING = 1,
    COMPLETED = 2
}
      
export type Step = {
    action: string,
    description: string,
    buttonText: string,
    handler?: () => void
}

export const States: State[] = [
    {
        name: 'None',
        value: 0,
        badgeType: "info"
    },  
    {
        name: 'Draft',
        value: 1,
        badgeType: "info"
    },
    {
        name: 'Cancelled',
        value: 2,
        badgeType: "danger"
    },
    {
        name: 'Revision',
        value: 3,
        badgeType: "info"
    },
    {
        name: 'Claimed',
        value: 4,
        badgeType: "success"
    },
    {
        name: 'Voting',
        value: 6,
        badgeType: "info"
    },
    {
        name: 'Assigned',
        value: 7,
        badgeType: "warning"
    },
    {
        name: 'Active',
        value: 8,
        badgeType: "success"
    },
    {
        name: 'Waiting',
        value: 9,
        badgeType: "info"
    }, 
    {
        name: 'Done',
        value: 10,
        badgeType: "success"
    },
    {
        name: 'Ignored',
        value: 11,
        badgeType: "danger"
    },
    {
        name: 'Unpaid',
        value: 12,
        badgeType: "danger"
    },
    {
        name: "Failed",
        value: 13,
        badgeType: "danger"
    },
    {
        name: 'Rejected',
        value: 19,
        badgeType: "danger"
    },
    {
        name: 'Approved',
        value: 20 ,
        badgeType: "success"
    },
    {
        name: "Tallying",
        value: 21,
        badgeType: "info"
    },
    {
        name: "Unknown",
        value: 99,
        badgeType: "info"
    }
]

export const PlanStates: State[] = [
    {
        name: 'Draft',
        value: 1,
        badgeType: "info"
    },
    {
        name: 'Active',
        value: 8,
        badgeType: "success"
    },
    {
        name: 'Paused',
        value: 9,
        badgeType: "warning"
    }, 
    {
        name: 'Inactive',
        value: 10,
        badgeType: "danger"
    },

]

// Find a state givien its text
export function findState(t: string): number {
  for (let j=0; j < States.length; j++) 
    if (States[j].name.toUpperCase() === t.toUpperCase()) 
      return States[j].value;
  return States[0].value;
}

export function toState(state: number) {
    return States.find(s => s.value === state)
}