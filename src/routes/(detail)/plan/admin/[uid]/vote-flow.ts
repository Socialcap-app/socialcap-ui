

export enum StepState {
  PENDING = 0,
  ONGOING = 1,
  COMPLETED = 2
}

export type Step = {
  action: string,
  description: string,
  buttonText: string
}
